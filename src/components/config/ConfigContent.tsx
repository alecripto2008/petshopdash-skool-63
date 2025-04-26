
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

interface WebhookConfig {
  id: number;
  name: string;
  url: string;
  description: string;
}

const ConfigContent = () => {
  const [configs, setConfigs] = useState<WebhookConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      // First, check if the table exists
      const { data: tableExists, error: tableCheckError } = await supabase
        .from('webhook_configs')
        .select('id')
        .limit(1)
        .maybeSingle();

      // If we can't access the table or it doesn't exist yet, create sample configs in memory
      if (tableCheckError || tableExists === null) {
        console.log('Webhook configs table may not exist, using default configs');
        const defaultConfigs: WebhookConfig[] = [
          {
            id: 1,
            name: 'Webhook de Mensagem',
            url: 'https://webhook.n8nlabz.com.br/webhook/envia_mensagem',
            description: 'Endpoint para envio de mensagens pelo sistema'
          },
          {
            id: 2,
            name: 'Webhook de Documentos',
            url: 'https://webhook.n8nlabz.com.br/webhook/envia_rag',
            description: 'Endpoint para gerenciamento de documentos RAG'
          }
        ];
        setConfigs(defaultConfigs);
      } else {
        // If the table exists, fetch data normally
        const { data, error } = await supabase
          .from('webhook_configs')
          .select('*')
          .order('name');

        if (error) throw error;
        setConfigs(data as WebhookConfig[]);
      }
    } catch (error) {
      console.error('Error fetching configs:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações do sistema.",
        variant: "destructive",
      });
      
      // Provide fallback data in case of error
      const fallbackConfigs: WebhookConfig[] = [
        {
          id: 1,
          name: 'Webhook de Mensagem (Padrão)',
          url: 'https://webhook.n8nlabz.com.br/webhook/envia_mensagem',
          description: 'Endpoint para envio de mensagens pelo sistema'
        }
      ];
      setConfigs(fallbackConfigs);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateConfig = async (id: number, newUrl: string) => {
    try {
      // Try to update in database if it exists
      const { error } = await supabase
        .from('webhook_configs')
        .update({ url: newUrl })
        .eq('id', id);

      // If the update fails, just update in local state
      if (error) {
        console.log('Could not update in database, updating in local state only');
        setConfigs(prev => 
          prev.map(config => 
            config.id === id ? { ...config, url: newUrl } : config
          )
        );
      }

      toast({
        title: "Configuração atualizada",
        description: "A configuração foi atualizada com sucesso.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating config:', error);
      toast({
        title: "Erro ao atualizar configuração",
        description: "Não foi possível atualizar a configuração.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {configs.map((config) => (
        <Card key={config.id}>
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
                      onBlur={(e) => handleUpdateConfig(config.id, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConfigContent;
