import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));

export const formatDate = (date, options = {}) => {
  if (!date) return "No date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: options.withYear ? "numeric" : undefined
  }).format(new Date(date));
};

export const formatRelative = (date) => {
  if (!date) return "recently";
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

export const isOverdue = (date, status) => {
  if (!date || status === "completed") return false;
  return new Date(date).getTime() < Date.now();
};

export const initials = (name = "User") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const statusLabels = {
  todo: "Todo",
  "in-progress": "In Progress",
  completed: "Completed",
  planning: "Planning",
  active: "Active",
  "on-hold": "On Hold"
};

export const priorityTone = {
  low: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  medium: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  high: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  urgent: "border-rose-400/30 bg-rose-400/10 text-rose-200"
};
