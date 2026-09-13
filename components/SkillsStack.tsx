"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Layout, Server, Database, Wrench, Palette, CheckCircle2, Code2 } from "lucide-react";

type Skill = { name: string; level: number; badge: string };
type SkillCategory = { title: string; icon: typeof Layout; skills: Skill[] };

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Frontend Development",
    icon: Layout,
    skills: [
      { name: "React", level: 92, badge: "Advanced" },
      { name: "Next.js", level: 90, badge: "Advanced" },
      { name: "TypeScript", level: 85, badge: "Proficient" },
      { name: "Tailwind CSS", level: 95, badge: "Expert" },
      { name: "JavaScript (ES6+)", level: 90, badge: "Advanced" },
      { name: "React Native", level: 75, badge: "Intermediate" },
    ],
  },
  {
    title: "Backend & APIs",
    icon: Server,
    skills: [
      { name: "Node.js", level: 82, badge: "Proficient" },
      { name: "Firebase (Auth, Functions)", level: 88, badge: "Advanced" },
      { name: "REST APIs", level: 85, badge: "Proficient" },
      { name: "GraphQL", level: 65, badge: "Intermediate" },
    ],
  },
  {
    title: "Databases & Storage",
    icon: Database,
    skills: [
      { name: "Firestore", level: 88, badge: "Advanced" },
      { name: "PostgreSQL", level: 78, badge: "Proficient" },
      { name: "Supabase", level: 72, badge: "Intermediate" },
      { name: "MongoDB", level: 68, badge: "Intermediate" },
      { name: "Prisma", level: 65, badge: "Intermediate" },
    ],
  },
  {
    title: "Tools & Workflow",
    icon: Wrench,
    skills: [
      { name: "Git & GitHub", level: 88, badge: "Advanced" },
      { name: "Vercel", level: 90, badge: "Advanced" },
      { name: "Docker", level: 60, badge: "Intermediate" },
      { name: "Jest & Cypress", level: 60, badge: "Intermediate" },
    ],
  },
  {
    title: "Design & Creative",
    icon: Palette,
    skills: [
      { name: "Figma", level: 80, badge: "Proficient" },
      { name: "Adobe XD", level: 70, badge: "Intermediate" },
      { name: "Photoshop", level: 75, badge: "Proficient" },
      { name: "Illustrator", level: 65, badge: "Intermediate" },
      { name: "Premiere Pro & After Effects", level: 70, badge: "Intermediate" },
    ],
  },
];

export function SkillsStack() {
  const [selected, setSelected] = useState<string>("All");
  const categories = ["All", ...SKILL_CATEGORIES.map((c) => c.title)];
  const filtered = selected === "All" ? SKILL_CATEGORIES : SKILL_CATEGORIES.filter((c) => c.title === selected);

  return (
    <section className="mx-auto mt-16 max-w-6xl px-6">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <div className="chip mx-auto mb-3">
          <Code2 className="size-3.5" /> Technical Expertise
        </div>
        <h2 className="text-2xl font-bold md:text-3xl">
          Skills &amp; <span className="text-gradient">Tech Stack</span>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Core technologies and tools I use to craft full-stack web products and creative work.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              selected === cat
                ? "btn-glow"
                : "border border-white/10 bg-white/5 text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((category, idx) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="glass-card p-6"
            >
              <div className="mb-5 flex items-center gap-3 border-b border-white/5 pb-4">
                <span className="icon-tile">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold">{category.title}</h3>
                  <p className="text-xs text-muted-foreground">{category.skills.length} Key Competencies</p>
                </div>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-foreground/90">
                        <CheckCircle2 className="size-3.5 text-primary" />
                        {skill.name}
                      </span>
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        {skill.badge}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.15 }}
                        className="h-full rounded-full"
                        style={{ background: "var(--gradient-brand)", boxShadow: "0 0 10px var(--neon)" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
