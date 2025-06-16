
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UsersHeader from '@/components/users/UsersHeader';
import { useUsers } from '@/hooks/useUsers';
import { UsersTable } from '@/components/users/UsersTable';
import { AddUserDialog } from '@/components/users/AddUserDialog';
import UserSearchBar from '@/components/users/UserSearchBar';

const UsersManager = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filtrar usuários baseado no termo de pesquisa
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone && user.phone.includes(searchTerm))
  );

  const handleRefresh = () => {
    window.location.reload();
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-petshop-blue dark:bg-gray-900">
        <div className="h-16 w-16 border-4 border-t-transparent border-petshop-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <UsersHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Gerenciamento de Usuários
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Gerencie usuários, permissões e controle de acesso do sistema
            </p>
          </div>
          <div className="w-full">
            <UserSearchBar 
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              onRefresh={handleRefresh}
              onAddUser={() => setShowAddDialog(true)}
              isRefreshing={false}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário no sistema'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm 
                  ? `Nenhum usuário corresponde ao termo "${searchTerm}".`
                  : 'Adicione o primeiro usuário ao sistema.'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddDialog(true)}
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Adicionar Usuário
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm 
                    ? `${filteredUsers.length} usuário(s) encontrado(s) para "${searchTerm}"`
                    : `Total de ${filteredUsers.length} usuário(s)`
                  }
                </p>
              </div>
              <UsersTable
                users={filteredUsers}
                onUpdateUser={updateUser}
                onUpdateUserRole={updateUserRole}
                onDeleteUser={deleteUser}
                isUpdatingUser={isUpdatingUser}
                isUpdatingRole={isUpdatingRole}
                isDeletingUser={isDeletingUser}
              />
            </>
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
