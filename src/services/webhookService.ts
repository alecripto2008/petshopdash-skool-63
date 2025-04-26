import { supabase } from '@/integrations/supabase/client';
import { WebhookConfig, WEBHOOK_IDENTIFIERS } from '@/types/webhook';

// URLs padrão para fallback caso não estejam no banco
const DEFAULT_WEBHOOKS = {
  [WEBHOOK_IDENTIFIERS.SEND_MESSAGE]: 'https://webhook.n8nlabz.com.br/webhook/send-message',
  [WEBHOOK_IDENTIFIERS.PAUSE_BOT]: 'https://webhook.n8nlabz.com.br/webhook/pause-bot',
  [WEBHOOK_IDENTIFIERS.START_BOT]: 'https://webhook.n8nlabz.com.br/webhook/start-bot',
  [WEBHOOK_IDENTIFIERS.UPLOAD_RAG]: 'https://webhook.n8nlabz.com.br/webhook/upload-rag',
  [WEBHOOK_IDENTIFIERS.DELETE_FILE_RAG]: 'https://webhook.n8nlabz.com.br/webhook/delete-file-rag',
  [WEBHOOK_IDENTIFIERS.CLEAR_RAG]: 'https://webhook.n8nlabz.com.br/webhook/clear-rag',
  [WEBHOOK_IDENTIFIERS.CREATE_EVOLUTION_INSTANCE]: 'https://webhook.n8nlabz.com.br/webhook/create-evolution-instance',
  [WEBHOOK_IDENTIFIERS.UPDATE_QR_CODE]: 'https://webhook.n8nlabz.com.br/webhook/update-qr-code',
  [WEBHOOK_IDENTIFIERS.CONFIRM_EVOLUTION]: 'https://webhook.n8nlabz.com.br/webhook/confirm-evolution',
  [WEBHOOK_IDENTIFIERS.CREATE_USER]: 'https://webhook.n8nlabz.com.br/webhook/create-user',
  [WEBHOOK_IDENTIFIERS.UPDATE_USER]: 'https://webhook.n8nlabz.com.br/webhook/update-user',
  [WEBHOOK_IDENTIFIERS.DELETE_USER]: 'https://webhook.n8nlabz.com.br/webhook/delete-user',
  [WEBHOOK_IDENTIFIERS.CONFIG_AGENT]: 'https://webhook.n8nlabz.com.br/webhook/config-agent',
  [WEBHOOK_IDENTIFIERS.CRIA_USUARIO]: 'https://webhook.n8nlabz.com.br/webhook/cria-usuario',
  [WEBHOOK_IDENTIFIERS.CONFIRM_EVOLUTION_STATUS]: 'https://webhook.n8nlabz.com.br/webhook/confirma',
  [WEBHOOK_IDENTIFIERS.UPDATE_EVOLUTION_QR]: 'https://webhook.n8nlabz.com.br/webhook/atualizar-qr-code',
  [WEBHOOK_IDENTIFIERS.CREATE_EVOLUTION_INSTANCE]: 'https://webhook.n8nlabz.com.br/webhook/instanciaevolution'
};

// Cache para as URLs dos webhooks
let webhookCache: Record<string, string> | null = null;

/**
 * Carrega todos os webhooks do banco de dados
 */
export async function loadWebhooks(): Promise<Record<string, string>> {
  try {
    console.log("Loading webhooks from database...");
    const { data, error } = await supabase
      .from('webhook_configs')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    const webhooks = data as WebhookConfig[];
    const webhookMap: Record<string, string> = {};

    console.log("Loaded webhooks:", webhooks);

    // Mapeia os webhooks pelo identificador
    webhooks.forEach(webhook => {
      if (webhook.identifier) {
        webhookMap[webhook.identifier] = webhook.url;
      }
    });

    // Preenche com valores padrão caso algum esteja faltando
    Object.keys(DEFAULT_WEBHOOKS).forEach(key => {
      if (!webhookMap[key]) {
        webhookMap[key] = DEFAULT_WEBHOOKS[key as keyof typeof DEFAULT_WEBHOOKS];
      }
    });

    webhookCache = webhookMap;
    return webhookMap;
  } catch (error) {
    console.error('Erro ao carregar webhooks:', error);
    // Em caso de erro, retorna os webhooks padrão
    return { ...DEFAULT_WEBHOOKS };
  }
}

/**
 * Obtém a URL de um webhook específico pelo seu identificador
 */
export async function getWebhookUrl(identifier: string): Promise<string> {
  // Se o cache estiver vazio, carrega os webhooks
  if (!webhookCache) {
    await loadWebhooks();
  }

  // Retorna do cache ou o valor padrão
  return webhookCache?.[identifier] || 
         DEFAULT_WEBHOOKS[identifier as keyof typeof DEFAULT_WEBHOOKS] || 
         '';
}

/**
 * Limpa o cache de webhooks forçando nova consulta ao banco
 */
export function clearWebhookCache(): void {
  webhookCache = null;
}
