
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/hooks/useProducts';

interface ProductGridProps {
  products: Product[];
  onDeleteProduct: (id: number, title: string) => void;
  canModifyProducts: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onDeleteProduct,
  canModifyProducts 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onDelete={onDeleteProduct}
          canDelete={canModifyProducts}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
