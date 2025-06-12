
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { useUsers } from '@/hooks/useUsers';
import { UsersTable } from '@/components/users/UsersTable';
import { AddUserDialog } from '@/components/users/AddUserDialog';

const UsersManager = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const {
    users,
    isLoading,
    addUser,
    updateUser,
    updateUserRole,
    deleteUser,
    isAddingUser,
    isUpdatingUser,
    isUpdatingRole,
    isDeletingUser,
  } = useUsers();

  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-petshop-blue dark:bg-gray-900">
        <div className="h-16 w-16 border-4 border-t-transparent border-petshop-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Gerenciamento de Usuários
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Gerencie usuários, permissões e controle de acesso do sistema
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Usuário
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Nenhum usuário encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Adicione o primeiro usuário ao sistema.
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Usuário
              </Button>
            </div>
          ) : (
            <UsersTable
              users={users}
              onUpdateUser={updateUser}
              onUpdateUserRole={updateUserRole}
              onDeleteUser={deleteUser}
              isUpdatingUser={isUpdatingUser}
              isUpdatingRole={isUpdatingRole}
              isDeletingUser={isDeletingUser}
            />
          )}
        </div>

        <AddUserDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSave={addUser}
          isLoading={isAddingUser}
        />
      </main>
    </div>
  );
};

export default UsersManager;
