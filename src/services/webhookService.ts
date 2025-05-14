import { supabase } from "@/integrations/supabase/client";
import { WebhookConfig, WEBHOOK_IDENTIFIERS } from "@/types/webhook";

// Mapeamento dos identificadores para as variáveis de ambiente esperadas
const ENV_VAR_MAP: Record<string, string> = {
  [WEBHOOK_IDENTIFIERS.PAUSE_BOT]: "VITE_WEBHOOK_URL_PAUSE_BOT",
  [WEBHOOK_IDENTIFIERS.UPLOAD_RAG]: "VITE_WEBHOOK_URL_UPLOAD_RAG",
  [WEBHOOK_IDENTIFIERS.CONFIRM_EVOLUTION_STATUS]: "VITE_WEBHOOK_URL_CONFIRM_EVOLUTION_STATUS",
  [WEBHOOK_IDENTIFIERS.UPDATE_EVOLUTION_QR]: "VITE_WEBHOOK_URL_UPDATE_EVOLUTION_QR",
  [WEBHOOK_IDENTIFIERS.CONFIG_AGENT]: "VITE_WEBHOOK_URL_CONFIG_AGENT",
};

// URLs padrão para fallback final caso não estejam no banco nem nas variáveis de ambiente
const FALLBACK_DEFAULT_WEBHOOKS = {
  [WEBHOOK_IDENTIFIERS.PAUSE_BOT]: "https://webhook.n8nlabz.com.br/webhook/pause-bot",
  [WEBHOOK_IDENTIFIERS.UPLOAD_RAG]: "https://webhook.n8nlabz.com.br/webhook/upload-rag",
  [WEBHOOK_IDENTIFIERS.CONFIRM_EVOLUTION_STATUS]: "https://webhook.n8nlabz.com.br/webhook/confirma",
  [WEBHOOK_IDENTIFIERS.UPDATE_EVOLUTION_QR]: "https://webhook.n8nlabz.com.br/webhook/atualizar-qr-code",
  [WEBHOOK_IDENTIFIERS.CONFIG_AGENT]: "https://webhook.n8nlabz.com.br/webhook/config_agent",
};

// Cache para as URLs dos webhooks
let webhookCache: Record<string, string> | null = null;

/**
 * Obtém a URL de uma variável de ambiente específica.
 */
function getEnvWebhookUrl(identifier: string): string | undefined {
  const envVarName = ENV_VAR_MAP[identifier];
  if (envVarName) {
    // Em projetos Vite, as variáveis de ambiente são acessadas via import.meta.env
    return import.meta.env[envVarName] as string | undefined;
  }
  return undefined;
}

/**
 * Carrega todos os webhooks, priorizando Supabase, depois variáveis de ambiente, depois fallbacks.
 */
export async function loadWebhooks(): Promise<Record<string, string>> {
  const webhookMap: Record<string, string> = {};

  try {
    console.log("Loading webhooks from database...");
    const { data, error } = await supabase
      .from("webhook_configs")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error loading webhooks from Supabase, will try environment variables and fallbacks:", error);
      // Não lança o erro aqui, permite tentar as outras fontes
    } else if (data) {
      const webhooks = data as WebhookConfig[];
      console.log("Loaded webhooks from Supabase:", webhooks);
      webhooks.forEach(webhook => {
        if (webhook.identifier) {
          webhookMap[webhook.identifier] = webhook.url;
        }
      });
    }
  } catch (dbError) {
    console.error("Exception during Supabase webhook loading:", dbError);
  }

  // Preenche com variáveis de ambiente se não vieram do Supabase
  Object.keys(ENV_VAR_MAP).forEach(identifier => {
    if (!webhookMap[identifier]) { // Só preenche se não veio do Supabase
      const envUrl = getEnvWebhookUrl(identifier);
      if (envUrl) {
        webhookMap[identifier] = envUrl;
        console.log(`Webhook ${identifier} loaded from environment variable.`);
      }
    }
  });

  // Preenche com valores de fallback final caso algum esteja faltando
  Object.keys(FALLBACK_DEFAULT_WEBHOOKS).forEach(key => {
    if (!webhookMap[key]) {
      webhookMap[key] = FALLBACK_DEFAULT_WEBHOOKS[key as keyof typeof FALLBACK_DEFAULT_WEBHOOKS];
      console.log(`Webhook ${key} using hardcoded fallback.`);
    }
  });

  webhookCache = webhookMap;
  console.log("Final webhook map for cache:", webhookCache);
  return webhookMap;
}

/**
 * Obtém a URL de um webhook específico pelo seu identificador.
 * A ordem de prioridade é: Cache -> Supabase (via loadWebhooks se cache vazio) -> Env Var (via loadWebhooks) -> Fallback (via loadWebhooks).
 */
export async function getWebhookUrl(identifier: string): Promise<string> {
  if (!webhookCache) {
    await loadWebhooks(); // Carrega e popula o cache com a lógica de prioridade
  }

  // Retorna do cache. Se não estiver lá, é um identificador desconhecido.
  return webhookCache?.[identifier] || 
         FALLBACK_DEFAULT_WEBHOOKS[identifier as keyof typeof FALLBACK_DEFAULT_WEBHOOKS] || // Fallback final para segurança
         ""; // Retorna string vazia se realmente não encontrado em lugar nenhum
}

/**
 * Limpa o cache de webhooks forçando nova consulta ao banco e recarga das env vars na próxima chamada.
 */
export function clearWebhookCache(): void {
  webhookCache = null;
  console.log("Webhook cache cleared.");
}

