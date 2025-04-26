
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import type { WebhookConfig } from '@/types/webhook';
import { WEBHOOK_IDENTIFIERS } from '@/types/webhook';
import { loadWebhooks, clearWebhookCache } from '@/services/webhookService';
import { RefreshCw, AlertCircle } from 'lucide-react';

const ConfigContent = () => {
  const [configs, setConfigs] = useState<WebhookConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('webhook_configs')
        .select('*')
        .order('name');

      if (error) throw error;
      
      // Verifica se todos os webhooks necessários existem
      let existingWebhooks = data as WebhookConfig[];
      const webhookIdentifiers = new Set(existingWebhooks.map(w => w.identifier));
      
      // Se algum webhook não estiver cadastrado, prepara para inserir
      const missingWebhooks = Object.entries(WEBHOOK_IDENTIFIERS).filter(
        ([_, identifier]) => !webhookIdentifiers.has(identifier)
      );
      
      if (missingWebhooks.length > 0) {
        console.log("Missing webhooks:", missingWebhooks);
        
        // Criar webhooks faltantes um por um para evitar problemas
        for (const [name, identifier] of missingWebhooks) {
          const readableName = name.toLowerCase().split('_').map(
            word => word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
          
          const defaultUrlPath = identifier.replace(/_/g, '-');
          const defaultUrl = `https://webhook.n8nlabz.com.br/webhook/${defaultUrlPath}`;
          
          const newWebhook = {
            name: readableName,
            url: defaultUrl,
            description: `URL para ${readableName}`,
            identifier: identifier
          };
          
          console.log("Inserting webhook:", newWebhook);
          
          const { error: insertError } = await supabase
            .from('webhook_configs')
            .insert(newWebhook);
            
          if (insertError) {
            console.error(`Erro ao inserir webhook ${newWebhook.name}:`, insertError);
            toast({
              title: "Erro ao inserir webhook",
              description: `Não foi possível inserir o webhook ${newWebhook.name}`,
              variant: "destructive",
            });
          }
        }
        
        // Recarrega para obter os novos webhooks
        const { data: refreshedData, error: refreshError } = await supabase
          .from('webhook_configs')
          .select('*')
          .order('name');
          
        if (!refreshError) {
          existingWebhooks = refreshedData as WebhookConfig[];
        } else {
          console.error("Erro ao recarregar webhooks:", refreshError);
        }
      }
      
      setConfigs(existingWebhooks);
      
      // Limpa o cache para que os novos valores sejam usados
      clearWebhookCache();
      await loadWebhooks();
    } catch (error) {
      console.error('Error fetching configs:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações do sistema.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateConfig = async (id: number, newUrl: string) => {
    try {
      const { error } = await supabase
        .from('webhook_configs')
        .update({ url: newUrl, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Configuração atualizada",
        description: "A configuração foi atualizada com sucesso.",
      });
      
      // Limpa o cache para que os novos valores sejam usados
      clearWebhookCache();
      
      // Refresh configs after update
      await fetchConfigs();
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

  // Verificar se há webhooks registrados
  if (configs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="h-12 w-12 text-amber-500" />
        <h3 className="text-lg font-medium">Nenhum webhook encontrado</h3>
        <p className="text-center text-muted-foreground">
          Não foram encontrados webhooks configurados no sistema.
        </p>
        <Button onClick={fetchConfigs} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">URLs de Webhook</h3>
        <Button variant="outline" size="sm" onClick={fetchConfigs} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>
      
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
      ))}
    </div>
  );
};

export default ConfigContent;
