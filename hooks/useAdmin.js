/**
 * Custom Admin Hooks
 * SWR-based hooks for fetching and managing admin data
 */

import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { API_BASE_URL } from "@/lib/api";
import {
  getOrders,
  getRestaurants,
  getMenuItems,
  getCategories,
  getTables,
  getCustomers,
  getPayments,
  getStaff,
  getDashboardMetrics,
  getRevenueData,
  getTopSellingItems,
  getPaymentBreakdown,
  updateOrderStatus,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createTable,
  updateTable,
  deleteTable,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/admin-api";
import {
  dummyOrders,
  dummyTables,
  dummyMenuItems,
  dummyCategories,
  dummyRestaurants,
  dummyPayments,
  dummyCustomers,
  dummyRevenueData,
  dummyTopItems,
  dummyPaymentBreakdown,
} from "@/lib/dummy-data";

/**
 * Hook for fetching orders with real-time updates
 */
export const useOrders = (filters = {}, refreshInterval = 0) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    filters ? ["orders", JSON.stringify(filters)] : null,
    () => getOrders(filters),
    {
      refreshInterval,
      revalidateOnFocus: false,
      onError: (err) => {
        console.log("Orders fetch failed, using dummy data");
      },
    }
  );

  return {
    orders: data?.data && data.data.length > 0 ? data.data : dummyOrders,
    meta: data?.meta,
    isLoading,
    isValidating,
    isError: error,
    mutate,
  };
};

/**
 * Hook for fetching single order
 */
export const useOrder = (orderId) => {
  const { data, error, isLoading, mutate } = useSWR(
    orderId ? `${API_BASE_URL}/orders/${orderId}` : null,
    () => getOrderById(orderId)
  );

  return {
    order: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook for updating order status
 */
export const useUpdateOrderStatus = () => {
  const { trigger, isMutating } = useSWRMutation(
    "updateOrderStatus",
    async (key, { arg }) => {
      const { orderId, status } = arg;
      return updateOrderStatus(orderId, status);
    }
  );

  return { updateStatus: trigger, isUpdating: isMutating };
};

/**
 * Hook for fetching restaurants
 */
export const useRestaurants = (filters = {}) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["restaurants", JSON.stringify(filters)],
    () => getRestaurants(filters),
    {
      onError: (err) => {
        console.log("Restaurants fetch failed, using dummy data");
      },
    }
  );

  return {
    restaurants:
      data?.data && data.data.length > 0 ? data.data : dummyRestaurants,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook for fetching menu items
 */
export const useMenuItems = (filters = {}) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["menu-items", JSON.stringify(filters)],
    () => getMenuItems(filters),
    {
      onError: (err) => {
        console.log("Menu items fetch failed, using dummy data");
      },
    }
  );

  return {
    menuItems: data?.data && data.data.length > 0 ? data.data : dummyMenuItems,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook for menu item mutations
 */
export const useMenuItemMutations = () => {
  const { trigger: create, isMutating: isCreating } = useSWRMutation(
    "createMenuItem",
    async (key, { arg }) => createMenuItem(arg)
  );

  const { trigger: update, isMutating: isUpdating } = useSWRMutation(
    "updateMenuItem",
    async (key, { arg }) => {
      const { id, data } = arg;
      return updateMenuItem(id, data);
    }
  );

  const { trigger: remove, isMutating: isDeleting } = useSWRMutation(
    "deleteMenuItem",
    async (key, { arg }) => deleteMenuItem(arg)
  );

  return {
    createMenuItem: create,
    updateMenuItem: update,
    deleteMenuItem: remove,
    isCreating,
    isUpdating,
    isDeleting,
  };
};

/**
 * Hook for fetching categories
 */
export const useCategories = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "categories",
    getCategories,
    {
      onError: (err) => {
        console.log("Categories fetch failed, using dummy data");
      },
    }
  );

  return {
    categories:
      data?.data && data.data.length > 0 ? data.data : dummyCategories,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook for category mutations
 */
export const useCategoryMutations = () => {
  const { trigger: create, isMutating: isCreating } = useSWRMutation(
    "createCategory",
    async (key, { arg }) => createCategory(arg)
  );

  const { trigger: update, isMutating: isUpdating } = useSWRMutation(
    "updateCategory",
    async (key, { arg }) => {
      const { id, data } = arg;
      return updateCategory(id, data);
    }
  );

  const { trigger: remove, isMutating: isDeleting } = useSWRMutation(
    "deleteCategory",
    async (key, { arg }) => deleteCategory(arg)
  );

  return {
    createCategory: create,
    updateCategory: update,
    deleteCategory: remove,
    isCreating,
    isUpdating,
    isDeleting,
  };
};

/**
 * Hook for fetching tables
 */
export const useTables = (filters = {}, refreshInterval = 0) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["tables", JSON.stringify(filters)],
    () => getTables(filters),
    {
      refreshInterval,
      onError: (err) => {
        console.log("Tables fetch failed, using dummy data");
      },
    }
  );

  return {
    tables: data?.data && data.data.length > 0 ? data.data : dummyTables,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook for table mutations
 */
export const useTableMutations = () => {
  const { trigger: create, isMutating: isCreating } = useSWRMutation(
    "createTable",
    async (key, { arg }) => createTable(arg)
  );

  const { trigger: update, isMutating: isUpdating } = useSWRMutation(
    "updateTable",
    async (key, { arg }) => {
      const { id, data } = arg;
      return updateTable(id, data);
    }
  );

  const { trigger: remove, isMutating: isDeleting } = useSWRMutation(
    "deleteTable",
    async (key, { arg }) => deleteTable(arg)
  );

  return {
    createTable: create,
    updateTable: update,
    deleteTable: remove,
    isCreating,
    isUpdating,
    isDeleting,
  };
};

/**
 * Hook for fetching customers
 */
export const useCustomers = (filters = {}) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["customers", JSON.stringify(filters)],
    () => getCustomers(filters),
    {
      onError: (err) => {
        console.log("Customers fetch failed, using dummy data");
      },
    }
  );

  return {
    customers: data?.data && data.data.length > 0 ? data.data : dummyCustomers,
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook for fetching payments
 */
export const usePayments = (filters = {}) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["payments", JSON.stringify(filters)],
    () => getPayments(filters),
    {
      onError: (err) => {
        console.log("Payments fetch failed, using dummy data");
      },
    }
  );

  return {
    payments: data?.data && data.data.length > 0 ? data.data : dummyPayments,
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook for fetching staff
 */
export const useStaff = (filters = {}) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["staff", JSON.stringify(filters)],
    () => getStaff(filters)
  );

  return {
    staff: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook for fetching dashboard metrics
 */
export const useDashboardMetrics = (filters = {}) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ["dashboard-metrics", JSON.stringify(filters)],
    () => getDashboardMetrics(filters),
    {
      refreshInterval: 0, // Disabled auto-refresh
      revalidateOnFocus: false,
    }
  );

  return {
    metrics: data || {},
    isLoading,
    isValidating,
    isError: error,
    mutate,
  };
};

/**
 * Hook for fetching revenue data
 */
export const useRevenueData = (filters = {}) => {
  const { data, error, isLoading } = useSWR(
    ["revenue-data", JSON.stringify(filters)],
    () => getRevenueData(filters),
    {
      onError: (err) => {
        console.log("Revenue data fetch failed, using dummy data");
      },
    }
  );

  return {
    revenueData: data && data.length > 0 ? data : dummyRevenueData,
    isLoading,
    isError: error,
  };
};

/**
 * Hook for fetching top selling items
 */
export const useTopSellingItems = (filters = {}, limit = 10) => {
  const { data, error, isLoading } = useSWR(
    ["top-selling-items", JSON.stringify(filters), limit],
    () => getTopSellingItems(filters, limit),
    {
      onError: (err) => {
        console.log("Top selling items fetch failed, using dummy data");
      },
    }
  );

  return {
    topItems: data && data.length > 0 ? data : dummyTopItems.slice(0, limit),
    isLoading,
    isError: error,
  };
};

/**
 * Hook for fetching payment breakdown
 */
export const usePaymentBreakdown = (filters = {}) => {
  const { data, error, isLoading } = useSWR(
    ["payment-breakdown", JSON.stringify(filters)],
    () => getPaymentBreakdown(filters),
    {
      onError: (err) => {
        console.log("Payment breakdown fetch failed, using dummy data");
      },
    }
  );

  return {
    paymentBreakdown: data && data.length > 0 ? data : dummyPaymentBreakdown,
    isLoading,
    isError: error,
  };
};
