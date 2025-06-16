
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ClientsHeader from '@/components/clients/ClientsHeader';
import ClientSearchBar from '@/components/clients/ClientSearchBar';
import ClientsTable from '@/components/clients/ClientsTable';
import AddClientDialog from '@/components/clients/AddClientDialog';
import EditClientDialog from '@/components/clients/EditClientDialog';
import ClientDetailSheet from '@/components/clients/ClientDetailSheet';
import { useClientManagement } from '@/hooks/useClientManagement';

const ClientsDashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const {
    contacts,
    loadingContacts,
    refreshing,
    selectedContact,
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
  } = useClientManagement();

  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  // Separação dos clientes por mês
  const clientsByMonth = React.useMemo(() => {
    const grouped = contacts.reduce((acc, contact) => {
      const date = contact.lastContact ? new Date(contact.lastContact.split('/').reverse().join('-')) : new Date();
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          name: monthName,
          clients: []
        };
      }
      acc[monthKey].clients.push(contact);
      return acc;
    }, {});

    return Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, value]) => value);
  }, [contacts]);

  // Total de clientes do mês atual
  const currentMonth = React.useMemo(() => {
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    return clientsByMonth.find(month => month.name.includes(now.getFullYear().toString()) && 
      month.name.toLowerCase().includes(now.toLocaleDateString('pt-BR', { month: 'long' }).toLowerCase()));
  }, [clientsByMonth]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-petshop-blue dark:bg-gray-900">
      <div className="h-16 w-16 border-4 border-t-transparent border-petshop-gold rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <ClientsHeader />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="border dark:border-gray-700 shadow-sm">
          <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Gerenciamento de Clientes</CardTitle>
                <CardDescription>Visualize, adicione e edite seus clientes</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <ClientSearchBar 
                  searchTerm={searchTerm}
                  onSearchTermChange={setSearchTerm}
                  onRefresh={handleRefresh}
                  isRefreshing={refreshing}
                  isLoading={loadingContacts}
                  onAddClient={() => setIsAddContactOpen(true)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Separação por mês */}
            {clientsByMonth.map((monthGroup, index) => (
              <div key={index} className="border-b dark:border-gray-700 last:border-b-0">
                <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-b dark:border-gray-700">
                  <h3 className="text-lg font-semibold capitalize">{monthGroup.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {monthGroup.clients.length} cliente{monthGroup.clients.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <ClientsTable 
                  contacts={monthGroup.clients}
                  isLoading={loadingContacts}
                  searchTerm={searchTerm}
                  onContactClick={handleContactClick}
                />
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between w-full text-sm text-gray-500 dark:text-gray-400">
              <span>
                Total de clientes: {contacts.filter(contact =>
                  contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (contact.petName && contact.petName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (contact.phone && contact.phone.includes(searchTerm))
                ).length}
              </span>
              {currentMonth && (
                <span>
                  Clientes este mês: {currentMonth.clients.length}
                </span>
              )}
            </div>
          </CardFooter>
        </Card>
      </main>

      <AddClientDialog 
        isOpen={isAddContactOpen}
        onOpenChange={setIsAddContactOpen}
        newContact={newContact}
        setNewContact={setNewContact}
        handleAddContact={handleAddContact}
      />

      <ClientDetailSheet 
        isOpen={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
        selectedContact={selectedContact}
        onEditClick={openEditModal}
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
        onSendMessageClick={handleMessageClick}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handleDeleteContact={handleDeleteContact}
        isMessageDialogOpen={isMessageDialogOpen}
        setIsMessageDialogOpen={setIsMessageDialogOpen}
        messageText={messageText}
        setMessageText={setMessageText}
        handleMessageSubmit={handleMessageSubmit}
        isPauseDurationDialogOpen={isPauseDurationDialogOpen}
        setIsPauseDurationDialogOpen={setIsPauseDurationDialogOpen}
        handlePauseDurationConfirm={handlePauseDurationConfirm}
      />
      
      <EditClientDialog 
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        selectedContact={selectedContact}
        editContactData={newContact}
        setEditContactData={setNewContact}
        handleEditContact={handleEditContact}
      />
    </div>
  );
};

export default ClientsDashboard;
