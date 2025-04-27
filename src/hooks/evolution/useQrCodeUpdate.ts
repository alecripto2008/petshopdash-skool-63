
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WEBHOOK_IDENTIFIERS } from '@/types/webhook';

export const useQrCodeUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateQrCode = async (instanceName: string) => {
    try {
      setIsLoading(true);
      toast({
        title: "Funcionalidade desativada",
        description: "A atualização de QR code foi temporariamente desativada.",
        variant: "destructive"
      });
      return null;
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
