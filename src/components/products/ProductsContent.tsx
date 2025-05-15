
import React, { useState } from 'react';
import SearchBar from '@/components/products/SearchBar';
import ProductGrid from '@/components/products/ProductGrid';
import AddProductDialog from '@/components/products/AddProductDialog';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';

const ProductsContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const { toast } = useToast();
  
  const { 
    products, 
    isLoading, 
    isRefreshing, 
    handleRefresh,
    handleDeleteProduct,
    uploadFileToWebhook,
    clearAllProducts
  } = useProducts();

  const handleAddProduct = async (file: File, category: string) => {
    try {
      const success = await uploadFileToWebhook(file, category);
      if (success) {
        toast({
          title: "Produto adicionado",
          description: "O produto foi adicionado com sucesso.",
        });
        setIsAddProductOpen(false); // Fechar o diálogo após sucesso
        handleRefresh(); // Atualizar a lista de produtos
      }
    } catch (error) {
      toast({
        title: "Erro ao adicionar produto",
        description: "Não foi possível adicionar o produto.",
        variant: "destructive",
      });
      console.error('Erro ao fazer upload do produto:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-4 border-t-transparent border-petshop-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={handleRefresh}
        onAddProduct={() => setIsAddProductOpen(true)}
        onClearAll={clearAllProducts}
        isRefreshing={isRefreshing}
      />

      <ProductGrid 
        products={products}
        searchQuery={searchQuery}
        onDeleteProduct={handleDeleteProduct}
      />

      <AddProductDialog 
        open={isAddProductOpen}
        onOpenChange={setIsAddProductOpen}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default ProductsContent;
