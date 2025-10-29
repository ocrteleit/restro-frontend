import ModernAdminLayout from "@/components/layout/modern-admin-layout";

export const metadata = {
  title: "Restaurant Admin Panel",
  description: "Manage your restaurant operations",
};

export default function Layout({ children }) {
  return <ModernAdminLayout>{children}</ModernAdminLayout>;
}
