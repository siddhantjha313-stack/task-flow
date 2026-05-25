import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input, Label } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/toast";

const demoCredentials = [
  { label: "Admin", email: "admin@taskflow.ai", password: "Taskflow@123" },
  { label: "Member", email: "maya@taskflow.ai", password: "Taskflow@123" }
];

function AuthShell({ mode }) {
  const isLogin = mode === "login";
  const { login, signup, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
        toast("Welcome back to TaskFlow AI", "success");
      } else {
        await signup(form);
        toast("Workspace account created", "success");
      }

      navigate(location.state?.from?.pathname || "/app", { replace: true });
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const useDemo = (credentials) => {
    setForm((current) => ({
      ...current,
      email: credentials.email,
      password: credentials.password
    }));
  };

  return (
    <div className="noise min-h-screen px-4 py-8">
      <div className="pointer-events-none fixed inset-0 grid-mask opacity-40" />
      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_0.85fr]">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to landing
          </Link>
          <Badge tone="cyan" className="mt-10">
            {isLogin ? "Demo ready" : "First signup becomes admin"}
          </Badge>
          <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
            {isLogin ? "Enter your execution cockpit." : "Create your premium workspace."}
          </h1>
          <p className="mt-5 max-w-xl text-muted-foreground">
            Authenticate with JWT, persist sessions, and move into a role-aware workspace with projects,
            tasks, analytics, Kanban, calendar, and team controls.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {demoCredentials.map((item) => (
              <button
                key={item.email}
                type="button"
                onClick={() => useDemo(item)}
                className="rounded-lg border border-white/10 bg-white/10 p-4 text-left transition hover:-translate-y-1 hover:border-cyan-300/40"
              >
                <p className="font-semibold">{item.label} demo</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.email}</p>
                <p className="mt-2 text-xs text-cyan-100">{item.password}</p>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="mb-6">
              <p className="text-2xl font-bold">{isLogin ? "Log in" : "Sign up"}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {isLogin ? "Use seeded credentials after running npm run seed." : "Your first account is created as Admin."}
              </p>
            </div>

            <form className="space-y-4" onSubmit={submit}>
              {!isLogin ? (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      className="pl-10"
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      required
                    />
                  </div>
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button className="w-full" size="lg" loading={loading}>
                {isLogin ? "Log in to workspace" : "Create account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isLogin ? "No account yet?" : "Already have an account?"}{" "}
              <Link className="font-semibold text-cyan-200" to={isLogin ? "/signup" : "/login"}>
                {isLogin ? "Sign up" : "Log in"}
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export const LoginPage = () => <AuthShell mode="login" />;
export const SignupPage = () => <AuthShell mode="signup" />;
