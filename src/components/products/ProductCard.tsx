
import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Product {
  id: number;
  titulo: string;
  created_at: string | null;
}

interface ProductCardProps {
  product: Product;
  onDelete: (id: number, title: string) => void;
  canDelete: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete, canDelete }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FileText className="h-5 w-5 mr-2 text-amber-500" />
          <span className="truncate">{product.titulo || 'Sem título'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <div>Adicionado: {product.created_at 
            ? new Date(product.created_at).toLocaleDateString('pt-BR')
            : 'Data não disponível'}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {canDelete ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir Produto</DialogTitle>
                <DialogDescription>
                  Esta ação não pode ser desfeita. Tem certeza que deseja excluir o produto?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button 
                  variant="destructive" 
                  onClick={() => onDelete(product.id, product.titulo)}
                >
                  Excluir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            disabled
            title="Você não tem permissão para excluir produtos"
            className="text-gray-400"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
