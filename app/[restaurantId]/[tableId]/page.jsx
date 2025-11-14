import { Suspense } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/loading-screen";

// Dynamically import the heavy component to reduce initial bundle size
// This splits the code and loads it only when needed
const RestaurantMenuClient = dynamic(
  () => import("@/components/restaurant-menu-client"),
  {
    loading: () => <LoadingScreen />,
    ssr: true, // Keep SSR for SEO, but lazy load the component
  }
);

export default async function RestaurantPage({ params }) {
  const { restaurantId, tableId } = await params;

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingScreen />}>
        <RestaurantMenuClient restaurantId={restaurantId} tableId={tableId} />
      </Suspense>
    </div>
  );
}
