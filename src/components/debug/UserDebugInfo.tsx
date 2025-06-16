
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UserDebugInfo = () => {
  const { user } = useAuth();
  const { permissions, loading } = useUserPermissions();

  if (loading) {
    return (
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <p>Carregando informações do usuário...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-lg text-blue-800">
          🔍 Informações do Usuário Atual (Debug)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">ID do Usuário:</p>
            <code className="text-sm bg-gray-100 p-1 rounded">{user?.id}</code>
          </div>
          
          <div>
            <p className="font-semibold">Email:</p>
            <p>{user?.email}</p>
          </div>
          
          <div>
            <p className="font-semibold">Nome:</p>
            <p>{user?.user_metadata?.name || 'Não definido'}</p>
          </div>
          
          <div>
            <p className="font-semibold">Role Atual:</p>
            <Badge variant={permissions.role === 'admin' ? 'default' : 'secondary'}>
              {permissions.role || 'Não definida'}
            </Badge>
          </div>
          
          <div>
            <p className="font-semibold">Permissões:</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {Object.entries(permissions).map(([key, value]) => {
                if (key === 'role') return null;
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-sm">{key.replace('canAccess', '')}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {permissions.role === 'admin' && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <p className="text-green-800 font-semibold">
                ✅ Você é um Super Usuário (Admin) - Acesso Total ao Sistema
              </p>
            </div>
          )}
          
          {permissions.role !== 'admin' && (
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
              <p className="text-yellow-800 font-semibold">
                ⚠️ Você tem acesso limitado baseado na sua role: {permissions.role}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDebugInfo;
