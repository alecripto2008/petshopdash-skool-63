
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserProfile } from '@/hooks/useUsers';

interface EditUserFormData {
  name: string;
  phone?: string;
  active: boolean;
  role: string;
}

interface EditUserDialogProps {
  user: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userData: { id: string; name: string; phone?: string; active: boolean }) => void;
  onUpdateRole: (data: { userId: string; role: string }) => void;
  isLoading: boolean;
  isUpdatingRole: boolean;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  user,
  open,
  onOpenChange,
  onSave,
  onUpdateRole,
  isLoading,
  isUpdatingRole,
}) => {
  const form = useForm<EditUserFormData>({
    defaultValues: {
      name: '',
      phone: '',
      active: true,
      role: 'user',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        phone: user.phone || '',
        active: user.active,
        role: user.roles[0] || 'user',
      });
    }
  }, [user, form]);

  const handleSubmit = async (data: EditUserFormData) => {
    if (!user) return;
    
    // Atualizar dados do usuário
    onSave({
      id: user.id,
      name: data.name,
      phone: data.phone,
      active: data.active,
    });

    // Se a role mudou, atualizar também
    const currentRole = user.roles[0] || 'user';
    if (data.role !== currentRole) {
      onUpdateRole({
        userId: user.id,
        role: data.role,
      });
    }

    onOpenChange(false);
  };

  const isProcessing = isLoading || isUpdatingRole;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: 'Nome é obrigatório' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o telefone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              rules={{ required: 'Permissão é obrigatória' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permissão</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a permissão" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="viewer">Visualizador</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Usuário Ativo</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Define se o usuário pode acessar o sistema
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="bg-muted p-3 rounded-md text-sm">
              <strong>Descrição das permissões:</strong>
              <ul className="mt-1 space-y-1">
                <li><strong>Visualizador:</strong> Apenas visualização</li>
                <li><strong>Usuário:</strong> Acesso básico</li>
                <li><strong>Gerente:</strong> Acesso intermediário</li>
                <li><strong>Administrador:</strong> Acesso total</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
