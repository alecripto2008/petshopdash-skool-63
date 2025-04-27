
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';

const ProductsCard = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/products');
  };
  
  return (
    <Card className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-blue-900/50 dark:border-blue-800 dark:text-blue-100" onClick={handleClick}>
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-800 to-blue-950 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          Produtos
        </CardTitle>
        <CardDescription className="text-blue-200">
          CRM e gerenciamento
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 flex justify-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full">
            <Package className="h-14 w-14 text-blue-800 dark:text-blue-400 animate-bounce" />
          </div>
        </div>
        <p className="text-gray-600 dark:text-blue-300 text-center">
          Gerencie seus produtos, catálogo e serviços.
        </p>
      </CardContent>
      <CardFooter className="bg-blue-50 dark:bg-blue-900/50 rounded-b-lg border-t dark:border-blue-800 flex justify-center py-3">
        <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50">
          Acessar Gerenciamento de Produtos
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default ProductsCard;
