import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { CommandPalette } from "@/components/ui/command-palette";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Flowstate — AI Meeting-to-Delivery OS",
  description:
    "Turn messy meetings into delivery-ready workspaces. Flowstate extracts decisions, assigns owners, detects risks, and builds your action board instantly.",
  keywords: ["meeting transcript", "AI workspace", "delivery board", "decision register", "action items"],
  openGraph: {
    title: "Flowstate — AI Meeting-to-Delivery OS",
    description:
      "Turn any meeting transcript into a live workspace with tasks, decisions, risks, and owners — in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[#07060F] text-[#F5F4FC]">
          {children}
          <CommandPalette />
        </body>
      </html>
    </ClerkProvider>
  );
}
