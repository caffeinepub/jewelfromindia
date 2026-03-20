import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StarRating({
  rating,
  max = 5,
  size = "md",
  className,
}: StarRatingProps) {
  const sizes = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].slice(0, max).map((starNum) => (
        <Star
          key={starNum}
          className={cn(
            sizes[size],
            starNum <= Math.round(rating)
              ? "fill-gold text-gold"
              : "fill-transparent text-muted-foreground",
          )}
        />
      ))}
    </div>
  );
}

interface StarRatingInputProps {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}

export function StarRatingInput({
  value,
  onChange,
  max = 5,
}: StarRatingInputProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].slice(0, max).map((starNum) => (
        <button
          key={starNum}
          type="button"
          onClick={() => onChange(starNum)}
          className="group"
        >
          <Star
            className={cn(
              "w-6 h-6 transition-colors",
              starNum <= value
                ? "fill-gold text-gold"
                : "fill-transparent text-muted-foreground group-hover:text-gold",
            )}
          />
        </button>
      ))}
    </div>
  );
}
