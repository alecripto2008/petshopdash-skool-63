
import React, { useState } from 'react';
import SearchBar from '@/components/knowledge/SearchBar';
import DocumentGrid from '@/components/knowledge/DocumentGrid';
import AddDocumentDialog from '@/components/knowledge/AddDocumentDialog';
import { useDocuments } from '@/hooks/useDocuments';
import { useToast } from '@/hooks/use-toast';

const KnowledgeContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const { toast } = useToast();
  
  const { 
    documents, 
    isLoading, 
    isRefreshing, 
    handleRefresh,
    handleDeleteDocument,
    uploadFileToWebhook,
    clearAllDocuments
  } = useDocuments();

  const handleAddDocument = async (file: File, category: string) => {
    try {
      const success = await uploadFileToWebhook(file, category);
      if (success) {
        toast({
          title: "Documento adicionado",
          description: "O documento foi adicionado com sucesso.",
        });
        setIsAddDocumentOpen(false); // Fechar o diálogo após sucesso
        handleRefresh(); // Atualizar a lista de documentos
      }
    } catch (error) {
      toast({
        title: "Erro ao adicionar documento",
        description: "Não foi possível adicionar o documento.",
        variant: "destructive",
      });
      console.error('Erro ao fazer upload do documento:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={handleRefresh}
        onAddDocument={() => setIsAddDocumentOpen(true)}
        onClearAll={clearAllDocuments}
        isRefreshing={isRefreshing}
      />

      <DocumentGrid 
        documents={documents}
        searchQuery={searchQuery}
        onDeleteDocument={handleDeleteDocument}
      />

      <AddDocumentDialog 
        isOpen={isAddDocumentOpen}
        onOpenChange={setIsAddDocumentOpen}
        onAddDocument={handleAddDocument}
      />
    </div>
  );
};

export default KnowledgeContent;
