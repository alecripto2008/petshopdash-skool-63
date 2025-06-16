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
      
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) {
        console.error('❌ Error fetching profiles:', profileError);
        throw profileError;
      }

      console.log('✅ Profiles fetched:', profiles);

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error('❌ Error fetching roles:', rolesError);
      }

      console.log('📋 User roles fetched:', userRoles);

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
      console.log('🚀 Creating new user...', { email: userData.email, name: userData.name });
      
      try {
        // Step 1: Create user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              name: userData.name,
              phone: userData.phone || null
            },
            emailRedirectTo: undefined // Disable email confirmation for admin creation
          }
        });

        if (authError) {
          console.error('❌ Auth creation error:', authError);
          if (authError.message.includes('already registered')) {
            throw new Error('Este email já está sendo usado por outro usuário');
          }
          throw new Error(`Erro ao criar conta: ${authError.message}`);
        }

        if (!authData.user?.id) {
          throw new Error('Usuário não foi criado corretamente');
        }

        const userId = authData.user.id;
        console.log('✅ User created in auth:', userId);

        // Step 2: Wait a bit for trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Step 3: Check if profile was created by trigger, if not create it manually
        const { data: existingProfile, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('❌ Error checking profile:', checkError);
        }

        if (!existingProfile) {
          console.log('📝 Creating profile manually...');
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              name: userData.name,
              email: userData.email,
              phone: userData.phone || null,
              active: true
            });

          if (profileError) {
            console.error('❌ Profile creation error:', profileError);
            throw new Error(`Erro ao criar perfil: ${profileError.message}`);
          }
        } else {
          console.log('✅ Profile already exists, updating...');
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              name: userData.name,
              phone: userData.phone || null
            })
            .eq('id', userId);

          if (updateError) {
            console.error('❌ Profile update error:', updateError);
          }
        }

        // Step 4: Assign role
        console.log('🔐 Assigning role:', userData.role);
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: userData.role as UserRole,
            assigned_by: null
          });

        if (roleError) {
          console.error('❌ Role assignment error:', roleError);
          // Try to update if role already exists
          const { error: roleUpdateError } = await supabase
            .from('user_roles')
            .update({ role: userData.role as UserRole })
            .eq('user_id', userId);

          if (roleUpdateError) {
            console.error('❌ Role update error:', roleUpdateError);
          }
        }

        console.log('🎉 User creation completed successfully!');
        return { id: userId, ...userData };
        
      } catch (error: any) {
        console.error('💥 User creation failed:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('✅ Refreshing user list...');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Sucesso!",
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
      console.log('🔄 Updating user:', userData);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          phone: userData.phone || null,
          active: userData.active,
          updated_at: new Date().toISOString()
        })
        .eq('id', userData.id);

      if (error) {
        console.error('❌ Update error:', error);
        throw new Error(`Erro ao atualizar usuário: ${error.message}`);
      }
      
      console.log('✅ User updated successfully');
      return userData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Usuário atualizado",
        description: "Usuário atualizado com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('❌ Update error:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar usuário",
        variant: "destructive",
      });
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      console.log('🔄 Updating user role:', { userId, role });
      
      // Primeiro, remover todas as roles existentes
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('❌ Error deleting existing roles:', deleteError);
        throw new Error(`Erro ao remover roles: ${deleteError.message}`);
      }

      // Depois, adicionar a nova role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role as UserRole,
          assigned_by: null
        });

      if (insertError) {
        console.error('❌ Error inserting new role:', insertError);
        throw new Error(`Erro ao atribuir nova role: ${insertError.message}`);
      }
      
      console.log('✅ Role updated successfully');
      return { userId, role };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Permissão atualizada",
        description: "Permissão atualizada com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('❌ Role update error:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar permissão",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log('🗑️ Physically deleting user:', userId);
      
      try {
        // Primeiro, remover todas as roles do usuário
        console.log('📋 Deleting user roles...');
        const { error: roleError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId);

        if (roleError) {
          console.error('❌ Error deleting roles:', roleError);
          throw new Error(`Erro ao remover permissões: ${roleError.message}`);
        }
        console.log('✅ User roles deleted successfully');

        // Depois, deletar fisicamente o perfil do usuário
        console.log('👤 Deleting user profile...');
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (profileError) {
          console.error('❌ Error deleting user profile:', profileError);
          throw new Error(`Erro ao deletar perfil do usuário: ${profileError.message}`);
        }
        console.log('✅ User profile deleted successfully');

        console.log('🎉 User completely deleted from system');
        return userId;

      } catch (error) {
        console.error('💥 Error in deleteUser operation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('✅ User deletion successful, refreshing data...');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Usuário excluído",
        description: "Usuário e todos os seus dados foram removidos permanentemente!",
      });
    },
    onError: (error: any) => {
      console.error('❌ Delete mutation error:', error);
      toast({
        title: "Erro na exclusão",
        description: error.message || "Erro ao deletar usuário permanentemente",
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
