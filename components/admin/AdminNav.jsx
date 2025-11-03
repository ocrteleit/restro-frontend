// Admin navigation bar as a client component, imports SignOutButton

"use client";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default function AdminNav() {
  return (
    <nav style={{ display: "flex", gap: 16, padding: 12, borderBottom: "1px solid #eee" }}>
      <Link href="/admin">Dashboard</Link>
      <Link href="/admin/analytics">Analytics</Link>
      <Link href="/admin/customers">Customers</Link>
      <SignOutButton />
    </nav>
  );
}
