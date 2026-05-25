import {
  BarChart3,
  BellRing,
  CalendarClock,
  KanbanSquare,
  LockKeyhole,
  Sparkles,
  UsersRound,
  Workflow
} from "lucide-react";

export const features = [
  {
    icon: Workflow,
    title: "Project Command Center",
    description: "Plan launches, assign ownership, track progress, and surface risk without context switching."
  },
  {
    icon: KanbanSquare,
    title: "Fluid Kanban Execution",
    description: "Move work across status lanes with a responsive drag-and-drop board that feels instant."
  },
  {
    icon: BarChart3,
    title: "Executive Analytics",
    description: "Monitor productivity, overdue work, team throughput, and completion rates in a visual dashboard."
  },
  {
    icon: UsersRound,
    title: "Team Roles",
    description: "Keep admins in control while members focus on assigned work, updates, and deadlines."
  },
  {
    icon: CalendarClock,
    title: "Calendar Deadlines",
    description: "See due dates and launch windows in a clean calendar built for planning momentum."
  },
  {
    icon: BellRing,
    title: "Smart Alerts",
    description: "Toast feedback, overdue indicators, and activity updates create a real-time workspace feel."
  },
  {
    icon: LockKeyhole,
    title: "Protected by Design",
    description: "JWT auth, hashed passwords, validation, CORS, and role authorization ship from day one."
  },
  {
    icon: Sparkles,
    title: "Premium Experience",
    description: "Glassmorphism, motion, skeleton states, and polished empty states make the product feel alive."
  }
];

export const testimonials = [
  {
    quote:
      "TaskFlow AI gives our weekly execution rhythm the clarity of an executive dashboard and the speed of a startup war room.",
    name: "Rhea Malhotra",
    role: "COO, Nimbus Labs"
  },
  {
    quote:
      "The Kanban, deadlines, and activity trail feel beautifully connected. It looks like a product our team already trusts.",
    name: "Ethan Brooks",
    role: "Engineering Manager, OrbitPay"
  },
  {
    quote:
      "It has the polish we expect from premium SaaS and the architecture recruiters want to see in a full-stack project.",
    name: "Samira Khan",
    role: "Startup Advisor"
  }
];

export const pricing = [
  {
    name: "Launch",
    price: "$12",
    description: "For early teams building fast.",
    features: ["5 projects", "Kanban boards", "Core analytics", "Team activity"]
  },
  {
    name: "Scale",
    price: "$29",
    description: "For teams that need serious execution control.",
    features: ["Unlimited projects", "Role controls", "Advanced analytics", "Priority support"],
    featured: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with advanced governance needs.",
    features: ["SAML-ready roadmap", "Audit exports", "Dedicated workspace", "Custom onboarding"]
  }
];
