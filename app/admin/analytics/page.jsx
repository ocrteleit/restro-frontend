"use client";

import { useState, useMemo } from "react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useRevenueData,
  useTopSellingItems,
  usePaymentBreakdown,
  useOrders,
  useRestaurants,
} from "@/hooks/useAdmin";

const COLORS = [
  "#2196f3",
  "#4caf50",
  "#ff9800",
  "#f44336",
  "#9c27b0",
  "#00bcd4",
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("month");
  const [selectedRestaurant, setSelectedRestaurant] = useState("all");

  const { restaurants } = useRestaurants();

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
      case "quarter":
        startDate = format(startOfDay(subDays(now, 90)), "yyyy-MM-dd");
        endDate = format(endOfDay(now), "yyyy-MM-dd");
        break;
      default:
        startDate = null;
        endDate = null;
    }

    return {
      startDate,
      endDate,
      restaurantId: selectedRestaurant !== "all" ? selectedRestaurant : null,
    };
  }, [dateRange, selectedRestaurant]);

  const { revenueData, isLoading: revenueLoading } = useRevenueData(filters);
  const { topItems, isLoading: topItemsLoading } = useTopSellingItems(
    filters,
    10
  );
  const { paymentBreakdown, isLoading: paymentLoading } =
    usePaymentBreakdown(filters);
  const { orders } = useOrders(filters);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  // Calculate hourly distribution
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      orders: 0,
      revenue: 0,
    }));

    orders.forEach((order) => {
      const hour = new Date(order.attributes.createdAt).getHours();
      hours[hour].orders += 1;
    });

    return hours.map((h) => ({
      hour: `${h.hour}:00`,
      orders: h.orders,
    }));
  }, [orders]);

  // Calculate order status distribution
  const orderStatusData = useMemo(() => {
    const statusCount = orders.reduce((acc, order) => {
      const status = order.attributes.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
  }, [orders]);

  const isLoading = revenueLoading || topItemsLoading || paymentLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics & Reports
          </h1>
          <p className="text-gray-500 mt-1">
            Comprehensive business insights and trends
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select
            value={selectedRestaurant}
            onValueChange={setSelectedRestaurant}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Restaurants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Restaurants</SelectItem>
              {restaurants.map((restaurant) => (
                <SelectItem
                  key={restaurant.id}
                  value={restaurant.id.toString()}
                >
                  {restaurant.attributes.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
            7 Days
          </Button>
          <Button
            variant={dateRange === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("month")}
          >
            30 Days
          </Button>
          <Button
            variant={dateRange === "quarter" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("quarter")}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Daily revenue and order volume</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196f3" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2196f3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#2196f3"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#4caf50"
                strokeWidth={2}
                name="Orders"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
            <CardDescription>Best performing menu items</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topItems.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="quantity_sold"
                  fill="#2196f3"
                  name="Quantity Sold"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution by payment type</CardDescription>
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
                  outerRadius={100}
                  label={(entry) =>
                    `${entry.method}: ${entry.percentage.toFixed(1)}%`
                  }
                >
                  {paymentBreakdown.map((entry, index) => (
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

      {/* More Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Peak Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Order Hours</CardTitle>
            <CardDescription>Hourly order distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#ff9800" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Current order status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Selling Items</CardTitle>
          <CardDescription>Detailed performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    #
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Item
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Category
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Quantity
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold">{index + 1}</td>
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4 text-gray-600">{item.category}</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {item.quantity_sold}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {formatCurrency(item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
