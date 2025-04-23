"use client"

import { useEffect, useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Icon } from "@iconify/react"
import { toast } from "@/app/hooks/use-toast"
import { useVPN } from "@/app/components/providers/vpn-provider"
import { createClient } from "@/app/utils/supabase/client"
import * as ST from "@cloudflare/speedtest"

interface SpeedTestResults {
  download: number
  upload: number
  ping: number
  packetLoss: number
  loadedLatency: {
    download: number
    upload: number
  }
  aimScores: {
    [key: string]: {
      points: number;
      classificationIdx: 0 | 1 | 2 | 3 | 4;
      classificationName: "bad" | "poor" | "average" | "good" | "great";
    }
  }
}

export function SpeedTest() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<SpeedTestResults | null>(null)
  const [speedTest, setSpeedTest] = useState<ST.default | null>(null)
  const { refreshMetrics } = useVPN()
  const supabase = createClient()

  useEffect(() => {
    // Initialize speed test with comprehensive configuration
    const test = new ST.default({
      autoStart: false,
      measureDownloadLoadedLatency: true,
      measureUploadLoadedLatency: true,
      measurements: [
        { type: 'latency', numPackets: 1 }, // initial latency estimation
        { type: 'download', bytes: 1e5, count: 1, bypassMinDuration: true }, // initial download estimation
        { type: 'latency', numPackets: 20 },
        { type: 'download', bytes: 1e5, count: 9 },
        { type: 'download', bytes: 1e6, count: 8 },
        { type: 'upload', bytes: 1e5, count: 8 },
        { type: 'packetLoss', numPackets: 1e3, responsesWaitTime: 3000 },
        { type: 'upload', bytes: 1e6, count: 6 },
        { type: 'download', bytes: 1e7, count: 6 },
        { type: 'upload', bytes: 1e7, count: 4 },
        { type: 'download', bytes: 2.5e7, count: 4 },
        { type: 'upload', bytes: 2.5e7, count: 4 },
        { type: 'download', bytes: 1e8, count: 3 },
        { type: 'upload', bytes: 5e7, count: 3 },
        { type: 'download', bytes: 2.5e8, count: 2 }
      ]
    })

    test.onRunningChange = (running) => {
      setIsRunning(running)
    }

    test.onResultsChange = () => {
      const results = test.results
      if (results) {
        const download = results.getDownloadBandwidth()
        const upload = results.getUploadBandwidth()
        const ping = results.getUnloadedLatency()
        const packetLoss = results.getPacketLoss()
        const downLoadedLatency = results.getDownLoadedLatency()
        const upLoadedLatency = results.getUpLoadedLatency()
        const scores = results.getScores()

        if (download !== undefined && upload !== undefined && ping !== undefined) {
          setResults({
            download: download / 1e6, // Convert to Mbps
            upload: upload / 1e6, // Convert to Mbps
            ping: ping,
            packetLoss: packetLoss ? packetLoss * 100 : 0, // Convert to percentage
            loadedLatency: {
              download: downLoadedLatency || 0,
              upload: upLoadedLatency || 0
            },
            aimScores: {
              streaming: scores?.streaming,
              gaming: scores?.gaming,
              realTime: scores?.realTime
            }
          })
        }
      }
    }

    test.onError = (error) => {
      console.error("Speed test error:", error)
      toast({
        title: "Error",
        description: "Failed to run speed test. Please try again.",
        variant: "destructive",
      })
      setIsRunning(false)
    }

    test.onFinish = async () => {
      // Record the results in the database
      if (results) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          await supabase
            .from('performance_metrics')
            .insert({
              user_id: session.user.id,
              download_speed: results.download,
              upload_speed: results.upload,
              latency: results.ping,
              packet_loss: results.packetLoss,
              loaded_latency: results.loadedLatency,
              aim_scores: results.aimScores
            })
        }
      }

      toast({
        title: "Speed test completed",
        description: "Your connection speed has been measured.",
      })

      // Refresh the metrics in the VPN provider
      await refreshMetrics()
    }

    setSpeedTest(test)

    return () => {
      if (test.isRunning) {
        test.pause()
      }
    }
  }, [results, refreshMetrics])

  const runSpeedTest = () => {
    if (speedTest) {
      if (speedTest.isFinished) {
        speedTest.restart()
      } else {
        speedTest.play()
      }
    }
  }

  const getAIMScoreColor = (score: string) => {
    if (score === "great") return "text-green-500"
    if (score === "good") return "text-yellow-500"
    if (score === "average") return "text-orange-500"
    if (score === "poor") return "text-red-500"
    if (score === "bad") return "text-red-500"
    return "text-gray-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Speed Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={runSpeedTest}
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Icon icon="lucide:loader" className="mr-2 size-4 animate-spin" />
                Running Speed Test...
              </>
            ) : (
              "Run Speed Test"
            )}
          </Button>

          {results && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Download</p>
                  <p className="text-2xl font-bold">{results.download.toFixed(2)} Mbps</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Upload</p>
                  <p className="text-2xl font-bold">{results.upload.toFixed(2)} Mbps</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Ping</p>
                  <p className="text-2xl font-bold">{results.ping.toFixed(2)} ms</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Packet Loss</p>
                  <p className="text-2xl font-bold">{results.packetLoss.toFixed(2)}%</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Loaded Latency</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">During Download</p>
                    <p className="text-lg font-medium">{results.loadedLatency.download.toFixed(2)} ms</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">During Upload</p>
                    <p className="text-lg font-medium">{results.loadedLatency.upload.toFixed(2)} ms</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Application Impact Metrics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Streaming</p>
                    <p className={`text-lg font-medium ${getAIMScoreColor(results.aimScores.streaming.classificationName)}`}>
                      {results.aimScores.streaming.points.toFixed(0)}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Gaming</p>
                    <p className={`text-lg font-medium ${getAIMScoreColor(results.aimScores.gaming.classificationName)}`}>
                      {results.aimScores.gaming.points.toFixed(0)}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Real-time</p>
                    <p className={`text-lg font-medium ${getAIMScoreColor(results.aimScores.realTime.classificationName)}`}>
                      {results.aimScores.realTime.points.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 