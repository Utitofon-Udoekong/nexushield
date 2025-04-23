import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { Globe, Search } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { getAvailableCountries } from "@/app/lib/tpn"
import { toast } from "@/app/hooks/use-toast"
import { cn } from "@/app/lib/utils"

interface CountrySelectorProps {
  onSelect: (countryCode: string) => void
  currentCountry?: string
}

interface Country {
  code: string
  name: string
}

export function CountrySelector({ onSelect, currentCountry }: CountrySelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadCountries = async () => {
    setIsLoading(true)
    try {
      const countryCodes = await getAvailableCountries()
      const countriesList: Country[] = countryCodes.map(code => ({
        code,
        name: getCountryName(code)
      }))
      setCountries(countriesList)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load available countries",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => loadCountries()}>
          <Globe className="mr-2 h-4 w-4" />
          Change Location
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select VPN Location</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search countries..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid gap-2">
                {filteredCountries.map((country) => (
                  <Button
                    key={country.code}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      currentCountry === country.code && "bg-muted"
                    )}
                    onClick={() => {
                      onSelect(country.code)
                      setOpen(false)
                    }}
                  >
                    <span className="mr-2">{getCountryFlag(country.code)}</span>
                    {country.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function getCountryFlag(countryCode: string) {
  return String.fromCodePoint(
    ...countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0))
  )
}

function getCountryName(countryCode: string): string {
  try {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
    return regionNames.of(countryCode.toUpperCase()) || countryCode
  } catch {
    return countryCode
  }
} 