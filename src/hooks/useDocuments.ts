
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { WEBHOOK_IDENTIFIERS } from '@/types/webhook';

// Document type definition
export interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  category: string;
  titulo?: string | null;
  metadata?: Record<string, any> | null;
}

export const useDocuments = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Safe way to extract values from metadata
  const getMetadataValue = (metadata: any, key: string, defaultValue: string): string => {
    if (typeof metadata === 'object' && metadata !== null && key in metadata) {
      return String(metadata[key]) || defaultValue;
    }
    return defaultValue;
  };

  // Fetch documents from Supabase
  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*');

      if (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: "Erro ao carregar documentos",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Transform the data to match our Document interface
      const formattedDocs: Document[] = data.map((doc, index) => {
        // Use titulo from the database if available, otherwise generate a name
        const documentName = doc.titulo || `Documento ${index + 1}`;
        
        // Create Document object with available fields
        return {
          id: doc.id,
          name: documentName,
          type: doc.metadata?.type || 'unknown',
          size: doc.metadata?.size || 'Unknown',
          category: doc.metadata?.category || 'Sem categoria',
          uploadedAt: doc.created_at ? new Date(doc.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          titulo: doc.titulo,
          metadata: doc.metadata,
        };
      });

      // Filter out duplicates based on the titulo field
      const uniqueDocs = filterUniqueByTitle(formattedDocs);
      
      setDocuments(uniqueDocs);
    } catch (err) {
      console.error('Unexpected error fetching documents:', err);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível carregar os documentos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Filter documents to keep only unique titulo entries
  const filterUniqueByTitle = (docs: Document[]): Document[] => {
    const uniqueTitles = new Set<string>();
    return docs.filter(doc => {
      const title = doc.titulo || doc.name;
      if (uniqueTitles.has(title)) {
        return false;
      }
      uniqueTitles.add(title);
      return true;
    });
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDocuments();
    toast({
      title: "Atualizando documentos",
      description: "Os documentos estão sendo atualizados do banco de dados.",
    });
  };

  // Delete document function
  const handleDeleteDocument = async (id: number, title: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setDocuments(documents.filter(doc => doc.id !== id));
      
      toast({
        title: "Documento excluído",
        description: "O documento foi removido com sucesso!",
        variant: "default",
      });
    } catch (err) {
      console.error('Unexpected error deleting document:', err);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível excluir o documento.",
        variant: "destructive",
      });
    }
  };

  // Clear all documents
  const clearAllDocuments = async () => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .neq('id', 0); // Delete all documents
        
      if (error) {
        throw error;
      }
      
      setDocuments([]);
      
      toast({
        title: "Base de conhecimento limpa",
        description: "Todos os documentos foram removidos!",
        variant: "default",
      });
    } catch (err) {
      console.error('Unexpected error clearing knowledge base:', err);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível limpar a base de conhecimento.",
        variant: "destructive",
      });
    }
  };

  // Upload file to Supabase
  const uploadFileToWebhook = async (file: File, category: string) => {
    try {
      // Create a simplified file reader to extract text content
      const fileContent = await readFileAsText(file);
      
      // Prepare metadata
      const metadata = {
        category: category,
        fileName: file.name,
        fileType: file.type,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        uploadDate: new Date().toISOString()
      };
      
      // Insert document into Supabase
      const { data, error } = await supabase
        .from('documents')
        .insert({
          titulo: file.name,
          content: fileContent?.substring(0, 10000) || 'No content extracted', // Limit content length
          metadata: metadata
        })
        .select();
        
      if (error) {
        console.error('Error saving document:', error);
        toast({
          title: "Erro ao salvar documento",
          description: "Não foi possível salvar o documento no banco de dados.",
          variant: "destructive",
        });
        return false;
      }
      
      // Update the documents list with the new document
      if (data && data.length > 0) {
        const newDoc: Document = {
          id: data[0].id,
          name: file.name,
          type: file.type,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          category: category,
          uploadedAt: new Date().toISOString().split('T')[0],
          titulo: file.name,
          metadata: metadata
        };
        
        setDocuments(prev => [newDoc, ...prev]);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error);
      
      toast({
        title: "Erro ao enviar documento",
        description: "Não foi possível enviar o documento para o sistema de conhecimento.",
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  // Helper function to read file content
  const readFileAsText = async (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      if (file.type.includes('text') || file.type.includes('pdf') || 
          file.type.includes('document') || file.name.endsWith('.txt') || 
          file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(null);
        reader.readAsText(file);
      } else {
        // For non-text files, just return the filename
        resolve(`File: ${file.name}`);
      }
    });
  };

  // Load documents on hook initialization
  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    isLoading,
    isRefreshing,
    fetchDocuments,
    handleRefresh,
    handleDeleteDocument,
    uploadFileToWebhook,
    clearAllDocuments
  };
};
