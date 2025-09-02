import { fetchMenuItems, getUniqueCategories, groupMenuItemsByCategory } from "@/lib/api";
import RestaurantMenuClient from "./restaurant-menu-client";
import { NextPage } from "next";

// Define the expected type for searchParams
interface PageProps {
  searchParams?: Promise<{ table?: string; restaurant?: string }>;
}

const RestaurantMenu: NextPage<PageProps> = async ({ searchParams }) => {
  // Await the searchParams to resolve the Promise
  const resolvedSearchParams = await searchParams;
  const restaurantId = resolvedSearchParams?.restaurant ?? "5";
  const tableNumber = resolvedSearchParams?.table ?? "Unknown";

  const menuItems = await fetchMenuItems(restaurantId);
  const groupedMenu = groupMenuItemsByCategory(menuItems);
  const categories = getUniqueCategories(menuItems);

  return (
    <RestaurantMenuClient
      initialMenuData={groupedMenu}
      initialCategories={categories}
      initialTableNumber={tableNumber}
    />
  );
};

export default RestaurantMenu;