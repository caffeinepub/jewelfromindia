import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

interface HallmarkBadgeProps {
  className?: string;
  compact?: boolean;
}

export function HallmarkBadge({
  className,
  compact = false,
}: HallmarkBadgeProps) {
  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium",
          "border-gold/60 text-gold bg-gold/10",
          className,
        )}
      >
        <ShieldCheck className="w-3 h-3" />
        <span>BIS Hallmark</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border",
        "border-gold/40 bg-gold/5",
        className,
      )}
    >
      <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0" />
      <div>
        <p className="text-xs font-semibold text-gold">
          BIS Hallmark Certified
        </p>
        <p className="text-xs text-muted-foreground">
          Purity guaranteed by Bureau of Indian Standards
        </p>
      </div>
    </div>
  );
}
