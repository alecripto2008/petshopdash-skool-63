
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface WebhooksHeaderProps {
  onRefresh: () => void;
}

export const WebhooksHeader = ({ onRefresh }: WebhooksHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">URLs de Webhook</h3>
      <Button variant="outline" size="sm" onClick={onRefresh} className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Atualizar
      </Button>
    </div>
  );
};
