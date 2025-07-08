
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const GoogleAuth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const iniciarAutorizacao = () => {
    if (!email) {
      toast({
        title: "Erro",
        description: "Por favor, digite seu e-mail primeiro!",
        variant: "destructive"
      });
      return;
    }

    const clienteId = btoa(email); 
    const url_do_fluxo_1 = `https://webhook.tomazbello.com/webhook/iniciar-autorizacao-google?clienteId=${clienteId}`;

    window.location.href = url_do_fluxo_1;
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
            type="button"
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
                    Para iniciar a autorização do Google Calendar, digite seu e-mail e clique no botão abaixo.
                  </p>
                  <form onSubmit={(e) => { e.preventDefault(); iniciarAutorizacao(); }} className="flex flex-col items-center space-y-4">
                    <input 
                      type="email" 
                      id="emailCliente" 
                      placeholder="Digite seu e-mail" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full max-w-sm p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <Button 
                      type="submit"
                      size="lg"
                      className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold transition-all duration-200 hover:shadow-lg"
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      Conectar com Google
                    </Button>
                  </form>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Importante:</strong> Este processo iniciará o fluxo de autorização do Google Calendar, vinculando-o ao e-mail fornecido.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuth;
