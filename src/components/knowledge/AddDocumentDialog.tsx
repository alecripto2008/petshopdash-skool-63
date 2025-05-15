
import React, { useState } from 'react';
import { FileUp, Upload, Loader2, FileText } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  category: z.string().min(1, 'Categoria é obrigatória'),
  file: z.any().refine((file) => file instanceof File, {
    message: 'Arquivo é obrigatório',
  }),
});

interface AddDocumentDialogProps {
  onAddDocument: (file: File, category: string) => Promise<void>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddDocumentDialog: React.FC<AddDocumentDialogProps> = ({ 
  onAddDocument, 
  isOpen, 
  onOpenChange 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      file: undefined,
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      form.setValue('file', file);
    }
  };

  // Handle document upload
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedFile) {
      setIsUploading(true);
      try {
        await onAddDocument(selectedFile, values.category);
        setSelectedFile(null);
        form.reset();
        onOpenChange(false);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Documento</DialogTitle>
          <DialogDescription>
            Selecione um arquivo do seu computador para adicionar à base de conhecimento.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center mb-6">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <FileUp className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Clique para selecionar ou arraste o arquivo aqui
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
              </p>
            </label>
          </div>
          
          {selectedFile && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>Arquivo selecionado</AlertTitle>
              <AlertDescription>
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="ex: Procedimentos, Financeiro, Saúde..." 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  type="button"
                  disabled={isUploading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={!selectedFile || isUploading}
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
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentDialog;
