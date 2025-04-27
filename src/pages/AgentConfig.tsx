import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Bot, Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getWebhookUrl } from '@/services/webhookService';
import { WEBHOOK_IDENTIFIERS } from '@/types/webhook';
import { Agent, AgentFormValues } from '@/types/agent';
import { ActiveAgentCard } from '@/components/agents/ActiveAgentCard';
import { AgentForm } from '@/components/agents/AgentForm';
import { AgentList } from '@/components/agents/AgentList';
import { AgentDetailsDialog } from '@/components/agents/AgentDetailsDialog';

// Mock data for predefined agents
const predefinedAgents: Agent[] = [
  {
    id: '1',
    name: 'Nina',
    company: 'Pet Paradise',
    industry: 'Pet Shop',
    mainProduct: 'Produtos premium para pets e serviços de banho e tosa',
    strategy: 'Personalizado, prático e voltado para um atendimento premium',
    personality: 'Amigável, amorosa com os pets, detalhista e conhecedora de animais',
    objective: 'Aumentar vendas e satisfação dos clientes',
    thinkingStyle: 'Uma especialista em animais que ama pets',
    isActive: true
  },
  {
    id: '2',
    name: 'Carlos',
    company: 'Tech Solutions',
    industry: 'Tecnologia',
    mainProduct: 'Software e soluções de TI',
    strategy: 'Técnico, objetivo e focado em soluções rápidas',
    personality: 'Analítico, preciso e especialista em tecnologia',
    objective: 'Resolver problemas técnicos e vender soluções B2B',
    thinkingStyle: 'Um engenheiro de software experiente',
    isActive: false
  },
  {
    id: '3',
    name: 'Marina',
    company: 'Bella Moda',
    industry: 'Moda',
    mainProduct: 'Roupas e acessórios femininos',
    strategy: 'Consultivo, focado em estilo e tendências',
    personality: 'Estilosa, atualizada e preocupada com o bem-estar do cliente',
    objective: 'Ajudar clientes a encontrarem seu estilo e aumentar vendas',
    thinkingStyle: 'Uma consultora de moda profissional',
    isActive: false
  }
];

const AgentConfig = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [agents, setAgents] = useState<Agent[]>(predefinedAgents);
  const [isNewAgentDialogOpen, setIsNewAgentDialogOpen] = useState(false);
  const [isAgentDetailsOpen, setIsAgentDetailsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-16 w-16 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const sendAgentDataToWebhook = async (agentData: AgentFormValues) => {
    try {
      const webhookUrl = await getWebhookUrl(WEBHOOK_IDENTIFIERS.CONFIG_AGENT);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao enviar dados do agente para o webhook');
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao enviar dados para o webhook:', error);
      toast({
        title: "Erro ao sincronizar agente",
        description: "Os dados foram salvos localmente, mas houve um problema ao sincronizar com o sistema externo.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleCreateAgent = async (data: AgentFormValues) => {
    setIsSubmitting(true);
    
    const newAgent: Agent = {
      id: Date.now().toString(),
      ...data,
      isActive: false
    };

    await sendAgentDataToWebhook(data);
    setAgents([...agents, newAgent]);
    setIsNewAgentDialogOpen(false);
    setIsSubmitting(false);
    
    toast({
      title: "Agente criado com sucesso!",
      description: `O agente ${data.name} foi adicionado à sua lista.`,
    });
  };

  const handleSelectAgent = (agent: Agent) => {
    const updatedAgents = agents.map(a => ({
      ...a,
      isActive: a.id === agent.id
    }));
    
    setAgents(updatedAgents);
    
    toast({
      title: "Agente ativado",
      description: `${agent.name} agora é seu agente ativo.`,
    });
  };

  const handleDeleteAgent = () => {
    if (!selectedAgent) return;
    
    setAgents(agents.filter(a => a.id !== selectedAgent.id));
    setDeleteConfirmOpen(false);
    setIsAgentDetailsOpen(false);
    setSelectedAgent(null);
    
    toast({
      title: "Agente excluído",
      description: "O agente foi removido com sucesso.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="outline" onClick={handleGoBack} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Configuração do Agente</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <ActiveAgentCard
            activeAgent={agents.find(agent => agent.isActive)}
            onCreateClick={() => setIsNewAgentDialogOpen(true)}
            onViewDetails={(agent) => {
              setSelectedAgent(agent);
              setIsAgentDetailsOpen(true);
            }}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Criar Novo Agente
              </CardTitle>
              <CardDescription>
                Defina um novo assistente personalizado
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-6">
              <Dialog open={isNewAgentDialogOpen} onOpenChange={setIsNewAgentDialogOpen}>
                <Button size="lg" className="w-full" onClick={() => setIsNewAgentDialogOpen(true)}>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Novo Agente
                </Button>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Agente</DialogTitle>
                    <DialogDescription>
                      Configure os detalhes do seu novo assistente virtual.
                    </DialogDescription>
                  </DialogHeader>
                  <AgentForm
                    onSubmit={handleCreateAgent}
                    onCancel={() => setIsNewAgentDialogOpen(false)}
                    isSubmitting={isSubmitting}
                  />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Agentes Disponíveis
            </CardTitle>
            <CardDescription>
              Selecione ou gerencie seus agentes pré-configurados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AgentList
              agents={agents}
              onSelectAgent={handleSelectAgent}
              onViewDetails={(agent) => {
                setSelectedAgent(agent);
                setIsAgentDetailsOpen(true);
              }}
            />
          </CardContent>
        </Card>

        <AgentDetailsDialog
          agent={selectedAgent}
          isOpen={isAgentDetailsOpen}
          onClose={() => {
            setIsAgentDetailsOpen(false);
            setSelectedAgent(null);
          }}
          onActivate={handleSelectAgent}
          onDelete={() => setDeleteConfirmOpen(true)}
        />

        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este agente? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteAgent}>
                <Trash className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AgentConfig;
