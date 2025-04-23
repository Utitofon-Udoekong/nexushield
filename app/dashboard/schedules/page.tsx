import { ScheduleList } from "@/app/components/vpn/schedule-list"

export default function SchedulesPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">VPN Schedules</h1>
      <ScheduleList />
    </div>
  )
} 