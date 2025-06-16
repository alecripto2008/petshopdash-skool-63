
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Search, UserPlus } from 'lucide-react';
import { useUserPermissions } from '@/hooks/useUserPermissions';

interface UserSearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onRefresh: () => void;
  onAddUser?: () => void;
  isRefreshing?: boolean;
  isLoading?: boolean;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({
  searchTerm,
  onSearchTermChange,
  onRefresh,
  onAddUser,
  isRefreshing = false,
  isLoading = false
}) => {
  const { permissions, loading: permissionsLoading } = useUserPermissions();
  const canModifyUsers = permissions.canAccessUsers && permissions.role !== 'viewer';

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full items-stretch sm:items-center">
      <div className="relative flex-1 sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar usuários..."
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
        {onAddUser && (
          <Button 
            size="default" 
            onClick={onAddUser}
            disabled={!canModifyUsers || permissionsLoading}
            title={!canModifyUsers ? "Você não tem permissão para adicionar usuários" : ""}
            className="whitespace-nowrap h-10"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Usuário
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserSearchBar;
