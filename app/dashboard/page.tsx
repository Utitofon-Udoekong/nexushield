import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { Button } from "@/app/components/ui/button";
import { Globe, Power, Clock } from "lucide-react";
import { getVPNStatus, VPNConnection } from "@/app/lib/tpn";
import { createClient } from "@/app/utils/supabase/client";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const vpnStatus: VPNConnection | null = await getVPNStatus();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Schedule VPN
            </Button>
            <Button variant="outline" size="sm">
              <Globe className="mr-2 h-4 w-4" />
              Change Location
            </Button>
            <Button
              variant={vpnStatus?.connected ? "destructive" : "default"}
              size="sm"
            >
              <Power className="mr-2 h-4 w-4" />
              {vpnStatus?.connected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        </div>

        {/* VPN Status Card */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                VPN Status
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {vpnStatus?.connected
                  ? `Connected to ${vpnStatus.country_code}`
                  : "Not connected"}
              </p>
            </div>
            <div className="flex items-center">
              <div
                className={`h-3 w-3 rounded-full ${
                  vpnStatus?.connected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                {vpnStatus?.connected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>

          {vpnStatus?.connected && (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Download Speed
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {vpnStatus.download_speed} Mbps
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Latency
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {vpnStatus.latency} ms
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Data Used
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {vpnStatus.data_used} MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Connections
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View your recent VPN connections
            </p>
            <Button variant="link" className="mt-4">
              View History
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Scheduled Connections
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your scheduled VPN connections
            </p>
            <Button variant="link" className="mt-4">
              View Schedules
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Performance Metrics
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View detailed performance analytics
            </p>
            <Button variant="link" className="mt-4">
              View Metrics
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 