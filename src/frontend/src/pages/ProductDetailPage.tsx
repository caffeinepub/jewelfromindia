import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ChevronLeft,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  X,
  ZoomIn,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { HallmarkBadge } from "../components/HallmarkBadge";
import { StarRating, StarRatingInput } from "../components/StarRating";
import { formatPrice } from "../data/sampleProducts";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddReview,
  useAddToCart,
  useAddToWishlist,
  useCart,
  useProducts,
  useRemoveFromWishlist,
  useReviews,
  useWishlist,
} from "../hooks/useQueries";

export function ProductDetailPage() {
  const { productId } = useParams({ strict: false }) as { productId: string };
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const [zoomOpen, setZoomOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const { data: products = [] } = useProducts();
  const product = products.find((p) => String(p.id) === productId);

  const { data: wishlist = [] } = useWishlist();
  const { data: cart = [] } = useCart();
  const { data: reviews = [] } = useReviews(product?.id ?? 0n);

  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addReview = useAddReview();

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Button
          variant="outline"
          className="mt-4 border-gold/40 text-gold"
          onClick={() => navigate({ to: "/browse" })}
        >
          Back to Collections
        </Button>
      </main>
    );
  }

  const imageUrl =
    product.images[0] ??
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop";
  const isInWishlist = wishlist.includes(product.id);
  const isInCart = cart.includes(product.id);

  const handleAddToCart = () => {
    if (!identity) {
      toast.error("Please sign in first");
      return;
    }
    if (isInCart) {
      navigate({ to: "/cart" });
      return;
    }
    addToCart.mutate(product.id, {
      onSuccess: () => toast.success("Added to cart!"),
      onError: () => toast.error("Could not add to cart"),
    });
  };

  const handleWishlistToggle = () => {
    if (!identity) {
      toast.error("Please sign in first");
      return;
    }
    if (isInWishlist) {
      removeFromWishlist.mutate(product.id, {
        onSuccess: () => toast.success("Removed from wishlist"),
      });
    } else {
      addToWishlist.mutate(product.id, {
        onSuccess: () => toast.success("Saved to wishlist ♥"),
      });
    }
  };

  const handleReviewSubmit = () => {
    if (!identity) {
      toast.error("Please sign in to leave a review");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }
    addReview.mutate(
      {
        productId: product.id,
        comment: reviewText,
        rating: BigInt(reviewRating),
        user: identity.getPrincipal(),
      },
      {
        onSuccess: () => {
          toast.success("Review submitted!");
          setReviewText("");
          setReviewRating(5);
        },
        onError: () => toast.error("Could not submit review"),
      },
    );
  };

  return (
    <main
      className="container mx-auto px-4 py-8 pb-24 lg:pb-8"
      data-ocid="product.page"
    >
      {/* Breadcrumb */}
      <button
        type="button"
        data-ocid="product.link"
        onClick={() => navigate({ to: "/browse" })}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-gold mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Collections
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="space-y-3">
          <button
            type="button"
            className="relative aspect-square rounded-xl overflow-hidden bg-secondary cursor-zoom-in group w-full"
            onClick={() => setZoomOpen(true)}
          >
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center">
              <ZoomIn className="w-4 h-4 text-gold" />
            </div>
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Click image to zoom
          </p>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <Badge
              variant="outline"
              className="border-gold/40 text-gold text-xs mb-3"
            >
              {product.category.charAt(0).toUpperCase() +
                product.category.slice(1)}
            </Badge>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-ivory leading-tight mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-3">
              <StarRating rating={4.5} size="md" />
              <span className="text-sm text-muted-foreground">
                ({reviews.length} reviews)
              </span>
            </div>
          </div>

          <div className="text-3xl font-bold text-gold font-sans">
            {formatPrice(product.price)}
          </div>

          {product.hallmarkCertified && <HallmarkBadge />}

          <Separator className="border-border/40" />

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Metal", value: product.metalType },
              { label: "Gemstone", value: product.gemstone },
              { label: "Weight", value: `${product.weight}g` },
              {
                label: "Stock",
                value: `${String(product.stockQuantity)} pieces`,
              },
            ].map(({ label, value }) => (
              <div key={label} className="bg-secondary/60 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                <p className="text-sm font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {product.craftsmanshipNotes && (
            <div className="border border-gold/20 rounded-lg p-4 bg-gold/5">
              <p className="text-xs text-gold font-semibold uppercase tracking-wider mb-1">
                Craftsmanship Notes
              </p>
              <p className="text-sm text-muted-foreground">
                {product.craftsmanshipNotes}
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-3 pt-2">
            <Button
              data-ocid="product.primary_button"
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
              className={cn(
                "flex-1 font-semibold border-0",
                isInCart
                  ? "bg-secondary text-gold border border-gold/40"
                  : "gold-gradient text-background hover:opacity-90",
              )}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isInCart ? "View in Cart" : "Add to Cart"}
            </Button>
            <Button
              variant="outline"
              data-ocid="product.toggle"
              onClick={handleWishlistToggle}
              className={cn(
                "border border-border/60 hover:border-gold/40",
                isInWishlist && "border-gold/40 text-gold bg-gold/10",
              )}
            >
              <Heart
                className={cn("w-4 h-4", isInWishlist && "fill-gold text-gold")}
              />
            </Button>
            <Button
              variant="outline"
              data-ocid="product.button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied!");
              }}
              className="border-border/60 hover:border-gold/40"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16" data-ocid="reviews.section">
        <h2 className="font-serif text-2xl font-bold text-ivory mb-6">
          Customer Reviews
        </h2>

        {reviews.length === 0 ? (
          <p
            className="text-muted-foreground text-sm mb-8"
            data-ocid="reviews.empty_state"
          >
            No reviews yet. Be the first!
          </p>
        ) : (
          <div className="space-y-4 mb-8">
            {reviews.map((review, i) => (
              <motion.div
                key={`${review.user.toString()}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border/40 rounded-lg p-4"
                data-ocid={`reviews.item.${i + 1}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <StarRating rating={Number(review.rating)} size="sm" />
                  <span className="text-xs text-muted-foreground">
                    {review.user.toString().slice(0, 12)}...
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {review.comment}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add review */}
        <div className="bg-card border border-border/40 rounded-xl p-6">
          <h3 className="font-serif text-lg font-semibold text-ivory mb-4">
            Write a Review
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your Rating</p>
              <StarRatingInput
                value={reviewRating}
                onChange={setReviewRating}
              />
            </div>
            <Textarea
              data-ocid="review.textarea"
              placeholder="Share your experience with this piece..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="bg-secondary border-border/60 focus:border-gold/60 resize-none"
              rows={3}
            />
            <Button
              data-ocid="review.submit_button"
              onClick={handleReviewSubmit}
              disabled={addReview.isPending}
              className="gold-gradient text-background font-semibold border-0 hover:opacity-90"
            >
              Submit Review
            </Button>
          </div>
        </div>
      </section>

      {/* Zoom modal */}
      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
            onClick={() => setZoomOpen(false)}
            data-ocid="zoom.modal"
          >
            <button
              type="button"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
              onClick={() => setZoomOpen(false)}
              data-ocid="zoom.close_button"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={imageUrl}
              alt={product.name}
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
