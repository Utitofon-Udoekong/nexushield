import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Power, Globe } from "lucide-react"
import { CountrySelector } from "@/app/components/vpn/country-selector"
import { connectVPN, disconnectVPN, getVPNStatus, VPNConnection } from "@/app/lib/tpn"
import { toast } from "@/app/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"

interface ConnectionManagerProps {
  onStatusChange: (status: VPNConnection | null) => void
}

export function ConnectionManager({ onStatusChange }: ConnectionManagerProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string>()
  const [leaseMinutes, setLeaseMinutes] = useState(30)
  const [showLeaseDialog, setShowLeaseDialog] = useState(false)

  const handleConnect = async (countryCode: string) => {
    setIsConnecting(true)
    try {
      await connectVPN(countryCode, leaseMinutes)
      const status = await getVPNStatus()
      onStatusChange(status)
      toast({
        title: "Success",
        description: `Connected to ${countryCode}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to VPN",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    setIsDisconnecting(true)
    try {
      await disconnectVPN()
      const status = await getVPNStatus()
      onStatusChange(status)
      toast({
        title: "Success",
        description: "Disconnected from VPN",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect from VPN",
        variant: "destructive",
      })
    } finally {
      setIsDisconnecting(false)
    }
  }

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode)
    setShowLeaseDialog(true)
  }

  const handleLeaseConfirm = () => {
    if (selectedCountry) {
      handleConnect(selectedCountry)
    }
    setShowLeaseDialog(false)
  }

  return (
    <div className="flex space-x-3">
      <CountrySelector
        onSelect={handleCountrySelect}
        currentCountry={selectedCountry}
      />
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDisconnect}
        disabled={isDisconnecting}
      >
        <Power className="mr-2 h-4 w-4" />
        {isDisconnecting ? "Disconnecting..." : "Disconnect"}
      </Button>

      <Dialog open={showLeaseDialog} onOpenChange={setShowLeaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Connection Duration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lease">Connection Duration (minutes)</Label>
              <Input
                id="lease"
                type="number"
                min="1"
                max="1440"
                value={leaseMinutes}
                onChange={(e) => setLeaseMinutes(Number(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Select how long you want to stay connected (1-1440 minutes)
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowLeaseDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleLeaseConfirm} disabled={isConnecting}>
                {isConnecting ? "Connecting..." : "Connect"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 