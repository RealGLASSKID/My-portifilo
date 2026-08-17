# THEREALGLASSKID Nexus — Portfolio Website

A modern dark glassmorphism portfolio built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS**.

Inspired by [glasskid-nexus-glow.lovable.app](https://glasskid-nexus-glow.lovable.app/).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, projects, services, skills, music |
| `/blog` | Blog listing |
| `/blog/[slug]` | Individual blog posts (6 posts) |
| `/products` | Digital products store |
| `/contact` | Contact form |
| `/testify` | Testimonials form + recent words |
| `/links` | Full site index + social links |
| `/terms` | Terms & Conditions |
| `/bucket-list` | Personal goals tracker |
| `/streaks` | Habit streaks tracker |
| `/admin` | Password-protected admin dashboard |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features added

- **Blog post pages** — full content for all 6 posts at `/blog/[slug]`
- **Contact form** — `/contact` with name, email, subject, message (simulated submit)
- **Admin auth** — password gate on `/admin` (demo password: `glasskid`). Uses sessionStorage. Change `ADMIN_PASSWORD` in `app/admin/page.tsx` before deploying.
- **Social links** — GitHub, X, Instagram, Spotify placeholders on `/links` (update URLs to your real profiles)

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Lucide React
- Geist font

## Design

- Dark theme (`#050505`)
- Glassmorphism cards
- Soft violet / purple accent glows
- Responsive layout

## Notes

- Contact form is client-side only (shows success state). Wire to Formspree, Resend, or your API for real delivery.
- Admin is a static preview with simple password auth — not production-grade.
- Social URLs are placeholders (`github.com/glasskid`, etc.) — replace with your real accounts.

## Author

**therealglasskid** (Prince Dennis)  
Full Stack Developer • Artist • Songwriter — Lagos, Nigeria
