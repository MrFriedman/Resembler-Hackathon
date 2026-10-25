import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import HackathonBanner from "@/components/HackathonBanner";
import Menu from "@/components/navigation/Menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Accident Data Platform",
  description: "Capturing, analyzing, and distributing accident data with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col overflow-x-hidden bg-gray-900 text-white">
          <HackathonBanner />
          <AuthProvider>
            <Menu />
            <main className="flex-grow container mt-8">{children}</main>
            <footer className="text-center p-4 text-gray-400">
              © {new Date().getFullYear()} Resemble AI & The Keyboard Smashers - All rights reserved. (Dylan Friedman, Conor Mckeage, CC Cohen)
            </footer>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
