/**
 * Analytics Hooks
 * SWR hooks for analytics data fetching
 */

import useSWR from "swr";
import {
  getDashboardAnalytics,
  getRevenueChart,
  getPopularItems,
  getSalesByCategory,
  getPeakHours,
  getOrdersByDay,
  getTableOccupancy,
  getOrderStatusAnalytics,
  getPaymentMethodsAnalytics,
  getCustomerAnalytics,
  getKitchenOrders,
  getOrderStatistics,
} from "@/lib/analytics-api";

// Dummy data as fallback
const dummyDashboardAnalytics = {
  todayOrders: 0,
  todayRevenue: 0,
  activeOrders: 0,
  averageOrderValue: 0,
  totalOrders: 0,
  totalRevenue: 0,
  tablesOccupied: 0,
  totalTables: 0,
};

const dummyRevenueData = [];
const dummyPopularItems = [];
const dummySalesByCategory = [];
const dummyPeakHours = [];
const dummyOrdersByDay = [];

/**
 * Hook for dashboard analytics
 */
export const useDashboardAnalytics = (
  restaurantId = null,
  refreshInterval = 0
) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    restaurantId
      ? ["dashboard-analytics", restaurantId]
      : ["dashboard-analytics"],
    () => getDashboardAnalytics(restaurantId),
    {
      refreshInterval,
      revalidateOnFocus: false,
      onError: (err) => {
        console.log("Dashboard analytics fetch failed, using fallback");
      },
    }
  );

  return {
    analytics: data?.data || dummyDashboardAnalytics,
    isLoading,
    isValidating,
    isError: error,
    mutate,
  };
};

/**
 * Hook for revenue chart data
 */
export const useRevenueChart = (
  restaurantId = null,
  period = "7days",
  refreshInterval = 0
) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ["revenue-chart", restaurantId, period],
    () => getRevenueChart(restaurantId, period),
    {
      refreshInterval,
      revalidateOnFocus: false,
      onError: (err) => {
        console.log("Revenue chart fetch failed");
      },
    }
  );

  return {
    revenueData: data?.data || dummyRevenueData,
    isLoading,
    isValidating,
    isError: error,
    mutate,
  };
};

/**
 * Hook for popular items
 */
export const usePopularItems = (
  restaurantId = null,
  limit = 10,
  period = "30days"
) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["popular-items", restaurantId, limit, period],
    () => getPopularItems(restaurantId, limit, period),
    {
      revalidateOnFocus: false,
      onError: (err) => {
        console.log("Popular items fetch failed");
      },
    }
  );

  return {
    popularItems: data?.data || dummyPopularItems,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook for sales by category
 */
export const useSalesByCategory = (restaurantId = null, period = "30days") => {
  const { data, error, isLoading, mutate } = useSWR(
    ["sales-by-category", restaurantId, period],
    () => getSalesByCategory(restaurantId, period),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    salesByCategory: data?.data || dummySalesByCategory,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook for peak hours
 */
export const usePeakHours = (restaurantId = null, period = "30days") => {
  const { data, error, isLoading, mutate } = useSWR(
    ["peak-hours", restaurantId, period],
    () => getPeakHours(restaurantId, period),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    peakHours: data?.data || dummyPeakHours,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook for orders by day
 */
export const useOrdersByDay = (restaurantId = null, period = "30days") => {
  const { data, error, isLoading, mutate } = useSWR(
    ["orders-by-day", restaurantId, period],
    () => getOrdersByDay(restaurantId, period),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    ordersByDay: data?.data || dummyOrdersByDay,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook for table occupancy
 */
export const useTableOccupancyAnalytics = (restaurantId = null) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["table-occupancy", restaurantId],
    () => getTableOccupancy(restaurantId),
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: false,
    }
  );

  return {
    tableOccupancy: data?.data || {},
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook for order status analytics
 */
export const useOrderStatusAnalytics = (
  restaurantId = null,
  period = "today"
) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["order-status-analytics", restaurantId, period],
    () => getOrderStatusAnalytics(restaurantId, period),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    orderStatus: data?.data || {},
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook for payment methods analytics
 */
export const usePaymentMethodsAnalytics = (
  restaurantId = null,
  period = "30days"
) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["payment-methods-analytics", restaurantId, period],
    () => getPaymentMethodsAnalytics(restaurantId, period),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    paymentMethods: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook for customer analytics
 */
export const useCustomerAnalytics = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "customer-analytics",
    () => getCustomerAnalytics(),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    customerAnalytics: data?.data || {},
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook for kitchen orders (real-time)
 */
export const useKitchenOrders = (
  restaurantId = null,
  refreshInterval = 5000
) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ["kitchen-orders", restaurantId],
    () => getKitchenOrders(restaurantId),
    {
      refreshInterval, // Refresh every 5 seconds for real-time updates
      revalidateOnFocus: true,
    }
  );

  return {
    kitchenOrders: data?.data || [],
    isLoading,
    isValidating,
    isError: error,
    mutate,
  };
};

/**
 * Hook for order statistics
 */
export const useOrderStatistics = (
  restaurantId = null,
  startDate = null,
  endDate = null
) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["order-statistics", restaurantId, startDate, endDate],
    () => getOrderStatistics(restaurantId, startDate, endDate),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    orderStatistics: data?.data || {},
    isLoading,
    isError: error,
    mutate,
  };
};
