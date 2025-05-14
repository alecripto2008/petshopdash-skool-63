import { useState, useEffect } from 'react';
import { Contact } from '@/types/client';
import { useClientActions } from './useClientActions';
import { useClientMessage } from './useClientMessage';
import { useClientDialogs } from './useClientDialogs';
import { toast } from '@/components/ui/use-toast'; // Importando a função toast

export const useClientManagement = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  const {
    loadingContacts,
    refreshing,
    setRefreshing,
    fetchClients,
    addClient,
    updateClient,
    deleteClient
  } = useClientActions();
  
  const { sendMessage } = useClientMessage();
  
  const {
    selectedContact,
    setSelectedContact,
    isAddContactOpen,
    setIsAddContactOpen,
    isDetailSheetOpen,
    setIsDetailSheetOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isMessageDialogOpen,
    setIsMessageDialogOpen,
    isPauseDurationDialogOpen,
    setIsPauseDurationDialogOpen,
    messageText,
    setMessageText,
    newContact,
    setNewContact
  } = useClientDialogs();

  const handleRefresh = () => {
    setRefreshing(true);
    fetchClients().then(newContacts => setContacts(newContacts as Contact[]))
      .finally(() => setRefreshing(false)); // Adicionado para garantir que refreshing seja false
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailSheetOpen(true);
  };

  const handleAddContact = async () => {
    // Adicionando um check para campos obrigatórios básicos, como nome e telefone
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Erro ao Adicionar Cliente",
        description: "Nome e telefone são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    const result = await addClient(newContact);
    if (result && result.success) {
      setIsAddContactOpen(false);
      handleRefresh();
      setNewContact({
        name: '',
        email: '',
        phone: '',
        address: '',
        petName: '',
        petSize: '',
        petBreed: '',
        cpfCnpj: '',
        asaasCustomerId: '',
        status: 'Active',
        notes: '',
      });
      toast({
        title: "Cliente Adicionado!",
        description: `O cliente ${newContact.name} foi adicionado com sucesso.`,
        variant: "default", // ou success se houver
      });
    } else {
      toast({
        title: "Erro ao Adicionar Cliente",
        description: result?.error || "Não foi possível adicionar o cliente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditContact = async () => {
    if (!selectedContact) return;
    // Adicionando um check para campos obrigatórios básicos, como nome e telefone
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Erro ao Editar Cliente",
        description: "Nome e telefone são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    const result = await updateClient(selectedContact.id, newContact);
    if (result && result.success) {
      handleRefresh();
      setIsEditModalOpen(false);
      toast({
        title: "Cliente Atualizado!",
        description: `Os dados do cliente ${newContact.name} foram atualizados com sucesso.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Erro ao Editar Cliente",
        description: result?.error || "Não foi possível atualizar o cliente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    
    const result = await deleteClient(selectedContact.id, selectedContact.phone || '');
    if (result && result.success) {
      handleRefresh();
      setSelectedContact(null);
      setIsDetailSheetOpen(false);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Cliente Excluído!",
        description: `O cliente ${selectedContact.name} foi excluído com sucesso.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Erro ao Excluir Cliente",
        description: result?.error || "Não foi possível excluir o cliente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const openEditModal = () => {
    if (!selectedContact) return;
    setNewContact({
      name: selectedContact.name,
      email: selectedContact.email,
      phone: selectedContact.phone,
      address: selectedContact.address,
      petName: selectedContact.petName,
      petSize: selectedContact.petSize,
      petBreed: selectedContact.petBreed,
      cpfCnpj: selectedContact.cpfCnpj,
      asaasCustomerId: selectedContact.asaasCustomerId,
      payments: selectedContact.payments,
      status: selectedContact.status,
      notes: selectedContact.notes,
    });
    setIsEditModalOpen(true);
  };

  const handleMessageClick = () => {
    setMessageText('');
    setIsMessageDialogOpen(true);
  };

  const handleMessageSubmit = () => {
    if (!messageText.trim() || !selectedContact) {
      // Adiciona toast se a mensagem estiver vazia ou nenhum contato selecionado
      if (!messageText.trim()) {
        toast({
          title: "Mensagem Vazia",
          description: "Por favor, escreva uma mensagem para enviar.",
          variant: "destructive",
        });
      }
      return;
    }
    
    setIsMessageDialogOpen(false);
    setIsPauseDurationDialogOpen(true);
  };

  const handlePauseDurationConfirm = async (duration: number | null) => {
    if (!selectedContact || !selectedContact.phone) {
        toast({
            title: "Erro ao Enviar Mensagem",
            description: "Nenhum contato ou telefone selecionado.",
            variant: "destructive",
        });
        return;
    }
    
    const result = await sendMessage(selectedContact.phone, messageText, duration);
    if (result && result.success) {
      setIsPauseDurationDialogOpen(false);
      setMessageText(''); // Limpa o texto da mensagem após o envio
      toast({
        title: "Mensagem Enviada!",
        description: `Mensagem enviada para ${selectedContact.name}.`,
        variant: "default",
      });
    } else {
      setIsPauseDurationDialogOpen(false); // Fecha o diálogo mesmo em caso de erro
      toast({
        title: "Erro ao Enviar Mensagem",
        description: result?.error || "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    fetchClients().then(newContacts => setContacts(newContacts as Contact[]));
  }, []);

  return {
    contacts,
    loadingContacts,
    refreshing,
    selectedContact,
    setSelectedContact,
    isAddContactOpen,
    setIsAddContactOpen,
    isDetailSheetOpen,
    setIsDetailSheetOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isMessageDialogOpen,
    setIsMessageDialogOpen,
    isPauseDurationDialogOpen,
    setIsPauseDurationDialogOpen,
    messageText,
    setMessageText,
    newContact,
    setNewContact,
    handleRefresh,
    handleContactClick,
    handleAddContact,
    handleEditContact,
    handleDeleteContact,
    openEditModal,
    handleMessageClick,
    handleMessageSubmit,
    handlePauseDurationConfirm
  };
};
