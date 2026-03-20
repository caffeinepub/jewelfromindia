import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer className="bg-card border-t border-border/50 mt-auto">
      {/* Trust bar */}
      <div
        className="border-b border-border/30"
        style={{ background: "oklch(0.72 0.118 74 / 0.08)" }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              {
                icon: "✦",
                label: "BIS Hallmark Certified",
                sub: "100% Purity Assured",
              },
              {
                icon: "✦",
                label: "Free Shipping",
                sub: "On orders above ₹5,000",
              },
              {
                icon: "✦",
                label: "30-Day Returns",
                sub: "Hassle-free returns",
              },
              {
                icon: "✦",
                label: "Lifetime Service",
                sub: "Free cleaning & polishing",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-gold text-lg">{item.icon}</span>
                <p className="text-xs font-semibold text-foreground">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-gold">
              JewelfromIndia
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Celebrating India's rich jewellery heritage with masterfully
              crafted pieces that blend tradition with contemporary luxury.
            </p>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                className="text-muted-foreground hover:text-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="text-muted-foreground hover:text-gold transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gold uppercase tracking-wider">
              Collections
            </h4>
            <ul className="space-y-2">
              {[
                "Rings",
                "Necklaces",
                "Earrings",
                "Bangles",
                "Bridal Sets",
                "Traditional",
              ].map((c) => (
                <li key={c}>
                  <Link
                    to="/browse"
                    className="text-sm text-muted-foreground hover:text-gold transition-colors"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gold uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Our Heritage", to: "/heritage" },
                { label: "Design Your Own", to: "/custom" },
                { label: "My Orders", to: "/orders" },
                { label: "Wishlist", to: "/wishlist" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground hover:text-gold transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gold uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>+91 7070250577</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>care@jewelfromindia.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Jamshedpur, Jharkhand</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {year} JewelfromIndia. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
