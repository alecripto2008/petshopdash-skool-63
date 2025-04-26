
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import type { WebhookConfig } from '@/types/webhook';

const ConfigContent = () => {
  const [configs, setConfigs] = useState<WebhookConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('webhook_configs')
        .select('*')
        .order('name');

      if (error) throw error;
      setConfigs(data as WebhookConfig[]);
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
