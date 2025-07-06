
export interface Client {
  id: number;
  telefone: string;
  nome: string;
  email: string;
  sessionid: string;
  cpf_cnpj?: string;
  nome_pet?: string;
  porte_pet?: string;
  raca_pet?: string;
}

export interface ChatMessage {
  role: string;
  content: string;
  timestamp: string;
  type?: string;
}

export interface N8nChatHistory {
  id: number;
  session_id: string;
  message: any; // This can be various formats, we'll parse it properly
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  phone: string;
  email: string;
  address?: string;
  petName?: string;
  petType?: string;
  petBreed?: string;
  sessionId: string;
}
