
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Coins } from 'lucide-react';

const TokenCostCard = () => {
  const navigate = useNavigate();

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/30 border-yellow-200 dark:border-yellow-700"
      onClick={() => navigate('/token-cost')}
    >
      <CardContent className="p-6 text-center">
        <div className="bg-yellow-100 dark:bg-yellow-800 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <Coins className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
          Custo de Tokens
        </h3>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm leading-relaxed">
          Visualize estatísticas de custos diários e mensais dos tokens utilizados
        </p>
      </CardContent>
    </Card>
  );
};

export { TokenCostCard };
