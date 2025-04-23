import { Session, SupabaseClient } from "@supabase/supabase-js";
// Database Types
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
          expires_at: string | null
          uptime: string | null
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
          expires_at?: string | null
          uptime?: string | null
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
          expires_at?: string | null
          uptime?: string | null
          created_at?: string
          updated_at?: string
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
          loaded_latency: Json | null
          aim_scores: Json | null
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
          loaded_latency?: Json | null
          aim_scores?: Json | null
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
          loaded_latency?: Json | null
          aim_scores?: Json | null
          created_at?: string
        }
      }
      speed_tests: {
        Row: {
          id: string
          user_id: string
          connection_id: string | null
          timestamp: string
          download_speed: number
          upload_speed: number
          latency: number
          packet_loss: number
          loaded_latency: Json
          aim_scores: Json
          server_location: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          connection_id?: string | null
          timestamp: string
          download_speed: number
          upload_speed: number
          latency: number
          packet_loss: number
          loaded_latency: Json
          aim_scores: Json
          server_location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          connection_id?: string | null
          timestamp?: string
          download_speed?: number
          upload_speed?: number
          latency?: number
          packet_loss?: number
          loaded_latency?: Json
          aim_scores?: Json
          server_location?: string | null
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          auto_connect: boolean
          kill_switch: boolean
          split_tunneling: boolean
          two_factor_auth: boolean
          email_notifications: boolean
          default_country_code: string | null
          theme: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          auto_connect?: boolean
          kill_switch?: boolean
          split_tunneling?: boolean
          two_factor_auth?: boolean
          email_notifications?: boolean
          default_country_code?: string | null
          theme?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          auto_connect?: boolean
          kill_switch?: boolean
          split_tunneling?: boolean
          two_factor_auth?: boolean
          email_notifications?: boolean
          default_country_code?: string | null
          theme?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Component Types
export interface VPNConfig {
  countryCode: string
  config: string
}

export interface VPNConnection {
  id: string
  userId: string
  deviceId: string | null
  countryCode: string
  config: string
  status: string
  startTime: string
  endTime: string | null
  dataUsed: number
  latency: number | null
  expiresAt: string | null
  uptime: string | null
}

export interface VPNMetrics {
  latency: number
  downloadSpeed: number
  uploadSpeed: number
  packetLoss: number
  loadedLatency?: {
    download: number
    upload: number
  }
  aimScores?: {
    streaming: {
      points: number
      classification: string
    }
    gaming: {
      points: number
      classification: string
    }
    realTime: {
      points: number
      classification: string
    }
  }
}

export interface VPNSchedule {
  id: string
  userId: string
  deviceId: string | null
  countryCode: string
  startTime: string
  endTime: string
  daysOfWeek: number[]
  isActive: boolean
}

export interface SpeedTestResults {
  downloadSpeed: number
  uploadSpeed: number
  latency: number
  packetLoss: number
  loadedLatency: {
    download: number
    upload: number
  }
  aimScores: {
    streaming: {
      points: number
      classification: string
    }
    gaming: {
      points: number
      classification: string
    }
    realTime: {
      points: number
      classification: string
    }
  }
}

export interface MetricsData {
  historical: Array<{
    timestamp: string
    value: number
  }>
}

export interface ConnectionStatus {
  status: 'connected' | 'disconnected' | 'connecting' | 'error'
  countryCode?: string
  startTime?: string
}

export interface Metrics {
  current: VPNMetrics
  historical: MetricsData
}

export interface ScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schedule?: VPNSchedule
}

export interface DashboardLayoutProps {
  children: React.ReactNode
}

export interface MetricsChartProps {
  data: MetricsData
  type: 'speed' | 'latency' | 'packet-loss'
}

// Auth Types
export interface AuthContextType {
  supabase: SupabaseClient<Database>
  user: Database['public']['Tables']['profiles']['Row'] | null
  loading: boolean
  session: Session | null
  signOut: () => Promise<void>
}

// Toast Types
export type Toast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: 'default' | 'destructive'
  duration?: number
}
