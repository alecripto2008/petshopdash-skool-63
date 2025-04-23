
import React, { useState } from 'react';
import SearchBar from '@/components/knowledge/SearchBar';
import DocumentGrid from '@/components/knowledge/DocumentGrid';
import AddDocumentDialog from '@/components/knowledge/AddDocumentDialog';
import { useDocuments } from '@/hooks/useDocuments';

const KnowledgeContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  
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
    await uploadFileToWebhook(file, category);
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
