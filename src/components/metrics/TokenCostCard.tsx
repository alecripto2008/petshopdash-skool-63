
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { useTokenStats } from '@/hooks/useTokenStats';
import { useIsMobile } from '@/hooks/use-mobile';

const TokenCostCard = () => {
  const { stats, loading } = useTokenStats();
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const isMobile = useIsMobile();

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

  const toggleMonthExpansion = (monthName: string) => {
    if (expandedMonth === monthName) {
      setExpandedMonth(null);
    } else {
      setExpandedMonth(monthName);
    }
  };

  const totalGeral = stats.monthlyStats.reduce((sum, month) => sum + month.monthTotal, 0);

  const renderMonthChart = (monthStats: typeof stats.monthlyStats[0]) => {
    const isExpanded = expandedMonth === monthStats.monthName;
    
    return (
      <Card key={monthStats.monthName} className="mb-6">
        <CardHeader className="cursor-pointer" onClick={() => toggleMonthExpansion(monthStats.monthName)}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">
              {monthStats.monthName}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthStats.monthTotal)}
              </Badge>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthStats.dailyCosts}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12 }}
                    interval={isMobile ? 4 : 2}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2
                    }).format(value)}
                  />
                  <Tooltip 
                    formatter={(value) => [
                      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value as number),
                      'Custo'
                    ]}
                    labelFormatter={(label) => `Dia ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="total" name="Custo Diário" fill="#D97706" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas resumidas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Custo Hoje</span>
            </div>
            <div className="text-xl font-bold text-amber-800 dark:text-amber-200">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.dailyTokenCost)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300 mb-1">
              <Coins className="h-4 w-4" />
              <span className="text-sm font-medium">Total Geral</span>
            </div>
            <div className="text-xl font-bold text-green-800 dark:text-green-200">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGeral)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos mensais */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Coins className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          Custos Diários por Mês
        </h3>
        {stats.monthlyStats.length > 0 ? (
          stats.monthlyStats.map(monthStats => renderMonthChart(monthStats))
        ) : (
          <Card>
            <CardContent className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">Nenhum dado de custo encontrado.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TokenCostCard;
