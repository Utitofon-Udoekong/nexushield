import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Switch } from "@/app/components/ui/switch"
import { Plus, Clock } from "lucide-react"
import { toast } from "@/app/hooks/use-toast"
import { scheduleConnection } from "@/app/lib/tpn"
import { CountrySelector } from "@/app/components/vpn/country-selector"

interface ScheduleDialogProps {
  onScheduleCreated: () => void
  editSchedule?: {
    id: string
    country_code: string
    start_time: string
    end_time: string
    repeat: boolean
    repeat_days: number[]
  }
}

export function ScheduleDialog({ onScheduleCreated, editSchedule }: ScheduleDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string>()
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [repeat, setRepeat] = useState(false)
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedCountry || !startTime || !endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await scheduleConnection(
        selectedCountry!,
        startTime,
        endTime,
        repeat ? selectedDays : []
      )
      toast({
        title: "Success",
        description: "Schedule created successfully",
      })
      setOpen(false)
      onScheduleCreated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create schedule",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          {editSchedule ? (
            <Clock className="mr-2 h-4 w-4" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {editSchedule ? "Edit Schedule" : "New Schedule"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editSchedule ? "Edit VPN Schedule" : "Create VPN Schedule"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>VPN Location</Label>
            <CountrySelector
              onSelect={setSelectedCountry}
              currentCountry={selectedCountry}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Repeat</Label>
              <p className="text-sm text-muted-foreground">
                Schedule this connection to repeat
              </p>
            </div>
            <Switch
              checked={repeat}
              onCheckedChange={setRepeat}
            />
          </div>

          {repeat && (
            <div className="space-y-2">
              <Label>Repeat Days</Label>
              <Select
                value={selectedDays.join(",")}
                onValueChange={(value) =>
                  setSelectedDays(value.split(",").map(Number))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1,2,3,4,5">Weekdays</SelectItem>
                  <SelectItem value="0,6">Weekends</SelectItem>
                  <SelectItem value="0,1,2,3,4,5,6">Every Day</SelectItem>
                  <SelectItem value="1,3,5">Mon, Wed, Fri</SelectItem>
                  <SelectItem value="2,4">Tue, Thu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Schedule"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 