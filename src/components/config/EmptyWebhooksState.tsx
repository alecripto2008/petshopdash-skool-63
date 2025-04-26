
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyWebhooksStateProps {
  onRefresh: () => void;
}

export const EmptyWebhooksState = ({ onRefresh }: EmptyWebhooksStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 p-8 bg-amber-50/50 dark:bg-amber-900/20 rounded-lg border-2 border-dashed border-amber-200 dark:border-amber-800">
      <AlertCircle className="h-12 w-12 text-amber-500 dark:text-amber-400" />
      <h3 className="text-lg font-medium text-amber-700 dark:text-amber-300">Nenhum webhook encontrado</h3>
      <p className="text-center text-amber-600/80 dark:text-amber-400/80">
        Não foram encontrados webhooks configurados no sistema.
      </p>
      <Button 
        onClick={onRefresh} 
        className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Tentar novamente
      </Button>
    </div>
  );
};
