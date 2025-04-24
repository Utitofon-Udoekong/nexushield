"use client"

import { useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Icon } from "@iconify/react";
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
            Secure Your Digital Life with{" "}
            <span className="text-primary">NexusShield</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Experience lightning-fast VPN connections with military-grade encryption. 
            Protect your privacy and access content from anywhere in the world.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="/auth">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose NexusShield?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Icon icon="mdi-light:shield" className="h-12 w-12 text-primary" />
                <CardTitle>Military-Grade Security</CardTitle>
                <CardDescription>
                  Advanced encryption protocols to keep your data safe and secure.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon="lucide:globe" className="h-12 w-12 text-primary" />
                <CardTitle>Global Coverage</CardTitle>
                <CardDescription>
                  Access servers in 50+ countries with unlimited bandwidth.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon="lucide:zap" className="h-12 w-12 text-primary" />
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Optimized servers for maximum speed and minimal latency.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon="mdi-light:lock" className="h-12 w-12 text-primary" />
                <CardTitle>No Logs Policy</CardTitle>
                <CardDescription>
                  We never track or store your online activities.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      

      {/* Footer */}
      <footer className="py-6 px-4 border-t">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © 2024 NexusShield. All rights reserved.
          </div>
          
        </div>
      </footer>
    </div>
  )
}
