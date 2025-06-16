
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TokenStats {
  dailyTokenCost: number;
  monthlyTokenCosts: Array<{
    month: string;
    total: number;
  }>;
}

export const useTokenStats = () => {
  const [stats, setStats] = useState<TokenStats>({
    dailyTokenCost: 0,
    monthlyTokenCosts: []
  });
  const [loading, setLoading] = useState(true);

  const fetchTokenStats = async () => {
    try {
      setLoading(true);
      
      // Buscar custo diário (hoje)
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      
      const { data: dailyData, error: dailyError } = await supabase
        .from('tokens')
        .select('totalcostreal')
        .gte('created_at', startOfDay.toISOString())
        .lt('created_at', endOfDay.toISOString());

      if (dailyError) {
        console.error('Error fetching daily token costs:', dailyError);
      }

      const dailyTotal = dailyData?.reduce((sum, item) => sum + (Number(item.totalcostreal) || 0), 0) || 0;

      // Buscar dados mensais dos últimos 12 meses
      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - 12);

      const { data: monthlyData, error: monthlyError } = await supabase
        .from('tokens')
        .select('totalcostreal, created_at')
        .gte('created_at', monthsAgo.toISOString())
        .order('created_at', { ascending: true });

      if (monthlyError) {
        console.error('Error fetching monthly token costs:', monthlyError);
      }

      // Agrupar por mês
      const monthlyGroups: Record<string, number> = {};
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      
      monthlyData?.forEach(item => {
        const date = new Date(item.created_at);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        const cost = Number(item.totalcostreal) || 0;
        
        if (!monthlyGroups[monthKey]) {
          monthlyGroups[monthKey] = 0;
        }
        monthlyGroups[monthKey] += cost;
      });

      // Preparar dados para o gráfico (últimos 12 meses)
      const monthlyTokenCosts = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        const monthName = monthNames[date.getMonth()];
        
        monthlyTokenCosts.push({
          month: monthName,
          total: monthlyGroups[monthKey] || 0
        });
      }

      setStats({
        dailyTokenCost: dailyTotal,
        monthlyTokenCosts
      });
      
    } catch (error) {
      console.error('Error in fetchTokenStats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenStats();
  }, []);

  return {
    stats,
    loading,
    refetch: fetchTokenStats
  };
};
