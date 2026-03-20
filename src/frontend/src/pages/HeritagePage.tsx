import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const TRADITIONS = [
  {
    title: "Kundan — The Royal Gem Setting",
    region: "Rajasthan & Delhi",
    description:
      "Kundan is the ancient art of setting uncut gemstones (called 'kundan') in 24-karat gold foil. Originating in the royal courts of Rajasthan and Delhi, this technique dates back 2,500 years. Each stone is carefully burnished into place using pure gold, creating pieces of extraordinary beauty worn by Maharanis and brides alike.",
    era: "2500+ Years Old",
  },
  {
    title: "Meenakari — The Art of Enamel",
    region: "Jaipur, Rajasthan",
    description:
      "Meenakari is the ancient Persian art of painting on metals with vibrant enamel colours. Brought to India by Man Singh I of Amber in the 16th century, Jaipur became its undisputed capital. Master craftsmen called 'meenak-kars' apply multiple layers of powdered glass mixed with metallic oxides, firing each layer in a kiln to achieve jewel-like depth and permanence.",
    era: "400+ Years Old",
  },
  {
    title: "Filigree — Threads of Gold",
    region: "Cuttack, Odisha",
    description:
      "Odisha's Cuttack is world-renowned for its silver and gold filigree work — an intricate lacework of twisted precious metal wires. A single earring may use hundreds of individually twisted wires, each thinner than a human hair. The technique requires extraordinary patience, with master craftsmen spending entire careers perfecting this art.",
    era: "700+ Years Old",
  },
  {
    title: "Temple Jewellery — Sacred Adornment",
    region: "Tamil Nadu & Kerala",
    description:
      "South Indian temple jewellery originated as adornment for deities in Hindu temples. Featuring deities, sacred birds, and mythological motifs in heavy 22-karat gold, these pieces were created by families of hereditary craftsmen called 'Vishwakarmas.' Today they are prized as bridal jewellery, representing the continuation of a sacred craft tradition.",
    era: "1000+ Years Old",
  },
];

export function HeritagePage() {
  return (
    <main className="pb-20 lg:pb-0" data-ocid="heritage.page">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/heritage-craftsman.dim_800x500.jpg"
            alt="Indian jewellery craftsman"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, oklch(0.068 0 0) 0%, oklch(0.068 0 0 / 0.5) 60%, transparent 100%)",
            }}
          />
        </div>
        <div className="relative container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-2">
              Our Story
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-ivory mb-4">
              India's Jewellery Heritage
            </h1>
            <p className="text-beige/80 max-w-xl text-lg">
              5,000 years of unbroken craft tradition, master to apprentice,
              family to family.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/40" />
            <span className="text-gold text-xl">✦</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/40" />
          </div>
          <p className="text-muted-foreground leading-relaxed text-base">
            India has produced some of the world's most exquisite jewellery for
            over five millennia. From the Indus Valley Civilization's intricate
            beadwork to the magnificent Mughal courts that commissioned
            jewellery of unparalleled splendour — India's relationship with
            precious metals and gems is woven into the fabric of its
            civilization.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base mt-4">
            At JewelfromIndia, we work exclusively with hereditary master
            craftsmen whose families have practiced their specific art form for
            generations. We believe that preserving these techniques is not just
            a business decision — it is a sacred duty to India's cultural
            heritage.
          </p>
        </motion.div>
      </section>

      {/* Traditions */}
      <section className="py-16" style={{ background: "oklch(0.10 0 0)" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-2">
              Ancient Crafts
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ivory">
              The Great Traditions
            </h2>
          </div>

          <div className="space-y-8">
            {TRADITIONS.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-card border border-border/40 rounded-xl p-6 md:p-8"
                data-ocid={`heritage.item.${i + 1}`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif text-xl font-bold text-ivory">
                        {t.title}
                      </h3>
                    </div>
                    <div className="flex gap-3 mb-3">
                      <span className="text-xs px-2 py-0.5 rounded-full border border-gold/40 text-gold">
                        {t.region}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full border border-border/60 text-muted-foreground">
                        {t.era}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-3xl font-bold text-ivory mb-4">
          Own a Piece of Heritage
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Every piece in our collection is a direct continuation of these
          ancient traditions.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/browse" data-ocid="heritage.primary_button">
            <Button className="gold-gradient text-background font-semibold border-0">
              Shop Collections <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link to="/custom" data-ocid="heritage.secondary_button">
            <Button
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              Design Your Own
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
