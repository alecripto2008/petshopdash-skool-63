
import { toast } from '@/hooks/use-toast';

export const useClientMessage = () => {
  const sendMessage = async (phone: string, message: string, pauseDuration: number | null) => {
    try {
      const response = await fetch('https://webhook.n8nlabz.com.br/webhook/envia_mensagem', {
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
    }
  };

  return { sendMessage };
};
