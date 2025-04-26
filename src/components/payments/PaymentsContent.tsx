
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, CreditCard, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const PaymentsContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    client: '',
    type: '',
    description: '',
    value: '',
  });
  const { toast } = useToast();

  const { data: payments, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Erro ao carregar pagamentos',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }

      return data || [];
    },
  });

  const filteredPayments = payments?.filter(payment =>
    payment.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment(prev => ({
      ...prev,
      [name]: name === 'value' ? value.replace(/[^\d.,]/g, '') : value
    }));
  };

  const handleAddPayment = async () => {
    // Validate input fields
    if (!newPayment.client || !newPayment.type || !newPayment.description || !newPayment.value) {
      toast({
        title: 'Erro ao adicionar pagamento',
        description: 'Todos os campos são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    // Parse value to ensure it's a valid number
    const numericValue = parseFloat(newPayment.value.replace(',', '.'));
    
    if (isNaN(numericValue)) {
      toast({
        title: 'Erro ao adicionar pagamento',
        description: 'O valor precisa ser um número válido.',
        variant: 'destructive',
      });
      return;
    }

    // Insert the new payment
    const { error } = await supabase
      .from('payments')
      .insert({
        client: newPayment.client,
        type: newPayment.type,
        description: newPayment.description,
        value: numericValue,
      });

    if (error) {
      toast({
        title: 'Erro ao adicionar pagamento',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Pagamento adicionado',
      description: 'O pagamento foi adicionado com sucesso.',
      variant: 'success',
    });

    // Reset form and close dialog
    setNewPayment({
      client: '',
      type: '',
      description: '',
      value: '',
    });
    setIsDialogOpen(false);
    
    // Refresh the payments list
    refetch();
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
        <h3 className="text-lg font-medium">Pagamentos</h3>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input 
              placeholder="Pesquisar pagamentos..." 
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
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Incluir Pagamento
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPayments?.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.client}</TableCell>
              <TableCell>{payment.type}</TableCell>
              <TableCell>{payment.description}</TableCell>
              <TableCell>
                {payment.value?.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </TableCell>
              <TableCell>
                {new Date(payment.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Payment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Pagamento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">
                Cliente
              </Label>
              <Input
                id="client"
                name="client"
                value={newPayment.client}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipo
              </Label>
              <Input
                id="type"
                name="type"
                value={newPayment.type}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Input
                id="description"
                name="description"
                value={newPayment.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Valor (R$)
              </Label>
              <Input
                id="value"
                name="value"
                value={newPayment.value}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="0,00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddPayment}>
              <CreditCard className="mr-2 h-4 w-4" />
              Adicionar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsContent;
