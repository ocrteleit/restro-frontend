/**
 * Analytics API Service
 * Handles all analytics and reporting API calls
 */

import { API_BASE_URL } from "./api";
import { authenticatedApiCall } from "./admin-api";

// ============================================
// DASHBOARD ANALYTICS
// ============================================

/**
 * Get comprehensive dashboard statistics
 */
export const getDashboardAnalytics = async (restaurantId = null) => {
  const url = restaurantId
    ? `${API_BASE_URL}/analytics/dashboard?restaurantId=${restaurantId}`
    : `${API_BASE_URL}/analytics/dashboard`;

  return authenticatedApiCall(url);
};

/**
 * Get revenue chart data over time
 */
export const getRevenueChart = async (
  restaurantId = null,
  period = "7days"
) => {
  let url = `${API_BASE_URL}/analytics/revenue-chart?period=${period}`;
  if (restaurantId) url += `&restaurantId=${restaurantId}`;

  return authenticatedApiCall(url);
};

/**
 * Get popular/top selling items
 */
export const getPopularItems = async (
  restaurantId = null,
  limit = 10,
  period = "30days"
) => {
  let url = `${API_BASE_URL}/analytics/popular-items?limit=${limit}&period=${period}`;
  if (restaurantId) url += `&restaurantId=${restaurantId}`;

  return authenticatedApiCall(url);
};

/**
 * Get sales breakdown by category
 */
export const getSalesByCategory = async (
  restaurantId = null,
  period = "30days"
) => {
  let url = `${API_BASE_URL}/analytics/sales-by-category?period=${period}`;
  if (restaurantId) url += `&restaurantId=${restaurantId}`;

  return authenticatedApiCall(url);
};

/**
 * Get peak hours analysis
 */
export const getPeakHours = async (restaurantId = null, period = "30days") => {
  let url = `${API_BASE_URL}/analytics/peak-hours?period=${period}`;
  if (restaurantId) url += `&restaurantId=${restaurantId}`;

  return authenticatedApiCall(url);
};

/**
 * Get orders by day of week
 */
export const getOrdersByDay = async (
  restaurantId = null,
  period = "30days"
) => {
  let url = `${API_BASE_URL}/analytics/orders-by-day?period=${period}`;
  if (restaurantId) url += `&restaurantId=${restaurantId}`;

  return authenticatedApiCall(url);
};

/**
 * Get table occupancy statistics
 */
export const getTableOccupancy = async (restaurantId = null) => {
  const url = restaurantId
    ? `${API_BASE_URL}/analytics/table-occupancy?restaurantId=${restaurantId}`
    : `${API_BASE_URL}/analytics/table-occupancy`;

  return authenticatedApiCall(url);
};

/**
 * Get order status distribution
 */
export const getOrderStatusAnalytics = async (
  restaurantId = null,
  period = "today"
) => {
  let url = `${API_BASE_URL}/analytics/order-status?period=${period}`;
  if (restaurantId) url += `&restaurantId=${restaurantId}`;

  return authenticatedApiCall(url);
};

/**
 * Get payment methods breakdown
 */
export const getPaymentMethodsAnalytics = async (
  restaurantId = null,
  period = "30days"
) => {
  let url = `${API_BASE_URL}/analytics/payment-methods?period=${period}`;
  if (restaurantId) url += `&restaurantId=${restaurantId}`;

  return authenticatedApiCall(url);
};

/**
 * Get customer analytics
 */
export const getCustomerAnalytics = async () => {
  return authenticatedApiCall(`${API_BASE_URL}/analytics/customer-analytics`);
};

// ============================================
// KITCHEN ANALYTICS
// ============================================

/**
 * Get kitchen display orders (real-time)
 */
export const getKitchenOrders = async (restaurantId = null) => {
  const url = restaurantId
    ? `${API_BASE_URL}/orders/kitchen?restaurantId=${restaurantId}`
    : `${API_BASE_URL}/orders/kitchen`;

  return authenticatedApiCall(url);
};

/**
 * Get order statistics
 */
export const getOrderStatistics = async (
  restaurantId = null,
  startDate = null,
  endDate = null
) => {
  let url = `${API_BASE_URL}/orders/statistics?`;
  if (restaurantId) url += `restaurantId=${restaurantId}&`;
  if (startDate) url += `startDate=${startDate}&`;
  if (endDate) url += `endDate=${endDate}`;

  return authenticatedApiCall(url);
};
