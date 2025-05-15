
import React from 'react';
import { Database } from 'lucide-react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  titulo: string;
  created_at: string | null;
}

interface ProductGridProps {
  products: Product[];
  searchQuery: string;
  onDeleteProduct: (id: number, title: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  searchQuery, 
  onDeleteProduct 
}) => {
  // Filter products based on search query
  const filteredProducts = products.filter(product => {
    const title = product.titulo || '';
    
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (filteredProducts.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <Database className="h-16 w-16 mb-4 opacity-30" />
        <h3 className="text-lg font-medium mb-1">Nenhum produto encontrado</h3>
        <p className="text-sm">
          {searchQuery ? 
            "Nenhum produto corresponde à sua pesquisa." : 
            "Comece adicionando produtos à sua base de dados."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredProducts.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onDelete={onDeleteProduct}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
