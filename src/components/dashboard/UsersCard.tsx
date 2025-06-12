
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

const UsersCard = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/users');
  };
  
  return (
    <Card className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-indigo-900/50 dark:border-indigo-800 dark:text-indigo-100" onClick={handleClick}>
      <CardHeader className="pb-2 bg-gradient-to-r from-indigo-800 to-indigo-950 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          Usuários
        </CardTitle>
        <CardDescription className="text-indigo-200">
          Gerenciamento e permissões
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 flex justify-center">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-6 rounded-full">
            <Users className="h-14 w-14 text-indigo-800 dark:text-indigo-400 animate-bounce" />
          </div>
        </div>
        <p className="text-gray-600 dark:text-indigo-300 text-center">
          Gerencie usuários, permissões e controle de acesso.
        </p>
      </CardContent>
      <CardFooter className="bg-indigo-50 dark:bg-indigo-900/50 rounded-b-lg border-t dark:border-indigo-800 flex justify-center py-3">
        <Badge variant="outline" className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/50">
          Acessar Gerenciamento de Usuários
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default UsersCard;
