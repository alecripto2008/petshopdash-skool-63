
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
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{config.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Descrição</Label>
            <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  defaultValue={config.url}
                  onBlur={(e) => onUpdateUrl(config.id, e.target.value)}
                />
              </div>
            </div>
          </div>
          {config.identifier && (
            <div>
              <Label>Identificador</Label>
              <p className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded mt-1">
                {config.identifier}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
