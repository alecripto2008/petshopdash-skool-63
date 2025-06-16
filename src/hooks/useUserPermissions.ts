
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'admin' | 'manager' | 'user' | 'viewer';

interface UserPermissions {
  role: UserRole | null;
  canAccessEvolution: boolean;
  canAccessConfig: boolean;
  canAccessTokenCost: boolean;
  canAccessMetrics: boolean;
  canAccessKnowledge: boolean;
  canAccessPayments: boolean;
  canAccessSchedule: boolean;
  canAccessClients: boolean;
  canAccessProducts: boolean;
  canAccessUsers: boolean;
  canAccessChats: boolean;
}

export const useUserPermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<UserPermissions>({
    role: null,
    canAccessEvolution: false,
    canAccessConfig: false,
    canAccessTokenCost: false,
    canAccessMetrics: false,
    canAccessKnowledge: false,
    canAccessPayments: false,
    canAccessSchedule: false,
    canAccessClients: false,
    canAccessProducts: false,
    canAccessUsers: false,
    canAccessChats: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: userRoles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setLoading(false);
          return;
        }

        const role = userRoles?.role as UserRole;
        
        // Define permissions based on role
        const newPermissions: UserPermissions = {
          role,
          // Admin tem acesso total
          canAccessEvolution: role === 'admin',
          canAccessConfig: role === 'admin',
          canAccessTokenCost: role === 'admin',
          canAccessMetrics: role === 'admin' || role === 'manager',
          canAccessKnowledge: role === 'admin' || role === 'manager',
          canAccessPayments: role === 'admin' || role === 'manager',
          canAccessSchedule: role === 'admin' || role === 'manager' || role === 'user' || role === 'viewer',
          canAccessClients: role === 'admin' || role === 'manager' || role === 'user',
          canAccessProducts: role === 'admin' || role === 'manager' || role === 'user',
          canAccessUsers: role === 'admin',
          canAccessChats: role === 'admin' || role === 'manager',
        };

        setPermissions(newPermissions);
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { permissions, loading };
};
