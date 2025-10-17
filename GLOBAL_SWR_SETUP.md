# 🚀 Global SWR Setup - Complete Implementation

## ✅ What Was Fixed & Improved

### 1. **Fixed Next.js 15 Params Issue** ✅

- **Problem**: `params` needs to be awaited in Next.js 15
- **Solution**: Changed `page.jsx` to async function and await params

```javascript
// Before
export default function RestaurantPage({ params }) {
  const { restaurantId, tableId } = params;

// After
export default async function RestaurantPage({ params }) {
  const { restaurantId, tableId } = await params;
```

### 2. **Enhanced Global SWR Configuration** ✅

- Created comprehensive global fetchers for all HTTP methods
- Added flexible data passing with URL and data support
- Implemented better error handling

---

## 📁 New Files Created

### 1. **`lib/swr-config.js`** (Enhanced)

Global SWR utilities with:

#### Fetchers Available:

```javascript
// GET requests
export const fetcher = async (url, options = {}) => { ... }

// Mutation requests
export const mutationFetcher = async (url, { arg }) => { ... }
export const postFetcher = createMutationFetcher("POST")
export const putFetcher = createMutationFetcher("PUT")
export const patchFetcher = createMutationFetcher("PATCH")
export const deleteFetcher = createMutationFetcher("DELETE")

// Direct API calls (non-SWR)
export const apiCall = async (url, method, data, headers) => { ... }
```

#### Pre-configured Options:

- `swrConfig` - Default configuration
- `realtimeSwrConfig` - Auto-refresh every 5s
- `staticSwrConfig` - Rarely changing data
- `mutationConfig` - Mutation settings

### 2. **`lib/swr-usage-examples.js`**

15+ comprehensive examples including:

- Simple GET requests
- POST/PUT/PATCH/DELETE operations
- Custom headers
- Optimistic UI updates
- Pagination
- Error handling
- Dependent requests
- Real-world table service example

### 3. **`lib/SWR_GUIDE.md`**

Complete documentation with:

- Quick start guide
- All available fetchers
- Common patterns
- Best practices
- Migration guide
- Comparison table

---

## 🔧 Updated Files

### **`lib/table-service.js`**

Now uses global `apiCall` function:

```javascript
import { apiCall } from "./swr-config";

export async function updateTableStatus(tableId, status) {
  return await apiCall(
    `${API_BASE_URL}/tables/${tableId}`,
    "PUT",
    { data: { statuss: status } }
  );
}

// Mutation functions for useSWRMutation
export const callWaiterMutation = async (url, { arg }) => { ... }
export const requestBillMutation = async (url, { arg }) => { ... }
```

### **`components/restaurant-menu-client.jsx`**

Now imports mutations from table-service:

```javascript
import { callWaiterMutation, requestBillMutation } from "@/lib/table-service";

// Usage
const { trigger: triggerCallWaiter } = useSWRMutation(
  "call-waiter",
  callWaiterMutation
);

await triggerCallWaiter({ tableId });
```

---

## 🎯 Usage Examples

### Example 1: Simple GET Request

```javascript
import useSWR from "swr";
import { fetcher } from "@/lib/swr-config";

const { data, error, isLoading } = useSWR("/api/data", fetcher);
```

### Example 2: POST Request

```javascript
import useSWRMutation from "swr/mutation";
import { postFetcher } from "@/lib/swr-config";

const { trigger, isMutating } = useSWRMutation("/api/items", postFetcher);

await trigger({
  data: { name: "New Item", price: 100 },
});
```

### Example 3: PUT Request

```javascript
import { putFetcher } from "@/lib/swr-config";

const { trigger } = useSWRMutation(`/api/items/${id}`, putFetcher);

await trigger({
  data: { name: "Updated", price: 200 },
});
```

### Example 4: DELETE Request

```javascript
import { deleteFetcher } from "@/lib/swr-config";

const { trigger } = useSWRMutation(`/api/items/${id}`, deleteFetcher);

await trigger({ data: null });
```

### Example 5: Custom Headers

```javascript
import { mutationFetcher } from "@/lib/swr-config";

const { trigger } = useSWRMutation(url, mutationFetcher);

await trigger({
  method: "POST",
  data: { message: "Hello" },
  headers: {
    Authorization: "Bearer token",
    "X-Custom-Header": "value",
  },
});
```

### Example 6: Direct API Call (Non-SWR)

```javascript
import { apiCall } from "@/lib/swr-config";

// GET
const data = await apiCall("/api/data", "GET");

// POST
const created = await apiCall("/api/items", "POST", { name: "Item" });

// PUT with headers
const updated = await apiCall(
  "/api/items/123",
  "PUT",
  { name: "Updated" },
  { Authorization: "Bearer token" }
);
```

---

## 🏗️ Architecture

```
lib/
├── swr-config.js          # Global SWR configuration
├── swr-usage-examples.js  # 15+ usage examples
├── SWR_GUIDE.md          # Complete documentation
├── api.js                # API functions (menu, restaurant)
└── table-service.js      # Table service (uses global config)

components/
└── restaurant-menu-client.jsx  # Uses SWR mutations

app/
└── [restaurantId]/[tableId]/
    └── page.jsx          # Fixed async params
```

---

## ✨ Key Features

### 1. **Flexible Data Passing**

```javascript
// Pass URL and data
await trigger({
  data: { key: "value" },
  method: "POST",
  headers: { ... }
});
```

### 2. **Multiple HTTP Methods**

- ✅ GET (fetcher)
- ✅ POST (postFetcher)
- ✅ PUT (putFetcher)
- ✅ PATCH (patchFetcher)
- ✅ DELETE (deleteFetcher)
- ✅ Custom (mutationFetcher)

### 3. **Error Handling**

```javascript
const error = {
  message: "Error message",
  info: {
    /* Response data */
  },
  status: 404, // HTTP status
};
```

### 4. **Pre-configured Options**

- Default config with retry logic
- Real-time config (5s refresh)
- Static config (no revalidation)
- Mutation config with logging

---

## 🎨 Best Practices

### ✅ DO:

- Use global fetchers for consistency
- Pass data via `trigger({ data: ... })`
- Handle loading states (`isLoading`, `isMutating`)
- Use conditional fetching for dependent data
- Implement optimistic UI updates

### ❌ DON'T:

- Create custom fetchers for standard operations
- Forget error handling
- Mix SWR and non-SWR data fetching patterns
- Ignore loading/error states

---

## 📊 Before vs After

### Before:

```javascript
// Manual mutation in component
async function callWaiterMutation(url, { arg }) {
  return callWaiter(Number.parseInt(arg.tableId));
}

// Manual fetch
const response = await fetch(url, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

### After:

```javascript
// Reusable mutation from lib
import { callWaiterMutation } from "@/lib/table-service";

const { trigger } = useSWRMutation("call-waiter", callWaiterMutation);
await trigger({ tableId });

// Or use global apiCall
import { apiCall } from "@/lib/swr-config";
const result = await apiCall(url, "PUT", data);
```

---

## 🚀 Quick Reference

| Task   | Import          | Usage                                |
| ------ | --------------- | ------------------------------------ |
| GET    | `fetcher`       | `useSWR(url, fetcher)`               |
| POST   | `postFetcher`   | `useSWRMutation(url, postFetcher)`   |
| PUT    | `putFetcher`    | `useSWRMutation(url, putFetcher)`    |
| PATCH  | `patchFetcher`  | `useSWRMutation(url, patchFetcher)`  |
| DELETE | `deleteFetcher` | `useSWRMutation(url, deleteFetcher)` |
| Direct | `apiCall`       | `await apiCall(url, method, data)`   |

---

## 📝 Testing

```bash
# Build succeeded ✅
npm run build

# Output:
Route (app)                           Size    First Load JS
┌ ○ /                                146 B   101 kB
├ ○ /_not-found                      146 B   101 kB
└ ƒ /[restaurantId]/[tableId]      23.5 kB   160 kB
```

---

## 🔗 Related Files

- **Documentation**: `lib/SWR_GUIDE.md`
- **Examples**: `lib/swr-usage-examples.js`
- **Configuration**: `lib/swr-config.js`
- **Implementation**: `lib/table-service.js`
- **Usage**: `components/restaurant-menu-client.jsx`

---

## 🎉 Benefits

1. ✅ **Centralized** - All fetch logic in one place
2. ✅ **Reusable** - Import and use anywhere
3. ✅ **Type-safe** - JSDoc comments for IntelliSense
4. ✅ **Flexible** - Pass URL, data, headers easily
5. ✅ **Error handling** - Built-in error management
6. ✅ **Logging** - Global success/error logging
7. ✅ **Optimized** - Deduplication, caching, retry logic

---

**🚀 Your global SWR setup is now complete and production-ready!**
