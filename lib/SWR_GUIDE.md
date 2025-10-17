# 🔄 Global SWR Configuration Guide

## Overview

This project uses a **centralized SWR configuration** that provides:

- ✅ Global fetcher for GET requests
- ✅ Global mutation fetchers for POST, PUT, PATCH, DELETE
- ✅ Flexible API call function with URL and data
- ✅ Pre-configured SWR options
- ✅ Error handling and retry logic

---

## 📁 Files

- **`lib/swr-config.js`** - Main configuration and utilities
- **`lib/swr-usage-examples.js`** - 15+ usage examples
- **`lib/table-service.js`** - Real implementation example

---

## 🚀 Quick Start

### 1. Simple GET Request

```javascript
import useSWR from "swr";
import { fetcher } from "@/lib/swr-config";

function MyComponent() {
  const { data, error, isLoading } = useSWR(
    "https://api.example.com/data",
    fetcher
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
}
```

### 2. POST Request (Create)

```javascript
import useSWRMutation from "swr/mutation";
import { postFetcher } from "@/lib/swr-config";

function CreateItem() {
  const { trigger, isMutating } = useSWRMutation(
    "https://api.example.com/items",
    postFetcher
  );

  const handleCreate = async () => {
    await trigger({
      data: { name: "New Item", price: 100 },
    });
  };

  return (
    <button onClick={handleCreate} disabled={isMutating}>
      {isMutating ? "Creating..." : "Create"}
    </button>
  );
}
```

### 3. PUT Request (Update)

```javascript
import useSWRMutation from "swr/mutation";
import { putFetcher } from "@/lib/swr-config";

function UpdateItem({ itemId }) {
  const { trigger } = useSWRMutation(
    `https://api.example.com/items/${itemId}`,
    putFetcher
  );

  const handleUpdate = async () => {
    await trigger({
      data: { name: "Updated Item", price: 200 },
    });
  };

  return <button onClick={handleUpdate}>Update</button>;
}
```

### 4. DELETE Request

```javascript
import useSWRMutation from "swr/mutation";
import { deleteFetcher } from "@/lib/swr-config";

function DeleteItem({ itemId }) {
  const { trigger, isMutating } = useSWRMutation(
    `https://api.example.com/items/${itemId}`,
    deleteFetcher
  );

  return (
    <button onClick={() => trigger({ data: null })} disabled={isMutating}>
      Delete
    </button>
  );
}
```

---

## 📚 Available Fetchers

### GET Fetcher

```javascript
import { fetcher } from "@/lib/swr-config";

// Basic usage
const { data } = useSWR(url, fetcher);

// With options
const { data } = useSWR(url, (url) =>
  fetcher(url, {
    headers: { Authorization: "Bearer token" },
  })
);
```

### Mutation Fetchers

```javascript
import {
  postFetcher, // For POST requests
  putFetcher, // For PUT requests
  patchFetcher, // For PATCH requests
  deleteFetcher, // For DELETE requests
  mutationFetcher, // Generic mutation fetcher
} from "@/lib/swr-config";
```

#### POST Fetcher

```javascript
const { trigger } = useSWRMutation(url, postFetcher);
await trigger({ data: { name: "Item" } });
```

#### PUT Fetcher

```javascript
const { trigger } = useSWRMutation(url, putFetcher);
await trigger({ data: { name: "Updated" } });
```

#### PATCH Fetcher

```javascript
const { trigger } = useSWRMutation(url, patchFetcher);
await trigger({ data: { price: 100 } });
```

#### DELETE Fetcher

```javascript
const { trigger } = useSWRMutation(url, deleteFetcher);
await trigger({ data: null });
```

### Generic API Call (Non-SWR)

```javascript
import { apiCall } from "@/lib/swr-config";

// GET
const data = await apiCall("https://api.example.com/data", "GET");

// POST
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

// DELETE
await apiCall("https://api.example.com/items/123", "DELETE");
```

---

## ⚙️ Pre-configured Options

### Default Config (`swrConfig`)

```javascript
import { swrConfig } from "@/lib/swr-config";

const { data } = useSWR(url, fetcher, swrConfig);
```

**Settings:**

- ✅ Auto fetcher included
- ⏸️ No revalidation on focus
- 🔄 Revalidation on reconnect
- ♻️ 3 retry attempts on error
- ⏱️ 2s deduplication interval
- 🚨 Global error logging

### Real-time Config (`realtimeSwrConfig`)

```javascript
import { realtimeSwrConfig } from "@/lib/swr-config";

const { data } = useSWR(url, fetcher, realtimeSwrConfig);
```

**Settings:**

- 🔄 Auto-refresh every 5 seconds
- ✅ Revalidation on focus
- ✅ Revalidation on reconnect

### Static Config (`staticSwrConfig`)

```javascript
import { staticSwrConfig } from "@/lib/swr-config";

const { data } = useSWR(url, fetcher, staticSwrConfig);
```

**Settings:**

- 🚫 No revalidation (data rarely changes)
- 🕐 1 minute deduplication

### Mutation Config (`mutationConfig`)

```javascript
import { mutationConfig } from "@/lib/swr-config";

const { trigger } = useSWRMutation(url, postFetcher, mutationConfig);
```

**Settings:**

- ✅ Success logging
- 🚨 Error logging
- 🔄 No auto-throw on error

---

## 🎯 Common Patterns

### 1. With Custom Headers

```javascript
import useSWRMutation from "swr/mutation";
import { mutationFetcher } from "@/lib/swr-config";

const { trigger } = useSWRMutation(url, mutationFetcher);

await trigger({
  method: "POST",
  data: { message: "Hello" },
  headers: {
    Authorization: "Bearer token123",
    "X-Custom-Header": "value",
  },
});
```

### 2. Conditional Fetching

```javascript
const { data } = useSWR(userId ? `/api/users/${userId}` : null, fetcher);
// Only fetches when userId exists
```

### 3. Dependent Requests

```javascript
const { data: user } = useSWR("/api/user/me", fetcher);

const { data: posts } = useSWR(
  user ? `/api/users/${user.id}/posts` : null,
  fetcher
);
// Posts only fetch after user is loaded
```

### 4. Optimistic UI Updates

```javascript
const { data, mutate } = useSWR("/api/items", fetcher);
const { trigger } = useSWRMutation("/api/items", postFetcher);

const handleAdd = async () => {
  const newItem = { id: Date.now(), name: "New" };

  // Optimistically update UI
  mutate([...(data || []), newItem], false);

  try {
    await trigger({ data: newItem });
    mutate(); // Revalidate
  } catch (error) {
    mutate(data); // Rollback
  }
};
```

### 5. Pagination

```javascript
const [page, setPage] = useState(1);

const { data, isLoading } = useSWR(`/api/items?page=${page}&limit=10`, fetcher);
```

### 6. Error Handling

```javascript
const { data, error } = useSWR("/api/data", fetcher, {
  onError: (err) => {
    console.error("Error:", err);
    // Send to error tracking
  },
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    if (error.status === 404) return; // Don't retry 404
    if (retryCount >= 3) return; // Max 3 retries
    setTimeout(() => revalidate({ retryCount }), 5000);
  },
});

if (error) {
  return (
    <div>
      <h2>Error: {error.message}</h2>
      <pre>{JSON.stringify(error.info, null, 2)}</pre>
    </div>
  );
}
```

---

## 🔧 Advanced Usage

### Custom Mutation Function

```javascript
const { trigger } = useSWRMutation("custom-key", async (url, { arg }) => {
  // Your custom logic
  const response = await apiCall(`/api/tables/${arg.tableId}`, "PUT", {
    status: arg.status,
  });
  return response;
});

await trigger({ tableId: 7, status: "occupied" });
```

### Combine Multiple Mutations

```javascript
const { trigger: create } = useSWRMutation(url1, postFetcher);
const { trigger: update } = useSWRMutation(url2, putFetcher);

const handleSequence = async () => {
  const created = await create({ data: { name: "Item" } });
  await update({ data: { id: created.id, status: "active" } });
};
```

### Global Error Handler

Already configured in `swrConfig`:

```javascript
onError: (error, key) => {
  console.error(`SWR Error for key "${key}":`, error);
};
```

---

## 📝 Real-World Example: Table Service

```javascript
// lib/table-service.js
import { apiCall } from "./swr-config";

export async function updateTableStatus(tableId, status) {
  return await apiCall(`${API_BASE_URL}/tables/${tableId}`, "PUT", {
    data: { statuss: status },
  });
}

export const callWaiterMutation = async (url, { arg }) => {
  const { tableId } = arg;
  return updateTableStatus(tableId, "assistant");
};

// In component
import useSWRMutation from "swr/mutation";
import { callWaiterMutation } from "@/lib/table-service";

const { trigger, isMutating } = useSWRMutation(
  "call-waiter",
  callWaiterMutation
);

await trigger({ tableId: 7 });
```

---

## 🎨 Best Practices

### ✅ DO:

- Use `fetcher` for all GET requests
- Use specific mutation fetchers (`postFetcher`, `putFetcher`, etc.)
- Pass data via `trigger({ data: ... })`
- Handle loading states with `isLoading` and `isMutating`
- Use conditional fetching for dependent data
- Implement optimistic UI for better UX

### ❌ DON'T:

- Don't create custom fetchers for standard cases
- Don't forget to handle errors
- Don't make API calls outside SWR for client-side data
- Don't ignore loading and error states

---

## 🔍 Error Object Structure

```javascript
{
  message: "Error message",
  info: { /* Response body */ },
  status: 404  // HTTP status code
}
```

---

## 📊 Comparison Table

| Method | Fetcher         | Use Case       | Example                              |
| ------ | --------------- | -------------- | ------------------------------------ |
| GET    | `fetcher`       | Fetch data     | `useSWR(url, fetcher)`               |
| POST   | `postFetcher`   | Create         | `useSWRMutation(url, postFetcher)`   |
| PUT    | `putFetcher`    | Update         | `useSWRMutation(url, putFetcher)`    |
| PATCH  | `patchFetcher`  | Partial update | `useSWRMutation(url, patchFetcher)`  |
| DELETE | `deleteFetcher` | Delete         | `useSWRMutation(url, deleteFetcher)` |
| Any    | `apiCall`       | Direct call    | `await apiCall(url, method, data)`   |

---

## 🚀 Migration from Old Code

### Before (Manual fetch):

```javascript
const [data, setData] = useState(null);

useEffect(() => {
  fetch(url)
    .then((res) => res.json())
    .then(setData);
}, [url]);
```

### After (SWR):

```javascript
const { data } = useSWR(url, fetcher);
```

### Before (Manual mutation):

```javascript
const handleSubmit = async () => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
};
```

### After (SWR Mutation):

```javascript
const { trigger } = useSWRMutation(url, postFetcher);
const handleSubmit = () => trigger({ data });
```

---

## 📞 Support

For more examples, see:

- `lib/swr-usage-examples.js` - 15+ comprehensive examples
- `lib/table-service.js` - Production implementation
- `components/restaurant-menu-client.jsx` - Real usage in components

---

**Happy coding! 🎉**
