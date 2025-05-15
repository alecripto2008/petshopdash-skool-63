
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
    let uploadedFilePath: string | null = null; // Para rastrear o arquivo no storage
    try {
      const fileName = `${uuidv4()}-${selectedFile.name}`;
      const filePath = `product-files/${fileName}`;
      uploadedFilePath = filePath; // Salva o path para possível remoção em caso de erro

      // 1. Upload do selectedFile para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('product-files') 
        .upload(filePath, selectedFile);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Salvar na tabela 'products' do Supabase: APENAS o titulo (category)
      // A URL do arquivo NÃO será salva na tabela 'products'
      const { error: insertError } = await supabase.from('products').insert({
        titulo: values.category, // Usando 'category' do formulário como 'titulo'
        // file_url: fileUrl, // REMOVIDO - Não salvar a URL do arquivo na tabela
      });

      if (insertError) {
        // Se a inserção no DB falhou, remover o arquivo do storage que foi enviado
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
      // Se houve um erro após o upload bem-sucedido mas antes da inserção no DB (ou durante a inserção),
      // e o arquivo foi enviado, tentar removê-lo do storage
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
