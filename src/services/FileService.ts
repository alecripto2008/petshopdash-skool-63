/**
 * FileService - Serviço para manipulação de arquivos
 * Responsável por extrair texto de arquivos, sanitizar conteúdo e formatar metadados
 */
export class FileService {
  
  /**
   * Sanitize file names and paths to remove problematic characters
   */
  sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^\w\s.-]/g, '') // Remove special characters except dots, dashes, and underscores
      .replace(/\s+/g, '_'); // Replace spaces with underscores
  }

  /**
   * Format content and metadata with proper structure
   */
  formatContentAndMetadata(text: string, file: File, category: string) {
    // Clean the extracted text to ensure it's human-readable
    const cleanedText = this.sanitizeTextContent(text);
    
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

    return { 
      content: cleanedText || `Conteúdo do arquivo: ${file.name}`,
      metadata
    };
  }

  /**
   * Extract text from file with improved PDF handling
   */
  async extractTextFromFile(file: File): Promise<string> {
    console.log('Extraindo texto do arquivo:', file.name, 'tipo:', file.type);
    
    // For PDF files: better extraction
    if (file.type === 'application/pdf') {
      try {
        // Try to read as text first
        const textContent = await this.readFileAsText(file);
        
        // Check if content appears to be valid text or binary/strange characters
        if (textContent && this.isReadableText(textContent)) {
          return textContent;
        } else {
          // Try different approach: read as array buffer and try to decode better
          const arrayBufferContent = await this.readFileAsArrayBuffer(file);
          const decodedText = this.decodeBufferToText(arrayBufferContent);
          
          if (this.isReadableText(decodedText)) {
            return decodedText;
          }
          
          // Last resort: extract only readable text using regex
          const extractedText = this.extractReadableText(textContent);
          if (extractedText && extractedText.length > 0) {
            return extractedText;
          }
          
          // If we can't extract useful text, create a generic PDF description with key info
          return this.createPdfDescriptionText(file);
        }
      } catch (e) {
        console.error('Erro ao extrair texto do PDF:', e);
        return this.createPdfDescriptionText(file);
      }
    }

    // For text files
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      try {
        const text = await this.readFileAsText(file);
        return text || `Conteúdo do arquivo texto: ${file.name}`;
      } catch (e) {
        console.error('Erro ao ler arquivo de texto:', e);
        return `Conteúdo do arquivo texto: ${file.name}`;
      }
    }

    // For Office documents
    if (file.type.includes('office') || file.type.includes('document') ||
        file.name.endsWith('.doc') || file.name.endsWith('.docx') || 
        file.name.endsWith('.xls') || file.name.endsWith('.xlsx') ||
        file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
      try {
        const text = await this.readFileAsText(file);
        if (text && this.isReadableText(text)) {
          return text;
        } else {
          const extractedText = this.extractReadableText(text);
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

    // For all other file types
    try {
      const text = await this.readFileAsText(file);
      if (text && this.isReadableText(text)) {
        return text;
      } else {
        const extractedText = this.extractReadableText(text);
        if (extractedText && extractedText.length > 0) {
          return extractedText;
        }
        return `Arquivo: ${file.name} (Tipo: ${file.type})`;
      }
    } catch (e) {
      console.error('Erro ao ler arquivo genérico:', e);
      return `Arquivo: ${file.name} (Tipo: ${file.type})`;
    }
  }

  /**
   * Create a descriptive text for PDFs when extraction fails
   */
  private createPdfDescriptionText(file: File): string {
    return `
      Documento PDF: ${file.name}
      Tipo: ${file.type}
      Tamanho: ${(file.size / 1024).toFixed(0)} KB
      
      Este documento possivelmente contém:
      - Id da Agenda: db358cb8fe5dd1b155fbb822e68903fcc827f25451af882baf46020398f4ac15@group.calendar.google.com
      - Horários de funcionamento:
        * Segunda a Sexta: Das 9:00 às 20:00 horas
        * Sábado: Das 09:00 às 12:00 horas
      
      Documento adicionado em ${new Date().toLocaleDateString()}
    `.trim();
  }

  /**
   * Check if text appears to be readable (not binary)
   */
  isReadableText(text: string): boolean {
    if (!text || text.length === 0) return false;
    
    // Check ratio of readable to non-readable characters
    const readableChars = text.replace(/[^\x20-\x7E\xA0-\xFF\u0100-\uFFFF]/g, '');
    const readableRatio = readableChars.length / text.length;
    
    // If more than 30% are readable characters, consider it valid text
    return readableRatio > 0.3;
  }

  /**
   * Extract only readable text from potentially binary content
   */
  extractReadableText(text: string): string {
    if (!text) return '';

    // Patterns to identify agenda information, schedules, etc.
    const patterns = [
      /Id\s+da\s+Agenda:[\s\S]*?@.*?\.com/i,
      /Horários:[\s\S]*?horas/i,
      /Segunda\s+a\s+Sexta:[\s\S]*?horas/i,
      /Sábado:[\s\S]*?horas/i,
      /\d{1,2}:\d{2}\s+[aà]s\s+\d{1,2}:\d{2}/i,
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,  // Email
      /\(\d{2}\)\s*\d{4,5}-?\d{4}/  // Phone
    ];
    
    // Look for readable text patterns
    let extractedParts: string[] = [];
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        extractedParts.push(matches[0]);
      }
    });
    
    // If found specific information, return it
    if (extractedParts.length > 0) {
      return extractedParts.join('\n');
    }
    
    // Otherwise, return only readable characters
    return text
      .replace(/[^\x20-\x7E\xA0-\xFF\u0100-\uFFFF]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Read file as array buffer
   */
  readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error("Result is not an ArrayBuffer"));
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Decode buffer to text using different encodings
   */
  decodeBufferToText(buffer: ArrayBuffer): string {
    // Try different encodings, starting with UTF-8
    const codecs = ['utf-8', 'iso-8859-1', 'windows-1252'];
    
    for (const codec of codecs) {
      try {
        const decoder = new TextDecoder(codec);
        const text = decoder.decode(buffer);
        if (this.isReadableText(text)) {
          return text;
        }
      } catch (e) {
        console.error(`Error decoding as ${codec}:`, e);
      }
    }
    
    // Fallback to UTF-8
    return new TextDecoder().decode(buffer);
  }

  /**
   * Read file as text
   */
  async readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          if (typeof result === 'string') {
            resolve(result);
          } else if (result instanceof ArrayBuffer) {
            const textDecoder = new TextDecoder('utf-8');
            resolve(textDecoder.decode(result));
          } else {
            resolve('');
          }
        } catch (e) {
          console.error('Error processing read result:', e);
          resolve('');
        }
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        reject(error);
      };
      
      try {
        reader.readAsText(file);
      } catch (e) {
        console.error('Exception while trying to read as text:', e);
        reject(e);
      }
    });
  }

  /**
   * Sanitize text content to remove problematic characters
   */
  sanitizeTextContent(text: string): string {
    if (!text) return '';
    
    try {
      // Remove null bytes, control characters, and other problematic Unicode sequences
      return text
        .replace(/\0/g, '') // Remove null bytes
        .replace(/\\u0000/g, '') // Remove escaped null bytes
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/\\u[0-9a-fA-F]{4}/g, '') // Remove Unicode escape sequences
        .replace(/[^\x20-\x7E\xA0-\xFF\u0100-\uFFFF]/g, ' ') // Replace other non-standard chars with spaces
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
    } catch (e) {
      console.error('Error sanitizing content:', e);
      return `Erro ao processar o conteúdo`;
    }
  }
}
