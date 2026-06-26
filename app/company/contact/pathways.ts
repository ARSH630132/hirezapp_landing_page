import { MessageSquare, Calendar, Shield, Users, FileText, Globe, Award, Briefcase, Sparkles, Building, ShieldAlert } from "lucide-react";

export const PATHWAYS = [
  { id: "talk-sales", title: "Talk To Sales", tag: "Agent subscriptions", icon: MessageSquare, color: "gradient", desc: "Discuss licensing, volume brackets, and custom service boundaries." },
  { id: "workshop", title: "Book Workshop", tag: "Engineering sessions", icon: Calendar, color: "blue", desc: "Schedule a collaborative architectural design workshop." },
  { id: "consultation", title: "Book Consultation", tag: "Enterprise strategy", icon: Sparkles, color: "red", desc: "Arrange a dedicated session with our senior AI strategy team." },
  { id: "sales", title: "Sales", tag: "Commercial procurement", icon: Building, color: "gradient", desc: "Inquire about strategic pricing and volume discounts." },
  { id: "support", title: "Support", tag: "Sandbox solutions", icon: ShieldAlert, color: "red", desc: "Access technical assistance for active sandboxes or API issues." },
  { id: "partnership", title: "Partnership", tag: "Lattice ecosystem", icon: Globe, color: "blue", desc: "Propose technology integrations and strategic alliances." },
  { id: "media", title: "Media", tag: "Press & institutional", icon: FileText, color: "gradient", desc: "Request interviews or research commentary." },
  { id: "university", title: "University", tag: "Academic alliances", icon: Award, color: "blue", desc: "Engage in partnerships regarding decoupled multi-agent engineering." },
  { id: "investors", title: "Investors", tag: "Institutional updates", icon: Shield, color: "gradient", desc: "Direct communications for investors and capital allocators." },
  { id: "become-partner", title: "Become Partner", tag: "Join global alliance", icon: Users, color: "blue", desc: "Register as a certified delivery partner in our global lattice." },
  { id: "careers", title: "Careers", tag: "Build decoupled future", icon: Briefcase, color: "red", desc: "Apply for research, systems engineering, or core infrastructure roles." }
];
