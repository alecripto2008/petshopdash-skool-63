
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Banknote } from 'lucide-react';

interface ServiceTypesChartProps {
  data: Array<{
    name: string;
    count: number;
    value: number;
    color: string;
  }>;
  loading?: boolean;
}

const ServiceTypesChart = ({ data, loading = false }: ServiceTypesChartProps) => {
  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <Banknote className="h-5 w-5 text-green-600 dark:text-green-400" />
            Tipos de Serviço
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-t-transparent border-green-600 rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  const config = data.reduce((acc, item) => {
    acc[item.name] = {
      theme: {
        light: item.color,
        dark: item.color,
      },
      label: item.name,
    };
    return acc;
  }, {});

  // Format data for the bar chart - sort by count for better visualization
  const chartData = [...data].sort((a, b) => a.count - b.count);

  // Calculate total value for all service types
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Banknote className="h-5 w-5 text-green-600 dark:text-green-400" />
          Tipos de Serviço
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={config}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={100}
                  tickFormatter={(value) => {
                    // Limita o tamanho do texto para caber na visualização
                    return value.length > 12 ? value.substring(0, 12) + '...' : value;
                  }}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="count" name="Quantidade">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
            Valor total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceTypesChart;
