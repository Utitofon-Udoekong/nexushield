"use client"

import { useEffect, useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { useToast } from "@/app/hooks/use-toast"
import { Icon } from "@iconify/react"

interface VPNPreferences {
  preferredCountry: string
  leaseMinutes: number
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [preferences, setPreferences] = useState<VPNPreferences>({
    preferredCountry: "US",
    leaseMinutes: 30
  })

  useEffect(() => {
    // Load preferences from localStorage
    const stored = localStorage.getItem("vpn_preferences")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setPreferences(parsed)
      } catch (error) {
        console.error("Error parsing stored preferences:", error)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Save to localStorage
      localStorage.setItem("vpn_preferences", JSON.stringify(preferences))
      toast({
        title: "Success",
        description: "Settings updated successfully",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-0 bg-background">
          <CardHeader>
            <CardTitle>VPN Preferences</CardTitle>
            <CardDescription>
              Configure your default VPN connection settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="country">Default Country</Label>
                <Select
                  value={preferences.preferredCountry}
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, preferredCountry: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="JP">Japan</SelectItem>
                    <SelectItem value="SG">Singapore</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  This country will be pre-selected when generating new configurations
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lease">Default Lease Duration (minutes)</Label>
                <Input
                  id="lease"
                  type="number"
                  min="1"
                  max="60"
                  value={preferences.leaseMinutes}
                  onChange={(e) => setPreferences(prev => ({ ...prev, leaseMinutes: parseInt(e.target.value) || 30 }))}
                />
                <p className="text-sm text-muted-foreground">
                  Default duration for new VPN configurations (1-60 minutes)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <Icon icon="heroicons:arrow-path" className="size-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Icon icon="heroicons:check" className="size-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 