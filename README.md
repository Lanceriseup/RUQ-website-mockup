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
| 127 MB `.mov` hero video, index at end of file so it barely plays | 11 MB MP4, faststart, audio stripped |
| Every Montserrat/Lato weight + 15 subsets (Arabic, Hebrew, Korean, Thai…) on an English site | Four weights, Latin only |
| 441–998 KB per page | 8–17 KB per page |
| 15 video iframes loading on page load | Click-to-load facades; no third-party cookies until play |

Accessibility basics are built in: skip link, focus-visible rings, `aria-current`, labelled form fields, `prefers-reduced-motion`.

## Assets

Everything is local. The build makes no request to riseupqueens.com.

```
src/assets/brand/    logos, favicons (4 sizes), pattern, JL signature
src/assets/team/     12 headshots, full resolution
src/assets/photos/   hero and gallery photography
src/assets/video/    hero-broll.mp4 (11 MB) + poster
```

`npm run fetch:assets` re-downloads them all from the live site; add `--force` to overwrite.

One thing worth knowing about the headshots. On the live site they exist **only** as
Brizy-generated crops — `Becky-1-scaled-186x279x24x2x142x213x1759426141.jpg`, six sizes
each, all derivatives. The originals were found by probing the uploads folders, so what
is stored here is full-resolution source: Jessica Lewis at 1707×2560, not a 186px crop.
Four of them (Becky, Jessica L, Maurie, Natasha) live in folders no live page links to,
so they are recoverable today but easy to lose.

## Before launch

1. **Confirm the event dates.** `site.json` says Oct 15–17 2026 in Dallas; the live site contradicts itself. Jayden should confirm.
2. **Optimise the images.** They are local now but unprocessed — several PNGs run 1–2 MB where a WebP would be a fraction of that. Worth a pass before launch.
3. **Hero video is done.** The live 127 MB `.mov` is re-encoded to `src/assets/video/hero-broll.mp4` — 11.0 MB, H.264, no audio, faststart. It autoplays muted and looping behind the hero, and is skipped entirely for `prefers-reduced-motion` and Save-Data users, who get the poster frame. Re-encode command is in `site.json` under `assets.heroVideo._encode`.
4. **Vimeo videos are unlisted, not private.** Their `h=` tokens are preserved in `videos.json` and wired through the player. If a token is ever rotated in Vimeo, the embed 403s — update it there.
5. **Wire the forms.** Contact and the three masterclass waitlists are inert. Jayden reported the Jotform links stopped working; the plan was MOS forms → Ontraport.
6. **Fill the gaps.** Ten team bios are empty and `/free-resource` has no resource attached on the live site either.
7. **Replace placeholder copy.** All copy is the client's own, but FAQ answers were written for this mockup and need approval.

`dist/build-report.json` lists these warnings after every build.

## Notes

Pages carry `noindex, nofollow`. Remove that in `scripts/build.mjs` when this becomes real.
