
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { DollarSign } from 'lucide-react';

interface MonthlyPaymentsChartProps {
  data: Array<{
    month: string;
    total: number;
  }>;
  loading?: boolean;
}

const MonthlyPaymentsChart = ({ data, loading = false }: MonthlyPaymentsChartProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            Rendimento Mensal
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-t-transparent border-green-600 rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  // Calculate total annual revenue
  const totalAnnual = data.reduce((sum, item) => sum + item.total, 0);

  // Format the data for chart rendering and add currency formatting
  const formattedData = data.map(item => ({
    ...item,
    formattedTotal: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
          Rendimento Mensal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
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
              <Bar dataKey="total" name="Rendimento" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
          Rendimento total anual: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAnnual)}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyPaymentsChart;
