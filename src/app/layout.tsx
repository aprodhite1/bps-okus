import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from '@/context/AuthContext';

const outfit = Outfit({
  subsets: ["latin"],
});

// Komponen client di dalam file yang sama
function ClientProviders({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  "use client";
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth(); // ambil session di server

  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <AuthProvider><ThemeProvider>
          <ClientProviders session={session}>
            <SidebarProvider>{children}</SidebarProvider>
          </ClientProviders>
        </ThemeProvider>
        </AuthProvider>
        
      </body>
    </html>
  );
}
