import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";

export function EmptyState({ title, description, action, icon: Icon = Sparkles }) {
  return (
    <motion.div
      className="glass grid place-items-center rounded-lg px-6 py-14 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="grid h-12 w-12 place-items-center rounded-lg bg-cyan-300/15 text-cyan-200">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? <Button className="mt-5" onClick={action.onClick}>{action.label}</Button> : null}
    </motion.div>
  );
}
