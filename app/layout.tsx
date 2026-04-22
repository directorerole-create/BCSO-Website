import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
export const metadata: Metadata = {
  title: "BCSO | Blaine County Sheriff's Office",
  description: "Official portal for the Blaine County Sheriff's Office — Roster, Policies, and Staff Directory.",
  icons: { icon: "/BCSOBadge.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            {/* Offset content by sidebar width on desktop */}
            <main className="flex-1 min-w-0 md:ml-60 relative z-10">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
