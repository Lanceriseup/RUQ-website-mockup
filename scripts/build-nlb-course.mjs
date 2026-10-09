// Builds /nlb-course-options.html — four layouts for the No Longer Bound
// feature on the Courses page, all logo-only and animated like the homepage
// banner — plus one frame per layout: /nlbc-<layout>.html.
//
// Each frame is the real courses page with <main> re-rendered for that
// layout (luminous.mjs coursesWith). Must run after scripts/build.mjs and
// scripts/build-explore.mjs (which publishes /xp-luminous.css).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { coursesWith, NLB_LAYOUTS } from '../src/partials/explore/luminous.mjs';
import { renderExplore } from '../src/partials/explore/render.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const vids = read('src/data/videos.json');
const dist = path.join(ROOT, 'dist');
const base = fs.readFileSync(path.join(dist, 'courses.html'), 'utf8');

const mainRe = /<main id="main">[\s\S]*?<\/main>/;
if (!mainRe.test(base)) throw new Error('build-nlb-course: main not found in dist/courses.html');

// Variants of layout B ("side by side", chosen 2026-10-04), all in No Longer
// Bound's gold, with "Open course website" and no "Explore the current" line.
const OPTIONS = {
  orbit: {
    label: 'B1 — Orbit',
    note: 'The logo on a cream-and-gold disc, circled by two slowly turning gold orbits, each carrying a small glowing bead. The gold ring draws itself round, the chains slide apart, the fragments scatter and “Find Freedom” writes itself in; at rest the freed chains drift and the glow breathes. Calm and classic — the version you picked, now in gold.',
  },
  rays: {
    label: 'B2 — Sunburst',
    note: 'Fine gold rays bloom out from behind the disc and turn very slowly, like light breaking through. The chains spring apart with a little bounce, and every few seconds a shimmer of light sweeps across the gold ring itself. The most radiant.',
  },
  dust: {
    label: 'B3 — Gold dust',
    note: 'The chains burst apart with more snap and the fragments fly further; gold dust rises continuously around the logo and small four-point sparkles twinkle at its edges. The most alive and celebratory.',
    pick: true,
  },
  arch: {
    label: 'B4 — Arch',
    note: 'The logo set in a tall cream arch, like a cameo or a window. A fine double gold keyline draws itself around the arch first, then the ring draws and the chains break out past its sides; at rest a soft band of light sweeps down the arch. The most elegant and composed.',
  },
};

for (const k of NLB_LAYOUTS) {
  const mod = { courses: (s, cc) => coursesWith(s, cc, k) };
  fs.writeFileSync(path.join(dist, `nlbc-${k}.html`), base
    .replace(mainRe, `<main id="main">${renderExplore(mod, 'luminous', site, c, vids, 'courses')}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Courses — ${esc(OPTIONS[k].label)} — ${esc(site.brand.name)}</title>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/nlbc-${k}.html#xl-nlb-h" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe src="/nlbc-${k}.html" data-scroll="xl-nlb-h" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="900"></iframe></div><figcaption>Desktop · 1440 wide · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/nlbc-${k}.html" data-scroll="xl-nlb-h" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'nlb-course-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Courses — No Longer Bound options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:860px; margin:10px 0 0; }
.opt { margin-top:56px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:860px; font-size:15px; }
.links { margin:10px 0 0; font:700 13px Montserrat, sans-serif; } .links a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
.pair { display:grid; gap:24px; margin-top:14px; }
@media (min-width:1100px) { .pair { grid-template-columns:1fr 280px; align-items:start; } }
figure { margin:0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
.pf { max-width:280px; }
.screen { position:relative; overflow:hidden; border-radius:14px; background:#fff; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen.phone { border-radius:22px; box-shadow:0 0 0 7px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Courses — No Longer Bound, option B variants</h1>
  <p class="lead">Four takes on option B (logo left, copy right), each with its own setting and animation. All are in No
     Longer Bound's gold — no pink — with the button reading “Open course website” and the “Explore the current…” line
     removed. Each preview opens scrolled to the section; the animation plays as it comes into view, so use “Open full
     page” to watch it from the start.</p>
  ${NLB_LAYOUTS.map(k => card(k, OPTIONS[k])).join('')}
</div>
<script>
(function () {
  var screens = [].slice.call(document.querySelectorAll('.screen'));
  function fit() {
    screens.forEach(function (s) {
      var w = +s.dataset.w, h = +s.dataset.h, k = s.clientWidth / w;
      s.style.height = Math.round(h * k) + 'px';
      s.querySelector('iframe').style.transform = 'scale(' + k + ')';
    });
  }
  // Open each preview at the section, a little above it, so the logo
  // animates in view rather than off-screen.
  document.querySelectorAll('iframe[data-scroll]').forEach(function (f) {
    f.addEventListener('load', function () {
      try {
        var d = f.contentWindow, el = d.document.getElementById(f.dataset.scroll);
        if (el) d.scrollTo(0, el.closest('section').getBoundingClientRect().top + d.scrollY - 40);
      } catch (e) {}
    });
  });
  addEventListener('resize', fit); fit();
})();
</script>
</body></html>`);
console.log('built dist/nlb-course-options.html + ' + NLB_LAYOUTS.length + ' frames');
