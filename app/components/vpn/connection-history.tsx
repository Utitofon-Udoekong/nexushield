import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatSpeed, formatLatency } from "@/app/lib/utils"

interface HistoryData {
  timestamp: string
  downloadSpeed: number
  uploadSpeed: number
  latency: number
  packetLoss: number
}

interface ConnectionHistoryProps {
  data: HistoryData[]
  type: "speed" | "latency" | "packetLoss"
}

export function ConnectionHistory({ data, type }: ConnectionHistoryProps) {
  const formatXAxis = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const getYAxisLabel = () => {
    switch (type) {
      case "speed":
        return "Speed (Mbps)"
      case "latency":
        return "Latency (ms)"
      case "packetLoss":
        return "Packet Loss (%)"
    }
  }

  const getDataKey = () => {
    switch (type) {
      case "speed":
        return "downloadSpeed"
      case "latency":
        return "latency"
      case "packetLoss":
        return "packetLoss"
    }
  }

  const formatTooltip = (value: number) => {
    switch (type) {
      case "speed":
        return formatSpeed(value)
      case "latency":
        return formatLatency(value)
      case "packetLoss":
        return `${value.toFixed(1)}%`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          {type === "speed" && "Connection Speed"}
          {type === "latency" && "Latency History"}
          {type === "packetLoss" && "Packet Loss"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                label={{ value: getYAxisLabel(), angle: -90, position: "insideLeft" }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => [formatTooltip(value), getYAxisLabel()]}
                labelFormatter={(label) => `Time: ${formatXAxis(label)}`}
              />
              <Line
                type="monotone"
                dataKey={getDataKey()}
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 