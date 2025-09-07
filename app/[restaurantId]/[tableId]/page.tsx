import RestaurantMenuClient from "@/components/restaurant-menu-client";

interface PageProps {
  params: {
    restaurantId: string;
    tableId: string;
  };
}

export default function RestaurantPage({ params }: PageProps) {
  const { restaurantId, tableId } = params;

  return <RestaurantMenuClient restaurantId={restaurantId} tableId={tableId} />;
}
