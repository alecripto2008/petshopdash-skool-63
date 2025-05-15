
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

  // CORRIGIDO: Formatação correta do content e metadata com a estrutura exata solicitada
  const formatContentAndMetadata = (text: string, file: File, category: string) => {
    // Prepara o metadata com a estrutura EXATA solicitada
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

  // CORRIGIDO: Extração melhorada de texto de arquivos PDF e outros tipos
  const extractTextFromFile = async (file: File): Promise<string> => {
    console.log('Extraindo texto do arquivo:', file.name, 'tipo:', file.type);
    
    // Para arquivos PDF: extrair informações básicas
    if (file.type === 'application/pdf') {
      try {
        // Tenta ler o conteúdo como texto
        const text = await readFileAsText(file);
        if (text && text.length > 0) {
          console.log('Texto extraído do PDF:', text.substring(0, 100) + '...');
          return text;
        } else {
          return `Documento PDF: ${file.name} (Texto extraído não disponível)`;
        }
      } catch (e) {
        console.error('Erro ao ler PDF como texto:', e);
        return `Documento PDF: ${file.name} - O conteúdo não pôde ser extraído como texto`;
      }
    }

    // Para arquivos de texto: ler como texto
    if (file.type.includes('text') || 
        file.name.endsWith('.txt') || 
        file.name.endsWith('.md')) {
      try {
        const text = await readFileAsText(file);
        return text || `Conteúdo do arquivo texto: ${file.name}`;
      } catch (e) {
        console.error('Erro ao ler arquivo de texto:', e);
        return `Conteúdo do arquivo texto: ${file.name} (Não foi possível ler o conteúdo)`;
      }
    }

    // Para documentos do Office: extrair informações básicas e tentar ler como texto
    if (file.type.includes('office') || file.type.includes('document') ||
        file.name.endsWith('.doc') || file.name.endsWith('.docx') || 
        file.name.endsWith('.xls') || file.name.endsWith('.xlsx') ||
        file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
      try {
        // Tenta ler o conteúdo como texto
        const text = await readFileAsText(file);
        if (text && text.length > 0) {
          return text;
        } else {
          return `Documento de escritório: ${file.name} (Tipo: ${file.type})`;
        }
      } catch (e) {
        console.error('Erro ao ler documento do Office como texto:', e);
        return `Documento de escritório: ${file.name} (Tipo: ${file.type})`;
      }
    }

    // Para todos os outros tipos de arquivo
    try {
      const text = await readFileAsText(file);
      if (text && text.length > 0) {
        return text;
      } else {
        return `Arquivo: ${file.name} (Tipo: ${file.type})`;
      }
    } catch (e) {
      console.error('Erro ao ler arquivo genérico como texto:', e);
      return `Arquivo: ${file.name} (Tipo: ${file.type})`;
    }
  };

  // ADICIONADO: Função auxiliar para tentar ler qualquer arquivo como texto
  const readFileAsText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          if (typeof result === 'string') {
            resolve(result);
          } else {
            // Se não for string, converter ArrayBuffer para string
            if (result instanceof ArrayBuffer) {
              const textDecoder = new TextDecoder('utf-8');
              resolve(textDecoder.decode(result));
            } else {
              resolve('');
            }
          }
        } catch (e) {
          console.error('Erro ao processar resultado de leitura:', e);
          resolve('');
        }
      };
      
      reader.onerror = (error) => {
        console.error('Erro na leitura do arquivo:', error);
        reject(error);
      };
      
      try {
        reader.readAsText(file);
      } catch (e) {
        console.error('Exceção ao tentar ler como texto:', e);
        reject(e);
      }
    });
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

  // CORRIGIDO: Upload de arquivo para Supabase - garante conteúdo como texto
  const uploadFileToWebhook = async (file: File, category: string) => {
    try {
      console.log('Enviando arquivo:', file.name, 'categoria:', category);
      
      // CORRIGIDO: Melhor extração de texto de vários tipos de arquivo
      const fileContent = await extractTextFromFile(file);
      console.log('Conteúdo extraído, tamanho:', fileContent.length);
      
      const sanitizedContent = sanitizeTextContent(fileContent);
      console.log('Conteúdo sanitizado, tamanho:', sanitizedContent.length);
      
      // Formata conteúdo e metadata corretamente com a estrutura exata necessária
      const { content, metadata } = formatContentAndMetadata(sanitizedContent, file, category);
      
      console.log('Metadata formatado:', metadata);
      console.log('Content formatado (primeiros 100 chars):', content.substring(0, 100));
      
      // Prepara dados para inserção
      const insertData = {
        titulo: category || file.name, // Usa a categoria como título
        content: content, // Usando o conteúdo como texto, não como PDF binário
        metadata: metadata // Usando o metadata corretamente estruturado
      };
      
      console.log('Enviando para o Supabase:', insertData);
      
      // Insere documento no Supabase
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
      
      // Atualiza a lista de documentos com o novo documento
      if (data && data.length > 0) {
        // Cria um novo documento com o formato correto de metadata
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
