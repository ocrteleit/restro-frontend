// "use client" sign out button for admin nav and user menu (styled, configurable)

"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignOutButton({ className = "", children }) {
  return (
    <Button
      variant="ghost"
      className={className}
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      {children || "Logout"}
    </Button>
  );
}
