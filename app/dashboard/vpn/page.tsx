import { ConnectionManager } from "@/app/components/vpn/connection-manager"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { getVPNStatus, getConnectionMetrics } from "@/app/lib/tpn"
import { useEffect, useState } from "react"
import { formatLatency, formatSpeed } from "@/app/lib/utils"
import { ConnectionHistory } from "@/app/components/vpn/connection-history"
import { SpeedTest } from "@/app/components/vpn/speed-test"
import { Activity, Download, Globe, Shield, Wifi } from "lucide-react"

interface ConnectionStatus {
  connected: boolean
  country_code: string
  download_speed: number
  upload_speed: number
  latency: number
  data_used: number
  start_time?: string
}

interface Metrics {
  latency: number
  downloadSpeed: number
  uploadSpeed: number
  packetLoss: number
  timestamp: string
}

export default function VPNPage() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null)
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<Metrics[]>([])

  const fetchStatus = async () => {
    try {
      const statusData = await getVPNStatus()
      setStatus(statusData)
    } catch (error) {
      console.error("Error fetching VPN status:", error)
    }
  }

  const fetchMetrics = async () => {
    try {
      const metricsData = await getConnectionMetrics()
      if (metricsData) {
        const metricsWithTimestamp = {
          ...metricsData,
          timestamp: new Date().toISOString()
        }
        setMetrics(metricsWithTimestamp)
        setHistory(prev => [...prev, metricsWithTimestamp].slice(-30)) // Keep last 30 data points
      }
    } catch (error) {
      console.error("Error fetching metrics:", error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchStatus(), fetchMetrics()])
      setLoading(false)
    }

    loadData()
    const interval = setInterval(loadData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const getConnectionQuality = () => {
    if (!metrics) return "Unknown"
    if (metrics.packetLoss > 5) return "Poor"
    if (metrics.latency > 200) return "Fair"
    if (metrics.downloadSpeed < 10) return "Good"
    return "Excellent"
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "Excellent":
        return "text-green-500"
      case "Good":
        return "text-blue-500"
      case "Fair":
        return "text-yellow-500"
      case "Poor":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">VPN Connection</h1>
        <ConnectionManager onStatusChange={fetchStatus} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
              ) : status?.connected ? (
                <span className="text-green-500">Connected</span>
              ) : (
                <span className="text-red-500">Disconnected</span>
              )}
            </div>
            {status?.country_code && (
              <p className="text-xs text-muted-foreground">
                Location: {status.country_code}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Download Speed</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
              ) : (
                formatSpeed(metrics?.downloadSpeed || 0)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
              ) : (
                formatLatency(metrics?.latency || 0)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection Quality</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
              ) : (
                <span className={getQualityColor(getConnectionQuality())}>
                  {getConnectionQuality()}
                </span>
              )}
            </div>
            {metrics && (
              <p className="text-xs text-muted-foreground">
                Packet Loss: {metrics.packetLoss.toFixed(1)}%
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ConnectionHistory data={history} type="speed" />
        <ConnectionHistory data={history} type="latency" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ConnectionHistory data={history} type="packetLoss" />
        <SpeedTest />
      </div>
    </div>
  )
} 