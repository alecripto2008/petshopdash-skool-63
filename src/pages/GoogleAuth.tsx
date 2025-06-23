
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const GoogleAuth = () => {
  const navigate = useNavigate();

  const handleAuthorize = async () => {
    try {
      console.log('🔄 Iniciando autorização do Google Calendar...');
      
      // Busca o Client ID do Google via Edge Function
      console.log('📡 Chamando Edge Function para buscar Client ID...');
      const { data, error } = await supabase.functions.invoke('get-google-client-id');
      
      console.log('📊 Resposta da Edge Function:', { data, error });
      
      if (error) {
        console.error('❌ Erro na Edge Function:', error);
        throw new Error(`Erro na Edge Function: ${error.message}`);
      }
      
      if (!data?.clientId) {
        console.error('❌ Client ID não retornado:', data);
        throw new Error('Client ID do Google não configurado ou não encontrado');
      }

      console.log('✅ Client ID obtido com sucesso:', data.clientId.substring(0, 20) + '...');

      // URL atual da aplicação
      const currentOrigin = window.location.origin;
      console.log('🌐 Origin atual da aplicação:', currentOrigin);

      // Tentar diferentes formatos de state para n8n
      const timestamp = Date.now();
      const stateFormats = [
        timestamp.toString(), // Apenas número
        `${timestamp}`, // Template string
        btoa(timestamp.toString()), // Base64 encoded
        `state_${timestamp}`, // Com prefixo
        'test123', // State fixo para teste
      ];

      // Usar o primeiro formato por padrão, mas log todos para debugging
      const stateValue = stateFormats[0];
      console.log('🔑 Formatos de state testados:', stateFormats);
      console.log('🔑 State escolhido:', stateValue);
      console.log('🔑 Tipo do state:', typeof stateValue);
      console.log('🔑 Comprimento do state:', stateValue.length);

      // Parâmetros OAuth 2.0 do Google para Calendar
      const googleAuthParams = new URLSearchParams({
        client_id: data.clientId,
        redirect_uri: 'https://n8n.tomazbello.com/rest/oauth2-credential/callback',
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
        access_type: 'offline',
        prompt: 'consent',
        state: stateValue
      });

      // URL de autorização do Google
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${googleAuthParams.toString()}`;
      
      console.log('🔗 Parâmetros OAuth completos:', Object.fromEntries(googleAuthParams.entries()));
      console.log('🔗 URL de autorização construída:', googleAuthUrl);
      console.log('🔗 Redirect URI usado:', 'https://n8n.tomazbello.com/rest/oauth2-credential/callback');
      console.log('🚀 Redirecionando para o Google OAuth...');
      
      // Mostrar alerta antes de redirecionar
      alert(`State sendo usado: ${stateValue}\nTipo: ${typeof stateValue}\nComprimento: ${stateValue.length}\n\nVerifique o console para logs completos.`);
      
      // Redireciona para o Google OAuth
      window.location.href = googleAuthUrl;
      
    } catch (error) {
      console.error('💥 Erro ao iniciar autorização:', error);
      toast({
        title: "Erro na Autorização",
        description: `Erro: ${error.message}. Verifique o console para mais detalhes.`,
        variant: "destructive"
      });
    }
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
                Autorização Google Calendar
              </CardTitle>
              <CardDescription className="text-red-100 mt-2">
                Configure a autenticação com Google Calendar de forma segura
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Para integrar o Google Calendar com o n8n, é necessário autorizar a conexão 
                    entre sua aplicação e o Google Calendar via OAuth 2.0.
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Google Calendar:</strong> Esta integração permitirá acessar e gerenciar 
                      eventos do seu Google Calendar através do n8n de forma segura.
                    </p>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <strong>Debug:</strong> Abra o console do navegador (F12) para ver logs 
                      detalhados do processo de autorização. Um alerta também mostrará detalhes do state.
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleAuthorize}
                    size="lg"
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold transition-all duration-200 hover:shadow-lg"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Autorizar Google Calendar
                  </Button>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  Ao clicar em "Autorizar Google Calendar", você será redirecionado para o Google para 
                  completar a configuração da integração OAuth 2.0 com o Calendar.
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
