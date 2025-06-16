
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit2, Trash2, MessageSquare, Phone } from 'lucide-react';
import { Contact } from '@/types/client';
import { useUserPermissions } from '@/hooks/useUserPermissions';

interface ClientsTableProps {
  contacts: Contact[];
  isLoading: boolean;
  searchTerm: string;
  onContactClick: (contact: Contact) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({
  contacts,
  isLoading,
  searchTerm,
  onContactClick
}) => {
  const { permissions, loading: permissionsLoading } = useUserPermissions();
  const canModifyClients = permissions.role !== 'viewer';
  
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.petName && contact.petName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.phone && contact.phone.includes(searchTerm))
  );

  if (isLoading || permissionsLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Pet</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Último Contato</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.map((contact) => (
            <TableRow key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <TableCell>
                <div>
                  <div className="font-medium">{contact.name}</div>
                  {contact.email && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  {contact.petName && (
                    <>
                      <div className="font-medium">{contact.petName}</div>
                      {(contact.petBreed || contact.petSize) && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {[contact.petBreed, contact.petSize].filter(Boolean).join(' - ')}
                        </div>
                      )}
                    </>
                  )}
                  {!contact.petName && (
                    <span className="text-gray-400">Não informado</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {contact.phone && (
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={contact.status === 'Active' ? 'default' : 'secondary'}>
                  {contact.status === 'Active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                {contact.lastContact}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onContactClick(contact)}
                    title="Ver detalhes"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!canModifyClients}
                    title={!canModifyClients ? "Você não tem permissão para enviar mensagens" : "Enviar mensagem"}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {filteredContacts.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Nenhum cliente encontrado com os critérios de busca.' : 'Nenhum cliente cadastrado.'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsTable;
