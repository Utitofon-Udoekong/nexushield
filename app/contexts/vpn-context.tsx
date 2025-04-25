"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { getSavedConfigs, cleanupExpiredConfigs, SavedVPNConfig } from "@/app/lib/saved-configs"

interface VPNContextType {
  savedConfigs: SavedVPNConfig[]
  refreshConfigs: () => void
}

const VPNContext = createContext<VPNContextType | undefined>(undefined)

export function VPNProvider({ children }: { children: ReactNode }) {
  const [savedConfigs, setSavedConfigs] = useState<SavedVPNConfig[]>([])

  const refreshConfigs = () => {
    cleanupExpiredConfigs()
    setSavedConfigs(getSavedConfigs())
  }

  useEffect(() => {
    // Initial load
    refreshConfigs()

    // Set up cleanup when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshConfigs()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup expired configs when window gains focus
    const handleFocus = () => {
      refreshConfigs()
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Set up expiry listeners for active configs
  useEffect(() => {
    const expiryTimers = savedConfigs.map(config => {
      const timeUntilExpiry = config.expires_at - Date.now()
      if (timeUntilExpiry <= 0) return undefined

      return setTimeout(() => {
        refreshConfigs()
      }, timeUntilExpiry)
    })

    return () => {
      expiryTimers.forEach(timer => timer && clearTimeout(timer))
    }
  }, [savedConfigs])

  return (
    <VPNContext.Provider value={{ savedConfigs, refreshConfigs }}>
      {children}
    </VPNContext.Provider>
  )
}

export function useVPN() {
  const context = useContext(VPNContext)
  if (context === undefined) {
    throw new Error('useVPN must be used within a VPNProvider')
  }
  return context
} 