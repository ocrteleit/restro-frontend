import RestaurantMenuClient from "@/components/restaurant-menu-client";

export default async function RestaurantPage({ params }) {
  const { restaurantId, tableId } = await params;

  return <RestaurantMenuClient restaurantId={restaurantId} tableId={tableId} />;
}
