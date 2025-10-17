/**
 * Enhanced SWR Configuration and Utilities
 * Provides centralized SWR setup for data fetching and mutations
 */

/**
 * Global fetcher for GET requests
 * @param {string} url - The URL to fetch
 * @param {object} options - Additional fetch options
 * @returns {Promise} - Response data
 */
export const fetcher = async (url, options = {}) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");
    try {
      error.info = await response.json();
    } catch {
      error.info = { message: response.statusText };
    }
    error.status = response.status;
    throw error;
  }

  return response.json();
};

/**
 * Global fetcher for mutations (POST, PUT, DELETE, PATCH)
 * @param {string} url - The URL to send request to
 * @param {object} param1 - Contains arg (data) and method
 * @returns {Promise} - Response data
 */
export const mutationFetcher = async (url, { arg }) => {
  const { data, method = "POST", headers = {} } = arg;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = new Error(`${method} request failed`);
    try {
      error.info = await response.json();
    } catch {
      error.info = { message: response.statusText };
    }
    error.status = response.status;
    throw error;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return { success: true };
  }

  return response.json();
};

/**
 * Create a mutation fetcher for specific method
 * @param {string} method - HTTP method (POST, PUT, DELETE, PATCH)
 * @returns {Function} - Mutation fetcher function
 */
export const createMutationFetcher =
  (method) =>
  async (url, { arg }) => {
    return mutationFetcher(url, {
      arg: {
        ...arg,
        method,
      },
    });
  };

// Method-specific mutation fetchers
export const postFetcher = createMutationFetcher("POST");
export const putFetcher = createMutationFetcher("PUT");
export const patchFetcher = createMutationFetcher("PATCH");
export const deleteFetcher = createMutationFetcher("DELETE");

/**
 * Generic API caller for any HTTP method with data
 * @param {string} url - The URL
 * @param {string} method - HTTP method
 * @param {object} data - Request body data
 * @param {object} headers - Additional headers
 * @returns {Promise} - Response data
 */
export const apiCall = async (
  url,
  method = "GET",
  data = null,
  headers = {}
) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (data && method !== "GET") {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = new Error(`API call failed: ${method} ${url}`);
    try {
      error.info = await response.json();
    } catch {
      error.info = { message: response.statusText };
    }
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return { success: true };
  }

  return response.json();
};

// Default SWR configuration options
export const swrConfig = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  dedupingInterval: 2000,
  focusThrottleInterval: 5000,
  loadingTimeout: 3000,
  onError: (error, key) => {
    console.error(`SWR Error for key "${key}":`, error);
  },
};

// SWR configuration for real-time data
export const realtimeSwrConfig = {
  ...swrConfig,
  refreshInterval: 5000, // Refresh every 5 seconds
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

// SWR configuration for static data (rarely changes)
export const staticSwrConfig = {
  ...swrConfig,
  revalidateIfStale: false,
  revalidateOnMount: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60000, // 1 minute
};

// SWR configuration for mutations
export const mutationConfig = {
  throwOnError: false,
  onSuccess: (data, key, config) => {
    console.log(`Mutation success for key "${key}"`);
  },
  onError: (error, key, config) => {
    console.error(`Mutation error for key "${key}":`, error);
  },
};
