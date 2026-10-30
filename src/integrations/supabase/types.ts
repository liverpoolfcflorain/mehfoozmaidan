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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          athlete_id: string
          created_at: string
          id: string
          message: string | null
          notes: string | null
          opportunity_id: string
          stage: string
          updated_at: string
        }
        Insert: {
          athlete_id: string
          created_at?: string
          id?: string
          message?: string | null
          notes?: string | null
          opportunity_id: string
          stage?: string
          updated_at?: string
        }
        Update: {
          athlete_id?: string
          created_at?: string
          id?: string
          message?: string | null
          notes?: string | null
          opportunity_id?: string
          stage?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_profiles: {
        Row: {
          achievements: string | null
          bio: string | null
          discipline: string | null
          goals: string | null
          guardian_consent_at: string | null
          guardian_email: string | null
          guardian_name: string | null
          is_minor: boolean
          level: string | null
          qualifications: string | null
          sport: string
          statistics: string | null
          status: Database["public"]["Enums"]["profile_status"]
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          achievements?: string | null
          bio?: string | null
          discipline?: string | null
          goals?: string | null
          guardian_consent_at?: string | null
          guardian_email?: string | null
          guardian_name?: string | null
          is_minor?: boolean
          level?: string | null
          qualifications?: string | null
          sport?: string
          statistics?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          achievements?: string | null
          bio?: string | null
          discipline?: string | null
          goals?: string | null
          guardian_consent_at?: string | null
          guardian_email?: string | null
          guardian_name?: string | null
          is_minor?: boolean
          level?: string | null
          qualifications?: string | null
          sport?: string
          statistics?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
          user_id?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json | null
          id: string
          target_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
        }
        Relationships: []
      }
      connections: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_addressee_id_fkey"
            columns: ["addressee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_comments: {
        Row: {
          author_id: string
          body: string
          contract_id: string
          created_at: string
          id: string
        }
        Insert: {
          author_id: string
          body: string
          contract_id: string
          created_at?: string
          id?: string
        }
        Update: {
          author_id?: string
          body?: string
          contract_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_comments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_versions: {
        Row: {
          ai_generated: boolean
          body: string
          contract_id: string
          created_at: string
          created_by: string
          id: string
          note: string | null
          version: number
        }
        Insert: {
          ai_generated?: boolean
          body: string
          contract_id: string
          created_at?: string
          created_by: string
          id?: string
          note?: string | null
          version: number
        }
        Update: {
          ai_generated?: boolean
          body?: string
          contract_id?: string
          created_at?: string
          created_by?: string
          id?: string
          note?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "contract_versions_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          agreement_type: string
          answers: Json
          concerns: string | null
          created_at: string
          guardian_consent_confirmed: boolean
          id: string
          involves_minor: boolean
          lawyer_id: string | null
          owner_id: string
          parties: Json
          reminder_date: string | null
          reminder_note: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          agreement_type: string
          answers?: Json
          concerns?: string | null
          created_at?: string
          guardian_consent_confirmed?: boolean
          id?: string
          involves_minor?: boolean
          lawyer_id?: string | null
          owner_id: string
          parties?: Json
          reminder_date?: string | null
          reminder_note?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          agreement_type?: string
          answers?: Json
          concerns?: string | null
          created_at?: string
          guardian_consent_confirmed?: boolean
          id?: string
          involves_minor?: boolean
          lawyer_id?: string | null
          owner_id?: string
          parties?: Json
          reminder_date?: string | null
          reminder_note?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_lawyer_id_fkey"
            columns: ["lawyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          accepted: boolean
          conversation_id: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          accepted?: boolean
          conversation_id: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          accepted?: boolean
          conversation_id?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          kind: string
          last_message_at: string
          legal_request_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          last_message_at?: string
          legal_request_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          last_message_at?: string
          legal_request_id?: string | null
        }
        Relationships: []
      }
      lawyer_profiles: {
        Row: {
          available: boolean
          bar_enrollment: string | null
          bio: string | null
          experience_years: number | null
          expertise: string | null
          jurisdiction: string | null
          languages: string | null
          status: Database["public"]["Enums"]["profile_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          available?: boolean
          bar_enrollment?: string | null
          bio?: string | null
          experience_years?: number | null
          expertise?: string | null
          jurisdiction?: string | null
          languages?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          available?: boolean
          bar_enrollment?: string | null
          bio?: string | null
          experience_years?: number | null
          expertise?: string | null
          jurisdiction?: string | null
          languages?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lawyer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_request_declines: {
        Row: {
          lawyer_id: string
          request_id: string
        }
        Insert: {
          lawyer_id: string
          request_id: string
        }
        Update: {
          lawyer_id?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "legal_request_declines_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "legal_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_requests: {
        Row: {
          category: string
          created_at: string
          deadline: string | null
          description: string
          id: string
          jurisdiction: string
          language: string | null
          lawyer_id: string | null
          requester_id: string
          status: string
          summary: string
        }
        Insert: {
          category: string
          created_at?: string
          deadline?: string | null
          description: string
          id?: string
          jurisdiction?: string
          language?: string | null
          lawyer_id?: string | null
          requester_id: string
          status?: string
          summary: string
        }
        Update: {
          category?: string
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          jurisdiction?: string
          language?: string | null
          lawyer_id?: string | null
          requester_id?: string
          status?: string
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "legal_requests_lawyer_id_fkey"
            columns: ["lawyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "legal_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_items: {
        Row: {
          caption: string | null
          id: string
          kind: string
          poster_url: string | null
          published: boolean
          slot: string
          title: string | null
          transcript: string | null
          updated_at: string
          url: string
        }
        Insert: {
          caption?: string | null
          id?: string
          kind?: string
          poster_url?: string | null
          published?: boolean
          slot: string
          title?: string | null
          transcript?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          caption?: string | null
          id?: string
          kind?: string
          poster_url?: string | null
          published?: boolean
          slot?: string
          title?: string | null
          transcript?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          created_at: string
          deadline: string | null
          description: string
          id: string
          opp_type: string
          owner_id: string
          region: string | null
          sport: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          opp_type?: string
          owner_id: string
          region?: string | null
          sport?: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          opp_type?: string
          owner_id?: string
          region?: string | null
          sport?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          contact_open: boolean
          created_at: string
          full_name: string
          id: string
          primary_role: Database["public"]["Enums"]["app_role"]
          region: string | null
          updated_at: string
        }
        Insert: {
          contact_open?: boolean
          created_at?: string
          full_name?: string
          id: string
          primary_role: Database["public"]["Enums"]["app_role"]
          region?: string | null
          updated_at?: string
        }
        Update: {
          contact_open?: boolean
          created_at?: string
          full_name?: string
          id?: string
          primary_role?: Database["public"]["Enums"]["app_role"]
          region?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          category: string
          created_at: string
          id: string
          reason: string
          reporter_id: string
          status: string
          target_user_id: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          reason: string
          reporter_id: string
          status?: string
          target_user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          reason?: string
          reporter_id?: string
          status?: string
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_profiles: {
        Row: {
          created_at: string
          saved_user_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          saved_user_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          saved_user_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_profiles_saved_user_id_fkey"
            columns: ["saved_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          body: string
          created_at: string
          id: string
          jurisdiction: string | null
          references_text: string | null
          reviewed_on: string | null
          section: string
          slug: string
          status: string
          summary: string | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          jurisdiction?: string | null
          references_text?: string | null
          reviewed_on?: string | null
          section: string
          slug: string
          status?: string
          summary?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          jurisdiction?: string | null
          references_text?: string | null
          reviewed_on?: string | null
          section?: string
          slug?: string
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      sports_profiles: {
        Row: {
          bio: string | null
          kind: string
          org_name: string | null
          qualifications: string | null
          sports: string | null
          status: Database["public"]["Enums"]["profile_status"]
          subtype: string
          title: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          kind?: string
          org_name?: string | null
          qualifications?: string | null
          sports?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          subtype?: string
          title?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          kind?: string
          org_name?: string | null
          qualifications?: string | null
          sports?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          subtype?: string
          title?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sports_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions: {
        Row: {
          admin_notes: string | null
          body: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          body: string
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          body?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verification_decisions: {
        Row: {
          created_at: string
          decision: Database["public"]["Enums"]["profile_status"]
          id: string
          profile_type: Database["public"]["Enums"]["app_role"]
          reason: string | null
          reviewer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          decision: Database["public"]["Enums"]["profile_status"]
          id?: string
          profile_type: Database["public"]["Enums"]["app_role"]
          reason?: string | null
          reviewer_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          decision?: Database["public"]["Enums"]["profile_status"]
          id?: string
          profile_type?: Database["public"]["Enums"]["app_role"]
          reason?: string | null
          reviewer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_decisions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_legal_request: { Args: { _id: string }; Returns: string }
      admin_decide: {
        Args: {
          _decision: Database["public"]["Enums"]["profile_status"]
          _reason: string
          _user: string
        }
        Returns: undefined
      }
      admin_record_guardian_consent: {
        Args: { _user: string }
        Returns: undefined
      }
      admin_stats: { Args: never; Returns: Json }
      can_access_contract: {
        Args: { _c: string; _uid: string }
        Returns: boolean
      }
      can_view_profile: {
        Args: { _target: string; _uid: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _uid: string }; Returns: boolean }
      is_approved_lawyer: { Args: { _uid: string }; Returns: boolean }
      is_approved_sports: { Args: { _uid: string }; Returns: boolean }
      is_participant: {
        Args: { _conv: string; _uid: string }
        Returns: boolean
      }
      notify: {
        Args: {
          _body: string
          _link: string
          _title: string
          _type: string
          _user: string
        }
        Returns: undefined
      }
      owns_opportunity: {
        Args: { _opp: string; _uid: string }
        Returns: boolean
      }
      start_conversation: { Args: { _other: string }; Returns: string }
    }
    Enums: {
      app_role: "athlete" | "sports" | "lawyer" | "admin"
      profile_status:
        | "draft"
        | "submitted"
        | "info_requested"
        | "approved"
        | "rejected"
        | "suspended"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["athlete", "sports", "lawyer", "admin"],
      profile_status: [
        "draft",
        "submitted",
        "info_requested",
        "approved",
        "rejected",
        "suspended",
      ],
    },
  },
} as const
