"use client"

import { useEffect, useState } from "react"

interface CountdownProps {
  expiresAt: number
  variant?: "badge" | "text"
  className?: string
}

export function Countdown({ expiresAt, variant = "text", className = "" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now()
      const remaining = expiresAt - now

      if (remaining <= 0) {
        setTimeLeft("Expired")
        setIsExpired(true)
        return
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60))
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

      let timeString = ""
      if (hours > 0) {
        timeString += `${hours}h `
      }
      if (minutes > 0 || hours > 0) {
        timeString += `${minutes}m `
      }
      timeString += `${seconds}s`

      setTimeLeft(timeString.trim())
      setIsExpired(false)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  if (variant === "badge") {
    return (
      <span className={`px-2 py-1 rounded-full text-sm ${isExpired ? 'bg-destructive/10 text-destructive' : 'bg-muted'} ${className}`}>
        {isExpired ? "Expired" : `Expires in ${timeLeft}`}
      </span>
    )
  }

  return (
    <span className={className}>
      {isExpired ? "Expired" : timeLeft}
    </span>
  )
} 