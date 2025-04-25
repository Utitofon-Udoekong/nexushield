"use client"

import { Button } from "@/app/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { Navbar } from "@/app/components/navbar"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 text-center space-y-8 bg-gradient-to-b from-background to-muted">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Simple WireGuard VPN{" "}
            <span className="text-primary">Configuration</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Generate and manage WireGuard VPN configurations with ease. Monitor your connection speed, 
            and get detailed network insights - all in one place.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/extension">Download Extension</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Icon icon="mdi:vpn" className="h-12 w-12 text-primary" />
                <CardTitle>Easy Configuration</CardTitle>
                <CardDescription>
                  Generate WireGuard configurations for multiple countries with customizable lease durations. Download configs or use QR codes for mobile setup.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon="mdi:speed-meter" className="h-12 w-12 text-primary" />
                <CardTitle>Network Insights</CardTitle>
                <CardDescription>
                  Monitor your connection with real-time speed tests, including download/upload speeds, ping, and packet loss measurements.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon="mdi:devices" className="h-12 w-12 text-primary" />
                <CardTitle>Device Information</CardTitle>
                <CardDescription>
                  View detailed information about your device, network, and location. Track your public IP and connection details.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon="mdi:puzzle" className="h-12 w-12 text-primary" />
                <CardTitle>Browser Extension</CardTitle>
                <CardDescription>
                  Quick access to VPN configurations right from your browser. Generate, manage, and scan QR codes for instant mobile setup.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold">Install Extension</h3>
              <p className="text-muted-foreground">
                Download and install our browser extension for quick access to VPN configurations
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold">Select Location</h3>
              <p className="text-muted-foreground">
                Choose your preferred server location from our list of available countries
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold">Generate Config</h3>
              <p className="text-muted-foreground">
                Set your desired lease duration and generate a WireGuard configuration
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">4</span>
              </div>
              <h3 className="text-xl font-semibold">Connect</h3>
              <p className="text-muted-foreground">
                Download the config file or scan the QR code with your WireGuard app
              </p>
            </div>
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
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary">
              Dashboard
            </Link>
            <Link href="/dashboard/settings" className="text-sm text-muted-foreground hover:text-primary">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
