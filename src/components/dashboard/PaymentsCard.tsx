
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
    <Card className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-green-900/50 dark:border-green-800 dark:text-green-100" onClick={handleClick}>
      <CardHeader className="pb-2 bg-gradient-to-r from-green-800 to-green-950 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          Pagamentos
        </CardTitle>
        <CardDescription className="text-green-200">
          Gestão financeira
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 flex justify-center">
          <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-full">
            <Wallet className="h-14 w-14 text-green-800 dark:text-green-400 animate-bounce" />
          </div>
        </div>
        <p className="text-gray-600 dark:text-green-300 text-center">
          Gerencie pagamentos, transações e relatórios financeiros.
        </p>
      </CardContent>
      <CardFooter className="bg-green-50 dark:bg-green-900/50 rounded-b-lg border-t dark:border-green-800 flex justify-center py-3">
        <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50">
          Acessar Gestão de Pagamentos
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default PaymentsCard;

