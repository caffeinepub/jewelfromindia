import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Heart } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "../components/ProductCard";
import {
  useProducts,
  useRemoveFromWishlist,
  useWishlist,
} from "../hooks/useQueries";

export function WishlistPage() {
  const navigate = useNavigate();
  const { data: wishlistIds = [] } = useWishlist();
  const { data: allProducts = [] } = useProducts();
  const removeFromWishlist = useRemoveFromWishlist();

  const wishlistProducts = allProducts.filter((p) =>
    wishlistIds.includes(p.id),
  );

  const handleRemove = (productId: bigint) => {
    removeFromWishlist.mutate(productId, {
      onSuccess: () => toast.success("Removed from wishlist"),
    });
  };

  return (
    <main
      className="container mx-auto px-4 py-8 pb-24 lg:pb-8"
      data-ocid="wishlist.page"
    >
      <p className="text-xs tracking-[0.3em] text-gold uppercase mb-1">Saved</p>
      <h1 className="font-serif text-3xl font-bold text-ivory mb-8">
        My Wishlist
      </h1>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20" data-ocid="wishlist.empty_state">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
          <Button
            data-ocid="wishlist.primary_button"
            onClick={() => navigate({ to: "/browse" })}
            className="gold-gradient text-background border-0 font-semibold"
          >
            Discover Collections <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          data-ocid="wishlist.list"
        >
          {wishlistProducts.map((product, i) => (
            <ProductCard
              key={String(product.id)}
              product={product}
              index={i}
              isInWishlist
              onWishlistToggle={handleRemove}
            />
          ))}
        </div>
      )}
    </main>
  );
}
