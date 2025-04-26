
export interface WebhookConfig {
  id: number;
  name: string;
  url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  identifier: string; // Identificador único para referenciar o webhook no código
}

// Constantes para identificar os webhooks na aplicação
export const WEBHOOK_IDENTIFIERS = {
  SEND_MESSAGE: 'send_message',
  PAUSE_BOT: 'pause_bot',
  START_BOT: 'start_bot',
  UPLOAD_RAG: 'upload_rag',
  DELETE_FILE_RAG: 'delete_file_rag',
  CLEAR_RAG: 'clear_rag',
  CREATE_EVOLUTION_INSTANCE: 'create_evolution_instance',
  UPDATE_QR_CODE: 'update_qr_code',
  CONFIRM_EVOLUTION: 'confirm_evolution',
  CREATE_USER: 'cria_usuario',
  UPDATE_USER: 'edita_usuario',
  DELETE_USER: 'exclui_usuario',
  CONFIG_AGENT: 'config_agent'
}
