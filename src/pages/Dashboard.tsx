
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { useDashboardRealtime } from '@/hooks/useDashboardRealtime';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricsCard from '@/components/dashboard/MetricsCard';
import ChatsCard from '@/components/dashboard/ChatsCard';
import KnowledgeCard from '@/components/dashboard/KnowledgeCard';
import ClientsCard from '@/components/dashboard/ClientsCard';
import EvolutionCard from '@/components/dashboard/EvolutionCard';
import ScheduleCard from '@/components/dashboard/ScheduleCard';
import ProductsCard from '@/components/dashboard/ProductsCard';
import PaymentsCard from '@/components/dashboard/PaymentsCard';
import UsersCard from '@/components/dashboard/UsersCard';
import { ConfigCard } from '@/components/dashboard/ConfigCard';
import { TokenCostCard } from '@/components/dashboard/TokenCostCard';
import UserDebugInfo from '@/components/debug/UserDebugInfo';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const { permissions, loading: permissionsLoading } = useUserPermissions();
  const navigate = useNavigate();
  
  // Use o hook apenas uma vez
  useDashboardRealtime();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);
  
  if (isLoading || permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-petshop-blue dark:bg-gray-900">
        <div className="h-16 w-16 border-4 border-t-transparent border-petshop-gold rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-800 dark:text-gray-100 transition-colors duration-300">
          Painel Administrativo
        </h2>
        
        {/* Componente de Debug - Remover após verificação */}
        <UserDebugInfo />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {permissions.canAccessMetrics && <MetricsCard />}
          {permissions.canAccessChats && <ChatsCard />}
          {permissions.canAccessKnowledge && <KnowledgeCard />}
          {permissions.canAccessClients && <ClientsCard />}
          {permissions.canAccessEvolution && <EvolutionCard />}
          {permissions.canAccessSchedule && <ScheduleCard />}
          {permissions.canAccessProducts && <ProductsCard />}
          {permissions.canAccessPayments && <PaymentsCard />}
          {permissions.canAccessUsers && <UsersCard />}
          {permissions.canAccessTokenCost && <TokenCostCard />}
          {permissions.canAccessConfig && <ConfigCard />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
