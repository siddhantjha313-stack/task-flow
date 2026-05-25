import { useMemo, useState } from "react";
import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Search } from "lucide-react";
import { projectApi, taskApi, userApi } from "../services/api";
import { useResource } from "../hooks/useResource";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/toast";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input, Select } from "../components/ui/input";
import { Dialog } from "../components/ui/dialog";
import { Avatar } from "../components/ui/avatar";
import { TaskForm } from "../components/forms/TaskForm";
import { formatDate, isOverdue, priorityTone, statusLabels } from "../lib/utils";

const lanes = [
  { id: "todo", title: "Todo", tone: "cyan" },
  { id: "in-progress", title: "In Progress", tone: "amber" },
  { id: "completed", title: "Completed", tone: "emerald" }
];

function DroppableLane({ lane, children }) {
  const { setNodeRef, isOver } = useDroppable({ id: lane.id });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[36rem] rounded-lg border border-white/10 bg-white/[0.08] p-3 transition ${isOver ? "border-cyan-300/60 bg-cyan-300/10" : ""}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <Badge tone={lane.tone}>{lane.title}</Badge>
        <span className="text-xs text-muted-foreground">{children.length}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function DraggableTask({ task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task._id });
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.45 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-lg border border-white/10 bg-slate-950/80 p-4 shadow-premium transition active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold">{task.title}</p>
        {isOverdue(task.dueDate, task.status) ? <Badge tone="rose">Late</Badge> : null}
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold capitalize ${priorityTone[task.priority]}`}>
          {task.priority}
        </span>
        <Badge tone="slate">{formatDate(task.dueDate)}</Badge>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar src={task.assignee?.avatar} name={task.assignee?.name} className="h-7 w-7" />
          <span className="truncate text-xs text-muted-foreground">{task.assignee?.name}</span>
        </div>
        <span className="truncate text-xs text-muted-foreground">{task.project?.name}</span>
      </div>
    </div>
  );
}

export function KanbanPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const { data, setData, loading, refetch } = useResource(() => taskApi.list(), []);
  const { data: projectsData } = useResource(() => projectApi.list(), []);
  const { data: userData } = useResource(() => userApi.list(), []);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [taskModal, setTaskModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const tasks = data?.tasks || [];
  const projects = projectsData?.projects || [];
  const users = userData?.users || [];

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const matchesProject = projectFilter === "all" || task.project?._id === projectFilter;
        const text = `${task.title} ${task.description} ${task.project?.name} ${task.assignee?.name}`.toLowerCase();
        return matchesProject && text.includes(search.toLowerCase());
      }),
    [tasks, projectFilter, search]
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const task = tasks.find((item) => item._id === active.id);
    if (!task || task.status === over.id) return;

    const previous = data;
    setData({
      ...data,
      tasks: tasks.map((item) => (item._id === task._id ? { ...item, status: over.id } : item))
    });

    try {
      await taskApi.update(task._id, { status: over.id });
      toast(`Moved to ${statusLabels[over.id]}`, "success");
      await refetch();
    } catch (error) {
      setData(previous);
      toast(error.message, "error");
    }
  };

  const createTask = async (payload) => {
    setSaving(true);
    try {
      await taskApi.create(payload);
      toast("Task created", "success");
      setTaskModal(false);
      await refetch();
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <Badge tone="cyan">Drag and drop</Badge>
          <h2 className="mt-3 text-3xl font-bold">Kanban Board</h2>
          <p className="mt-2 text-muted-foreground">Move tasks through the workflow with optimistic updates.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10 sm:w-72" placeholder="Search tasks" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <Select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} className="sm:w-60">
            <option value="all">All projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>{project.name}</option>
            ))}
          </Select>
          {isAdmin ? (
            <Button onClick={() => setTaskModal(true)}>
              <Plus className="h-4 w-4" />
              Task
            </Button>
          ) : null}
        </div>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid gap-4 xl:grid-cols-3">
          {lanes.map((lane) => {
            const laneTasks = filteredTasks.filter((task) => task.status === lane.id);
            return (
              <Card key={lane.id} className="p-2">
                <DroppableLane lane={lane}>
                  {loading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-40 animate-pulse rounded-lg bg-white/10" />
                      ))
                    : laneTasks.map((task) => <DraggableTask key={task._id} task={task} />)}
                </DroppableLane>
              </Card>
            );
          })}
        </div>
      </DndContext>

      <Dialog open={taskModal} onOpenChange={setTaskModal} title="Create task">
        <TaskForm
          projects={projects}
          users={users}
          onSubmit={createTask}
          onCancel={() => setTaskModal(false)}
          loading={saving}
        />
      </Dialog>
    </div>
  );
}
