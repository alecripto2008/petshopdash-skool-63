
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

export const useClientMessage = () => {
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (phone: string, message: string, pauseDuration: number | null) => {
    try {
      setIsSending(true);
      
      // Since the webhook URL has been removed, we'll just show a notification
      toast({
        title: "Funcionalidade desativada",
        description: "A funcionalidade de envio de mensagens foi temporariamente desativada.",
        variant: "destructive",
      });
      
      return false;
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
