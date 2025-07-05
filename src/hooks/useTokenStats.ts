
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DailyTokenCost {
  day: number;
  total: number;
}

interface MonthlyTokenStats {
  monthName: string;
  dailyCosts: DailyTokenCost[];
  monthTotal: number;
}

interface TokenStats {
  dailyTokenCost: number;
  monthlyStats: MonthlyTokenStats[];
}

export const useTokenStats = () => {
  const [stats, setStats] = useState<TokenStats>({
    dailyTokenCost: 0,
    monthlyStats: []
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

      // Buscar dados dos últimos 6 meses
      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - 6);

      const { data: monthlyData, error: monthlyError } = await supabase
        .from('tokens')
        .select('totalcostreal, created_at')
        .gte('created_at', monthsAgo.toISOString())
        .order('created_at', { ascending: true });

      if (monthlyError) {
        console.error('Error fetching monthly token costs:', monthlyError);
      }

      // Agrupar por mês e dia
      const monthlyGroups: Record<string, Record<number, number>> = {};
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      
      monthlyData?.forEach(item => {
        const date = new Date(item.created_at);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        const day = date.getDate();
        const cost = Number(item.totalcostreal) || 0;
        
        if (!monthlyGroups[monthKey]) {
          monthlyGroups[monthKey] = {};
        }
        if (!monthlyGroups[monthKey][day]) {
          monthlyGroups[monthKey][day] = 0;
        }
        monthlyGroups[monthKey][day] += cost;
      });

      // Preparar dados para os gráficos (últimos 6 meses em ordem decrescente)
      const monthlyStats: MonthlyTokenStats[] = [];
      const currentDate = new Date();
      
      for (let i = 0; i < 6; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1); // Começa no primeiro dia do mês
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthKey = `${year}-${month}`;
        const monthName = `${monthNames[month]} ${year}`;
        
        const monthData = monthlyGroups[monthKey] || {};
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const dailyCosts: DailyTokenCost[] = [];
        let monthTotal = 0;
        
        for (let day = 1; day <= daysInMonth; day++) {
          const dayTotal = monthData[day] || 0;
          dailyCosts.push({ day, total: dayTotal });
          monthTotal += dayTotal;
        }
        
        monthlyStats.push({ // Adiciona no final para manter a ordem cronológica decrescente
          monthName,
          dailyCosts,
          monthTotal
        });
      }

      setStats({
        dailyTokenCost: dailyTotal,
        monthlyStats
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
