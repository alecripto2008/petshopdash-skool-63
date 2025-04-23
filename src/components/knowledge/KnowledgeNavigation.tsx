
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface KnowledgeNavigationProps {
  title: string;
}

const KnowledgeNavigation: React.FC<KnowledgeNavigationProps> = ({ title }) => {
  const navigate = useNavigate();
  
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center mb-6">
      <Button 
        variant="ghost" 
        onClick={handleBackToDashboard}
        className="text-white hover:bg-white/10 mr-4"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Voltar
      </Button>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {title}
      </h2>
    </div>
  );
};

export default KnowledgeNavigation;
