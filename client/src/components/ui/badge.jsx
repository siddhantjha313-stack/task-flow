import { cn } from "../../lib/utils";

const tones = {
  default: "border-white/10 bg-white/10 text-foreground",
  cyan: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  amber: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  rose: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  slate: "border-slate-400/20 bg-slate-400/10 text-slate-200"
};

export function Badge({ className, tone = "default", children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold capitalize",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
