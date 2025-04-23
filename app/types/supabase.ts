export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      devices: {
        Row: {
          id: string
          user_id: string
          name: string
          device_type: string
          last_seen: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          device_type: string
          last_seen?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          device_type?: string
          last_seen?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vpn_connections: {
        Row: {
          id: string
          user_id: string
          device_id: string | null
          country_code: string
          config: string
          status: string
          start_time: string
          end_time: string | null
          data_used: number
          latency: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_id?: string | null
          country_code: string
          config: string
          status: string
          start_time: string
          end_time?: string | null
          data_used?: number
          latency?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          device_id?: string | null
          country_code?: string
          config?: string
          status?: string
          start_time?: string
          end_time?: string | null
          data_used?: number
          latency?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      connection_schedules: {
        Row: {
          id: string
          user_id: string
          device_id: string | null
          country_code: string
          start_time: string
          end_time: string
          days_of_week: number[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_id?: string | null
          country_code: string
          start_time: string
          end_time: string
          days_of_week: number[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          device_id?: string | null
          country_code?: string
          start_time?: string
          end_time?: string
          days_of_week?: number[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      security_logs: {
        Row: {
          id: string
          user_id: string
          device_id: string | null
          event_type: string
          ip_address: string | null
          location: string | null
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_id?: string | null
          event_type: string
          ip_address?: string | null
          location?: string | null
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          device_id?: string | null
          event_type?: string
          ip_address?: string | null
          location?: string | null
          details?: Json | null
          created_at?: string
        }
      }
      performance_metrics: {
        Row: {
          id: string
          connection_id: string
          timestamp: string
          latency: number | null
          download_speed: number | null
          upload_speed: number | null
          packet_loss: number | null
          created_at: string
        }
        Insert: {
          id?: string
          connection_id: string
          timestamp: string
          latency?: number | null
          download_speed?: number | null
          upload_speed?: number | null
          packet_loss?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          connection_id?: string
          timestamp?: string
          latency?: number | null
          download_speed?: number | null
          upload_speed?: number | null
          packet_loss?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 