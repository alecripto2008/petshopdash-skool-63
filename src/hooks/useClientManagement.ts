
import { useState, useEffect } from 'react';
import { Contact } from '@/types/client';
import { useClientActions } from './useClientActions';
import { useClientMessage } from './useClientMessage';
import { useClientDialogs } from './useClientDialogs';

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
    fetchClients().then(newContacts => setContacts(newContacts as Contact[]));
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailSheetOpen(true);
  };

  const handleAddContact = async () => {
    const success = await addClient(newContact);
    if (success) {
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
    }
  };

  const handleEditContact = async () => {
    if (!selectedContact) return;
    
    const success = await updateClient(selectedContact.id, newContact);
    if (success) {
      handleRefresh();
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    
    const success = await deleteClient(selectedContact.id, selectedContact.phone || '');
    if (success) {
      handleRefresh();
      setSelectedContact(null);
      setIsDetailSheetOpen(false);
      setIsDeleteDialogOpen(false);
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
    if (!messageText.trim() || !selectedContact) return;
    
    setIsMessageDialogOpen(false);
    setIsPauseDurationDialogOpen(true);
  };

  const handlePauseDurationConfirm = async (duration: number | null) => {
    if (!selectedContact) return;
    
    const success = await sendMessage(selectedContact.phone || '', messageText, duration);
    if (success) {
      setIsPauseDurationDialogOpen(false);
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
