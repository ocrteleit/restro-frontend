"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Search, Upload } from "lucide-react";
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
import {
  useMenuItems,
  useMenuItemMutations,
  useCategories,
  useCategoryMutations,
  useRestaurants,
} from "@/hooks/useAdmin";
import { uploadImage } from "@/lib/admin-api";
import { toast } from "react-hot-toast";

export default function MenuPage() {
  const [menuSheetOpen, setMenuSheetOpen] = useState(false);
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [menuFormData, setMenuFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    restaurant: "",
    is_available: true,
    is_vegetarian: false,
    preparation_time: "",
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  const {
    menuItems,
    isLoading: menuLoading,
    mutate: mutateMenu,
  } = useMenuItems({});
  const { categories, mutate: mutateCategories } = useCategories();
  const { restaurants } = useRestaurants();
  const { createMenuItem, updateMenuItem, deleteMenuItem } =
    useMenuItemMutations();
  const { createCategory, updateCategory, deleteCategory } =
    useCategoryMutations();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageId = null;

      if (imageFile) {
        const uploadResponse = await uploadImage(imageFile);
        imageId = uploadResponse[0].id;
      }

      const data = {
        name: menuFormData.name,
        description: menuFormData.description,
        price: parseFloat(menuFormData.price),
        category: parseInt(menuFormData.category),
        is_available: menuFormData.is_available,
        is_vegetarian: menuFormData.is_vegetarian,
        preparation_time: menuFormData.preparation_time
          ? parseInt(menuFormData.preparation_time)
          : null,
        ...(imageId && { image: imageId }),
      };

      if (!selectedMenuItem) {
        data.restaurant = parseInt(menuFormData.restaurant);
      }

      if (selectedMenuItem) {
        await updateMenuItem({ id: selectedMenuItem.id, data });
        toast.success("Menu item updated successfully");
      } else {
        await createMenuItem(data);
        toast.success("Menu item created successfully");
      }

      mutateMenu();
      setMenuSheetOpen(false);
      resetMenuForm();
    } catch (error) {
      toast.error("Failed to save menu item");
      console.error(error);
    }
  };

  const handleMenuEdit = (item) => {
    setSelectedMenuItem(item);
    setMenuFormData({
      name: item.attributes.name,
      description: item.attributes.description,
      price: item.attributes.price.toString(),
      category: item.attributes.category?.data?.id.toString() || "",
      restaurant: item.attributes.restaurant?.data?.id.toString() || "",
      is_available: item.attributes.is_available,
      is_vegetarian: item.attributes.is_vegetarian || false,
      preparation_time: item.attributes.preparation_time?.toString() || "",
    });

    const imageUrl = item.attributes.image?.data?.attributes?.url;
    if (imageUrl) {
      setImagePreview(imageUrl);
    }

    setMenuSheetOpen(true);
  };

  const handleMenuDelete = async (itemId) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      await deleteMenuItem(itemId);
      toast.success("Menu item deleted successfully");
      mutateMenu();
    } catch (error) {
      toast.error("Failed to delete menu item");
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedCategory) {
        await updateCategory({
          id: selectedCategory.id,
          data: categoryFormData,
        });
        toast.success("Category updated successfully");
      } else {
        await createCategory(categoryFormData);
        toast.success("Category created successfully");
      }

      mutateCategories();
      setCategorySheetOpen(false);
      resetCategoryForm();
    } catch (error) {
      toast.error("Failed to save category");
    }
  };

  const handleCategoryEdit = (category) => {
    setSelectedCategory(category);
    setCategoryFormData({
      name: category.attributes.name,
      description: category.attributes.description || "",
      is_active: category.attributes.is_active,
    });
    setCategorySheetOpen(true);
  };

  const handleCategoryDelete = async (categoryId) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteCategory(categoryId);
      toast.success("Category deleted successfully");
      mutateCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const resetMenuForm = () => {
    setSelectedMenuItem(null);
    setMenuFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      restaurant: "",
      is_available: true,
      is_vegetarian: false,
      preparation_time: "",
    });
    setImageFile(null);
    setImagePreview("");
  };

  const resetCategoryForm = () => {
    setSelectedCategory(null);
    setCategoryFormData({
      name: "",
      description: "",
      is_active: true,
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  // Filter menu items
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.attributes.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" ||
      item.attributes.category?.data?.id.toString() === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (menuLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-500 mt-1">Manage menu items and categories</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              resetCategoryForm();
              setCategorySheetOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
          <Button
            onClick={() => {
              resetMenuForm();
              setMenuSheetOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Menu Item
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.attributes.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categories Section */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2"
              >
                <span className="font-medium">{category.attributes.name}</span>
                <Badge
                  variant={
                    category.attributes.is_active ? "default" : "secondary"
                  }
                >
                  {category.attributes.is_active ? "Active" : "Inactive"}
                </Badge>
                <div className="hidden group-hover:flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCategoryEdit(category)}
                    className="h-6 px-2"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCategoryDelete(category.id)}
                    className="h-6 px-2 text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMenuItems.map((item) => {
          const imageUrl =
            item.attributes.image?.data?.attributes?.formats?.small?.url ||
            item.attributes.image?.data?.attributes?.url;

          return (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={item.attributes.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.attributes.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {item.attributes.description}
                      </p>
                    </div>
                    {item.attributes.is_vegetarian && (
                      <Badge variant="secondary" className="ml-2">
                        🌱 Veg
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(item.attributes.price)}
                    </span>
                    <Badge
                      variant={
                        item.attributes.is_available ? "default" : "secondary"
                      }
                    >
                      {item.attributes.is_available
                        ? "Available"
                        : "Unavailable"}
                    </Badge>
                  </div>

                  <div className="text-xs text-gray-500">
                    {item.attributes.category?.data?.attributes?.name}
                    {item.attributes.preparation_time &&
                      ` • ${item.attributes.preparation_time} mins`}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMenuEdit(item)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMenuDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Menu Item Sheet */}
      <Sheet open={menuSheetOpen} onOpenChange={setMenuSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {selectedMenuItem ? "Edit Menu Item" : "Add New Menu Item"}
            </SheetTitle>
            <SheetDescription>
              {selectedMenuItem
                ? "Update menu item details"
                : "Create a new menu item"}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleMenuSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={menuFormData.name}
                onChange={(e) =>
                  setMenuFormData({ ...menuFormData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={menuFormData.description}
                onChange={(e) =>
                  setMenuFormData({
                    ...menuFormData,
                    description: e.target.value,
                  })
                }
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={menuFormData.price}
                onChange={(e) =>
                  setMenuFormData({ ...menuFormData, price: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={menuFormData.category}
                onValueChange={(value) =>
                  setMenuFormData({ ...menuFormData, category: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.attributes.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!selectedMenuItem && (
              <div className="space-y-2">
                <Label htmlFor="restaurant">Restaurant *</Label>
                <Select
                  value={menuFormData.restaurant}
                  onValueChange={(value) =>
                    setMenuFormData({ ...menuFormData, restaurant: value })
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
              <Label htmlFor="preparation_time">
                Preparation Time (minutes)
              </Label>
              <Input
                id="preparation_time"
                type="number"
                min="0"
                value={menuFormData.preparation_time}
                onChange={(e) =>
                  setMenuFormData({
                    ...menuFormData,
                    preparation_time: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_available"
                checked={menuFormData.is_available}
                onChange={(e) =>
                  setMenuFormData({
                    ...menuFormData,
                    is_available: e.target.checked,
                  })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="is_available" className="cursor-pointer">
                Available
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_vegetarian"
                checked={menuFormData.is_vegetarian}
                onChange={(e) =>
                  setMenuFormData({
                    ...menuFormData,
                    is_vegetarian: e.target.checked,
                  })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="is_vegetarian" className="cursor-pointer">
                Vegetarian
              </Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {selectedMenuItem ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setMenuSheetOpen(false);
                  resetMenuForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Add/Edit Category Sheet */}
      <Sheet open={categorySheetOpen} onOpenChange={setCategorySheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {selectedCategory ? "Edit Category" : "Add New Category"}
            </SheetTitle>
            <SheetDescription>
              {selectedCategory
                ? "Update category details"
                : "Create a new category"}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleCategorySubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="cat_name">Name *</Label>
              <Input
                id="cat_name"
                value={categoryFormData.name}
                onChange={(e) =>
                  setCategoryFormData({
                    ...categoryFormData,
                    name: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat_description">Description</Label>
              <textarea
                id="cat_description"
                value={categoryFormData.description}
                onChange={(e) =>
                  setCategoryFormData({
                    ...categoryFormData,
                    description: e.target.value,
                  })
                }
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={categoryFormData.is_active}
                onChange={(e) =>
                  setCategoryFormData({
                    ...categoryFormData,
                    is_active: e.target.checked,
                  })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active
              </Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {selectedCategory ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCategorySheetOpen(false);
                  resetCategoryForm();
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
