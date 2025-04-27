
import React from 'react';
import { Bot, Info, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Agent } from '@/types/agent';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

interface ActiveAgentCardProps {
  activeAgent: Agent | undefined;
  onCreateClick: () => void;
  onViewDetails: (agent: Agent) => void;
}

export const ActiveAgentCard = ({ 
  activeAgent, 
  onCreateClick, 
  onViewDetails 
}: ActiveAgentCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Agente Ativo
        </CardTitle>
        <CardDescription>
          Este é o agente que está sendo usado atualmente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activeAgent ? (
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-medium">{activeAgent.name}</h3>
                <p className="text-muted-foreground">
                  {activeAgent.company} • {activeAgent.industry}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                <Check className="h-3 w-3" />
                Ativo
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Objetivo:</span> {activeAgent.objective}</p>
              <p><span className="font-medium">Personalidade:</span> {activeAgent.personality}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4" 
              onClick={() => onViewDetails(activeAgent)}
            >
              <Info className="mr-2 h-4 w-4" />
              Ver detalhes completos
            </Button>
          </div>
        ) : (
          <div className="text-center p-6">
            <Bot className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum agente ativo</h3>
            <p className="text-muted-foreground mb-4">
              Selecione um agente da lista ou crie um novo
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={onCreateClick}>
                  <Bot className="mr-2 h-4 w-4" />
                  Criar agente
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
