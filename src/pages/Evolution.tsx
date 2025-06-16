
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Link, PawPrint, Plus, QrCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { QrCodeSection } from '@/components/evolution/QrCodeSection';
import { InstanceForm } from '@/components/evolution/InstanceForm';
import { useEvolution } from '@/hooks/evolution/useEvolution';

const Evolution = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    instanceName,
    setInstanceName,
    isLoading,
    qrCodeData,
    confirmationStatus,
    retryCount,
    maxRetries,
    handleCreateInstance,
    handleTryAgain,
    resetQrCode
  } = useEvolution();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-petshop-blue dark:bg-gray-800 text-white shadow-md transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <PawPrint className="h-8 w-8 text-petshop-gold" />
            <h1 className="text-2xl font-bold">PetShop</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1">
              {user?.user_metadata?.name || user?.email}
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
            <Link className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            Conectar Evolution
          </h2>
        </div>

        <div className="max-w-xl mx-auto">
          <Card className="dark:bg-gray-800 shadow-lg border-green-100 dark:border-green-900/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                {qrCodeData ? (
                  <QrCode className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
                {qrCodeData ? "Conectar WhatsApp" : "Criar Nova Instância"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {qrCodeData ? (
                <QrCodeSection
                  qrCodeData={qrCodeData}
                  confirmationStatus={confirmationStatus}
                  instanceName={instanceName}
                  isLoading={isLoading}
                  retryCount={retryCount}
                  maxRetries={maxRetries}
                  onTryAgain={handleTryAgain}
                  onReset={resetQrCode}
                  onNavigateBack={() => navigate('/dashboard')}
                />
              ) : (
                <InstanceForm
                  instanceName={instanceName}
                  onInstanceNameChange={setInstanceName}
                  onSubmit={handleCreateInstance}
                  isLoading={isLoading}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Evolution;
