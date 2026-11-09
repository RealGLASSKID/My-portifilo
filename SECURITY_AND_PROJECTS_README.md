# Glasskid Portfolio — Security + Projects Update

## What changed

### Security (A + C)
- `lib/require-admin.ts` — verifies Firebase ID tokens + optional `ADMIN_EMAILS`
- `lib/get-admin-token.ts` — client helper
- All mutating admin server actions require a valid token
- `/api/admin/upload` requires `Authorization: Bearer <token>`
- Projects admin client + messages client pass tokens

**You must:**
1. Rotate Firebase service account key + Cloudinary API secret (old ones were exposed)
2. Set `ADMIN_EMAILS=your@email.com` in Vercel env
3. Update `FIREBASE_*` and `CLOUDINARY_*` env vars
4. Redeploy

### Projects (B + images)
- Seed data includes: JB-01, Blaze Hair Magic, Grocify, Sunchop, Unik Trends, Cherry Noble School, Di-Chies, Gangster Group Bot
- Images live under `public/images/projects/` (clean filenames without spaces)
- Cards use `ProjectImageCarousel` — auto-rotates every **3 seconds** when 2+ images
- Bigger cards (16/9, 2-column on projects page)
- Homepage featured section uses the same carousel
- Admin form still has **gallery** (one path/URL per line) for extra screenshots
- Cover = `imageUrl`, extras = `gallery[]`
- Live URL / GitHub URL left empty for you to fill in admin

### After deploy
1. Log into `/admin`
2. Go to Projects → if empty, click **Seed default projects**
3. Edit each project to add Live / GitHub links
4. Optionally add more image paths in the gallery field

### Remaining client work
Blog / music / gallery / services admin clients still need `getAdminIdToken()` passed the same way as projects (mutations already protected server-side).
