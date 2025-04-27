
export interface WebhookConfig {
  id: number;
  name: string;
  url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  identifier: string | null;
}

export const WEBHOOK_IDENTIFIERS = {
  PAUSE_BOT: 'pause_bot',
  UPLOAD_RAG: 'upload_rag',
  CONFIRM_EVOLUTION_STATUS: 'confirm_evolution_status',
  UPDATE_EVOLUTION_QR: 'update_evolution_qr',
  CONFIG_AGENT: 'config_agent'
}
