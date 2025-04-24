import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, chmod } from 'fs/promises';
import { join } from 'path';
import os from 'os';

const execAsync = promisify(exec);

interface WireGuardConfig {
  peer_config: string;
}

// Store active config path for cleanup
let activeConfigPath: string | null = null;

/**
 * Configure system-wide VPN using WireGuard
 */
export async function configureSystemVPN(config: WireGuardConfig): Promise<void> {
  // Use a consistent config path in home directory for better security
  const configPath = join(os.homedir(), '.nexushield.conf');
  activeConfigPath = configPath;
  
  try {
    // Check for sudo access first
    try {
      await execAsync('sudo -n true');
    } catch (error) {
      throw new Error('Sudo access required. Please run the following command in your terminal:\nsudo wg-quick up ' + configPath);
    }
    
    // Write WireGuard config to file with restricted permissions
    await writeFile(configPath, config.peer_config, 'utf-8');
    await chmod(configPath, 0o600); // Set permissions to user read/write only
    
    // Use sudo for wg-quick commands
    await execAsync(`sudo wg-quick up "${configPath}"`);
    
    // Verify connection by checking IP change
    const beforeIp = await getPublicIp();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for connection
    const afterIp = await getPublicIp();
    
    if (beforeIp === afterIp) {
      throw new Error('VPN connection failed - IP address did not change');
    }
  } catch (error) {
    console.error('Error configuring system VPN:', error);
    // Clean up config file on error
    try {
      if (activeConfigPath) {
        await execAsync(`sudo wg-quick down "${activeConfigPath}"`);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up VPN:', cleanupError);
    }
    activeConfigPath = null;
    throw error;
  }
}

/**
 * Remove system-wide VPN configuration
 */
export async function removeSystemVPN(): Promise<void> {
  if (!activeConfigPath) {
    console.warn('No active VPN configuration found');
    return;
  }
  
  try {
    // Use sudo for wg-quick commands
    await execAsync(`sudo wg-quick down "${activeConfigPath}"`);
    activeConfigPath = null;
  } catch (error) {
    console.error('Error removing system VPN:', error);
    throw error;
  }
}

/**
 * Get public IP address
 */
export async function getPublicIp(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting public IP:', error);
    throw error;
  }
} 