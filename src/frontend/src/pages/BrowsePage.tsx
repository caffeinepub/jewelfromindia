import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useSearch } from "@tanstack/react-router";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type Product, ProductCategory } from "../backend";
import { ProductCard } from "../components/ProductCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddToWishlist,
  useProducts,
  useRemoveFromWishlist,
  useWishlist,
} from "../hooks/useQueries";

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Rings", value: ProductCategory.rings },
  { label: "Necklaces", value: ProductCategory.necklaces },
  { label: "Earrings", value: ProductCategory.earrings },
  { label: "Bangles", value: ProductCategory.bangles },
  { label: "Bridal Sets", value: ProductCategory.bridalSets },
  { label: "Traditional", value: ProductCategory.traditional },
];

const METALS = [
  "All",
  "22K Gold",
  "18K Gold",
  "18K White Gold",
  "18K Rose Gold",
  "22K Antique Gold",
];
const GEMSTONES = [
  "All",
  "Diamond",
  "Emerald",
  "Ruby",
  "Sapphire",
  "Kundan",
  "Polki Diamond",
  "Pearl",
  "None",
];

interface BrowseSearch {
  category?: string;
  gemstone?: string;
}

export function BrowsePage() {
  const search = useSearch({ strict: false }) as BrowseSearch;
  const { identity } = useInternetIdentity();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    search.category ?? "all",
  );
  const [selectedMetal, setSelectedMetal] = useState("All");
  const [selectedGemstone, setSelectedGemstone] = useState(
    search.gemstone ?? "All",
  );
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [sortBy, setSortBy] = useState("popular");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: allProducts = [], isLoading } = useProducts();
  const { data: wishlist = [] } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  useEffect(() => {
    if (search.category) setSelectedCategory(search.category);
    if (search.gemstone) setSelectedGemstone(search.gemstone);
  }, [search.category, search.gemstone]);

  const filtered = allProducts
    .filter(
      (p) => selectedCategory === "all" || p.category === selectedCategory,
    )
    .filter((p) => selectedMetal === "All" || p.metalType === selectedMetal)
    .filter(
      (p) =>
        selectedGemstone === "All" || p.gemstone.includes(selectedGemstone),
    )
    .filter(
      (p) =>
        Number(p.price) >= priceRange[0] && Number(p.price) <= priceRange[1],
    )
    .sort((a, b) => {
      if (sortBy === "popular")
        return Number(b.popularityScore - a.popularityScore);
      if (sortBy === "price-asc") return Number(a.price - b.price);
      if (sortBy === "price-desc") return Number(b.price - a.price);
      return 0;
    });

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

  const activeFilters = [
    selectedCategory !== "all" &&
      CATEGORIES.find((c) => c.value === selectedCategory)?.label,
    selectedMetal !== "All" && selectedMetal,
    selectedGemstone !== "All" && selectedGemstone,
  ].filter(Boolean) as string[];

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm text-gold mb-3 uppercase tracking-wider">
          Category
        </h3>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              data-ocid="filter.tab"
              onClick={() => setSelectedCategory(c.value)}
              className={`text-left text-sm py-1.5 px-2 rounded transition-colors ${
                selectedCategory === c.value
                  ? "text-gold bg-gold/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm text-gold mb-3 uppercase tracking-wider">
          Metal Type
        </h3>
        <div className="flex flex-col gap-1">
          {METALS.map((m) => (
            <button
              key={m}
              type="button"
              data-ocid="filter.tab"
              onClick={() => setSelectedMetal(m)}
              className={`text-left text-sm py-1.5 px-2 rounded transition-colors ${
                selectedMetal === m
                  ? "text-gold bg-gold/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm text-gold mb-3 uppercase tracking-wider">
          Gemstone
        </h3>
        <div className="flex flex-col gap-1">
          {GEMSTONES.map((g) => (
            <button
              key={g}
              type="button"
              data-ocid="filter.tab"
              onClick={() => setSelectedGemstone(g)}
              className={`text-left text-sm py-1.5 px-2 rounded transition-colors ${
                selectedGemstone === g
                  ? "text-gold bg-gold/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm text-gold mb-3 uppercase tracking-wider">
          Price Range: ₹{priceRange[0].toLocaleString("en-IN")} — ₹
          {priceRange[1].toLocaleString("en-IN")}
        </h3>
        <Slider
          min={0}
          max={500000}
          step={5000}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mt-2"
          data-ocid="filter.select"
        />
      </div>

      <Button
        variant="outline"
        className="w-full border-gold/40 text-gold hover:bg-gold/10"
        onClick={() => {
          setSelectedCategory("all");
          setSelectedMetal("All");
          setSelectedGemstone("All");
          setPriceRange([0, 500000]);
        }}
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <main
      className="container mx-auto px-4 py-8 pb-24 lg:pb-8"
      data-ocid="browse.page"
    >
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] text-gold uppercase mb-1">
          Explore
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-ivory">
          Our Collections
        </h1>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            data-ocid="categories.tab"
            onClick={() => setSelectedCategory(c.value)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              selectedCategory === c.value
                ? "gold-gradient text-background border-transparent"
                : "border-border/60 text-muted-foreground hover:border-gold/40 hover:text-gold"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {activeFilters.map((f) => (
            <Badge
              key={f}
              variant="outline"
              className="border-gold/40 text-gold text-xs"
            >
              {f}
            </Badge>
          ))}
          <span className="text-sm text-muted-foreground">
            {filtered.length} items
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger
              data-ocid="sort.select"
              className="w-40 border-border/60 text-sm h-8"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile filter */}
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                data-ocid="filter.open_modal_button"
                className="lg:hidden border-border/60"
              >
                <SlidersHorizontal className="w-4 h-4 mr-1" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="bg-card border-border/60 overflow-y-auto"
              data-ocid="filter.sheet"
            >
              <SheetHeader>
                <SheetTitle className="text-gold font-serif">
                  Filters
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <FilterContent />
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <Skeleton key={n} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20" data-ocid="browse.empty_state">
              <p className="text-4xl mb-4">💍</p>
              <p className="text-muted-foreground">
                No pieces match your filters.
              </p>
              <Button
                variant="outline"
                className="mt-4 border-gold/40 text-gold"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedMetal("All");
                  setSelectedGemstone("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
              data-ocid="browse.list"
            >
              {filtered.map((product: Product, i) => (
                <ProductCard
                  key={String(product.id)}
                  product={product}
                  index={i}
                  isInWishlist={wishlist.includes(product.id)}
                  onWishlistToggle={handleWishlistToggle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
