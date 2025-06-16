
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
import { useUserPermissions } from '@/hooks/useUserPermissions';

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
  const { permissions } = useUserPermissions();
  const isManager = permissions.role === 'manager';
  
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

  // Verificar se o gerente pode editar este usuário
  const canEditUser = React.useMemo(() => {
    if (!user || !isManager) return true; // Admin pode editar todos
    
    const userRole = user.roles[0];
    return userRole === 'user' || userRole === 'viewer';
  }, [user, isManager]);

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

  if (!canEditUser) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Acesso Negado</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-red-600 mb-4">
              Como gerente, você não tem permissão para editar usuários com role "{user?.roles[0]}".
            </p>
            <p className="text-gray-600 text-sm">
              Você só pode gerenciar usuários com roles "Usuário" ou "Visualizador".
            </p>
            <Button className="mt-4" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="viewer">Visualizador</SelectItem>
                      {!isManager && (
                        <>
                          <SelectItem value="manager">Gerente</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </>
                      )}
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

            {isManager && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-sm text-amber-800">
                <strong>Atenção:</strong> Como gerente, você só pode alterar permissões para "Usuário" ou "Visualizador".
              </div>
            )}

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
