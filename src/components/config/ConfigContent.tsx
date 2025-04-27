
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { WebhookConfig } from '@/types/webhook';
import { WEBHOOK_IDENTIFIERS } from '@/types/webhook';
import { loadWebhooks, clearWebhookCache } from '@/services/webhookService';
import { LoadingSpinner } from './LoadingSpinner';
import { Button } from '@/components/ui/button';
import { WebhookCard } from './WebhookCard';
import { WebhooksHeader } from './WebhooksHeader';
import { AlertCircle } from 'lucide-react';

const getWebhookDescription = (identifier: string): string => {
  const descriptions: Record<string, string> = {
    pause_bot: 'Webhook para pausar o bot temporariamente',
    confirm_evolution_status: 'Webhook para confirmar o status da conexão do WhatsApp'
  };
  return descriptions[identifier] || 'Webhook do sistema';
};

const ConfigContent = () => {
  const [configs, setConfigs] = useState<WebhookConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchConfigs = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching webhook configurations...");
      
      const { data, error } = await supabase
        .from('webhook_configs')
        .select('*')
        .order('name');

      if (error) throw error;
      
      console.log("Existing webhooks:", data);
      
      setConfigs(data as WebhookConfig[]);
      clearWebhookCache();
      await loadWebhooks();

      if (data.length === 0) {
        toast({
          title: "Sem configurações",
          description: "Nenhum webhook configurado no momento.",
          variant: "destructive"
        });
      }
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

  const createDefaultWebhooks = async () => {
    try {
      const defaultWebhooks = Object.entries(WEBHOOK_IDENTIFIERS).map(([name, identifier]) => {
        const readableName = name.toLowerCase().split('_').map(
          word => word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        const defaultUrl = `https://webhook.n8nlabz.com.br/webhook/${identifier.toLowerCase().replace(/_/g, '-')}`;
        
        return {
          name: readableName,
          url: defaultUrl,
          description: getWebhookDescription(identifier),
          identifier
        };
      });

      const { data, error } = await supabase
        .from('webhook_configs')
        .insert(defaultWebhooks)
        .select();

      if (error) throw error;

      toast({
        title: "Webhooks restaurados",
        description: "Webhooks padrão foram restaurados com sucesso.",
      });

      fetchConfigs();
    } catch (error) {
      console.error('Error creating default webhooks:', error);
      toast({
        title: "Erro ao restaurar webhooks",
        description: "Não foi possível restaurar os webhooks padrão.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (configs.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center p-8 bg-amber-50/50 dark:bg-amber-900/20 rounded-lg border-2 border-dashed border-amber-200 dark:border-amber-800">
          <AlertCircle className="h-12 w-12 text-amber-500 dark:text-amber-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Nenhum Webhook Configurado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Parece que não há webhooks configurados no momento. Clique no botão abaixo para restaurar as configurações padrão.
          </p>
          <Button 
            variant="default" 
            onClick={createDefaultWebhooks}
            className="mx-auto bg-amber-500 hover:bg-amber-600 text-white"
          >
            Restaurar Webhooks Padrão
          </Button>
        </div>
      </div>
    );
  }

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
      
      clearWebhookCache();
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

  return (
    <div className="space-y-6">
      <WebhooksHeader onRefresh={fetchConfigs} />
      <div className="grid gap-6">
        {configs.map((config) => (
          <WebhookCard
            key={config.id}
            config={config}
            onUpdateUrl={handleUpdateConfig}
          />
        ))}
      </div>
    </div>
  );
};

export default ConfigContent;
