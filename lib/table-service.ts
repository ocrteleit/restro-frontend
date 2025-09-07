import { API_BASE_URL } from "./api";

export interface TableStatusResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export type TableStatus = "pay" | "assistant" | "available" | "occupied";

export async function updateTableStatus(
  tableId: number,
  status: TableStatus
): Promise<TableStatusResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/tables/${tableId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          statuss: status,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update table status");
    }

    return data;
  } catch (error) {
    console.error("Error updating table status:", error);
    throw error;
  }
}

/**
 * Call waiter for a specific table
 */
export async function callWaiter(
  tableId: number
): Promise<TableStatusResponse> {
  return updateTableStatus(tableId, "assistant");
}

/**
 * Request bill for a specific table
 */
export async function requestBill(
  tableId: number
): Promise<TableStatusResponse> {
  return updateTableStatus(tableId, "pay");
}

/**
 * Mark table as available
 */
export async function markTableAvailable(
  tableId: number
): Promise<TableStatusResponse> {
  return updateTableStatus(tableId, "available");
}

/**
 * Mark table as occupied
 */
export async function markTableOccupied(
  tableId: number
): Promise<TableStatusResponse> {
  return updateTableStatus(tableId, "occupied");
}
