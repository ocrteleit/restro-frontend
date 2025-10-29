"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  Table,
  CreditCard,
  BarChart3,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ChefHat,
  TrendingUp,
  Bell,
  Search,
  Sun,
  Moon,
  ChevronLeft,
  User,
  UserCircle,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import { removeAuthToken } from "@/lib/admin-api";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
    badge: "12",
  },
  {
    name: "Kitchen Display",
    href: "/admin/kitchen",
    icon: ChefHat,
  },
  {
    name: "Restaurants",
    href: "/admin/restaurants",
    icon: Store,
  },
  {
    name: "Menu Items",
    href: "/admin/menu",
    icon: UtensilsCrossed,
  },
  {
    name: "Tables",
    href: "/admin/tables",
    icon: Table,
  },
  {
    name: "Billing",
    href: "/admin/billing",
    icon: CreditCard,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Enhanced Analytics",
    href: "/admin/analytics-enhanced",
    icon: TrendingUp,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

const notifications = [
  {
    id: 1,
    title: "New Order #1234",
    message: "Table 5 placed an order",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Payment Received",
    message: "₹2,500 from Order #1233",
    time: "5m ago",
    unread: true,
  },
  {
    id: 3,
    title: "Low Stock Alert",
    message: "Chicken Biryani running low",
    time: "10m ago",
    unread: false,
  },
];

export default function ModernAdminLayout({ children }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const {
    isCollapsed,
    isMobileOpen,
    toggleCollapsed,
    setMobileOpen,
    closeMobile,
  } = useSidebarStore();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    removeAuthToken();
    window.location.href = "/admin/login";
  };

  // Get breadcrumb from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => ({
    label:
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
    href: "/" + pathSegments.slice(0, index + 1).join("/"),
    isLast: index === pathSegments.length - 1,
  }));

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center border-b px-4",
          isCollapsed && !isMobile ? "justify-center" : "justify-between"
        )}
      >
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Store className="w-5 h-5 text-white" />
          </div>
          {(!isCollapsed || isMobile) && (
            <motion.span
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              RestroAdmin
            </motion.span>
          )}
        </motion.div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={closeMobile}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <TooltipProvider delayDuration={0}>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            const navButton = (
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50"
                    : "hover:bg-accent",
                  isCollapsed && !isMobile
                    ? "justify-center px-2"
                    : "justify-start"
                )}
                asChild
              >
                <Link
                  href={item.href}
                  onClick={() => isMobile && closeMobile()}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isCollapsed && !isMobile ? "" : "mr-3"
                    )}
                  />
                  {(!isCollapsed || isMobile) && (
                    <span className="flex-1 text-left">{item.name}</span>
                  )}
                  {(!isCollapsed || isMobile) && item.badge && (
                    <Badge variant="destructive" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </Button>
            );

            return isCollapsed && !isMobile ? (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div key={item.name}>{navButton}</div>
            );
          })}
        </TooltipProvider>
      </nav>

      {/* User section */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut
            className={cn("h-5 w-5", isCollapsed && !isMobile ? "" : "mr-3")}
          />
          {(!isCollapsed || isMobile) && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 z-50 hidden border-r bg-card transition-all duration-300 lg:block",
            isCollapsed ? "w-16" : "w-64"
          )}
        >
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent isMobile />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <div
          className={cn(
            "transition-all duration-300",
            isCollapsed ? "lg:pl-16" : "lg:pl-64"
          )}
        >
          {/* Top Navbar */}
          <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="flex h-16 items-center gap-4 px-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Desktop Collapse Button */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex"
                onClick={toggleCollapsed}
              >
                <ChevronLeft
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isCollapsed && "rotate-180"
                  )}
                />
              </Button>

              {/* Breadcrumb */}
              <Breadcrumb className="hidden md:block">
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {crumb.isLast ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={crumb.href}>
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex-1" />

              {/* Search */}
              <div className="hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-[200px] pl-8 lg:w-[300px]"
                    onFocus={() => setSearchOpen(true)}
                  />
                </div>
              </div>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <Separator />
                  {notifications.map((notif) => (
                    <DropdownMenuItem
                      key={notif.id}
                      className="flex flex-col items-start p-3 cursor-pointer"
                    >
                      <div className="flex items-start w-full gap-2">
                        {notif.unread && (
                          <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {notif.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <Separator />
                  <DropdownMenuItem className="justify-center text-blue-600 font-medium">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
                      <AvatarImage src="/avatars/admin.png" alt="Admin" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        AD
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Admin User
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        admin@restaurant.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <Separator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help</span>
                  </DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content with animation */}
          <main className="p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
