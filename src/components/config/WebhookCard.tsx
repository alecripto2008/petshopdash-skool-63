
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { WebhookConfig } from '@/types/webhook';
import { EditWebhookDialog } from './EditWebhookDialog';
import { DeleteWebhookDialog } from './DeleteWebhookDialog';

interface WebhookCardProps {
  config: WebhookConfig;
  onUpdate: (id: number, data: { name: string; url: string; description: string; identifier: string }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const WebhookCard = ({ config, onUpdate, onDelete }: WebhookCardProps) => {
  return (
    <Card className="transform transition-all duration-300 hover:shadow-lg dark:hover:shadow-amber-900/10">
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-500/10 to-amber-600/10 dark:from-amber-600/20 dark:to-amber-700/20">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-amber-700 dark:text-amber-300">{config.name}</CardTitle>
          <div className="flex gap-2">
            <EditWebhookDialog webhook={config} onUpdate={onUpdate} />
            <DeleteWebhookDialog webhook={config} onDelete={onDelete} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Descrição</Label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {config.description || 'Sem descrição'}
          </p>
        </div>
        <div>
          <Label className="text-gray-700 dark:text-gray-300">URL</Label>
          <p className="text-xs font-mono bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 p-2 rounded mt-1 break-all">
            {config.url}
          </p>
        </div>
        {config.identifier && (
          <div>
            <Label className="text-gray-700 dark:text-gray-300">Identificador</Label>
            <p className="text-xs font-mono bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 p-2 rounded mt-1">
              {config.identifier}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
