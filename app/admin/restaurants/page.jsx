"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, MapPin, Phone, Mail, Clock } from "lucide-react";
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
import { useRestaurants } from "@/hooks/useAdmin";
import {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "@/lib/admin-api";
import { toast } from "react-hot-toast";

const statusConfig = {
  active: {
    label: "Active",
    color: "bg-green-500",
    textColor: "text-green-600",
  },
  inactive: {
    label: "Inactive",
    color: "bg-gray-500",
    textColor: "text-gray-600",
  },
  closed: { label: "Closed", color: "bg-red-500", textColor: "text-red-600" },
};

export default function RestaurantsPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
    description: "",
    opening_time: "",
    closing_time: "",
    status: "active",
  });

  const { restaurants, isLoading, mutate } = useRestaurants();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedRestaurant) {
        await updateRestaurant(selectedRestaurant.id, formData);
        toast.success("Restaurant updated successfully");
      } else {
        await createRestaurant(formData);
        toast.success("Restaurant created successfully");
      }

      mutate();
      setSheetOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to save restaurant");
    }
  };

  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setFormData({
      name: restaurant.attributes.name,
      location: restaurant.attributes.location,
      phone: restaurant.attributes.phone || "",
      email: restaurant.attributes.email || "",
      description: restaurant.attributes.description || "",
      opening_time: restaurant.attributes.opening_time || "",
      closing_time: restaurant.attributes.closing_time || "",
      status: restaurant.attributes.status,
    });
    setSheetOpen(true);
  };

  const handleDelete = async (restaurantId) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) return;

    try {
      await deleteRestaurant(restaurantId);
      toast.success("Restaurant deleted successfully");
      mutate();
    } catch (error) {
      toast.error("Failed to delete restaurant");
    }
  };

  const resetForm = () => {
    setSelectedRestaurant(null);
    setFormData({
      name: "",
      location: "",
      phone: "",
      email: "",
      description: "",
      opening_time: "",
      closing_time: "",
      status: "active",
    });
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
            Restaurant Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage restaurant branches and details
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setSheetOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Restaurant
        </Button>
      </div>

      {/* Restaurants Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((restaurant) => {
          const status =
            statusConfig[restaurant.attributes.status] || statusConfig.active;

          return (
            <Card
              key={restaurant.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">
                    {restaurant.attributes.name}
                  </CardTitle>
                  <Badge className={`${status.color} text-white`}>
                    {status.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {restaurant.attributes.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {restaurant.attributes.description}
                  </p>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-600">
                      {restaurant.attributes.location}
                    </span>
                  </div>

                  {restaurant.attributes.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {restaurant.attributes.phone}
                      </span>
                    </div>
                  )}

                  {restaurant.attributes.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {restaurant.attributes.email}
                      </span>
                    </div>
                  )}

                  {(restaurant.attributes.opening_time ||
                    restaurant.attributes.closing_time) && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {restaurant.attributes.opening_time || "00:00"} -{" "}
                        {restaurant.attributes.closing_time || "23:59"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(restaurant)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(restaurant.id)}
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

      {/* Add/Edit Restaurant Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {selectedRestaurant ? "Edit Restaurant" : "Add New Restaurant"}
            </SheetTitle>
            <SheetDescription>
              {selectedRestaurant
                ? "Update restaurant information"
                : "Create a new restaurant"}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="opening_time">Opening Time</Label>
                <Input
                  id="opening_time"
                  type="time"
                  value={formData.opening_time}
                  onChange={(e) =>
                    setFormData({ ...formData, opening_time: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="closing_time">Closing Time</Label>
                <Input
                  id="closing_time"
                  type="time"
                  value={formData.closing_time}
                  onChange={(e) =>
                    setFormData({ ...formData, closing_time: e.target.value })
                  }
                />
              </div>
            </div>

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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {selectedRestaurant ? "Update" : "Create"}
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
    </div>
  );
}
