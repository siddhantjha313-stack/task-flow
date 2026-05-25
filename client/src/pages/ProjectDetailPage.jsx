import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarClock, CheckCircle2, MessageSquare, Plus, Trash2 } from "lucide-react";
import { projectApi, taskApi, userApi } from "../services/api";
import { useResource } from "../hooks/useResource";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/toast";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Dialog } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import { Avatar, AvatarStack } from "../components/ui/avatar";
import { TaskForm } from "../components/forms/TaskForm";
import { EmptyState } from "../components/EmptyState";
import { formatDate, isOverdue, priorityTone, statusLabels } from "../lib/utils";

export function ProjectDetailPage() {
  const { id } = useParams();
  const { isAdmin, user } = useAuth();
  const { toast } = useToast();
  const { data, loading, refetch } = useResource(() => projectApi.get(id), [id]);
  const { data: projectsData } = useResource(() => projectApi.list(), []);
  const { data: userData } = useResource(() => userApi.list(), []);
  const [taskModal, setTaskModal] = useState({ open: false, task: null });
  const [commenting, setCommenting] = useState(null);
  const [saving, setSaving] = useState(false);

  const project = data?.project;
  const tasks = data?.tasks || [];
  const users = userData?.users || [];
  const projects = projectsData?.projects || [];

  const submitTask = async (payload) => {
    setSaving(true);
    try {
      if (taskModal.task) {
        await taskApi.update(taskModal.task._id, payload);
        toast("Task updated", "success");
      } else {
        await taskApi.create({ ...payload, project: payload.project || id });
        toast("Task created", "success");
      }
      setTaskModal({ open: false, task: null });
      await refetch();
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (task, status) => {
    try {
      await taskApi.update(task._id, { status });
      toast(`Moved to ${statusLabels[status]}`, "success");
      await refetch();
    } catch (error) {
      toast(error.message, "error");
    }
  };

  const deleteTask = async (task) => {
    if (!window.confirm(`Delete ${task.title}?`)) return;
    try {
      await taskApi.delete(task._id);
      toast("Task deleted", "success");
      await refetch();
    } catch (error) {
      toast(error.message, "error");
    }
  };

  const addComment = async (task, message) => {
    if (!message.trim()) return;
    try {
      await taskApi.comment(task._id, message);
      setCommenting(null);
      toast("Comment added", "success");
      await refetch();
    } catch (error) {
      toast(error.message, "error");
    }
  };

  if (loading) {
    return <Card className="h-[70vh] animate-pulse" />;
  }

  if (!project) {
    return <EmptyState title="Project not found" description="The project could not be loaded or you do not have access." />;
  }

  return (
    <div className="space-y-6">
      <Link to="/app/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Badge tone="cyan">{project.status}</Badge>
              <h2 className="mt-4 text-3xl font-bold">{project.name}</h2>
              <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{project.description}</p>
            </div>
            {isAdmin ? (
              <Button onClick={() => setTaskModal({ open: true, task: null })}>
                <Plus className="h-4 w-4" />
                New task
              </Button>
            ) : null}
          </div>
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Project progress</span>
              <span className="font-bold">{project.progress || 0}%</span>
            </div>
            <Progress value={project.progress} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Deadline</p>
              <p className="mt-1 flex items-center gap-2 font-semibold">
                <CalendarClock className="h-4 w-4 text-cyan-200" />
                {formatDate(project.dueDate, { withYear: true })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Priority</p>
              <span className={`mt-1 inline-flex rounded-md border px-2 py-1 text-xs font-semibold capitalize ${priorityTone[project.priority]}`}>
                {project.priority}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tasks</p>
              <p className="mt-1 font-semibold">{project.taskStats?.total || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Team</p>
              <div className="mt-1">
                <AvatarStack users={project.members?.map((member) => member.user).filter(Boolean) || []} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {tasks.length ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {["todo", "in-progress", "completed"].map((status) => (
            <Card key={status}>
              <CardHeader>
                <CardTitle>{statusLabels[status]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.filter((task) => task.status === status).map((task) => (
                  <div key={task._id} className="rounded-lg border border-white/10 bg-white/10 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{task.title}</p>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
                      </div>
                      {isOverdue(task.dueDate, task.status) ? <Badge tone="rose">Late</Badge> : null}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold capitalize ${priorityTone[task.priority]}`}>
                        {task.priority}
                      </span>
                      <Badge tone="slate">{formatDate(task.dueDate)}</Badge>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar src={task.assignee?.avatar} name={task.assignee?.name} className="h-8 w-8" />
                        <span className="text-sm text-muted-foreground">{task.assignee?.name}</span>
                      </div>
                      <div className="flex gap-1">
                        {status !== "completed" ? (
                          <Button variant="ghost" size="icon" onClick={() => updateStatus(task, status === "todo" ? "in-progress" : "completed")}>
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        ) : null}
                        <Button variant="ghost" size="icon" onClick={() => setCommenting(task)}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        {isAdmin ? (
                          <Button variant="ghost" size="icon" onClick={() => deleteTask(task)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : null}
                      </div>
                    </div>
                    {task.comments?.length ? (
                      <p className="mt-3 text-xs text-muted-foreground">{task.comments.length} comment(s)</p>
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tasks yet"
          description={isAdmin ? "Create the first task for this project." : "Assigned tasks for this project will appear here."}
          action={isAdmin ? { label: "Create task", onClick: () => setTaskModal({ open: true, task: null }) } : undefined}
        />
      )}

      <Dialog
        open={taskModal.open}
        onOpenChange={(open) => setTaskModal({ open, task: open ? taskModal.task : null })}
        title={taskModal.task ? "Edit task" : "Create task"}
      >
        <TaskForm
          task={taskModal.task}
          projects={projects}
          users={users}
          onSubmit={submitTask}
          onCancel={() => setTaskModal({ open: false, task: null })}
          loading={saving}
        />
      </Dialog>

      <CommentDialog
        task={commenting}
        currentUser={user}
        onClose={() => setCommenting(null)}
        onSubmit={addComment}
      />
    </div>
  );
}

function CommentDialog({ task, currentUser, onClose, onSubmit }) {
  const [message, setMessage] = useState("");

  const submit = (event) => {
    event.preventDefault();
    onSubmit(task, message);
    setMessage("");
  };

  return (
    <Dialog open={Boolean(task)} onOpenChange={(open) => !open && onClose()} title={`Comments${task ? ` · ${task.title}` : ""}`}>
      <div className="space-y-4">
        <div className="space-y-3">
          {task?.comments?.map((comment) => (
            <div key={comment._id} className="flex gap-3 rounded-lg border border-white/10 bg-white/10 p-3">
              <Avatar src={comment.user?.avatar} name={comment.user?.name} className="h-8 w-8" />
              <div>
                <p className="text-sm font-semibold">{comment.user?.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{comment.message}</p>
              </div>
            </div>
          ))}
        </div>
        <form className="flex gap-2" onSubmit={submit}>
          <Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder={`Reply as ${currentUser?.name}`} />
          <Button>Send</Button>
        </form>
      </div>
    </Dialog>
  );
}
