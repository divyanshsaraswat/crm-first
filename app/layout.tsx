import type { Metadata } from "next";
import { Geist, Geist_Mono,Noto_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import AgentChat from "@/components/agentchat";
import { Toaster } from "@/components/ui/sonner"
import ClientLayoutWrapper from "@/components/clientlayoutwrapper";
import ParallaxOut from "@/components/scrollparticles";
const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConvertCRM - Transform Leads IntoLoyal Customers",
  description: "Customer Relation Management App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSans.variable} antialiased w-screen flex overflow-x-hidden flex-row justify-between`}
        
      >
          <ClientLayoutWrapper>
            {children}
              <AgentChat />
          </ClientLayoutWrapper>
          <ParallaxOut/>
          <Toaster/>
      </body>
    </html>
  );
}

