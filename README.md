# 🍽️ DineEase - Digital Restaurant Experience

A modern, responsive restaurant menu and table management system built with **Next.js 15** (App Router), **JavaScript**, **SWR**, and **Framer Motion**.

## ✨ Features

### 🎨 Modern UI/UX

- **Gradient Design**: Beautiful gradient backgrounds and color schemes (orange, pink, purple)
- **Smooth Animations**: Powered by Framer Motion for fluid transitions
- **Responsive Layout**: Optimized for mobile, tablet, and desktop devices
- **Dark Mode Ready**: Modern color system with dark mode support
- **Accessibility**: Built with accessibility best practices in mind

### 📱 Core Functionality

- **Real-time Menu Display**: Browse restaurant menu with categories
- **Search Functionality**: Instantly search for menu items
- **View Modes**: Switch between grid and list view
- **Image Gallery**: View menu images in an interactive gallery
- **Table Services**:
  - Call waiter with animated feedback
  - Request bill with progress indicators
- **Loading States**: Beautiful loading screens and skeletons

### 🔧 Technical Features

- **SWR Data Fetching**: Client-side data fetching with caching and revalidation
- **Optimized Performance**: Image optimization with Next.js Image component
- **SEO Optimized**: Meta tags and structured data
- **Error Handling**: Graceful error states and fallbacks

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   cd restaurant-forntnend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
restaurant-forntnend/
├── app/                          # Next.js App Router
│   ├── [restaurantId]/          # Dynamic restaurant routes
│   │   └── [tableId]/           # Dynamic table routes
│   │       ├── page.jsx         # Table menu page
│   │       ├── loading.jsx      # Loading state
│   │       └── not-found.jsx    # 404 page
│   ├── layout.jsx               # Root layout
│   ├── page.jsx                 # Home page (redirects)
│   ├── loading.jsx              # Global loading
│   ├── not-found.jsx            # Global 404
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── restaurant-menu-client.jsx  # Main menu component
│   ├── loading-screen.jsx       # Loading screen component
│   └── ui/                      # UI components (ShadCN)
│       ├── button.jsx
│       ├── card.jsx
│       ├── input.jsx
│       ├── label.jsx
│       ├── select.jsx
│       ├── alert.jsx
│       ├── badge.jsx
│       └── sheet.jsx
├── lib/                         # Utility functions
│   ├── api.js                   # API functions
│   ├── table-service.js         # Table service functions
│   ├── swr-config.js            # SWR configuration
│   └── utils.js                 # Helper utilities
├── public/                      # Static assets
├── next.config.js              # Next.js configuration
├── jsconfig.json               # JavaScript configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🔌 API Integration

### SWR Setup

The project uses SWR for efficient data fetching:

```javascript
// lib/swr-config.js - SWR configuration
export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  dedupingInterval: 2000,
};
```

### API Endpoints

The app connects to a Strapi backend:

- **Base URL**: `https://restaurant-tms-strapi.onrender.com/api`
- **Menu Items**: `/menu-items?filters[restaurant][id][$eq]={id}&populate=*`
- **Restaurant**: `/restaurants/{id}?populate=deep`
- **Table Status**: `/tables/{id}` (PUT)

### Example Usage

```javascript
import useSWR from "swr";

const { data, error, isLoading } = useSWR(`menu-${restaurantId}`, () =>
  fetchMenuItems(restaurantId)
);
```

## 🎨 UI Components

### Framer Motion Animations

```javascript
// Example: Animated header
<motion.header
  initial={{ y: -100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  {/* Header content */}
</motion.header>
```

### ShadCN UI Components

The project uses customized ShadCN UI components built with:

- Radix UI primitives
- Tailwind CSS for styling
- Class Variance Authority for variants

## 🛠️ Configuration

### Environment Variables

Create a `.env.local` file (optional):

```env
NEXT_PUBLIC_API_URL=https://restaurant-tms-strapi.onrender.com/api
```

### Image Optimization

Images are configured in `next.config.js`:

```javascript
images: {
  formats: ['image/webp', 'image/avif'],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'restaurant-tms-strapi.onrender.com',
    },
  ],
}
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🧪 Testing the Application

1. **Navigate to a restaurant/table**:

   ```
   http://localhost:3000/5/7
   ```

2. **Test Features**:
   - Search for menu items
   - Switch between grid/list view
   - Toggle image visibility
   - View image gallery
   - Call waiter (with animation)
   - Request bill (with animation)

## 📦 Dependencies

### Core

- **Next.js 15.2.4** - React framework
- **React 19** - UI library
- **SWR 2.3.6** - Data fetching

### UI & Styling

- **Tailwind CSS 4.1.12** - Utility-first CSS
- **Framer Motion 11.15.3** - Animation library
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **Class Variance Authority** - Component variants
- **tw-animate-css** - Additional animations

## 🚧 Migration from TypeScript

This project was successfully migrated from TypeScript to JavaScript:

### Changes Made:

1. ✅ Removed all TypeScript dependencies (`typescript`, `@types/*`)
2. ✅ Converted all `.ts`/`.tsx` files to `.js`/`.jsx`
3. ✅ Removed type annotations and interfaces
4. ✅ Updated configuration files (ESLint, Next.js)
5. ✅ Created `jsconfig.json` for better IntelliSense
6. ✅ Added Framer Motion for modern animations
7. ✅ Enhanced UI with smooth transitions

### Why JavaScript?

- Simpler developer experience
- Faster build times
- No type checking overhead
- Better for rapid prototyping
- Still maintains code quality with ESLint

## 🎯 Performance Optimizations

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **CSS**: Tailwind CSS with purging unused styles
- **Caching**: SWR with deduplication and revalidation
- **Lazy Loading**: Components load on-demand

## 🔐 Security

- No sensitive data exposed in client
- API calls through server components where possible
- Input validation and sanitization
- CORS properly configured on backend

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ using Next.js, SWR, and Framer Motion**
