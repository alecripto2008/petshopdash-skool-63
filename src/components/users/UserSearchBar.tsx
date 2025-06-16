
import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UserSearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isLoading: boolean;
}

const UserSearchBar = ({ 
  searchTerm, 
  onSearchTermChange, 
  onRefresh, 
  isRefreshing, 
  isLoading 
}: UserSearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input 
          placeholder="Pesquisar usuários..." 
          className="pl-10 w-full sm:w-64"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>
      <Button 
        variant="outline" 
        onClick={onRefresh} 
        disabled={isRefreshing || isLoading}
        className="min-w-[40px]"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        Atualizar
      </Button>
    </div>
  );
};

export default UserSearchBar;
