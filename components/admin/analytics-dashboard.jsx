"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  RefreshCw,
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
  useDashboardAnalytics,
  useRevenueChart,
  usePopularItems,
  useSalesByCategory,
  usePeakHours,
  useOrdersByDay,
  usePaymentMethodsAnalytics,
} from "@/hooks/useAnalytics";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function AnalyticsDashboard({ restaurantId = null }) {
  const [period, setPeriod] = useState("7days");

  // Fetch analytics data
  const {
    analytics,
    isValidating: analyticsValidating,
    mutate: mutateAnalytics,
  } = useDashboardAnalytics(restaurantId);
  const { revenueData, isValidating: revenueValidating } = useRevenueChart(
    restaurantId,
    period
  );
  const { popularItems } = usePopularItems(restaurantId, 5, period);
  const { salesByCategory } = useSalesByCategory(restaurantId, period);
  const { peakHours } = usePeakHours(restaurantId, period);
  const { ordersByDay } = useOrdersByDay(restaurantId, period);
  const { paymentMethods } = usePaymentMethodsAnalytics(restaurantId, period);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  // KPI Cards Data
  const kpiCards = [
    {
      title: "Today's Revenue",
      value: formatCurrency(analytics.todayRevenue),
      icon: DollarSign,
      trend: "+12.5%",
      trendUp: true,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Today's Orders",
      value: analytics.todayOrders || 0,
      icon: ShoppingCart,
      trend: "+8.3%",
      trendUp: true,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Orders",
      value: analytics.activeOrders || 0,
      icon: Clock,
      trend: "Live",
      trendUp: true,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Avg Order Value",
      value: formatCurrency(analytics.averageOrderValue),
      icon: TrendingUp,
      trend: "+5.2%",
      trendUp: true,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h2>
          <p className="text-gray-500 text-sm">
            Comprehensive business insights
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          <Button
            variant={period === "7days" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("7days")}
          >
            7 Days
          </Button>
          <Button
            variant={period === "30days" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("30days")}
          >
            30 Days
          </Button>
          <Button
            variant={period === "90days" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("90days")}
          >
            90 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => mutateAnalytics()}
            disabled={analyticsValidating}
          >
            <RefreshCw
              className={`h-4 w-4 ${analyticsValidating ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{kpi.title}</p>
                  <h3 className="text-2xl font-bold mt-2">{kpi.value}</h3>
                  <div className="flex items-center mt-2">
                    {kpi.trendUp ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span
                      className={`text-xs ${
                        kpi.trendUp ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {kpi.trend}
                    </span>
                  </div>
                </div>
                <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
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
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Items */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularItems}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity_sold" fill="#8884d8" name="Quantity" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Day */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Day of Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#ffc658" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) =>
                    `${entry.method}: ${entry.percentage?.toFixed(1)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
