import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit3, FolderPlus, Search, Trash2 } from "lucide-react";
import { projectApi, userApi } from "../services/api";
import { useResource } from "../hooks/useResource";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/toast";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Dialog } from "../components/ui/dialog";
import { Progress } from "../components/ui/progress";
import { AvatarStack } from "../components/ui/avatar";
import { EmptyState } from "../components/EmptyState";
import { ProjectForm } from "../components/forms/ProjectForm";
import { formatDate, priorityTone, statusLabels } from "../lib/utils";

export function ProjectsPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const { data, loading, refetch } = useResource(() => projectApi.list(), []);
  const { data: userData } = useResource(() => userApi.list(), []);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ open: false, project: null });
  const [saving, setSaving] = useState(false);

  const projects = data?.projects || [];
  const users = userData?.users || [];
  const filtered = useMemo(
    () =>
      projects.filter((project) =>
        `${project.name} ${project.description} ${project.tags?.join(" ")}`.toLowerCase().includes(search.toLowerCase())
      ),
    [projects, search]
  );

  const submitProject = async (payload) => {
    setSaving(true);
    try {
      if (modal.project) {
        await projectApi.update(modal.project._id, payload);
        toast("Project updated", "success");
      } else {
        await projectApi.create(payload);
        toast("Project created", "success");
      }
      setModal({ open: false, project: null });
      await refetch();
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`Archive ${project.name}?`)) return;
    try {
      await projectApi.delete(project._id);
      toast("Project archived", "success");
      await refetch();
    } catch (error) {
      toast(error.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge tone="cyan">Portfolio</Badge>
          <h2 className="mt-3 text-3xl font-bold">Projects</h2>
          <p className="mt-2 text-muted-foreground">Create launches, coordinate owners, and track progress by deadline.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input className="w-full pl-10 sm:w-72" placeholder="Search projects" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          {isAdmin ? (
            <Button onClick={() => setModal({ open: true, project: null })}>
              <FolderPlus className="h-4 w-4" />
              New project
            </Button>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-64 animate-pulse" />
          ))}
        </div>
      ) : filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className="flex h-full flex-col p-5 transition hover:-translate-y-1 hover:border-cyan-300/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/app/projects/${project._id}`} className="truncate text-lg font-bold hover:text-cyan-200">
                      {project.name}
                    </Link>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{project.description}</p>
                  </div>
                  <div className="h-10 w-2 rounded-full" style={{ backgroundColor: project.color }} />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge tone={project.status === "completed" ? "emerald" : "cyan"}>{statusLabels[project.status] || project.status}</Badge>
                  <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold capitalize ${priorityTone[project.priority]}`}>
                    {project.priority}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{project.progress || 0}%</span>
                  </div>
                  <Progress value={project.progress} />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-white/10 p-3">
                    <p className="text-lg font-bold">{project.taskStats?.total || 0}</p>
                    <p className="text-xs text-muted-foreground">Tasks</p>
                  </div>
                  <div className="rounded-lg bg-white/10 p-3">
                    <p className="text-lg font-bold">{project.taskStats?.completed || 0}</p>
                    <p className="text-xs text-muted-foreground">Done</p>
                  </div>
                  <div className="rounded-lg bg-white/10 p-3">
                    <p className="text-lg font-bold">{project.taskStats?.overdue || 0}</p>
                    <p className="text-xs text-muted-foreground">Late</p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-5">
                  <div>
                    <p className="text-xs text-muted-foreground">Due {formatDate(project.dueDate)}</p>
                    <AvatarStack users={project.members?.map((member) => member.user).filter(Boolean) || []} />
                  </div>
                  {isAdmin ? (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setModal({ open: true, project })}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteProject(project)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : null}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects found"
          description="Create your first project or adjust the search filter to find existing work."
          action={isAdmin ? { label: "Create project", onClick: () => setModal({ open: true, project: null }) } : undefined}
        />
      )}

      <Dialog
        open={modal.open}
        onOpenChange={(open) => setModal({ open, project: open ? modal.project : null })}
        title={modal.project ? "Edit project" : "Create project"}
        description="Define scope, deadline, priority, and the team members involved."
      >
        <ProjectForm
          project={modal.project}
          users={users}
          onSubmit={submitProject}
          onCancel={() => setModal({ open: false, project: null })}
          loading={saving}
        />
      </Dialog>
    </div>
  );
}
