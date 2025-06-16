
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Search, UserPlus } from 'lucide-react';
import { useUserPermissions } from '@/hooks/useUserPermissions';

interface ClientSearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onRefresh: () => void;
  onAddClient?: () => void;
  isRefreshing?: boolean;
  isLoading?: boolean;
}

const ClientSearchBar: React.FC<ClientSearchBarProps> = ({
  searchTerm,
  onSearchTermChange,
  onRefresh,
  onAddClient,
  isRefreshing = false,
  isLoading = false
}) => {
  const { permissions, loading: permissionsLoading } = useUserPermissions();
  const canModifyClients = permissions.role !== 'viewer';

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full items-stretch sm:items-center">
      <div className="relative flex-1 sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10 h-10"
        />
      </div>
      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          size="default"
          onClick={onRefresh}
          disabled={isRefreshing || isLoading}
          className="whitespace-nowrap h-10"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Atualizando...' : 'Atualizar'}
        </Button>
        {onAddClient && (
          <Button 
            size="default" 
            onClick={onAddClient}
            disabled={!canModifyClients || permissionsLoading}
            title={!canModifyClients ? "Você não tem permissão para adicionar clientes" : ""}
            className="whitespace-nowrap h-10"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Cliente
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClientSearchBar;
