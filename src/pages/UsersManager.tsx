
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const UsersManager = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-petshop-blue dark:bg-gray-900">
        <div className="h-16 w-16 border-4 border-t-transparent border-petshop-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Gerenciamento de Usuários
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gerencie usuários, permissões e controle de acesso do sistema
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Gerenciamento de Usuários
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Esta seção será implementada em breve para gerenciar usuários e suas permissões.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UsersManager;
