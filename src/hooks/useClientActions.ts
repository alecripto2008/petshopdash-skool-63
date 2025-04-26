
import { useState } from 'react';
import { Contact } from '@/types/client';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useClientActions = () => {
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchClients = async () => {
    try {
      setLoadingContacts(true);
      
      const { data, error } = await supabase
        .from('dados_cliente')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedContacts = data.map(client => ({
          id: client.id.toString(),
          name: client.nome || 'Cliente sem nome',
          email: client.email,
          phone: client.telefone,
          petName: client.nome_pet,
          petSize: client.porte_pet,
          petBreed: client.raca_pet,
          cpfCnpj: client.cpf_cnpj,
          asaasCustomerId: client.asaas_customer_id,
          payments: client.payments,
          status: 'Active' as 'Active' | 'Inactive',
          notes: '',
          lastContact: client.created_at ? new Date(client.created_at).toLocaleDateString('pt-BR') : 'Desconhecido'
        }));
        
        return formattedContacts;
      }
      return [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Ocorreu um erro ao buscar os clientes do banco de dados.",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoadingContacts(false);
      setRefreshing(false);
    }
  };

  const addClient = async (newContact) => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e telefone são campos obrigatórios.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      const { data, error } = await supabase
        .from('dados_cliente')
        .insert([
          {
            nome: newContact.name,
            email: newContact.email,
            telefone: newContact.phone,
            nome_pet: newContact.petName,
            porte_pet: newContact.petSize,
            raca_pet: newContact.petBreed,
            cpf_cnpj: newContact.cpfCnpj,
            asaas_customer_id: newContact.asaasCustomerId,
            payments: newContact.payments || null
          }
        ])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        toast({
          title: "Cliente adicionado",
          description: `${newContact.name} foi adicionado com sucesso.`,
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      toast({
        title: "Erro ao adicionar cliente",
        description: "Não foi possível salvar o cliente no banco de dados.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateClient = async (clientId, updatedData) => {
    try {
      const { error } = await supabase
        .from('dados_cliente')
        .update({
          nome: updatedData.name,
          email: updatedData.email,
          telefone: updatedData.phone,
          nome_pet: updatedData.petName,
          porte_pet: updatedData.petSize,
          raca_pet: updatedData.petBreed,
          cpf_cnpj: updatedData.cpfCnpj,
          asaas_customer_id: updatedData.asaasCustomerId,
          payments: updatedData.payments
        })
        .eq('id', parseInt(clientId));
      
      if (error) throw error;
      
      toast({
        title: "Cliente atualizado",
        description: `As informações do cliente foram atualizadas.`,
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro ao atualizar cliente",
        description: "Não foi possível atualizar o cliente no banco de dados.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteClient = async (clientId, phone) => {
    try {
      const { error } = await supabase
        .from('dados_cliente')
        .delete()
        .eq('id', parseInt(clientId));
      
      if (error) throw error;
      
      toast({
        title: "Cliente removido",
        description: "O cliente foi removido da sua lista de clientes.",
        variant: "destructive",
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast({
        title: "Erro ao remover cliente",
        description: "Não foi possível remover o cliente do banco de dados.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    loadingContacts,
    refreshing,
    setRefreshing,
    fetchClients,
    addClient,
    updateClient,
    deleteClient
  };
};
