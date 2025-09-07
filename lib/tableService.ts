// Table service utilities for restaurant management

export type TableStatus =
  | "available"
  | "occupied"
  | "assistant"
  | "pay"
  | "cleaning";

export interface TableInfo {
  id: number;
  status: TableStatus;
  lastUpdated: Date;
  customerCount?: number;
}

// Mock table data storage (in a real app, this would be a database)
const tableData: { [key: number]: TableInfo } = {
  1: { id: 1, status: "available", lastUpdated: new Date() },
  2: { id: 2, status: "occupied", lastUpdated: new Date() },
  3: { id: 3, status: "available", lastUpdated: new Date() },
  4: { id: 4, status: "occupied", lastUpdated: new Date() },
  5: { id: 5, status: "cleaning", lastUpdated: new Date() },
  6: { id: 6, status: "available", lastUpdated: new Date() },
  7: { id: 7, status: "occupied", lastUpdated: new Date() },
  8: { id: 8, status: "available", lastUpdated: new Date() },
};

/**
 * Updates the status of a specific table
 * @param tableId - The ID of the table to update
 * @param status - The new status for the table
 * @returns Promise<boolean> - Success status of the update
 */
export async function updateTableStatus(
  tableId: number,
  status: TableStatus
): Promise<boolean> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (tableData[tableId]) {
      tableData[tableId] = {
        ...tableData[tableId],
        status,
        lastUpdated: new Date(),
      };

      // Log the status change for debugging
      console.log(`Table ${tableId} status updated to: ${status}`);

      return true;
    } else {
      console.error(`Table ${tableId} not found`);
      return false;
    }
  } catch (error) {
    console.error("Error updating table status:", error);
    return false;
  }
}

/**
 * Gets the current status of a table
 * @param tableId - The ID of the table to check
 * @returns TableInfo | null - Table information or null if not found
 */
export function getTableStatus(tableId: number): TableInfo | null {
  return tableData[tableId] || null;
}

/**
 * Gets all table statuses
 * @returns TableInfo[] - Array of all table information
 */
export function getAllTableStatuses(): TableInfo[] {
  return Object.values(tableData);
}

/**
 * Resets a table to available status
 * @param tableId - The ID of the table to reset
 * @returns Promise<boolean> - Success status of the reset
 */
export async function resetTable(tableId: number): Promise<boolean> {
  return updateTableStatus(tableId, "available");
}
