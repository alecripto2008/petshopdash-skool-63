
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Coins } from 'lucide-react';

const TokenCostCard = () => {
  const navigate = useNavigate();

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border-blue-200 dark:border-blue-700"
      onClick={() => navigate('/token-cost')}
    >
      <CardContent className="p-6 text-center">
        <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <Coins className="h-6 w-6 text-blue-600 dark:text-blue-300" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">
          Custo de Tokens
        </h3>
        <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
          Visualize estatísticas de custos diários e mensais dos tokens utilizados
        </p>
      </CardContent>
    </Card>
  );
};

export { TokenCostCard };
