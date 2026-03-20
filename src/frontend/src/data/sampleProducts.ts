import { type Product, ProductCategory } from "../backend";

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1n,
    name: "Royal Kundan Bridal Necklace",
    description:
      "An opulent bridal necklace featuring hand-set Kundan stones surrounded by polki diamonds in 22-karat gold. Each stone is individually set by master craftsmen in the traditional Jaipur style, with meenakari enamel work on the reverse.",
    category: ProductCategory.necklaces,
    metalType: "22K Gold",
    gemstone: "Kundan & Polki Diamond",
    price: 185000n,
    weight: 48.5,
    images: ["/assets/generated/product-bridal-necklace.dim_600x600.jpg"],
    hallmarkCertified: true,
    craftsmanshipNotes:
      "Hand-crafted in Jaipur by fifth-generation Kundan artisans. Each piece takes 40+ hours to complete.",
    popularityScore: 98n,
    stockQuantity: 3n,
  },
  {
    id: 2n,
    name: "Solitaire Diamond Engagement Ring",
    description:
      "A timeless solitaire diamond ring featuring a 1.2-carat VS1 clarity round brilliant diamond set in 18-karat white gold with a delicate pavé band. Accompanied by a GIA certificate.",
    category: ProductCategory.rings,
    metalType: "18K White Gold",
    gemstone: "Diamond",
    price: 245000n,
    weight: 5.2,
    images: ["/assets/generated/product-diamond-ring.dim_600x600.jpg"],
    hallmarkCertified: true,
    craftsmanshipNotes:
      "GIA-certified 1.2ct round brilliant diamond. Precision-set in our Mumbai atelier.",
    popularityScore: 95n,
    stockQuantity: 5n,
  },
  {
    id: 3n,
    name: "Heritage Gold Bangles Set",
    description:
      "A set of six 22-karat gold bangles featuring intricate hand-carved paisley and lotus motifs. Each bangle is individually crafted using the traditional Rajasthani gold-smithing technique passed down through generations.",
    category: ProductCategory.bangles,
    metalType: "22K Gold",
    gemstone: "None",
    price: 92000n,
    weight: 62.0,
    images: ["/assets/generated/product-gold-bangles.dim_600x600.jpg"],
    hallmarkCertified: true,
    craftsmanshipNotes:
      "Traditional Rajasthani craftsmanship. Hallmark 916 certified. Set of 6 bangles.",
    popularityScore: 89n,
    stockQuantity: 8n,
  },
  {
    id: 4n,
    name: "Emerald Chandelier Jhumka Earrings",
    description:
      "Breathtaking chandelier earrings featuring Colombian emeralds and rose-cut diamonds suspended in an 18-karat gold filigree frame. Inspired by the architectural beauty of Mughal-era jewellery.",
    category: ProductCategory.earrings,
    metalType: "18K Gold",
    gemstone: "Emerald & Diamond",
    price: 78500n,
    weight: 18.4,
    images: ["/assets/generated/product-emerald-earrings.dim_600x600.jpg"],
    hallmarkCertified: true,
    craftsmanshipNotes:
      "Colombiam emeralds 3.5ct total. Rose-cut diamonds 1.2ct total. Mughal-inspired design.",
    popularityScore: 91n,
    stockQuantity: 6n,
  },
  {
    id: 5n,
    name: "South Indian Temple Necklace",
    description:
      "A magnificent temple necklace in antique 22-karat gold featuring deity motifs, rubies, and emeralds. Handcrafted in the traditional Nagercoil style by Tamil Nadu master jewellers.",
    category: ProductCategory.traditional,
    metalType: "22K Antique Gold",
    gemstone: "Ruby & Emerald",
    price: 135000n,
    weight: 75.0,
    images: ["/assets/generated/product-temple-necklace.dim_600x600.jpg"],
    hallmarkCertified: true,
    craftsmanshipNotes:
      "Traditional Nagercoil temple jewellery. Antique gold finish. Deity motifs handcarved.",
    popularityScore: 86n,
    stockQuantity: 4n,
  },
  {
    id: 6n,
    name: "Grand Bridal Jewellery Set",
    description:
      "The complete Indian bridal experience — a 7-piece set including maang tikka, nath, necklace, earrings, two bangles, and a waistband in rose gold with pink tourmalines and diamonds. Every bride's dream.",
    category: ProductCategory.bridalSets,
    metalType: "18K Rose Gold",
    gemstone: "Pink Tourmaline & Diamond",
    price: 485000n,
    weight: 185.0,
    images: ["/assets/generated/product-bridal-set.dim_600x600.jpg"],
    hallmarkCertified: true,
    craftsmanshipNotes:
      "Complete 7-piece bridal set. Pink tourmalines 12ct. Diamonds 3.8ct. Includes jewellery box.",
    popularityScore: 99n,
    stockQuantity: 2n,
  },
  {
    id: 7n,
    name: "Polki Diamond Choker Necklace",
    description:
      "A stunning choker featuring uncut polki diamonds set in 22-karat gold with an intricate meenakari enamel backdrop. A masterpiece of Mughal jewellery artistry from our Jaipur studio.",
    category: ProductCategory.necklaces,
    metalType: "22K Gold",
    gemstone: "Polki Diamond",
    price: 220000n,
    weight: 52.0,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop",
    ],
    hallmarkCertified: true,
    craftsmanshipNotes:
      "Uncut polki diamonds 8ct total. Meenakari enamel in seven colours. Jaipur master craftsmen.",
    popularityScore: 93n,
    stockQuantity: 3n,
  },
  {
    id: 8n,
    name: "Ruby Peacock Ring",
    description:
      "An exquisite peacock-motif ring featuring a Burmese ruby center stone surrounded by emeralds and diamonds in 22-karat yellow gold. A celebration of India's regal bird and its vibrant colors.",
    category: ProductCategory.rings,
    metalType: "22K Gold",
    gemstone: "Ruby & Emerald",
    price: 68000n,
    weight: 9.8,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
    ],
    hallmarkCertified: true,
    craftsmanshipNotes:
      "2.1ct Burmese ruby. Handcrafted peacock motif. 18 emerald accent stones.",
    popularityScore: 85n,
    stockQuantity: 7n,
  },
  {
    id: 9n,
    name: "Diamond Mangalsutra Bracelet",
    description:
      "A contemporary take on the traditional mangalsutra, reimagined as a delicate bracelet with black onyx beads and a diamond-studded gold pendant. Perfect blend of tradition and modernity.",
    category: ProductCategory.traditional,
    metalType: "18K Gold",
    gemstone: "Diamond & Black Onyx",
    price: 45500n,
    weight: 12.5,
    images: [
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&h=600&fit=crop",
    ],
    hallmarkCertified: true,
    craftsmanshipNotes:
      "0.8ct diamonds. Certified black onyx. Modern mangalsutra interpretation.",
    popularityScore: 82n,
    stockQuantity: 10n,
  },
  {
    id: 10n,
    name: "Gold Filigree Jhumka Earrings",
    description:
      "Delicate gold filigree jhumka earrings in 22-karat gold, featuring hundreds of hand-twisted gold wires creating intricate lace-like patterns. A quintessential piece of Indian jewellery artistry.",
    category: ProductCategory.earrings,
    metalType: "22K Gold",
    gemstone: "None",
    price: 32000n,
    weight: 14.2,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
    ],
    hallmarkCertified: true,
    craftsmanshipNotes:
      "Traditional filigree technique. 916 hallmark certified. Each earring made from 200+ hand-twisted wires.",
    popularityScore: 88n,
    stockQuantity: 12n,
  },
  {
    id: 11n,
    name: "Sapphire & Diamond Tennis Bracelet",
    description:
      "An elegant tennis bracelet featuring alternating Ceylon sapphires and round brilliant diamonds set in 18-karat white gold. Timeless elegance for every occasion.",
    category: ProductCategory.bangles,
    metalType: "18K White Gold",
    gemstone: "Sapphire & Diamond",
    price: 158000n,
    weight: 16.8,
    images: [
      "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&h=600&fit=crop",
    ],
    hallmarkCertified: true,
    craftsmanshipNotes:
      "Ceylon sapphires 4.2ct. Round brilliant diamonds 2.8ct. 18K white gold setting.",
    popularityScore: 87n,
    stockQuantity: 4n,
  },
  {
    id: 12n,
    name: "Vintage Kundan Bridal Maang Tikka",
    description:
      "A regal maang tikka featuring a large kundan central medallion with hanging pearl drops, framed in 22-karat gold. Completes any bridal look with royal elegance.",
    category: ProductCategory.bridalSets,
    metalType: "22K Gold",
    gemstone: "Kundan & Pearl",
    price: 42000n,
    weight: 22.5,
    images: [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop",
    ],
    hallmarkCertified: true,
    craftsmanshipNotes:
      "Hand-set Kundan stones. South Sea pearl drops. Adjustable chain length.",
    popularityScore: 90n,
    stockQuantity: 6n,
  },
];

export function getProductById(id: bigint): Product | undefined {
  return SAMPLE_PRODUCTS.find((p) => p.id === id);
}

export function formatPrice(price: bigint): string {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}
