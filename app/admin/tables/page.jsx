"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  Plus,
  Edit,
  Trash2,
  QrCode,
  Users,
  Receipt,
  ChefHat,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useTables,
  useTableMutations,
  useRestaurants,
  useOrders,
} from "@/hooks/useAdmin";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import KOTView from "@/components/admin/kot-view";
import BillView from "@/components/admin/bill-view";

// ✨ Using GLOBAL CSS VARIABLES - Change colors in app/globals.css
const statusConfig = {
  available: {
    label: "Available",
    color: "bg-[var(--status-ready)]",
    bgClass: "bg-[var(--status-ready)]/10",
    textColor: "text-[var(--status-ready)]",
  },
  occupied: {
    label: "Occupied",
    color: "bg-[var(--status-cancelled)]",
    bgClass: "bg-[var(--status-cancelled)]/10",
    textColor: "text-[var(--status-cancelled)]",
  },
  reserved: {
    label: "Reserved",
    color: "bg-[var(--status-confirmed)]",
    bgClass: "bg-[var(--status-confirmed)]/10",
    textColor: "text-[var(--status-confirmed)]",
  },
  cleaning: {
    label: "Cleaning",
    color: "bg-[var(--status-pending)]",
    bgClass: "bg-[var(--status-pending)]/10",
    textColor: "text-[var(--status-pending)]",
  },
};

export default function TablesPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [qrSheetOpen, setQrSheetOpen] = useState(false);
  const [billSheetOpen, setBillSheetOpen] = useState(false);
  const [kotViewOpen, setKotViewOpen] = useState(false);
  const [billViewOpen, setBillViewOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [formData, setFormData] = useState({
    table_number: "",
    capacity: "",
    restaurant: "",
    location_description: "",
    status: "available",
  });

  const { tables, isLoading, mutate } = useTables({}, 10000);
  const { restaurants } = useRestaurants();
  const { createTable, updateTable, deleteTable } = useTableMutations();

  // Fetch served orders for the selected table (only when table is selected)
  const billFilters =
    selectedTable && (billSheetOpen || billViewOpen)
      ? { tableId: selectedTable.id, status: "served" }
      : null;
  const { orders: servedOrders, isLoading: ordersLoading } = useOrders(
    billFilters,
    5,
    0
  );

  // Fetch active orders for KOT view (orders that are not completed/cancelled)
  // Note: We'll fetch all orders for the table and filter client-side
  const kotFilters =
    selectedTable && kotViewOpen ? { tableId: selectedTable.id } : null;
  const { orders: allTableOrders, isLoading: kotOrdersLoading } = useOrders(
    kotFilters,
    5,
    0
  );

  // Filter orders for KOT (exclude completed and cancelled)
  const kotOrders =
    allTableOrders?.filter(
      (order) =>
        !["completed", "cancelled", "rejected"].includes(
          order.attributes.status
        )
    ) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedTable) {
        await updateTable({
          id: selectedTable.id,
          data: {
            table_number: formData.table_number,
            capacity: parseInt(formData.capacity),
            location_description: formData.location_description,
            status: formData.status,
          },
        });
        toast.success("Table updated successfully");
      } else {
        await createTable({
          table_number: formData.table_number,
          capacity: parseInt(formData.capacity),
          restaurant: parseInt(formData.restaurant),
          location_description: formData.location_description,
          status: formData.status,
        });
        toast.success("Table created successfully");
      }

      mutate();
      setSheetOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to save table");
    }
  };

  const handleEdit = (table) => {
    setSelectedTable(table);
    setFormData({
      table_number: table.attributes.table_number,
      capacity: table.attributes.capacity.toString(),
      restaurant: table.attributes.restaurant?.data?.id.toString() || "",
      location_description: table.attributes.location_description || "",
      status: table.attributes.status,
    });
    setSheetOpen(true);
  };

  const handleDelete = async (tableId) => {
    if (!confirm("Are you sure you want to delete this table?")) return;

    try {
      await deleteTable(tableId);
      toast.success("Table deleted successfully");
      mutate();
    } catch (error) {
      toast.error("Failed to delete table");
    }
  };

  const handleShowQR = (table) => {
    setSelectedTable(table);
    setQrSheetOpen(true);
  };

  const handleViewBill = (table) => {
    setSelectedTable(table);
    setBillSheetOpen(true);
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

  const calculateGrandTotal = () => {
    if (!servedOrders || servedOrders.length === 0) return 0;
    return servedOrders.reduce((total, order) => {
      return total + calculateOrderTotal(order.attributes.order_items);
    }, 0);
  };

  // Transform orders data for KOT/Bill views
  const transformOrdersForView = (orders) => {
    if (!orders || orders.length === 0) return [];

    const allItems = [];
    orders.forEach((order) => {
      const orderItems = order.attributes.order_items?.data || [];
      orderItems.forEach((item) => {
        const menuItem = item.attributes.menu_item?.data;
        const existingItem = allItems.find(
          (i) =>
            i.id === menuItem?.id?.toString() ||
            i.name === menuItem?.attributes?.name
        );

        if (existingItem) {
          existingItem.quantity += parseFloat(item.attributes.quantity) || 0;
        } else {
          allItems.push({
            id: menuItem?.id?.toString() || item.id.toString(),
            name: menuItem?.attributes?.name || "Unknown Item",
            price: parseFloat(item.attributes.price) || 0,
            quantity: parseFloat(item.attributes.quantity) || 0,
          });
        }
      });
    });

    return allItems;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleViewKOT = (table) => {
    setSelectedTable(table);
    setKotViewOpen(true);
  };

  const handleViewBillFromKOT = () => {
    setKotViewOpen(false);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setBillViewOpen(true);
    }, 100);
  };

  const handleBackFromKOT = () => {
    setKotViewOpen(false);
  };

  const handleBackFromBill = () => {
    setBillViewOpen(false);
    setBillSheetOpen(false);
  };

  const handleViewBillFromSheet = () => {
    setBillSheetOpen(false);
    setBillViewOpen(true);
  };

  const resetForm = () => {
    setSelectedTable(null);
    setFormData({
      table_number: "",
      capacity: "",
      restaurant: "",
      location_description: "",
      status: "available",
    });
  };

  const downloadQR = () => {
    const canvas = document.getElementById("qr-code");
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `table-${selectedTable?.attributes.table_number}-qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Calculate statistics
  const stats = {
    total: tables.length,
    available: tables.filter((t) => t.attributes.status === "available").length,
    occupied: tables.filter((t) => t.attributes.status === "occupied").length,
    reserved: tables.filter((t) => t.attributes.status === "reserved").length,
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
          <h1 className="text-3xl font-bold text-gray-900">
            Tables Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage restaurant tables and their status
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setSheetOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Table
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Tables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600">
              Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.available}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-600">
              Occupied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.occupied}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-600">
              Reserved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.reserved}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tables.map((table) => {
          const status =
            statusConfig[table.attributes.status] || statusConfig.available;
          return (
            <Card
              key={table.id}
              className={`hover:shadow-lg transition-shadow ${status.bgClass}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Table {table.attributes.table_number}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Capacity: {table.attributes.capacity}
                      </span>
                    </div>
                  </div>
                  <Badge className={`${status.color} text-white`}>
                    {status.label}
                  </Badge>
                </div>

                {table.attributes.location_description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {table.attributes.location_description}
                  </p>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewKOT(table)}
                    className="flex-1"
                  >
                    <ChefHat className="w-4 h-4 mr-2" />
                    View KOT
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewBill(table)}
                    className="flex-1"
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    View Bill
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShowQR(table)}
                  >
                    <QrCode className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(table)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(table.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Table Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {selectedTable ? "Edit Table" : "Add New Table"}
            </SheetTitle>
            <SheetDescription>
              {selectedTable
                ? "Update table information"
                : "Create a new table"}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="table_number">Table Number *</Label>
              <Input
                id="table_number"
                value={formData.table_number}
                onChange={(e) =>
                  setFormData({ ...formData, table_number: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                required
              />
            </div>

            {!selectedTable && (
              <div className="space-y-2">
                <Label htmlFor="restaurant">Restaurant *</Label>
                <Select
                  value={formData.restaurant}
                  onValueChange={(value) =>
                    setFormData({ ...formData, restaurant: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select restaurant" />
                  </SelectTrigger>
                  <SelectContent>
                    {restaurants.map((restaurant) => (
                      <SelectItem
                        key={restaurant.id}
                        value={restaurant.id.toString()}
                      >
                        {restaurant.attributes.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location_description">Location Description</Label>
              <Input
                id="location_description"
                value={formData.location_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location_description: e.target.value,
                  })
                }
                placeholder="e.g., Near window, Corner"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {selectedTable ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSheetOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* QR Code Sheet */}
      <Sheet open={qrSheetOpen} onOpenChange={setQrSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              QR Code - Table {selectedTable?.attributes.table_number}
            </SheetTitle>
            <SheetDescription>
              Scan this QR code to view the menu and place orders
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 flex flex-col items-center space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <QRCodeCanvas
                id="qr-code"
                value={`${window.location.origin}/5/${selectedTable?.id || 1}`}
                size={256}
                level="H"
                includeMargin
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Table:{" "}
                <span className="font-semibold">
                  {selectedTable?.attributes.table_number}
                </span>
              </p>
              <Button onClick={downloadQR}>Download QR Code</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Bill Sheet */}
      <Sheet open={billSheetOpen} onOpenChange={setBillSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              Bill - Table {selectedTable?.attributes.table_number}
            </SheetTitle>
            <SheetDescription>
              View all served orders and total bill for this table
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : servedOrders && servedOrders.length > 0 ? (
              <>
                {/* Orders List */}
                <div className="space-y-4">
                  {servedOrders.map((order) => {
                    const orderAttrs = order.attributes;
                    const orderItems = orderAttrs.order_items?.data || [];
                    const orderTotal = calculateOrderTotal(
                      orderAttrs.order_items
                    );

                    return (
                      <Card
                        key={order.id}
                        className="border-l-4 border-l-blue-500"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {orderAttrs.order_number}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {format(new Date(orderAttrs.createdAt), "PPp")}
                              </p>
                            </div>
                            <Badge className="bg-muted text-muted-foreground">
                              Served
                            </Badge>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-2 mb-3">
                            {orderItems.map((item) => {
                              const menuItem = item.attributes.menu_item?.data;
                              const quantity = parseFloat(
                                item.attributes.quantity
                              );
                              const price = parseFloat(item.attributes.price);

                              return (
                                <div
                                  key={item.id}
                                  className="flex justify-between items-start text-sm"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium">
                                      {menuItem?.attributes?.name ||
                                        "Unknown Item"}
                                    </p>
                                    <p className="text-gray-500">
                                      {quantity} × {formatCurrency(price)}
                                    </p>
                                  </div>
                                  <p className="font-semibold">
                                    {formatCurrency(quantity * price)}
                                  </p>
                                </div>
                              );
                            })}
                          </div>

                          {/* Order Total */}
                          <div className="border-t pt-2 flex justify-between items-center">
                            <span className="font-semibold">Order Total:</span>
                            <span className="font-bold text-lg">
                              {formatCurrency(orderTotal)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Grand Total */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">
                        Grand Total:
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatCurrency(calculateGrandTotal())}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Total for {servedOrders.length} served order
                      {servedOrders.length !== 1 ? "s" : ""}
                    </p>
                  </CardContent>
                </Card>

                {/* View Full Bill Button */}
                <div className="mt-4">
                  <Button
                    onClick={handleViewBillFromSheet}
                    className="w-full"
                    size="lg"
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    View Full Bill
                  </Button>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No served orders found for this table
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Orders with status "served" will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* KOT View Dialog */}
      <Dialog
        open={kotViewOpen}
        onOpenChange={(open) => {
          setKotViewOpen(open);
          if (!open) {
            // Reset selected table when dialog closes
            setTimeout(() => {
              if (!billViewOpen) {
                setSelectedTable(null);
              }
            }, 200);
          }
        }}
      >
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>
              KOT - Table {selectedTable?.attributes.table_number}
            </DialogTitle>
            <DialogDescription>
              Kitchen Order Ticket for this table
            </DialogDescription>
          </DialogHeader>
          {selectedTable && (
            <div className="px-6 pb-6">
              <KOTView
                tableNumber={selectedTable.attributes.table_number}
                orders={transformOrdersForView(kotOrders)}
                onPrint={handlePrint}
                onViewBill={handleViewBillFromKOT}
                onBack={handleBackFromKOT}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bill View Dialog */}
      <Dialog
        open={billViewOpen}
        onOpenChange={(open) => {
          setBillViewOpen(open);
          if (!open) {
            // Reset selected table when dialog closes
            setTimeout(() => {
              if (!kotViewOpen) {
                setSelectedTable(null);
              }
            }, 200);
          }
        }}
      >
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>
              Bill - Table {selectedTable?.attributes.table_number}
            </DialogTitle>
            <DialogDescription>
              Invoice and bill details for this table
            </DialogDescription>
          </DialogHeader>
          {selectedTable && (
            <div className="px-6 pb-6">
              <BillView
                tableNumber={selectedTable.attributes.table_number}
                orders={transformOrdersForView(servedOrders)}
                onPrint={handlePrint}
                onBack={handleBackFromBill}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
