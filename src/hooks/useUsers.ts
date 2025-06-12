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
      console.log('Fetching users...');
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles(role)
        `)
        .order('created_at', { ascending: false });

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
        throw profileError;
      }

      console.log('Profiles fetched:', profiles);
      return profiles.map(profile => ({
        ...profile,
        roles: profile.user_roles?.map(ur => ur.role) || []
      })) as UserProfile[];
    },
  });

  const addUserMutation = useMutation({
    mutationFn: async (userData: { name: string; email: string; password: string; phone?: string; role: string }) => {
      console.log('Starting user creation process...', userData);
      
      // Criar usuário no auth
      console.log('Creating auth user...');
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          name: userData.name,
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      console.log('Auth user created:', authData.user);

      // Atualizar perfil
      if (userData.phone) {
        console.log('Updating profile with phone...');
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ phone: userData.phone })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
          throw profileError;
        }
        console.log('Profile updated with phone');
      }

      // Atribuir role se não for 'user'
      if (userData.role !== 'user') {
        console.log('Assigning role:', userData.role);
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: userData.role as UserRole,
          });

        if (roleError) {
          console.error('Role assignment error:', roleError);
          throw roleError;
        }
        console.log('Role assigned successfully');
      }

      console.log('User creation completed successfully');
      return authData.user;
    },
    onSuccess: () => {
      console.log('Mutation successful, invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Usuário criado",
        description: "Usuário criado com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
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
      // Remover roles existentes
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Adicionar nova role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role as UserRole,
        });

      if (error) throw error;
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
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Usuário removido",
        description: "Usuário removido com sucesso!",
      });
    },
    onError: (error: any) => {
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
