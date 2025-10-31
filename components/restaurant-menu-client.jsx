"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Phone,
  Receipt,
  MapPin,
  Grid3X3,
  List,
  Eye,
  EyeOff,
  ImageIcon,
  CheckCircle,
  Clock,
  Waves,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Send,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  fetchMenuItems,
  getRestaurantName,
  groupMenuItemsByCategory,
  getUniqueCategories,
} from "@/lib/api";
import { callWaiterMutation, requestBillMutation } from "@/lib/table-service";
import {
  createOrderMutation,
  addOrderItemMutation,
  updateOrderItemMutation,
  removeOrderItemMutation,
  submitOrderMutation,
  calculateOrderTotal,
  getActiveOrder,
  getOrderItems,
} from "@/lib/cart-api";
import LoadingScreen from "./loading-screen";

function Card({ className, ...props }) {
  return (
    <div
      className={`nb-card ${className || ""}`}
      {...props}
    />
  );
}

export default function RestaurantMenuClient({ restaurantId, tableId }) {
  const {
    data: restaurant,
    error: restaurantError,
    isLoading: restaurantLoading,
  } = useSWR(`restaurant-${restaurantId}`, () =>
    getRestaurantName(restaurantId)
  );

  const {
    data: menuItems,
    error: menuError,
    isLoading: menuLoading,
  } = useSWR(`menu-${restaurantId}`, () => fetchMenuItems(restaurantId));

  const { trigger: triggerCallWaiter, isMutating: waiterLoading } =
    useSWRMutation("call-waiter", callWaiterMutation);

  const { trigger: triggerRequestBill, isMutating: billLoading } =
    useSWRMutation("request-bill", requestBillMutation);

  // Cart mutations
  const { trigger: triggerCreateOrder } = useSWRMutation(
    "create-order",
    createOrderMutation
  );
  const { trigger: triggerAddOrderItem } = useSWRMutation(
    "add-order-item",
    addOrderItemMutation
  );
  const { trigger: triggerUpdateOrderItem } = useSWRMutation(
    "update-order-item",
    updateOrderItemMutation
  );
  const { trigger: triggerRemoveOrderItem } = useSWRMutation(
    "remove-order-item",
    removeOrderItemMutation
  );
  const { trigger: triggerSubmitOrder } = useSWRMutation(
    "submit-order",
    submitOrderMutation
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showImages, setShowImages] = useState(true);
  const [isVisible, setIsVisible] = useState({});
  const [showWaiterAnimation, setShowWaiterAnimation] = useState(false);
  const [showBillAnimation, setShowBillAnimation] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [animationType, setAnimationType] = useState(null);
  const [imageGalleryOpen, setImageGalleryOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Cart state
  const [cartOpen, setCartOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showAddToCartToast, setShowAddToCartToast] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);

  const sectionRefs = useRef({});
  const observerRef = useRef(null);
  const itemObserverRef = useRef(null);

  const transformedMenuData = menuItems
    ? groupMenuItemsByCategory(menuItems)
    : {};
  const transformedCategories = menuItems ? getUniqueCategories(menuItems) : [];

  useEffect(() => {
    if (transformedCategories.length > 0 && !activeCategory) {
      setActiveCategory(transformedCategories[0].id);
    }
  }, [transformedCategories, activeCategory]);

  const filteredMenu = Object.entries(transformedMenuData).reduce(
    (acc, [category, items]) => {
      const filtered = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    },
    {}
  );

  // Bright accent colors for categories (neobrutalist palette)
  const categoryAccent = (categoryId) => {
    const map = {
      pizza: { bg: "bg-red-300", chip: "bg-red-300", border: "border-red-600" },
      salads: { bg: "bg-lime-300", chip: "bg-lime-300", border: "border-lime-600" },
      burgers: { bg: "bg-amber-300", chip: "bg-amber-300", border: "border-amber-600" },
      pasta: { bg: "bg-pink-300", chip: "bg-pink-300", border: "border-pink-600" },
      drinks: { bg: "bg-cyan-300", chip: "bg-cyan-300", border: "border-cyan-600" },
      uncategorized: { bg: "bg-violet-300", chip: "bg-violet-300", border: "border-violet-600" },
    };
    return map[categoryId] || { bg: "bg-yellow-300", chip: "bg-yellow-300", border: "border-yellow-600" };
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-120px 0px -60% 0px",
      threshold: 0.3,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const categoryId = entry.target.getAttribute("data-category");
          if (categoryId) {
            setActiveCategory(categoryId);
          }
        }
      });
    }, observerOptions);

    const itemObserverOptions = {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.1,
    };

    itemObserverRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const itemId = entry.target.getAttribute("data-item-id");
        if (itemId && entry.isIntersecting) {
          setIsVisible((prev) => ({ ...prev, [itemId]: true }));
        }
      });
    }, itemObserverOptions);

    const timer = setTimeout(() => {
      Object.values(sectionRefs.current).forEach((section) => {
        if (section && observerRef.current) {
          observerRef.current.observe(section);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (itemObserverRef.current) {
        itemObserverRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const menuItems = document.querySelectorAll("[data-item-id]");
      menuItems.forEach((item) => {
        if (itemObserverRef.current) {
          itemObserverRef.current.observe(item);
        }
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [viewMode]);

  const handleCallWaiter = async () => {
    setShowWaiterAnimation(true);
    setAnimationType("waiter");
    setAnimationProgress(0);

    const progressInterval = setInterval(() => {
      setAnimationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    try {
      await triggerCallWaiter({ tableId });
      setTimeout(() => {
        setShowWaiterAnimation(false);
        setAnimationType(null);
        setAnimationProgress(0);
      }, 10000);
    } catch (error) {
      console.error("Failed to call waiter:", error);
      clearInterval(progressInterval);
      setShowWaiterAnimation(false);
      setAnimationType(null);
      setAnimationProgress(0);
    }
  };

  const handleAskForBill = async () => {
    setShowBillAnimation(true);
    setAnimationType("bill");
    setAnimationProgress(0);

    const progressInterval = setInterval(() => {
      setAnimationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    try {
      await triggerRequestBill({ tableId });
      setTimeout(() => {
        setShowBillAnimation(false);
        setAnimationType(null);
        setAnimationProgress(0);
      }, 10000);
    } catch (error) {
      console.error("Failed to request bill:", error);
      clearInterval(progressInterval);
      setShowBillAnimation(false);
      setAnimationType(null);
      setAnimationProgress(0);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    const section = sectionRefs.current[categoryId];
    if (section) {
      const headerHeight = 140;
      const elementPosition = section.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  const handleEyeClick = () => {
    if (showImages) {
      const allImages =
        restaurant?.menuImage
          ?.map((item) => item?.attributes?.url)
          .filter(Boolean) || [];

      console.log("all", allImages);

      setSelectedImages(allImages);
      setCurrentImageIndex(0);
      setImageGalleryOpen(true);
    } else {
      setShowImages(true);
    }
  };

  // Load active order and cart items on mount
  useEffect(() => {
    const loadActiveOrder = async () => {
      if (!tableId) return;

      try {
        setCartLoading(true);
        const order = await getActiveOrder(tableId);

        if (order) {
          setCurrentOrder(order);
          const items = await getOrderItems(order.id);
          setCartItems(items);
        }
      } catch (error) {
        console.error("Error loading active order:", error);
      } finally {
        setCartLoading(false);
      }
    };

    loadActiveOrder();
  }, [tableId]);

  // Add item to cart
  const handleAddToCart = async (menuItem) => {
    try {
      setCartLoading(true);

      // Create order if doesn't exist
      let orderId = currentOrder?.id;
      if (!orderId) {
        const newOrder = await triggerCreateOrder({
          tableId,
          restaurantId,
        });
        setCurrentOrder(newOrder);
        orderId = newOrder.id;
      }

      // Check if item already in cart
      const existingItem = cartItems.find(
        (item) => item.attributes.menu_item.data.id === menuItem.id
      );

      if (existingItem) {
        // Update quantity
        const newQuantity = parseInt(existingItem.attributes.quantity) + 1;
        await triggerUpdateOrderItem({
          orderItemId: existingItem.id,
          quantity: newQuantity,
        });

        // Update local state
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === existingItem.id
              ? {
                  ...item,
                  attributes: {
                    ...item.attributes,
                    quantity: String(newQuantity),
                  },
                }
              : item
          )
        );
      } else {
        // Add new item
        const newItem = await triggerAddOrderItem({
          orderId,
          menuItemId: menuItem.id,
          quantity: 1,
          price: menuItem.price,
        });

        // Fetch complete item data with menu_item populated
        const items = await getOrderItems(orderId);
        setCartItems(items);
      }

      // Show success toast
      setLastAddedItem(menuItem);
      setShowAddToCartToast(true);
      setTimeout(() => {
        setShowAddToCartToast(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };

  // Update item quantity in cart
  const handleUpdateQuantity = async (orderItem, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(orderItem);
      return;
    }

    try {
      await triggerUpdateOrderItem({
        orderItemId: orderItem.id,
        quantity: newQuantity,
      });

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === orderItem.id
            ? {
                ...item,
                attributes: {
                  ...item.attributes,
                  quantity: String(newQuantity),
                },
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity. Please try again.");
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = async (orderItem) => {
    try {
      await triggerRemoveOrderItem({ orderItemId: orderItem.id });

      const updatedItems = cartItems.filter((item) => item.id !== orderItem.id);
      setCartItems(updatedItems);

      // If cart is empty, clear order
      if (updatedItems.length === 0) {
        setCurrentOrder(null);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item. Please try again.");
    }
  };

  // Submit order
  const handleSubmitOrder = async () => {
    if (!currentOrder || cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      setOrderSubmitting(true);
      await triggerSubmitOrder({
        orderId: currentOrder.id,
        tableId,
      });

      // Show success animation
      setOrderSuccess(true);

      setTimeout(() => {
        setCartOpen(false);
        setOrderSuccess(false);
        setCurrentOrder(null);
        setCartItems([]);
      }, 3000);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order. Please try again.");
    } finally {
      setOrderSubmitting(false);
    }
  };

  // Calculate cart total
  const cartTotal = calculateOrderTotal(cartItems);
  const cartItemCount = cartItems.reduce(
    (total, item) => total + parseInt(item.attributes?.quantity || 0),
    0
  );

  if (restaurantLoading || menuLoading) {
    return <LoadingScreen />;
  }

  if (restaurantError || menuError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load restaurant data</p>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Restaurant not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 py-4 sticky top-0 z-40 bg-[#F5F5F0]">
        <div className="max-w-3xl mx-auto">
          <div className="nb-card flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{restaurant?.name || "Loading..."}</h1>
            <p className="text-sm text-black/70 flex items-center gap-1"><MapPin className="w-4 h-4" />{restaurant?.location || "Restaurant Location"} • Table {tableId}</p>
          </div>
          <button onClick={() => setCartOpen(true)} className="nb-btn nb-btn-primary rounded-full size-12 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 nb-border rounded-full bg-yellow-300 text-xs font-bold w-6 h-6 flex items-center justify-center">{cartItemCount}</span>
            )}
          </button>
          </div>
        </div>
      </div>
      <div className=" flex md:hidden justify-center py-2 items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`nb-btn ${viewMode === "grid" ? "nb-btn-secondary" : "nb-btn-outline"}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`nb-btn ${viewMode === "list" ? "nb-btn-secondary" : "nb-btn-outline"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Optional image toggle removed for simplicity */}
      </div>

      <div className="sticky top-20 z-30 px-4 py-3">
        <div className="relative max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/60 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 nb-input"
            />
          </div>
        </div>
      </div>

      <div className="sticky top-[calc(5rem+1px)] z-20 px-4 py-3">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 flex-1">
            {transformedCategories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleCategoryClick(category.id)}
                className={`nb-chip flex-shrink-0 ${activeCategory === category.id ? "bg-yellow-300" : "bg-white"}`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>

          <div className="md:flex hidden items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`nb-btn ${viewMode === "grid" ? "nb-btn-secondary" : "nb-btn-outline"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`nb-btn ${viewMode === "list" ? "nb-btn-secondary" : "nb-btn-outline"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="px-4 py-6 max-w-3xl mx-auto">
        <div className="space-y-8">
          {transformedCategories.map((category) => {
            const items = filteredMenu[category.id];
            if (!items || items.length === 0) return null;

            return (
              <section
                key={category.id}
                ref={(el) => {
                  sectionRefs.current[category.id] = el;
                }}
                data-category={category.id}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className={`inline-block w-3 h-3 nb-border rounded-sm ${categoryAccent(category.id).chip}`}></span>
                  <h2 className="text-xl sm:text-2xl font-bold capitalize">{category.name}</h2>
                  <div className="flex-1 h-0 nb-border-b"></div>
                </div>

                <div
                  className={`${
                    viewMode === "grid"
                      ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
                      : "space-y-2"
                  }`}
                >
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        data-item-id={`${category.id}-${item.id}`}
                        className={`group overflow-hidden nb-pressable p-2 sm:p-3 ${categoryAccent(category.id).border} ${
                          isVisible[`${category.id}-${item.id}`]
                            ? "animate-slide-up opacity-100"
                            : "animate-slide-up opacity-100"
                        } ${viewMode === "list" ? "flex items-center" : ""}`}
                      >
                        <div className={`hidden sm:block w-2 ${categoryAccent(category.id).chip} nb-border`} />
                        <div
                          className={`${
                            viewMode === "list"
                              ? "flex items-center w-full p-3 gap-2"
                              : "p-0"
                          }`}
                        >
                          {showImages && item.image && (
                            <div
                              className={`relative overflow-hidden ${
                                viewMode === "list"
                                  ? "w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl"
                                  : "mb-2 rounded-xl"
                              }`}
                            >
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
                                  viewMode === "list"
                                    ? "w-full h-full"
                                  : "w-full h-24 sm:h-28 md:h-32"
                                }`}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          )}

                          {showImages && !item.image && (
                            <div
                              className={`flex items-center justify-center rounded-xl ${categoryAccent(category.id).bg} nb-border ${
                                viewMode === "list"
                                  ? "w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0"
                                  : "mb-2 h-24 sm:h-28 md:h-32"
                              }`}
                            >
                              <ImageIcon className="w-8 h-8 text-black" />
                            </div>
                          )}

                          {!showImages && viewMode === "grid" && (
                            <div className="mb-2 flex items-center justify-center h-24 sm:h-28 md:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}

                          <div
                            className={`space-y-2 ${
                              viewMode === "list" ? "flex-1 ml-4" : ""
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-bold text-black text-sm leading-snug line-clamp-2">
                                {item.name}
                              </h3>
                              <span className={`font-bold whitespace-nowrap nb-chip nb-chip-sm ${categoryAccent(category.id).chip}`}>
                                Rs. {item.price}
                              </span>
                            </div>
                            {item.description && viewMode === "list" && (
                              <p className="text-xs text-black/70 line-clamp-2">
                                {item.description}
                              </p>
                            )}

                            {/* Add to Cart Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(item);
                              }}
                              disabled={cartLoading}
                              className="w-full mt-2 nb-btn nb-btn-primary text-sm"
                            >
                              <Plus className="w-3 h-3" />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {Object.keys(filteredMenu).length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-gray-400 mb-3">
              <Search className="w-12 h-12 mx-auto animate-pulse" />
            </div>
            <p className="text-gray-600 text-lg">
              No items found matching your search
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Try searching for something else
            </p>
          </div>
        )}
      </main>

      <AnimatePresence>
        {imageGalleryOpen && selectedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <button
                onClick={() => setImageGalleryOpen(false)}
                className="absolute top-4 right-4 z-10 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>

              {selectedImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev > 0 ? prev - 1 : selectedImages.length - 1
                      )
                    }
                    className="absolute left-4 z-10 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev < selectedImages.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="absolute right-4 z-10 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-4xl max-h-full"
              >
                <img
                  src={selectedImages[currentImageIndex] || "/placeholder.svg"}
                  alt={`Menu item ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                />
                {selectedImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {selectedImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(showWaiterAnimation || showBillAnimation) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-blue-500/20 backdrop-blur-md flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-white/20"
            >
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    {animationType === "waiter" ? (
                      <Phone className="w-12 h-12 text-white animate-pulse" />
                    ) : (
                      <Receipt className="w-12 h-12 text-white animate-pulse" />
                    )}
                  </div>
                  <div className="absolute inset-0 w-24 h-24 mx-auto">
                    <div className="absolute inset-0 bg-emerald-400/30 rounded-full animate-ping"></div>
                    <div className="absolute inset-2 bg-emerald-400/20 rounded-full animate-ping animation-delay-300"></div>
                    <div className="absolute inset-4 bg-emerald-400/10 rounded-full animate-ping animation-delay-600"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {animationType === "waiter"
                      ? "Calling Waiter"
                      : "Requesting Bill"}
                  </h3>
                  <p className="text-gray-600">
                    {animationType === "waiter"
                      ? `A waiter is being notified for Table ${tableId}`
                      : `Your bill is being prepared for Table ${tableId}`}
                  </p>
                </div>

                <div className="relative w-32 h-32 mx-auto">
                  <svg
                    className="w-32 h-32 transform -rotate-90"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 54}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 54 * (1 - animationProgress / 100)
                      }`}
                      className="text-emerald-500 transition-all duration-100 ease-linear"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {Math.round(animationProgress)}%
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.ceil((100 - animationProgress) / 10)}s
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    className={`flex items-center gap-2 text-sm transition-all duration-500 ${
                      animationProgress > 20
                        ? "text-green-600 opacity-100"
                        : "text-gray-400 opacity-50"
                    }`}
                  >
                    <CheckCircle
                      className={`w-4 h-4 ${
                        animationProgress > 20 ? "animate-bounce" : ""
                      }`}
                    />
                    Request received
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm transition-all duration-500 ${
                      animationProgress > 50
                        ? "text-green-600 opacity-100"
                        : "text-gray-400 opacity-50"
                    }`}
                  >
                    <CheckCircle
                      className={`w-4 h-4 ${
                        animationProgress > 50 ? "animate-bounce" : ""
                      }`}
                    />
                    {animationType === "waiter"
                      ? "Notifying staff"
                      : "Processing request"}
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm transition-all duration-500 ${
                      animationProgress > 80
                        ? "text-green-600 opacity-100"
                        : "text-gray-400 opacity-50"
                    }`}
                  >
                    <CheckCircle
                      className={`w-4 h-4 ${
                        animationProgress > 80 ? "animate-bounce" : ""
                      }`}
                    />
                    {animationType === "waiter"
                      ? "Waiter on the way"
                      : "Bill being prepared"}
                  </div>
                </div>

                <div className="relative h-8 overflow-hidden rounded-b-3xl">
                  <div className="absolute bottom-0 left-0 w-full">
                    <Waves className="w-full h-6 text-emerald-200 animate-pulse" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add to Cart Toast Notification */}
      <AnimatePresence>
        {showAddToCartToast && lastAddedItem && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Added to cart!</p>
              <p className="text-xs text-white/90">{lastAddedItem.name}</p>
            </div>
            <button
              onClick={() => setCartOpen(true)}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
            >
              View
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Cart Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        onClick={() => setCartOpen(true)}
        className="fixed bottom-24 right-4 sm:right-6 z-40 w-16 h-16 nb-btn nb-btn-primary rounded-full"
      >
        <ShoppingCart className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
        {cartItemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-300 nb-border text-xs font-bold rounded-full flex items-center justify-center"
          >
            {cartItemCount}
          </motion.span>
        )}
      </motion.button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Cart Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 w-full sm:w-96 bg-white nb-border nb-shadow z-50 flex flex-col rounded-t-lg"
            >
              {/* Cart Header */}
              <div className="p-4 nb-border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6" />
                  <div>
                    <h2 className="text-xl font-bold">Your Cart</h2>
                    <p className="text-sm text-black/70">{cartItemCount} {cartItemCount === 1 ? "item" : "items"}</p>
                  </div>
                </div>
                <button onClick={() => setCartOpen(false)} className="nb-btn nb-btn-outline size-9">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg font-semibold">Your cart is empty</p>
                    <p className="text-sm">Add some delicious items!</p>
                  </div>
                ) : (
                  cartItems.map((orderItem) => {
                    const menuItem = orderItem.attributes?.menu_item?.data;
                    const quantity = parseInt(
                      orderItem.attributes?.quantity || 0
                    );
                    const price = parseFloat(orderItem.attributes?.price || 0);
                    const itemTotal = quantity * price;

                    return (
                      <motion.div
                        key={orderItem.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm"
                      >
                        <div className="flex gap-3">
                          {/* Item Image */}
                          {menuItem?.attributes?.image?.data?.attributes
                            ?.url && (
                            <img
                              src={
                                menuItem.attributes.image.data.attributes.url
                              }
                              alt={menuItem.attributes.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}

                          {/* Item Details */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {menuItem?.attributes?.name || "Unknown Item"}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              Rs. {price} each
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(orderItem, quantity - 1)
                                }
                                className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center font-semibold">
                                {quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(orderItem, quantity + 1)
                                }
                                className="w-7 h-7 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg flex items-center justify-center hover:from-emerald-600 hover:to-blue-600 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleRemoveFromCart(orderItem)}
                                className="ml-auto w-7 h-7 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              Rs. {itemTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Cart Footer */}
              {cartItems.length > 0 && (
                <div className="nb-border-t p-4 bg-[#F5F5F0] space-y-3">
                  {/* Order Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">
                        Rs. {cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-emerald-600">
                        Rs. {cartTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Order Info */}
                  {currentOrder && (
                    <div className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>
                          Order #{currentOrder.attributes?.order_number}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitOrder}
                    disabled={orderSubmitting || cartItems.length === 0}
                    className="w-full nb-btn nb-btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {orderSubmitting ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        Placing Order...
                      </>
                    ) : orderSuccess ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Order Placed!
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#F5F5F0] nb-border-t">
        <div className="max-w-3xl mx-auto grid grid-cols-2 gap-3">
          <button
            onClick={handleCallWaiter}
            disabled={showWaiterAnimation || showBillAnimation}
            className="flex-1 nb-btn nb-btn-outline nb-pressable justify-center"
          >
            <Phone className="w-5 h-5" />
            <span className="ml-2">Call Waiter</span>
          </button>
          <button
            onClick={handleAskForBill}
            disabled={showWaiterAnimation || showBillAnimation}
            className="flex-1 nb-btn nb-btn-primary nb-pressable justify-center"
          >
            <Receipt className="w-5 h-5" />
            <span className="ml-2">Ask for Bill</span>
          </button>
        </div>
      </div>
    </div>
  );
}
