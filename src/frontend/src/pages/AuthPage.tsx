import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { Check, Edit2, Loader2, LogOut, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useIsAdmin,
  useSaveUserProfile,
  useUserProfile,
} from "../hooks/useQueries";

export function AuthPage() {
  const { identity, login, clear, loginStatus, isInitializing } =
    useInternetIdentity();
  const { data: profile } = useUserProfile();
  const { data: isAdmin } = useIsAdmin();
  const saveProfile = useSaveUserProfile();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    saveProfile.mutate(nameInput, {
      onSuccess: () => {
        toast.success("Profile updated!");
        setEditingName(false);
      },
      onError: () => toast.error("Could not update profile"),
    });
  };

  if (isInitializing) {
    return (
      <main
        className="container mx-auto px-4 py-20 flex justify-center"
        data-ocid="profile.loading_state"
      >
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </main>
    );
  }

  if (!identity) {
    return (
      <main
        className="container mx-auto px-4 py-20 flex flex-col items-center text-center"
        data-ocid="auth.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full"
        >
          <div className="w-20 h-20 rounded-full bg-card border border-gold/20 flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-gold" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-ivory mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Sign in to access your cart, wishlist, and order history.
          </p>
          <Button
            data-ocid="auth.primary_button"
            onClick={() => login()}
            disabled={loginStatus === "logging-in"}
            className="w-full gold-gradient text-background font-semibold border-0"
          >
            {loginStatus === "logging-in" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Secure & private authentication.
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main
      className="container mx-auto px-4 py-8 pb-24 lg:pb-8"
      data-ocid="profile.page"
    >
      <p className="text-xs tracking-[0.3em] text-gold uppercase mb-1">
        Account
      </p>
      <h1 className="font-serif text-3xl font-bold text-ivory mb-8">
        My Profile
      </h1>

      <div className="max-w-lg space-y-6">
        {/* Profile card */}
        <div className="bg-card border border-border/40 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center">
              <span className="font-serif text-xl font-bold text-background">
                {(profile?.name ?? "U")[0].toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {profile?.name ?? "Valued Customer"}
              </p>
              <p className="text-xs text-muted-foreground">
                {identity.getPrincipal().toString().slice(0, 20)}...
              </p>
              {isAdmin && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 mt-1 inline-block">
                  Admin
                </span>
              )}
            </div>
          </div>

          <Separator className="border-border/40 mb-5" />

          {editingName ? (
            <div className="flex gap-2">
              <Input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Your name"
                data-ocid="profile.input"
                className="border-border/60 focus:border-gold/60 bg-secondary"
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              />
              <Button
                size="sm"
                data-ocid="profile.save_button"
                onClick={handleSaveName}
                disabled={saveProfile.isPending}
                className="gold-gradient text-background border-0"
              >
                {saveProfile.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </Button>
            </div>
          ) : (
            <button
              type="button"
              data-ocid="profile.edit_button"
              onClick={() => {
                setEditingName(true);
                setNameInput(profile?.name ?? "");
              }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
            >
              <Edit2 className="w-4 h-4" /> Edit display name
            </button>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "My Orders", to: "/orders", icon: "📦" },
            { label: "Wishlist", to: "/wishlist", icon: "❤️" },
            { label: "Cart", to: "/cart", icon: "🛒" },
            ...(isAdmin
              ? [{ label: "Admin Panel", to: "/admin", icon: "⚙️" }]
              : []),
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid="profile.link"
              className="flex items-center gap-3 p-4 bg-card border border-border/40 rounded-lg hover:border-gold/40 transition-colors group"
            >
              <span className="text-xl">{link.icon}</span>
              <span className="text-sm font-medium text-foreground group-hover:text-gold transition-colors">
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        <Button
          variant="outline"
          data-ocid="profile.delete_button"
          onClick={() => clear()}
          className="w-full border-destructive/40 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>
    </main>
  );
}
