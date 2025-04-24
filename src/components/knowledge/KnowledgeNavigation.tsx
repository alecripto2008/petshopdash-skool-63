
import React from 'react';

interface KnowledgeNavigationProps {
  title: string;
}

const KnowledgeNavigation: React.FC<KnowledgeNavigationProps> = ({ title }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {title}
      </h2>
    </div>
  );
};

export default KnowledgeNavigation;
