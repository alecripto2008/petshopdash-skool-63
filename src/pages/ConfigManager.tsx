
import React from 'react';
import DashboardHeader from '@/components/metrics/DashboardHeader';
import ConfigContent from '@/components/config/ConfigContent';

const ConfigManager = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Configurações do Sistema
        </h2>
        <ConfigContent />
      </main>
    </div>
  );
};

export default ConfigManager;
