"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useKitchenOrders } from "@/hooks/useAnalytics";
import { updateOrderStatus } from "@/lib/admin-api";
import { toast } from "react-hot-toast";

// ✨ Using GLOBAL CSS VARIABLES - Change colors in app/globals.css
const statusColors = {
  created: "bg-[var(--status-pending)] bg-opacity-20 text-[var(--status-pending)]",
  accepted: "bg-[var(--status-confirmed)] bg-opacity-20 text-[var(--status-confirmed)]",
  preparing: "bg-[var(--status-preparing)] bg-opacity-20 text-[var(--status-preparing)]",
  ready: "bg-[var(--status-ready)] bg-opacity-20 text-[var(--status-ready)]",
};

export default function KitchenDisplayPage() {
  const { kitchenOrders, isValidating, mutate } = useKitchenOrders(5, 5000);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [previousCount, setPreviousCount] = useState(0);
  console.log("kitchenOrders", kitchenOrders);

  // Play sound on new order
  useEffect(() => {
    if (kitchenOrders?.length > previousCount && soundEnabled) {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
    }
    setPreviousCount(kitchenOrders?.length);
  }, [kitchenOrders?.length, previousCount, soundEnabled]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order updated to ${newStatus}`);
      mutate();
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  const getTimeSince = (createdAt) => {
    const minutes = Math.floor((Date.now() - new Date(createdAt)) / 60000);
    return minutes;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Kitchen Display</h1>
          <p className="text-muted-foreground mt-1">
            {kitchenOrders?.length} active orders
            {isValidating && (
              <span className="ml-3 text-[var(--status-ready)]">● Live</span>
            )}
          </p>
        </div>
        <Button
          variant={soundEnabled ? "default" : "outline"}
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? "🔔 Sound On" : "🔕 Sound Off"}
        </Button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {kitchenOrders &&
          kitchenOrders?.map((order) => {
            const orderData = order?.attributes;
            const orderItems = orderData?.order_items?.data || [];
            const minutesSince = getTimeSince(orderData?.createdAt);
            const isUrgent = minutesSince > 20;

            return (
              <Card
                key={order.id}
                className={`${
                  isUrgent ? "border-destructive border-2" : "border-border"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground text-xl">
                      {orderData?.order_number}
                    </CardTitle>
                    <Badge className={statusColors[orderData?.status]}>
                      {orderData?.status}
                    </Badge>
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm mt-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className={isUrgent ? "text-destructive font-bold" : ""}>
                      {minutesSince} min ago
                    </span>
                    {isUrgent && (
                      <AlertCircle className="h-4 w-4 ml-2 text-destructive" />
                    )}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Table:{" "}
                    {orderData?.table?.data?.attributes?.table_number || "N/A"}
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Order Items */}
                  <div className="space-y-2 mb-4">
                    {orderItems.map((item) => {
                      const menuItem = item?.attributes?.menu_item?.data;
                      return (
                        <div
                          key={item.id}
                          className="flex justify-between items-center bg-muted p-2 rounded"
                        >
                          <div className="text-foreground">
                            <span className="font-bold mr-2">
                              {item?.attributes.quantity}x
                            </span>
                            {menuItem?.attributes?.name || "Item"}
                          </div>
                          {item?.attributes?.notes && (
                            <span className="text-[var(--status-pending)] text-xs">
                              📝 {item.attributes.notes}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {orderData?.status === "created" && (
                      <Button
                        className="w-full"
                        variant="default"
                        onClick={() => handleStatusUpdate(order.id, "accepted")}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Accept Order
                      </Button>
                    )}
                    {orderData?.status === "accepted" && (
                      <Button
                        className="w-full bg-[var(--status-preparing)] hover:bg-[var(--status-preparing)]/90 text-white"
                        onClick={() =>
                          handleStatusUpdate(order.id, "preparing")
                        }
                      >
                        Start Preparing
                      </Button>
                    )}
                    {orderData?.status === "preparing" && (
                      <Button
                        className="w-full bg-[var(--status-ready)] hover:bg-[var(--status-ready)]/90 text-white"
                        onClick={() => handleStatusUpdate(order.id, "ready")}
                      >
                        Mark as Ready
                      </Button>
                    )}
                    {orderData?.status === "ready" && (
                      <Button
                        className="w-full bg-[var(--status-completed)] hover:bg-[var(--status-completed)]/90 text-white"
                        onClick={() => handleStatusUpdate(order.id, "served")}
                      >
                        Mark as Served
                      </Button>
                    )}
                    <Button
                      className="w-full"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStatusUpdate(order.id, "cancelled")}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {kitchenOrders?.length === 0 && (
        <div className="text-center py-20">
          <CheckCircle2 className="h-20 w-20 text-[var(--status-ready)] mx-auto mb-4" />
          <h3 className="text-2xl text-foreground font-semibold">All Clear!</h3>
          <p className="text-muted-foreground mt-2">No active orders in the kitchen</p>
        </div>
      )}
    </div>
  );
}
