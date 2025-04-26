
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { WebhookConfig } from '@/types/webhook';

interface WebhookCardProps {
  config: WebhookConfig;
  onUpdateUrl: (id: number, newUrl: string) => Promise<void>;
}

export const WebhookCard = ({ config, onUpdateUrl }: WebhookCardProps) => {
  return (
    <Card className="transform transition-all duration-300 hover:shadow-lg dark:hover:shadow-amber-900/10">
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-500/10 to-amber-600/10 dark:from-amber-600/20 dark:to-amber-700/20">
        <CardTitle className="text-lg text-amber-700 dark:text-amber-300">{config.name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Descrição</Label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{config.description}</p>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <Label className="text-gray-700 dark:text-gray-300">URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                defaultValue={config.url}
                onBlur={(e) => onUpdateUrl(config.id, e.target.value)}
                className="font-mono text-sm bg-amber-50/50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 focus:border-amber-400 dark:focus:border-amber-500"
              />
            </div>
          </div>
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
