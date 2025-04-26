
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet } from 'lucide-react';

const PaymentsCard = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/payments');
  };
  
  return (
    <Card className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" onClick={handleClick}>
      <CardHeader className="pb-2 bg-gradient-to-r from-petshop-blue to-petshop-navy text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          Pagamentos
        </CardTitle>
        <CardDescription className="text-blue-100">
          Gestão financeira
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 flex justify-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full">
            <Wallet className="h-14 w-14 text-petshop-blue dark:text-blue-400 animate-bounce" />
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Gerencie pagamentos, transações e relatórios financeiros.
        </p>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-700/50 rounded-b-lg border-t dark:border-gray-700 flex justify-center py-3">
        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-petshop-blue dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50">
          Acessar Gestão de Pagamentos
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default PaymentsCard;
