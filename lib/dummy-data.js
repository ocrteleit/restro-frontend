/**
 * Dummy/Fallback Data for Admin Panel
 * Used when API fails or returns empty data
 */

// Dummy Orders
export const dummyOrders = [
  {
    id: 1,
    attributes: {
      order_number: "ORD-001",
      status: "preparing",
      payment_status: "pending",
      fulfillment: "dine_in",
      total_amount: 450,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      table: {
        data: {
          id: 1,
          attributes: {
            table_number: "T-01",
            capacity: 4,
          },
        },
      },
      order_items: {
        data: [
          {
            id: 1,
            attributes: {
              quantity: "2",
              price: "150",
              menu_item: {
                data: {
                  id: 1,
                  attributes: {
                    name: "Chicken Biryani",
                  },
                },
              },
            },
          },
          {
            id: 2,
            attributes: {
              quantity: "1",
              price: "150",
              menu_item: {
                data: {
                  id: 2,
                  attributes: {
                    name: "Paneer Tikka",
                  },
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    id: 2,
    attributes: {
      order_number: "ORD-002",
      status: "ready",
      payment_status: "paid",
      fulfillment: "dine_in",
      total_amount: 320,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
      table: {
        data: {
          id: 2,
          attributes: {
            table_number: "T-02",
            capacity: 2,
          },
        },
      },
      order_items: {
        data: [
          {
            id: 3,
            attributes: {
              quantity: "1",
              price: "200",
              menu_item: {
                data: {
                  id: 3,
                  attributes: {
                    name: "Butter Chicken",
                  },
                },
              },
            },
          },
          {
            id: 4,
            attributes: {
              quantity: "2",
              price: "60",
              menu_item: {
                data: {
                  id: 4,
                  attributes: {
                    name: "Naan",
                  },
                },
              },
            },
          },
        ],
      },
    },
  },
];

// Dummy Tables
export const dummyTables = [
  {
    id: 1,
    attributes: {
      table_number: "T-01",
      capacity: 4,
      status: "occupied",
      location_description: "Near window",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: 2,
    attributes: {
      table_number: "T-02",
      capacity: 2,
      status: "available",
      location_description: "Corner",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: 3,
    attributes: {
      table_number: "T-03",
      capacity: 6,
      status: "reserved",
      location_description: "Center",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: 4,
    attributes: {
      table_number: "T-04",
      capacity: 4,
      status: "available",
      location_description: "Near entrance",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
];

// Dummy Menu Items
export const dummyMenuItems = [
  {
    id: 1,
    attributes: {
      name: "Chicken Biryani",
      description: "Aromatic basmati rice with tender chicken",
      price: 250,
      is_available: true,
      is_vegetarian: false,
      preparation_time: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: {
        data: {
          id: 1,
          attributes: {
            name: "Main Course",
          },
        },
      },
      image: {
        data: {
          attributes: {
            url: "/vibrant-fish-curry.png",
            formats: {
              small: {
                url: "/vibrant-fish-curry.png",
              },
            },
          },
        },
      },
    },
  },
  {
    id: 2,
    attributes: {
      name: "Paneer Tikka",
      description: "Grilled cottage cheese marinated in spices",
      price: 180,
      is_available: true,
      is_vegetarian: true,
      preparation_time: 20,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: {
        data: {
          id: 2,
          attributes: {
            name: "Starters",
          },
        },
      },
    },
  },
  {
    id: 3,
    attributes: {
      name: "Butter Chicken",
      description: "Creamy tomato-based chicken curry",
      price: 280,
      is_available: true,
      is_vegetarian: false,
      preparation_time: 25,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: {
        data: {
          id: 1,
          attributes: {
            name: "Main Course",
          },
        },
      },
    },
  },
];

// Dummy Categories
export const dummyCategories = [
  {
    id: 1,
    attributes: {
      name: "Main Course",
      description: "Hearty main dishes",
      is_active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: 2,
    attributes: {
      name: "Starters",
      description: "Appetizers and snacks",
      is_active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: 3,
    attributes: {
      name: "Desserts",
      description: "Sweet treats",
      is_active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: 4,
    attributes: {
      name: "Beverages",
      description: "Drinks and refreshments",
      is_active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
];

// Dummy Restaurants
export const dummyRestaurants = [
  {
    id: 1,
    attributes: {
      name: "Downtown Restaurant",
      location: "123 Main Street, Downtown",
      phone: "+1 234-567-8900",
      email: "downtown@restaurant.com",
      description: "Fine dining in the heart of the city",
      opening_time: "10:00",
      closing_time: "22:00",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: 2,
    attributes: {
      name: "Beachside Branch",
      location: "456 Beach Road, Seaside",
      phone: "+1 234-567-8901",
      email: "beach@restaurant.com",
      description: "Scenic ocean views",
      opening_time: "09:00",
      closing_time: "23:00",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
];

// Dummy Payments
export const dummyPayments = [
  {
    id: 1,
    attributes: {
      amount: 450,
      payment_method: "card",
      payment_status: "paid",
      transaction_id: "TXN-001",
      payment_date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: {
        data: {
          id: 1,
          attributes: {
            order_number: "ORD-001",
          },
        },
      },
    },
  },
  {
    id: 2,
    attributes: {
      amount: 320,
      payment_method: "cash",
      payment_status: "paid",
      transaction_id: "TXN-002",
      payment_date: new Date(Date.now() - 3600000).toISOString(),
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      order: {
        data: {
          id: 2,
          attributes: {
            order_number: "ORD-002",
          },
        },
      },
    },
  },
  {
    id: 3,
    attributes: {
      amount: 560,
      payment_method: "upi",
      payment_status: "paid",
      transaction_id: "TXN-003",
      payment_date: new Date(Date.now() - 7200000).toISOString(),
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
      order: {
        data: {
          id: 3,
          attributes: {
            order_number: "ORD-003",
          },
        },
      },
    },
  },
];

// Dummy Customers
export const dummyCustomers = [
  {
    id: 1,
    attributes: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234-567-8900",
      total_orders: 15,
      total_spent: 4500,
      loyalty_points: 450,
      last_visit: new Date().toISOString(),
      favorite_items: ["Chicken Biryani", "Butter Chicken"],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: 2,
    attributes: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 234-567-8901",
      total_orders: 8,
      total_spent: 2400,
      loyalty_points: 240,
      last_visit: new Date(Date.now() - 86400000).toISOString(),
      favorite_items: ["Paneer Tikka", "Dal Makhani"],
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  },
  {
    id: 3,
    attributes: {
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1 234-567-8902",
      total_orders: 22,
      total_spent: 6800,
      loyalty_points: 680,
      last_visit: new Date(Date.now() - 172800000).toISOString(),
      favorite_items: ["Butter Chicken", "Chicken Biryani", "Garlic Naan"],
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
  },
];

// Dummy Revenue Data
export const dummyRevenueData = [
  { date: "2025-10-20", revenue: 3500, orders: 15, averageOrderValue: 233.33 },
  { date: "2025-10-21", revenue: 4200, orders: 18, averageOrderValue: 233.33 },
  { date: "2025-10-22", revenue: 3800, orders: 16, averageOrderValue: 237.5 },
  { date: "2025-10-23", revenue: 5100, orders: 22, averageOrderValue: 231.82 },
  { date: "2025-10-24", revenue: 4600, orders: 19, averageOrderValue: 242.11 },
  { date: "2025-10-25", revenue: 6200, orders: 28, averageOrderValue: 221.43 },
  { date: "2025-10-26", revenue: 5800, orders: 25, averageOrderValue: 232 },
  { date: "2025-10-27", revenue: 4500, orders: 20, averageOrderValue: 225 },
];

// Dummy Top Selling Items
export const dummyTopItems = [
  {
    id: 1,
    name: "Chicken Biryani",
    category: "Main Course",
    quantity_sold: 45,
    revenue: 11250,
  },
  {
    id: 2,
    name: "Butter Chicken",
    category: "Main Course",
    quantity_sold: 38,
    revenue: 10640,
  },
  {
    id: 3,
    name: "Paneer Tikka",
    category: "Starters",
    quantity_sold: 32,
    revenue: 5760,
  },
  {
    id: 4,
    name: "Garlic Naan",
    category: "Breads",
    quantity_sold: 78,
    revenue: 3900,
  },
  {
    id: 5,
    name: "Dal Makhani",
    category: "Main Course",
    quantity_sold: 28,
    revenue: 4200,
  },
];

// Dummy Payment Breakdown
export const dummyPaymentBreakdown = [
  { method: "card", count: 45, amount: 13500, percentage: 40 },
  { method: "cash", count: 38, amount: 10125, percentage: 30 },
  { method: "upi", count: 32, amount: 8100, percentage: 24 },
  { method: "online", count: 15, amount: 2025, percentage: 6 },
];
