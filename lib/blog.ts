export type BlogPost = {
  slug: string;
  category: string;
  date: string;
  read: string;
  title: string;
  excerpt: string;
  content: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "building-scalable-react-apps-in-2026",
    category: "Engineering",
    date: "Jul 12, 2026",
    read: "6 min",
    title: "Building scalable React apps in 2026",
    excerpt:
      "Patterns that still matter when your app grows past a few routes and a handful of components.",
    content: [
      "Scaling a React app in 2026 is less about new libraries and more about disciplined architecture. The tools have matured — Next.js App Router, TanStack Query, server components — but the failure modes are the same: prop drilling, unbounded client state, and components that know too much.",
      "Start with clear boundaries. Server Components should own data fetching where possible. Client Components should be thin and focused on interactivity. When you need shared client state, reach for Zustand or Jotai before reaching for a heavy context tree.",
      "Code-splitting is free with the App Router if you keep route segments lean. Avoid importing large client-only libraries into shared layouts. Lazy-load charts, editors, and maps.",
      "Testing still matters. Co-locate unit tests with components and use Playwright for the critical paths. A scalable app is one you can change without fear.",
      "Finally: measure. Bundle analysis, Core Web Vitals, and real-user monitoring tell you where the pain actually is. Guessing is expensive.",
    ],
  },
  {
    slug: "how-i-design-in-the-dark-my-aesthetic-system",
    category: "Design",
    date: "Jun 28, 2026",
    read: "4 min",
    title: "How I design in the dark: my aesthetic system",
    excerpt:
      "A personal system for dark UIs that feel premium without becoming muddy or low-contrast.",
    content: [
      "Dark mode is not inverted light mode. Backgrounds need hierarchy: pure black for the deepest layer, then raised surfaces at #0c0c0c and #111. Glass panels sit on top with backdrop-blur and a hairline border at white/8%.",
      "Accent color is used sparingly. I pick one (usually a soft violet) and reserve it for focus states, primary buttons, and section labels. Everything else stays neutral so the accent actually means something.",
      "Typography does the heavy lifting. Clear weight contrast — 400 for body, 600 for headings — and generous line-height keep long text readable on dark backgrounds.",
      "Motion is quiet. Hover states lift opacity and border brightness slightly. No bouncing, no spinning logos. The interface should feel calm and intentional.",
    ],
  },
  {
    slug: "from-code-to-melody-my-creative-workflow",
    category: "Creative",
    date: "Jun 10, 2026",
    read: "5 min",
    title: "From code to melody — my creative workflow",
    excerpt:
      "How I move between shipping software and writing songs without losing momentum in either world.",
    content: [
      "I treat both disciplines as practice. Code has commits; music has sessions. The goal is the same: show up daily and leave something slightly better than yesterday.",
      "When I’m blocked on a feature, I open the DAW. When a melody stalls, I open the editor. Switching context clears the loop without abandoning the work.",
      "I keep a single notes app for both — feature ideas, lyric fragments, production tricks. Cross-pollination happens naturally when everything lives in one place.",
      "Deadlines help. Shipping a client site and finishing a track both benefit from a fixed end date. Perfection is the enemy of both.",
    ],
  },
  {
    slug: "firebase-or-postgres-a-pragmatic-guide",
    category: "Backend",
    date: "May 30, 2026",
    read: "8 min",
    title: "Firebase or Postgres? A pragmatic guide",
    excerpt:
      "When to reach for a managed backend-as-a-service and when a real database will save you later.",
    content: [
      "Firebase (and similar BaaS tools) win on speed to first version. Auth, realtime, storage, and hosting in one console is hard to beat for MVPs and internal tools.",
      "Postgres wins on relationships, reporting, and long-term flexibility. Complex queries, joins, and analytics are first-class. You also avoid vendor lock-in on data shape.",
      "My rule of thumb: if the data model is mostly documents and you need realtime presence or chat, start with Firebase. If you already know you’ll need multi-table reports, roles, or heavy filtering, start with Postgres (Supabase or Neon make this almost as fast).",
      "You can always migrate later — but migrations hurt more the longer you wait. Sketch the entities you’ll need in year two before you commit.",
    ],
  },
  {
    slug: "shipping-premium-ui-without-a-design-team",
    category: "Design",
    date: "May 15, 2026",
    read: "5 min",
    title: "Shipping premium UI without a design team",
    excerpt:
      "Practical constraints and reusable patterns that make solo-built interfaces feel intentional.",
    content: [
      "Constraint is your friend. Pick a small type scale, two font weights, one accent, and a consistent radius. Repeat them everywhere.",
      "Spacing matters more than decoration. An 8-point grid and consistent section padding do more for perceived quality than extra gradients.",
      "Steal structure, not pixels. Study products you admire and reverse-engineer their hierarchy — what is primary, secondary, tertiary on each screen.",
      "Ship, then polish. A clean layout with mediocre icons beats a half-finished masterpiece. Iterate after real users touch it.",
    ],
  },
  {
    slug: "why-i-still-believe-in-personal-websites",
    category: "Essays",
    date: "Apr 22, 2026",
    read: "3 min",
    title: "Why I still believe in personal websites",
    excerpt:
      "In an age of feeds and platforms, owning a small corner of the internet still matters.",
    content: [
      "A personal site is the one place algorithms don’t rearrange. You decide the order, the tone, and the archive.",
      "It compounds. Old posts keep working for you. A portfolio link on a job application or a client pitch points somewhere that looks like you, not a template profile.",
      "It’s also a forcing function. Writing publicly improves how you think. Building your own site keeps your skills sharp.",
      "You don’t need a newsletter empire. One honest page that says who you are and what you make is enough to start.",
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug);
}
