
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Coins } from 'lucide-react';

const TokenCostCard = () => {
  const navigate = useNavigate();

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/30 border-amber-200 dark:border-amber-700"
      onClick={() => navigate('/token-cost')}
    >
      <CardContent className="p-8 text-center">
        <div className="bg-amber-100 dark:bg-amber-800 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Coins className="h-8 w-8 text-amber-600 dark:text-amber-300" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-amber-800 dark:text-amber-200">
          Custo de Tokens
        </h3>
        <p className="text-amber-700 dark:text-amber-300 text-sm">
          Visualize estatísticas de custos diários e mensais dos tokens utilizados
        </p>
      </CardContent>
    </Card>
  );
};

export { TokenCostCard };
