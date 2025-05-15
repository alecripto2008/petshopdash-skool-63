import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Product type definition
export interface Product {
  id: number;
  titulo: string;
  created_at: string | null;
}

export const useProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, titulo, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Erro ao carregar produtos",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Set the products
      setProducts(data || []);
    } catch (err) {
      console.error('Unexpected error fetching products:', err);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchProducts();
    toast({
      title: "Atualizando produtos",
      description: "Os produtos estão sendo atualizados do banco de dados.",
    });
  };

  // Delete product - Using the same webhook pattern as the document deletion
  const handleDeleteProduct = async (id: number, title: string) => {
    try {
      // Call webhook to delete file from system
      console.log('Enviando solicitação para excluir produto:', title);
      
      const response = await fetch('https://n8n.tomazbello.com/webhook/excluir-arquivo-rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          titulo: title 
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao excluir o produto: ${response.statusText}`);
      }

      // Only remove from UI if webhook call was successful
      setProducts(products.filter(product => product.id !== id));
      
      toast({
        title: "Produto excluído",
        description: "O produto foi removido com sucesso!",
        variant: "destructive",
      });
    } catch (err) {
      console.error('Unexpected error deleting product:', err);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível excluir o produto.",
        variant: "destructive",
      });
    }
  };

  // New function to clear all products
  const clearAllProducts = async () => {
    try {
      console.log('Enviando solicitação para excluir todos os produtos');
      
      const response = await fetch('https://n8n.tomazbello.com/webhook/excluir-rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Erro ao limpar os produtos: ${response.statusText}`);
      }

      // Clear the products array
      setProducts([]);
      
      toast({
        title: "Produtos limpos",
        description: "Todos os produtos foram removidos com sucesso!",
        variant: "destructive",
      });
    } catch (err) {
      console.error('Unexpected error clearing products:', err);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível limpar os produtos.",
        variant: "destructive",
      });
    }
  };

  // Upload file to webhook - keeping the same webhook for consistency
  const uploadFileToWebhook = async (file: File, category: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      console.log('Enviando arquivo para o webhook:', file.name, 'categoria:', category);
      
      const response = await fetch('https://n8n.tomazbello.com/webhook/envia_rag', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar o arquivo: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Arquivo enviado com sucesso:', result);
      
      // After successful upload, refresh the product list
      await fetchProducts();
      
      toast({
        title: "Produto adicionado",
        description: `${file.name} foi adicionado com sucesso!`,
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error);
      
      toast({
        title: "Erro ao enviar produto",
        description: "Não foi possível enviar o produto para o sistema.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  // Load products on hook initialization
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    isRefreshing,
    fetchProducts,
    handleRefresh,
    handleDeleteProduct,
    uploadFileToWebhook,
    clearAllProducts
  };
};
