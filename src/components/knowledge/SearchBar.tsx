
import React from 'react';
import { Search, RefreshCw, Plus, Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  onAddDocument: () => void;
  onClearAll: () => void;
  isRefreshing: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onRefresh,
  onAddDocument,
  onClearAll,
  isRefreshing
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input
          id="search-input"
          placeholder="Buscar documentos..."
          className="pl-8 pr-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-2 w-full md:w-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Atualizar lista de documentos</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={onClearAll}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Limpar Tudo</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remover todos os documentos</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button onClick={onAddDocument} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Adicionar Documento</span>
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
