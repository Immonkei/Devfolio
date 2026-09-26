export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type PostStatus = "DRAFT" | "PUBLISHED";
export type MessageStatus = "NEW" | "READ" | "ARCHIVED";
export type TechCategory = "LANGUAGE" | "FRAMEWORK" | "DATABASE" | "DEVOPS" | "TOOL" | "OTHER";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          headline: string;
          bio: string;
          location: string;
          avatar_url: string | null;
          resume_url: string | null;
          github_url: string | null;
          linkedin_url: string | null;
          twitter_url: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          headline: string;
          bio: string;
          location: string;
          avatar_url?: string | null;
          resume_url?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          twitter_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          headline?: string;
          bio?: string;
          location?: string;
          avatar_url?: string | null;
          resume_url?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          twitter_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string;
          description: string;
          problem: string;
          solution: string;
          architecture: string;
          implementation: string;
          challenges: string;
          tradeoffs: string;
          results: string;
          cover_image_url: string | null;
          github_url: string | null;
          live_url: string | null;
          featured: boolean;
          status: ProjectStatus;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          short_description: string;
          description: string;
          problem?: string;
          solution?: string;
          architecture?: string;
          implementation?: string;
          challenges?: string;
          tradeoffs?: string;
          results?: string;
          cover_image_url?: string | null;
          github_url?: string | null;
          live_url?: string | null;
          featured?: boolean;
          status?: ProjectStatus;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          short_description?: string;
          description?: string;
          problem?: string;
          solution?: string;
          architecture?: string;
          implementation?: string;
          challenges?: string;
          tradeoffs?: string;
          results?: string;
          cover_image_url?: string | null;
          github_url?: string | null;
          live_url?: string | null;
          featured?: boolean;
          status?: ProjectStatus;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      technologies: {
        Row: {
          id: string;
          name: string;
          category: TechCategory;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category?: TechCategory;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: TechCategory;
          icon?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      project_technologies: {
        Row: {
          project_id: string;
          technology_id: string;
        };
        Insert: {
          project_id: string;
          technology_id: string;
        };
        Update: {
          project_id?: string;
          technology_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_technologies_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_technologies_technology_id_fkey";
            columns: ["technology_id"];
            isOneToOne: false;
            referencedRelation: "technologies";
            referencedColumns: ["id"];
          }
        ];
      };
      experiences: {
        Row: {
          id: string;
          company: string;
          role: string;
          description: string;
          responsibilities: string[];
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company: string;
          role: string;
          description: string;
          responsibilities?: string[];
          start_date: string;
          end_date?: string | null;
          is_current?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company?: string;
          role?: string;
          description?: string;
          responsibilities?: string[];
          start_date?: string;
          end_date?: string | null;
          is_current?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      education: {
        Row: {
          id: string;
          institution: string;
          degree: string;
          description: string | null;
          start_date: string;
          end_date: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          institution: string;
          degree: string;
          description?: string | null;
          start_date: string;
          end_date?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          institution?: string;
          degree?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image_url: string | null;
          status: PostStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image_url?: string | null;
          status?: PostStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          cover_image_url?: string | null;
          status?: PostStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      post_categories: {
        Row: {
          post_id: string;
          category_id: string;
        };
        Insert: {
          post_id: string;
          category_id: string;
        };
        Update: {
          post_id?: string;
          category_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_categories_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status: MessageStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status?: MessageStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          status?: MessageStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      media: {
        Row: {
          id: string;
          file_name: string;
          storage_path: string;
          file_type: string;
          file_size: number;
          bucket: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          file_name: string;
          storage_path: string;
          file_type: string;
          file_size: number;
          bucket?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          file_name?: string;
          storage_path?: string;
          file_type?: string;
          file_size?: number;
          bucket?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      page_views: {
        Row: {
          id: string;
          page: string;
          visitor_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          page: string;
          visitor_hash?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          page?: string;
          visitor_hash?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          event_type: string;
          page: string | null;
          resource_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type: string;
          page?: string | null;
          resource_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_type?: string;
          page?: string | null;
          resource_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      project_status: ProjectStatus;
      post_status: PostStatus;
      message_status: MessageStatus;
      tech_category: TechCategory;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
