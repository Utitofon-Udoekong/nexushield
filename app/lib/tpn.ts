import { toast } from "@/app/hooks/use-toast";

export const TPN_VALIDATOR_IP = process.env.NEXT_PUBLIC_TPN_VALIDATOR_IP || "127.0.0.1";
export const TPN_API_PORT = process.env.NEXT_PUBLIC_TPN_API_PORT || "3000";

export interface VPNConfig {
  peer_config: string;
  expires_at: string;
}

interface CountriesCache {
  countries: string[];
  timestamp: number;
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const CACHE_KEY = 'vpn_countries_cache';

function getCachedCountries(): CountriesCache | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const parsed = JSON.parse(cached) as CountriesCache;
    return parsed;
  } catch (error) {
    console.error('Error reading countries cache:', error);
    return null;
  }
}

function setCachedCountries(cache: CountriesCache): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error writing countries cache:', error);
  }
}

export async function getAvailableCountries(): Promise<string[]> {
  // Check if we have a valid cache
  const cached = getCachedCountries();
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.countries;
  }

  try {
    const response = await fetch(`/api/vpn/countries`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }
    
    const countries = await response.json();
    
    // Update the cache
    const newCache = {
      countries,
      timestamp: Date.now()
    };
    setCachedCountries(newCache);
    
    return countries;
  } catch (error) {
    console.error("Error fetching countries:", error);
    toast({
      title: "Error",
      description: "Failed to fetch available countries",
      variant: "destructive",
    });
    
    // If we have cached data, return it even if it's expired
    if (cached) {
      return cached.countries;
    }
    
    return [];
  }
}

export async function getVPNConfig(
  country: string = "any",
  leaseMinutes: number = 30
): Promise<VPNConfig | null> {
  try {
    const response = await fetch(
      `/api/vpn/config?country=${country}&lease_minutes=${leaseMinutes}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch VPN config: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching VPN config:", error);
    toast({
      title: "Error",
      description: "Failed to fetch VPN configuration",
      variant: "destructive",
    });
    return null;
  }
}