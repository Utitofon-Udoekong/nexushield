"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Icon } from "@iconify/react"
import { useToast } from "@/app/hooks/use-toast"
import { ConfigDownloader } from "@/app/components/vpn/config-downloader"
import { getSavedConfigs, deleteConfig, cleanupExpiredConfigs, SavedVPNConfig } from "@/app/lib/saved-configs"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "@/app/components/ui/separator"
import { QRCodeSVG } from "qrcode.react"
import { DialogTitle, DialogHeader, DialogContent } from "@/app/components/ui/dialog"
import { DialogTrigger } from "@/app/components/ui/dialog"
import { Dialog } from "@/app/components/ui/dialog"
import { saveAs } from "file-saver"
import { Countdown } from "@/app/components/ui/countdown"
import { useVPN } from "@/app/contexts/vpn-context"

export default function ConfigsPage() {
    const { savedConfigs, refreshConfigs } = useVPN()
    const [showQR, setShowQR] = useState(false)
    const { toast } = useToast()

    const handleDownload = (config: SavedVPNConfig) => {
        const blob = new Blob([config.peer_config], { type: "text/plain;charset=utf-8" })
        saveAs(blob, `nexushield-${config.country}.conf`)
    }

    const handleDeleteConfig = (configId: string) => {
        deleteConfig(configId)
        refreshConfigs()
        toast({
            title: "Configuration Deleted",
            description: "The configuration has been removed from your saved configurations.",
            variant: "default",
        })
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
                    <h1 className="text-3xl font-bold">Saved Configurations</h1>
                    <p className="text-muted-foreground mt-1">Manage your saved VPN configurations</p>
                </div>
            </div>

            {savedConfigs.length === 0 ? (
                <Card className="border-0 bg-background">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <Icon icon="mdi:folder-open" className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Saved Configurations</h3>
                        <p className="text-muted-foreground mb-4">
                            Generate a new VPN configuration from the dashboard to see it here.
                        </p>
                        <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                            <Icon icon="mdi:plus" className="h-4 w-4 mr-2" />
                            Generate New Configuration
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {savedConfigs.map((savedConfig) => {
                        const expiresIn = Math.max(0, Math.floor((savedConfig.expires_at - Date.now()) / 1000 / 60))
                        const isExpiringSoon = expiresIn < 5
                        return (
                            <Card
                                key={savedConfig.id}
                                className="border-0 bg-background overflow-hidden"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 rounded-full bg-primary/10">
                                                <Icon icon="mdi:server-network" className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold">
                                                    {getCountryName(savedConfig.country)}
                                                </h2>
                                                <p className="text-sm text-muted-foreground">
                                                    Created {new Date(savedConfig.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={savedConfig.expires_at - Date.now() < 5 * 60 * 1000 ? "destructive" : "secondary"}>
                                            <Countdown expiresAt={savedConfig.expires_at} />
                                        </Badge>
                                    </div>

                                    <div className="grid gap-4">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium">Using WireGuard App</h3>
                                            <div className="space-y-2 text-sm text-muted-foreground">
                                                <p>1. Download the official WireGuard app for your platform</p>
                                                <p>2. Click the "+" button to add a new tunnel</p>
                                                <p>3. Select "Import from file"</p>
                                                <p>4. Choose the downloaded config file</p>
                                                <p>5. Click "Add Tunnel"</p>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="outline">
                                                    Expires: <Countdown expiresAt={savedConfig.expires_at} />
                                                </Badge>
                                                <Badge variant="outline">Country: {savedConfig.country}</Badge>
                                            </div>
                                            <div className="flex gap-2 mb-4">
                                                <Button onClick={() => handleDownload(savedConfig)}>
                                                    <Icon icon="mdi:download" className="mr-2" />
                                                    Download Config
                                                </Button>
                                                <Dialog>
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
                                                            <QRCodeSVG value={savedConfig.peer_config} size={256} />
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    onClick={() => handleDeleteConfig(savedConfig.id)}
                                                >
                                                    <Icon icon="mdi:delete" className="h-5 w-5" /> Delete Config
                                                </Button>
                                            </div>
                                        </div>

                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
} 