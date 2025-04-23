"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { formatBytes, formatDuration, formatLatency } from "@/app/lib/utils"
import { Icon } from "@iconify/react"
import { useVPN } from "@/app/components/providers/vpn-provider"

export function VPNStats() {
  const { currentConnection, metrics } = useVPN()

  if (!currentConnection || !metrics) return null

  const timeLeft = Math.max(0, currentConnection.expires_at - Date.now())
  const timeLeftMinutes = Math.floor(timeLeft / 60000)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:activity" className="size-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Latency</p>
            </div>
            <p className="text-2xl font-bold">{formatLatency(metrics.latency)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:clock" className="size-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
            <p className="text-2xl font-bold">{formatDuration(currentConnection.uptime)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:download" className="size-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Download Speed</p>
            </div>
            <p className="text-2xl font-bold">{formatBytes(metrics.download_speed)}/s</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:upload" className="size-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Upload Speed</p>
            </div>
            <p className="text-2xl font-bold">{formatBytes(metrics.upload_speed)}/s</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {metrics.packet_loss > 0 ? (
                <Icon icon="lucide:wifi-off" className="size-4 text-muted-foreground" />
              ) : (
                <Icon icon="lucide:wifi" className="size-4 text-muted-foreground" />
              )}
              <p className="text-sm text-muted-foreground">Packet Loss</p>
            </div>
            <p className="text-2xl font-bold">{metrics.packet_loss.toFixed(2)}%</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:clock" className="size-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Time Remaining</p>
            </div>
            <p className="text-2xl font-bold">{timeLeftMinutes} min</p>
          </div>
        </div>

        {metrics.loaded_latency && (
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium">Loaded Latency</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">During Download</p>
                <p className="text-lg font-medium">{formatLatency(metrics.loaded_latency.download)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">During Upload</p>
                <p className="text-lg font-medium">{formatLatency(metrics.loaded_latency.upload)}</p>
              </div>
            </div>
          </div>
        )}

        {metrics.aim_scores && (
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium">Application Impact Metrics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Streaming</p>
                <p className={`text-lg font-medium ${
                  metrics.aim_scores.streaming.classification === "great" ? "text-green-500" :
                  metrics.aim_scores.streaming.classification === "good" ? "text-yellow-500" :
                  metrics.aim_scores.streaming.classification === "average" ? "text-orange-500" :
                  "text-red-500"
                }`}>
                  {metrics.aim_scores.streaming.points.toFixed(0)}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Gaming</p>
                <p className={`text-lg font-medium ${
                  metrics.aim_scores.gaming.classification === "great" ? "text-green-500" :
                  metrics.aim_scores.gaming.classification === "good" ? "text-yellow-500" :
                  metrics.aim_scores.gaming.classification === "average" ? "text-orange-500" :
                  "text-red-500"
                }`}>
                  {metrics.aim_scores.gaming.points.toFixed(0)}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Real-time</p>
                <p className={`text-lg font-medium ${
                  metrics.aim_scores.realTime.classification === "great" ? "text-green-500" :
                  metrics.aim_scores.realTime.classification === "good" ? "text-yellow-500" :
                  metrics.aim_scores.realTime.classification === "average" ? "text-orange-500" :
                  "text-red-500"
                }`}>
                  {metrics.aim_scores.realTime.points.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 