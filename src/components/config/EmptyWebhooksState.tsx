
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyWebhooksStateProps {
  onRefresh: () => void;
}

export const EmptyWebhooksState = ({ onRefresh }: EmptyWebhooksStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <AlertCircle className="h-12 w-12 text-amber-500" />
      <h3 className="text-lg font-medium">Nenhum webhook encontrado</h3>
      <p className="text-center text-muted-foreground">
        Não foram encontrados webhooks configurados no sistema.
      </p>
      <Button onClick={onRefresh} className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Tentar novamente
      </Button>
    </div>
  );
};
