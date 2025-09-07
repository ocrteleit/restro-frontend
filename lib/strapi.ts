/* eslint-disable @typescript-eslint/no-explicit-any */
export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiRestaurant {
  id: number;
  attributes: {
    name: string;
    slug: string;
    location: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface StrapiMenuItem {
  id: number;
  attributes: {
    name: string;
    description?: string;
    price: number;
    image?: {
      data?: {
        attributes: {
          url: string;
          alternativeText?: string;
        };
      };
    };
    category: {
      data: {
        id: number;
        attributes: {
          name: string;
          slug: string;
        };
      };
    };
    createdAt: string;
    updatedAt: string;
  };
}

export interface StrapiCategory {
  id: number;
  attributes: {
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface StrapiTable {
  id: number;
  attributes: {
    number: string;
    status: "available" | "occupied" | "reserved" | "assistant" | "pay";
    restaurant: {
      data: StrapiRestaurant;
    };
    createdAt: string;
    updatedAt: string;
  };
}

// Helper function to get full image URL
export const getStrapiImageUrl = (imageData: any): string => {
  if (!imageData?.data?.attributes?.url) return "";
  const url = imageData.data.attributes.url;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
};

// API helper functions
export const strapiApi = {
  // Get restaurant by slug
  getRestaurant: async (slug: string): Promise<StrapiRestaurant | null> => {
    const response = await fetch(
      `${STRAPI_URL}/api/restaurants?filters[slug][$eq]=${slug}&populate=*`
    );
    if (!response.ok) throw new Error("Failed to fetch restaurant");
    const data: StrapiResponse<StrapiRestaurant[]> = await response.json();
    return data.data[0] || null;
  },

  // Get menu items for a restaurant
  getMenuItems: async (restaurantSlug: string): Promise<StrapiMenuItem[]> => {
    const response = await fetch(
      `${STRAPI_URL}/api/menu-items?filters[restaurant][slug][$eq]=${restaurantSlug}&populate[category]=*&populate[image]=*`
    );
    if (!response.ok) throw new Error("Failed to fetch menu items");
    const data: StrapiResponse<StrapiMenuItem[]> = await response.json();
    return data.data;
  },

  // Get categories for a restaurant
  getCategories: async (restaurantSlug: string): Promise<StrapiCategory[]> => {
    const response = await fetch(
      `${STRAPI_URL}/api/categories?filters[restaurant][slug][$eq]=${restaurantSlug}`
    );
    if (!response.ok) throw new Error("Failed to fetch categories");
    const data: StrapiResponse<StrapiCategory[]> = await response.json();
    return data.data;
  },

  // Get table by number and restaurant
  getTable: async (
    restaurantSlug: string,
    tableNumber: string
  ): Promise<StrapiTable | null> => {
    const response = await fetch(
      `${STRAPI_URL}/api/tables?filters[number][$eq]=${tableNumber}&filters[restaurant][slug][$eq]=${restaurantSlug}&populate[restaurant]=*`
    );
    if (!response.ok) throw new Error("Failed to fetch table");
    const data: StrapiResponse<StrapiTable[]> = await response.json();
    return data.data[0] || null;
  },

  // Update table status
  updateTableStatus: async (
    tableId: number,
    status: string
  ): Promise<StrapiTable> => {
    const response = await fetch(`${STRAPI_URL}/api/tables/${tableId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: { status },
      }),
    });
    if (!response.ok) throw new Error("Failed to update table status");
    const data: StrapiResponse<StrapiTable> = await response.json();
    return data.data;
  },

  // Call waiter
  callWaiter: async (
    restaurantSlug: string,
    tableNumber: string
  ): Promise<any> => {
    const response = await fetch(`${STRAPI_URL}/api/waiter-calls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          restaurantSlug,
          tableNumber,
          status: "pending",
          requestedAt: new Date().toISOString(),
        },
      }),
    });
    if (!response.ok) throw new Error("Failed to call waiter");
    return response.json();
  },

  // Request bill
  requestBill: async (
    restaurantSlug: string,
    tableNumber: string
  ): Promise<any> => {
    const response = await fetch(`${STRAPI_URL}/api/bill-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          restaurantSlug,
          tableNumber,
          status: "pending",
          requestedAt: new Date().toISOString(),
        },
      }),
    });
    if (!response.ok) throw new Error("Failed to request bill");
    return response.json();
  },
};
