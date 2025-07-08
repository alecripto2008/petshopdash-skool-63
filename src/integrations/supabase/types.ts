export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          active: boolean | null
          app: string | null
          bot_message: string | null
          conversation_id: string | null
          created_at: string
          id: number
          message_type: string | null
          phone: string | null
          user_id: string | null
          user_message: string | null
          user_name: string | null
        }
        Insert: {
          active?: boolean | null
          app?: string | null
          bot_message?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: number
          message_type?: string | null
          phone?: string | null
          user_id?: string | null
          user_message?: string | null
          user_name?: string | null
        }
        Update: {
          active?: boolean | null
          app?: string | null
          bot_message?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: number
          message_type?: string | null
          phone?: string | null
          user_id?: string | null
          user_message?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      chats: {
        Row: {
          app: string | null
          conversation_id: string | null
          created_at: string
          id: number
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          app?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: number
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          app?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: number
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          active: boolean | null
          app: string | null
          asaas_id: string | null
          city: string | null
          cliente_name: string | null
          complemento: string | null
          cpf: string | null
          created_at: string
          email: string | null
          id: number
          lat: string | null
          location: string | null
          logradouro: string | null
          long: string | null
          neighborhood: string | null
          phone: string | null
          street_number: string | null
          uf: string | null
          updated_at: string | null
          updatete_at: string | null
          zip_code: string | null
        }
        Insert: {
          active?: boolean | null
          app?: string | null
          asaas_id?: string | null
          city?: string | null
          cliente_name?: string | null
          complemento?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: number
          lat?: string | null
          location?: string | null
          logradouro?: string | null
          long?: string | null
          neighborhood?: string | null
          phone?: string | null
          street_number?: string | null
          uf?: string | null
          updated_at?: string | null
          updatete_at?: string | null
          zip_code?: string | null
        }
        Update: {
          active?: boolean | null
          app?: string | null
          asaas_id?: string | null
          city?: string | null
          cliente_name?: string | null
          complemento?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: number
          lat?: string | null
          location?: string | null
          logradouro?: string | null
          long?: string | null
          neighborhood?: string | null
          phone?: string | null
          street_number?: string | null
          uf?: string | null
          updated_at?: string | null
          updatete_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      dados_cliente: {
        Row: {
          address: string | null
          asaas_customer_id: string | null
          cpf_cnpj: string | null
          created_at: string | null
          email: string | null
          id: number
          nome: string | null
          nome_pet: string | null
          payments: Json | null
          porte_pet: string | null
          raca_pet: string | null
          sessionid: string | null
          telefone: string | null
        }
        Insert: {
          address?: string | null
          asaas_customer_id?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          nome?: string | null
          nome_pet?: string | null
          payments?: Json | null
          porte_pet?: string | null
          raca_pet?: string | null
          sessionid?: string | null
          telefone?: string | null
        }
        Update: {
          address?: string | null
          asaas_customer_id?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          nome?: string | null
          nome_pet?: string | null
          payments?: Json | null
          porte_pet?: string | null
          raca_pet?: string | null
          sessionid?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
          titulo: string | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          titulo?: string | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          titulo?: string | null
        }
        Relationships: []
      }
      feriados: {
        Row: {
          created_at: string
          data: string | null
          ferias: boolean | null
          habilitado: boolean | null
          id: number
          nome: string | null
        }
        Insert: {
          created_at?: string
          data?: string | null
          ferias?: boolean | null
          habilitado?: boolean | null
          id?: number
          nome?: string | null
        }
        Update: {
          created_at?: string
          data?: string | null
          ferias?: boolean | null
          habilitado?: boolean | null
          id?: number
          nome?: string | null
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          celphone: string | null
          client: string | null
          created_at: string
          description: string | null
          id: number
          sessionid: string | null
          type: string | null
          typeservice: string | null
          value: number | null
        }
        Insert: {
          celphone?: string | null
          client?: string | null
          created_at?: string
          description?: string | null
          id?: number
          sessionid?: string | null
          type?: string | null
          typeservice?: string | null
          value?: number | null
        }
        Update: {
          celphone?: string | null
          client?: string | null
          created_at?: string
          description?: string | null
          id?: number
          sessionid?: string | null
          type?: string | null
          typeservice?: string | null
          value?: number | null
        }
        Relationships: []
      }
      products: {
        Row: {
          content: string | null
          created_at: string | null
          embedding: string | null
          id: number
          metadata: Json | null
          titulo: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          titulo?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          titulo?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      professionals: {
        Row: {
          active: boolean | null
          app: string | null
          created_at: string
          email: string | null
          iCalUID: string | null
          id: number
          name: string | null
          phone: string | null
          resumo: string | null
        }
        Insert: {
          active?: boolean | null
          app?: string | null
          created_at?: string
          email?: string | null
          iCalUID?: string | null
          id?: number
          name?: string | null
          phone?: string | null
          resumo?: string | null
        }
        Update: {
          active?: boolean | null
          app?: string | null
          created_at?: string
          email?: string | null
          iCalUID?: string | null
          id?: number
          name?: string | null
          phone?: string | null
          resumo?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active: boolean
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          id: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tokens: {
        Row: {
          cached_tokens: number | null
          completion_tokens: number | null
          costUSD: number | null
          created_at: string
          data: string | null
          id: number
          message_input: string | null
          message_output: string | null
          momentdolar: number | null
          prompt_tokens: number | null
          totalcost: number | null
          totalcostreal: number | null
          workflow: string | null
        }
        Insert: {
          cached_tokens?: number | null
          completion_tokens?: number | null
          costUSD?: number | null
          created_at?: string
          data?: string | null
          id?: number
          message_input?: string | null
          message_output?: string | null
          momentdolar?: number | null
          prompt_tokens?: number | null
          totalcost?: number | null
          totalcostreal?: number | null
          workflow?: string | null
        }
        Update: {
          cached_tokens?: number | null
          completion_tokens?: number | null
          costUSD?: number | null
          created_at?: string
          data?: string | null
          id?: number
          message_input?: string | null
          message_output?: string | null
          momentdolar?: number | null
          prompt_tokens?: number | null
          totalcost?: number | null
          totalcostreal?: number | null
          workflow?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_configs: {
        Row: {
          created_at: string
          description: string | null
          id: number
          identifier: string | null
          name: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          identifier?: string | null
          name: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          identifier?: string | null
          name?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_products: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      user_role: "admin" | "manager" | "user" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "manager", "user", "viewer"],
    },
  },
} as const
