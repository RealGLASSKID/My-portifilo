ADMIN DASHBOARD UPGRADE — where each file goes
================================================

Unzip this and copy every file into the SAME path inside your repo
(My-portifilo/), overwriting where a file already exists.

NEW files (admin section):
  app/admin/layout.tsx                        (new)
  app/admin/page.tsx                          (overwrite)
  app/admin/_components/AdminSidebar.tsx      (new)
  app/admin/_components/AdminTopbar.tsx       (new)
  app/admin/_components/AdminPageHeader.tsx   (new)
  app/admin/projects/page.tsx                 (new)
  app/admin/blog/page.tsx                     (new)
  app/admin/music/page.tsx                    (new)
  app/admin/bucket-list/page.tsx              (new)
  app/admin/streaks/page.tsx                  (new)
  app/admin/links/page.tsx                    (new)
  app/admin/messages/page.tsx                 (new)
  app/admin/settings/page.tsx                 (new)

CHANGED files (needed so the admin section gets its own layout,
without the public site's header/footer on top of it):
  app/layout.tsx           (overwrite — swaps <main> for <MainWrap>)
  components/MainWrap.tsx  (new — removes public page padding on /admin)
  components/Header.tsx    (overwrite — hides itself on /admin routes)
  components/Footer.tsx    (overwrite — hides itself on /admin routes)

After copying, run:
  npm run dev
and visit /admin — you should see the new sidebar and all 9 pages
(Overview, Projects, Blog Posts, Music, Bucket List, Streaks, Links,
Messages, Settings).

Notes
-----
- Nothing on the public site (/, /about, /projects, etc.) changed in
  look or behavior — only /admin got the new shell.
- Data in Projects, Music, Bucket List, Streaks, Messages and Settings
  is still in-memory demo data (same as before), so edits reset on
  page refresh. Blog Posts pulls real data from lib/blog.ts.
- When you're ready to make this a real, persistent admin panel, the
  next step is wiring up a database + auth (e.g. Supabase or
  Firebase) — happy to help with that whenever you want.
