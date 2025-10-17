export const API_BASE_URL = "https://restaurant-tms-strapi.onrender.com/api";

export async function fetchMenuItems(restaurantId = "5") {
  try {
    const url = `${API_BASE_URL}/menu-items?filters[restaurant][id][$eq]=${restaurantId}&populate=*`;

    const response = await fetch(url, {
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch menu items: ${response.status}`);
    }

    const data = await response.json();

    // Transform API data to our MenuItem format
    return data.data.map((item) => {
      const attributes = item.attributes;

      // Get the best available image URL
      let imageUrl = null;
      if (attributes.image?.data?.attributes) {
        const imageData = attributes.image.data.attributes;
        imageUrl =
          imageData.formats?.medium?.url ||
          imageData.formats?.small?.url ||
          imageData.url;
      }

      return {
        id: item.id,
        name: attributes.name,
        price: attributes.price,
        description: attributes.description,
        image: imageUrl,
        category: attributes.category?.data?.attributes?.name || null,
      };
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}

export function groupMenuItemsByCategory(items) {
  return items.reduce((acc, item) => {
    const category = item.category?.toLowerCase() || "uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
}

export function getUniqueCategories(items) {
  const categories = new Set();

  items.forEach((item) => {
    if (item.category) {
      categories.add(item.category);
    }
  });

  return Array.from(categories).map((category) => ({
    id: category.toLowerCase(),
    name: category,
  }));
}

export async function getRestaurantName(restaurantId) {
  try {
    const url = `${API_BASE_URL}/restaurants/${restaurantId}?populate=deep`;

    const response = await fetch(url, {
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch restaurant: ${response.status}`);
    }

    const data = await response.json();

    console.log("data", data);
    return {
      name: data.data.attributes.name,
      location: data.data.attributes.location,
      menuImage: data.data.attributes.menu.data,
    };
  } catch (error) {
    console.error("Error fetching restaurant name:", error);
    return {
      name: "Unknown Restaurant",
      location: "Unknown Location",
      menuImage: [],
    };
  }
}
