
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins } from 'lucide-react';

const TokenCostCard = () => {
  const navigate = useNavigate();

  return (
    <Card 
      className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-amber-900/50 dark:border-amber-800 dark:text-amber-100"
      onClick={() => navigate('/token-cost')}
    >
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-800 to-amber-950 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-6 w-6" />
          Custo de Tokens
        </CardTitle>
        <CardDescription className="text-amber-200">
          Análise de custos
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 flex justify-center">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-6 rounded-full">
            <Coins className="h-14 w-14 text-amber-800 dark:text-amber-400 animate-bounce" />
          </div>
        </div>
        <p className="text-gray-600 dark:text-amber-300 text-center">
          Visualize estatísticas de custos diários e mensais dos tokens utilizados.
        </p>
      </CardContent>
      <CardFooter className="bg-amber-50 dark:bg-amber-900/50 rounded-b-lg border-t dark:border-amber-800 flex justify-center py-3">
        <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/50">
          Acessar Análise de Custos
        </Badge>
      </CardFooter>
    </Card>
  );
};

export { TokenCostCard };
