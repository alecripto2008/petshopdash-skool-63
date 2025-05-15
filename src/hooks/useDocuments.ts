import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Document type definition with updated type for metadata
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
        console.error('Erro ao buscar documentos:', error);
        toast({
          title: "Erro ao carregar documentos",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Documentos recuperados:', data);

      // Transform the data to match our Document interface with proper type handling
      const formattedDocs: Document[] = data.map((doc) => {
        // Use titulo from the database if available, otherwise generate a name
        const documentName = doc.titulo || `Documento ${doc.id}`;
        
        // Parse metadata if it's a string
        let parsedMetadata = null;
        try {
          parsedMetadata = typeof doc.metadata === 'string' 
            ? JSON.parse(doc.metadata) 
            : doc.metadata;
        } catch (e) {
          parsedMetadata = null;
        }
        
        // Create Document object with available fields and safe access
        return {
          id: doc.id,
          name: documentName,
          type: parsedMetadata && typeof parsedMetadata === 'object' ? getMetadataValue(parsedMetadata, 'type', 'unknown') : 'unknown',
          size: parsedMetadata && typeof parsedMetadata === 'object' ? getMetadataValue(parsedMetadata, 'size', 'Unknown') : 'Unknown',
          category: parsedMetadata && typeof parsedMetadata === 'object' ? getMetadataValue(parsedMetadata, 'category', 'Sem categoria') : 'Sem categoria',
          // Use current date as fallback since there's no created_at field
          uploadedAt: new Date().toLocaleDateString('pt-BR'),
          titulo: doc.titulo,
          metadata: parsedMetadata,
        };
      });

      // Filter out duplicates based on the titulo field
      const uniqueDocs = filterUniqueByTitle(formattedDocs);
      
      setDocuments(uniqueDocs);
    } catch (err) {
      console.error('Erro inesperado ao buscar documentos:', err);
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
      console.error('Erro inesperado ao excluir documento:', err);
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
      console.error('Erro inesperado ao limpar base de conhecimento:', err);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível limpar a base de conhecimento.",
        variant: "destructive",
      });
    }
  };

  // IMPROVED: Format proper content and metadata with correct structure
  const formatContentAndMetadata = (text: string, file: File, category: string) => {
    // Prepare the proper metadata format with the EXACT structure requested
    const metadata = {
      loc: {
        lines: {
          from: 1,
          to: text ? Math.min(text.split('\n').length, 100) : 1
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

  // Improved text extraction from files
  const extractTextFromFile = async (file: File): Promise<string> => {
    console.log('Extraindo texto do arquivo:', file.name, 'tipo:', file.type);
    
    // For PDF files: simply extract basic info if can't read content
    if (file.type === 'application/pdf') {
      return `Documento PDF: ${file.name}`;
    }

    // For text files: read as text
    if (file.type.includes('text') || 
        file.name.endsWith('.txt') || 
        file.name.endsWith('.md')) {
      try {
        const text = await file.text();
        return text || `Conteúdo do arquivo texto: ${file.name}`;
      } catch (e) {
        console.error('Erro ao ler arquivo de texto:', e);
        return `Conteúdo do arquivo texto: ${file.name}`;
      }
    }

    // For Office documents: extract basic info
    if (file.type.includes('office') || file.type.includes('document') ||
        file.name.endsWith('.doc') || file.name.endsWith('.docx') || 
        file.name.endsWith('.xls') || file.name.endsWith('.xlsx') ||
        file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
      return `Documento de escritório: ${file.name} (Tipo: ${file.type})`;
    }

    // Default for all other file types
    return `Arquivo: ${file.name} (Tipo: ${file.type})`;
  };

  // Sanitize text to remove problematic characters
  const sanitizeTextContent = (text: string): string => {
    if (!text) return '';
    
    try {
      // Remove null bytes, control characters and other problematic Unicode sequences
      return text
        .replace(/\0/g, '') // Remove null bytes
        .replace(/\\u0000/g, '') // Remove escaped null bytes
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/\\u[0-9a-fA-F]{4}/g, '') // Remove Unicode escape sequences
        .replace(/[^\x20-\x7E\xA0-\xFF\u0100-\uFFFF]/g, ' '); // Replace other non-standard chars with spaces
    } catch (e) {
      console.error('Error sanitizing content:', e);
      return `Erro ao processar o conteúdo`;
    }
  };

  // Upload file to Supabase - IMPROVED VERSION
  const uploadFileToWebhook = async (file: File, category: string) => {
    try {
      console.log('Enviando arquivo:', file.name, 'categoria:', category);
      
      // IMPROVED: Better text extraction from various file types
      const fileContent = await extractTextFromFile(file);
      const sanitizedContent = sanitizeTextContent(fileContent);
      
      console.log('Conteúdo extraído e sanitizado, tamanho:', sanitizedContent.length);
      
      // Format content and metadata properly with the exact required structure
      const { content, metadata } = formatContentAndMetadata(sanitizedContent, file, category);
      
      console.log('Metadata formatado:', metadata);
      
      // Prepare insertion data
      const insertData = {
        titulo: category || file.name, // Use category as the title
        content: content,
        metadata: metadata // Using the correctly structured metadata
      };
      
      console.log('Enviando para o Supabase:', insertData);
      
      // Insert document into Supabase
      const { data, error } = await supabase
        .from('documents')
        .insert(insertData)
        .select();
        
      if (error) {
        console.error('Erro ao salvar documento:', error);
        toast({
          title: "Erro ao salvar documento",
          description: "Não foi possível salvar o documento no banco de dados: " + error.message,
          variant: "destructive",
        });
        return false;
      }
      
      console.log('Documento salvo com sucesso:', data);
      
      // Update the documents list with the new document
      if (data && data.length > 0) {
        // Create a new document with the correct metadata format
        const newDoc: Document = {
          id: data[0].id,
          name: category || file.name,
          type: file.type || "unknown",
          size: `${(file.size / 1024).toFixed(0)} KB`,
          category: category || "Sem categoria",
          uploadedAt: new Date().toLocaleDateString('pt-BR'),
          titulo: category || file.name,
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
