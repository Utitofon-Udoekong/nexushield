"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { StatusIndicator } from "@/app/components/ui/status-indicator"
import { Bell, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/app/lib/utils"
import { createClient } from "@/app/utils/supabase/client"
import { useVPN } from "@/app/components/providers/vpn-provider"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { isConnected } = useVPN()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Settings", href: "/dashboard/settings" },
  ]

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              NexusShield
            </Link>
            <nav className="flex space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <StatusIndicator 
              status={isConnected ? "connected" : "disconnected"} 
              size="sm"
            />
            
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>

            <div className="relative">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 