import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/components/providers/theme-provider";
import { Toaster } from "@/app/components/ui/toaster";
import { QueryProvider } from "@/app/components/providers/query-provider";
import { AuthProvider } from "@/app/components/providers/auth-provider";
import { VPNProvider } from "@/app/components/providers/vpn-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexusShield - Secure VPN Management",
  description: "Advanced VPN management platform powered by TPN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <VPNProvider>
                {children}
                <Toaster />
              </VPNProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
