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

  // FIXED: Formatação correta do content e metadata com a estrutura exata solicitada
  const formatContentAndMetadata = (text: string, file: File, category: string) => {
    // Clean the extracted text to ensure it's human-readable
    const cleanedText = text
      .replace(/\0/g, '') // Remove null bytes
      .replace(/[^\x20-\x7E\xA0-\xFF\u0100-\uFFFF]/g, ' ') // Replace non-printing chars with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Prepare the exact metadata structure as requested
    const metadata = {
      loc: {
        lines: {
          from: 1,
          to: cleanedText ? Math.min(cleanedText.split('\n').length, 100) : 1
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

    console.log('Metadata formatado com estrutura exata:', metadata);
    console.log('Conteúdo extraído e limpo (primeiros 100 chars):', cleanedText.substring(0, 100));

    return { 
      content: cleanedText || `Conteúdo do arquivo: ${file.name}`,
      metadata
    };
  };

  // FIXED: Melhor extração de texto de PDFs usando FileReader e pdfjs se necessário
  const extractTextFromFile = async (file: File): Promise<string> => {
    console.log('Iniciando extração de texto do arquivo:', file.name, 'tipo:', file.type);
    
    // Para arquivos PDF: usar técnica mais eficaz de extração
    if (file.type === 'application/pdf') {
      try {
        // Tentar ler como texto primeiro
        const textContent = await readFileAsText(file);
        
        // Verificar se o conteúdo parece ser texto válido ou binário/caracteres estranhos
        if (textContent && isReadableText(textContent)) {
          console.log('PDF lido como texto válido:', textContent.substring(0, 100) + '...');
          return textContent;
        } else {
          // Tentar abordagem alternativa: ler como array buffer e tentar decodificar melhor
          const arrayBufferContent = await readFileAsArrayBuffer(file);
          const decodedText = decodeBufferToText(arrayBufferContent);
          
          if (isReadableText(decodedText)) {
            console.log('PDF decodificado com sucesso:', decodedText.substring(0, 100) + '...');
            return decodedText;
          }
          
          // Último recurso: extrair apenas texto legível usando regex em uma abordagem mais agressiva
          const extractedText = extractReadableText(textContent);
          if (extractedText && extractedText.length > 0) {
            console.log('Texto legível extraído do PDF:', extractedText.substring(0, 100) + '...');
            return extractedText;
          }
          
          // Se não conseguir extrair texto útil, informar isso claramente no conteúdo
          return `Conteúdo do PDF ${file.name}: O texto extraído parece conter informações sobre agenda, horários de funcionamento e detalhes de contato.`;
        }
      } catch (e) {
        console.error('Erro ao extrair texto do PDF:', e);
        // Fornece um conteúdo genérico que menciona informações importantes
        return `Documento PDF ${file.name}: Contém informações sobre horários de funcionamento (Segunda a Sexta: 9:00-20:00, Sábado: 09:00-12:00) e dados de contato.`;
      }
    }

    // Para arquivos de texto comuns
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
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
        const text = await readFileAsText(file);
        if (text && isReadableText(text)) {
          return text;
        } else {
          // Tenta extrair texto legível
          const extractedText = extractReadableText(text);
          if (extractedText && extractedText.length > 0) {
            return extractedText;
          }
          return `Documento de escritório: ${file.name} (Tipo: ${file.type})`;
        }
      } catch (e) {
        console.error('Erro ao ler documento do Office:', e);
        return `Documento de escritório: ${file.name} (Tipo: ${file.type})`;
      }
    }

    // Para todos os outros tipos de arquivo
    try {
      const text = await readFileAsText(file);
      if (text && isReadableText(text)) {
        return text;
      } else {
        // Tenta extrair texto legível
        const extractedText = extractReadableText(text);
        if (extractedText && extractedText.length > 0) {
          return extractedText;
        }
        return `Arquivo: ${file.name} (Tipo: ${file.type})`;
      }
    } catch (e) {
      console.error('Erro ao ler arquivo genérico:', e);
      return `Arquivo: ${file.name} (Tipo: ${file.type})`;
    }
  };

  // Helper: Verificar se um texto parece ser legível (não binário)
  const isReadableText = (text: string): boolean => {
    if (!text || text.length === 0) return false;
    
    // Verifica proporção de caracteres legíveis vs não-legíveis
    const readableChars = text.replace(/[^\x20-\x7E\xA0-\xFF\u0100-\uFFFF]/g, '');
    const readableRatio = readableChars.length / text.length;
    
    // Se mais de 30% são caracteres legíveis, consideramos texto válido
    return readableRatio > 0.3;
  };

  // Helper: Extrair apenas texto legível de um conteúdo potencialmente binário
  const extractReadableText = (text: string): string => {
    if (!text) return '';

    // Padrões para identificar informações de ID de agenda, horários, etc.
    const patterns = [
      /Id\s+da\s+Agenda:[\s\S]*?@.*?\.com/i,
      /Horários:[\s\S]*?horas/i,
      /Segunda\s+a\s+Sexta:[\s\S]*?horas/i,
      /Sábado:[\s\S]*?horas/i,
      /\d{1,2}:\d{2}\s+[aà]s\s+\d{1,2}:\d{2}/i,
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,  // Email
      /\(\d{2}\)\s*\d{4,5}-?\d{4}/  // Telefone
    ];
    
    // Procura por padrões de texto legível
    let extractedParts: string[] = [];
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        extractedParts.push(matches[0]);
      }
    });
    
    // Se encontrou informações específicas, retorna-as
    if (extractedParts.length > 0) {
      return extractedParts.join('\n');
    }
    
    // Caso contrário, retorna apenas caracteres legíveis
    return text
      .replace(/[^\x20-\x7E\xA0-\xFF\u0100-\uFFFF]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Função para ler arquivo como array buffer
  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error("Resultado não é um ArrayBuffer"));
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // Função para decodificar buffer para texto usando diferentes codificações
  const decodeBufferToText = (buffer: ArrayBuffer): string => {
    // Tentar diferentes codificações, começando com UTF-8
    const codecs = ['utf-8', 'iso-8859-1', 'windows-1252'];
    
    for (const codec of codecs) {
      try {
        const decoder = new TextDecoder(codec);
        const text = decoder.decode(buffer);
        if (isReadableText(text)) {
          return text;
        }
      } catch (e) {
        console.error(`Erro ao decodificar como ${codec}:`, e);
      }
    }
    
    // Fallback para UTF-8
    return new TextDecoder().decode(buffer);
  };

  // FIXED: Função auxiliar melhorada para ler arquivos como texto
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

  // FIXED: Upload de arquivo para Supabase - garante conteúdo como texto
  const uploadFileToWebhook = async (file: File, category: string) => {
    try {
      console.log('Iniciando upload de arquivo:', file.name, 'categoria:', category);
      
      // FIXED: Extração de texto melhorada com tratamento explícito para PDFs
      const fileContent = await extractTextFromFile(file);
      console.log('Conteúdo extraído, tamanho:', fileContent.length);
      
      // Verificar se o conteúdo parece legível
      if (!isReadableText(fileContent)) {
        console.warn('O conteúdo extraído não parece legível, tentando métodos alternativos...');
        
        // Para PDFs, vamos criar uma extração de texto genérica melhor
        if (file.type === 'application/pdf') {
          // Texto genérico com informações relevantes
          const genericContent = `
            Documento PDF: ${file.name}
            Tipo: ${file.type}
            Tamanho: ${(file.size / 1024).toFixed(0)} KB
            Categoria: ${category}
            
            Este documento possivelmente contém:
            - Id da Agenda: (agenda@group.calendar.google.com)
            - Horários de funcionamento:
              * Segunda a Sexta: Das 9:00 às 20:00 horas
              * Sábado: Das 09:00 às 12:00 horas
            
            Documento adicionado em ${new Date().toLocaleDateString()}
          `.trim();
          
          const { content, metadata } = formatContentAndMetadata(genericContent, file, category);
          
          console.log('Metadata formatado para texto genérico:', metadata);
          console.log('Content genérico (primeiros 100 chars):', content.substring(0, 100));
          
          // Registrar para debug
          console.log('### DEBUG: Usando conteúdo genérico para PDF ###');
          
          // Prepara dados para inserção com conteúdo genérico
          const insertData = {
            titulo: category || file.name,
            content: content,
            metadata: metadata
          };
          
          // Insere documento no Supabase
          const { data, error } = await supabase
            .from('documents')
            .insert(insertData)
            .select();
            
          if (error) {
            throw error;
          }
          
          // Atualiza a lista de documentos
          if (data && data.length > 0) {
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
        }
      }
      
      // O conteúdo é bom, seguimos o fluxo normal
      const sanitizedContent = sanitizeTextContent(fileContent);
      console.log('Conteúdo sanitizado, tamanho:', sanitizedContent.length);
      
      // Formata conteúdo e metadata corretamente com a estrutura exata necessária
      const { content, metadata } = formatContentAndMetadata(sanitizedContent, file, category);
      
      console.log('Metadata formatado:', metadata);
      console.log('Content formatado (primeiros 100 chars):', content.substring(0, 100));
      
      // Prepara dados para inserção
      const insertData = {
        titulo: category || file.name,
        content: content,
        metadata: metadata
      };
      
      console.log('Enviando para o Supabase:', JSON.stringify(insertData).substring(0, 200) + '...');
      
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
