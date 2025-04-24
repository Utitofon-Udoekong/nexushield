"use client"

import { Button } from "@/app/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Icon } from "@iconify/react"
import { Navbar } from "@/app/components/navbar"
export default function ExtensionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-16 text-center space-y-8 bg-gradient-to-b from-background to-muted">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            NexusShield VPN{" "}
            <span className="text-primary">Browser Extension</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Quick access to WireGuard VPN configurations right from your browser.
            Generate, manage, and connect with just a few clicks.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="space-x-2">
            <Icon icon="mdi:chrome" className="h-5 w-5" />
            <span>Add to Chrome</span>
          </Button>
          <Button size="lg" variant="outline" className="space-x-2">
            <Icon icon="mdi:firefox" className="h-5 w-5" />
            <span>Add to Firefox</span>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Extension Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Icon icon="mdi:flash" className="h-8 w-8 text-primary" />
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>
                  Generate VPN configurations directly from your browser toolbar without visiting the website.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon="mdi:qrcode" className="h-8 w-8 text-primary" />
                <CardTitle>QR Code Support</CardTitle>
                <CardDescription>
                  Instantly generate QR codes for easy configuration import on mobile devices.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon="mdi:clock-outline" className="h-8 w-8 text-primary" />
                <CardTitle>Configuration Management</CardTitle>
                <CardDescription>
                  Save and manage multiple configurations with expiration tracking and notifications.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon="mdi:earth" className="h-8 w-8 text-primary" />
                <CardTitle>Multiple Locations</CardTitle>
                <CardDescription>
                  Choose from various server locations and customize lease durations for your needs.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon="mdi:bell-outline" className="h-8 w-8 text-primary" />
                <CardTitle>Expiry Notifications</CardTitle>
                <CardDescription>
                  Get notified before your configurations expire to maintain uninterrupted access.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon="mdi:theme-light-dark" className="h-8 w-8 text-primary" />
                <CardTitle>Dark Mode Support</CardTitle>
                <CardDescription>
                  Automatically matches your browser's theme preference for comfortable viewing.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Installation Steps */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Installation Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <CardTitle>Add to Browser</CardTitle>
                <CardDescription>
                  Click the "Add to Chrome" button above to open the Chrome Web Store page.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <CardTitle>Install Extension</CardTitle>
                <CardDescription>
                  Click "Add to Chrome" in the Web Store and confirm the installation.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <CardTitle>Start Using</CardTitle>
                <CardDescription>
                  Click the extension icon in your toolbar to start generating VPN configurations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Is the extension free to use?</CardTitle>
                <CardDescription>
                  Yes, the NexusShield VPN extension is completely free to use, just like our web interface.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Which browsers are supported?</CardTitle>
                <CardDescription>
                  Currently, we support Chrome and Firefox. Support for other Chromium-based browsers (Edge, Brave, etc.) is coming soon.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Do I need an account to use the extension?</CardTitle>
                <CardDescription>
                  No account is required. Simply install the extension and start generating VPN configurations immediately.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>How secure is the extension?</CardTitle>
                <CardDescription>
                  The extension uses the same secure API as our web interface and doesn't store any sensitive data. All configurations are encrypted and stored locally.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t mt-auto">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © 2024 NexusShield. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button variant="link" size="sm" className="text-muted-foreground hover:text-primary">
              Privacy Policy
            </Button>
            <Button variant="link" size="sm" className="text-muted-foreground hover:text-primary">
              Terms of Use
            </Button>
            <Button variant="link" size="sm" className="text-muted-foreground hover:text-primary">
              Support
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
} 