
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
  // Mensagens
  ENVIAR_MENSAGEM: 'enviar_mensagem',
  PAUSA_BOT: 'pausa_bot',
  CHAT_ENVIAR_MENSAGEM: 'chat_enviar_mensagem',
  
  // Agenda
  CARREGA_AGENDA: 'carrega_agenda',
  CRIA_EVENTO: 'cria_evento',
  ALTERA_EVENTO: 'altera_evento',
  EXCLUI_EVENTO: 'exclui_evento',
  
  // Evolution
  CREATE_EVOLUTION_INSTANCE: 'create_evolution_instance',
  UPDATE_EVOLUTION_QR: 'update_evolution_qr',
  CONFIRM_EVOLUTION_STATUS: 'confirm_evolution_status',
  
  // RAG Documentos
  INSERIR_DADOS_RAG_DOCS: 'inserir_dados_rag_documentos',
  DELETAR_ARQUIVO_RAG_DOCS: 'deletar_arquivo_rag_documentos',
  DELETAR_TUDO_RAG_DOCS: 'deletar_tudo_rag_documentos',
  
  // RAG Produtos
  INSERIR_DADOS_RAG_PRODUTOS: 'inserir_dados_rag_produtos',
  DELETAR_ARQUIVO_RAG_PRODUTOS: 'deletar_arquivo_rag_produtos',
  DELETAR_TUDO_RAG_PRODUTOS: 'deletar_tudo_rag_produtos',
  
  // Configuração de Agente
  CONFIG_AGENT: 'config_agent'
} as const;
