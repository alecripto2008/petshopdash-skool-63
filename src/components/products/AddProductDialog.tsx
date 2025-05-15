
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileUp, Upload, Loader2, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

const formSchema = z.object({
  category: z.string().min(1, 'Categoria (título) é obrigatória'),
  file: z
    .any()
    .refine((files) => files?.[0], 'Arquivo é obrigatório.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Tamanho máximo do arquivo é 5MB.`)
    .refine(
      (files) => ALLOWED_FILE_TYPES.includes(files?.[0]?.type),
      'Tipo de arquivo inválido. Selecione PDF, DOC, DOCX, XLS, XLSX, PPT ou PPTX.'
    ),
});

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddProductDialog = ({ open, onOpenChange, onSuccess }: AddProductDialogProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      file: undefined,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue('file', event.target.files, { shouldValidate: true });
    } else {
      setSelectedFile(null);
      form.setValue('file', undefined, { shouldValidate: true });
    }
  };

  // Sanitize file names and paths to remove problematic characters
  const sanitizeFileName = (fileName: string): string => {
    return fileName
      .replace(/[^\w\s.-]/g, '') // Remove special characters except dots, dashes, and underscores
      .replace(/\s+/g, '_'); // Replace spaces with underscores
  };

  // Function to sanitize text content to remove problematic Unicode characters
  const sanitizeTextContent = (text: string): string => {
    if (!text) return '';
    
    // Remove null bytes, control characters and other problematic Unicode sequences
    return text
      .replace(/\0/g, '') // Remove null bytes
      .replace(/\\u0000/g, '') // Remove escaped null bytes
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .replace(/\\u[0-9a-fA-F]{4}/g, '') // Remove Unicode escape sequences
      .replace(/[^\x20-\x7E\xA0-\xFF\u0100-\uFFFF]/g, ' '); // Replace other non-standard chars with spaces
  };

  // Read file content with better error handling
  const readFileAsText = async (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      try {
        // Handle different file types
        if (file.type.includes('text') || file.type.includes('pdf') || 
            file.type.includes('document') || file.name.endsWith('.txt') || 
            file.name.endsWith('.md')) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              // Ensure we're returning a string and not binary data
              const result = typeof reader.result === 'string' ? reader.result : '';
              resolve(result);
            } catch (e) {
              console.error('Error processing file content:', e);
              resolve(`Nome do arquivo: ${file.name}`); // Fallback to just the filename
            }
          };
          reader.onerror = (e) => {
            console.error('FileReader error:', e);
            resolve(`Nome do arquivo: ${file.name}`);
          };
          
          // Use readAsText for text files
          reader.readAsText(file);
        } else {
          // For non-text files, just return the filename
          resolve(`Nome do arquivo: ${file.name}`);
        }
      } catch (e) {
        console.error('Exception in readFileAsText:', e);
        resolve(`Nome do arquivo: ${file.name}`);
      }
    });
  };

  // Format proper content and metadata with correct structure
  const formatContentAndMetadata = (text: string, file: File, category: string) => {
    // Prepare the proper metadata format with the exact structure requested
    const metadata = {
      loc: {
        lines: {
          from: 30,
          to: 38
        }
      },
      source: "blob",
      blobType: file.type || "text/plain",
      category: category,
      fileName: file.name,
      size: `${(file.size / 1024).toFixed(0)} KB`,
      type: file.type || "unknown",
      uploadDate: new Date().toISOString()
    };

    return { 
      content: text || `Conteúdo do arquivo: ${file.name}`,
      metadata
    };
  };

  // Function to check and create bucket if it doesn't exist
  const ensureBucketExists = async (): Promise<boolean> => {
    try {
      // Check if the bucket exists
      const { data: buckets, error: checkError } = await supabase.storage.listBuckets();
      
      if (checkError) {
        console.error("Error checking buckets:", checkError);
        throw new Error(`Erro ao verificar buckets: ${checkError.message}`);
      }
      
      const bucketExists = buckets?.some(b => b.name === 'product-files');
      
      if (!bucketExists) {
        console.log('Bucket não encontrado, tentando criar...');
        
        const { error: createError } = await supabase.storage.createBucket('product-files', {
          public: true,
          fileSizeLimit: 52428800 // 50MB
        });
        
        if (createError) {
          console.error("Error creating bucket:", createError);
          throw new Error(`Erro ao criar bucket: ${createError.message}`);
        }
        
        console.log('Bucket criado com sucesso');
      }
      
      return true;
    } catch (error: any) {
      console.error("Error ensuring bucket exists:", error);
      return false;
    }
  };

  // Function to handle file upload with proper error handling
  const uploadFile = async (file: File, category: string): Promise<string> => {
    // First ensure the bucket exists
    const bucketExists = await ensureBucketExists();
    
    if (!bucketExists) {
      throw new Error("Não foi possível criar ou verificar o bucket de armazenamento");
    }
    
    const sanitizedFileName = sanitizeFileName(`${uuidv4()}-${file.name}`);
    const filePath = `${sanitizedFileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('product-files') 
      .upload(filePath, file);

    if (uploadError) {
      console.error("File upload error:", uploadError);
      throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
    }

    return filePath;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedFile) {
      toast({
        title: 'Nenhum arquivo selecionado',
        description: 'Por favor, selecione um arquivo para fazer upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    let uploadedFilePath: string | null = null;
    
    try {
      // Extract and sanitize file content as in the knowledge page
      const fileContent = await readFileAsText(selectedFile);
      const sanitizedContent = fileContent ? sanitizeTextContent(fileContent) : 'Sem conteúdo extraído';
      
      console.log('Conteúdo extraído e sanitizado, tamanho:', sanitizedContent.length);
      
      // Format content and metadata properly with the exact required structure
      const { content, metadata } = formatContentAndMetadata(sanitizedContent, selectedFile, values.category);
      
      console.log('Metadata formatado:', metadata);
      
      // Try to upload file
      try {
        uploadedFilePath = await uploadFile(selectedFile, values.category);
      } catch (error: any) {
        console.error("Upload error:", error);
        toast({
          title: 'Erro ao fazer upload do arquivo',
          description: error.message || 'Verifique se o bucket existe no Supabase',
          variant: 'destructive',
        });
      }
      
      // Save product metadata to database with sanitized content
      const { error: insertError } = await supabase.from('products').insert({
        titulo: values.category,
        content: content,
        metadata: metadata
      });

      if (insertError) {
        if (uploadedFilePath) {
          await supabase.storage.from('product-files').remove([uploadedFilePath]);
        }
        throw insertError;
      }

      toast({
        title: 'Produto adicionado com sucesso!',
        description: `O produto "${values.category}" foi cadastrado e o arquivo enviado para o armazenamento.`,
      });

      form.reset();
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onSuccess();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        title: 'Erro ao adicionar produto',
        description: error.message || 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
      
      // Cleanup on error
      if (uploadedFilePath) {
        await supabase.storage.from('product-files').remove([uploadedFilePath]);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        form.reset();
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
          <DialogDescription>
            Selecione um arquivo e defina uma categoria (título) para o novo produto.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arquivo do Produto</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="product-file-upload-revised"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      />
                      <label
                        htmlFor="product-file-upload-revised"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <FileUp className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Clique para selecionar ou arraste o arquivo aqui
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Máx 5MB)
                        </p>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                  {selectedFile && (
                    <Alert className="mt-2">
                      <FileText className="h-4 w-4" />
                      <AlertTitle>Arquivo selecionado</AlertTitle>
                      <AlertDescription>
                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                      </AlertDescription>
                    </Alert>
                  )}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria (Título do Produto)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ex: Equipamento de Tosa Profissional" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  form.reset(); 
                  setSelectedFile(null); 
                  if (fileInputRef.current) { fileInputRef.current.value = ''; }
                  onOpenChange(false);
                }}
                type="button"
                disabled={isUploading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={!form.formState.isValid || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Fazer Upload
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
