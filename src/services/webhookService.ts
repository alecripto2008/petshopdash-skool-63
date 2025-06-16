
import { supabase } from "@/integrations/supabase/client";
import { WebhookConfig } from "@/types/webhook";

// Cache para as URLs dos webhooks
let webhookCache: Record<string, string> | null = null;

/**
 * Carrega todos os webhooks do banco de dados.
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
      console.error("Error loading webhooks from Supabase:", error);
      throw error;
    }

    if (data) {
      const webhooks = data as WebhookConfig[];
      console.log("Loaded webhooks from Supabase:", webhooks);
      webhooks.forEach(webhook => {
        if (webhook.identifier) {
          webhookMap[webhook.identifier] = webhook.url;
        }
        // Também adiciona por nome para compatibilidade
        webhookMap[webhook.name.toLowerCase().replace(/\s+/g, '_')] = webhook.url;
      });
    }
  } catch (dbError) {
    console.error("Exception during Supabase webhook loading:", dbError);
    throw dbError;
  }

  webhookCache = webhookMap;
  console.log("Final webhook map for cache:", webhookCache);
  return webhookMap;
}

/**
 * Obtém a URL de um webhook específico pelo seu identificador ou nome.
 */
export async function getWebhookUrl(identifier: string): Promise<string> {
  if (!webhookCache) {
    await loadWebhooks();
  }

  // Primeiro tenta pelo identificador
  let url = webhookCache?.[identifier];
  
  // Se não encontrar, tenta pelo nome formatado
  if (!url) {
    const formattedName = identifier.toLowerCase().replace(/\s+/g, '_');
    url = webhookCache?.[formattedName];
  }

  if (!url) {
    console.warn(`Webhook with identifier '${identifier}' not found`);
    return "";
  }

  return url;
}

/**
 * Obtém todos os webhooks carregados.
 */
export async function getAllWebhooks(): Promise<WebhookConfig[]> {
  try {
    const { data, error } = await supabase
      .from("webhook_configs")
      .select("*")
      .order("name");

    if (error) throw error;
    return data as WebhookConfig[];
  } catch (error) {
    console.error("Error fetching all webhooks:", error);
    return [];
  }
}

/**
 * Limpa o cache de webhooks forçando nova consulta ao banco na próxima chamada.
 */
export function clearWebhookCache(): void {
  webhookCache = null;
  console.log("Webhook cache cleared.");
}
