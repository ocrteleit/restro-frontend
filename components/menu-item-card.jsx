"use client";

import { motion } from "framer-motion";
import { Plus, ImageIcon } from "lucide-react";

export function MenuItemCard({
  item,
  viewMode,
  isVisible,
  onAddToCart,
  cartLoading,
  index,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div
        className={`bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-primary/30 group ${
          viewMode === "list" ? "flex items-center" : ""
        }`}
      >
        <div
          className={`${
            viewMode === "list" ? "flex items-center w-full p-4" : "p-3"
          }`}
        >
          {/* Image */}
          {item.image && (
            <div
              className={`relative overflow-hidden ${
                viewMode === "list"
                  ? "w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg"
                  : "mb-3 rounded-lg"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}

          {!item.image && (
            <div
              className={`flex items-center justify-center bg-secondary rounded-lg ${
                viewMode === "list"
                  ? "w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0"
                  : "mb-3 h-32 sm:h-36 md:h-40 w-full"
              }`}
            >
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
          )}

          {/* Content */}
          <div
            className={`space-y-2 ${viewMode === "list" ? "flex-1 ml-4" : ""}`}
          >
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {item.name}
              </h3>
              <span className="text-primary font-bold text-sm whitespace-nowrap bg-secondary px-3 py-1 rounded-full">
                Rs. {item.price}
              </span>
            </div>

            {item.description && viewMode === "list" && (
              <p className="text-xs text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors duration-200">
                {item.description}
              </p>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(item);
              }}
              disabled={cartLoading}
              className="w-full mt-2 py-2 px-3 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-accent transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-3 h-3" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
