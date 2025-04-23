import { toast } from "@/app/hooks/use-toast";

export const TPN_VALIDATOR_IP = process.env.NEXT_PUBLIC_TPN_VALIDATOR_IP || "127.0.0.1";
export const TPN_API_PORT = process.env.NEXT_PUBLIC_TPN_API_PORT || "3000";
const TPN_API_BASE_URL = `http://${TPN_VALIDATOR_IP}:${TPN_API_PORT}/api`;

export interface VPNConfig {
  peer_config: string;
  expires_at: string;
}

export interface VPNConnection {
  connected: boolean;
  country_code: string;
  download_speed: number;
  upload_speed: number;
  latency: number;
  data_used: number;
  start_time?: string;
  end_time?: string;
}

export interface VPNMetrics {
  download_speed: number;
  upload_speed: number;
  latency: number;
  packet_loss: number;
  timestamp: string;
}

export interface VPNSchedule {
  id: string;
  country_code: string;
  start_time: string;
  end_time: string;
  repeat: boolean;
  repeat_days: number[];
  status: "pending" | "active" | "completed" | "failed";
}

export async function getAvailableCountries(): Promise<string[]> {
  try {
    const response = await fetch(`${TPN_API_BASE_URL}/config/countries`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching countries:", error);
    toast({
      title: "Error",
      description: "Failed to fetch available countries",
      variant: "destructive",
    });
    return [];
  }
}

export async function getVPNConfig(
  country: string = "any",
  leaseMinutes: number = 30
): Promise<VPNConfig | null> {
  try {
    const response = await fetch(
      `${TPN_API_BASE_URL}/config/new?format=json&geo=${country}&lease_minutes=${leaseMinutes}`
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

export async function connectVPN(
  country: string = "any",
  leaseMinutes: number = 30
): Promise<VPNConnection | null> {
  try {
    const config = await getVPNConfig(country, leaseMinutes);
    
    if (!config) {
      throw new Error("Failed to get VPN configuration");
    }
    
    // Save config to database
    const response = await fetch("/api/vpn/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country_code: country,
        config: config.peer_config,
        expires_at: config.expires_at,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to connect to VPN: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error connecting to VPN:", error);
    toast({
      title: "Error",
      description: "Failed to connect to VPN",
      variant: "destructive",
    });
    return null;
  }
}

export async function disconnectVPN(): Promise<boolean> {
  try {
    const response = await fetch("/api/vpn/disconnect", {
      method: "POST",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to disconnect from VPN: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error disconnecting from VPN:", error);
    toast({
      title: "Error",
      description: "Failed to disconnect from VPN",
      variant: "destructive",
    });
    return false;
  }
}

export async function getVPNStatus(): Promise<VPNConnection | null> {
  try {
    const response = await fetch("/api/vpn/status");
    
    if (!response.ok) {
      throw new Error(`Failed to get VPN status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error getting VPN status:", error);
    return null;
  }
}

export async function getConnectionMetrics(): Promise<{
  latency: number;
  downloadSpeed: number;
  uploadSpeed: number;
  packetLoss: number;
} | null> {
  try {
    const response = await fetch("/api/vpn/metrics");
    
    if (!response.ok) {
      throw new Error(`Failed to get connection metrics: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error getting connection metrics:", error);
    return null;
  }
}

export async function scheduleConnection(
  country: string,
  startTime: string,
  endTime: string,
  daysOfWeek: number[]
): Promise<boolean> {
  try {
    const response = await fetch("/api/vpn/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country_code: country,
        start_time: startTime,
        end_time: endTime,
        days_of_week: daysOfWeek,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to schedule connection: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error scheduling connection:", error);
    toast({
      title: "Error",
      description: "Failed to schedule VPN connection",
      variant: "destructive",
    });
    return false;
  }
}

export async function getScheduledConnections(): Promise<VPNSchedule[]> {
  try {
    const response = await fetch(`${TPN_API_BASE_URL}/schedules`);
    if (!response.ok) {
      throw new Error("Failed to fetch scheduled connections");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching scheduled connections:", error);
    toast({
      title: "Error",
      description: "Failed to fetch scheduled connections",
      variant: "destructive",
    });
    return [];
  }
}

export async function createSchedule(
  country_code: string,
  start_time: string,
  end_time: string,
  days_of_week: number[]
): Promise<VPNSchedule | null> {
  try {
    const response = await fetch(`${TPN_API_BASE_URL}/schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country_code,
        start_time,
        end_time,
        days_of_week,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create schedule");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating schedule:", error);
    toast({
      title: "Error",
      description: "Failed to create schedule",
      variant: "destructive",
    });
    return null;
  }
}

export async function deleteSchedule(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${TPN_API_BASE_URL}/schedules/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete schedule");
    }

    return true;
  } catch (error) {
    console.error("Error deleting schedule:", error);
    toast({
      title: "Error",
      description: "Failed to delete schedule",
      variant: "destructive",
    });
    return false;
  }
}

export async function updateSchedule(
  id: string,
  data: Partial<VPNSchedule>
): Promise<VPNSchedule | null> {
  try {
    const response = await fetch(`${TPN_API_BASE_URL}/schedules/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update schedule");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating schedule:", error);
    toast({
      title: "Error",
      description: "Failed to update schedule",
      variant: "destructive",
    });
    return null;
  }
}

export async function deleteScheduledConnection(id: string): Promise<void> {
  try {
    const response = await fetch(`${TPN_API_BASE_URL}/schedules/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete schedule')
    }
  } catch (error) {
    console.error('Error deleting schedule:', error)
    throw error
  }
} 