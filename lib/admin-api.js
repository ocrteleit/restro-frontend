/**
 * Admin API Service
 * Handles all admin panel API interactions with authentication
 */

import { API_BASE_URL } from "./api";
import { apiCall } from "./swr-config";

/**
 * Get auth token from localStorage
 */
export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
};

/**
 * Set auth token in localStorage
 */
export const setAuthToken = (token) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("admin_token", token);
};

/**
 * Remove auth token from localStorage
 */
export const removeAuthToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("admin_token");
};

/**
 * Get authorization headers
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Authenticated API call wrapper
 */
export const authenticatedApiCall = async (
  url,
  method = "GET",
  data = null
) => {
  const headers = {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  };

  return apiCall(url, method, data, headers);
};

// ============================================
// ORDERS API
// ============================================

/**
 * Get all orders with filters
 */
export const getOrders = async (filters = {}) => {
  let url = `${API_BASE_URL}/orders?populate=deep&sort=createdAt:desc`;

  if (filters.status) {
    url += `&filters[status][$eq]=${filters.status}`;
  }
  if (filters.restaurantId) {
    url += `&filters[restaurant][id][$eq]=${filters.restaurantId}`;
  }
  if (filters.startDate) {
    url += `&filters[createdAt][$gte]=${filters.startDate}`;
  }
  if (filters.endDate) {
    url += `&filters[createdAt][$lte]=${filters.endDate}`;
  }
  if (filters.page) {
    url += `&pagination[page]=${filters.page}&pagination[pageSize]=${
      filters.pageSize || 25
    }`;
  }

  return authenticatedApiCall(url);
};

/**
 * Get single order by ID
 */
export const getOrderById = async (orderId) => {
  return authenticatedApiCall(
    `${API_BASE_URL}/orders/${orderId}?populate=deep`
  );
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId, status) => {
  return authenticatedApiCall(`${API_BASE_URL}/orders/${orderId}`, "PUT", {
    data: { status },
  });
};

/**
 * Delete order
 */
export const deleteOrder = async (orderId) => {
  return authenticatedApiCall(`${API_BASE_URL}/orders/${orderId}`, "DELETE");
};

// ============================================
// RESTAURANTS API
// ============================================

/**
 * Get all restaurants
 */
export const getRestaurants = async (filters = {}) => {
  let url = `${API_BASE_URL}/restaurants?populate=deep`;

  if (filters.status) {
    url += `&filters[status][$eq]=${filters.status}`;
  }

  return authenticatedApiCall(url);
};

/**
 * Get single restaurant
 */
export const getRestaurantById = async (restaurantId) => {
  return authenticatedApiCall(
    `${API_BASE_URL}/restaurants/${restaurantId}?populate=deep`
  );
};

/**
 * Create restaurant
 */
export const createRestaurant = async (data) => {
  return authenticatedApiCall(`${API_BASE_URL}/restaurants`, "POST", { data });
};

/**
 * Update restaurant
 */
export const updateRestaurant = async (restaurantId, data) => {
  return authenticatedApiCall(
    `${API_BASE_URL}/restaurants/${restaurantId}`,
    "PUT",
    { data }
  );
};

/**
 * Delete restaurant
 */
export const deleteRestaurant = async (restaurantId) => {
  return authenticatedApiCall(
    `${API_BASE_URL}/restaurants/${restaurantId}`,
    "DELETE"
  );
};

// ============================================
// MENU ITEMS API
// ============================================

/**
 * Get all menu items
 */
export const getMenuItems = async (filters = {}) => {
  let url = `${API_BASE_URL}/menu-items?populate=*`;

  if (filters.restaurantId) {
    url += `&filters[restaurant][id][$eq]=${filters.restaurantId}`;
  }
  if (filters.categoryId) {
    url += `&filters[category][id][$eq]=${filters.categoryId}`;
  }
  if (filters.isAvailable !== undefined) {
    url += `&filters[is_available][$eq]=${filters.isAvailable}`;
  }

  return authenticatedApiCall(url);
};

/**
 * Create menu item
 */
export const createMenuItem = async (data) => {
  return authenticatedApiCall(`${API_BASE_URL}/menu-items`, "POST", { data });
};

/**
 * Update menu item
 */
export const updateMenuItem = async (menuItemId, data) => {
  return authenticatedApiCall(
    `${API_BASE_URL}/menu-items/${menuItemId}`,
    "PUT",
    { data }
  );
};

/**
 * Delete menu item
 */
export const deleteMenuItem = async (menuItemId) => {
  return authenticatedApiCall(
    `${API_BASE_URL}/menu-items/${menuItemId}`,
    "DELETE"
  );
};

/**
 * Upload image
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("files", file);

  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) throw new Error("Upload failed");
  return response.json();
};

// ============================================
// CATEGORIES API
// ============================================

/**
 * Get all categories
 */
export const getCategories = async () => {
  return authenticatedApiCall(`${API_BASE_URL}/categories?populate=*`);
};

/**
 * Create category
 */
export const createCategory = async (data) => {
  return authenticatedApiCall(`${API_BASE_URL}/categories`, "POST", { data });
};

/**
 * Update category
 */
export const updateCategory = async (categoryId, data) => {
  return authenticatedApiCall(
    `${API_BASE_URL}/categories/${categoryId}`,
    "PUT",
    { data }
  );
};

/**
 * Delete category
 */
export const deleteCategory = async (categoryId) => {
  return authenticatedApiCall(
    `${API_BASE_URL}/categories/${categoryId}`,
    "DELETE"
  );
};

// ============================================
// TABLES API
// ============================================

/**
 * Get all tables
 */
export const getTables = async (filters = {}) => {
  let url = `${API_BASE_URL}/tables?populate=*`;

  if (filters.restaurantId) {
    url += `&filters[restaurant][id][$eq]=${filters.restaurantId}`;
  }
  if (filters.status) {
    url += `&filters[status][$eq]=${filters.status}`;
  }

  return authenticatedApiCall(url);
};

/**
 * Create table
 */
export const createTable = async (data) => {
  return authenticatedApiCall(`${API_BASE_URL}/tables`, "POST", { data });
};

/**
 * Update table
 */
export const updateTable = async (tableId, data) => {
  return authenticatedApiCall(`${API_BASE_URL}/tables/${tableId}`, "PUT", {
    data,
  });
};

/**
 * Delete table
 */
export const deleteTable = async (tableId) => {
  return authenticatedApiCall(`${API_BASE_URL}/tables/${tableId}`, "DELETE");
};

// ============================================
// CUSTOMERS API
// ============================================

/**
 * Get all customers
 */
export const getCustomers = async (filters = {}) => {
  let url = `${API_BASE_URL}/customers?populate=*&sort=createdAt:desc`;

  if (filters.page) {
    url += `&pagination[page]=${filters.page}&pagination[pageSize]=${
      filters.pageSize || 25
    }`;
  }

  return authenticatedApiCall(url);
};

// ============================================
// PAYMENTS API
// ============================================

/**
 * Get all payments
 */
export const getPayments = async (filters = {}) => {
  let url = `${API_BASE_URL}/payments?populate=deep&sort=payment_date:desc`;

  if (filters.startDate) {
    url += `&filters[payment_date][$gte]=${filters.startDate}`;
  }
  if (filters.endDate) {
    url += `&filters[payment_date][$lte]=${filters.endDate}`;
  }
  if (filters.paymentMethod) {
    url += `&filters[payment_method][$eq]=${filters.paymentMethod}`;
  }

  return authenticatedApiCall(url);
};

/**
 * Create payment
 */
export const createPayment = async (data) => {
  return authenticatedApiCall(`${API_BASE_URL}/payments`, "POST", { data });
};

// ============================================
// STAFF API
// ============================================

/**
 * Get all staff
 */
export const getStaff = async (filters = {}) => {
  let url = `${API_BASE_URL}/staff?populate=*`;

  if (filters.restaurantId) {
    url += `&filters[restaurant][id][$eq]=${filters.restaurantId}`;
  }
  if (filters.role) {
    url += `&filters[role][$eq]=${filters.role}`;
  }

  return authenticatedApiCall(url);
};

/**
 * Create staff
 */
export const createStaff = async (data) => {
  return authenticatedApiCall(`${API_BASE_URL}/staff`, "POST", { data });
};

/**
 * Update staff
 */
export const updateStaff = async (staffId, data) => {
  return authenticatedApiCall(`${API_BASE_URL}/staff/${staffId}`, "PUT", {
    data,
  });
};

/**
 * Delete staff
 */
export const deleteStaff = async (staffId) => {
  return authenticatedApiCall(`${API_BASE_URL}/staff/${staffId}`, "DELETE");
};

// ============================================
// ANALYTICS API
// ============================================

/**
 * Get dashboard metrics
 */
export const getDashboardMetrics = async (filters = {}) => {
  const orders = await getOrders(filters);
  const payments = await getPayments(filters);
  const tables = await getTables({ restaurantId: filters.restaurantId });

  // Calculate metrics from data
  const ordersData = orders.data || [];
  const paymentsData = payments.data || [];
  const tablesData = tables.data || [];

  const totalRevenue = paymentsData.reduce(
    (sum, payment) => sum + (parseFloat(payment.attributes.amount) || 0),
    0
  );

  const totalOrders = ordersData.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const activeTables = tablesData.filter(
    (table) => table.attributes.status === "occupied"
  ).length;

  const ordersByStatus = ordersData.reduce((acc, order) => {
    const status = order.attributes.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    activeTables,
    totalTables: tablesData.length,
    pendingOrders: ordersByStatus.created || 0,
    completedOrders: ordersByStatus.completed || 0,
    cancelledOrders: ordersByStatus.cancelled || 0,
    preparingOrders: ordersByStatus.preparing || 0,
    readyOrders: ordersByStatus.ready || 0,
  };
};

/**
 * Get revenue over time
 */
export const getRevenueData = async (filters = {}) => {
  const payments = await getPayments(filters);
  const paymentsData = payments.data || [];

  // Group by date
  const revenueByDate = paymentsData.reduce((acc, payment) => {
    const date = payment.attributes.payment_date?.split("T")[0];
    if (!acc[date]) {
      acc[date] = { revenue: 0, count: 0 };
    }
    acc[date].revenue += parseFloat(payment.attributes.amount) || 0;
    acc[date].count += 1;
    return acc;
  }, {});

  return Object.entries(revenueByDate).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    orders: data.count,
    averageOrderValue: data.revenue / data.count,
  }));
};

/**
 * Get top selling items
 */
export const getTopSellingItems = async (filters = {}, limit = 10) => {
  const orders = await getOrders(filters);
  const ordersData = orders.data || [];

  const itemsSold = {};

  ordersData.forEach((order) => {
    const orderItems = order.attributes.order_items?.data || [];
    orderItems.forEach((item) => {
      const menuItem = item.attributes.menu_item?.data;
      if (!menuItem) return;

      const itemId = menuItem.id;
      const quantity = parseInt(item.attributes.quantity) || 0;
      const price = parseFloat(item.attributes.price) || 0;

      if (!itemsSold[itemId]) {
        itemsSold[itemId] = {
          id: itemId,
          name: menuItem.attributes.name,
          category: menuItem.attributes.category?.data?.attributes?.name || "",
          quantity_sold: 0,
          revenue: 0,
          image:
            menuItem.attributes.image?.data?.attributes?.formats?.small?.url,
        };
      }

      itemsSold[itemId].quantity_sold += quantity;
      itemsSold[itemId].revenue += quantity * price;
    });
  });

  return Object.values(itemsSold)
    .sort((a, b) => b.quantity_sold - a.quantity_sold)
    .slice(0, limit);
};

/**
 * Get payment breakdown
 */
export const getPaymentBreakdown = async (filters = {}) => {
  const payments = await getPayments(filters);
  const paymentsData = payments.data || [];

  const breakdown = paymentsData.reduce((acc, payment) => {
    const method = payment.attributes.payment_method;
    const amount = parseFloat(payment.attributes.amount) || 0;

    if (!acc[method]) {
      acc[method] = { count: 0, amount: 0 };
    }
    acc[method].count += 1;
    acc[method].amount += amount;
    return acc;
  }, {});

  const total = Object.values(breakdown).reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return Object.entries(breakdown).map(([method, data]) => ({
    method,
    count: data.count,
    amount: data.amount,
    percentage: total > 0 ? (data.amount / total) * 100 : 0,
  }));
};

// ============================================
// ENHANCED KITCHEN OPERATIONS
// ============================================

/**
 * Get kitchen display orders (active orders only)
 */
export const getKitchenDisplayOrders = async (restaurantId = null) => {
  let url = `${API_BASE_URL}/orders?`;
  url += `filters[status][$in][0]=created&`;
  url += `filters[status][$in][1]=accepted&`;
  url += `filters[status][$in][2]=preparing&`;
  url += `filters[status][$in][3]=ready&`;
  url += `populate=deep&sort=createdAt:asc`;

  if (restaurantId) {
    url += `&filters[restaurant][id][$eq]=${restaurantId}`;
  }

  return authenticatedApiCall(url);
};

/**
 * Bulk update order status
 */
export const bulkUpdateOrderStatus = async (orderIds, status) => {
  const promises = orderIds.map((id) => updateOrderStatus(id, status));
  return Promise.all(promises);
};

// ============================================
// REPORTING & EXPORTS
// ============================================

/**
 * Generate sales report
 */
export const generateSalesReport = async (filters = {}) => {
  const orders = await getOrders(filters);
  const payments = await getPayments(filters);

  const ordersData = orders.data || [];
  const paymentsData = payments.data || [];

  const report = {
    totalOrders: ordersData.length,
    totalRevenue: paymentsData.reduce(
      (sum, p) => sum + parseFloat(p.attributes.amount || 0),
      0
    ),
    averageOrderValue: 0,
    ordersByStatus: {},
    revenueByDay: {},
    topCustomers: [],
  };

  report.averageOrderValue =
    report.totalOrders > 0 ? report.totalRevenue / report.totalOrders : 0;

  // Group orders by status
  ordersData.forEach((order) => {
    const status = order.attributes.status;
    report.ordersByStatus[status] = (report.ordersByStatus[status] || 0) + 1;
  });

  // Group revenue by day
  paymentsData.forEach((payment) => {
    const date = payment.attributes.payment_date?.split("T")[0];
    if (!report.revenueByDay[date]) {
      report.revenueByDay[date] = 0;
    }
    report.revenueByDay[date] += parseFloat(payment.attributes.amount || 0);
  });

  return report;
};

/**
 * Export data to CSV format
 */
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) => headers.map((header) => row[header]).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};
