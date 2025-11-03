"use client";
import ModernAdminLayout from "@/components/layout/modern-admin-layout";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }) {
  return (
    <SessionProvider>
      <ModernAdminLayout>{children}</ModernAdminLayout>
    </SessionProvider>
  );
}
