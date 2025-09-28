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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      abj_recordings: {
        Row: {
          audio_url: string | null
          created_at: string
          date: string
          id: string
          status: Database["public"]["Enums"]["abj_recording_status"]
          summary: string | null
          title: string
          transcript: string | null
          type: Database["public"]["Enums"]["abj_recording_type"]
          updated_at: string
          video_url: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          date: string
          id?: string
          status?: Database["public"]["Enums"]["abj_recording_status"]
          summary?: string | null
          title: string
          transcript?: string | null
          type: Database["public"]["Enums"]["abj_recording_type"]
          updated_at?: string
          video_url: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          date?: string
          id?: string
          status?: Database["public"]["Enums"]["abj_recording_status"]
          summary?: string | null
          title?: string
          transcript?: string | null
          type?: Database["public"]["Enums"]["abj_recording_type"]
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      accounts: {
        Row: {
          auth_provider: string | null
          auth_provider_id: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          email_notifications: boolean | null
          id: string
          language: string | null
          last_active_at: string | null
          last_streak_date: string | null
          last_subscription_update: string | null
          name: string
          onboarding_completed: boolean | null
          phone: string | null
          preferred_platform: string | null
          profile_completed: boolean | null
          role_id: string | null
          sms_notifications: boolean | null
          streak_days: number | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          subscription_tier: string | null
          timezone: string | null
          total_sessions: number | null
          updated_at: string | null
          whatsapp_notifications: boolean | null
        }
        Insert: {
          auth_provider?: string | null
          auth_provider_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          last_active_at?: string | null
          last_streak_date?: string | null
          last_subscription_update?: string | null
          name: string
          onboarding_completed?: boolean | null
          phone?: string | null
          preferred_platform?: string | null
          profile_completed?: boolean | null
          role_id?: string | null
          sms_notifications?: boolean | null
          streak_days?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          timezone?: string | null
          total_sessions?: number | null
          updated_at?: string | null
          whatsapp_notifications?: boolean | null
        }
        Update: {
          auth_provider?: string | null
          auth_provider_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          last_active_at?: string | null
          last_streak_date?: string | null
          last_subscription_update?: string | null
          name?: string
          onboarding_completed?: boolean | null
          phone?: string | null
          preferred_platform?: string | null
          profile_completed?: boolean | null
          role_id?: string | null
          sms_notifications?: boolean | null
          streak_days?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          timezone?: string | null
          total_sessions?: number | null
          updated_at?: string | null
          whatsapp_notifications?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
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
      oracle_conversations: {
        Row: {
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oracle_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      oracle_messages: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          sender_id: string | null
          sender_type: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          sender_id?: string | null
          sender_type: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          sender_id?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "oracle_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "oracle_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oracle_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_history: {
        Row: {
          account_id: string | null
          amount_paid: number | null
          change_reason: string | null
          created_at: string | null
          currency: string | null
          end_date: string | null
          id: string
          notes: string | null
          payment_method: string | null
          start_date: string
          status: string
          tier: string
        }
        Insert: {
          account_id?: string | null
          amount_paid?: number | null
          change_reason?: string | null
          created_at?: string | null
          currency?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          start_date: string
          status: string
          tier: string
        }
        Update: {
          account_id?: string | null
          amount_paid?: number | null
          change_reason?: string | null
          created_at?: string | null
          currency?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          start_date?: string
          status?: string
          tier?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_history_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_email_campaign: {
        Row: {
          brevo_campaign_id: string | null
          brevo_list_id: string | null
          campaign_name: string
          created_at: string
          email: string
          email_send_count: number
          first_name: string | null
          id: string
          kajabi_id: string | null
          last_email_sent_at: string | null
          last_name: string | null
          member_kajabi_id: string | null
          meta: Json | null
          sent_at: string | null
          status: string
          trial_started_at: string | null
          updated_at: string
          upgraded_at: string | null
        }
        Insert: {
          brevo_campaign_id?: string | null
          brevo_list_id?: string | null
          campaign_name: string
          created_at?: string
          email: string
          email_send_count?: number
          first_name?: string | null
          id?: string
          kajabi_id?: string | null
          last_email_sent_at?: string | null
          last_name?: string | null
          member_kajabi_id?: string | null
          meta?: Json | null
          sent_at?: string | null
          status?: string
          trial_started_at?: string | null
          updated_at?: string
          upgraded_at?: string | null
        }
        Update: {
          brevo_campaign_id?: string | null
          brevo_list_id?: string | null
          campaign_name?: string
          created_at?: string
          email?: string
          email_send_count?: number
          first_name?: string | null
          id?: string
          kajabi_id?: string | null
          last_email_sent_at?: string | null
          last_name?: string | null
          member_kajabi_id?: string | null
          meta?: Json | null
          sent_at?: string | null
          status?: string
          trial_started_at?: string | null
          updated_at?: string
          upgraded_at?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          account_id: string | null
          analytics_consent: boolean | null
          created_at: string | null
          data_sharing_consent: boolean | null
          difficulty_level: string | null
          email_frequency: string | null
          id: string
          preferred_content_types: string[] | null
          reminder_times: string[] | null
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          analytics_consent?: boolean | null
          created_at?: string | null
          data_sharing_consent?: boolean | null
          difficulty_level?: string | null
          email_frequency?: string | null
          id?: string
          preferred_content_types?: string[] | null
          reminder_times?: string[] | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          analytics_consent?: boolean | null
          created_at?: string | null
          data_sharing_consent?: boolean | null
          difficulty_level?: string | null
          email_frequency?: string | null
          id?: string
          preferred_content_types?: string[] | null
          reminder_times?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          account_id: string | null
          astrology_interest: boolean | null
          birth_date: string | null
          breathwork_experience: string | null
          challenges_facing: string[] | null
          comfort_level_with_ai: string | null
          communication_style: string | null
          created_at: string | null
          gender: string | null
          id: string
          location: string | null
          meditation_experience: string | null
          preferred_session_length: number | null
          preferred_time_of_day: string | null
          primary_goals: string[] | null
          session_frequency: string | null
          spiritual_practice: string | null
          updated_at: string | null
          wellness_focus_areas: string[] | null
        }
        Insert: {
          account_id?: string | null
          astrology_interest?: boolean | null
          birth_date?: string | null
          breathwork_experience?: string | null
          challenges_facing?: string[] | null
          comfort_level_with_ai?: string | null
          communication_style?: string | null
          created_at?: string | null
          gender?: string | null
          id?: string
          location?: string | null
          meditation_experience?: string | null
          preferred_session_length?: number | null
          preferred_time_of_day?: string | null
          primary_goals?: string[] | null
          session_frequency?: string | null
          spiritual_practice?: string | null
          updated_at?: string | null
          wellness_focus_areas?: string[] | null
        }
        Update: {
          account_id?: string | null
          astrology_interest?: boolean | null
          birth_date?: string | null
          breathwork_experience?: string | null
          challenges_facing?: string[] | null
          comfort_level_with_ai?: string | null
          communication_style?: string | null
          created_at?: string | null
          gender?: string | null
          id?: string
          location?: string | null
          meditation_experience?: string | null
          preferred_session_length?: number | null
          preferred_time_of_day?: string | null
          primary_goals?: string[] | null
          session_frequency?: string | null
          spiritual_practice?: string | null
          updated_at?: string | null
          wellness_focus_areas?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          permissions: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          permissions?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          permissions?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      zoom_attendance: {
        Row: {
          created_at: string
          duration_minutes: number | null
          email: string | null
          id: string
          join_time: string | null
          leave_time: string | null
          participant_uuid: string | null
          reason: string | null
          user_name: string | null
          zoom_meeting_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          email?: string | null
          id?: string
          join_time?: string | null
          leave_time?: string | null
          participant_uuid?: string | null
          reason?: string | null
          user_name?: string | null
          zoom_meeting_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          email?: string | null
          id?: string
          join_time?: string | null
          leave_time?: string | null
          participant_uuid?: string | null
          reason?: string | null
          user_name?: string | null
          zoom_meeting_id?: string
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
      create_user_account: {
        Args: {
          p_auth_provider?: string
          p_auth_provider_id?: string
          p_email: string
          p_name: string
          p_phone?: string
          p_preferred_platform?: string
          p_subscription_status?: string
          p_subscription_tier?: string
        }
        Returns: string
      }
      get_or_create_oracle_conversation: {
        Args: { p_user_id: string }
        Returns: string
      }
      get_subscription_data_for_refresh: {
        Args: { p_account_id: string }
        Returns: {
          last_subscription_update: string
          stripe_customer_id: string
          stripe_subscription_id: string
          subscription_status: string
          subscription_tier: string
        }[]
      }
      get_user_subscription_data: {
        Args: { p_email: string }
        Returns: {
          role_name: string
          subscription_status: string
          subscription_tier: string
        }[]
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
      is_valid_subscription: {
        Args: { p_email: string }
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
        Returns: string
      }
      match_documents: {
        Args:
          | { filter: Json; match_count: number; query_embedding: string }
          | { filter?: Json; query_embedding: string }
        Returns: {
          content: string
          id: string
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
      update_subscription_data: {
        Args: {
          p_account_id: string
          p_stripe_customer_id?: string
          p_stripe_subscription_id?: string
          p_subscription_end_date?: string
          p_subscription_start_date?: string
          p_subscription_status: string
          p_subscription_tier: string
        }
        Returns: boolean
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
      abj_recording_status: "published" | "draft" | "processing" | "failed"
      abj_recording_type: "Full Moons" | "New Moons"
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
      abj_recording_status: ["published", "draft", "processing", "failed"],
      abj_recording_type: ["Full Moons", "New Moons"],
    },
  },
} as const
