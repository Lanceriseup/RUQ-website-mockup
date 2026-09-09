# RUQ Website Mockup

A clean, static base for redesigning [riseupqueens.com](https://riseupqueens.com/). Structure and copy were extracted from the live WordPress/Brizy site on 2026-09-10; the code is a fresh rebuild, not a scrape of Brizy's output.

**This is a starting point to design on top of — not a launch candidate.** See [Before launch](#before-launch).

## Quick start

```bash
npm install
npm run build     # generate dist/
npm run serve     # http://127.0.0.1:8080
```

`npm run dev` rebuilds and watches CSS.

## How it works

Data in, HTML out. There is no CMS and no runtime framework.

```
src/data/site.json      Brand, nav, event dates, assets, funnel URLs
src/data/content.json   Page copy, extracted from the live site
src/data/videos.json    All 23 embeds with IDs, titles, durations
src/partials/           layout.mjs (header/footer), components.mjs
src/pages/pages.mjs     The 9 page definitions
scripts/build.mjs       Renders dist/
```

To change copy, edit `src/data/*.json` — not the HTML. To change layout, edit the partials. Design tokens (colors, fonts) live in `tailwind.config.cjs`, not in markup.

## Pages

`index` · `about` · `events` · `masterclasses` · `coaching` · `team` · `free-resource` · `contact` · `thank-you`

These mirror the live sitemap, with `1-on-1-coaching-2` renamed to `coaching`.

## What was deliberately changed

The live site has problems worth not inheriting:

| Live site | Here |
|---|---|
| Event dates hard-coded in ~30 places, and they **disagree** — Oct 9–11 vs Oct 15–17, Dallas vs Argyle, 2025 vs 2026 | One `nextEvent` block in `site.json` |
| 127 MB `.mov` hero video | Poster image; re-encode before using video |
| Every Montserrat/Lato weight + 15 subsets (Arabic, Hebrew, Korean, Thai…) on an English site | Four weights, Latin only |
| 441–998 KB per page | 8–17 KB per page |
| 15 video iframes loading on page load | Click-to-load facades; no third-party cookies until play |

Accessibility basics are built in: skip link, focus-visible rings, `aria-current`, labelled form fields, `prefers-reduced-motion`.

## Before launch

1. **Confirm the event dates.** `site.json` says Oct 15–17 2026 in Dallas; the live site contradicts itself. Jayden should confirm.
2. **Localise the images.** `site.json` still points at the live WordPress CDN so the mockup renders immediately. Download to `/assets` before launch — otherwise the redesign depends on the site it replaces.
3. **Re-encode the hero video** to MP4/WebM (~2–4 MB) if a moving hero is wanted.
4. **Recover the Vimeo videos.** Four embeds on the live events page are private and could not be carried over. Needs Vimeo account access.
5. **Wire the forms.** Contact and the three masterclass waitlists are inert. Jayden reported the Jotform links stopped working; the plan was MOS forms → Ontraport.
6. **Fill the gaps.** Ten team bios are empty and `/free-resource` has no resource attached on the live site either.
7. **Replace placeholder copy.** All copy is the client's own, but FAQ answers were written for this mockup and need approval.

`dist/build-report.json` lists these warnings after every build.

## Notes

Pages carry `noindex, nofollow`. Remove that in `scripts/build.mjs` when this becomes real.
