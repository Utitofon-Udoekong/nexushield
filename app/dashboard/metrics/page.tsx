import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { formatBytes, formatDuration, formatLatency } from "@/app/lib/utils";
import { getConnectionMetrics } from "@/app/lib/tpn";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import { MetricsChart } from "@/app/components/metrics-chart";
import { useEffect, useState } from "react";
import { useToast } from "@/app/hooks/use-toast";

interface MetricsData {
  current: {
    download_speed: number;
    upload_speed: number;
    latency: number;
    packet_loss: number;
  };
  historical: Array<{
    timestamp: string;
    download_speed: number;
    upload_speed: number;
    latency: number;
    packet_loss: number;
  }>;
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/vpn/metrics");
        if (!response.ok) {
          throw new Error("Failed to fetch metrics");
        }
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch metrics data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [toast]);

  if (isLoading) {
    return <div className="p-4">Loading metrics...</div>;
  }

  if (!metrics) {
    return <div className="p-4">No metrics data available</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Performance Metrics
          </h1>
        </div>

        {/* Real-time Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Download Speed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatBytes(metrics?.current?.download_speed || 0)}/s
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Current speed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upload Speed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatBytes(metrics?.current?.upload_speed || 0)}/s
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Current speed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatLatency(metrics?.current?.latency || 0)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Current latency
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Packet Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics?.current?.packet_loss || 0}%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Current loss
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Historical Data */}
        <Tabs defaultValue="speed" className="space-y-4">
          <TabsList>
            <TabsTrigger value="speed">Speed History</TabsTrigger>
            <TabsTrigger value="latency">Latency History</TabsTrigger>
            <TabsTrigger value="packet-loss">Packet Loss History</TabsTrigger>
          </TabsList>
          <TabsContent value="speed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Speed Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricsChart data={metrics.historical} type="speed" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="latency" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Latency Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricsChart data={metrics.historical} type="latency" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="packet-loss" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Packet Loss Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricsChart data={metrics.historical} type="packet-loss" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Connection History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.historical?.slice(0, 5).map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(metric.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Download: {formatBytes(metric.download_speed)}/s
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      Latency: {formatLatency(metric.latency)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Packet Loss: {metric.packet_loss}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 