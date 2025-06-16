
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
        console.log(`Processing webhook: ${webhook.name}, identifier: ${webhook.identifier}, url: ${webhook.url}`);
        if (webhook.identifier) {
          webhookMap[webhook.identifier] = webhook.url;
          console.log(`Added to cache by identifier: ${webhook.identifier} -> ${webhook.url}`);
        }
        // Também adiciona por nome para compatibilidade
        const nameKey = webhook.name.toLowerCase().replace(/\s+/g, '_');
        webhookMap[nameKey] = webhook.url;
        console.log(`Added to cache by name: ${nameKey} -> ${webhook.url}`);
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
  console.log("Getting webhook URL for identifier:", identifier);
  
  if (!webhookCache) {
    console.log("Cache not loaded, loading webhooks...");
    await loadWebhooks();
  }

  console.log("Current webhook cache:", webhookCache);

  // Primeiro tenta pelo identificador
  let url = webhookCache?.[identifier];
  console.log("Found URL by identifier:", url);
  
  // Se não encontrar, tenta pelo nome formatado
  if (!url) {
    const formattedName = identifier.toLowerCase().replace(/\s+/g, '_');
    url = webhookCache?.[formattedName];
    console.log("Found URL by formatted name:", formattedName, "->", url);
  }

  if (!url) {
    console.warn(`Webhook with identifier '${identifier}' not found`);
    console.log("Available webhook identifiers:", Object.keys(webhookCache || {}));
    return "";
  }

  console.log("Returning webhook URL:", url);
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
