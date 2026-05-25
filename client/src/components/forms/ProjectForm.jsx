import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input, Label, Select, Textarea } from "../ui/input";

const initialState = {
  name: "",
  description: "",
  status: "planning",
  priority: "medium",
  dueDate: "",
  tags: "",
  color: "#22d3ee",
  members: []
};

export function ProjectForm({ project, users = [], onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "planning",
        priority: project.priority || "medium",
        dueDate: project.dueDate ? project.dueDate.slice(0, 10) : "",
        tags: project.tags?.join(", ") || "",
        color: project.color || "#22d3ee",
        members: project.members?.map((member) => member.user?._id || member.user) || []
      });
    } else {
      setForm(initialState);
    }
  }, [project]);

  const activeMembers = useMemo(() => users.filter((user) => user.status !== "inactive"), [users]);

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      members: form.members,
      dueDate: new Date(form.dueDate).toISOString()
    });
  };

  const toggleMember = (id) => {
    setForm((current) => ({
      ...current,
      members: current.members.includes(id)
        ? current.members.filter((memberId) => memberId !== id)
        : [...current.members, id]
    }));
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="project-name">Project name</Label>
          <Input
            id="project-name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-date">Deadline</Label>
          <Input
            id="project-date"
            type="date"
            value={form.dueDate}
            onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-description">Description</Label>
        <Textarea
          id="project-description"
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="project-status">Status</Label>
          <Select id="project-status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-priority">Priority</Label>
          <Select id="project-priority" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-color">Accent color</Label>
          <Input
            id="project-color"
            type="color"
            value={form.color}
            onChange={(event) => setForm({ ...form, color: event.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-tags">Tags</Label>
        <Input
          id="project-tags"
          value={form.tags}
          placeholder="launch, product, sprint"
          onChange={(event) => setForm({ ...form, tags: event.target.value })}
        />
      </div>

      <div className="space-y-3">
        <Label>Team members</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {activeMembers.map((user) => (
            <label
              key={user._id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/10 p-3 text-sm"
            >
              <input
                type="checkbox"
                checked={form.members.includes(user._id)}
                onChange={() => toggleMember(user._id)}
                className="h-4 w-4 accent-cyan-300"
              />
              <span className="font-medium">{user.name}</span>
              <span className="ml-auto text-xs capitalize text-muted-foreground">{user.role}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button loading={loading}>{project ? "Save project" : "Create project"}</Button>
      </div>
    </form>
  );
}
