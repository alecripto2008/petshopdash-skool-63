
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, RefreshCw, Trash2, AlertTriangle, Search } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductGrid from './ProductGrid';
import AddProductDialog from './AddProductDialog';
import { LoadingSpinner } from '@/components/config/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useUserPermissions } from '@/hooks/useUserPermissions';

const ProductsContent = () => {
  const { permissions, loading: permissionsLoading } = useUserPermissions();
  const {
    products,
    isLoading,
    isRefreshing,
    handleRefresh,
    handleDeleteProduct,
    clearAllProducts
  } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Check if user can modify products (not a viewer)
  const canModifyProducts = permissions.role !== 'viewer';
  
  if (isLoading || permissionsLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Produtos Cadastrados</CardTitle>
              <CardDescription>
                Gerencie os produtos disponíveis no sistema
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="whitespace-nowrap"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                </Button>
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="flex items-center gap-2"
                  disabled={!canModifyProducts}
                  title={!canModifyProducts ? "Você não tem permissão para adicionar produtos" : ""}
                >
                  <Upload className="h-4 w-4" />
                  Adicionar Produto
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Upload className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Comece adicionando seu primeiro produto ao sistema.
              </p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                disabled={!canModifyProducts}
                title={!canModifyProducts ? "Você não tem permissão para adicionar produtos" : ""}
              >
                <Upload className="h-4 w-4 mr-2" />
                Adicionar Primeiro Produto
              </Button>
            </div>
          ) : (
            <ProductGrid 
              products={filteredProducts} 
              onDeleteProduct={handleDeleteProduct}
              canModifyProducts={canModifyProducts}
            />
          )}
        </CardContent>
        {products.length > 0 && (
          <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Badge variant="outline" className="font-normal">
                {filteredProducts.length} de {products.length} produtos
              </Badge>
            </div>
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    disabled={!canModifyProducts}
                    title={!canModifyProducts ? "Você não tem permissão para excluir produtos" : ""}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Todos
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Confirmar Exclusão
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação irá remover permanentemente TODOS os produtos do sistema. 
                      Esta operação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={clearAllProducts}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Sim, excluir todos
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardFooter>
        )}
      </Card>
      
      <AddProductDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default ProductsContent;
