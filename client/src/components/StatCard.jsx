import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card } from "./ui/card";

export function StatCard({ label, value, trend, icon: Icon, tone = "cyan" }) {
  const toneClasses = {
    cyan: "from-cyan-300/25 text-cyan-100",
    emerald: "from-emerald-300/25 text-emerald-100",
    amber: "from-amber-300/25 text-amber-100",
    rose: "from-rose-300/25 text-rose-100"
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
      <Card className="relative overflow-hidden p-5">
        <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${toneClasses[tone]} to-transparent opacity-70`} />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-white/10">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="relative mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-200">
          <ArrowUpRight className="h-3.5 w-3.5" />
          {trend}
        </div>
      </Card>
    </motion.div>
  );
}
