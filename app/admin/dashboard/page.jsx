"use client";

import { useState, useMemo } from "react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useDashboardMetrics,
  useRevenueData,
  useTopSellingItems,
  usePaymentBreakdown,
  useRestaurants,
} from "@/hooks/useAdmin";
import { useSession } from "next-auth/react";

// ✨ Using GLOBAL CSS VARIABLES - Change colors in app/globals.css
const COLORS = {
  created: "var(--status-pending)",
  accepted: "var(--status-confirmed)",
  preparing: "var(--status-preparing)",
  ready: "var(--status-ready)",
  served: "var(--muted-foreground)",
  completed: "var(--status-completed)",
  cancelled: "var(--status-cancelled)",
  rejected: "var(--destructive)",
};

const PAYMENT_COLORS = {
  cash: "var(--status-ready)",      // Green
  card: "var(--status-confirmed)",  // Blue
  online: "var(--status-preparing)", // Purple
  upi: "var(--status-pending)",     // Yellow/Orange
};

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("today");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const { data: session } = useSession();
  console.log("session", session);
  // Calculate date filters
  const filters = useMemo(() => {
    const now = new Date();
    let startDate, endDate;

    switch (dateRange) {
      case "today":
        startDate = format(startOfDay(now), "yyyy-MM-dd");
        endDate = format(endOfDay(now), "yyyy-MM-dd");
        break;
      case "week":
        startDate = format(startOfDay(subDays(now, 7)), "yyyy-MM-dd");
        endDate = format(endOfDay(now), "yyyy-MM-dd");
        break;
      case "month":
        startDate = format(startOfDay(subDays(now, 30)), "yyyy-MM-dd");
        endDate = format(endOfDay(now), "yyyy-MM-dd");
        break;
      default:
        startDate = null;
        endDate = null;
    }

    return {
      startDate,
      endDate,
      restaurantId: selectedRestaurant,
    };
  }, [dateRange, selectedRestaurant]);

  const {
    metrics,
    isLoading: metricsLoading,
    isValidating: metricsValidating,
    mutate: mutateMetrics,
  } = useDashboardMetrics(filters);

  console.log(metrics);
  console.log(metricsLoading);
  const { revenueData, isLoading: revenueLoading } = useRevenueData(filters);
  const { topItems, isLoading: topItemsLoading } = useTopSellingItems(
    filters,
    5
  );
  const { paymentBreakdown, isLoading: paymentLoading } =
    usePaymentBreakdown(filters);
  const { restaurants } = useRestaurants();

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  // KPI Cards
  const kpiCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(metrics.totalRevenue),
      icon: DollarSign,
      color: "text-[var(--status-ready)]",
      bgColor: "bg-[var(--success-light)]",
      trend: "+12.5%",
    },
    {
      title: "Total Orders",
      value: metrics.totalOrders || 0,
      icon: ShoppingBag,
      color: "text-[var(--status-confirmed)]",
      bgColor: "bg-secondary",
      trend: "+8.2%",
    },
    {
      title: "Average Order Value",
      value: formatCurrency(metrics.averageOrderValue),
      icon: TrendingUp,
      color: "text-[var(--status-preparing)]",
      bgColor: "bg-[var(--status-preparing)]/10",
      trend: "+5.1%",
    },
    {
      title: "Active Tables",
      value: `${metrics.activeTables || 0}/${metrics.totalTables || 0}`,
      icon: Users,
      color: "text-[var(--status-pending)]",
      bgColor: "bg-[var(--status-pending)]/10",
    },
  ];

  // ✨ Using GLOBAL CSS VARIABLES - Change colors in app/globals.css
  const orderStatusCards = [
    {
      title: "Pending",
      value: metrics.pendingOrders || 0,
      icon: Clock,
      color: "text-[var(--status-pending)]",
      bgColor: "bg-[var(--status-pending)]/10",
    },
    {
      title: "Preparing",
      value: metrics.preparingOrders || 0,
      icon: AlertCircle,
      color: "text-[var(--status-preparing)]",
      bgColor: "bg-[var(--status-preparing)]/10",
    },
    {
      title: "Completed",
      value: metrics.completedOrders || 0,
      icon: CheckCircle,
      color: "text-[var(--status-completed)]",
      bgColor: "bg-[var(--status-completed)]/10",
    },
    {
      title: "Cancelled",
      value: metrics.cancelledOrders || 0,
      icon: XCircle,
      color: "text-[var(--status-cancelled)]",
      bgColor: "bg-[var(--status-cancelled)]/10",
    },
  ];

  // if (metricsLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-96">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            {metricsValidating && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Refreshing...</span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => mutateMetrics()}
            disabled={metricsValidating}
          >
            Refresh Data
          </Button>
          <Button
            variant={dateRange === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("today")}
          >
            Today
          </Button>
          <Button
            variant={dateRange === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("week")}
          >
            Last 7 Days
          </Button>
          <Button
            variant={dateRange === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("month")}
          >
            Last 30 Days
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                {card.trend && (
                  <p className="text-xs text-[var(--status-ready)] mt-1">
                    {card.trend} from last period
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Order Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {orderStatusCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Daily revenue for selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2196f3"
                  strokeWidth={2}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Payment distribution by method</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentBreakdown}
                  dataKey="amount"
                  nameKey="method"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) =>
                    `${entry.method}: ${entry.percentage.toFixed(1)}%`
                  }
                >
                  {paymentBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PAYMENT_COLORS[entry.method] || "#999"}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Items */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Items</CardTitle>
          <CardDescription>Most popular menu items</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topItems}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="quantity_sold"
                fill="#2196f3"
                name="Quantity Sold"
              />
              <Bar
                yAxisId="right"
                dataKey="revenue"
                fill="#4caf50"
                name="Revenue"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Items Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topItems.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {item.quantity_sold} sold
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(item.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
