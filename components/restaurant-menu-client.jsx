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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  fetchMenuItems,
  getRestaurantName,
  groupMenuItemsByCategory,
  getUniqueCategories,
} from "@/lib/api";
import { callWaiterMutation, requestBillMutation } from "@/lib/table-service";
import LoadingScreen from "./loading-screen";

function Card({ className, ...props }) {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
        className || ""
      }`}
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
    <div className="min-h-screen pb-24 bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white p-4 sm:p-6 text-center shadow-xl"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
          <div className="relative z-10 space-y-3 p-5">
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold animate-fade-in bg-white/20 backdrop-blur-sm rounded-2xl py-3 px-6 inline-block"
            >
              {restaurant?.name || "Loading..."}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 text-white/90 animate-fade-in animation-delay-100"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm sm:text-base">
                {restaurant?.location || "Restaurant Location"}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium animate-fade-in animation-delay-200"
            >
              <Star className="w-4 h-4 text-yellow-300" />
              Table {tableId}
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-4 py-4 shadow-sm">
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl blur-sm opacity-20"></div>
          <div className="relative bg-white rounded-2xl shadow-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search delicious items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-base bg-transparent border-0 focus:ring-2 focus:ring-orange-400/50 rounded-2xl"
            />
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100/50 px-4 py-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 flex-1">
            {transformedCategories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex-shrink-0 px-6 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white scale-105 shadow-xl"
                    : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100 hover:text-orange-600 border border-gray-200/50"
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-gray-200/50">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleEyeClick}
              className={`p-3 rounded-2xl transition-all duration-200 shadow-lg border border-gray-200/50 ${
                showImages
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xl"
                  : "bg-white/80 backdrop-blur-sm text-gray-500 hover:text-gray-700"
              }`}
              title={showImages ? "View image gallery" : "Show images"}
            >
              {showImages ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <main className="px-4 py-6 max-w-7xl mx-auto">
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
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent capitalize">
                    {category.name}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-orange-200 via-pink-200 to-transparent"></div>
                </div>

                <div
                  className={`${
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                      : "space-y-3"
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
                        className={`group overflow-hidden hover:border-orange-300/50 transition-all duration-300 hover:shadow-2xl pb-3 transform hover:scale-105 hover:-translate-y-1 ${
                          isVisible[`${category.id}-${item.id}`]
                            ? "animate-slide-up opacity-100"
                            : "animate-slide-up opacity-100"
                        } ${viewMode === "list" ? "flex items-center" : ""}`}
                      >
                        <div
                          className={`${
                            viewMode === "list"
                              ? "flex items-center w-full p-4"
                              : "p-3"
                          }`}
                        >
                          {showImages && item.image && (
                            <div
                              className={`relative overflow-hidden ${
                                viewMode === "list"
                                  ? "w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl"
                                  : "mb-3 rounded-xl"
                              }`}
                            >
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
                                  viewMode === "list"
                                    ? "w-full h-full"
                                    : "w-full h-32 sm:h-36 md:h-40"
                                }`}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          )}

                          {showImages && !item.image && (
                            <div
                              className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl ${
                                viewMode === "list"
                                  ? "w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0"
                                  : "mb-3 h-32 sm:h-36 md:h-40"
                              }`}
                            >
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}

                          {!showImages && viewMode === "grid" && (
                            <div className="mb-3 flex items-center justify-center h-32 sm:h-36 md:h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}

                          <div
                            className={`space-y-2 ${
                              viewMode === "list" ? "flex-1 ml-4" : ""
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
                                {item.name}
                              </h3>
                              <span className="text-white font-bold text-sm whitespace-nowrap bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-1 rounded-full shadow-lg">
                                Rs. {item.price}
                              </span>
                            </div>
                            {item.description && viewMode === "list" && (
                              <p className="text-xs text-gray-600 line-clamp-2 group-hover:text-gray-800 transition-colors duration-200">
                                {item.description}
                              </p>
                            )}
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
            className="fixed inset-0 z-50 bg-gradient-to-br from-orange-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-md flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-white/20"
            >
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    {animationType === "waiter" ? (
                      <Phone className="w-12 h-12 text-white animate-pulse" />
                    ) : (
                      <Receipt className="w-12 h-12 text-white animate-pulse" />
                    )}
                  </div>
                  <div className="absolute inset-0 w-24 h-24 mx-auto">
                    <div className="absolute inset-0 bg-orange-400/30 rounded-full animate-ping"></div>
                    <div className="absolute inset-2 bg-orange-400/20 rounded-full animate-ping animation-delay-300"></div>
                    <div className="absolute inset-4 bg-orange-400/10 rounded-full animate-ping animation-delay-600"></div>
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
                      className="text-orange-500 transition-all duration-100 ease-linear"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-orange-600">
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
                    <Waves className="w-full h-6 text-orange-200 animate-pulse" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 p-4 shadow-2xl"
      >
        <div className="flex justify-between items-center gap-4 max-w-md mx-auto">
          <button
            onClick={handleCallWaiter}
            disabled={showWaiterAnimation || showBillAnimation}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl border-2 border-gray-300/50 bg-white/80 backdrop-blur-sm text-gray-800 font-semibold transition-all duration-300 hover:border-orange-400 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 hover:text-orange-600 active:scale-95 hover:shadow-xl group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Phone className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            <span className="hidden xs:inline">Call Waiter</span>
            <span className="xs:hidden">Waiter</span>
          </button>

          <button
            onClick={handleAskForBill}
            disabled={showWaiterAnimation || showBillAnimation}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold transition-all duration-300 hover:from-orange-600 hover:to-pink-600 hover:shadow-2xl active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
          >
            <Receipt className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            <span className="hidden xs:inline">Ask for Bill</span>
            <span className="xs:hidden">Bill</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
