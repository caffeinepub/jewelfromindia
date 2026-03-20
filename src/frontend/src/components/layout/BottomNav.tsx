import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { Grid3X3, Heart, Home, ShoppingCart, User } from "lucide-react";
import { useCart, useWishlist } from "../../hooks/useQueries";

const NAV_ITEMS = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/browse", icon: Grid3X3, label: "Browse" },
  { to: "/wishlist", icon: Heart, label: "Wishlist" },
  { to: "/cart", icon: ShoppingCart, label: "Cart" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const location = useLocation();
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/50"
      style={{
        background: "oklch(0.09 0 0 / 0.97)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive =
            location.pathname === to ||
            (to !== "/" && location.pathname.startsWith(to));
          const count =
            to === "/cart"
              ? (cart?.length ?? 0)
              : to === "/wishlist"
                ? (wishlist?.length ?? 0)
                : 0;
          return (
            <Link
              key={to}
              to={to}
              data-ocid="nav.link"
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors relative",
                isActive
                  ? "text-gold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[9px] font-bold rounded-full gold-gradient text-background flex items-center justify-center">
                    {count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
