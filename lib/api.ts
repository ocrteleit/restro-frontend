export interface MenuItem {
    id: number
    name: string
    price: number | null
    description: string | null
    image: string | null
    category: string | null
}

export interface ApiMenuItem {
    id: number
    attributes: {
        name: string
        price: number | null
        description: string | null
        image: {
            data: {
                attributes: {
                    url: string
                    formats?: {
                        medium?: { url: string }
                        small?: { url: string }
                        thumbnail?: { url: string }
                    }
                }
            } | null
        }
        category: {
            data: {
                attributes: {
                    name: string
                }
            } | null
        }
    }
}

export interface ApiResponse {
    data: ApiMenuItem[]
    meta: {
        pagination: {
            page: number
            pageSize: number
            pageCount: number
            total: number
        }
    }
}

export const API_BASE_URL = "https://restaurant-tms-strapi.onrender.com/api"

export async function fetchMenuItems(restaurantId = "5"): Promise<MenuItem[]> {
    try {
        const url = `${API_BASE_URL}/menu-items?filters[restaurant][id][$eq]=${restaurantId}&populate=*`

        const response = await fetch(url, {
            cache: "no-store", // Always fetch fresh data
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch menu items: ${response.status}`)
        }

        const data: ApiResponse = await response.json()

        // Transform API data to our MenuItem interface
        return data.data.map((item): MenuItem => {
            const attributes = item.attributes

            // Get the best available image URL
            let imageUrl = null
            if (attributes.image?.data?.attributes) {
                const imageData = attributes.image.data.attributes
                imageUrl = imageData.formats?.medium?.url || imageData.formats?.small?.url || imageData.url
            }

            return {
                id: item.id,
                name: attributes.name,
                price: attributes.price,
                description: attributes.description,
                image: imageUrl,
                category: attributes.category?.data?.attributes?.name || null,
            }
        })
    } catch (error) {
        console.error("Error fetching menu items:", error)
        return []
    }
}

export function groupMenuItemsByCategory(items: MenuItem[]): { [key: string]: MenuItem[] } {
    return items.reduce(
        (acc, item) => {
            const category = item.category?.toLowerCase() || "uncategorized"
            if (!acc[category]) {
                acc[category] = []
            }
            acc[category].push(item)
            return acc
        },
        {} as { [key: string]: MenuItem[] },
    )
}

export function getUniqueCategories(items: MenuItem[]): Array<{ id: string; name: string }> {
    const categories = new Set<string>()

    items.forEach((item) => {
        if (item.category) {
            categories.add(item.category)
        }
    })

    return Array.from(categories).map((category) => ({
        id: category.toLowerCase(),
        name: category,
    }))
}

export async function getRestaurantName(restaurantId: string): Promise<{ name: string; location: string }> {
    try {
        const url = `${API_BASE_URL}/restaurants/${restaurantId}`

        const response = await fetch(url, {
            cache: "no-store", // Always fetch fresh data
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch restaurant: ${response.status}`)
        }

        const data = await response.json()
        return { name: data.data.attributes.name, location: data.data.attributes.location }
    } catch (error) {
        console.error("Error fetching restaurant name:", error)
        return {
            name: "Unknown Restaurant", location: "Unknown Location"
        }

    }
}