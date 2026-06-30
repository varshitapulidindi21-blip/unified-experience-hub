// Shared newsletter data + design tokens for the Newsletter Business Module.

export type Category =
  | "Sustainability"
  | "Innovation"
  | "People & Culture"
  | "Operations"
  | "Community"
  | "Leadership";

export type EditionPage = {
  /** Headline shown over the carousel slide */
  title: string;
  /** Optional supporting line */
  subtitle?: string;
  /** Optional kicker / eyebrow above title */
  kicker?: string;
};

export type Edition = {
  id: string;
  title: string;
  month: string;
  year: string;
  date: string;
  readMin: number;
  excerpt: string;
  likes: number;
  comments: number;
  cover: "purple" | "green" | "lavender" | "green-light" | "deep-purple" | "deep-green";
  category: Category;
  featured?: boolean;
  author?: string;
  authorRole?: string;
  tags?: string[];
  /** Carousel pages (Instagram-style). The featured edition uses these. */
  pages?: EditionPage[];
};

export const EDITIONS: Edition[] = [
  {
    id: "jun26",
    title: "Powering Progress, Shaping Tomorrow",
    month: "JUNE", year: "2026", date: "2 Jun 2026", readMin: 8,
    excerpt: "Inside the milestones, people, and projects defining a defining quarter for Resolven.",
    likes: 248, comments: 42, cover: "purple", category: "Leadership", featured: true,
    author: "Brand Team", tags: ["Quarterly", "Growth"],
    pages: [
      { kicker: "JUNE 2026 EDITION", title: "Powering Progress,\nShaping Tomorrow", subtitle: "Building a sustainable future together." },
      { kicker: "MILESTONE", title: "12.8M kWh of clean energy", subtitle: "Delivered across 14 sites this quarter." },
      { kicker: "PEOPLE", title: "Meet the WindPeak crew", subtitle: "The engineers behind our newest wind farm." },
      { kicker: "COMMUNITY", title: "1,200+ households powered", subtitle: "Local impact in Rajasthan and Tamil Nadu." },
      { kicker: "INNOVATION", title: "Smart grid pilot goes live", subtitle: "Real-time monitoring across all major sites." },
      { kicker: "WHAT'S NEXT", title: "On the horizon", subtitle: "Townhall · World Environment Day · Hackathon 2024." },
    ],
  },
  { id: "may26", title: "Our Planet, Our Promise",            month: "MAY",  year: "2026", date: "5 May 2026", readMin: 7, excerpt: "Highlights from our sustainability journey — clean energy, water and community impact.", likes: 192, comments: 28, cover: "green", category: "Sustainability", author: "ESG Council", tags: ["Renewables", "ESG"] },
  { id: "apr26", title: "Innovate. Collaborate. Accelerate.", month: "APR",  year: "2026", date: "6 Apr 2026", readMin: 6, excerpt: "How cross-functional teams shipped three breakthroughs in one quarter.", likes: 156, comments: 22, cover: "deep-purple", category: "Innovation", author: "R&D Team", tags: ["Tech", "Process"] },
  { id: "mar26", title: "People Powering Possibility",        month: "MAR",  year: "2026", date: "3 Mar 2026", readMin: 6, excerpt: "Spotlight on the engineers, technicians and partners moving us forward.", likes: 140, comments: 19, cover: "lavender", category: "People & Culture", author: "People Team" },
  { id: "feb26", title: "Sustainable Solutions, Stronger Tomorrow", month: "FEB", year: "2026", date: "3 Feb 2026", readMin: 7, excerpt: "Hard numbers on emissions avoided, water saved and communities served.", likes: 132, comments: 16, cover: "deep-green", category: "Sustainability", tags: ["Impact"] },
  { id: "jan26", title: "A Brighter Future, Together",        month: "JAN",  year: "2026", date: "6 Jan 2026", readMin: 6, excerpt: "Kicking off the year with purpose and shared energy.", likes: 118, comments: 14, cover: "green-light", category: "Community" },
  { id: "dec25", title: "Milestones That Matter",             month: "DEC",  year: "2025", date: "2 Dec 2025", readMin: 5, excerpt: "A look back at our biggest achievements across sites and functions.", likes: 104, comments: 12, cover: "purple", category: "Operations" },
  { id: "nov25", title: "Stronger Together, Always",          month: "NOV",  year: "2025", date: "4 Nov 2025", readMin: 5, excerpt: "Stories of collaboration that defined the autumn season.", likes: 96,  comments: 10, cover: "deep-purple", category: "Community" },
];

export const COVER_BG: Record<Edition["cover"], string> = {
  "purple":       "from-[oklch(0.48_0.18_295)] via-[oklch(0.42_0.18_295)] to-[oklch(0.32_0.16_295)]",
  "deep-purple":  "from-[oklch(0.38_0.18_295)] via-[oklch(0.30_0.16_295)] to-[oklch(0.22_0.13_295)]",
  "green":        "from-[oklch(0.62_0.16_148)] via-[oklch(0.50_0.16_148)] to-[oklch(0.36_0.13_148)]",
  "deep-green":   "from-[oklch(0.42_0.14_148)] via-[oklch(0.32_0.12_148)] to-[oklch(0.22_0.09_148)]",
  "lavender":     "from-[oklch(0.78_0.07_305)] via-[oklch(0.62_0.10_300)] to-[oklch(0.42_0.16_295)]",
  "green-light":  "from-[oklch(0.82_0.14_132)] via-[oklch(0.70_0.16_138)] to-[oklch(0.50_0.16_148)]",
};

export const CATEGORIES: Category[] = [
  "Sustainability", "Innovation", "People & Culture", "Operations", "Community", "Leadership",
];

export const LEADERSHIP_QUOTE = {
  text: "At Resolven, we don't just meet today's energy needs — we build solutions that empower tomorrow.",
  author: "Vikram Mehta",
  role: "CEO, Resolven",
  initials: "VM",
};

export const IMPACT_STATS = [
  { v: "12.8M",  l: "kWh Renewable" },
  { v: "8,452",  l: "tCO₂ Avoided" },
  { v: "2.3M",   l: "Litres Saved" },
  { v: "1,200+", l: "Communities" },
];

/* ---------- Engagement widgets (right rail) ---------- */

export const EMPLOYEE_SHOUTOUT = {
  name: "Rahul Sharma",
  role: "Project Manager",
  initials: "RS",
  badge: "Project Hero · Q2",
  message: "Amazing leadership and dedication during the WindPeak project! Truly inspiring the team every day.",
};

export const QUICK_POLL = {
  question: "Which initiative should we prioritise next?",
  options: [
    { id: "solar",  label: "Expanding Solar Projects" },
    { id: "wind",   label: "Investing in Wind Energy" },
    { id: "store",  label: "Energy Storage Solutions" },
    { id: "ev",     label: "EV Charging Infrastructure" },
  ],
  totalVotes: 245,
};

export const MINI_QUIZ = {
  question: "Which of the following is NOT a renewable energy source?",
  options: [
    { id: "solar", label: "Solar Energy",  correct: false },
    { id: "wind",  label: "Wind Energy",   correct: false },
    { id: "gas",   label: "Natural Gas",   correct: true  },
    { id: "hydro", label: "Hydropower",    correct: false },
  ],
  participants: 120,
};

export type EventStatus = "upcoming" | "ongoing" | "completed";
export const EVENTS: { id: string; title: string; date: string; time: string; tone: "purple" | "green" | "lavender"; status: EventStatus }[] = [
  { id: "townhall", title: "Townhall Meeting",      date: "24 Jul", time: "11:00 AM", tone: "purple",   status: "upcoming" },
  { id: "weday",    title: "World Environment Day", date: "5 Jul",  time: "09:00 AM", tone: "green",    status: "ongoing"  },
  { id: "hack",     title: "Hackathon 2024",        date: "15 Jul", time: "09:00 AM", tone: "lavender", status: "upcoming" },
  { id: "safety",   title: "Safety Week Wrap-Up",   date: "18 Jun", time: "—",        tone: "purple",   status: "completed" },
  { id: "esg",      title: "ESG Town Hall",         date: "12 Jun", time: "—",        tone: "green",    status: "completed" },
];
// Back-compat
export const UPCOMING_EVENTS = EVENTS.filter((e) => e.status === "upcoming").map(({ status: _s, ...e }) => e);

export type IdeaStatus = "New" | "In Review" | "Adopted";
export const LATEST_IDEA = {
  title: "Smart Energy Monitoring Dashboards",
  upvotes: 142,
  comments: 12,
  status: "In Review" as IdeaStatus,
};

export type CreatorKind = "photo" | "writing" | "sketch" | "video" | "poetry" | "article";
export const CREATOR_PREVIEWS: { id: string; kind: CreatorKind; title: string; author: string; cover: Edition["cover"] }[] = [
  { id: "c1", kind: "photo",   title: "Dawn at WindPeak",      author: "Anika R.",   cover: "deep-purple" },
  { id: "c2", kind: "sketch",  title: "Turbine Studies",       author: "Manav K.",   cover: "lavender"    },
  { id: "c3", kind: "poetry",  title: "Of Light & Wind",       author: "Priya S.",   cover: "deep-green"  },
  { id: "c4", kind: "video",   title: "A Day on Site",         author: "Field Team", cover: "green"       },
  { id: "c5", kind: "article", title: "Why Storage Matters",   author: "Vikram M.",  cover: "purple"      },
  { id: "c6", kind: "photo",   title: "Solar Sunrise",         author: "Rhea T.",    cover: "green-light" },
];

export const TODAY_AT_RESOLVEN = [
  { v: "18", l: "new updates" },
  { v: "5",  l: "polls" },
  { v: "3",  l: "quizzes" },
  { v: "4",  l: "new ideas" },
  { v: "2",  l: "events today" },
];

