
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, TrendingUp } from 'lucide-react';
import { useTokenStats } from '@/hooks/useTokenStats';

const TokenCostCard = () => {
  const { stats, loading } = useTokenStats();

  if (loading) {
    return (
      <Card className="dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            Custo de Tokens
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-t-transparent border-amber-600 rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  // Dados para o gráfico mensal
  const monthlyData = stats.monthlyTokenCosts || [];
  
  // Calcular totais
  const totalDailyCost = stats.dailyTokenCost || 0;
  const totalMonthlyCost = monthlyData.reduce((sum, item) => sum + (item.total || 0), 0);

  // Formatar dados para o gráfico
  const formattedData = monthlyData.map(item => ({
    ...item,
    formattedTotal: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total || 0)
  }));

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Coins className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          Custo de Tokens
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Estatísticas resumidas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Custo Hoje</span>
            </div>
            <div className="text-xl font-bold text-amber-800 dark:text-amber-200">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDailyCost)}
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300 mb-1">
              <Coins className="h-4 w-4" />
              <span className="text-sm font-medium">Total Mensal</span>
            </div>
            <div className="text-xl font-bold text-green-800 dark:text-green-200">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalMonthlyCost)}
            </div>
          </div>
        </div>

        {/* Gráfico mensal */}
        <div className="h-[300px] w-full">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Custo Mensal de Tokens (Últimos 12 meses)
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value as number)}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Legend />
              <Bar dataKey="total" name="Custo Total" fill="#D97706" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenCostCard;
