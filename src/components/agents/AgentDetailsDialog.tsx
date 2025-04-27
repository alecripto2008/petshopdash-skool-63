
import React from 'react';
import { Bot, Check, Trash, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Agent } from '@/types/agent';

interface AgentDetailsDialogProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onActivate: (agent: Agent) => void;
  onDelete: () => void;
}

export const AgentDetailsDialog = ({
  agent,
  isOpen,
  onClose,
  onActivate,
  onDelete,
}: AgentDetailsDialogProps) => {
  if (!agent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Detalhes do Agente
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{agent.name}</h2>
              <p className="text-muted-foreground">{agent.company} • {agent.industry}</p>
            </div>
            {agent.isActive && (
              <div className="flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                <Check className="h-3 w-3" />
                Ativo
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Produto/Serviço</h3>
              <p className="text-sm">{agent.mainProduct}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Estratégia</h3>
              <p className="text-sm">{agent.strategy}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Personalidade</h3>
              <p className="text-sm">{agent.personality}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Objetivo</h3>
              <p className="text-sm">{agent.objective}</p>
            </div>
            
            <div className="space-y-2 col-span-2">
              <h3 className="font-medium">Estilo de Pensamento</h3>
              <p className="text-sm">{agent.thinkingStyle}</p>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            {!agent.isActive && (
              <Button 
                variant="default" 
                onClick={() => {
                  onActivate(agent);
                  onClose();
                }}
              >
                <Check className="mr-2 h-4 w-4" />
                Ativar Agente
              </Button>
            )}
            
            <Button 
              variant="destructive" 
              onClick={onDelete}
            >
              <Trash className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
