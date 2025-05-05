
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import AddProductDialog from './AddProductDialog';

// Define the Product type to match the actual database schema
interface Product {
  id: number;
  category: string;
  content: string | null;
  created_at: string | null;
  embedding: string | null;
  metadata: any | null;
  updated_at: string | null;
}

const ProductsContent = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const { data: products, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Erro ao carregar produtos',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }

      return data || [];
    },
  });

  const filteredProducts = products?.filter(product => {
    // Updated to check the content or category fields instead of name
    const contentMatch = product.content?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const categoryMatch = product.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return contentMatch || categoryMatch;
  });

  const handleAddProduct = async () => {
    await refetch();
    setIsAddDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-4 border-t-transparent border-petshop-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Produtos</h3>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input 
              placeholder="Pesquisar produtos..." 
              className="pl-10 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="refresh" 
            onClick={() => refetch()} 
            disabled={isRefetching}
            className="min-w-[40px]"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produto
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Conteúdo</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Data de Criação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts?.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.content || 'Sem conteúdo'}</TableCell>
              <TableCell>{product.category || 'Sem categoria'}</TableCell>
              <TableCell>
                {product.created_at 
                  ? new Date(product.created_at).toLocaleDateString('pt-BR')
                  : 'Data não disponível'
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddProductDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddProduct}
      />
    </div>
  );
};

export default ProductsContent;
