import { useMemo, useState } from "react";
import { CheckCircle2, ListFilter, Plus, Search } from "lucide-react";
import { projectApi, taskApi, userApi } from "../services/api";
import { useResource } from "../hooks/useResource";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/toast";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Dialog } from "../components/ui/dialog";
import { Input, Select } from "../components/ui/input";
import { Avatar } from "../components/ui/avatar";
import { TaskForm } from "../components/forms/TaskForm";
import { EmptyState } from "../components/EmptyState";
import { formatDate, isOverdue, priorityTone, statusLabels } from "../lib/utils";

export function TasksPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const { data, loading, refetch } = useResource(() => taskApi.list(), []);
  const { data: projectData } = useResource(() => projectApi.list(), []);
  const { data: userData } = useResource(() => userApi.list(), []);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const tasks = data?.tasks || [];
  const projects = projectData?.projects || [];
  const users = userData?.users || [];

  const filtered = useMemo(
    () =>
      tasks.filter((task) => {
        const text = `${task.title} ${task.description} ${task.project?.name} ${task.assignee?.name}`.toLowerCase();
        const matchesStatus = status === "all" || task.status === status;
        return matchesStatus && text.includes(search.toLowerCase());
      }),
    [tasks, status, search]
  );

  const createTask = async (payload) => {
    setSaving(true);
    try {
      await taskApi.create(payload);
      toast("Task created", "success");
      setModalOpen(false);
      await refetch();
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const completeTask = async (task) => {
    try {
      await taskApi.update(task._id, { status: "completed" });
      toast("Task completed", "success");
      await refetch();
    } catch (error) {
      toast(error.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <Badge tone="cyan">Task command table</Badge>
          <h2 className="mt-3 text-3xl font-bold">Tasks</h2>
          <p className="mt-2 text-muted-foreground">Filter assignments, spot overdue work, and update status quickly.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10 sm:w-72" placeholder="Search tasks" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <Select value={status} onChange={(event) => setStatus(event.target.value)} className="sm:w-44">
            <option value="all">All status</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
          {isAdmin ? (
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" />
              New task
            </Button>
          ) : null}
        </div>
      </div>

      {loading ? (
        <Card className="h-96 animate-pulse" />
      ) : filtered.length ? (
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[1.4fr_1fr_0.7fr_0.8fr_0.7fr_auto] gap-4 border-b border-white/10 px-5 py-3 text-xs font-semibold uppercase text-muted-foreground lg:grid">
            <span>Task</span>
            <span>Project</span>
            <span>Owner</span>
            <span>Due</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          <div className="divide-y divide-white/10">
            {filtered.map((task) => (
              <div key={task._id} className="grid gap-4 p-5 lg:grid-cols-[1.4fr_1fr_0.7fr_0.8fr_0.7fr_auto] lg:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{task.title}</p>
                    {isOverdue(task.dueDate, task.status) ? <Badge tone="rose">Overdue</Badge> : null}
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{task.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold capitalize ${priorityTone[task.priority]}`}>
                      {task.priority}
                    </span>
                    {task.labels?.map((label) => (
                      <Badge key={label} tone="slate">{label}</Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{task.project?.name}</p>
                <div className="flex items-center gap-2">
                  <Avatar src={task.assignee?.avatar} name={task.assignee?.name} className="h-8 w-8" />
                  <span className="truncate text-sm">{task.assignee?.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{formatDate(task.dueDate)}</p>
                <Badge tone={task.status === "completed" ? "emerald" : task.status === "in-progress" ? "amber" : "cyan"}>
                  {statusLabels[task.status]}
                </Badge>
                <Button
                  variant="ghost"
                  disabled={task.status === "completed"}
                  onClick={() => completeTask(task)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Complete
                </Button>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={ListFilter}
          title="No tasks match"
          description="Adjust your search or status filter to find the work you need."
        />
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen} title="Create task">
        <TaskForm
          projects={projects}
          users={users}
          onSubmit={createTask}
          onCancel={() => setModalOpen(false)}
          loading={saving}
        />
      </Dialog>
    </div>
  );
}
