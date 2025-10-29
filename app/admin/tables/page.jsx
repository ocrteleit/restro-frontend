"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Plus, Edit, Trash2, QrCode, Users } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTables, useTableMutations, useRestaurants } from "@/hooks/useAdmin";
import { toast } from "react-hot-toast";

const statusConfig = {
  available: {
    label: "Available",
    color: "bg-green-500",
    bgClass: "bg-green-50",
    textColor: "text-green-700",
  },
  occupied: {
    label: "Occupied",
    color: "bg-red-500",
    bgClass: "bg-red-50",
    textColor: "text-red-700",
  },
  reserved: {
    label: "Reserved",
    color: "bg-blue-500",
    bgClass: "bg-blue-50",
    textColor: "text-blue-700",
  },
  cleaning: {
    label: "Cleaning",
    color: "bg-yellow-500",
    bgClass: "bg-yellow-50",
    textColor: "text-yellow-700",
  },
};

export default function TablesPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [qrSheetOpen, setQrSheetOpen] = useState(false);
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

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShowQR(table)}
                    className="flex-1"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Code
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
    </div>
  );
}
