# Restaurant Admin Panel - Complete Documentation

## 🎉 Overview

A comprehensive, full-featured Restaurant Admin Panel built with **Next.js 15**, **React 19**, **ShadCN UI**, and **SWR** for data management. This admin panel provides complete control over restaurant operations with real-time updates, analytics, and intuitive management interfaces.

## ✨ Features Implemented

### 1. **Dashboard** (`/admin/dashboard`)

- **Real-time KPI Cards:**

  - Total Revenue (with growth indicators)
  - Total Orders
  - Average Order Value
  - Active Tables
  - Order Status Breakdown (Pending, Preparing, Completed, Cancelled)

- **Interactive Charts:**

  - Revenue Over Time (Line Chart)
  - Top Selling Menu Items (Bar Chart)
  - Payment Methods Distribution (Pie Chart)
  - Detailed Top Items Table

- **Filters:**
  - Date Range (Today / Last 7 Days / Last 30 Days)
  - Restaurant Branch Selection

### 2. **Orders Management** (`/admin/orders`)

- **Tabbed Navigation:**

  - All Orders
  - Pending (Created)
  - Preparing
  - Ready
  - Completed
  - Cancelled

- **Features:**

  - Real-time order updates (5-second polling)
  - Order status management with visual indicators
  - Quick action buttons (Accept, Start Preparing, Mark Ready, Cancel)
  - Detailed order view in slide-out sheet
  - Order items breakdown with calculations
  - Table information
  - Order notes and timestamps

- **Status Colors:**
  - Created: Orange
  - Accepted: Blue
  - Preparing: Purple
  - Ready: Green
  - Served: Gray
  - Completed: Dark Green
  - Cancelled: Red
  - Rejected: Dark Red

### 3. **Tables Management** (`/admin/tables`)

- **Live Table Status:**

  - Available (Green)
  - Occupied (Red)
  - Reserved (Blue)
  - Cleaning (Yellow)

- **Statistics Cards:**

  - Total Tables
  - Available Tables
  - Occupied Tables
  - Reserved Tables

- **QR Code Generation:**

  - Dynamic QR code for each table
  - Download QR codes as PNG
  - Scan to view menu and place orders

- **CRUD Operations:**
  - Create new tables
  - Edit table details (number, capacity, location, status)
  - Delete tables
  - Assign tables to restaurants

### 4. **Menu Management** (`/admin/menu`)

- **Menu Items:**

  - Grid view with images
  - Create, Read, Update, Delete operations
  - Image upload support
  - Fields: Name, Description, Price, Category, Restaurant
  - Additional attributes: Vegetarian, Available, Preparation Time
  - Availability toggle
  - Category filtering
  - Search functionality

- **Categories:**
  - Visual category management
  - Active/Inactive status
  - Quick edit and delete
  - CRUD operations

### 5. **Billing & Payments** (`/admin/billing`)

- **Revenue Statistics:**

  - Total Revenue
  - Average Transaction Value
  - Total Transactions

- **Payment Method Breakdown:**

  - Cash (Green)
  - Card (Blue)
  - Online (Purple)
  - UPI (Orange)
  - Transaction count and amount per method

- **Transaction History:**

  - Detailed transaction table
  - Transaction ID tracking
  - Order association
  - Payment method badges
  - Status indicators (Paid, Pending, Failed, Refunded)

- **Export Functionality:**
  - Export to CSV
  - Includes: Transaction ID, Date, Amount, Method, Status, Order Number

### 6. **Analytics & Reports** (`/admin/analytics`)

- **Advanced Charts:**

  - Revenue Trend (Area Chart with dual axes)
  - Top Selling Items (Bar Chart)
  - Payment Methods Distribution (Pie Chart)
  - Peak Order Hours (Hourly Distribution)
  - Order Status Breakdown (Pie Chart)

- **Detailed Reports:**

  - Top 10 Selling Items Table
  - Performance metrics per item
  - Category-wise analysis

- **Filters:**
  - Restaurant selection
  - Date ranges (Today, 7 Days, 30 Days, 90 Days)

### 7. **Customers** (`/admin/customers`)

- **Customer Statistics:**

  - Total Customers
  - Total Revenue from Customers
  - Total Orders
  - Average Spent per Customer

- **Customer List:**

  - Contact information (Phone, Email)
  - Order history
  - Total spent
  - Loyalty points
  - Last visit date
  - Search functionality

- **Customer Details:**
  - Complete profile view
  - Order statistics
  - Favorite items
  - Member since date

### 8. **Restaurant Management** (`/admin/restaurants`)

- **Branch Management:**

  - Create, Edit, Delete restaurants
  - Location tracking
  - Contact information (Phone, Email)
  - Operating hours (Opening/Closing times)
  - Status management (Active, Inactive, Closed)
  - Description field

- **Visual Cards:**
  - Branch information display
  - Status badges
  - Quick edit and delete actions

### 9. **Settings** (`/admin/settings`)

- **Profile Management:**

  - Update name, email, phone
  - Role assignment

- **Security:**

  - Password change functionality
  - Current/New password validation
  - Two-factor authentication (UI ready)
  - Active sessions management
  - Login history

- **Notifications:**

  - New Orders alerts
  - Order Updates notifications
  - Low Stock alerts
  - Daily/Weekly reports preferences

- **Application Settings:**
  - Language selection
  - Timezone configuration
  - Currency preferences
  - Date format options

## 🏗️ Technical Architecture

### File Structure

```
/app/admin/
├── layout.jsx                 # Admin layout wrapper
├── dashboard/page.jsx         # Dashboard with KPIs & charts
├── orders/page.jsx            # Orders management
├── tables/page.jsx            # Tables & QR codes
├── menu/page.jsx              # Menu items & categories
├── billing/page.jsx           # Billing & payments
├── analytics/page.jsx         # Analytics & reports
├── customers/page.jsx         # Customer management
├── restaurants/page.jsx       # Restaurant branches
└── settings/page.jsx          # Settings & preferences

/components/admin/
└── admin-layout.jsx           # Sidebar navigation layout

/hooks/
└── useAdmin.js                # Custom SWR hooks for data fetching

/lib/
├── admin-api.js               # Admin API service layer
├── api.js                     # Base API configuration
├── cart-api.js                # Cart/Order operations
└── swr-config.js              # SWR configuration

/components/ui/
├── button.jsx                 # ShadCN Button component
├── card.jsx                   # ShadCN Card component
├── badge.jsx                  # ShadCN Badge component
├── input.jsx                  # ShadCN Input component
├── label.jsx                  # ShadCN Label component
├── select.jsx                 # ShadCN Select component
├── sheet.jsx                  # ShadCN Sheet component
├── alert.jsx                  # ShadCN Alert component
└── toast-provider.jsx         # Toast notifications
```

### Technology Stack

- **Framework:** Next.js 15 (App Router)
- **React:** v19
- **UI Library:** ShadCN UI (Radix UI primitives)
- **Styling:** Tailwind CSS v4
- **Data Fetching:** SWR (Stale-While-Revalidate)
- **Charts:** Recharts
- **Forms:** React Hook Form (ready for integration)
- **Date Handling:** date-fns
- **QR Codes:** qrcode.react
- **Notifications:** react-hot-toast
- **Icons:** Lucide React

### API Integration

**Base URL:** `https://restaurant-tms-strapi.onrender.com/api`

**Endpoints Used:**

- `/orders` - Order management
- `/restaurants` - Restaurant branches
- `/tables` - Table management
- `/menu-items` - Menu items
- `/categories` - Categories
- `/payments` - Payment transactions
- `/customers` - Customer data
- `/staff` - Staff management
- `/upload` - Image uploads

**Authentication:**

- Token stored in `localStorage` as `admin_token`
- Bearer token authentication
- Automatic header injection

### Data Fetching Strategy

**SWR Configuration:**

- Real-time updates with configurable refresh intervals
- Optimistic UI updates
- Automatic revalidation
- Error handling and retry logic
- Mutation hooks for CRUD operations

**Custom Hooks:**

- `useOrders(filters, refreshInterval)` - Orders with real-time updates
- `useDashboardMetrics(filters)` - Dashboard KPIs
- `useRevenueData(filters)` - Revenue analytics
- `useTopSellingItems(filters, limit)` - Top items
- `usePaymentBreakdown(filters)` - Payment analytics
- `useMenuItems(filters)` - Menu items
- `useCategories()` - Categories
- `useTables(filters, refreshInterval)` - Tables
- `useCustomers(filters)` - Customers
- `usePayments(filters)` - Payments
- `useRestaurants(filters)` - Restaurants
- `useStaff(filters)` - Staff members

### Design System

**Color Palette:**

- Primary: `#1976d2` (Blue)
- Secondary: `#dc004e` (Pink)
- Success: `#4caf50` (Green)
- Warning: `#ff9800` (Orange)
- Error: `#f44336` (Red)
- Info: `#2196f3` (Blue)

**Status Colors:**

- Available/Success: Green shades
- Warning/Pending: Orange/Yellow shades
- Error/Cancelled: Red shades
- Info/Processing: Blue/Purple shades

## 🚀 Getting Started

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Running the Admin Panel

```bash
npm run dev
```

Navigate to: `http://localhost:3000/admin/dashboard`

### Authentication

Currently, authentication is token-based. To set a token:

```javascript
import { setAuthToken } from "@/lib/admin-api";
setAuthToken("your-bearer-token");
```

Or manually in browser console:

```javascript
localStorage.setItem("admin_token", "your-bearer-token");
```

## 📊 Usage Examples

### Viewing Dashboard

1. Navigate to `/admin/dashboard`
2. Select date range filter (Today, Last 7 Days, Last 30 Days)
3. View KPIs and charts
4. Analyze revenue trends and top-selling items

### Managing Orders

1. Go to `/admin/orders`
2. View orders by status (All, Pending, Preparing, etc.)
3. Click "View Details" to see full order information
4. Use action buttons to update order status
5. Real-time updates every 5 seconds

### Creating Menu Items

1. Navigate to `/admin/menu`
2. Click "Add Menu Item"
3. Fill in details (name, description, price, category)
4. Upload an image
5. Set availability and dietary options
6. Click "Create"

### Generating QR Codes

1. Go to `/admin/tables`
2. Click "QR Code" on any table card
3. View or download the QR code
4. Print for table placement

### Exporting Reports

1. Visit `/admin/billing`
2. Select date range
3. Click "Export CSV"
4. Data downloads with all transaction details

## 🎨 Customization

### Changing Colors

Edit in your CSS or Tailwind config:

```javascript
// Status colors in components
const statusConfig = {
  active: { color: "bg-green-500" },
  inactive: { color: "bg-gray-500" },
};
```

### Adding New Filters

Add to the component:

```javascript
const [customFilter, setCustomFilter] = useState("");
const filters = useMemo(
  () => ({
    ...existingFilters,
    customFilter,
  }),
  [existingFilters, customFilter]
);
```

### Modifying Refresh Intervals

Update in hooks:

```javascript
const { orders } = useOrders(filters, 10000); // 10 seconds
```

## 🔧 Advanced Features

### Real-time Updates

- Orders page auto-refreshes every 5 seconds
- Dashboard metrics refresh every 30 seconds
- Tables can have custom refresh rates

### Responsive Design

- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly action buttons
- Responsive charts and tables

### Performance Optimizations

- Lazy loading with Next.js
- Optimistic UI updates
- Request deduplication with SWR
- Image optimization with Next.js Image

### Error Handling

- Toast notifications for all actions
- Graceful error states
- Retry logic for failed requests
- Loading states

## 📝 Future Enhancements

Potential additions:

- [ ] Staff management module
- [ ] Inventory tracking
- [ ] Advanced role-based permissions
- [ ] Real-time WebSocket updates
- [ ] Advanced filtering and search
- [ ] Bulk operations
- [ ] Email notifications
- [ ] PDF report generation
- [ ] Multi-language support
- [ ] Dark mode toggle

## 🐛 Known Issues

None at the moment. Please report any issues you encounter.

## 📄 License

This project is part of the restaurant management system.

## 👨‍💻 Development

Built with ❤️ using modern web technologies for a seamless admin experience.

---

**Last Updated:** October 27, 2025
**Version:** 1.0.0
