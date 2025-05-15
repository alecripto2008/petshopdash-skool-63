
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, CreditCard, DollarSign } from 'lucide-react';

const MetricsCard = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/metrics');
  };
  
  return (
    <Card className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" onClick={handleClick}>
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-6 w-6" />
          Métricas
        </CardTitle>
        <CardDescription className="text-blue-100">
          Estatísticas e indicadores
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 flex justify-center gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full relative">
            <LineChart className="h-10 w-10 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full relative">
            <DollarSign className="h-10 w-10 text-green-500 dark:text-green-400" />
          </div>
          <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full relative">
            <CreditCard className="h-10 w-10 text-purple-500 dark:text-purple-400" />
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Gerencie estatísticas de clientes, pagamentos e serviços
        </p>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-700/50 rounded-b-lg border-t dark:border-gray-700 flex justify-center py-3">
        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50">
          Acessar dashboard de métricas
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default MetricsCard;
