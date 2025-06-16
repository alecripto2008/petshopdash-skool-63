
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ClientsHeader from '@/components/clients/ClientsHeader';
import ClientSearchBar from '@/components/clients/ClientSearchBar';
import ClientsTable from '@/components/clients/ClientsTable';
import AddClientDialog from '@/components/clients/AddClientDialog';
import EditClientDialog from '@/components/clients/EditClientDialog';
import ClientDetailSheet from '@/components/clients/ClientDetailSheet';
import { useClientManagement } from '@/hooks/useClientManagement';
import { useIsMobile } from '@/hooks/use-mobile';
import { Contact } from '@/types/client';

interface MonthGroup {
  name: string;
  clients: Contact[];
}

const ClientsDashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [expandedMonth, setExpandedMonth] = React.useState<string | null>(null);
  const isMobile = useIsMobile();
  
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

  // Filtrar clientes primeiro
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.petName && contact.petName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.phone && contact.phone.includes(searchTerm))
  );

  // Separação dos clientes por mês
  const clientsByMonth = React.useMemo(() => {
    const grouped: Record<string, MonthGroup> = filteredContacts.reduce((acc, contact) => {
      // Corrigir a manipulação da data
      let date: Date;
      
      if (contact.lastContact && contact.lastContact !== 'Desconhecido') {
        // Se lastContact está no formato DD/MM/YYYY, converter para YYYY-MM-DD
        if (contact.lastContact.includes('/')) {
          const parts = contact.lastContact.split('/');
          if (parts.length === 3) {
            // DD/MM/YYYY -> YYYY-MM-DD
            date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          } else {
            date = new Date();
          }
        } else {
          // Assumir que já está em formato ISO
          date = new Date(contact.lastContact);
        }
      } else {
        date = new Date();
      }
      
      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        date = new Date();
      }
      
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
    }, {} as Record<string, MonthGroup>);

    return Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([, value]) => value);
  }, [filteredContacts]);

  const toggleMonthExpansion = (monthName: string) => {
    if (expandedMonth === monthName) {
      setExpandedMonth(null);
    } else {
      setExpandedMonth(monthName);
    }
  };

  const renderClientsGroup = (monthGroup: MonthGroup) => {
    const isExpanded = expandedMonth === monthGroup.name;
    
    if (isMobile) {
      return (
        <Card key={monthGroup.name} className="mb-6">
          <CardHeader className="cursor-pointer" onClick={() => toggleMonthExpansion(monthGroup.name)}>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium capitalize">
                {monthGroup.name}
              </CardTitle>
              <div className="flex items-center">
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
          </CardHeader>
          {isExpanded && (
            <CardContent className="p-0">
              <ClientsTable 
                contacts={monthGroup.clients}
                isLoading={loadingContacts}
                searchTerm=""
                onContactClick={handleContactClick}
              />
            </CardContent>
          )}
          <CardFooter className="bg-slate-50 dark:bg-slate-900 border-t flex justify-between p-4">
            <span className="text-sm text-muted-foreground">
              {monthGroup.clients.length} {monthGroup.clients.length === 1 ? 'cliente' : 'clientes'}
            </span>
            <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
              {monthGroup.clients.length}
            </Badge>
          </CardFooter>
        </Card>
      );
    }
    
    return (
      <div className="mb-8" key={monthGroup.name}>
        <div 
          className="flex justify-between items-center mb-2 cursor-pointer"
          onClick={() => toggleMonthExpansion(monthGroup.name)}
        >
          <h3 className="text-lg font-medium capitalize flex items-center">
            {monthGroup.name}
            {isExpanded ? (
              <ChevronUp className="ml-2 h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="ml-2 h-5 w-5 text-gray-500" />
            )}
          </h3>
          <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
            {monthGroup.clients.length} {monthGroup.clients.length === 1 ? 'cliente' : 'clientes'}
          </Badge>
        </div>
        
        {isExpanded && (
          <ClientsTable 
            contacts={monthGroup.clients}
            isLoading={loadingContacts}
            searchTerm=""
            onContactClick={handleContactClick}
          />
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-petshop-blue dark:bg-gray-900">
      <div className="h-16 w-16 border-4 border-t-transparent border-petshop-gold rounded-full animate-spin"></div>
    </div>;
  }

  const totalClientes = filteredContacts.length;

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
          <CardContent className="p-6">
            {clientsByMonth.length > 0 ? (
              <div>
                {clientsByMonth.map(monthGroup => renderClientsGroup(monthGroup))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'Nenhum cliente encontrado com os critérios de busca.' : 'Nenhum cliente cadastrado.'}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between w-full text-sm text-gray-500 dark:text-gray-400">
              <span>
                Total de clientes: {totalClientes}
              </span>
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
