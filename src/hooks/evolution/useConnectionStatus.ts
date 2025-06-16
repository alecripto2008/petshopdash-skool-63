
import { useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getWebhookUrl } from '@/services/webhookService';
import { WEBHOOK_IDENTIFIERS } from '@/types/webhook';

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
      const webhookUrl = await getWebhookUrl(WEBHOOK_IDENTIFIERS.CONFIRM_EVOLUTION_STATUS);
      
      if (!webhookUrl) {
        throw new Error('Webhook de verificação de status não configurado');
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
            console.log('Connection confirmed - stopping interval');
            stopChecking();
            onStatusChange('confirmed');
            retryCountRef.current = 0;
            toast({
              title: "Conexão estabelecida!",
              description: "Seu WhatsApp foi conectado com sucesso.",
              variant: "default" 
            });
          } else if (status === "negativo") {
            retryCountRef.current += 1;
            console.log(`Connection failed - attempt ${retryCountRef.current} of ${maxRetries}`);
            
            if (retryCountRef.current >= maxRetries) {
              console.log('Maximum retry attempts reached');
              stopChecking();
              onStatusChange('failed');
              retryCountRef.current = 0;
              onRetryNeeded();
            } else {
              console.log(`Retrying... (${retryCountRef.current}/${maxRetries})`);
              toast({
                title: "Tentando novamente",
                description: `Tentativa ${retryCountRef.current} de ${maxRetries}`,
                variant: "default"
              });
            }
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
