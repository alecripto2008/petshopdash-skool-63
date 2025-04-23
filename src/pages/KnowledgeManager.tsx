
import React from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader';
import KnowledgeNavigation from '@/components/knowledge/KnowledgeNavigation';
import KnowledgeContent from '@/components/knowledge/KnowledgeContent';

const KnowledgeManager = () => {
  const { isLoading } = useDocuments();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-petshop-blue dark:bg-gray-900">
        <div className="h-16 w-16 border-4 border-t-transparent border-petshop-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <KnowledgeHeader />
      <main className="container mx-auto px-4 py-8">
        <KnowledgeNavigation title="Gerenciador de Conhecimento" />
        <KnowledgeContent />
      </main>
    </div>
  );
};

export default KnowledgeManager;
