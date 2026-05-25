import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import { Input } from "../ui/input";
import { Dialog } from "../ui/dialog";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export function Topbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-background/70 backdrop-blur-2xl">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-muted-foreground">{greeting}, {user?.name?.split(" ")[0]}</p>
            <h1 className="truncate text-base font-bold sm:text-lg">Command your team’s momentum</h1>
          </div>
          <div className="hidden w-full max-w-sm items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 lg:flex">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              className="h-10 border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Search tasks, projects, people"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <motion.span animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}>
              <Bell className="h-5 w-5" />
            </motion.span>
          </Button>
          <Avatar src={user?.avatar} name={user?.name} className="hidden sm:grid" />
        </div>
      </header>

      <Dialog open={open} onOpenChange={setOpen} title="Navigation" className="h-[90vh] max-w-sm p-0">
        <Sidebar mobile onNavigate={() => setOpen(false)} />
      </Dialog>
    </>
  );
}
