
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';

const GoogleAuth = () => {
  const navigate = useNavigate();

  const handleAuthorize = () => {
    // Aqui será implementada a lógica de autorização do Google
    console.log('Iniciando autorização do Google...');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            onClick={handleBack}
            variant="ghost" 
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="text-center pb-6 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white rounded-t-lg">
              <div className="mb-4 flex justify-center">
                <div className="bg-white/20 p-4 rounded-full">
                  <Shield className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">
                Autorização de Integração Segura
              </CardTitle>
              <CardDescription className="text-red-100 mt-2">
                Configure a autenticação com Google de forma segura
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Para integrar a autenticação com Google, é necessário autorizar a conexão 
                    entre sua aplicação e os serviços do Google.
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Segurança:</strong> Esta integração seguirá os protocolos OAuth 2.0 
                      do Google para garantir a máxima segurança dos dados.
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleAuthorize}
                    size="lg"
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Autorizar
                  </Button>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  Ao clicar em "Autorizar", você será redirecionado para o Google para 
                  completar a configuração da integração.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuth;
