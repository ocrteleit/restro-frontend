import { fetchMenuItems, getUniqueCategories, groupMenuItemsByCategory } from "@/lib/api";
import RestaurantMenuClient from "./restaurant-menu-client";

export default async function RestaurantMenu({
  searchParams,
}: {
  searchParams: { table?: string; restaurant?: string }
}) {
  // Get restaurant ID from URL params or default to '5'
  const restaurantId = searchParams.restaurant || "5"
  const tableNumber = searchParams.table || "Unknown"

  // Fetch menu items server-side
  const menuItems = await fetchMenuItems(restaurantId)
  const groupedMenu = groupMenuItemsByCategory(menuItems)
  const categories = getUniqueCategories(menuItems)

  return (
    <RestaurantMenuClient
      initialMenuData={groupedMenu}
      initialCategories={categories}
      initialTableNumber={tableNumber}
    />
  )
}
