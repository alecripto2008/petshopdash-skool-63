
import { useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
      // Functionality disabled
      toast({
        title: "Funcionalidade desativada",
        description: "A verificação de status de conexão foi desativada.",
        variant: "destructive"
      });
      
      // Simulate failure after some attempts to avoid hanging in waiting state
      retryCountRef.current += 1;
      if (retryCountRef.current >= maxRetries) {
        stopChecking();
        onStatusChange('failed');
        retryCountRef.current = 0;
        onRetryNeeded();
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
