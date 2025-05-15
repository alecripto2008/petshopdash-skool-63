
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductsHeader from '@/components/products/ProductsHeader';
import ProductsContent from '@/components/products/ProductsContent';
import { useProducts } from '@/hooks/useProducts';

const ProductsManager = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { isLoading: productsLoading } = useProducts();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const isLoading = authLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-petshop-blue dark:bg-gray-900">
        <div className="h-16 w-16 border-4 border-t-transparent border-petshop-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <ProductsHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Gerenciador de Produtos
          </h2>
        </div>
        <ProductsContent />
      </main>
    </div>
  );
};

export default ProductsManager;
