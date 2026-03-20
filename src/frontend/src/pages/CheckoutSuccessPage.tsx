import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export function CheckoutSuccessPage() {
  const navigate = useNavigate();

  return (
    <main
      className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center"
      data-ocid="checkout.success_state"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-24 h-24 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center mb-6"
      >
        <CheckCircle className="w-12 h-12 text-gold" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 mb-8"
      >
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-ivory">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground max-w-md">
          Thank you for your purchase. Your jewellery will be carefully packaged
          and shipped within 3-5 business days.
        </p>
        <p className="text-sm text-gold">
          A confirmation email has been sent to you.
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          data-ocid="checkout.primary_button"
          onClick={() => navigate({ to: "/orders" })}
          className="gold-gradient text-background font-semibold border-0"
        >
          View My Orders <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          data-ocid="checkout.secondary_button"
          onClick={() => navigate({ to: "/" })}
          className="border-gold/40 text-gold hover:bg-gold/10"
        >
          Continue Shopping
        </Button>
      </div>
    </main>
  );
}
