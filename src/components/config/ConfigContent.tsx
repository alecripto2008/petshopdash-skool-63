
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { WebhookConfig } from '@/types/webhook';
import { clearWebhookCache } from '@/services/webhookService';
import { LoadingSpinner } from './LoadingSpinner';
import { WebhookCard } from './WebhookCard';
import { WebhooksHeader } from './WebhooksHeader';
import { EmptyWebhooksState } from './EmptyWebhooksState';

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
      
      console.log("Webhooks loaded:", data);
      setConfigs(data as WebhookConfig[]);
      clearWebhookCache();
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

  const handleAddWebhook = async (webhookData: { name: string; url: string; description: string; identifier: string }) => {
    try {
      const { data, error } = await supabase
        .from('webhook_configs')
        .insert([webhookData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Webhook adicionado",
        description: "O webhook foi adicionado com sucesso.",
      });

      setConfigs(prev => [...prev, data as WebhookConfig]);
      clearWebhookCache();
    } catch (error) {
      console.error('Error adding webhook:', error);
      toast({
        title: "Erro ao adicionar webhook",
        description: "Não foi possível adicionar o webhook.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUpdateWebhook = async (id: number, updateData: { name: string; url: string; description: string; identifier: string }) => {
    try {
      const { data, error } = await supabase
        .from('webhook_configs')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Webhook atualizado",
        description: "O webhook foi atualizado com sucesso.",
      });

      setConfigs(prev => prev.map(config => 
        config.id === id ? data as WebhookConfig : config
      ));
      clearWebhookCache();
    } catch (error) {
      console.error('Error updating webhook:', error);
      toast({
        title: "Erro ao atualizar webhook",
        description: "Não foi possível atualizar o webhook.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDeleteWebhook = async (id: number) => {
    try {
      const { error } = await supabase
        .from('webhook_configs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Webhook excluído",
        description: "O webhook foi excluído com sucesso.",
      });

      setConfigs(prev => prev.filter(config => config.id !== id));
      clearWebhookCache();
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast({
        title: "Erro ao excluir webhook",
        description: "Não foi possível excluir o webhook.",
        variant: "destructive",
      });
      throw error;
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
      <WebhooksHeader onRefresh={fetchConfigs} onAdd={handleAddWebhook} />
      <div className="grid gap-6">
        {configs.map((config) => (
          <WebhookCard
            key={config.id}
            config={config}
            onUpdate={handleUpdateWebhook}
            onDelete={handleDeleteWebhook}
          />
        ))}
      </div>
    </div>
  );
};

export default ConfigContent;
