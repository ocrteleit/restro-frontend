"use client";

import { useState, useMemo } from "react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import {
  Download,
  CreditCard,
  Banknote,
  Smartphone,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePayments } from "@/hooks/useAdmin";
import { toast } from "react-hot-toast";

const paymentMethodConfig = {
  cash: {
    label: "Cash",
    icon: Banknote,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  card: {
    label: "Card",
    icon: CreditCard,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  online: {
    label: "Online",
    icon: Smartphone,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  upi: {
    label: "UPI",
    icon: DollarSign,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
};

const statusConfig = {
  paid: { label: "Paid", color: "bg-green-500", textColor: "text-green-600" },
  pending: {
    label: "Pending",
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
  },
  failed: { label: "Failed", color: "bg-red-500", textColor: "text-red-600" },
  refunded: {
    label: "Refunded",
    color: "bg-gray-500",
    textColor: "text-gray-600",
  },
};

export default function BillingPage() {
  const [dateRange, setDateRange] = useState("today");

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

    return { startDate, endDate };
  }, [dateRange]);

  const { payments, isLoading, meta } = usePayments(filters);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRevenue = payments.reduce(
      (sum, payment) => sum + (parseFloat(payment.attributes.amount) || 0),
      0
    );

    const paymentsByMethod = payments.reduce((acc, payment) => {
      const method = payment.attributes.payment_method;
      if (!acc[method]) {
        acc[method] = { count: 0, amount: 0 };
      }
      acc[method].count += 1;
      acc[method].amount += parseFloat(payment.attributes.amount) || 0;
      return acc;
    }, {});

    const paymentsByStatus = payments.reduce((acc, payment) => {
      const status = payment.attributes.payment_status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalRevenue,
      totalTransactions: payments.length,
      averageTransaction:
        payments.length > 0 ? totalRevenue / payments.length : 0,
      paymentsByMethod,
      paymentsByStatus,
    };
  }, [payments]);

  const exportToCSV = () => {
    const csvData = payments.map((payment) => ({
      "Transaction ID": payment.attributes.transaction_id || payment.id,
      Date: format(
        new Date(payment.attributes.payment_date),
        "yyyy-MM-dd HH:mm"
      ),
      Amount: payment.attributes.amount,
      Method: payment.attributes.payment_method,
      Status: payment.attributes.payment_status,
      "Order Number":
        payment.attributes.order?.data?.attributes?.order_number || "N/A",
    }));

    const headers = Object.keys(csvData[0]).join(",");
    const rows = csvData.map((row) => Object.values(row).join(","));
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `billing-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("Report exported successfully");
  };

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
            Billing & Payments
          </h1>
          <p className="text-gray-500 mt-1">Track payments and revenue</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={payments.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="flex gap-2">
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalTransactions} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.averageTransaction)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(stats.paymentsByMethod).map(([method, data]) => {
          const config =
            paymentMethodConfig[method] || paymentMethodConfig.cash;
          const Icon = config.icon;
          return (
            <Card key={method}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {config.label}
                </CardTitle>
                <div className={`p-2 rounded-lg ${config.bgColor}`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(data.amount)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {data.count} transactions
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Transaction ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Order
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Method
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => {
                    const attrs = payment.attributes;
                    const method =
                      paymentMethodConfig[attrs.payment_method] ||
                      paymentMethodConfig.cash;
                    const status =
                      statusConfig[attrs.payment_status] ||
                      statusConfig.pending;

                    return (
                      <tr
                        key={payment.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          {format(
                            new Date(attrs.payment_date),
                            "MMM dd, yyyy HH:mm"
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">
                          {attrs.transaction_id || `TXN-${payment.id}`}
                        </td>
                        <td className="py-3 px-4">
                          {attrs.order?.data?.attributes?.order_number || "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{method.label}</Badge>
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          {formatCurrency(attrs.amount)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={`${status.color} text-white`}>
                            {status.label}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
