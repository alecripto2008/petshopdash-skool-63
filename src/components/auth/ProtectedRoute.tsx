
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: keyof Omit<typeof useUserPermissions extends () => { permissions: infer P } ? P : never, 'role'>;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission,
  fallbackPath = '/dashboard' 
}) => {
  const { user, isLoading: authLoading } = useAuth();
  const { permissions, loading: permissionsLoading } = useUserPermissions();

  // Mostrar loading enquanto autentica ou carrega permissões
  if (authLoading || permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-petshop-blue dark:bg-gray-900">
        <div className="h-16 w-16 border-4 border-t-transparent border-petshop-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  // Se não tem usuário, redireciona para login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Se tem uma permissão específica requerida e o usuário não tem essa permissão
  if (requiredPermission && !permissions[requiredPermission]) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
