import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
  TrendingUp
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { activityApi, projectApi } from "../services/api";
import { useResource } from "../hooks/useResource";
import { StatCard } from "../components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Avatar } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { formatDate, formatRelative, isOverdue, statusLabels } from "../lib/utils";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-40" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { data, loading } = useResource(() => projectApi.dashboard(), []);
  const { data: activityData } = useResource(() => activityApi.list(10), []);

  if (loading) return <DashboardSkeleton />;

  const metrics = data?.metrics || {};
  const recentTasks = data?.recentTasks || [];
  const projects = data?.projects || [];
  const teamProgress = data?.teamProgress || [];
  const activity = activityData?.activity || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge tone="cyan">Live analytics</Badge>
          <h2 className="mt-3 text-3xl font-bold">Dashboard</h2>
          <p className="mt-2 text-muted-foreground">Track progress, risk, velocity, and team energy in one view.</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Completion rate</span>{" "}
          <span className="font-bold text-emerald-200">{metrics.completionRate || 0}%</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Projects" value={metrics.totalProjects || 0} trend="Portfolio visibility" icon={FolderKanban} />
        <StatCard label="Completed Tasks" value={metrics.completedTasks || 0} trend="Momentum captured" icon={CheckCircle2} tone="emerald" />
        <StatCard label="Pending Tasks" value={metrics.pendingTasks || 0} trend="Execution queue" icon={ListTodo} tone="amber" />
        <StatCard label="Overdue Tasks" value={metrics.overdueTasks || 0} trend="Needs attention" icon={AlertTriangle} tone="rose" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Productivity Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.productivity || []}>
                  <defs>
                    <linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="created" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
                  <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15,23,42,0.92)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8
                    }}
                  />
                  <Area type="monotone" dataKey="created" stroke="#34d399" fillOpacity={1} fill="url(#created)" />
                  <Area type="monotone" dataKey="completed" stroke="#22d3ee" fillOpacity={1} fill="url(#completed)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamProgress.map((member) => (
              <div key={member._id} className="rounded-lg border border-white/10 bg-white/10 p-3">
                <div className="flex items-center gap-3">
                  <Avatar src={member.avatar} name={member.name} className="h-9 w-9" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.completed}/{member.assigned} completed</p>
                  </div>
                  <span className="text-sm font-bold">{member.progress}%</span>
                </div>
                <Progress value={member.progress} className="mt-3" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task._id} className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/10 p-4 sm:flex-row sm:items-center">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-300/15 text-cyan-100">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{task.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {task.project?.name} · due {formatDate(task.dueDate)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isOverdue(task.dueDate, task.status) ? <Badge tone="rose">Overdue</Badge> : null}
                  <Badge tone={task.status === "completed" ? "emerald" : task.status === "in-progress" ? "amber" : "cyan"}>
                    {statusLabels[task.status]}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.map((item) => (
              <div key={item._id} className="flex gap-3">
                <Avatar src={item.actor?.avatar} name={item.actor?.name} className="h-8 w-8" />
                <div>
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock3 className="h-3 w-3" />
                    {formatRelative(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {projects.slice(0, 3).map((project) => (
          <Card key={project._id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{project.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">Due {formatDate(project.dueDate)}</p>
              </div>
              <Badge tone={project.status === "completed" ? "emerald" : "cyan"}>{project.status}</Badge>
            </div>
            <Progress value={project.progress} className="mt-5" />
          </Card>
        ))}
      </div>
    </div>
  );
}
