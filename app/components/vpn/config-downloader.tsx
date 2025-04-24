import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Icon } from "@iconify/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { QRCodeSVG } from "qrcode.react"
import { saveAs } from "file-saver"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Badge } from "@/app/components/ui/badge"

interface ConfigDownloaderProps {
  config: string
  countryCode: string
  expiresAt: number
}

export function ConfigDownloader({ config, countryCode, expiresAt }: ConfigDownloaderProps) {
  const [showQR, setShowQR] = useState(false)
  const expiryDate = new Date(expiresAt).toLocaleString()

  const handleDownload = () => {
    const blob = new Blob([config], { type: "text/plain;charset=utf-8" })
    saveAs(blob, `nexushield-${countryCode}.conf`)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>VPN Configuration</CardTitle>
          <CardDescription>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Expires: {expiryDate}</Badge>
              <Badge variant="outline">Country: {countryCode}</Badge>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={handleDownload}>
              <Icon icon="mdi:download" className="mr-2" />
              Download Config
            </Button>
            <Dialog open={showQR} onOpenChange={setShowQR}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Icon icon="mdi:qrcode" className="mr-2" />
                  Show QR Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Scan QR Code</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center p-4">
                  <QRCodeSVG value={config} size={256} />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="app" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="app">Using WireGuard App</TabsTrigger>
              <TabsTrigger value="cli">Using Command Line</TabsTrigger>
            </TabsList>
            <TabsContent value="app">
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Installation</h4>
                  <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                    <li>Download the official WireGuard app for your platform:</li>
                    <ul className="list-disc pl-4 mt-1">
                      <li>Windows: <a href="https://www.wireguard.com/install/" className="text-primary hover:underline">Download from wireguard.com</a></li>
                      <li>macOS: <a href="https://apps.apple.com/us/app/wireguard/id1451685025" className="text-primary hover:underline">Download from App Store</a></li>
                      <li>Android: <a href="https://play.google.com/store/apps/details?id=com.wireguard.android" className="text-primary hover:underline">Download from Play Store</a></li>
                      <li>iOS: <a href="https://apps.apple.com/us/app/wireguard/id1441195209" className="text-primary hover:underline">Download from App Store</a></li>
                    </ul>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Configuration</h4>
                  <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                    <li>Open the WireGuard app</li>
                    <li>Click the "+" button to add a new tunnel</li>
                    <li>Select "Import from file"</li>
                    <li>Choose the downloaded config file</li>
                    <li>Click "Add Tunnel"</li>
                    <li>Toggle the switch to connect</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="cli">
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Installation</h4>
                  <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                    <li>Install WireGuard tools:</li>
                    <ul className="list-disc pl-4 mt-1">
                      <li>macOS: <code className="bg-muted px-1 rounded">brew install wireguard-tools</code></li>
                      <li>Linux (Debian/Ubuntu): <code className="bg-muted px-1 rounded">sudo apt update && sudo apt install -y wireguard wireguard-tools</code></li>
                    </ul>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Configuration</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">1. Save the configuration:</p>
                    <code className="block p-2 bg-muted rounded-md text-sm">
                      curl -s "http://185.189.44.166:3000/api/config/new?format=text&geo={countryCode}&lease_minutes=5" {'>'} ./nexushield-{countryCode}.conf
                    </code>

                    <p className="text-sm text-muted-foreground">2. Check your current IP:</p>
                    <code className="block p-2 bg-muted rounded-md text-sm">
                      curl icanhazip.com
                    </code>

                    <p className="text-sm text-muted-foreground">3. Connect to VPN:</p>
                    <code className="block p-2 bg-muted rounded-md text-sm">
                      sudo wg-quick up ./nexushield-{countryCode}.conf
                    </code>

                    <p className="text-sm text-muted-foreground">4. Verify connection:</p>
                    <code className="block p-2 bg-muted rounded-md text-sm">
                      curl icanhazip.com
                    </code>

                    <p className="text-sm text-muted-foreground">5. Disconnect:</p>
                    <code className="block p-2 bg-muted rounded-md text-sm">
                      sudo wg-quick down ./nexushield-{countryCode}.conf
                    </code>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 