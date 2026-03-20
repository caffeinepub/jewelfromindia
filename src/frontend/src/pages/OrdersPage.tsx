import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, Package } from "lucide-react";
import { motion } from "motion/react";
import { OrderStatus } from "../backend";
import { formatPrice } from "../data/sampleProducts";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useOrderHistory, useProducts } from "../hooks/useQueries";

const STATUS_STYLE: Record<OrderStatus, string> = {
  [OrderStatus.pending]:
    "border-yellow-500/50 text-yellow-400 bg-yellow-500/10",
  [OrderStatus.shipped]: "border-blue-500/50 text-blue-400 bg-blue-500/10",
  [OrderStatus.delivered]: "border-green-500/50 text-green-400 bg-green-500/10",
  [OrderStatus.cancelled]: "border-red-500/50 text-red-400 bg-red-500/10",
};

export function OrdersPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { data: orders = [], isLoading } = useOrderHistory();
  const { data: allProducts = [] } = useProducts();

  if (!identity) {
    return (
      <main
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="orders.page"
      >
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold text-ivory mb-2">
          My Orders
        </h1>
        <p className="text-muted-foreground mb-6">
          Sign in to view your order history
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
      data-ocid="orders.page"
    >
      <p className="text-xs tracking-[0.3em] text-gold uppercase mb-1">
        Your Journey
      </p>
      <h1 className="font-serif text-3xl font-bold text-ivory mb-8">
        Order History
      </h1>

      {isLoading ? (
        <div className="text-center py-20" data-ocid="orders.loading_state">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20" data-ocid="orders.empty_state">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No orders yet</p>
          <Button
            data-ocid="orders.primary_button"
            onClick={() => navigate({ to: "/browse" })}
            className="gold-gradient text-background border-0 font-semibold"
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-4" data-ocid="orders.list">
          {orders.map((order, i) => {
            const orderProducts = allProducts.filter((p) =>
              order.items.includes(p.id),
            );
            const orderTotal = orderProducts.reduce(
              (s, p) => s + Number(p.price),
              0,
            );

            return (
              <motion.div
                key={String(order.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border/40 rounded-xl p-5"
                data-ocid={`orders.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Order #{String(order.id)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(
                        Number(order.timestamp) / 1_000_000,
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={STATUS_STYLE[order.status]}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex gap-2 mb-3">
                  {orderProducts.slice(0, 3).map((p) => (
                    <img
                      key={String(p.id)}
                      src={p.images[0]}
                      alt={p.name}
                      className="w-14 h-14 object-cover rounded-lg border border-border/40"
                    />
                  ))}
                  {orderProducts.length > 3 && (
                    <div className="w-14 h-14 rounded-lg border border-border/40 bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                      +{orderProducts.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gold">
                    {formatPrice(BigInt(orderTotal))}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {order.items.length} items
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </main>
  );
}
