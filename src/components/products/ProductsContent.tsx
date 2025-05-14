import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Search, RefreshCw, Download } from 'lucide-react'; // Adicionado Download
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import AddProductDialog from './AddProductDialog';

// Define a interface Product para corresponder à nova estrutura de dados
interface Product {
  id: number;
  title: string; // Anteriormente 'category', agora é o título principal
  file_url: string; // URL do arquivo do produto
  created_at: string | null;
  // Campos como 'content', 'embedding', 'metadata', 'updated_at' podem ou não existir
  // dependendo da sua tabela 'products' real. Ajuste conforme necessário.
  // Para este exemplo, focaremos em title, file_url e created_at.
}

const ProductsContent = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const { data: products, isLoading, refetch, isRefetching } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      // Ajustar o select para buscar os campos corretos: id, title, file_url, created_at
      const { data, error } = await supabase
        .from('products')
        .select('id, title, file_url, created_at') // Selecionar os campos relevantes
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Erro ao carregar produtos',
          description: error.message,
          variant: 'destructive',
        });
        throw error; // Lançar o erro para o React Query tratar
      }
      return data || [];
    },
  });

  const filteredProducts = products?.filter(product => {
    // Atualizar a lógica de filtro para usar 'title'
    const titleMatch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return titleMatch;
  });

  const handleAddProductSuccess = async () => {
    await refetch(); // Rebusca os produtos para atualizar a lista
    // O AddProductDialog já fecha a si mesmo e mostra o toast de sucesso
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
            <TableHead>Arquivo</TableHead>
            <TableHead>Data de Criação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.title || 'Sem título'}</TableCell>
                <TableCell>
                  {product.file_url ? (
                    <a 
                      href={product.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Baixar/Ver Arquivo
                    </a>
                  ) : (
                    'Nenhum arquivo'
                  )}
                </TableCell>
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
              <TableCell colSpan={3} className="text-center">
                Nenhum produto encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddProductDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddProductSuccess} // Passando a função de callback correta
      />
    </div>
  );
};

export default ProductsContent;

