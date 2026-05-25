import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Play,
  ShieldCheck,
  Sparkles,
  Zap
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { features, pricing, testimonials } from "../data/landing";

function HeroMockup() {
  const lanes = [
    { title: "Todo", color: "bg-cyan-300", tasks: ["JWT access review", "Mobile quick-add"] },
    { title: "In Progress", color: "bg-amber-300", tasks: ["Animated onboarding", "Launch dashboard"] },
    { title: "Completed", color: "bg-emerald-300", tasks: ["Risk widget", "Pricing copy"] }
  ];

  return (
    <motion.div
      className="relative mx-auto mt-12 w-full max-w-6xl overflow-hidden rounded-lg border border-white/10 bg-slate-950/80 shadow-premium backdrop-blur-2xl"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.25 }}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          <span className="h-3 w-3 rounded-full bg-amber-300" />
          <span className="h-3 w-3 rounded-full bg-emerald-300" />
        </div>
        <Badge tone="cyan">Live workspace</Badge>
      </div>
      <div className="grid gap-4 p-4 md:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4 md:grid-cols-3">
          {lanes.map((lane, index) => (
            <motion.div
              key={lane.title}
              className="rounded-lg border border-white/10 bg-white/[0.08] p-3"
              animate={{ y: [0, index % 2 ? 8 : -8, 0] }}
              transition={{ repeat: Infinity, duration: 6 + index, ease: "easeInOut" }}
            >
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <span className={`h-2.5 w-2.5 rounded-full ${lane.color}`} />
                {lane.title}
              </div>
              <div className="space-y-3">
                {lane.tasks.map((task) => (
                  <div key={task} className="rounded-lg border border-white/10 bg-slate-900/90 p-3">
                    <p className="text-sm font-semibold">{task}</p>
                    <div className="mt-3 h-1.5 rounded-full bg-white/10">
                      <div className={`h-full rounded-full ${lane.color}`} style={{ width: `${55 + index * 15}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="grid gap-4">
          <div className="rounded-lg border border-white/10 bg-white/[0.08] p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Productivity Signal</p>
              <Zap className="h-5 w-5 text-amber-200" />
            </div>
            <div className="mt-6 flex h-40 items-end gap-2">
              {[42, 66, 51, 78, 88, 72, 94].map((height, index) => (
                <motion.div
                  key={height}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-cyan-400 to-emerald-300"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.4 + index * 0.08, duration: 0.55 }}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["92%", "14", "3"].map((value, index) => (
              <div key={value} className="rounded-lg border border-white/10 bg-white/[0.08] p-3">
                <p className="text-2xl font-bold">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {index === 0 ? "Focus" : index === 1 ? "Tasks" : "Risks"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function LandingPage() {
  return (
    <div className="noise min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 grid-mask opacity-50" />
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-cyan-300 via-emerald-300 to-amber-200 font-black text-slate-950 shadow-glow">
              TF
            </div>
            <span className="font-bold">TaskFlow AI</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#testimonials" className="hover:text-foreground">Customers</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative">
        <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-4 pb-10 pt-14 text-center sm:px-6 lg:px-8">
          <motion.div
            className="absolute left-1/2 top-20 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl"
            animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.8, 0.45] }}
            transition={{ repeat: Infinity, duration: 7 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mx-auto max-w-4xl"
          >
            <Badge tone="cyan" className="mb-5">
              <Sparkles className="h-3.5 w-3.5" />
              Premium execution platform for modern teams
            </Badge>
            <h1 className="text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">TaskFlow AI</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              A futuristic project command center where teams plan launches, assign work, track deadlines,
              and move faster with a dashboard that feels alive.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/signup">
                  Build your workspace
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/login">
                  <Play className="h-5 w-5" />
                  Try demo login
                </Link>
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
              {["JWT auth", "MongoDB", "Role access", "Railway ready"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
          <HeroMockup />
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge tone="emerald">Feature system</Badge>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Everything a serious project workspace needs.</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="p-5 transition hover:-translate-y-1 hover:border-cyan-300/30">
                <feature.icon className="h-6 w-6 text-cyan-200" />
                <h3 className="mt-5 font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge tone="amber">
                <ShieldCheck className="h-3.5 w-3.5" />
                Production architecture
              </Badge>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Built like a real SaaS repo, not a static mockup.</h2>
              <p className="mt-4 text-muted-foreground">
                Express routers, MVC controllers, Mongoose schemas, JWT middleware, protected API routes, and
                role-based authorization are wired end to end.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["REST APIs", "Auth, users, projects, tasks"],
                ["Security", "bcrypt, JWT, CORS, validation"],
                ["Deploy", "Railway scripts and env templates"]
              ].map(([title, body]) => (
                <Card key={title} className="p-5">
                  <p className="text-lg font-bold">{title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{body}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.name} className="p-6">
                <p className="leading-7 text-muted-foreground">“{item.quote}”</p>
                <div className="mt-6">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge tone="cyan">Dummy pricing</Badge>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Choose the pace your team needs.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {pricing.map((plan) => (
              <Card key={plan.name} className={`p-6 ${plan.featured ? "border-cyan-300/40 shadow-glow" : ""}`}>
                <p className="text-lg font-bold">{plan.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                <p className="mt-6 text-4xl font-black">{plan.price}</p>
                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <p key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                      {feature}
                    </p>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative border-t border-white/10 px-4 py-8 text-center text-sm text-muted-foreground">
        TaskFlow AI © 2026. Built for full-stack project evaluation and production-style deployment.
      </footer>
    </div>
  );
}
