# Auto-Refresh Configuration Guide

## 🔄 Current Configuration

The admin panel has been configured with **manual refresh** to prevent annoying loading states.

### **What Changed:**

✅ **Auto-refresh DISABLED** by default  
✅ **Manual refresh buttons** added to key pages  
✅ **Smart loading indicators** that don't disrupt the UI  
✅ **Background refresh** shows small spinner, not full page loader

---

## 📊 **Refresh Settings by Page**

| Page        | Auto-Refresh | Manual Refresh             | Notes                          |
| ----------- | ------------ | -------------------------- | ------------------------------ |
| Dashboard   | ❌ Disabled  | ✅ "Refresh Data" button   | Click to update metrics        |
| Orders      | ❌ Disabled  | ✅ "Refresh Orders" button | Click to check new orders      |
| Tables      | ❌ Disabled  | Auto on CRUD               | Updates on create/edit/delete  |
| Menu        | ❌ Disabled  | Auto on CRUD               | Updates on create/edit/delete  |
| Billing     | ❌ Disabled  | Manual via filters         | Refresh by changing date range |
| Analytics   | ❌ Disabled  | Manual via filters         | Refresh by changing filters    |
| Customers   | ❌ Disabled  | N/A                        | Static list                    |
| Restaurants | ❌ Disabled  | Auto on CRUD               | Updates on create/edit/delete  |

---

## 🛠️ **How to Enable Auto-Refresh**

If you want real-time updates (useful for production with live orders):

### **Option 1: Enable for Orders Only**

```javascript
// In app/admin/orders/page.jsx, line 77:
const { orders, isLoading, isValidating, mutate } = useOrders(filters, 5000); // 5 seconds
```

### **Option 2: Enable for Dashboard**

```javascript
// In hooks/useAdmin.js, line 362:
export const useDashboardMetrics = (filters = {}) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ["dashboard-metrics", JSON.stringify(filters)],
    () => getDashboardMetrics(filters),
    {
      refreshInterval: 30000, // 30 seconds
      revalidateOnFocus: false,
    }
  );
  // ...
};
```

### **Option 3: Enable Globally**

Edit `/hooks/useAdmin.js` and change `refreshInterval` values:

```javascript
// Default values (DISABLED):
refreshInterval: 0;

// For real-time updates:
refreshInterval: 5000; // 5 seconds (Orders)
refreshInterval: 10000; // 10 seconds (Tables)
refreshInterval: 30000; // 30 seconds (Dashboard)
refreshInterval: 60000; // 1 minute (Analytics)
```

---

## 🎯 **Recommended Settings**

### **For Development:**

✅ **Current setup** (manual refresh only)

- No annoying loading states
- Faster development
- Less API calls
- Full control

### **For Production (Restaurant Kitchen):**

```javascript
// Orders page - Real-time for kitchen
useOrders(filters, 5000); // Refresh every 5 seconds

// Dashboard - Moderate updates
refreshInterval: 30000; // Refresh every 30 seconds

// Other pages - Keep disabled
// Use manual refresh buttons
```

---

## 🔧 **Configuration Files**

### **Main Hook File:**

`/hooks/useAdmin.js`

- Contains all data fetching hooks
- Modify `refreshInterval` parameter
- Lines to edit: 54, 362

### **Pages Using Auto-Refresh:**

- `/app/admin/dashboard/page.jsx` (line 99)
- `/app/admin/orders/page.jsx` (line 77)

---

## 💡 **Best Practices**

1. **Use auto-refresh only where needed**

   - Kitchen/Order management: YES
   - Reports/Analytics: NO
   - Settings: NO

2. **Set appropriate intervals**

   - Critical data (orders): 5-10 seconds
   - Metrics (dashboard): 30-60 seconds
   - Historical data: Manual only

3. **Use `isValidating` for UI feedback**

   - Shows small spinner during background refresh
   - Doesn't block the UI
   - Better UX than full page loader

4. **Manual refresh buttons**
   - Give users control
   - Reduces unnecessary API calls
   - Better for slow connections

---

## 🚀 **Quick Enable/Disable**

### **To Enable Real-Time Orders:**

**File:** `app/admin/orders/page.jsx`

**Line 77, change:**

```javascript
const { orders, isLoading, isValidating, mutate } = useOrders(filters, 0);
```

**To:**

```javascript
const { orders, isLoading, isValidating, mutate } = useOrders(filters, 5000);
```

**Result:** Orders will automatically refresh every 5 seconds

---

### **To Enable Real-Time Dashboard:**

**File:** `hooks/useAdmin.js`

**Line 362, change:**

```javascript
refreshInterval: 0, // Disabled auto-refresh
```

**To:**

```javascript
refreshInterval: 30000, // Refresh every 30 seconds
```

**Result:** Dashboard will automatically refresh every 30 seconds

---

## 📱 **Mobile Considerations**

For mobile/tablet users:

- ✅ Keep auto-refresh **disabled**
- ✅ Use manual refresh buttons
- ✅ Save battery and data
- ✅ Better performance

For desktop kitchen displays:

- ✅ Enable auto-refresh for **Orders only**
- ✅ Set to 5-10 seconds
- ✅ Keep other pages manual

---

## 🐛 **Troubleshooting**

### **Problem: Still seeing loading states**

**Solution:** Clear browser cache and reload

```bash
# In browser DevTools:
# Application > Storage > Clear Site Data
```

### **Problem: Data not updating**

**Solution:** Click the "Refresh" button or:

- Change date range filters
- Switch between tabs
- Perform CRUD operations (auto-refreshes)

### **Problem: Too many API calls**

**Solution:** Increase refresh interval or disable:

```javascript
refreshInterval: 0; // Disable completely
```

---

## 📚 **Related Documentation**

- SWR Documentation: https://swr.vercel.app/
- React Hook Best Practices
- Admin Panel Architecture

---

**Last Updated:** October 27, 2025  
**Version:** 2.0.0
