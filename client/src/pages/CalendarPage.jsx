import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { taskApi } from "../services/api";
import { useResource } from "../hooks/useResource";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { EmptyState } from "../components/EmptyState";
import { formatDate, isOverdue } from "../lib/utils";

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const buildCalendar = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  return Array.from({ length: 42 }).map((_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
};

export function CalendarPage() {
  const [cursor, setCursor] = useState(new Date());
  const { data, loading } = useResource(() => taskApi.list(), []);
  const tasks = data?.tasks || [];
  const days = useMemo(() => buildCalendar(cursor), [cursor]);
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(cursor);

  const moveMonth = (offset) => {
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge tone="emerald">Planning calendar</Badge>
          <h2 className="mt-3 text-3xl font-bold">Calendar View</h2>
          <p className="mt-2 text-muted-foreground">Plan deadlines and spot overdue work before it slows the team.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="icon" onClick={() => moveMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="w-44 text-center text-sm font-semibold">{monthLabel}</div>
          <Button variant="secondary" size="icon" onClick={() => moveMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="h-[42rem] animate-pulse" />
      ) : tasks.length ? (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 border-b border-white/10 text-center text-xs font-semibold uppercase text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-3">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day) => {
              const dayTasks = tasks.filter((task) => sameDay(new Date(task.dueDate), day));
              const isCurrentMonth = day.getMonth() === cursor.getMonth();
              const isToday = sameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-32 border-b border-r border-white/10 p-2 ${isCurrentMonth ? "bg-white/[0.03]" : "bg-white/[0.01] text-muted-foreground"}`}
                >
                  <div className={`grid h-7 w-7 place-items-center rounded-md text-xs font-bold ${isToday ? "bg-cyan-300 text-slate-950" : ""}`}>
                    {day.getDate()}
                  </div>
                  <div className="mt-2 space-y-2">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task._id}
                        className={`rounded-md border px-2 py-1 text-xs ${isOverdue(task.dueDate, task.status) ? "border-rose-300/30 bg-rose-400/10 text-rose-100" : "border-cyan-300/20 bg-cyan-400/10 text-cyan-100"}`}
                        title={`${task.title} · ${formatDate(task.dueDate)}`}
                      >
                        <p className="truncate font-semibold">{task.title}</p>
                        <p className="truncate opacity-75">{task.project?.name}</p>
                      </div>
                    ))}
                    {dayTasks.length > 3 ? (
                      <p className="text-xs text-muted-foreground">+{dayTasks.length - 3} more</p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <EmptyState title="No deadlines yet" description="Tasks with due dates will appear in your team calendar." />
      )}
    </div>
  );
}
