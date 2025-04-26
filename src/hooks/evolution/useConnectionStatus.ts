
import { useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getWebhookUrl } from '@/services/webhookService';

type ConnectionStatus = 'waiting' | 'confirmed' | 'failed' | null;

export const useConnectionStatus = (
  instanceName: string,
  onStatusChange: (status: ConnectionStatus) => void,
  onRetryNeeded: () => void
) => {
  const statusCheckIntervalRef = useRef<number | null>(null);
  const retryCountRef = useRef<number>(0);
  const maxRetries = 3;
  const { toast } = useToast();

  const checkConnectionStatus = async () => {
    try {
      console.log('Checking connection status for:', instanceName);
      const webhookUrl = await getWebhookUrl('confirm_evolution_status');
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          instanceName: instanceName.trim() 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to check connection status');
      }

      const responseText = await response.text();
      console.log('Connection status response:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Parsed response data:', responseData);
      } catch (parseError) {
        console.error('Error parsing response JSON:', parseError);
        toast({
          title: "Erro no formato da resposta",
          description: "Não foi possível processar a resposta do servidor.",
          variant: "destructive"
        });
        return;
      }
      
      if (responseData && typeof responseData.respond === 'string') {
        const status = responseData.respond;
        console.log('Response status value:', status);
        
        if (status === "positivo") {
          stopChecking();
          onStatusChange('confirmed');
          retryCountRef.current = 0;
          toast({
            title: "Conexão estabelecida!",
            description: "Seu WhatsApp foi conectado com sucesso.",
          });
        } else if (status === "negativo") {
          retryCountRef.current += 1;
          console.log(`Connection failed - attempt ${retryCountRef.current} of ${maxRetries}`);
          
          if (retryCountRef.current >= maxRetries) {
            stopChecking();
            onStatusChange('failed');
            retryCountRef.current = 0;
            onRetryNeeded();
          } else {
            toast({
              title: "Tentando novamente",
              description: `Tentativa ${retryCountRef.current} de ${maxRetries}`,
              variant: "default"
            });
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status da conexão:', error);
      toast({
        title: "Erro de conexão",
        description: "Ocorreu um erro ao verificar o status da conexão.",
        variant: "destructive"
      });
    }
  };

  const startChecking = () => {
    if (statusCheckIntervalRef.current !== null) {
      stopChecking();
    }
    statusCheckIntervalRef.current = window.setInterval(checkConnectionStatus, 10000);
  };

  const stopChecking = () => {
    if (statusCheckIntervalRef.current !== null) {
      clearInterval(statusCheckIntervalRef.current);
      statusCheckIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopChecking();
    };
  }, []);

  return {
    startChecking,
    stopChecking,
    retryCount: retryCountRef.current,
    maxRetries
  };
};
