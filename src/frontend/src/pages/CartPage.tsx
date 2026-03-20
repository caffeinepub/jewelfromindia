import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { formatPrice } from "../data/sampleProducts";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCart,
  useCreateCheckoutSession,
  useProducts,
  useRemoveFromCart,
} from "../hooks/useQueries";

export function CartPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { data: cartIds = [] } = useCart();
  const { data: allProducts = [] } = useProducts();
  const removeFromCart = useRemoveFromCart();
  const checkout = useCreateCheckoutSession();

  const cartProducts = allProducts.filter((p) => cartIds.includes(p.id));
  const subtotal = cartProducts.reduce((sum, p) => sum + Number(p.price), 0);
  const shipping = subtotal > 50000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!identity) {
      toast.error("Please sign in to checkout");
      login();
      return;
    }
    if (cartProducts.length === 0) return;

    const items = cartProducts.map((p) => ({
      productName: p.name,
      currency: "inr",
      quantity: 1n,
      priceInCents: p.price * 100n,
      productDescription: p.description.slice(0, 200),
    }));

    const origin = window.location.origin;
    checkout.mutate(
      {
        items,
        successUrl: `${origin}/checkout-success`,
        cancelUrl: `${origin}/cart`,
      },
      {
        onSuccess: (url) => {
          if (url) window.location.href = url;
        },
        onError: () => toast.error("Checkout unavailable. Please try again."),
      },
    );
  };

  if (!identity) {
    return (
      <main
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="cart.page"
      >
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold text-ivory mb-2">
          Your Cart
        </h1>
        <p className="text-muted-foreground mb-6">
          Sign in to view your cart and checkout
        </p>
        <Button
          data-ocid="auth.button"
          onClick={() => login()}
          className="gold-gradient text-background font-semibold border-0"
        >
          Sign In
        </Button>
      </main>
    );
  }

  return (
    <main
      className="container mx-auto px-4 py-8 pb-24 lg:pb-8"
      data-ocid="cart.page"
    >
      <p className="text-xs tracking-[0.3em] text-gold uppercase mb-1">
        Your Selection
      </p>
      <h1 className="font-serif text-3xl font-bold text-ivory mb-8">
        Shopping Cart
      </h1>

      {cartProducts.length === 0 ? (
        <div className="text-center py-20" data-ocid="cart.empty_state">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button
            data-ocid="cart.primary_button"
            onClick={() => navigate({ to: "/browse" })}
            className="gold-gradient text-background border-0 font-semibold"
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4" data-ocid="cart.list">
            {cartProducts.map((product, i) => (
              <motion.div
                key={String(product.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 bg-card border border-border/40 rounded-xl p-4"
                data-ocid={`cart.item.${i + 1}`}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-semibold text-foreground line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {product.metalType} · {product.gemstone}
                  </p>
                  <p className="text-base font-bold text-gold mt-2">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid={`cart.delete_button.${i + 1}`}
                  onClick={() =>
                    removeFromCart.mutate(product.id, {
                      onSuccess: () => toast.success("Removed from cart"),
                    })
                  }
                  className="text-muted-foreground hover:text-destructive transition-colors p-1 self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div
            className="bg-card border border-border/40 rounded-xl p-6 h-fit space-y-4"
            data-ocid="cart.panel"
          >
            <h2 className="font-serif text-lg font-bold text-ivory">
              Order Summary
            </h2>
            <Separator className="border-border/40" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({cartProducts.length} items)
                </span>
                <span className="text-foreground">
                  &#8377;{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span
                  className={
                    shipping === 0 ? "text-green-400" : "text-foreground"
                  }
                >
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>
            </div>
            <Separator className="border-border/40" />
            <div className="flex justify-between font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-gold text-lg">
                &#8377;{total.toLocaleString("en-IN")}
              </span>
            </div>
            <Button
              data-ocid="cart.submit_button"
              onClick={handleCheckout}
              disabled={checkout.isPending}
              className="w-full gold-gradient text-background font-semibold border-0 hover:opacity-90"
            >
              {checkout.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Secured by Stripe • Free returns within 30 days
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
