import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSubmitCustomRequest } from "../hooks/useQueries";

const METALS = [
  "22K Yellow Gold",
  "18K Yellow Gold",
  "18K White Gold",
  "18K Rose Gold",
  "Platinum",
];
const GEMSTONES = [
  "Diamond",
  "Emerald",
  "Ruby",
  "Sapphire",
  "Pearl",
  "Kundan",
  "None",
];
const STYLES = [
  "Traditional",
  "Contemporary",
  "Fusion",
  "Bridal",
  "Minimalist",
  "Royal",
  "Temple",
];

export function CustomJewelleryPage() {
  const { identity, login } = useInternetIdentity();
  const submitRequest = useSubmitCustomRequest();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    metal: "",
    gemstone: "",
    style: "",
    budget: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Please sign in first");
      login();
      return;
    }
    if (!form.metal || !form.gemstone || !form.style) {
      toast.error("Please fill in all required fields");
      return;
    }
    submitRequest.mutate(
      {
        metal: form.metal,
        gemstone: form.gemstone,
        style: form.style,
        notes: form.notes,
        budget: BigInt(Number.parseInt(form.budget || "0") * 100),
      },
      {
        onSuccess: () => setSubmitted(true),
        onError: () =>
          toast.error("Could not submit request. Please try again."),
      },
    );
  };

  if (submitted) {
    return (
      <main
        className="container mx-auto px-4 py-20 flex flex-col items-center text-center"
        data-ocid="custom.success_state"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center mb-6"
        >
          <CheckCircle className="w-10 h-10 text-gold" />
        </motion.div>
        <h2 className="font-serif text-3xl font-bold text-ivory mb-3">
          Request Received!
        </h2>
        <p className="text-muted-foreground max-w-md mb-8">
          Our master jewellers will review your design brief and contact you
          within 48 hours to discuss your dream piece.
        </p>
        <Button
          onClick={() => setSubmitted(false)}
          variant="outline"
          className="border-gold/40 text-gold hover:bg-gold/10"
        >
          Submit Another Request
        </Button>
      </main>
    );
  }

  return (
    <main
      className="container mx-auto px-4 py-8 pb-24 lg:pb-8"
      data-ocid="custom.page"
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <Sparkles className="w-8 h-8 text-gold mx-auto mb-3" />
          <p className="text-xs tracking-[0.3em] text-gold uppercase mb-2">
            Bespoke Service
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-ivory mb-3">
            Design Your Own Jewellery
          </h1>
          <p className="text-muted-foreground">
            Share your vision with our master craftsmen and we'll bring it to
            life in precious metals and gems.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border/40 rounded-xl p-6 space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">
                Metal Type *
              </Label>
              <Select
                value={form.metal}
                onValueChange={(v) => setForm((p) => ({ ...p, metal: v }))}
              >
                <SelectTrigger
                  data-ocid="custom.select"
                  className="border-border/60 focus:border-gold/60"
                >
                  <SelectValue placeholder="Choose metal" />
                </SelectTrigger>
                <SelectContent>
                  {METALS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">
                Gemstone *
              </Label>
              <Select
                value={form.gemstone}
                onValueChange={(v) => setForm((p) => ({ ...p, gemstone: v }))}
              >
                <SelectTrigger
                  data-ocid="custom.select"
                  className="border-border/60 focus:border-gold/60"
                >
                  <SelectValue placeholder="Choose gemstone" />
                </SelectTrigger>
                <SelectContent>
                  {GEMSTONES.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Style *</Label>
              <Select
                value={form.style}
                onValueChange={(v) => setForm((p) => ({ ...p, style: v }))}
              >
                <SelectTrigger
                  data-ocid="custom.select"
                  className="border-border/60 focus:border-gold/60"
                >
                  <SelectValue placeholder="Choose style" />
                </SelectTrigger>
                <SelectContent>
                  {STYLES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">
                Budget (INR)
              </Label>
              <Input
                type="number"
                placeholder="e.g. 50000"
                value={form.budget}
                onChange={(e) =>
                  setForm((p) => ({ ...p, budget: e.target.value }))
                }
                data-ocid="custom.input"
                className="border-border/60 focus:border-gold/60 bg-secondary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Design Notes & Inspiration
            </Label>
            <Textarea
              placeholder="Describe your dream piece — occasion, design inspirations, special requirements..."
              value={form.notes}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
              data-ocid="custom.textarea"
              className="border-border/60 focus:border-gold/60 bg-secondary resize-none"
              rows={4}
            />
          </div>

          <Button
            type="submit"
            data-ocid="custom.submit_button"
            disabled={submitRequest.isPending}
            className="w-full gold-gradient text-background font-semibold border-0 hover:opacity-90"
          >
            {submitRequest.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" /> Submit Design Request
              </>
            )}
          </Button>
        </form>

        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            {
              title: "Free Consultation",
              desc: "1-on-1 with our master jeweller",
            },
            { title: "3D Preview", desc: "See your design before production" },
            { title: "Lifetime Guarantee", desc: "Quality guaranteed forever" },
          ].map((item) => (
            <div
              key={item.title}
              className="text-center p-4 bg-card border border-gold/10 rounded-lg"
            >
              <p className="text-xs font-semibold text-gold mb-1">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
