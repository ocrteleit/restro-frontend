/**
 * SWR Usage Examples
 * This file demonstrates how to use the global SWR configuration
 */

import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  fetcher,
  mutationFetcher,
  postFetcher,
  putFetcher,
  patchFetcher,
  deleteFetcher,
  apiCall,
  swrConfig,
  realtimeSwrConfig,
  staticSwrConfig,
  mutationConfig,
} from "./swr-config";

// ============================================
// EXAMPLE 1: Simple GET Request with useSWR
// ============================================

export function ExampleSimpleGet() {
  const { data, error, isLoading } = useSWR(
    "https://api.example.com/data",
    fetcher
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
}

// ============================================
// EXAMPLE 2: GET with Custom Configuration
// ============================================

export function ExampleCustomConfig() {
  const { data, error, isLoading } = useSWR(
    "https://api.example.com/realtime-data",
    fetcher,
    realtimeSwrConfig // Auto-refresh every 5 seconds
  );

  return <div>{data?.value}</div>;
}

// ============================================
// EXAMPLE 3: POST Request with useSWRMutation
// ============================================

export function ExamplePost() {
  const { trigger, isMutating, error } = useSWRMutation(
    "https://api.example.com/items",
    postFetcher,
    mutationConfig
  );

  const handleSubmit = async () => {
    try {
      const result = await trigger({
        data: { name: "New Item", price: 100 },
      });
      console.log("Created:", result);
    } catch (err) {
      console.error("Failed:", err);
    }
  };

  return (
    <button onClick={handleSubmit} disabled={isMutating}>
      {isMutating ? "Creating..." : "Create Item"}
    </button>
  );
}

// ============================================
// EXAMPLE 4: PUT Request with useSWRMutation
// ============================================

export function ExamplePut() {
  const { trigger, isMutating } = useSWRMutation(
    "https://api.example.com/items/123",
    putFetcher
  );

  const handleUpdate = async () => {
    await trigger({
      data: { name: "Updated Item", price: 200 },
    });
  };

  return <button onClick={handleUpdate}>Update Item</button>;
}

// ============================================
// EXAMPLE 5: DELETE Request
// ============================================

export function ExampleDelete() {
  const { trigger, isMutating } = useSWRMutation(
    "https://api.example.com/items/123",
    deleteFetcher
  );

  const handleDelete = async () => {
    await trigger({ data: null }); // No body needed for DELETE
  };

  return (
    <button onClick={handleDelete} disabled={isMutating}>
      Delete
    </button>
  );
}

// ============================================
// EXAMPLE 6: PATCH Request
// ============================================

export function ExamplePatch() {
  const { trigger } = useSWRMutation(
    "https://api.example.com/items/123",
    patchFetcher
  );

  const handlePartialUpdate = async () => {
    await trigger({
      data: { price: 250 }, // Only update price
    });
  };

  return <button onClick={handlePartialUpdate}>Update Price</button>;
}

// ============================================
// EXAMPLE 7: Custom Mutation with Headers
// ============================================

export function ExampleCustomHeaders() {
  const { trigger } = useSWRMutation(
    "https://api.example.com/protected",
    mutationFetcher
  );

  const handleProtectedRequest = async () => {
    await trigger({
      method: "POST",
      data: { message: "Hello" },
      headers: {
        Authorization: "Bearer token123",
        "X-Custom-Header": "value",
      },
    });
  };

  return (
    <button onClick={handleProtectedRequest}>Send Protected Request</button>
  );
}

// ============================================
// EXAMPLE 8: Using apiCall Directly (Non-SWR)
// ============================================

export function ExampleApiCall() {
  const handleDirectCall = async () => {
    try {
      // GET request
      const data = await apiCall("https://api.example.com/data", "GET");

      // POST request
      const created = await apiCall("https://api.example.com/items", "POST", {
        name: "New Item",
      });

      // PUT with headers
      const updated = await apiCall(
        "https://api.example.com/items/123",
        "PUT",
        { name: "Updated" },
        { Authorization: "Bearer token" }
      );

      console.log({ data, created, updated });
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  return <button onClick={handleDirectCall}>Make Direct API Calls</button>;
}

// ============================================
// EXAMPLE 9: Conditional Fetching
// ============================================

export function ExampleConditional({ userId }) {
  const { data } = useSWR(
    userId ? `https://api.example.com/users/${userId}` : null,
    fetcher
  );

  return <div>{data?.name || "No user selected"}</div>;
}

// ============================================
// EXAMPLE 10: Multiple Mutations in Sequence
// ============================================

export function ExampleSequentialMutations() {
  const { trigger: createItem } = useSWRMutation(
    "https://api.example.com/items",
    postFetcher
  );

  const { trigger: updateItem } = useSWRMutation(
    "https://api.example.com/items/:id",
    putFetcher
  );

  const handleSequence = async () => {
    // Create an item
    const created = await createItem({
      data: { name: "New Item" },
    });

    // Update the created item
    const updated = await updateItem({
      data: { name: "Updated Item" },
    });

    console.log({ created, updated });
  };

  return <button onClick={handleSequence}>Run Sequence</button>;
}

// ============================================
// EXAMPLE 11: Optimistic UI Updates
// ============================================

export function ExampleOptimisticUI() {
  const { data, mutate } = useSWR("https://api.example.com/items", fetcher);

  const { trigger } = useSWRMutation(
    "https://api.example.com/items",
    postFetcher
  );

  const handleOptimisticAdd = async () => {
    const newItem = { id: Date.now(), name: "Optimistic Item" };

    // Optimistically update UI
    mutate([...(data || []), newItem], false);

    // Send actual request
    try {
      await trigger({ data: newItem });
      // Revalidate to get real data
      mutate();
    } catch (error) {
      // Rollback on error
      mutate(data);
    }
  };

  return (
    <div>
      <button onClick={handleOptimisticAdd}>Add with Optimistic UI</button>
      <ul>
        {data?.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// EXAMPLE 12: Dependent Requests
// ============================================

export function ExampleDependent() {
  const { data: user } = useSWR("https://api.example.com/user/me", fetcher);

  const { data: posts } = useSWR(
    user ? `https://api.example.com/users/${user.id}/posts` : null,
    fetcher
  );

  return (
    <div>
      <h1>{user?.name}</h1>
      <ul>
        {posts?.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// EXAMPLE 13: Pagination
// ============================================

export function ExamplePagination() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSWR(
    `https://api.example.com/items?page=${page}&limit=10`,
    fetcher
  );

  return (
    <div>
      {isLoading ? <div>Loading...</div> : <div>{/* Render items */}</div>}
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Previous
      </button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}

// ============================================
// EXAMPLE 14: Error Handling
// ============================================

export function ExampleErrorHandling() {
  const { data, error, isLoading } = useSWR(
    "https://api.example.com/data",
    fetcher,
    {
      onError: (err) => {
        console.error("SWR Error:", err);
        // Send to error tracking service
      },
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 404
        if (error.status === 404) return;

        // Only retry up to 3 times
        if (retryCount >= 3) return;

        // Retry after 5 seconds
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );

  if (error) {
    return (
      <div className="error">
        <h2>Error: {error.message}</h2>
        {error.info && <pre>{JSON.stringify(error.info, null, 2)}</pre>}
      </div>
    );
  }

  if (isLoading) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}

// ============================================
// EXAMPLE 15: Real-world Restaurant Table Service
// ============================================

export function ExampleTableService({ tableId }) {
  const { trigger: callWaiter, isMutating: callingWaiter } = useSWRMutation(
    "call-waiter",
    async (url, { arg }) => {
      return await apiCall(
        `https://api.example.com/tables/${arg.tableId}`,
        "PUT",
        { data: { status: "assistant" } }
      );
    }
  );

  const { trigger: requestBill, isMutating: requestingBill } = useSWRMutation(
    "request-bill",
    async (url, { arg }) => {
      return await apiCall(
        `https://api.example.com/tables/${arg.tableId}`,
        "PUT",
        { data: { status: "pay" } }
      );
    }
  );

  const handleCallWaiter = async () => {
    await callWaiter({ tableId });
  };

  const handleRequestBill = async () => {
    await requestBill({ tableId });
  };

  return (
    <div>
      <button onClick={handleCallWaiter} disabled={callingWaiter}>
        {callingWaiter ? "Calling..." : "Call Waiter"}
      </button>
      <button onClick={handleRequestBill} disabled={requestingBill}>
        {requestingBill ? "Requesting..." : "Request Bill"}
      </button>
    </div>
  );
}
