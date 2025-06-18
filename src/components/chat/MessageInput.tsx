
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Conversation } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { getWebhookUrl } from '@/services/webhookService';
import { WEBHOOK_IDENTIFIERS } from '@/types/webhook';

interface MessageInputProps {
  selectedChat: string | null;
  selectedConversation?: Conversation;
}

const MessageInput = ({ selectedChat, selectedConversation }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !selectedConversation?.phone) return;
    
    try {
      setIsSending(true);
      
      console.log('Getting webhook URL for sending message...');
      console.log('Looking for identifier:', WEBHOOK_IDENTIFIERS.CHAT_ENVIAR_MENSAGEM);
      const webhookUrl = await getWebhookUrl(WEBHOOK_IDENTIFIERS.CHAT_ENVIAR_MENSAGEM);
      
      console.log('Webhook URL found:', webhookUrl);
      
      if (!webhookUrl) {
        console.error('Webhook URL is empty or null');
        throw new Error('Webhook de envio de mensagem não configurado');
      }
      
      console.log('Sending message to webhook:', webhookUrl);
      console.log('Message data:', {
        message: newMessage,
        phoneNumber: selectedConversation.phone,
      });
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          phoneNumber: selectedConversation.phone,
        }),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Falha ao enviar mensagem');
      }
      
      setNewMessage('');
      
      toast({
        title: 'Mensagem enviada',
        description: 'Sua mensagem foi enviada com sucesso.',
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erro ao enviar mensagem',
        description: 'Não foi possível enviar sua mensagem. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Digite uma mensagem"
          className="flex-1"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isSending}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="bg-green-500 hover:bg-green-600 text-white"
          disabled={isSending}
        >
          <Send size={18} />
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
