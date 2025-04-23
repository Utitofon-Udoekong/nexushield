"use client"

import { cn } from "@/app/lib/utils"

interface StatusIndicatorProps {
  status: "connected" | "disconnected" | "connecting" | "error"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function StatusIndicator({ 
  status, 
  size = "md", 
  className 
}: StatusIndicatorProps) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4"
  }

  const statusClasses = {
    connected: "bg-green-500",
    disconnected: "bg-gray-400",
    connecting: "bg-yellow-500 animate-pulse",
    error: "bg-red-500"
  }

  return (
    <div className="flex items-center space-x-2">
      <div
        className={cn(
          "rounded-full",
          sizeClasses[size],
          statusClasses[status],
          className
        )}
      />
      <span className="text-sm capitalize">{status}</span>
    </div>
  )
} 