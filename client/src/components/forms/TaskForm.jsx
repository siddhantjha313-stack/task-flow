import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input, Label, Select, Textarea } from "../ui/input";

const initialState = {
  title: "",
  description: "",
  project: "",
  assignee: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
  labels: ""
};

export function TaskForm({ task, projects = [], users = [], onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        project: task.project?._id || task.project || "",
        assignee: task.assignee?._id || task.assignee || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
        labels: task.labels?.join(", ") || ""
      });
    } else {
      setForm((current) => ({
        ...initialState,
        project: projects[0]?._id || current.project,
        assignee: users[0]?._id || current.assignee
      }));
    }
  }, [task, projects, users]);

  const activeProjects = useMemo(() => projects.filter((project) => project.status !== "completed"), [projects]);
  const activeUsers = useMemo(() => users.filter((user) => user.status !== "inactive"), [users]);

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      dueDate: new Date(form.dueDate).toISOString(),
      labels: form.labels
        .split(",")
        .map((label) => label.trim())
        .filter(Boolean)
    });
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="space-y-2">
        <Label htmlFor="task-title">Task title</Label>
        <Input
          id="task-title"
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-description">Description</Label>
        <Textarea
          id="task-description"
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="task-project">Project</Label>
          <Select
            id="task-project"
            value={form.project}
            onChange={(event) => setForm({ ...form, project: event.target.value })}
            required
          >
            <option value="" disabled>Select project</option>
            {activeProjects.map((project) => (
              <option key={project._id} value={project._id}>{project.name}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-assignee">Assignee</Label>
          <Select
            id="task-assignee"
            value={form.assignee}
            onChange={(event) => setForm({ ...form, assignee: event.target.value })}
            required
          >
            <option value="" disabled>Select assignee</option>
            {activeUsers.map((user) => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="task-status">Status</Label>
          <Select id="task-status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-priority">Priority</Label>
          <Select id="task-priority" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-due">Due date</Label>
          <Input
            id="task-due"
            type="date"
            value={form.dueDate}
            onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-labels">Labels</Label>
        <Input
          id="task-labels"
          value={form.labels}
          placeholder="backend, launch, risk"
          onChange={(event) => setForm({ ...form, labels: event.target.value })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button loading={loading}>{task ? "Save task" : "Create task"}</Button>
      </div>
    </form>
  );
}
