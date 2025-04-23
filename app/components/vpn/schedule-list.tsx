import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Icon } from "@iconify/react"
import { getScheduledConnections, deleteScheduledConnection, VPNSchedule } from "@/app/lib/tpn"
import { toast } from "@/app/hooks/use-toast"
import { ScheduleDialog } from "@/app/components/vpn/schedule-dialog"
import { getCountryName } from "@/app/lib/utils"

export function ScheduleList() {
  const [schedules, setSchedules] = useState<VPNSchedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingSchedule, setEditingSchedule] = useState<VPNSchedule>()

  const loadSchedules = async () => {
    try {
      const data = await getScheduledConnections()
      setSchedules(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load schedules",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteScheduledConnection(id)
      toast({
        title: "Success",
        description: "Schedule deleted successfully",
      })
      loadSchedules()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete schedule",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    loadSchedules()
    const interval = setInterval(loadSchedules, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "completed":
        return "bg-blue-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRepeatDaysText = (days: number[]) => {
    if (days.length === 7) return "Every Day"
    if (days.length === 5 && days.includes(1) && days.includes(5)) return "Weekdays"
    if (days.length === 2 && days.includes(0) && days.includes(6)) return "Weekends"
    return days.map(day => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]).join(", ")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Scheduled Connections</h2>
        <ScheduleDialog onScheduleCreated={loadSchedules} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : schedules.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No schedules found. Create a new schedule to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:globe" className="size-4" />
                    {getCountryName(schedule.country_code)}
                  </div>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingSchedule(schedule)}
                  >
                    <Icon icon="lucide:edit" className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(schedule.id)}
                  >
                    <Icon icon="lucide:trash" className="size-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:clock" className="size-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(schedule.start_time).toLocaleTimeString()} -{" "}
                        {new Date(schedule.end_time).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${getStatusColor(
                          schedule.status
                        )}`}
                      />
                      <span className="text-sm capitalize">{schedule.status}</span>
                    </div>
                  </div>
                  {schedule.repeat && (
                    <div className="text-sm text-muted-foreground">
                      Repeats: {getRepeatDaysText(schedule.repeat_days)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingSchedule && (
        <ScheduleDialog
          editSchedule={editingSchedule}
          onScheduleCreated={() => {
            loadSchedules()
            setEditingSchedule(undefined)
          }}
        />
      )}
    </div>
  )
} 