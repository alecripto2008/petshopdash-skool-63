import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { WebhookConfig } from '@/types/webhook';
import { WEBHOOK_IDENTIFIERS } from '@/types/webhook';
import { loadWebhooks, clearWebhookCache } from '@/services/webhookService';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyWebhooksState } from './EmptyWebhooksState';
import { WebhookCard } from './WebhookCard';
import { WebhooksHeader } from './WebhooksHeader';

const getWebhookDescription = (identifier: string): string => {
  const descriptions: Record<string, string> = {
    send_message: 'Webhook para envio de mensagens do sistema',
    pause_bot: 'Webhook para pausar o bot temporariamente',
    start_bot: 'Webhook para iniciar/retomar o bot',
    upload_rag: 'Webhook para upload de arquivos na base de conhecimento',
    delete_file_rag: 'Webhook para remoção de arquivos da base de conhecimento',
    clear_rag: 'Webhook para limpar toda a base de conhecimento',
    confirm_evolution: 'Webhook para confirmar uma evolução do sistema',
    create_evolution_instance: 'Webhook para criar uma nova instância do WhatsApp',
    update_qr_code: 'Webhook para atualizar o QR code do sistema',
    confirm_evolution_status: 'Webhook para confirmar o status da conexão do WhatsApp',
    update_evolution_qr: 'Webhook para atualizar o QR code do WhatsApp',
    create_user: 'Webhook para criação de novos usuários',
    update_user: 'Webhook para atualização de usuários',
    delete_user: 'Webhook para remoção de usuários',
    config_agent: 'Webhook para configuração de agentes do sistema',
    cria_usuario: 'Webhook para criação de novos usuários (versão em português)'
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
      
      let existingWebhooks = data as WebhookConfig[];
      const webhookIdentifiers = new Set(existingWebhooks.map(w => w.identifier));
      
      // Encontrar webhooks que faltam ser criados
      const missingWebhooks = Object.entries(WEBHOOK_IDENTIFIERS).filter(
        ([_, identifier]) => !webhookIdentifiers.has(identifier)
      );
      
      if (missingWebhooks.length > 0) {
        console.log("Missing webhooks to be created:", missingWebhooks);
        
        for (const [name, identifier] of missingWebhooks) {
          const readableName = name.toLowerCase().split('_').map(
            word => word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
          
          const defaultUrlPath = identifier.toLowerCase().replace(/_/g, '-');
          const defaultUrl = `https://webhook.n8nlabz.com.br/webhook/${defaultUrlPath}`;
          
          const newWebhook = {
            name: readableName,
            url: defaultUrl,
            description: getWebhookDescription(identifier.toLowerCase()),
            identifier: identifier
          };
          
          const { error: insertError } = await supabase
            .from('webhook_configs')
            .insert(newWebhook)
            .select();
            
          if (insertError) {
            console.error(`Error inserting webhook ${newWebhook.name}:`, insertError);
            toast({
              title: "Erro ao inserir webhook",
              description: `Não foi possível inserir o webhook ${newWebhook.name}`,
              variant: "destructive",
            });
          } else {
            console.log(`Successfully created webhook: ${newWebhook.name}`);
          }
        }
        
        // Recarregar todos os webhooks após inserir os novos
        const { data: refreshedData, error: refreshError } = await supabase
          .from('webhook_configs')
          .select('*')
          .order('name');
          
        if (!refreshError && refreshedData) {
          existingWebhooks = refreshedData as WebhookConfig[];
        }
      }
      
      setConfigs(existingWebhooks);
      clearWebhookCache();
      await loadWebhooks();

      toast({
        title: "Configurações carregadas",
        description: "Webhooks carregados com sucesso!",
      });
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

  useEffect(() => {
    fetchConfigs();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (configs.length === 0) {
    return <EmptyWebhooksState onRefresh={fetchConfigs} />;
  }

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
