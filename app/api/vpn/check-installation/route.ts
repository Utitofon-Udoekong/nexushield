import { NextResponse } from "next/server";
import { exec } from 'child_process';
import { promisify } from 'util';


const execAsync = promisify(exec);
interface ExecError extends Error {
    code?: number;
    cmd?: string;
    killed?: boolean;
    signal?: string | null;
    stdout?: string;
    stderr?: string;
}
async function checkWireGuardInstallation(): Promise<boolean> {
    try {
        // Check for wg command
        await execAsync('which wg');

        // Check if we can use sudo without password for wg-quick
        try {
            await execAsync('sudo -n wg-quick');
            return true;
        } catch (error) {
            const execError = error as ExecError;
            if (execError.message?.includes('sudo')) {
                console.error('Sudo access required for VPN configuration. To enable passwordless sudo for WireGuard, run:\n' +
                    'sudo visudo -f /etc/sudoers.d/wireguard\n' +
                    'Then add the following line (replace USERNAME with your username):\n' +
                    'USERNAME ALL=(ALL) NOPASSWD: /usr/bin/wg-quick\n' +
                    'Save and exit (Ctrl+X, Y, Enter)');
                return false;
            }
            throw error;
        }
    } catch (error) {
        const execError = error as ExecError;
        if (execError.message?.includes('which')) {
            console.error('WireGuard not installed. Please install it with:\n' +
                'sudo apt-get install wireguard');
            return false;
        }
        console.error('Error checking WireGuard installation:', execError);
        return false;
    }
}

export async function GET() {
    try {
        const isInstalled = await checkWireGuardInstallation();
        return NextResponse.json({ isInstalled });
    } catch (error) {
        console.error("Error checking WireGuard installation:", error);
        return NextResponse.json(
            { error: "Failed to check WireGuard installation" },
            { status: 500 }
        );
    }
}