
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';

const KnowledgeHeader = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  return (
    <header className="bg-petshop-blue dark:bg-gray-800 text-white shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <PawPrint className="h-8 w-8 text-petshop-gold" />
          <h1 className="text-2xl font-bold">PetShop</h1>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1">
            {user?.user_metadata?.name || user?.email}
          </Badge>
          <ThemeToggle />
          <Button 
            variant="outline" 
            onClick={signOut} 
            className="border-white text-white bg-gray-950/50 hover:bg-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default KnowledgeHeader;
