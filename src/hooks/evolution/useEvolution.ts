
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQrCodeUpdate } from './useQrCodeUpdate';
import { useConnectionStatus } from './useConnectionStatus';

export const useEvolution = () => {
  const [instanceName, setInstanceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [confirmationStatus, setConfirmationStatus] = useState<'waiting' | 'confirmed' | 'failed' | null>(null);
  const { toast } = useToast();
  const { updateQrCode, isLoading: isUpdatingQr } = useQrCodeUpdate();
  const { startChecking, stopChecking, retryCount, maxRetries } = useConnectionStatus(
    instanceName,
    setConfirmationStatus,
    () => {
      toast({
        title: "Falha na conexão",
        description: "Não foi possível conectar após várias tentativas.",
        variant: "destructive"
      });
    }
  );

  const handleCreateInstance = async () => {
    if (!instanceName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe um nome para a instância.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setQrCodeData(null);
    setConfirmationStatus(null);
    
    try {
      toast({
        title: "Funcionalidade desativada",
        description: "A criação de instâncias foi temporariamente desativada.",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a instância. Tente novamente.",
        variant: "destructive"
      });
      setConfirmationStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setIsLoading(true);
    setQrCodeData(null);
    setConfirmationStatus(null);
    handleCreateInstance();
  };

  const resetQrCode = () => {
    setQrCodeData(null);
    setConfirmationStatus(null);
    stopChecking();
  };

  return {
    instanceName,
    setInstanceName,
    isLoading: isLoading || isUpdatingQr,
    qrCodeData,
    confirmationStatus,
    retryCount,
    maxRetries,
    handleCreateInstance,
    handleTryAgain,
    resetQrCode,
    updateQrCode
  };
};

export default useEvolution;
