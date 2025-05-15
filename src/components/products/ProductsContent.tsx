
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import AddProductDialog from './AddProductDialog';

interface Product {
  id: number;
  titulo: string;
  created_at: string | null;
}

const ProductsContent = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const { data: products, isLoading, refetch, isRefetching } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, titulo, created_at')
          .order('created_at', { ascending: false });

        if (error) {
          toast({
            title: 'Erro ao carregar produtos',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }
        return data || [];
      } catch (error: any) {
        console.error("Erro ao buscar produtos:", error);
        toast({
          title: 'Erro ao carregar produtos',
          description: error?.message || 'Ocorreu um erro ao buscar os produtos',
          variant: 'destructive',
        });
        return [];
      }
    },
  });

  const filteredProducts = products?.filter(product => {
    const titleMatch = product.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return titleMatch;
  });

  const handleAddProductSuccess = async () => {
    await refetch();
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
              placeholder="Pesquisar por título..." 
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
            <TableHead>Título (Categoria)</TableHead>
            <TableHead>Data de Criação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.titulo || 'Sem título'}</TableCell>
                <TableCell>
                  {product.created_at 
                    ? new Date(product.created_at).toLocaleDateString('pt-BR')
                    : 'Data não disponível'
                  }
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center">
                Nenhum produto encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddProductDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddProductSuccess}
      />
    </div>
  );
};

export default ProductsContent;
