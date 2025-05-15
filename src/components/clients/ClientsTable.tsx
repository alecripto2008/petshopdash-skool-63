
import React, { useMemo, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableFooter 
} from '@/components/ui/table';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Contact } from '@/types/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ClientsTableProps {
  contacts: Contact[];
  isLoading: boolean;
  searchTerm: string;
  onContactClick: (contact: Contact) => void;
}

// Define a type for the monthGroup object structure
interface MonthGroup {
  label: string;
  contacts: Contact[];
}

const ClientsTable = ({ 
  contacts, 
  isLoading, 
  searchTerm,
  onContactClick 
}: ClientsTableProps) => {
  const isMobile = useIsMobile();
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

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
    const groupedContacts: Record<string, MonthGroup> = {};
    
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
      .map(([_, value]) => value);
  }, [filteredContacts]);

  function getMonthName(monthNumber: number): string {
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return monthNames[monthNumber - 1];
  }

  const toggleMonthExpansion = (monthName: string) => {
    if (expandedMonth === monthName) {
      setExpandedMonth(null);
    } else {
      setExpandedMonth(monthName);
    }
  };

  // Renderizar os grupos de meses com o estilo semelhante à tela de pagamentos
  const renderMonthGroup = (monthGroup: MonthGroup) => {
    const isExpanded = expandedMonth === monthGroup.label;
    
    if (isMobile) {
      return (
        <Card key={monthGroup.label} className="mb-6">
          <CardHeader 
            className="cursor-pointer flex flex-row items-center justify-between py-3"
            onClick={() => toggleMonthExpansion(monthGroup.label)}
          >
            <CardTitle className="text-lg font-medium">
              {monthGroup.label}
            </CardTitle>
            <div className="flex items-center">
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </CardHeader>
          
          {isExpanded && (
            <CardContent className="px-0 pt-0">
              {monthGroup.contacts.map((contact) => (
                <div 
                  key={contact.id} 
                  className="border-t p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => onContactClick(contact)}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Nome</div>
                    <div className="text-sm">{contact.name}</div>
                    
                    <div className="text-sm font-medium">Telefone</div>
                    <div className="text-sm">{contact.phone || '-'}</div>
                    
                    <div className="text-sm font-medium">Status</div>
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        contact.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                    
                    <div className="text-sm font-medium">Último Contato</div>
                    <div className="text-sm">{contact.lastContact}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
          
          {!isExpanded && (
            <CardFooter className="bg-gray-50 dark:bg-gray-800 border-t flex justify-between p-4">
              <span className="text-sm text-muted-foreground">
                {monthGroup.contacts.length} {monthGroup.contacts.length === 1 ? 'cliente' : 'clientes'}
              </span>
              <Badge variant="outline" className="bg-petshop-blue/10 text-petshop-blue dark:bg-petshop-blue/30 dark:text-blue-300">
                {monthGroup.contacts.length} cliente(s)
              </Badge>
            </CardFooter>
          )}
        </Card>
      );
    }
    
    return (
      <div className="mb-8" key={monthGroup.label}>
        <div 
          className="flex justify-between items-center mb-2 cursor-pointer p-3 bg-gray-50 dark:bg-gray-800 rounded-t-lg"
          onClick={() => toggleMonthExpansion(monthGroup.label)}
        >
          <h3 className="text-lg font-medium flex items-center">
            {monthGroup.label}
            {isExpanded ? (
              <ChevronUp className="ml-2 h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="ml-2 h-5 w-5 text-gray-500" />
            )}
          </h3>
          <Badge variant="outline" className="bg-petshop-blue/10 text-petshop-blue dark:bg-petshop-blue/30 dark:text-blue-300">
            {monthGroup.contacts.length} {monthGroup.contacts.length === 1 ? 'cliente' : 'clientes'}
          </Badge>
        </div>
        
        {isExpanded && (
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
        )}
      </div>
    );
  };

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
          <div className="space-y-6">
            {contactsByMonth.map((monthGroup) => renderMonthGroup(monthGroup))}
          </div>
          
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
