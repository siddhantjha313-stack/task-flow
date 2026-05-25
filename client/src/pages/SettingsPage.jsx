import { useEffect, useState } from "react";
import { BellRing, Moon, Save, Sun } from "lucide-react";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../components/ui/toast";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input, Label } from "../components/ui/input";
import { Avatar } from "../components/ui/avatar";

export function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    jobTitle: "",
    department: "",
    avatar: "",
    notifications: true
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        jobTitle: user.jobTitle || "",
        department: user.department || "",
        avatar: user.avatar || "",
        notifications: user.preferences?.notifications ?? true
      });
    }
  }, [user]);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const data = await authApi.updateMe({
        name: form.name,
        jobTitle: form.jobTitle,
        department: form.department,
        avatar: form.avatar,
        preferences: {
          notifications: form.notifications,
          theme
        }
      });
      updateUser(data.user);
      toast("Profile settings saved", "success");
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Badge tone="cyan">Workspace profile</Badge>
        <h2 className="mt-3 text-3xl font-bold">Settings</h2>
        <p className="mt-2 text-muted-foreground">Manage your profile, theme preference, and notification style.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar src={form.avatar} name={form.name} className="h-24 w-24 text-2xl" />
            <h3 className="mt-4 text-xl font-semibold">{form.name}</h3>
            <p className="text-sm text-muted-foreground">{form.jobTitle}</p>
            <Badge tone={user?.role === "admin" ? "amber" : "cyan"} className="mt-4">{user?.role}</Badge>
          </div>

          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/10 p-4 text-left"
            >
              <span>
                <span className="block font-semibold">Theme</span>
                <span className="text-sm text-muted-foreground">Switch between dark and light mode.</span>
              </span>
              {theme === "dark" ? <Moon className="h-5 w-5 text-cyan-200" /> : <Sun className="h-5 w-5 text-amber-200" />}
            </button>
            <button
              type="button"
              onClick={() => setForm((current) => ({ ...current, notifications: !current.notifications }))}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/10 p-4 text-left"
            >
              <span>
                <span className="block font-semibold">Notifications</span>
                <span className="text-sm text-muted-foreground">Enable toast and deadline alerts.</span>
              </span>
              <BellRing className={`h-5 w-5 ${form.notifications ? "text-emerald-200" : "text-muted-foreground"}`} />
            </button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-name">Name</Label>
                  <Input id="settings-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-avatar">Avatar URL</Label>
                  <Input id="settings-avatar" value={form.avatar} onChange={(event) => setForm({ ...form, avatar: event.target.value })} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-title">Job title</Label>
                  <Input id="settings-title" value={form.jobTitle} onChange={(event) => setForm({ ...form, jobTitle: event.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-department">Department</Label>
                  <Input id="settings-department" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} />
                </div>
              </div>
              <Button loading={saving}>
                <Save className="h-4 w-4" />
                Save profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
