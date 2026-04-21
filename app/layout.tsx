import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { AmbientPoliceGlow } from "@/components/PoliceLightBar";

export const metadata: Metadata = {
  title: "Sheriff's Department | Roleplay Division",
  description: "Official portal for the Sheriff's Department Roleplay Division — Roster, Policies, and Staff Directory.",
  icons: { icon: "/favicon.ico" },
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
          <AmbientPoliceGlow />
          <Navbar />
          <main className="relative z-10">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
