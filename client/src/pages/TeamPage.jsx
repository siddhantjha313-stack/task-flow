import { useState } from "react";
import { MailPlus, ShieldCheck, UserRoundCog } from "lucide-react";
import { userApi } from "../services/api";
import { useResource } from "../hooks/useResource";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/toast";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Dialog } from "../components/ui/dialog";
import { Input, Label, Select } from "../components/ui/input";
import { Avatar } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import { EmptyState } from "../components/EmptyState";
import { formatRelative } from "../lib/utils";

const inviteInitial = {
  name: "",
  email: "",
  role: "member",
  jobTitle: "",
  department: ""
};

export function TeamPage() {
  const { isAdmin, user: currentUser } = useAuth();
  const { toast } = useToast();
  const { data, loading, refetch } = useResource(() => userApi.list(), []);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [form, setForm] = useState(inviteInitial);
  const [saving, setSaving] = useState(false);
  const users = data?.users || [];

  const invite = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const result = await userApi.invite(form);
      toast(`Invited ${result.user.name}. Temporary password: ${result.temporaryPassword}`, "success");
      setInviteOpen(false);
      setForm(inviteInitial);
      await refetch();
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const updateRole = async (member, role) => {
    try {
      await userApi.update(member._id, { role });
      toast("Role updated", "success");
      await refetch();
    } catch (error) {
      toast(error.message, "error");
    }
  };

  const deactivate = async (member) => {
    if (!window.confirm(`Deactivate ${member.name}?`)) return;
    try {
      await userApi.delete(member._id);
      toast("User deactivated", "success");
      await refetch();
    } catch (error) {
      toast(error.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge tone="cyan">Role-based access</Badge>
          <h2 className="mt-3 text-3xl font-bold">Team Management</h2>
          <p className="mt-2 text-muted-foreground">Invite teammates, manage roles, and monitor individual progress.</p>
        </div>
        {isAdmin ? (
          <Button onClick={() => setInviteOpen(true)}>
            <MailPlus className="h-4 w-4" />
            Invite member
          </Button>
        ) : null}
      </div>

      {loading ? (
        <Card className="h-96 animate-pulse" />
      ) : users.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {users.map((member) => (
            <Card key={member._id} className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <Avatar src={member.avatar} name={member.name} className="h-14 w-14" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-lg font-semibold">{member.name}</h3>
                    <Badge tone={member.role === "admin" ? "amber" : "cyan"}>
                      {member.role === "admin" ? <ShieldCheck className="h-3 w-3" /> : <UserRoundCog className="h-3 w-3" />}
                      {member.role}
                    </Badge>
                    {member.status !== "active" ? <Badge tone="rose">{member.status}</Badge> : null}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{member.jobTitle} · {member.department}</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>

                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-semibold">{member.stats?.completionRate || 0}%</span>
                    </div>
                    <Progress value={member.stats?.completionRate || 0} />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-white/10 p-2">
                      <p className="font-bold">{member.stats?.assigned || 0}</p>
                      <p className="text-xs text-muted-foreground">Assigned</p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-2">
                      <p className="font-bold">{member.stats?.completed || 0}</p>
                      <p className="text-xs text-muted-foreground">Done</p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-2">
                      <p className="font-bold">{member.stats?.overdue || 0}</p>
                      <p className="text-xs text-muted-foreground">Late</p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground">Last active {formatRelative(member.lastActiveAt)}</p>
                </div>
              </div>

              {isAdmin ? (
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <Select
                    value={member.role}
                    disabled={member._id === currentUser?._id}
                    onChange={(event) => updateRole(member, event.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </Select>
                  <Button
                    variant="ghost"
                    disabled={member._id === currentUser?._id || member.status !== "active"}
                    onClick={() => deactivate(member)}
                  >
                    Deactivate
                  </Button>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No team members yet" description="Invite your first collaborator to start assigning work." />
      )}

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen} title="Invite team member" description="Create an account and share the temporary password securely.">
        <form className="space-y-4" onSubmit={invite}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="invite-name">Name</Label>
              <Input id="invite-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input id="invite-email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select id="invite-role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-title">Job title</Label>
              <Input id="invite-title" value={form.jobTitle} onChange={(event) => setForm({ ...form, jobTitle: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-department">Department</Label>
              <Input id="invite-department" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving}>Invite user</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
