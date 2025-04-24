"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Icon } from "@iconify/react"
import { useToast } from "@/app/hooks/use-toast"
import { CountrySelector } from "@/app/components/vpn/country-selector"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import { Label } from "@/app/components/ui/label"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { ConfigDownloader } from "@/app/components/vpn/config-downloader"
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert"
import { SpeedTest } from "@/app/components/vpn/speed-test"
import { getVPNPreferences } from "@/app/lib/preferences"
import { getDeviceType, getOperatingSystem, getBrowser, getCurrentIP, getLocationInfo } from "@/app/lib/utils"

interface DeviceInfo {
  type: string
  os: string
  browser: string
  ip: string | null
  location: {
    city?: string
    region?: string
    country?: string
  } | null
}

export default function DashboardPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>()
  const [config, setConfig] = useState<string | null>(null)
  const [leaseMinutes, setLeaseMinutes] = useState(30)
  const [showLeaseDialog, setShowLeaseDialog] = useState(false)
  const [expiresAt, setExpiresAt] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [isGettingConfig, setIsGettingConfig] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadPreferences = () => {
      const preferences = getVPNPreferences()
      setSelectedCountry(preferences.preferredCountry)
      setLeaseMinutes(preferences.leaseMinutes)
    }
    loadPreferences()
  }, [])

  useEffect(() => {
    const loadDeviceInfo = async () => {
      if (typeof window === 'undefined') return

      const userAgent = window.navigator.userAgent
      const ip = await getCurrentIP()
      const location = ip ? await getLocationInfo(ip) : null

      setDeviceInfo({
        type: getDeviceType(userAgent),
        os: getOperatingSystem(userAgent),
        browser: getBrowser(userAgent),
        ip,
        location
      })
    }

    loadDeviceInfo()
  }, [])

  useEffect(() => {
    if (!expiresAt) return

    const updateTimeRemaining = () => {
      const now = Date.now()
      const remaining = expiresAt - now

      if (remaining <= 0) {
        setTimeRemaining("Expired")
        setConfig(null)
        setExpiresAt(null)
        toast({
          title: "Configuration Expired",
          description: "Your VPN configuration has expired. Please generate a new one.",
          variant: "destructive",
        })
        return
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60))
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)

      // Show warning when less than 5 minutes remain
      if (remaining < 5 * 60 * 1000 && remaining > 0) {
        toast({
          title: "Configuration Expiring Soon",
          description: `Your VPN configuration will expire in ${minutes} minutes.`,
          variant: "warning",
        })
      }
    }

    updateTimeRemaining()
    const interval = setInterval(updateTimeRemaining, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode)
    setShowLeaseDialog(true)
  }

  const handleGetConfig = async () => {
    setIsGettingConfig(true)
    try {
      const response = await fetch(`/api/vpn/config?country=${selectedCountry}&lease_minutes=${leaseMinutes}`)
      if (!response.ok) throw new Error('Failed to get config')
      const data = await response.json()
      console.log(data)
      setConfig(data.peer_config)
      setExpiresAt(data.expires_at)
      setShowLeaseDialog(false)
      toast({
        title: "Configuration Generated",
        description: `Your VPN configuration will expire in ${leaseMinutes} minutes.`,
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get VPN configuration",
        variant: "destructive",
      })
    } finally {
      setIsGettingConfig(false)
    }
  }

  function getCountryName(countryCode: string): string {
    try {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
      return regionNames.of(countryCode.toUpperCase()) || countryCode
    } catch {
      return countryCode
    }
  } 

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your VPN connection and settings</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 bg-background">
          <CardHeader>
            <CardTitle className="text-2xl">Device Information</CardTitle>
            <CardDescription>
              Your current device and network details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex items-center space-x-2">
                  <Icon icon="mdi:devices" className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Device Type:</span>
                </div>
                <span className="text-sm font-medium">{deviceInfo?.type || 'Loading...'}</span>

                <div className="flex items-center space-x-2">
                  <Icon icon="mdi:desktop-classic" className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Operating System:</span>
                </div>
                <span className="text-sm font-medium">{deviceInfo?.os || 'Loading...'}</span>

                <div className="flex items-center space-x-2">
                  <Icon icon="mdi:web" className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Browser:</span>
                </div>
                <span className="text-sm font-medium">{deviceInfo?.browser || 'Loading...'}</span>

                <div className="flex items-center space-x-2">
                  <Icon icon="mdi:ip-network" className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">IP Address:</span>
                </div>
                <span className="text-sm font-medium">{deviceInfo?.ip || 'Loading...'}</span>

                <div className="flex items-center space-x-2">
                  <Icon icon="mdi:map-marker" className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Location:</span>
                </div>
                <span className="text-sm font-medium">
                  {deviceInfo?.location ? (
                    `${deviceInfo.location.city || ''} ${deviceInfo.location.region || ''}, ${deviceInfo.location.country || ''}`
                  ) : 'Loading...'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-background">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">VPN Config</CardTitle>
            <CardDescription>
              Select a location and generate your VPN configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-end">
                <div className="w-full md:w-auto">
                  <CountrySelector
                    onSelect={handleCountrySelect}
                    currentCountry={selectedCountry}
                  />
              </div>
              </div>
              {config && expiresAt && (
                <div className="mt-4">
                  <Alert className="bg-amber-950/90 border-amber-900 text-amber-400 mb-4">
                    <Icon icon="mdi:clock-alert" className="h-5 w-5 text-amber-500" />
                    <AlertTitle className="text-amber-400 text-lg font-semibold">
                      Configuration Active
                    </AlertTitle>
                    <AlertDescription className="text-amber-500/90 mt-1">
                      Your VPN configuration will expire in {timeRemaining}
                    </AlertDescription>
                  </Alert>
            </div>
          )}
        </div>
          </CardContent>
        </Card>

        {config && expiresAt && (
          <Card className="border-0 bg-background">
            <CardHeader>
              <CardTitle className="text-2xl">Download Configuration</CardTitle>
              <CardDescription>
                Download your configuration file or scan the QR code to connect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConfigDownloader
                config={config}
                countryCode={selectedCountry || "any"}
                expiresAt={expiresAt}
              />
            </CardContent>
          </Card>
        )}

        {/* Speed Test Section */}
        <Card className="md:col-span-2">
          <SpeedTest />
        </Card>

        
          </div>

      <Dialog open={showLeaseDialog} onOpenChange={setShowLeaseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Get VPN Configuration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lease">Connection Duration (minutes)</Label>
              <Input
                id="lease"
                type="number"
                min="1"
                max="60"
                value={leaseMinutes}
                onChange={(e) => setLeaseMinutes(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Select how long you want to stay connected (1-60 minutes)
              </p>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowLeaseDialog(false)}
                disabled={isGettingConfig}
              >
                Cancel
            </Button>
              <Button 
                onClick={handleGetConfig}
                disabled={isGettingConfig}
                className="min-w-[120px]"
              >
                {isGettingConfig ? (
                  <>
                    <Icon icon="mdi:loading" className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Get Config'
                )}
            </Button>
          </div>
        </div>
        </DialogContent>
      </Dialog>
      </div>
  )
} 