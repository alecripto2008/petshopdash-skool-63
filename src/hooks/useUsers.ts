import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  roles: string[];
}

type UserRole = 'admin' | 'manager' | 'user' | 'viewer';

export const useUsers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('🔍 Fetching users...');
      
      // Buscar perfis primeiro
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) {
        console.error('❌ Error fetching profiles:', profileError);
        throw profileError;
      }

      console.log('✅ Profiles fetched:', profiles);

      // Buscar roles separadamente
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error('❌ Error fetching roles:', rolesError);
        console.warn('⚠️ Continuing without roles data');
      }

      console.log('📋 User roles fetched:', userRoles);

      // Combinar os dados
      const usersWithRoles = profiles.map(profile => ({
        ...profile,
        roles: userRoles?.filter(ur => ur.user_id === profile.id).map(ur => ur.role) || []
      })) as UserProfile[];

      console.log('👥 Final users with roles:', usersWithRoles);
      return usersWithRoles;
    },
  });

  const addUserMutation = useMutation({
    mutationFn: async (userData: { name: string; email: string; password: string; phone?: string; role: string }) => {
      try {
        console.log('🔄 Starting user creation process...', userData);
        console.log('🎯 ROLE SOLICITADA:', userData.role);
        
        // Criar usuário no auth
        console.log('📝 Creating auth user with signUp...');
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              name: userData.name,
            }
          }
        });

        if (authError) {
          console.error('❌ Auth error:', authError);
          throw new Error(`Erro de autenticação: ${authError.message}`);
        }

        console.log('✅ Auth user created:', authData);

        if (!authData.user) {
          throw new Error('Usuário não foi criado no sistema de autenticação');
        }

        // Aguardar um pouco para o trigger criar o perfil
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verificar se o perfil foi criado pelo trigger
        console.log('🔍 Checking if profile was created by trigger...');
        const { data: profileCheck, error: profileCheckError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileCheckError) {
          console.log('⚠️ Profile not created by trigger, creating manually...');
          // Criar perfil manualmente se o trigger não funcionou
          const { error: profileCreateError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              name: userData.name,
              email: userData.email,
              phone: userData.phone || null
            });

          if (profileCreateError) {
            console.error('❌ Profile creation error:', profileCreateError);
            throw new Error(`Erro ao criar perfil: ${profileCreateError.message}`);
          }
          console.log('✅ Profile created manually');
        } else {
          console.log('✅ Profile found from trigger:', profileCheck);
          
          // Atualizar perfil com telefone se necessário
          if (userData.phone) {
            console.log('📞 Updating profile with phone...');
            const { error: profileUpdateError } = await supabase
              .from('profiles')
              .update({ phone: userData.phone })
              .eq('id', authData.user.id);

            if (profileUpdateError) {
              console.error('❌ Profile update error:', profileUpdateError);
              throw new Error(`Erro ao atualizar perfil: ${profileUpdateError.message}`);
            }
            console.log('✅ Profile updated with phone');
          }
        }

        // Atribuir a role solicitada
        console.log('🔐 Assigning role:', userData.role);
        
        // Obter usuário atual para atribuir assigned_by
        const { data: currentUser } = await supabase.auth.getUser();
        
        // Atribuir a role solicitada
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: userData.role as UserRole,
            assigned_by: currentUser.user?.id
          });

        if (roleError) {
          console.error('❌ Role assignment error:', roleError);
          throw new Error(`Erro ao atribuir permissão: ${roleError.message}`);
        }

        console.log('✅ Role assigned successfully:', userData.role);
        
        // Verificar se a role foi realmente atribuída
        const { data: verifyRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', authData.user.id);
        
        console.log('🔍 VERIFICAÇÃO - Role no banco:', verifyRole);

        console.log('🎉 User creation completed successfully');
        return authData.user;

      } catch (error) {
        console.error('💥 Full error in mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('✅ Mutation successful, invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Usuário criado",
        description: "Usuário criado com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('❌ Mutation error:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar usuário",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (userData: { id: string; name: string; phone?: string; active: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          phone: userData.phone,
          active: userData.active,
        })
        .eq('id', userData.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Usuário atualizado",
        description: "Usuário atualizado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar usuário",
        variant: "destructive",
      });
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      console.log('🔄 Updating user role to:', role);
      
      // Remover roles existentes
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Adicionar EXATAMENTE a nova role solicitada
      const { data: currentUser } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role as UserRole,
          assigned_by: currentUser.user?.id
        });

      if (error) {
        console.error('❌ Role update error:', error);
        throw error;
      }
      
      console.log('✅ Role updated successfully to:', role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Permissão atualizada",
        description: "Permissão do usuário atualizada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar permissão",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log('🗑️ Deleting user:', userId);
      
      // Primeiro, remover todas as roles do usuário
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (roleError) {
        console.error('❌ Error deleting user roles:', roleError);
        throw new Error('Erro ao remover permissões do usuário');
      }

      // Depois, desativar o perfil do usuário em vez de deletar
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ active: false })
        .eq('id', userId);

      if (profileError) {
        console.error('❌ Error deactivating user profile:', profileError);
        throw new Error('Erro ao desativar usuário');
      }

      console.log('✅ User deactivated successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Usuário removido",
        description: "Usuário desativado com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('❌ Delete mutation error:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover usuário",
        variant: "destructive",
      });
    },
  });

  return {
    users,
    isLoading,
    error,
    addUser: addUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    updateUserRole: updateUserRoleMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isAddingUser: addUserMutation.isPending,
    isUpdatingUser: updateUserMutation.isPending,
    isUpdatingRole: updateUserRoleMutation.isPending,
    isDeletingUser: deleteUserMutation.isPending,
  };
};
