
import React from 'react';
import DashboardHeader from '@/components/metrics/DashboardHeader';
import ConfigContent from '@/components/config/ConfigContent';

const ConfigManager = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Configurações do Sistema
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Gerencie as configurações e integrações do seu sistema
            </p>
          </div>
          <ConfigContent />
        </div>
      </main>
    </div>
  );
};

export default ConfigManager;
