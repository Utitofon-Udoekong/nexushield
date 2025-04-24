"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Icon } from "@iconify/react"
import { useToast } from "@/app/hooks/use-toast"

export function SpeedTest() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<{
    download: number | null
    upload: number | null
    ping: number | null
  }>({
    download: null,
    upload: null,
    ping: null
  })
  const { toast } = useToast()

  const runSpeedTest = async () => {
    setTesting(true)
    setResults({ download: null, upload: null, ping: null })

    try {
      // Simulate ping test
      const pingStart = Date.now()
      await fetch('https://api.ipify.org?format=json')
      const pingTime = Date.now() - pingStart

      // Simulate download test with a 10MB file
      const downloadStart = Date.now()
      const downloadRes = await fetch('https://speed.cloudflare.com/__down?bytes=10000000')
      const downloadData = await downloadRes.blob()
      const downloadTime = (Date.now() - downloadStart) / 1000 // seconds
      const downloadSpeed = (downloadData.size * 8) / (1000000 * downloadTime) // Mbps

      // Simulate upload test with a 5MB file
      const uploadData = new Blob([new ArrayBuffer(5000000)])
      const uploadStart = Date.now()
      await fetch('https://speed.cloudflare.com/__up', {
        method: 'POST',
        body: uploadData
      })
      const uploadTime = (Date.now() - uploadStart) / 1000 // seconds
      const uploadSpeed = (uploadData.size * 8) / (1000000 * uploadTime) // Mbps

      setResults({
        download: Math.round(downloadSpeed * 100) / 100,
        upload: Math.round(uploadSpeed * 100) / 100,
        ping: Math.round(pingTime)
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
          Measure your current connection speed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Icon icon="mdi:download" className="mr-2 h-4 w-4" />
                Download Speed
              </div>
              <div className="text-2xl font-bold">
                {results.download === null ? '--' : `${results.download} Mbps`}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Icon icon="mdi:upload" className="mr-2 h-4 w-4" />
                Upload Speed
              </div>
              <div className="text-2xl font-bold">
                {results.upload === null ? '--' : `${results.upload} Mbps`}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Icon icon="mdi:timer" className="mr-2 h-4 w-4" />
                Ping
              </div>
              <div className="text-2xl font-bold">
                {results.ping === null ? '--' : `${results.ping} ms`}
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