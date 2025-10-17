import { API_BASE_URL } from "./api";
import { apiCall } from "./swr-config";

/**
 * Update table status using global API caller
 */
export async function updateTableStatus(tableId, status) {
  try {
    return await apiCall(`${API_BASE_URL}/tables/${tableId}`, "PUT", {
      data: {
        statuss: status,
      },
    });
  } catch (error) {
    console.error("Error updating table status:", error);
    throw error;
  }
}

/**
 * Call waiter for a specific table
 */
export async function callWaiter(tableId) {
  return updateTableStatus(tableId, "assistant");
}

/**
 * Request bill for a specific table
 */
export async function requestBill(tableId) {
  return updateTableStatus(tableId, "pay");
}

/**
 * Mark table as available
 */
export async function markTableAvailable(tableId) {
  return updateTableStatus(tableId, "available");
}

/**
 * Mark table as occupied
 */
export async function markTableOccupied(tableId) {
  return updateTableStatus(tableId, "occupied");
}

/**
 * Mutation fetcher for table status updates (for useSWRMutation)
 * @param {string} url - The URL (will be constructed from tableId)
 * @param {object} param1 - Contains tableId and status
 */
export const updateTableStatusMutation = async (url, { arg }) => {
  const { tableId, status } = arg;
  return updateTableStatus(tableId, status);
};

/**
 * Call waiter mutation (for useSWRMutation)
 */
export const callWaiterMutation = async (url, { arg }) => {
  const { tableId } = arg;
  return callWaiter(tableId);
};

/**
 * Request bill mutation (for useSWRMutation)
 */
export const requestBillMutation = async (url, { arg }) => {
  const { tableId } = arg;
  return requestBill(tableId);
};
