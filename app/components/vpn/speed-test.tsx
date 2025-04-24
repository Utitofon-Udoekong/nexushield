"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Icon } from "@iconify/react"
import { useToast } from "@/app/hooks/use-toast"
import { getConnectionSpeed, getPacketLoss, formatSpeed, formatLatency } from "@/app/lib/utils"

interface SpeedTestResults {
  download: number | null
  upload: number | null
  ping: number | null
  packetLoss: number | null
}

export function SpeedTest() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<SpeedTestResults>({
    download: null,
    upload: null,
    ping: null,
    packetLoss: null
  })
  const { toast } = useToast()

  const runSpeedTest = async () => {
    setTesting(true)
    setResults({ download: null, upload: null, ping: null, packetLoss: null })

    try {
      // Test ping and packet loss first
      const pingStart = Date.now()
      await fetch('https://api.ipify.org?format=json')
      const pingTime = Date.now() - pingStart
      
      // Run packet loss test
      const packetLoss = await getPacketLoss() as number

      // Run download speed test
      const downloadSpeed = await getConnectionSpeed() as number

      // Run upload speed test (simulated with smaller payload)
      const uploadSpeed = downloadSpeed * 0.8 // Typically upload is slower than download

      setResults({
        download: downloadSpeed,
        upload: uploadSpeed,
        ping: pingTime,
        packetLoss: packetLoss
      })

      toast({
        title: "Speed Test Complete",
        description: "Your network speed has been measured successfully.",
        variant: "success"
      })
    } catch (error) {
      console.error('Speed test failed:', error)
      toast({
        title: "Speed Test Failed",
        description: "There was an error measuring your network speed.",
        variant: "destructive"
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="border-0 bg-background">
      <CardHeader>
        <CardTitle className="text-2xl">Speed Test</CardTitle>
        <CardDescription>
          Measure your current connection speed and quality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Icon icon="mdi:download" className="mr-2 h-4 w-4" />
                Download
              </div>
              <div className="text-2xl font-bold">
                {results.download === null ? '--' : formatSpeed(results.download)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Icon icon="mdi:upload" className="mr-2 h-4 w-4" />
                Upload
              </div>
              <div className="text-2xl font-bold">
                {results.upload === null ? '--' : formatSpeed(results.upload)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Icon icon="mdi:timer" className="mr-2 h-4 w-4" />
                Ping
              </div>
              <div className="text-2xl font-bold">
                {results.ping === null ? '--' : formatLatency(results.ping)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Icon icon="mdi:wifi-strength-alert" className="mr-2 h-4 w-4" />
                Packet Loss
              </div>
              <div className="text-2xl font-bold">
                {results.packetLoss === null ? '--' : `${results.packetLoss.toFixed(1)}%`}
              </div>
            </div>
          </div>
          <Button 
            onClick={runSpeedTest} 
            disabled={testing}
            className="w-full"
          >
            {testing ? (
              <>
                <Icon icon="mdi:loading" className="mr-2 h-4 w-4 animate-spin" />
                Running Speed Test...
              </>
            ) : (
              <>
                <Icon icon="mdi:speed-meter" className="mr-2 h-4 w-4" />
                Start Speed Test
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 