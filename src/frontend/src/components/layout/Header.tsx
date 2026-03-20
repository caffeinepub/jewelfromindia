import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useCart, useWishlist } from "../../hooks/useQueries";

const NAV_LINKS = [
  { label: "Collections", to: "/browse" },
  { label: "Bridal", to: "/browse?category=bridalSets" },
  { label: "Heritage", to: "/heritage" },
  { label: "Design Your Own", to: "/custom" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();
  const cartCount = cart?.length ?? 0;
  const wishlistCount = wishlist?.length ?? 0;

  return (
    <header
      className="sticky top-0 z-50 border-b border-border/50"
      style={{
        background: "oklch(0.07 0 0 / 0.95)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0"
            data-ocid="nav.link"
          >
            <div className="flex flex-col leading-none">
              <span className="font-serif text-xl font-bold text-gold tracking-wide">
                JewelfromIndia
              </span>
              <span className="text-[9px] tracking-[0.25em] text-muted-foreground uppercase">
                Est. Heritage
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid="nav.link"
                className="text-sm font-medium text-muted-foreground hover:text-gold transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              type="button"
              data-ocid="search.button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-md text-muted-foreground hover:text-gold transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              data-ocid="nav.link"
              className="relative p-2 rounded-md text-muted-foreground hover:text-gold transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold rounded-full gold-gradient text-background flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              data-ocid="nav.link"
              className="relative p-2 rounded-md text-muted-foreground hover:text-gold transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold rounded-full gold-gradient text-background flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {identity ? (
              <Link
                to="/profile"
                data-ocid="nav.link"
                className="p-2 rounded-md text-muted-foreground hover:text-gold transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Button
                size="sm"
                data-ocid="auth.button"
                onClick={() => login()}
                disabled={loginStatus === "logging-in"}
                className="hidden sm:flex gold-gradient text-background font-semibold hover:opacity-90 border-0"
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu */}
            <button
              type="button"
              data-ocid="nav.toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-gold"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pb-3"
            >
              <Input
                autoFocus
                placeholder="Search rings, necklaces, earrings…"
                data-ocid="search.input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchOpen(false);
                    navigate({ to: "/browse" });
                  }
                }}
                className="bg-secondary border-border/60 focus:border-gold/60"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-border/50 bg-background"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  data-ocid="nav.link"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 px-3 rounded-md text-sm font-medium text-foreground hover:bg-secondary hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!identity && (
                <Button
                  data-ocid="auth.button"
                  onClick={() => {
                    login();
                    setMobileOpen(false);
                  }}
                  className="mt-2 gold-gradient text-background font-semibold border-0"
                >
                  Sign In
                </Button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export { ChevronDown };
