import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatBytes, formatLatency } from "@/app/lib/utils";

interface MetricsChartProps {
  data: Array<{
    timestamp: string;
    download_speed: number;
    upload_speed: number;
    latency: number;
    packet_loss: number;
  }>;
  type: "speed" | "latency" | "packet-loss";
}

export function MetricsChart({ data, type }: MetricsChartProps) {
  const formatData = data.map((item) => ({
    ...item,
    timestamp: new Date(item.timestamp).toLocaleTimeString(),
  }));

  const renderChart = () => {
    switch (type) {
      case "speed":
        return (
          <>
            <Line
              type="monotone"
              dataKey="download_speed"
              stroke="#8884d8"
              name="Download Speed"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="upload_speed"
              stroke="#82ca9d"
              name="Upload Speed"
              dot={false}
            />
          </>
        );
      case "latency":
        return (
          <Line
            type="monotone"
            dataKey="latency"
            stroke="#ffc658"
            name="Latency"
            dot={false}
          />
        );
      case "packet-loss":
        return (
          <Line
            type="monotone"
            dataKey="packet_loss"
            stroke="#ff7300"
            name="Packet Loss"
            dot={false}
          />
        );
    }
  };

  const formatYAxis = (value: number) => {
    switch (type) {
      case "speed":
        return formatBytes(value);
      case "latency":
        return formatLatency(value);
      case "packet-loss":
        return `${value}%`;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formatData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis tickFormatter={formatYAxis} />
        <Tooltip
          formatter={(value: number) => {
            switch (type) {
              case "speed":
                return formatBytes(value);
              case "latency":
                return formatLatency(value);
              case "packet-loss":
                return `${value}%`;
            }
          }}
        />
        {renderChart()}
      </LineChart>
    </ResponsiveContainer>
  );
} 