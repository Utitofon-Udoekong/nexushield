export interface SavedVPNConfig {
  id: string;
  peer_config: string;
  country: string;
  expires_at: number;
  created_at: number;
}

const SAVED_CONFIGS_KEY = 'vpn_saved_configs';

export function getSavedConfigs(): SavedVPNConfig[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(SAVED_CONFIGS_KEY);
    if (!stored) return [];
    
    const configs = JSON.parse(stored) as SavedVPNConfig[];
    return configs.filter(config => config.expires_at > Date.now());
  } catch (error) {
    console.error("Error reading saved configs:", error);
    return [];
  }
}

export function saveConfig(config: Omit<SavedVPNConfig, 'id' | 'created_at'>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const configs = getSavedConfigs();
    const newConfig: SavedVPNConfig = {
      ...config,
      id: crypto.randomUUID(),
      created_at: Date.now()
    };
    
    localStorage.setItem(SAVED_CONFIGS_KEY, JSON.stringify([newConfig, ...configs]));
  } catch (error) {
    console.error("Error saving config:", error);
  }
}

export function deleteConfig(configId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const configs = getSavedConfigs();
    const updatedConfigs = configs.filter(config => config.id !== configId);
    localStorage.setItem(SAVED_CONFIGS_KEY, JSON.stringify(updatedConfigs));
  } catch (error) {
    console.error("Error deleting config:", error);
  }
}

export function cleanupExpiredConfigs(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const configs = getSavedConfigs();
    const validConfigs = configs.filter(config => config.expires_at > Date.now());
    localStorage.setItem(SAVED_CONFIGS_KEY, JSON.stringify(validConfigs));
  } catch (error) {
    console.error("Error cleaning up configs:", error);
  }
} 