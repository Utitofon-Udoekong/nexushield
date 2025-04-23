import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { createClient } from "@/app/utils/supabase/client"
import { Lock } from "lucide-react"
import { redirect } from "next/navigation"

export default function ResetPasswordPage() {
  const updatePassword = async (formData: FormData) => {
    "use server"
    
    const password = formData.get("password") as string
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      return redirect("/auth/reset-password?error=" + error.message)
    }

    return redirect("/auth/login?message=Password updated successfully")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Set new password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        <form action={updatePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full">
            <Lock className="mr-2 h-4 w-4" />
            Update Password
          </Button>
        </form>
      </div>
    </div>
  )
} 