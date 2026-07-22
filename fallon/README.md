# Fallon Automotive — redesign concepts

Two complete website concepts for pitching a rebuild of fallonautomotive.com,
plus a comparison page for the sales meeting. Everything is static — no
framework, no build tooling required.

```
fallon/
├── index.html      ← pitch page: current site vs Premium vs Ultra
├── premium/        ← Concept One: clean 5-page site (light, navy/red)
├── ultra/          ← Concept Two: flagship one-page experience (dark, cinematic)
├── images.json     ← manifest of the AI-generated photography
└── build.sh        ← downloads photography into each site at deploy time
```

## Deploying to Cloudflare Pages (free)

1. Log in at https://dash.cloudflare.com → **Workers & Pages → Create → Pages
   → Connect to Git** and pick this repository.
2. Settings:
   - **Production branch**: `claude/fallon-automotive-redesign-v8qndq` (or `main` after merging)
   - **Root directory**: `fallon`
   - **Build command**: `bash build.sh`
   - **Build output directory**: `.` (a single dot)
3. Deploy. You'll get `https://<project>.pages.dev/` (pitch page),
   `/premium/` and `/ultra/`.

Want two separate clean URLs for the pitch? Create two Pages projects from the
same repo, one with root directory `fallon/premium`, one with `fallon/ultra`
(build command `bash ../build.sh` won't run outside the root — for split
projects just skip the build command; the sites fall back to the image CDN
automatically).

## Images

Photography is AI-generated (Higgsfield) placeholder art. HTML references
local `img/*.webp`; when a file is missing the site's JS falls back to the
original CDN URL, and `build.sh` localizes everything at deploy. **Before
selling/launching: replace with real photos of the actual shop** — drop files
with the same names into `premium/img/` and `ultra/img/`.

## Before go-live checklist

- [ ] Verify phones, addresses, hours with the shop (pulled from public listings)
- [ ] Replace placeholder review quotes with real Google reviews (get permission)
- [ ] Replace AI photography with real shop photos
- [ ] Point the booking forms at a real destination: swap the `mailto:` in
      each site's `js/main.js` for the shop's email, or wire a form service
      (e.g. Formspree/Basin — 5 minutes) or their shop-management system
- [ ] Set the real domain + update `og:` URLs and JSON-LD `url` fields
