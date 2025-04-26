
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
  SEND_MESSAGE: 'send_message',
  PAUSE_BOT: 'pause_bot',
  UPLOAD_RAG: 'upload_rag',
  CREATE_EVOLUTION_INSTANCE: 'create_evolution_instance',
  UPDATE_QR_CODE: 'update_qr_code',
  CRIA_USUARIO: 'cria_usuario',
  CONFIRM_EVOLUTION_STATUS: 'confirm_evolution_status',
  UPDATE_EVOLUTION_QR: 'update_evolution_qr'
}
