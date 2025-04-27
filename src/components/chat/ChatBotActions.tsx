
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Pause } from 'lucide-react';
import PauseDurationDialog from '@/components/PauseDurationDialog';
import { getWebhookUrl } from '@/services/webhookService';
import { WEBHOOK_IDENTIFIERS } from '@/types/webhook';

interface ChatBotActionsProps {
  selectedPhoneNumber: string;
  selectedChat: string | null;
  isLoading: Record<string, boolean>;
}

const ChatBotActions = ({ selectedPhoneNumber, selectedChat, isLoading }: ChatBotActionsProps) => {
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const { toast } = useToast();

  const openPauseDialog = (phoneNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPauseDialogOpen(true);
  };

  const closePauseDialog = () => {
    setPauseDialogOpen(false);
  };

  const pauseBot = async (phoneNumber: string, duration: number | null) => {
    try {
      const webhookUrl = await getWebhookUrl(WEBHOOK_IDENTIFIERS.PAUSE_BOT);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber,
          duration,
          unit: 'seconds'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao pausar o bot');
      }
      
      toast({
        title: "Bot pausado",
        description: duration ? `O bot foi pausado para ${phoneNumber} por ${duration} segundos` : `O bot não foi pausado para ${phoneNumber}`,
      });
      
      closePauseDialog();
    } catch (error) {
      console.error('Erro ao pausar bot:', error);
      toast({
        title: "Erro ao pausar bot",
        description: "Ocorreu um erro ao tentar pausar o bot.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={(e) => openPauseDialog(selectedPhoneNumber, e)}
          disabled={isLoading?.pauseBot || !selectedPhoneNumber}
        >
          <Pause className="h-4 w-4" />
          Pausar
        </Button>
      </div>
      
      <PauseDurationDialog 
        isOpen={pauseDialogOpen}
        onClose={closePauseDialog}
        onConfirm={(duration) => pauseBot(selectedPhoneNumber, duration)}
        phoneNumber={selectedPhoneNumber}
      />
    </>
  );
};

export default ChatBotActions;
