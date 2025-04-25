"use client"

import { ReactNode } from "react"
import { cn } from "@/app/lib/utils"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "../components/ui/button"

interface DashboardLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "lucide:shield" },
  { name: "Saved Configs", href: "/dashboard/configs", icon: "mdi:folder" },
  { name: "Settings", href: "/dashboard/settings", icon: "mdi-light:settings" },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto border-r">
            <div className="flex items-center flex-shrink-0 px-4">
              <Icon icon="mdi-light:shield" className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold">
                NexusShield
              </span>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon
                        icon={item.icon}
                        className={cn(
                          "mr-3 h-5 w-5",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t p-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="flex items-center w-full text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Icon icon="mdi-light:logout" className="mr-3 h-5 w-5" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 