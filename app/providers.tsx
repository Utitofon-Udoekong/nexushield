"use client"

import { ThemeProvider } from "@/app/components/providers/theme-provider"
import { QueryProvider } from "@/app/components/providers/query-provider"
import { AuthProvider } from "@/app/components/providers/auth-provider"
import { VPNProvider } from "@/app/components/providers/vpn-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>
          <VPNProvider>
            {children}
          </VPNProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  )
} 