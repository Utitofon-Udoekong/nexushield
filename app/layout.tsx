import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/components/providers/theme-provider";
import { Toaster } from "@/app/components/ui/toaster";
import { QueryProvider } from "@/app/components/providers/query-provider";
import { VPNProvider } from "./contexts/vpn-context";
import { cn } from "@/app/lib/utils";

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
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <VPNProvider>
              <Toaster />
              {children}
            </VPNProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
