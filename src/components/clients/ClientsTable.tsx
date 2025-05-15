
import React, { useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableFooter 
} from '@/components/ui/table';
import { Contact } from '@/types/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface ClientsTableProps {
  contacts: Contact[];
  isLoading: boolean;
  searchTerm: string;
  onContactClick: (contact: Contact) => void;
}

const ClientsTable = ({ 
  contacts, 
  isLoading, 
  searchTerm,
  onContactClick 
}: ClientsTableProps) => {
  const isMobile = useIsMobile();

  // Filtrar contatos baseado no termo de busca
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.petName && contact.petName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.phone && contact.phone.includes(searchTerm))
    );
  }, [contacts, searchTerm]);

  // Agrupar contatos por mês
  const contactsByMonth = useMemo(() => {
    const groupedContacts = {};
    
    filteredContacts.forEach(contact => {
      if (!contact.lastContact) return;
      
      // Extrair mês e ano da data do último contato
      const dateParts = contact.lastContact.split('/');
      if (dateParts.length < 3) return;
      
      const month = parseInt(dateParts[1], 10);
      const year = parseInt(dateParts[2], 10);
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
      const monthLabel = `${getMonthName(month)}/${year}`;
      
      if (!groupedContacts[monthKey]) {
        groupedContacts[monthKey] = {
          label: monthLabel,
          contacts: []
        };
      }
      
      groupedContacts[monthKey].contacts.push(contact);
    });
    
    // Ordenar os meses em ordem decrescente (mais recentes primeiro)
    return Object.entries(groupedContacts)
      .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
      .map(([key, value]) => value);
  }, [filteredContacts]);

  function getMonthName(monthNumber) {
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return monthNames[monthNumber - 1];
  }

  // Renderiza a tabela dependendo do tamanho da tela
  return (
    <div className="overflow-x-auto">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-24">
          <div className="h-8 w-8 border-4 border-t-transparent border-petshop-blue rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Carregando clientes...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-10">
          {searchTerm 
            ? 'Nenhum cliente encontrado com esse termo de busca.' 
            : 'Nenhum cliente disponível. Adicione seu primeiro cliente!'}
        </div>
      ) : (
        <>
          {contactsByMonth.map((monthGroup, monthIndex) => (
            <div key={monthIndex} className="mb-8">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-t-lg font-medium">
                {monthGroup.label} - {monthGroup.contacts.length} cliente(s)
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isMobile ? "w-[120px]" : "w-[250px]"}>Nome</TableHead>
                    {!isMobile && <TableHead>Email</TableHead>}
                    <TableHead>Telefone</TableHead>
                    {!isMobile && <TableHead>Nome do Pet</TableHead>}
                    <TableHead>Status</TableHead>
                    {!isMobile && <TableHead>Último Contato</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthGroup.contacts.map((contact) => (
                    <TableRow 
                      key={contact.id} 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => onContactClick(contact)}
                    >
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      {!isMobile && <TableCell>{contact.email || '-'}</TableCell>}
                      <TableCell>{contact.phone || '-'}</TableCell>
                      {!isMobile && <TableCell>{contact.petName || '-'}</TableCell>}
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          contact.status === 'Active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {contact.status}
                        </span>
                      </TableCell>
                      {!isMobile && <TableCell>{contact.lastContact}</TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={isMobile ? 3 : 6} className="text-right">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total do mês:</span>
                        <span>{monthGroup.contacts.length} cliente(s)</span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          ))}
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total de clientes:</span>
              <span className="font-semibold">{filteredContacts.length}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientsTable;
