
import React from 'react';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProductsCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/products')}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Gestão de Produtos
        </CardTitle>
        <Package className="h-4 w-4 text-petshop-blue dark:text-blue-400" />
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          Gerencie o catálogo de produtos e serviços
        </div>
        <Button 
          variant="ghost" 
          className="w-full mt-4 text-petshop-blue dark:text-blue-400"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/products');
          }}
        >
          Gerenciar Produtos
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductsCard;
