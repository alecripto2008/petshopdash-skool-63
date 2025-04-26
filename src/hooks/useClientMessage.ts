
import { toast } from '@/hooks/use-toast';
import { getWebhookUrl } from '@/services/webhookService';
import { WEBHOOK_IDENTIFIERS } from '@/types/webhook';
import { useState } from 'react';

export const useClientMessage = () => {
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (phone: string, message: string, pauseDuration: number | null) => {
    try {
      setIsSending(true);
      const webhookUrl = await getWebhookUrl(WEBHOOK_IDENTIFIERS.SEND_MESSAGE);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          message,
          pauseDuration
        }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao enviar dados para o webhook');
      }
      
      toast({
        title: "Mensagem enviada",
        description: pauseDuration === null 
          ? `Mensagem enviada sem pausar o bot.` 
          : `Mensagem enviada e bot pausado por ${pauseDuration} segundos.`,
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar a mensagem para o servidor.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return { sendMessage, isSending };
};
