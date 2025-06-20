
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UserProfile } from '@/hooks/useUsers';
import { useUserPermissions } from '@/hooks/useUserPermissions';

interface DeleteUserDialogProps {
  user: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userId: string) => void;
  isLoading: boolean;
}

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}) => {
  const { permissions } = useUserPermissions();
  const isManager = permissions.role === 'manager';

  // Verificar se o gerente pode deletar este usuário
  const canDeleteUser = React.useMemo(() => {
    if (!user || !isManager) return true; // Admin pode deletar todos
    
    const userRole = user.roles[0];
    return userRole === 'user' || userRole === 'viewer';
  }, [user, isManager]);

  const handleConfirm = () => {
    if (user && canDeleteUser) {
      onConfirm(user.id);
      onOpenChange(false);
    }
  };

  if (!canDeleteUser) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Acesso Negado</AlertDialogTitle>
            <AlertDialogDescription>
              Como gerente, você não tem permissão para deletar usuários com role "{user?.roles[0]}".
              <br /><br />
              Você só pode gerenciar usuários com roles "Usuário" ou "Visualizador".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => onOpenChange(false)}>
              Fechar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza de que deseja <strong>deletar permanentemente</strong> o usuário <strong>{user?.name}</strong>?
            <br /><br />
            <span className="text-destructive font-medium">
              ⚠️ Esta ação é irreversível! O usuário e todos os seus dados serão removidos definitivamente do sistema.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Deletando...' : 'Deletar Permanentemente'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
