
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Check } from 'lucide-react';

type ConfirmationStatus = 'waiting' | 'confirmed' | 'failed' | null;

interface QrCodeSectionProps {
  qrCodeData: string;
  confirmationStatus: ConfirmationStatus;
  instanceName: string;
  isLoading: boolean;
  retryCount: number;
  maxRetries: number;
  onTryAgain: () => void;
  onReset: () => void;
  onNavigateBack: () => void;
}

export const QrCodeSection = ({
  qrCodeData,
  confirmationStatus,
  instanceName,
  isLoading,
  retryCount,
  maxRetries,
  onTryAgain,
  onReset,
  onNavigateBack
}: QrCodeSectionProps) => {
  if (confirmationStatus === 'confirmed') {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Conectado com Sucesso!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Seu WhatsApp foi conectado à instância <span className="font-semibold">{instanceName}</span>.
        </p>
        <Button onClick={onNavigateBack} variant="default" className="mt-4">
          Voltar ao Dashboard
        </Button>
      </div>
    );
  }

  if (confirmationStatus === 'failed') {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Falha na Conexão
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Não foi possível conectar o WhatsApp à instância <span className="font-semibold">{instanceName}</span> após várias tentativas.
        </p>
        <Button
          onClick={onTryAgain}
          variant="default"
          className="mt-4 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processando...
            </span>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <div className="bg-white p-4 rounded-md inline-block mx-auto">
        <img
          src={qrCodeData}
          alt="QR Code para conectar WhatsApp"
          className="mx-auto max-w-full h-auto"
          style={{ maxHeight: '250px' }}
        />
      </div>

      <div className="space-y-2 text-center">
        <h3 className="font-medium text-lg">Conecte seu WhatsApp</h3>
        <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-2 text-left list-decimal pl-5">
          <li>Abra o WhatsApp no seu celular</li>
          <li>Toque em Menu ou Configurações e selecione Aparelhos conectados</li>
          <li>Toque em Conectar um aparelho</li>
          <li>Escaneie o código QR</li>
        </ol>

        {confirmationStatus === 'waiting' && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-amber-600 dark:text-amber-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>
              Aguardando conexão
              {retryCount > 0 ? ` (Tentativa ${retryCount}/${maxRetries})` : '...'}
            </span>
          </div>
        )}

        {confirmationStatus !== 'waiting' && confirmationStatus !== 'confirmed' && (
          <Button onClick={onReset} variant="outline" className="mt-4">
            Voltar
          </Button>
        )}
      </div>
    </div>
  );
};
