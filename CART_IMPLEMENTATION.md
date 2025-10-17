# 🛒 Cart Implementation Guide

## Overview

This document describes the complete cart and ordering system implemented for the restaurant frontend application. The system integrates with Strapi backend API to manage orders and order items.

---

## 📁 Files Modified/Created

### New Files

- `/lib/cart-api.js` - Complete cart and order management API library

### Modified Files

- `/components/restaurant-menu-client.jsx` - Main component with cart functionality

---

## 🎯 Features Implemented

### ✅ Cart Management

- **Add to Cart** - Add menu items with automatic quantity increment for existing items
- **Update Quantity** - Increase/decrease item quantities with +/- buttons
- **Remove Items** - Delete items from cart with trash icon
- **Persistent Cart** - Cart persists across page refreshes (fetched from backend)

### ✅ Order Management

- **Auto Order Creation** - Creates order automatically when first item is added
- **Order Status Tracking** - Tracks order through various states (created, accepted, etc.)
- **Order Submission** - Submit order to kitchen with table status update
- **Order Number Display** - Shows unique order number in cart

### ✅ UI/UX Features

- **Floating Cart Button** - Fixed position cart button with item count badge
- **Slide-in Drawer** - Beautiful animated cart drawer from right side
- **Toast Notifications** - Success toast when items are added to cart
- **Real-time Total** - Live calculation of cart total
- **Loading States** - Visual feedback during API operations
- **Success Animation** - Celebration animation when order is placed
- **Empty State** - Elegant empty cart message
- **Responsive Design** - Works perfectly on mobile and desktop

---

## 🔌 API Integration

### Endpoints Used

#### 1. **Create Order**

```javascript
POST /api/orders
{
  "data": {
    "order_number": "ORD-1234567890",
    "table": tableId,
    "payment_status": "pending",
    "fulfillment": "dine_in",
    "status": "created"
  }
}
```

#### 2. **Get Active Order**

```javascript
GET /api/orders?filters[table][id][$eq]={tableId}&filters[status][$ne]=completed&filters[status][$ne]=cancelled&populate[order_items][populate][menu_item][populate][image]=*&sort=createdAt:desc&pagination[limit]=1
```

#### 3. **Add Order Item**

```javascript
POST /api/order-items
{
  "data": {
    "order": orderId,
    "menu_item": menuItemId,
    "quantity": "2",
    "price": "15.99"
  }
}
```

#### 4. **Update Order Item**

```javascript
PUT /api/order-items/{orderItemId}
{
  "data": {
    "quantity": "3"
  }
}
```

#### 5. **Delete Order Item**

```javascript
DELETE / api / order - items / { orderItemId };
```

#### 6. **Submit Order**

```javascript
PUT /api/orders/{orderId}
{
  "data": {
    "status": "accepted"
  }
}

PUT /api/tables/{tableId}
{
  "data": {
    "statuss": "occupied"
  }
}
```

---

## 🎨 UI Components

### 1. Add to Cart Button

Located on each menu item card:

```jsx
<button
  onClick={() => handleAddToCart(item)}
  className="w-full mt-2 py-2 px-3 bg-gradient-to-r from-orange-500 to-pink-500..."
>
  <Plus className="w-3 h-3" />
  Add to Cart
</button>
```

### 2. Floating Cart Button

Fixed position button in bottom-right:

- Shows shopping cart icon
- Red badge with item count
- Bouncy animation on mount
- Opens cart drawer on click

### 3. Toast Notification

Bottom-center notification that appears when item is added:

- Green gradient background
- Shows item name
- "View" button to open cart
- Auto-dismisses after 3 seconds

### 4. Cart Drawer

Full-height drawer that slides from right:

**Header:**

- Restaurant branding colors
- Cart title and item count
- Close button

**Body:**

- Scrollable list of cart items
- Each item shows:
  - Image (if available)
  - Name and price
  - Quantity controls (-/+)
  - Remove button (trash icon)
  - Item total

**Footer (when cart has items):**

- Subtotal display
- Grand total in orange
- Order number info box
- Large "Place Order" button with loading states

---

## 🔄 User Flow

### Flow 1: Customer Orders for the First Time

```
1. Customer scans QR code → Lands on menu page
2. Customer browses menu items by category
3. Customer clicks "Add to Cart" on an item
4. System:
   - Creates a new order (status: "created")
   - Adds item as order_item
   - Shows success toast
5. Cart button badge updates to show "1"
6. Customer adds more items (each click increments or adds new items)
7. Customer clicks cart button → Cart drawer opens
8. Customer reviews items, adjusts quantities
9. Customer clicks "Place Order"
10. System:
    - Updates order status to "accepted"
    - Updates table status to "occupied"
    - Shows success message
11. Cart clears, order goes to kitchen
```

### Flow 2: Customer Has Existing Order

```
1. Customer opens menu (already has active order)
2. System:
   - Fetches active order on mount
   - Loads existing cart items
   - Cart badge shows existing item count
3. Customer can continue adding items to same order
4. Previous items remain in cart
```

---

## 🛠️ Functions Reference

### Cart API Functions (`/lib/cart-api.js`)

| Function                                             | Purpose                       |
| ---------------------------------------------------- | ----------------------------- |
| `createOrder(tableId)`                               | Creates new order for table   |
| `getActiveOrder(tableId)`                            | Fetches existing active order |
| `addOrderItem(orderId, menuItemId, quantity, price)` | Adds item to order            |
| `updateOrderItemQuantity(orderItemId, quantity)`     | Updates item quantity         |
| `removeOrderItem(orderItemId)`                       | Deletes item from order       |
| `submitOrder(orderId, tableId)`                      | Submits order to kitchen      |
| `calculateOrderTotal(orderItems)`                    | Calculates cart total         |

### Component Functions (`restaurant-menu-client.jsx`)

| Function                                       | Purpose                      |
| ---------------------------------------------- | ---------------------------- |
| `handleAddToCart(menuItem)`                    | Adds/increments item in cart |
| `handleUpdateQuantity(orderItem, newQuantity)` | Updates item quantity        |
| `handleRemoveFromCart(orderItem)`              | Removes item from cart       |
| `handleSubmitOrder()`                          | Submits complete order       |

---

## 🎯 State Management

### Cart State Variables

```javascript
const [cartOpen, setCartOpen] = useState(false); // Drawer open/closed
const [currentOrder, setCurrentOrder] = useState(null); // Current order object
const [cartItems, setCartItems] = useState([]); // Array of order items
const [cartLoading, setCartLoading] = useState(false); // Loading state
const [orderSubmitting, setOrderSubmitting] = useState(false); // Submit in progress
const [orderSuccess, setOrderSuccess] = useState(false); // Order submitted
const [showAddToCartToast, setShowAddToCartToast] = useState(false); // Toast visibility
const [lastAddedItem, setLastAddedItem] = useState(null); // Last added item info
```

### Computed Values

```javascript
const cartTotal = calculateOrderTotal(cartItems);           // Total price
const cartItemCount = cartItems.reduce(...);                // Total item count
```

---

## 🎭 Animations

All animations use **Framer Motion**:

1. **Cart Button**: Scale animation on mount
2. **Cart Badge**: Pop animation when count updates
3. **Drawer**: Slide-in from right with spring physics
4. **Cart Items**: Fade and slide from right
5. **Toast**: Slide up from bottom
6. **Submit Button**: Loading spinner, success checkmark

---

## 💡 Key Design Decisions

### 1. **Optimistic Updates**

Cart UI updates immediately, then syncs with backend. If API call fails, shows error and can rollback.

### 2. **Smart Quantity Management**

- Clicking "Add to Cart" on same item increments quantity
- No duplicate items in cart
- Quantity becomes 0 → item auto-removed

### 3. **Order Lifecycle**

```
created (cart) → accepted (kitchen) → preparing → ready → served → completed
```

### 4. **Table Status Integration**

- Adding first item: table remains current status
- Submitting order: table → "occupied"
- This prevents staff interference during ordering

### 5. **Error Handling**

- All API calls wrapped in try-catch
- User-friendly error messages
- Loading states prevent double-clicks

---

## 🎨 Styling & Theme

### Colors

- **Primary**: Orange to Pink gradient (`from-orange-500 to-pink-500`)
- **Success**: Green to Emerald (`from-green-500 to-emerald-600`)
- **Error**: Red tones
- **Neutral**: Gray scale for text and borders

### Design Patterns

- Rounded corners: `rounded-xl`, `rounded-2xl`
- Shadows: `shadow-lg`, `shadow-2xl`, `shadow-3xl`
- Backdrop blur: `backdrop-blur-sm`, `backdrop-blur-md`
- Gradients: Consistent orange-pink theme
- Transitions: `transition-all duration-300`

---

## 📱 Responsive Design

### Mobile (< 640px)

- Cart drawer: Full width
- Floating button: Right side, above bottom nav
- Toast: Centered, smaller padding
- Item cards: Grid with 2 columns

### Desktop (> 640px)

- Cart drawer: 384px width (sm:w-96)
- Floating button: Right side with margin
- Toast: Max width with better spacing
- Item cards: 5-6 columns

---

## 🔧 Customization Guide

### Change Cart Drawer Width

```javascript
// Line 1047 in restaurant-menu-client.jsx
className = "... w-full sm:w-96 ..."; // Change sm:w-96 to desired width
```

### Change Toast Duration

```javascript
// Line 400
setTimeout(() => {
  setShowAddToCartToast(false);
}, 3000); // Change 3000 to desired milliseconds
```

### Change Primary Colors

Find and replace:

- `from-orange-500 to-pink-500` → Your gradient
- `from-orange-600 to-pink-600` → Your hover gradient

### Add Tax/Service Charge

Update the cart footer calculation section:

```javascript
const subtotal = cartTotal;
const tax = subtotal * 0.1; // 10% tax
const serviceCharge = subtotal * 0.05; // 5% service
const total = subtotal + tax + serviceCharge;
```

---

## 🐛 Troubleshooting

### Issue: Cart items not loading

**Solution**: Check if `tableId` prop is being passed correctly. Verify active order API endpoint.

### Issue: Items not adding to cart

**Solution**: Check browser console for API errors. Verify Strapi permissions for orders and order-items.

### Issue: Quantity not updating

**Solution**: Check that order item ID is correct. Verify PUT endpoint is accessible.

### Issue: Order not submitting

**Solution**: Check order status transitions in Strapi. Ensure table status can be updated.

### Issue: Toast not showing

**Solution**: Verify `showAddToCartToast` state is being set. Check z-index conflicts.

---

## 🚀 Future Enhancements

### Recommended Additions:

1. **Order History** - View past orders for the table
2. **Item Notes** - Add special instructions per item
3. **Favorites** - Mark items as favorites
4. **Combo Deals** - Handle package pricing
5. **Split Bill** - Divide order among multiple guests
6. **Real-time Updates** - WebSocket for kitchen status updates
7. **Allergen Info** - Display dietary information
8. **Item Ratings** - Customer reviews and ratings
9. **Discount Codes** - Apply promo codes
10. **Multi-language** - i18n support

---

## 📊 API Call Flow Diagram

```
User Action          │  Frontend                    │  Backend
═════════════════════╪══════════════════════════════╪═══════════════════
Add First Item       │  Check currentOrder          │
                     │  → null, so create order     │  POST /orders
                     │                              │  → Returns order ID
                     │  Add order item              │  POST /order-items
                     │  Show toast notification     │
                     │  Update cart badge           │
─────────────────────┼──────────────────────────────┼───────────────────
Add More Items       │  Check if item exists        │
                     │  → Yes: Update quantity      │  PUT /order-items/{id}
                     │  → No: Add new item          │  POST /order-items
                     │  Show toast notification     │
─────────────────────┼──────────────────────────────┼───────────────────
Change Quantity      │  handleUpdateQuantity()      │  PUT /order-items/{id}
                     │  Update local state          │
─────────────────────┼──────────────────────────────┼───────────────────
Remove Item          │  handleRemoveFromCart()      │  DELETE /order-items/{id}
                     │  Filter from cartItems       │
─────────────────────┼──────────────────────────────┼───────────────────
Submit Order         │  handleSubmitOrder()         │  PUT /orders/{id}
                     │  Show loading spinner        │    (status: accepted)
                     │                              │  PUT /tables/{id}
                     │                              │    (statuss: occupied)
                     │  Show success animation      │
                     │  Clear cart after 3s         │
═════════════════════╧══════════════════════════════╧═══════════════════
```

---

## 🧪 Testing Checklist

- [ ] Add single item to empty cart
- [ ] Add same item multiple times (quantity increments)
- [ ] Add different items to cart
- [ ] Open and close cart drawer
- [ ] Increase item quantity
- [ ] Decrease item quantity
- [ ] Remove item from cart
- [ ] View cart with no items (empty state)
- [ ] Submit order with items
- [ ] Check order appears in backend
- [ ] Check table status updates to "occupied"
- [ ] Refresh page with active order (cart persists)
- [ ] Toast appears when adding items
- [ ] Cart badge shows correct count
- [ ] Cart total calculates correctly
- [ ] Mobile responsive layout works
- [ ] Desktop responsive layout works
- [ ] Loading states display correctly
- [ ] Error handling works (disconnect network)

---

## 📞 Support

For issues or questions about the cart implementation:

1. Check browser console for error messages
2. Verify Strapi API is running and accessible
3. Check API endpoint permissions in Strapi admin
4. Review this documentation for common issues
5. Check network tab for failed API calls

---

## 📝 Notes

- Cart data is stored in backend (Strapi), not localStorage
- Each table can have only one active order at a time
- Order numbers are generated using timestamp: `ORD-{Date.now()}`
- Price is stored at order time (historical pricing)
- Quantity is stored as string in Strapi (API requirement)
- Cart automatically fetches active order on component mount
- Order submission changes status from "created" to "accepted"

---

**Implementation Complete** ✅  
Version: 1.0  
Last Updated: October 17, 2025
