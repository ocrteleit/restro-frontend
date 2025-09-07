/* eslint-disable @typescript-eslint/no-explicit-any */
import RestaurantMenuClient from "@/components/restaurant-menu-client";

export default function RestaurantPage({ params }: any) {
  const { restaurantId, tableId } = params;

  return <RestaurantMenuClient restaurantId={restaurantId} tableId={tableId} />;
}
