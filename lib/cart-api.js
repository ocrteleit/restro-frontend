/**
 * Cart and Order Management API
 * Handles orders and order items for the restaurant system
 */

import { API_BASE_URL } from "./api";
import { apiCall } from "./swr-config";

/**
 * Create a new order
 * @param {number} tableId - Table ID
 * @param {number} restaurantId - Restaurant ID (optional, for tracking)
 * @returns {Promise} - Created order data
 */
export async function createOrder(tableId, restaurantId = null) {
  try {
    const orderNumber = `ORD-${Date.now()}`;

    const response = await apiCall(`${API_BASE_URL}/orders`, "POST", {
      data: {
        order_number: orderNumber,
        table: tableId,
        payment_status: "pending",
        fulfillment: "dine_in",
        status: "created",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

/**
 * Get active order for a table
 * @param {number} tableId - Table ID
 * @returns {Promise} - Order data or null
 */
export async function getActiveOrder(tableId) {
  try {
    const response = await apiCall(
      `${API_BASE_URL}/orders?filters[table][id][$eq]=${tableId}&filters[status][$containsi]=created&populate[order_items][populate][menu_item][populate][image]=*&sort=createdAt:desc&pagination[limit]=1`,
      "GET"
    );

    if (response.data && response.data.length > 0) {
      return response.data[0];
    }

    return null;
  } catch (error) {
    console.error("Error fetching active order:", error);
    return null;
  }
}

/**
 * Add item to order
 * @param {number} orderId - Order ID
 * @param {number} menuItemId - Menu item ID
 * @param {number} quantity - Quantity
 * @param {number} price - Price at order time
 * @returns {Promise} - Created order item
 */
export async function addOrderItem(orderId, menuItemId, quantity, price) {
  try {
    const response = await apiCall(`${API_BASE_URL}/order-items`, "POST", {
      data: {
        order: orderId,
        menu_item: menuItemId,
        quantity: String(quantity),
        price: String(price),
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding order item:", error);
    throw error;
  }
}

/**
 * Update order item quantity
 * @param {number} orderItemId - Order item ID
 * @param {number} quantity - New quantity
 * @returns {Promise} - Updated order item
 */
export async function updateOrderItemQuantity(orderItemId, quantity) {
  try {
    const response = await apiCall(
      `${API_BASE_URL}/order-items/${orderItemId}`,
      "PUT",
      {
        data: {
          quantity: String(quantity),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating order item:", error);
    throw error;
  }
}

/**
 * Remove order item
 * @param {number} orderItemId - Order item ID
 * @returns {Promise} - Deletion result
 */
export async function removeOrderItem(orderItemId) {
  try {
    await apiCall(`${API_BASE_URL}/order-items/${orderItemId}`, "DELETE");
    return { success: true };
  } catch (error) {
    console.error("Error removing order item:", error);
    throw error;
  }
}

/**
 * Get all order items for an order
 * @param {number} orderId - Order ID
 * @returns {Promise} - Array of order items
 */
export async function getOrderItems(orderId) {
  try {
    const response = await apiCall(
      `${API_BASE_URL}/order-items?filters[order][id][$eq]=${orderId}&populate[menu_item][populate][image]=*`,
      "GET"
    );

    return response.data || [];
  } catch (error) {
    console.error("Error fetching order items:", error);
    return [];
  }
}

/**
 * Update order status
 * @param {number} orderId - Order ID
 * @param {string} status - New status (created, accepted, preparing, ready, served, completed, cancelled, rejected)
 * @returns {Promise} - Updated order
 */
export async function updateOrderStatus(orderId, status) {
  console.log("Updating order status:", orderId, status);
  try {
    const response = await apiCall(`${API_BASE_URL}/orders/${orderId}`, "PUT", {
      data: {
        status: "accepted",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

/**
 * Submit order (change status from created to accepted)
 * Also marks table as occupied
 * @param {number} orderId - Order ID
 * @param {number} tableId - Table ID
 * @returns {Promise} - Updated order
 */
export async function submitOrder(orderId, tableId) {
  try {
    // Update order status to accepted (ready for kitchen)
    const orderResponse = await updateOrderStatus(orderId, "ready");

    // Update table status to occupied
    await apiCall(`${API_BASE_URL}/tables/${tableId}`, "PUT", {
      data: {
        status: "occupied",
      },
    });

    return orderResponse;
  } catch (error) {
    console.error("Error submitting order:", error);
    throw error;
  }
}

/**
 * Cancel order
 * @param {number} orderId - Order ID
 * @returns {Promise} - Updated order
 */
export async function cancelOrder(orderId) {
  try {
    return await updateOrderStatus(orderId, "cancelled");
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
}

/**
 * Calculate order total from order items
 * @param {Array} orderItems - Array of order items
 * @returns {number} - Total price
 */
export function calculateOrderTotal(orderItems) {
  if (!orderItems || orderItems.length === 0) return 0;

  return orderItems.reduce((total, item) => {
    const quantity = parseFloat(item.attributes?.quantity || 0);
    const price = parseFloat(item.attributes?.price || 0);
    return total + quantity * price;
  }, 0);
}

/**
 * Mutation fetcher for creating order (for useSWRMutation)
 */
export const createOrderMutation = async (url, { arg }) => {
  const { tableId, restaurantId } = arg;
  return createOrder(tableId, restaurantId);
};

/**
 * Mutation fetcher for adding order item (for useSWRMutation)
 */
export const addOrderItemMutation = async (url, { arg }) => {
  const { orderId, menuItemId, quantity, price } = arg;
  return addOrderItem(orderId, menuItemId, quantity, price);
};

/**
 * Mutation fetcher for updating order item (for useSWRMutation)
 */
export const updateOrderItemMutation = async (url, { arg }) => {
  const { orderItemId, quantity } = arg;
  return updateOrderItemQuantity(orderItemId, quantity);
};

/**
 * Mutation fetcher for removing order item (for useSWRMutation)
 */
export const removeOrderItemMutation = async (url, { arg }) => {
  const { orderItemId } = arg;
  return removeOrderItem(orderItemId);
};

/**
 * Mutation fetcher for submitting order (for useSWRMutation)
 */
export const submitOrderMutation = async (url, { arg }) => {
  const { orderId, tableId } = arg;
  return submitOrder(orderId, tableId);
};
