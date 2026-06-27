export interface ResourceCategory {
  t: string;
  s: string;
  m: string;
  tg: string;
  d: string;
  h: string;
}

export const CATS: ResourceCategory[] = [
  { t: "Theoretical Research Papers", s: "research", m: "Tech", tg: "ACADEMIC ARCHIVE", d: "Rigorous scientific research exploring cognitive modeling, multi-agent convergence, and latency optimization.", h: "/resources/research" },
  { t: "Technical Whitepapers", s: "whitepapers", m: "Tech", tg: "SYSTEM SPECIFICATIONS", d: "Detailed systems architectural papers detailing secure sandboxing, memory isolation, and safe execution loops.", h: "/resources/whitepapers" },
  { t: "Architecture Library", s: "architecture-library", m: "Tech", tg: "BLUEPRINTS", d: "Interactive visual diagrams, memory structures, and data flows of our state-of-the-art enterprise platforms.", h: "/resources/architecture-library" },
  { t: "Developer Docs", s: "developer-docs", m: "Tech", tg: "DEVELOPER RESOURCES", d: "Robust API references, schema declarations, and SDK manuals for orchestrating secure agentic clusters.", h: "/resources/developer-docs" },
  // { t: "Patterns of Intelligence", s: "patterns-of-intelligence", m: "Exec", tg: "COGNITIVE ARCHETYPES", d: "A proprietary catalog of standardized enterprise intelligence patterns mapped to industry verticals.", h: "/resources/patterns-of-intelligence" },
  { t: "Case Studies", s: "case-studies", m: "Exec", tg: "REAL-WORLD RESULTS", d: "In-depth studies of sovereign multi-agent integrations across audit, finance, advisory, and energy sectors.", h: "/resources/case-studies" },
  // { t: "Market Reports", s: "reports", m: "Exec", tg: "INTELLIGENCE BRIEFS", d: "Strategic reports assessing digital labor penetration, boardroom readiness, and macroeconomic AI scaling indices.", h: "/resources/reports" },
  { t: "Corporate Blog", s: "blog", m: "Exec", tg: "EDITORIAL DIALOGUE", d: "Reflections on sovereign technology, safe deployment methodologies, and the ethics of digital workforce automation.", h: "/resources/blog" },
  { t: "Multimedia Keynotes", s: "videos", m: "Media", tg: "VIDEO KEYNOTES", d: "High-definition streaming captures of our technical keynotes, platform walk-throughs, and system live demonstrations.", h: "/resources/videos" },
  { t: "Executive Masterclasses", s: "webinars", m: "Media", tg: "WEBINARS & SEMINARS", d: "Interactive, expert-led training webinars detailing model alignment, data sovereignty, and security governance.", h: "/resources/webinars" },
  { t: "Global Summits", s: "events", m: "Media", tg: "EVENTS CALENDAR", d: "Physical and virtual events calendar, featuring executive roundtables and developer meetups globally.", h: "/resources/events" },
  // { t: "Boardroom Podcast", s: "podcasts", m: "Media", tg: "AUDIO PODCASTS", d: "C-suite discussions and deep technical conversations on the operationalization of secure autonomous enterprises.", h: "/resources/podcasts" },
  { t: "Asset Downloads", s: "downloads", m: "Tech", tg: "UTILITIES & FILES", d: "Cryptographically verified software packages, compliance checklists, and offline deployment calculators.", h: "/resources/downloads" },
  // { t: "Corporate Newsroom", s: "newsroom", m: "Corp", tg: "PRESS ARCHIVE", d: "Official corporate press releases, engineering breakthroughs, strategic alliances, and leadership announcements.", h: "/resources/newsroom" }
];
