"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Eye, CheckCircle, XCircle, Clock, ChefHat } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useOrders, useUpdateOrderStatus } from "@/hooks/useAdmin";
import { toast } from "react-hot-toast";

const statusConfig = {
  created: {
    label: "Created",
    color: "bg-orange-500",
    textColor: "text-orange-600",
  },
  accepted: {
    label: "Accepted",
    color: "bg-blue-500",
    textColor: "text-blue-600",
  },
  preparing: {
    label: "Preparing",
    color: "bg-purple-500",
    textColor: "text-purple-600",
  },
  ready: { label: "Ready", color: "bg-green-500", textColor: "text-green-600" },
  served: { label: "Served", color: "bg-gray-500", textColor: "text-gray-600" },
  completed: {
    label: "Completed",
    color: "bg-green-700",
    textColor: "text-green-700",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-500",
    textColor: "text-red-600",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-700",
    textColor: "text-red-700",
  },
};

const tabs = [
  { id: "all", label: "All Orders", status: null },
  { id: "created", label: "Pending", status: "created" },
  { id: "preparing", label: "Preparing", status: "preparing" },
  { id: "ready", label: "Ready", status: "ready" },
  { id: "completed", label: "Completed", status: "completed" },
  { id: "cancelled", label: "Cancelled", status: "cancelled" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const currentTab = tabs.find((tab) => tab.id === activeTab);
  const filters = currentTab.status ? { status: currentTab.status } : {};

  const { orders, isLoading, isValidating, mutate } = useOrders(filters, 0); // Disabled auto-refresh
  const { updateStatus, isUpdating } = useUpdateOrderStatus();

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateStatus({ orderId, status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      mutate();
      setSheetOpen(false);
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setSheetOpen(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  const calculateOrderTotal = (orderItems) => {
    if (!orderItems?.data) return 0;
    return orderItems.data.reduce((total, item) => {
      const quantity = parseFloat(item.attributes.quantity) || 0;
      const price = parseFloat(item.attributes.price) || 0;
      return total + quantity * price;
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              Orders Management
            </h1>
            {isValidating && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Refreshing...</span>
              </div>
            )}
          </div>
          <p className="text-gray-500 mt-1">
            Manage and track all restaurant orders
          </p>
        </div>
        <Button
          onClick={() => mutate()}
          variant="outline"
          disabled={isValidating}
        >
          Refresh Orders
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Orders Grid */}
      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-gray-500">No orders found</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => {
            const orderAttrs = order.attributes;
            const status =
              statusConfig[orderAttrs.status] || statusConfig.created;
            const orderItems = orderAttrs.order_items?.data || [];
            const table = orderAttrs.table?.data;
            const total = calculateOrderTotal(orderAttrs.order_items);

            return (
              <Card
                key={order.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {orderAttrs.order_number}
                        </h3>
                        <Badge className={`${status.color} text-white`}>
                          {status.label}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Table</p>
                          <p className="font-medium">
                            {table?.attributes?.table_number || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Items</p>
                          <p className="font-medium">{orderItems.length}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Total</p>
                          <p className="font-medium">{formatCurrency(total)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Time</p>
                          <p className="font-medium">
                            {format(new Date(orderAttrs.createdAt), "HH:mm")}
                          </p>
                        </div>
                      </div>

                      {orderAttrs.notes && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Notes:</span>{" "}
                          {orderAttrs.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => viewOrderDetails(order)}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>

                      {orderAttrs.status === "created" && (
                        <Button
                          onClick={() =>
                            handleStatusUpdate(order.id, "accepted")
                          }
                          disabled={isUpdating}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                      )}

                      {orderAttrs.status === "accepted" && (
                        <Button
                          onClick={() =>
                            handleStatusUpdate(order.id, "preparing")
                          }
                          disabled={isUpdating}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <ChefHat className="w-4 h-4 mr-2" />
                          Start Preparing
                        </Button>
                      )}

                      {orderAttrs.status === "preparing" && (
                        <Button
                          onClick={() => handleStatusUpdate(order.id, "ready")}
                          disabled={isUpdating}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Ready
                        </Button>
                      )}

                      {orderAttrs.status === "ready" && (
                        <Button
                          onClick={() => handleStatusUpdate(order.id, "served")}
                          disabled={isUpdating}
                          size="sm"
                        >
                          Mark Served
                        </Button>
                      )}

                      {["created", "accepted"].includes(orderAttrs.status) && (
                        <Button
                          onClick={() =>
                            handleStatusUpdate(order.id, "cancelled")
                          }
                          disabled={isUpdating}
                          size="sm"
                          variant="destructive"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Order Details Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedOrder.attributes.order_number}</SheetTitle>
                <SheetDescription>
                  Order placed on{" "}
                  {format(new Date(selectedOrder.attributes.createdAt), "PPpp")}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Status */}
                <div>
                  <h4 className="font-semibold mb-2">Status</h4>
                  <Badge
                    className={`${
                      statusConfig[selectedOrder.attributes.status]?.color
                    } text-white`}
                  >
                    {statusConfig[selectedOrder.attributes.status]?.label}
                  </Badge>
                </div>

                {/* Table Info */}
                <div>
                  <h4 className="font-semibold mb-2">Table Information</h4>
                  <p className="text-gray-600">
                    Table:{" "}
                    {selectedOrder.attributes.table?.data?.attributes
                      ?.table_number || "N/A"}
                  </p>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.attributes.order_items?.data?.map((item) => {
                      const menuItem = item.attributes.menu_item?.data;
                      const quantity = parseFloat(item.attributes.quantity);
                      const price = parseFloat(item.attributes.price);

                      return (
                        <div
                          key={item.id}
                          className="flex justify-between items-start border-b pb-3"
                        >
                          <div>
                            <p className="font-medium">
                              {menuItem?.attributes?.name || "Unknown Item"}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {quantity} × {formatCurrency(price)}
                            </p>
                          </div>
                          <p className="font-semibold">
                            {formatCurrency(quantity * price)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>
                      {formatCurrency(
                        calculateOrderTotal(
                          selectedOrder.attributes.order_items
                        )
                      )}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.attributes.notes && (
                  <div>
                    <h4 className="font-semibold mb-2">Notes</h4>
                    <p className="text-gray-600">
                      {selectedOrder.attributes.notes}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
