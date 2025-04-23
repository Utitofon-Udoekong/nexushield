"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/app/utils/supabase/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"

interface VPNConnection {
  id: string
  status: 'connected' | 'disconnected' | 'connecting' | 'error'
  user_id: string
  country_code: string
  start_time: string
  end_time: string | null
  uptime: number
  expires_at: number
}

interface PerformanceMetrics {
  id: string
  connection_id: string
  timestamp: string
  download_speed: number
  upload_speed: number
  latency: number
  packet_loss: number
  loaded_latency: {
    download: number
    upload: number
  }
  aim_scores: {
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

interface VPNContextType {
  isConnected: boolean
  currentConnection: VPNConnection | null
  metrics: PerformanceMetrics | null
  schedules: any[]
  devices: any[]
  connect: (countryCode: string) => Promise<void>
  disconnect: () => Promise<void>
  refreshMetrics: () => Promise<void>
}

const VPNContext = createContext<VPNContextType | undefined>(undefined)

export function VPNProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const [isConnected, setIsConnected] = useState(false)
  const [currentConnection, setCurrentConnection] = useState<VPNConnection | null>(null)
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)

  // Fetch current connection status
  const { data: connectionData } = useQuery({
    queryKey: ['vpn-connection'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return null
      
      const { data } = await supabase
        .from('vpn_connections')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      return data as VPNConnection
    },
    refetchInterval: 5000
  })

  // Fetch metrics
  const { data: metricsData } = useQuery({
    queryKey: ['vpn-metrics'],
    queryFn: async () => {
      if (!currentConnection) return null
      
      const { data } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('connection_id', currentConnection.id)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single()
      
      return data as PerformanceMetrics
    },
    refetchInterval: 10000
  })

  // Fetch schedules
  const { data: schedulesData } = useQuery({
    queryKey: ['vpn-schedules'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return []
      
      const { data } = await supabase
        .from('connection_schedules')
        .select('*')
        .eq('user_id', session.user.id)
      
      return data || []
    }
  })

  // Fetch devices
  const { data: devicesData } = useQuery({
    queryKey: ['vpn-devices'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return []
      
      const { data } = await supabase
        .from('devices')
        .select('*')
        .eq('user_id', session.user.id)
      
      return data || []
    }
  })

  useEffect(() => {
    if (connectionData) {
      setIsConnected(connectionData.status === 'connected')
      setCurrentConnection(connectionData)
    }
  }, [connectionData])

  useEffect(() => {
    if (metricsData) {
      setMetrics(metricsData)
    }
  }, [metricsData])

  const connect = async (countryCode: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const response = await fetch('/api/vpn/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ countryCode })
    })

    if (!response.ok) throw new Error('Failed to connect')
    await queryClient.invalidateQueries({ queryKey: ['vpn-connection'] })
  }

  const disconnect = async () => {
    const response = await fetch('/api/vpn/disconnect', {
      method: 'POST'
    })

    if (!response.ok) throw new Error('Failed to disconnect')
    await queryClient.invalidateQueries({ queryKey: ['vpn-connection'] })
  }

  const refreshMetrics = async () => {
    await queryClient.invalidateQueries({ queryKey: ['vpn-metrics'] })
  }

  return (
    <VPNContext.Provider value={{
      isConnected,
      currentConnection,
      metrics,
      schedules: schedulesData || [],
      devices: devicesData || [],
      connect,
      disconnect,
      refreshMetrics
    }}>
      {children}
    </VPNContext.Provider>
  )
}

export function useVPN() {
  const context = useContext(VPNContext)
  if (context === undefined) {
    throw new Error('useVPN must be used within a VPNProvider')
  }
  return context
} 