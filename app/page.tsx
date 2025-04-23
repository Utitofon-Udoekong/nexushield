"use client"

import { useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Icon } from "@iconify/react";
import Link from "next/link"

export default function Home() {
  useEffect(() => {
    console.log(window.location.origin)
  }, [])
  return (
    <div className="flex flex-col min-h-screen">
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
            <Link href="/auth/signup">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/login">Sign In</Link>
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
      <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>Perfect for casual users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-4">$4.99<span className="text-sm text-muted-foreground">/month</span></div>
                <ul className="space-y-2">
                  <li>✓ 5 Devices</li>
                  <li>✓ 30+ Countries</li>
                  <li>✓ Basic Support</li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>Best for power users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-4">$9.99<span className="text-sm text-muted-foreground">/month</span></div>
                <ul className="space-y-2">
                  <li>✓ 10 Devices</li>
                  <li>✓ 50+ Countries</li>
                  <li>✓ Priority Support</li>
                  <li>✓ Advanced Features</li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-4">Custom</div>
                <ul className="space-y-2">
                  <li>✓ Unlimited Devices</li>
                  <li>✓ All Countries</li>
                  <li>✓ 24/7 Support</li>
                  <li>✓ Custom Solutions</li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © 2024 NexusShield. All rights reserved.
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
