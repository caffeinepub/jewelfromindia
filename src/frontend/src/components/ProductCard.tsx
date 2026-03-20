import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../backend";
import { formatPrice } from "../data/sampleProducts";
import { HallmarkBadge } from "./HallmarkBadge";
import { StarRating } from "./StarRating";

interface ProductCardProps {
  product: Product;
  isInWishlist?: boolean;
  onWishlistToggle?: (productId: bigint) => void;
  index?: number;
}

export function ProductCard({
  product,
  isInWishlist,
  onWishlistToggle,
  index = 0,
}: ProductCardProps) {
  const imageUrl =
    product.images[0] ??
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="group relative card-hover"
    >
      <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-gold/40 transition-all duration-300 hover:shadow-gold">
        {/* Image */}
        <Link
          to="/product/$productId"
          params={{ productId: String(product.id) }}
        >
          <div className="product-image-zoom relative aspect-square bg-secondary">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {product.stockQuantity <= 2n && product.stockQuantity > 0n && (
              <div className="absolute top-2 left-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/90 text-destructive-foreground font-medium">
                  Only {String(product.stockQuantity)} left
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Wishlist button */}
        <button
          type="button"
          data-ocid="product.toggle"
          onClick={() => onWishlistToggle?.(product.id)}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center",
            "bg-background/80 backdrop-blur-sm border border-border",
            "transition-all duration-200 hover:border-gold/60 hover:bg-card",
            isInWishlist && "border-gold/60 bg-gold/10",
          )}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isInWishlist ? "fill-gold text-gold" : "text-muted-foreground",
            )}
          />
        </button>

        {/* Info */}
        <div className="p-3 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <Link
              to="/product/$productId"
              params={{ productId: String(product.id) }}
              className="block"
            >
              <h3 className="font-serif text-sm font-semibold text-foreground leading-tight hover:text-gold transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            {product.metalType} ·{" "}
            {product.gemstone !== "None" ? product.gemstone : "Plain Gold"}
          </p>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-base font-semibold text-gold font-sans">
              {formatPrice(product.price)}
            </span>
            {product.hallmarkCertified && <HallmarkBadge compact />}
          </div>

          <StarRating rating={4.5} size="sm" />
        </div>
      </div>
    </motion.div>
  );
}
