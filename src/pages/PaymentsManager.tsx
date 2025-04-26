
import React from 'react';
import DashboardHeader from '@/components/metrics/DashboardHeader';
import PaymentsContent from '@/components/payments/PaymentsContent';

const PaymentsManager = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Gestão de Pagamentos
        </h2>
        <PaymentsContent />
      </main>
    </div>
  );
};

export default PaymentsManager;
