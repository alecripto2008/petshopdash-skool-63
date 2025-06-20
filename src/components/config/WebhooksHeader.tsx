
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { AddWebhookDialog } from './AddWebhookDialog';

interface WebhooksHeaderProps {
  onRefresh: () => void;
  onAdd: (webhook: { name: string; url: string; description: string; identifier: string }) => Promise<void>;
}

export const WebhooksHeader = ({ onRefresh, onAdd }: WebhooksHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">URLs de Webhook</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie as URLs de integração do sistema</p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh} 
          className="flex items-center gap-2 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-400"
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
        <AddWebhookDialog onAdd={onAdd} />
      </div>
    </div>
  );
};
