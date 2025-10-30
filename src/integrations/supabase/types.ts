export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      active_shifts: {
        Row: {
          created_at: string | null
          id: string
          start_time: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          start_time?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          start_time?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "active_shifts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contagens_inventario: {
        Row: {
          categoria: string | null
          codigo_barras: string | null
          contagem_fechada: boolean | null
          created_at: string | null
          descricao: string | null
          diferenca: number | null
          id: string
          nome: string | null
          product_id: string | null
          quantidade_contada: number
          quantidade_estoque: number | null
          usuario: string | null
        }
        Insert: {
          categoria?: string | null
          codigo_barras?: string | null
          contagem_fechada?: boolean | null
          created_at?: string | null
          descricao?: string | null
          diferenca?: number | null
          id?: string
          nome?: string | null
          product_id?: string | null
          quantidade_contada: number
          quantidade_estoque?: number | null
          usuario?: string | null
        }
        Update: {
          categoria?: string | null
          codigo_barras?: string | null
          contagem_fechada?: boolean | null
          created_at?: string | null
          descricao?: string | null
          diferenca?: number | null
          id?: string
          nome?: string | null
          product_id?: string | null
          quantidade_contada?: number
          quantidade_estoque?: number | null
          usuario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contagens_inventario_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      inventario_logs: {
        Row: {
          acao: string | null
          data: string | null
          id: string
          product_id: string | null
          valor_antigo: number | null
          valor_novo: number | null
        }
        Insert: {
          acao?: string | null
          data?: string | null
          id?: string
          product_id?: string | null
          valor_antigo?: number | null
          valor_novo?: number | null
        }
        Update: {
          acao?: string | null
          data?: string | null
          id?: string
          product_id?: string | null
          valor_antigo?: number | null
          valor_novo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventario_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      ponto: {
        Row: {
          id: string
          user_id: string
          entrada: string
          saida: string | null
        }
        Insert: {
          id?: string
          user_id: string
          entrada: string
          saida?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          entrada?: string
          saida?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ponto_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          categoria: string | null
          codigo_barras: string | null
          contagem_fechada: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          preco: number
          quantidade_estoque: number
          unidade: string | null
          updated_at: string | null
        }
        Insert: {
          codigo_barras?: string | null
          contagem_fechada?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          preco?: number
          quantidade_estoque?: number
          unidade?: string | null
          updated_at?: string | null
        }
        Update: {
          codigo_barras?: string | null
          contagem_fechada?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          preco?: number
          quantidade_estoque?: number
          unidade?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      receipt_items: {
        Row: {
          codigo_produto: string | null
          created_at: string | null
          id: string
          nome_produto: string | null
          product_id: string | null
          quantidade: number
          receipt_id: string | null
          valor_unitario: number | null
        }
        Insert: {
          codigo_produto?: string | null
          created_at?: string | null
          id?: string
          nome_produto?: string | null
          product_id?: string | null
          quantidade: number
          receipt_id?: string | null
          valor_unitario?: number | null
        }
        Update: {
          codigo_produto?: string | null
          created_at?: string | null
          id?: string
          nome_produto?: string | null
          product_id?: string | null
          quantidade?: number
          receipt_id?: string | null
          valor_unitario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "receipt_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipt_items_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          created_at: string | null
          created_by: string | null
          data_recebimento: string | null
          fornecedor: string | null
          id: string
          numero_nota: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          data_recebimento?: string | null
          fornecedor?: string | null
          id?: string
          numero_nota?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          data_recebimento?: string | null
          fornecedor?: string | null
          id?: string
          numero_nota?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          codigo_produto: string | null
          id: string
          nome_produto: string | null
          preco_unitario: number
          product_id: string | null
          quantidade: number
          sale_id: string | null
        }
        Insert: {
          codigo_produto?: string | null
          id?: string
          nome_produto?: string | null
          preco_unitario: number
          product_id?: string | null
          quantidade: number
          sale_id?: string | null
        }
        Update: {
          codigo_produto?: string | null
          id?: string
          nome_produto?: string | null
          preco_unitario?: number
          product_id?: string | null
          quantidade?: number
          sale_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string | null
          forma_pagamento: Database["public"]["Enums"]["payment_method"] | null
          id: string
          total: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          forma_pagamento?: Database["public"]["Enums"]["payment_method"] | null
          id?: string
          total: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          forma_pagamento?: Database["public"]["Enums"]["payment_method"] | null
          id?: string
          total?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_closures: {
        Row: {
          average_ticket: number
          created_at: string | null
          end_time: string
          id: string
          payment_summary: Json | null
          report_data: Json | null
          shift_end_time: string | null
          shift_start_time: string | null
          start_time: string
          total_amount: number
          total_sales: number
          user_id: string | null
        }
        Insert: {
          average_ticket?: number
          created_at?: string | null
          end_time: string
          id?: string
          payment_summary?: Json | null
          report_data?: Json | null
          shift_end_time?: string | null
          shift_start_time?: string | null
          start_time: string
          total_amount?: number
          total_sales?: number
          user_id?: string | null
        }
        Update: {
          average_ticket?: number
          created_at?: string | null
          end_time?: string
          id?: string
          payment_summary?: Json | null
          report_data?: Json | null
          shift_end_time?: string | null
          shift_start_time?: string | null
          start_time?: string
          total_amount?: number
          total_sales?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shift_closures_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          created_at: string | null
          id: string
          motivo: string | null
          product_id: string | null
          quantidade: number
          ref_id: string | null
          tipo: Database["public"]["Enums"]["movement_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          motivo?: string | null
          product_id?: string | null
          quantidade: number
          ref_id?: string | null
          tipo: Database["public"]["Enums"]["movement_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          motivo?: string | null
          product_id?: string | null
          quantidade?: number
          ref_id?: string | null
          tipo?: Database["public"]["Enums"]["movement_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          blocked: boolean | null
          cargo: string | null
          cpf: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          password_hash: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          blocked?: boolean | null
          cargo?: string | null
          cpf?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          password_hash: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          blocked?: boolean | null
          cargo?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          password_hash?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      waste_records: {
        Row: {
          confirmed: boolean | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string | null
          id: string
          image_paths: string[] | null
          motivo: string | null
          product_id: string | null
          quantidade: number
          user_id: string | null
        }
        Insert: {
          confirmed?: boolean | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          id?: string
          image_paths?: string[] | null
          motivo?: string | null
          product_id?: string | null
          quantidade: number
          user_id?: string | null
        }
        Update: {
          confirmed?: boolean | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          id?: string
          image_paths?: string[] | null
          motivo?: string | null
          product_id?: string | null
          quantidade?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waste_records_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waste_records_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waste_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_product_and_dependencies: {
        Args: { p_product_id: string }
        Returns: undefined
      }
      register_waste: {
        Args: {
          p_image_paths: string[]
          p_motivo: string
          p_product_id: string
          p_quantidade: number
          p_user_id: string
        }
        Returns: string
      }
      sync_contagem_with_estoque: {
        Args: { p_product_id: string }
        Returns: undefined
      }
      upsert_contagem_inventario: {
        Args: {
          p_categoria: string
          p_codigo_barras: string
          p_descricao: string
          p_nome: string
          p_product_id: string
          p_quantidade_contada: number
          p_quantidade_estoque?: number
          p_usuario: string
        }
        Returns: {
          categoria: string
          codigo_barras: string
          contagem_fechada: boolean
          created_at: string
          descricao: string
          diferenca: number
          id: string
          nome: string
          product_id: string
          quantidade_contada: number
          quantidade_estoque: number
          usuario: string
        }[]
      }
    }
    Enums: {
      movement_type: "entrada" | "saida" | "ajuste" | "desperdicio"
      payment_method:
        | "dinheiro"
        | "cartao_debito"
        | "cartao_credito"
        | "pix"
        | "outro"
      user_role: "admin" | "employee"
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
      movement_type: ["entrada", "saida", "ajuste", "desperdicio"],
      payment_method: [
        "dinheiro",
        "cartao_debito",
        "cartao_credito",
        "pix",
        "outro",
      ],
      user_role: ["admin", "employee"],
    },
  },
} as const
