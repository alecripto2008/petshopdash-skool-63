
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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserProfile } from '@/hooks/useUsers';

interface UserRoleFormData {
  role: string;
}

interface UserRoleDialogProps {
  user: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { userId: string; role: string }) => void;
  isLoading: boolean;
}

export const UserRoleDialog: React.FC<UserRoleDialogProps> = ({
  user,
  open,
  onOpenChange,
  onSave,
  isLoading,
}) => {
  const form = useForm<UserRoleFormData>({
    defaultValues: {
      role: 'user',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        role: user.roles[0] || 'user',
      });
    }
  }, [user, form]);

  const handleSubmit = (data: UserRoleFormData) => {
    if (!user) return;
    
    onSave({
      userId: user.id,
      role: data.role,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Permissão</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Usuário: <strong>{user?.name}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Email: <strong>{user?.email}</strong>
              </p>
            </div>

            <FormField
              control={form.control}
              name="role"
              rules={{ required: 'Permissão é obrigatória' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Permissão</FormLabel>
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
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Alterando...' : 'Alterar Permissão'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
