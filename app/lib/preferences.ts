export interface VPNPreferences {
  preferredCountry: string
  leaseMinutes: number
}

const DEFAULT_PREFERENCES: VPNPreferences = {
  preferredCountry: "US",
  leaseMinutes: 30
}

export function getVPNPreferences(): VPNPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES
  
  try {
    const stored = localStorage.getItem("vpn_preferences")
    if (!stored) return DEFAULT_PREFERENCES
    
    return JSON.parse(stored)
  } catch (error) {
    console.error("Error reading VPN preferences:", error)
    return DEFAULT_PREFERENCES
  }
}

export function setVPNPreferences(preferences: VPNPreferences) {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem("vpn_preferences", JSON.stringify(preferences))
  } catch (error) {
    console.error("Error saving VPN preferences:", error)
  }
} 