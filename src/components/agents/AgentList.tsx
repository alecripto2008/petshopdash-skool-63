
import React from 'react';
import { Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Agent } from '@/types/agent';

interface AgentListProps {
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
  onViewDetails: (agent: Agent) => void;
}

export const AgentList = ({ agents, onSelectAgent, onViewDetails }: AgentListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {agents.map((agent) => (
        <Card key={agent.id} className={`border ${agent.isActive ? 'border-primary' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>{agent.name}</span>
              {agent.isActive && (
                <div className="flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                  <Check className="h-3 w-3" />
                  Ativo
                </div>
              )}
            </CardTitle>
            <CardDescription>
              {agent.company} • {agent.industry}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="line-clamp-2">{agent.personality}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(agent)}
            >
              <Info className="mr-2 h-3 w-3" />
              Detalhes
            </Button>
            {!agent.isActive && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => onSelectAgent(agent)}
              >
                <Check className="mr-2 h-3 w-3" />
                Ativar
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
