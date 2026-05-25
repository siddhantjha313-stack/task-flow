import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "ring-focus inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition duration-200 disabled:pointer-events-none disabled:opacity-55",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-glow hover:-translate-y-0.5 hover:bg-cyan-300",
        secondary:
          "border border-white/10 bg-white/10 text-foreground hover:-translate-y-0.5 hover:bg-white/[0.15]",
        ghost: "text-muted-foreground hover:bg-white/10 hover:text-foreground",
        outline: "border border-border bg-transparent hover:bg-muted",
        danger: "bg-destructive text-destructive-foreground hover:bg-rose-500",
        success: "bg-accent text-accent-foreground hover:bg-emerald-300"
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-5 text-base",
        icon: "h-10 w-10 px-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp {...props} className={cn(buttonVariants({ variant, size }), className)} disabled={loading || props.disabled}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </Comp>
  );
}
