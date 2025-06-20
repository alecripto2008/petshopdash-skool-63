
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getWebhookUrl } from '@/services/webhookService';
import { WEBHOOK_IDENTIFIERS } from '@/types/webhook';

export const useQrCodeUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateQrCode = async (instanceName: string) => {
    try {
      setIsLoading(true);
      console.log('Updating QR code for instance:', instanceName);
      const webhookUrl = await getWebhookUrl(WEBHOOK_IDENTIFIERS.UPDATE_EVOLUTION_QR);
      
      if (!webhookUrl) {
        throw new Error('Webhook de atualização de QR code não configurado');
      }
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          instanceName: instanceName.trim() 
        }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const qrCodeUrl = URL.createObjectURL(blob);
        toast({
          title: "QR Code atualizado",
          description: "Escaneie o novo QR code para conectar seu WhatsApp.",
        });
        return qrCodeUrl;
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar QR code:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o QR code.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateQrCode,
    isLoading
  };
};
