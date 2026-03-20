import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type Product, ProductCategory } from "../backend";
import { ProductCard } from "../components/ProductCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddToWishlist,
  usePopularProducts,
  useProducts,
  useRemoveFromWishlist,
  useWishlist,
} from "../hooks/useQueries";

const HERO_SLIDES = [
  {
    title: "Bridal Splendour",
    subtitle: "Crafted for the most precious moments of your life",
    badge: "New Collection",
    cta: "Explore Bridal",
    to: "/browse?category=bridalSets",
    image: "/assets/generated/product-bridal-set.dim_600x600.jpg",
    accent: "Rose Gold",
  },
  {
    title: "Diamond Heritage",
    subtitle: "Timeless brilliance from India's master diamond craftsmen",
    badge: "Bestseller",
    cta: "View Diamonds",
    to: "/browse?gemstone=Diamond",
    image: "/assets/generated/product-diamond-ring.dim_600x600.jpg",
    accent: "White Gold",
  },
  {
    title: "Temple Treasures",
    subtitle: "Ancient temple art reimagined in 22-karat gold",
    badge: "Heritage Craft",
    cta: "Explore Temple Art",
    to: "/browse?category=traditional",
    image: "/assets/generated/product-temple-necklace.dim_600x600.jpg",
    accent: "Antique Gold",
  },
  {
    title: "Emerald Dreams",
    subtitle: "Colombian emeralds meet Indian jewellery artistry",
    badge: "Limited Edition",
    cta: "Shop Emeralds",
    to: "/browse?gemstone=Emerald",
    image: "/assets/generated/product-emerald-earrings.dim_600x600.jpg",
    accent: "Yellow Gold",
  },
];

const CATEGORIES = [
  {
    label: "Rings",
    category: ProductCategory.rings,
    emoji: "💍",
    image: "/assets/generated/product-diamond-ring.dim_600x600.jpg",
  },
  {
    label: "Necklaces",
    category: ProductCategory.necklaces,
    emoji: "📿",
    image: "/assets/generated/product-bridal-necklace.dim_600x600.jpg",
  },
  {
    label: "Earrings",
    category: ProductCategory.earrings,
    emoji: "✨",
    image: "/assets/generated/product-emerald-earrings.dim_600x600.jpg",
  },
  {
    label: "Bangles",
    category: ProductCategory.bangles,
    emoji: "📜",
    image: "/assets/generated/product-gold-bangles.dim_600x600.jpg",
  },
  {
    label: "Bridal Sets",
    category: ProductCategory.bridalSets,
    emoji: "👰",
    image: "/assets/generated/product-bridal-set.dim_600x600.jpg",
  },
  {
    label: "Traditional",
    category: ProductCategory.traditional,
    emoji: "🛽",
    image: "/assets/generated/product-temple-necklace.dim_600x600.jpg",
  },
];

export function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: products = [] } = useProducts();
  const { data: popular = [] } = usePopularProducts();
  const { data: wishlist = [] } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = HERO_SLIDES[heroIndex];

  const handleWishlistToggle = (productId: bigint) => {
    if (!identity) {
      toast.error("Please sign in to save items");
      return;
    }
    const isIn = wishlist.includes(productId);
    if (isIn) {
      removeFromWishlist.mutate(productId, {
        onSuccess: () => toast.success("Removed from wishlist"),
      });
    } else {
      addToWishlist.mutate(productId, {
        onSuccess: () => toast.success("Added to wishlist ♥"),
      });
    }
  };

  const featuredProducts = popular.slice(0, 6);
  const festiveProducts = products
    .filter(
      (p) =>
        p.category === ProductCategory.bridalSets ||
        p.category === ProductCategory.traditional,
    )
    .slice(0, 3);

  return (
    <main className="pb-20 lg:pb-0">
      {/* Hero */}
      <section
        className="relative min-h-[70vh] flex items-center overflow-hidden"
        data-ocid="hero.section"
      >
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.068 0 0 / 0.88) 0%, oklch(0.068 0 0 / 0.5) 60%, oklch(0.068 0 0 / 0.2) 100%)",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative container mx-auto px-4 py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl"
            >
              <Badge className="mb-4 border-gold/60 text-gold bg-gold/10 font-medium">
                <Sparkles className="w-3 h-3 mr-1" />
                {slide.badge}
              </Badge>
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-ivory leading-tight mb-4">
                {slide.title}
              </h1>
              <p className="text-base md:text-lg text-beige/80 mb-8 leading-relaxed">
                {slide.subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  data-ocid="hero.primary_button"
                  onClick={() => navigate({ to: slide.to })}
                  className="gold-gradient text-background font-semibold border-0 px-6 hover:opacity-90"
                >
                  {slide.cta} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  data-ocid="hero.secondary_button"
                  onClick={() => navigate({ to: "/browse" })}
                  className="border-gold/40 text-gold hover:bg-gold/10"
                >
                  All Collections
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setHeroIndex(i)}
              className={`h-0.5 transition-all duration-300 ${
                i === heroIndex ? "w-8 bg-gold" : "w-4 bg-beige/40"
              }`}
            />
          ))}
        </div>

        {/* Prev/Next */}
        <button
          type="button"
          onClick={() =>
            setHeroIndex(
              (i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
            )
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/30 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/20 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => setHeroIndex((i) => (i + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/30 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/20 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* Categories */}
      <section
        className="container mx-auto px-4 py-16"
        data-ocid="categories.section"
      >
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] text-gold uppercase mb-2">
            Discover
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-ivory">
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to="/browse"
                search={{ category: cat.category }}
                data-ocid="categories.link"
                className="group flex flex-col items-center gap-2"
              >
                <div className="relative w-full aspect-square rounded-full overflow-hidden border-2 border-border group-hover:border-gold/60 transition-all duration-300 group-hover:shadow-gold">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-background/40 group-hover:bg-background/10 transition-colors duration-300" />
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-gold transition-colors">
                  {cat.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gold divider */}
      <div className="flex items-center gap-4 container mx-auto px-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/40" />
        <span className="text-gold text-xl">✦</span>
        <span className="font-serif text-xs tracking-[0.3em] text-muted-foreground uppercase">
          Trending Now
        </span>
        <span className="text-gold text-xl">✦</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/40" />
      </div>

      {/* Trending */}
      <section
        className="container mx-auto px-4 py-10"
        data-ocid="trending.section"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {featuredProducts.map((product: Product, i) => (
            <ProductCard
              key={String(product.id)}
              product={product}
              index={i}
              isInWishlist={wishlist.includes(product.id)}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
        <div className="text-center mt-10">
          <Button
            variant="outline"
            data-ocid="trending.button"
            onClick={() => navigate({ to: "/browse" })}
            className="border-gold/40 text-gold hover:bg-gold/10 px-8"
          >
            View All Collections <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Festive Picks */}
      {festiveProducts.length > 0 && (
        <section
          className="py-16"
          style={{ background: "oklch(0.10 0 0)" }}
          data-ocid="festive.section"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs tracking-[0.3em] text-gold uppercase mb-2">
                Wedding & Festivities
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ivory">
                Festive Picks
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Jewellery for every celebration
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {festiveProducts.map((product, i) => (
                <ProductCard
                  key={String(product.id)}
                  product={product}
                  index={i}
                  isInWishlist={wishlist.includes(product.id)}
                  onWishlistToggle={handleWishlistToggle}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Heritage Teaser */}
      <section
        className="container mx-auto px-4 py-16"
        data-ocid="heritage.section"
      >
        <div className="relative rounded-xl overflow-hidden">
          <img
            src="/assets/generated/heritage-craftsman.dim_800x500.jpg"
            alt="Indian heritage craftsman"
            className="w-full h-64 md:h-96 object-cover"
          />
          <div
            className="absolute inset-0 flex flex-col justify-end p-8"
            style={{
              background:
                "linear-gradient(to top, oklch(0.068 0 0 / 0.92) 0%, oklch(0.068 0 0 / 0.3) 60%, transparent 100%)",
            }}
          >
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-2">
              Since Centuries
            </p>
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-ivory mb-3">
              The Art of Indian Jewellery Making
            </h2>
            <p className="text-sm text-beige/70 max-w-md mb-5">
              Every piece tells a story of generations of master craftsmen who
              have dedicated their lives to the sacred art of jewellery making.
            </p>
            <Link to="/heritage" data-ocid="heritage.link">
              <Button
                className="border-gold/60 text-gold hover:bg-gold/10 border w-fit"
                variant="outline"
              >
                Discover Our Heritage <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Jewellery CTA */}
      <section
        className="py-16"
        style={{ background: "oklch(0.72 0.118 74 / 0.06)" }}
        data-ocid="custom.section"
      >
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="w-8 h-8 text-gold mx-auto mb-4" />
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-ivory mb-3">
            Design Your Dream Jewellery
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Work with our master artisans to create a completely unique piece
            tailored to your vision.
          </p>
          <Link to="/custom" data-ocid="custom.primary_button">
            <Button className="gold-gradient text-background font-semibold border-0 px-8">
              Start Creating <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
