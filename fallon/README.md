# Fallon Automotive — flagship redesign

A complete website concept for pitching a rebuild of fallonautomotive.com.
The cinematic flagship site is the root; a cleaner/simpler alternate concept
and a sales pitch page ride along. Everything is static — no framework, no
build tooling required.

```
fallon/
├── index.html      ← THE site: flagship one-page experience (dark, cinematic)
├── css/ js/ fonts/ ← flagship assets
├── premium/        ← alternate concept: clean 5-page site (light, navy/red)
├── pitch/          ← sales demo page: current site vs the two concepts
├── images.json     ← manifest of the AI-generated photography
└── build.sh        ← downloads photography into the site at deploy time
```

## Deploying to Cloudflare Pages (free)

1. Log in at https://dash.cloudflare.com → **Workers & Pages → Create → Pages
   → Connect to Git** and pick this repository.
2. Settings:
   - **Production branch**: `claude/fallon-automotive-redesign-v8qndq` (or `main` after merging)
   - **Root directory**: `fallon`
   - **Build command**: `bash build.sh`
   - **Build output directory**: `.` (a single dot)
3. Deploy. You get:
   - `https://<project>.pages.dev/` — the flagship site
   - `https://<project>.pages.dev/premium/` — alternate concept
   - `https://<project>.pages.dev/pitch/` — sales comparison page

## Images

Photography is AI-generated (Higgsfield) placeholder art. HTML references
local `img/*.webp`; when a file is missing the site's JS falls back to the
original CDN URL, and `build.sh` localizes everything at deploy. **Before
selling/launching: replace with real photos of the actual shop** — drop files
with the same names into `img/` and `premium/img/`.

## Before go-live checklist

- [ ] Verify phones, addresses, hours with the shop (pulled from public listings)
- [ ] Replace placeholder review quotes with real Google reviews (get permission)
- [ ] Replace AI photography with real shop photos
- [ ] Point the booking forms at a real destination: swap the `mailto:` in
      `js/main.js` (and `premium/js/main.js`) for the shop's email, or wire a
      form service (e.g. Formspree/Basin — 5 minutes) or their shop system
- [ ] Set the real domain + update `og:` URLs and JSON-LD `url` fields
