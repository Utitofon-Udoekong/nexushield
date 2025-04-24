"use client"

import { Button } from "@/app/components/ui/button"
import Link from "next/link"
import { Icon } from "@iconify/react"

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Icon icon="mdi:shield-lock" className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">NexusShield</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Button asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
} 