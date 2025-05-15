
import React from 'react';
import { Database, FileText, FileX } from 'lucide-react';
import DocumentCard from './DocumentCard';
import { Button } from '@/components/ui/button';

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  category: string;
  titulo?: string | null;
  metadata?: Record<string, any> | null;
}

interface DocumentGridProps {
  documents: Document[];
  searchQuery: string;
  onDeleteDocument: (id: number, title: string) => void;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ 
  documents, 
  searchQuery, 
  onDeleteDocument 
}) => {
  // Filter documents based on search query, focusing on the titulo field
  const filteredDocuments = documents.filter(doc => {
    const title = doc.titulo || doc.name;
    const category = doc.category;
    
    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (documents.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <Database className="h-16 w-16 mb-4 opacity-30" />
        <h3 className="text-lg font-medium mb-1">Nenhum documento encontrado</h3>
        <p className="text-sm mb-4">
          Comece adicionando documentos à sua base de conhecimento.
        </p>
      </div>
    );
  }

  if (filteredDocuments.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <FileX className="h-16 w-16 mb-4 opacity-30" />
        <h3 className="text-lg font-medium mb-1">Nenhum resultado para "{searchQuery}"</h3>
        <p className="text-sm mb-4">
          Tente usar termos diferentes na sua pesquisa.
        </p>
        <Button variant="outline" onClick={() => document.getElementById('search-input')?.focus()}>
          Limpar pesquisa
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">
          {filteredDocuments.length} {filteredDocuments.length === 1 ? 'documento' : 'documentos'} encontrados
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <DocumentCard 
            key={doc.id} 
            document={doc} 
            onDelete={onDeleteDocument}
          />
        ))}
      </div>
    </div>
  );
};

export default DocumentGrid;
