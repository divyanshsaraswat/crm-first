// app/ClientLayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { ReactNode } from "react";

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register");

  return (
    <>
      {!hideSidebar && <Sidebar />}
      {children}
    </>
  );
}
