
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { banknote } from 'lucide-react';

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
            <banknote className="h-5 w-5 text-green-600 dark:text-green-400" />
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

  // Format data for the pie chart
  const chartData = data.map(item => ({
    name: item.name,
    value: item.count
  }));

  // Calculate total value for all service types
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <banknote className="h-5 w-5 text-green-600 dark:text-green-400" />
          Tipos de Serviço
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={config}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={data[index]?.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip content={<ChartTooltipContent />} />
              </PieChart>
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
