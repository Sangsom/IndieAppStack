export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string;
          email: string;
          role: Database["public"]["Enums"]["admin_role"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          role?: Database["public"]["Enums"]["admin_role"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          role?: Database["public"]["Enums"]["admin_role"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      affiliate_links: {
        Row: {
          affiliate_program_id: string | null;
          created_at: string;
          default_rel: string;
          destination_url: string;
          disclosure_required: boolean;
          id: string;
          notes: string | null;
          slug: string;
          status: Database["public"]["Enums"]["affiliate_link_status"];
          tool_id: string | null;
          updated_at: string;
        };
        Insert: {
          affiliate_program_id?: string | null;
          created_at?: string;
          default_rel?: string;
          destination_url: string;
          disclosure_required?: boolean;
          id?: string;
          notes?: string | null;
          slug: string;
          status?: Database["public"]["Enums"]["affiliate_link_status"];
          tool_id?: string | null;
          updated_at?: string;
        };
        Update: {
          affiliate_program_id?: string | null;
          created_at?: string;
          default_rel?: string;
          destination_url?: string;
          disclosure_required?: boolean;
          id?: string;
          notes?: string | null;
          slug?: string;
          status?: Database["public"]["Enums"]["affiliate_link_status"];
          tool_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "affiliate_links_affiliate_program_id_fkey";
            columns: ["affiliate_program_id"];
            isOneToOne: false;
            referencedRelation: "affiliate_programs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "affiliate_links_tool_id_fkey";
            columns: ["tool_id"];
            isOneToOne: false;
            referencedRelation: "tools";
            referencedColumns: ["id"];
          },
        ];
      };
      affiliate_programs: {
        Row: {
          allowed_promotion_notes: string | null;
          application_url: string | null;
          commission_notes: string | null;
          contact_email: string | null;
          cookie_notes: string | null;
          created_at: string;
          dashboard_url: string | null;
          id: string;
          internal_notes: string | null;
          name: string;
          network: string;
          status: Database["public"]["Enums"]["affiliate_program_status"];
          updated_at: string;
        };
        Insert: {
          allowed_promotion_notes?: string | null;
          application_url?: string | null;
          commission_notes?: string | null;
          contact_email?: string | null;
          cookie_notes?: string | null;
          created_at?: string;
          dashboard_url?: string | null;
          id?: string;
          internal_notes?: string | null;
          name: string;
          network?: string;
          status?: Database["public"]["Enums"]["affiliate_program_status"];
          updated_at?: string;
        };
        Update: {
          allowed_promotion_notes?: string | null;
          application_url?: string | null;
          commission_notes?: string | null;
          contact_email?: string | null;
          cookie_notes?: string | null;
          created_at?: string;
          dashboard_url?: string | null;
          id?: string;
          internal_notes?: string | null;
          name?: string;
          network?: string;
          status?: Database["public"]["Enums"]["affiliate_program_status"];
          updated_at?: string;
        };
        Relationships: [];
      };
      article_tools: {
        Row: {
          article_id: string;
          created_at: string;
          relationship: string;
          sort_order: number;
          tool_id: string;
        };
        Insert: {
          article_id: string;
          created_at?: string;
          relationship?: string;
          sort_order?: number;
          tool_id: string;
        };
        Update: {
          article_id?: string;
          created_at?: string;
          relationship?: string;
          sort_order?: number;
          tool_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "article_tools_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "article_tools_tool_id_fkey";
            columns: ["tool_id"];
            isOneToOne: false;
            referencedRelation: "tools";
            referencedColumns: ["id"];
          },
        ];
      };
      articles: {
        Row: {
          affiliate_cta_blocks: Json;
          ai_assisted: boolean;
          author: string | null;
          body_markdown: string | null;
          content_type: Database["public"]["Enums"]["article_content_type"];
          created_at: string;
          excerpt: string | null;
          human_reviewed: boolean;
          id: string;
          primary_category_id: string | null;
          published_at: string | null;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          status: Database["public"]["Enums"]["article_status"];
          subtitle: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          affiliate_cta_blocks?: Json;
          ai_assisted?: boolean;
          author?: string | null;
          body_markdown?: string | null;
          content_type?: Database["public"]["Enums"]["article_content_type"];
          created_at?: string;
          excerpt?: string | null;
          human_reviewed?: boolean;
          id?: string;
          primary_category_id?: string | null;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          status?: Database["public"]["Enums"]["article_status"];
          subtitle?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          affiliate_cta_blocks?: Json;
          ai_assisted?: boolean;
          author?: string | null;
          body_markdown?: string | null;
          content_type?: Database["public"]["Enums"]["article_content_type"];
          created_at?: string;
          excerpt?: string | null;
          human_reviewed?: boolean;
          id?: string;
          primary_category_id?: string | null;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          status?: Database["public"]["Enums"]["article_status"];
          subtitle?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "articles_primary_category_id_fkey";
            columns: ["primary_category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          parent_id: string | null;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          sort_order: number;
          status: Database["public"]["Enums"]["category_status"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          parent_id?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["category_status"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          parent_id?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["category_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      click_events: {
        Row: {
          affiliate_link_id: string | null;
          clicked_at: string;
          id: string;
          ip_hash: string | null;
          metadata: Json;
          referrer: string | null;
          source: string | null;
          tool_id: string | null;
          user_agent: string | null;
        };
        Insert: {
          affiliate_link_id?: string | null;
          clicked_at?: string;
          id?: string;
          ip_hash?: string | null;
          metadata?: Json;
          referrer?: string | null;
          source?: string | null;
          tool_id?: string | null;
          user_agent?: string | null;
        };
        Update: {
          affiliate_link_id?: string | null;
          clicked_at?: string;
          id?: string;
          ip_hash?: string | null;
          metadata?: Json;
          referrer?: string | null;
          source?: string | null;
          tool_id?: string | null;
          user_agent?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "click_events_affiliate_link_id_fkey";
            columns: ["affiliate_link_id"];
            isOneToOne: false;
            referencedRelation: "affiliate_links";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "click_events_tool_id_fkey";
            columns: ["tool_id"];
            isOneToOne: false;
            referencedRelation: "tools";
            referencedColumns: ["id"];
          },
        ];
      };
      stack_recommendations: {
        Row: {
          cost_notes: string | null;
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          published_at: string | null;
          quiz_answers: Json;
          slug: string;
          status: Database["public"]["Enums"]["stack_recommendation_status"];
          updated_at: string;
        };
        Insert: {
          cost_notes?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          published_at?: string | null;
          quiz_answers?: Json;
          slug: string;
          status?: Database["public"]["Enums"]["stack_recommendation_status"];
          updated_at?: string;
        };
        Update: {
          cost_notes?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          published_at?: string | null;
          quiz_answers?: Json;
          slug?: string;
          status?: Database["public"]["Enums"]["stack_recommendation_status"];
          updated_at?: string;
        };
        Relationships: [];
      };
      stack_tools: {
        Row: {
          alternatives: string[];
          created_at: string;
          reason: string | null;
          role: string;
          sort_order: number;
          stack_recommendation_id: string;
          tool_id: string;
        };
        Insert: {
          alternatives?: string[];
          created_at?: string;
          reason?: string | null;
          role: string;
          sort_order?: number;
          stack_recommendation_id: string;
          tool_id: string;
        };
        Update: {
          alternatives?: string[];
          created_at?: string;
          reason?: string | null;
          role?: string;
          sort_order?: number;
          stack_recommendation_id?: string;
          tool_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stack_tools_stack_recommendation_id_fkey";
            columns: ["stack_recommendation_id"];
            isOneToOne: false;
            referencedRelation: "stack_recommendations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stack_tools_tool_id_fkey";
            columns: ["tool_id"];
            isOneToOne: false;
            referencedRelation: "tools";
            referencedColumns: ["id"];
          },
        ];
      };
      subscribers: {
        Row: {
          consent_at: string | null;
          created_at: string;
          deleted_at: string | null;
          double_opt_in: boolean;
          email: string;
          id: string;
          provider: string | null;
          provider_id: string | null;
          source: string | null;
          status: Database["public"]["Enums"]["subscriber_status"];
          unsubscribed_at: string | null;
          updated_at: string;
        };
        Insert: {
          consent_at?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          double_opt_in?: boolean;
          email: string;
          id?: string;
          provider?: string | null;
          provider_id?: string | null;
          source?: string | null;
          status?: Database["public"]["Enums"]["subscriber_status"];
          unsubscribed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          consent_at?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          double_opt_in?: boolean;
          email?: string;
          id?: string;
          provider?: string | null;
          provider_id?: string | null;
          source?: string | null;
          status?: Database["public"]["Enums"]["subscriber_status"];
          unsubscribed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      tool_categories: {
        Row: {
          category_id: string;
          created_at: string;
          sort_order: number;
          tool_id: string;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          sort_order?: number;
          tool_id: string;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          sort_order?: number;
          tool_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tool_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tool_categories_tool_id_fkey";
            columns: ["tool_id"];
            isOneToOne: false;
            referencedRelation: "tools";
            referencedColumns: ["id"];
          },
        ];
      };
      tools: {
        Row: {
          alternatives: string[];
          app_stages: string[];
          best_for: string[];
          body_markdown: string | null;
          cons: string[];
          created_at: string;
          description: string | null;
          id: string;
          internal_notes: string | null;
          logo_url: string | null;
          name: string;
          noindex: boolean;
          not_good_for: string[];
          platforms: string[];
          pricing_last_checked: string | null;
          pricing_model: Database["public"]["Enums"]["pricing_model"];
          pricing_summary: string | null;
          pros: string[];
          published_at: string | null;
          slug: string;
          status: Database["public"]["Enums"]["tool_status"];
          tagline: string | null;
          updated_at: string;
          website_url: string | null;
        };
        Insert: {
          alternatives?: string[];
          app_stages?: string[];
          best_for?: string[];
          body_markdown?: string | null;
          cons?: string[];
          created_at?: string;
          description?: string | null;
          id?: string;
          internal_notes?: string | null;
          logo_url?: string | null;
          name: string;
          noindex?: boolean;
          not_good_for?: string[];
          platforms?: string[];
          pricing_last_checked?: string | null;
          pricing_model?: Database["public"]["Enums"]["pricing_model"];
          pricing_summary?: string | null;
          pros?: string[];
          published_at?: string | null;
          slug: string;
          status?: Database["public"]["Enums"]["tool_status"];
          tagline?: string | null;
          updated_at?: string;
          website_url?: string | null;
        };
        Update: {
          alternatives?: string[];
          app_stages?: string[];
          best_for?: string[];
          body_markdown?: string | null;
          cons?: string[];
          created_at?: string;
          description?: string | null;
          id?: string;
          internal_notes?: string | null;
          logo_url?: string | null;
          name?: string;
          noindex?: boolean;
          not_good_for?: string[];
          platforms?: string[];
          pricing_last_checked?: string | null;
          pricing_model?: Database["public"]["Enums"]["pricing_model"];
          pricing_summary?: string | null;
          pros?: string[];
          published_at?: string | null;
          slug?: string;
          status?: Database["public"]["Enums"]["tool_status"];
          tagline?: string | null;
          updated_at?: string;
          website_url?: string | null;
        };
        Relationships: [];
      };
      topic_queue: {
        Row: {
          created_at: string;
          feedback: string | null;
          id: string;
          notes: string | null;
          priority: number;
          related_tool_ids: string[];
          search_intent: string | null;
          slug: string;
          status: Database["public"]["Enums"]["topic_status"];
          target_category_id: string | null;
          target_keyword: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          feedback?: string | null;
          id?: string;
          notes?: string | null;
          priority?: number;
          related_tool_ids?: string[];
          search_intent?: string | null;
          slug: string;
          status?: Database["public"]["Enums"]["topic_status"];
          target_category_id?: string | null;
          target_keyword?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          feedback?: string | null;
          id?: string;
          notes?: string | null;
          priority?: number;
          related_tool_ids?: string[];
          search_intent?: string | null;
          slug?: string;
          status?: Database["public"]["Enums"]["topic_status"];
          target_category_id?: string | null;
          target_keyword?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "topic_queue_target_category_id_fkey";
            columns: ["target_category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      admin_click_analytics: {
        Args: { p_start_at: string };
        Returns: {
          click_count: number;
          group_key: string;
          group_type: string;
          label: string;
          last_clicked_at: string | null;
        }[];
      };
      has_admin_role: { Args: { target_user_id?: string }; Returns: boolean };
      healthcheck: { Args: never; Returns: number };
    };
    Enums: {
      admin_role: "admin";
      affiliate_link_status: "pending" | "active" | "inactive" | "broken";
      affiliate_program_status:
        "not_applied" | "applied" | "approved" | "rejected" | "paused";
      article_content_type:
        | "guide"
        | "comparison"
        | "tool_review"
        | "category_page"
        | "stack_finder"
        | "news";
      article_status:
        "idea" | "draft" | "review" | "published" | "archived" | "rejected";
      category_status: "draft" | "published" | "archived";
      pricing_model:
        | "free"
        | "freemium"
        | "paid"
        | "usage_based"
        | "open_source"
        | "custom"
        | "unknown";
      stack_recommendation_status: "draft" | "published" | "archived";
      subscriber_status: "pending" | "active" | "unsubscribed";
      tool_status: "draft" | "published" | "archived";
      topic_status:
        "idea" | "briefed" | "drafted" | "reviewing" | "published" | "rejected";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      admin_role: ["admin"],
      affiliate_link_status: ["pending", "active", "inactive", "broken"],
      affiliate_program_status: [
        "not_applied",
        "applied",
        "approved",
        "rejected",
        "paused",
      ],
      article_content_type: [
        "guide",
        "comparison",
        "tool_review",
        "category_page",
        "stack_finder",
        "news",
      ],
      article_status: [
        "idea",
        "draft",
        "review",
        "published",
        "archived",
        "rejected",
      ],
      category_status: ["draft", "published", "archived"],
      pricing_model: [
        "free",
        "freemium",
        "paid",
        "usage_based",
        "open_source",
        "custom",
        "unknown",
      ],
      stack_recommendation_status: ["draft", "published", "archived"],
      subscriber_status: ["pending", "active", "unsubscribed"],
      tool_status: ["draft", "published", "archived"],
      topic_status: [
        "idea",
        "briefed",
        "drafted",
        "reviewing",
        "published",
        "rejected",
      ],
    },
  },
} as const;
