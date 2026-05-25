import { NavLink } from "react-router-dom";
import {
  CalendarDays,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Settings,
  Sparkles,
  UsersRound
} from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

const navItems = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  { label: "Projects", href: "/app/projects", icon: FolderKanban },
  { label: "Tasks", href: "/app/tasks", icon: ListChecks },
  { label: "Kanban", href: "/app/kanban", icon: Sparkles },
  { label: "Calendar", href: "/app/calendar", icon: CalendarDays },
  { label: "Team", href: "/app/team", icon: UsersRound },
  { label: "Settings", href: "/app/settings", icon: Settings }
];

export function Sidebar({ mobile = false, onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <aside
      className={cn(
        "flex h-full w-72 flex-col border-r border-white/10 bg-slate-950/70 p-4 backdrop-blur-2xl",
        mobile ? "w-full border-r-0" : "hidden lg:flex"
      )}
    >
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-cyan-300 via-emerald-300 to-amber-200 font-black text-slate-950 shadow-glow">
          TF
        </div>
        <div>
          <p className="text-sm font-bold">TaskFlow AI</p>
          <p className="text-xs text-muted-foreground">Execution OS</p>
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/app"}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition",
                "hover:bg-white/10 hover:text-foreground",
                isActive && "bg-white/[0.12] text-foreground shadow-glow"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-lg border border-white/10 bg-white/10 p-3">
        <p className="text-xs uppercase text-muted-foreground">Signed in as</p>
        <p className="mt-1 truncate text-sm font-semibold">{user?.name}</p>
        <p className="truncate text-xs capitalize text-muted-foreground">{user?.role}</p>
        <Button className="mt-3 w-full justify-start" variant="ghost" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
