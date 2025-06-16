
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, CreditCard, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { formatCurrency, groupPaymentsByMonth, type Payment, type GroupedPayments } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PaymentsContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    client: '',
    type: '',
    description: '',
    value: '',
    typeservice: '',
  });
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
        return [] as Payment[];
      }

      return data as Payment[] || [];
    },
  });

  const filteredPayments = payments?.filter(payment =>
    payment.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.typeservice?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedPayments: GroupedPayments[] = groupPaymentsByMonth(filteredPayments || []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPayment(prev => ({
      ...prev,
      [name]: name === 'value' ? value.replace(/[^\d.,]/g, '') : value
    }));
  };

  const handleAddPayment = async () => {
    if (!newPayment.client || !newPayment.type || !newPayment.description || !newPayment.value) {
      toast({
        title: 'Erro ao adicionar pagamento',
        description: 'Todos os campos são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    const numericValue = parseFloat(newPayment.value.replace(',', '.'));
    
    if (isNaN(numericValue)) {
      toast({
        title: 'Erro ao adicionar pagamento',
        description: 'O valor precisa ser um número válido.',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('payments')
      .insert({
        client: newPayment.client,
        type: newPayment.type,
        description: newPayment.description,
        value: numericValue,
        typeservice: newPayment.typeservice,
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
      variant: 'default',
    });

    setNewPayment({
      client: '',
      type: '',
      description: '',
      value: '',
      typeservice: '',
    });
    setIsDialogOpen(false);
    
    refetch();
  };

  const toggleMonthExpansion = (monthName: string) => {
    if (expandedMonth === monthName) {
      setExpandedMonth(null);
    } else {
      setExpandedMonth(monthName);
    }
  };

  const renderPaymentTable = (payments: Payment[], monthName: string, total: number) => {
    const isExpanded = expandedMonth === monthName;
    
    if (isMobile) {
      return (
        <Card key={monthName} className="mb-6">
          <CardHeader className="cursor-pointer" onClick={() => toggleMonthExpansion(monthName)}>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium capitalize">
                {monthName}
              </CardTitle>
              <div className="flex items-center">
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
          </CardHeader>
          {isExpanded && (
            <>
              <CardContent className="px-0 pt-0">
                {payments.map((payment) => (
                  <div key={payment.id} className="border-t p-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Cliente</div>
                      <div className="text-sm">{payment.client}</div>
                      <div className="text-sm font-medium">Forma de Pagamento</div>
                      <div className="text-sm">{payment.type}</div>
                      <div className="text-sm font-medium">Tipo de Serviço</div>
                      <div className="text-sm">{payment.typeservice}</div>
                      <div className="text-sm font-medium">Descrição</div>
                      <div className="text-sm">{payment.description}</div>
                      <div className="text-sm font-medium">Valor</div>
                      <div className="text-sm font-bold text-right">
                        {formatCurrency(Number(payment.value))}
                      </div>
                      <div className="text-sm font-medium">Data</div>
                      <div className="text-sm">
                        {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="bg-slate-50 dark:bg-slate-900 border-t flex justify-between p-4">
                <span className="font-medium">Total do mês</span>
                <span className="font-bold text-green-700 dark:text-green-500">
                  {formatCurrency(total)}
                </span>
              </CardFooter>
            </>
          )}
          {!isExpanded && (
            <CardFooter className="bg-slate-50 dark:bg-slate-900 border-t flex justify-between p-4">
              <span className="text-sm text-muted-foreground">
                {payments.length} {payments.length === 1 ? 'pagamento' : 'pagamentos'}
              </span>
              <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                {formatCurrency(total)}
              </Badge>
            </CardFooter>
          )}
        </Card>
      );
    }
    
    return (
      <div className="mb-8" key={monthName}>
        <div 
          className="flex justify-between items-center mb-2 cursor-pointer"
          onClick={() => toggleMonthExpansion(monthName)}
        >
          <h3 className="text-lg font-medium capitalize flex items-center">
            {monthName}
            {isExpanded ? (
              <ChevronUp className="ml-2 h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="ml-2 h-5 w-5 text-gray-500" />
            )}
          </h3>
          <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            {payments.length} {payments.length === 1 ? 'pagamento' : 'pagamentos'}
          </Badge>
        </div>
        
        {isExpanded && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Forma de Pagamento</TableHead>
                <TableHead>Tipo de Serviço</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.client}</TableCell>
                  <TableCell>{payment.type}</TableCell>
                  <TableCell>{payment.typeservice}</TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>{formatCurrency(Number(payment.value))}</TableCell>
                  <TableCell>
                    {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Total do mês</TableCell>
                <TableCell colSpan={2} className="text-right font-bold">
                  {formatCurrency(total)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-4 border-t-transparent border-petshop-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalGeral = groupedPayments.reduce((acc, group) => acc + group.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <h3 className="text-lg font-medium">Pagamentos</h3>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input 
              placeholder="Pesquisar pagamentos..." 
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => refetch()} 
            disabled={isRefetching}
            className="min-w-[40px]"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-black hover:bg-gray-800 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Incluir Pagamento
          </Button>
        </div>
      </div>

      {groupedPayments.length > 0 ? (
        <div>
          {groupedPayments.map(group => renderPaymentTable(group.payments, group.monthName, group.total))}
          
          <div className="mt-8 bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex justify-between items-center">
            <span className="text-lg font-bold">Total Geral</span>
            <span className="text-xl font-bold text-green-700 dark:text-green-500">{formatCurrency(totalGeral)}</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">Nenhum pagamento encontrado.</p>
        </div>
      )}

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
                Forma de Pagamento
              </Label>
              <Input
                id="type"
                name="type"
                value={newPayment.type}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Pix, Dinheiro, Crédito, Débito"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="typeservice" className="text-right">
                Tipo de Serviço
              </Label>
              <Input
                id="typeservice"
                name="typeservice"
                value={newPayment.typeservice}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Serviço, Produto, Consulta, etc."
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
