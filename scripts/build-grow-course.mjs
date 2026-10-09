// Builds /grow-options.html — design options for the "More ways to grow"
// section of the Courses page — plus one frame per option: /growc-<key>.html.
//
// Each option is its own module, src/partials/explore/grow/<key>.mjs, exporting
// grow(g) => section HTML (g = content.json explore.courses.grow), with its
// own stylesheet src/styles/explore/grow-<key>.css, published as
// /xp-grow-<key>.css (build.mjs copies it too). Each frame is the real Courses
// page with that section swapped in.
//
//   --only <key>   rebuild just that option's frame and stylesheet. Modules
//                  are imported one at a time, so a broken one only fails
//                  its own frame.
//
// Must run after scripts/build.mjs and scripts/build-explore.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { coursesWith } from '../src/partials/explore/luminous.mjs';
import { renderExplore } from '../src/partials/explore/render.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const vids = read('src/data/videos.json');
const dist = path.join(ROOT, 'dist');
const base = fs.readFileSync(path.join(dist, 'courses.html'), 'utf8');

const mainRe = /<main id="main">[\s\S]*?<\/main>/;
if (!mainRe.test(base)) throw new Error('build-grow-course: main not found in dist/courses.html');

const OPTIONS = {
  panels: {
    label: 'G1 — Expanding panels',
    note: 'Four tall photo panels side by side. The one you point at (or tab to) opens wide and reveals its title, line and arrow; the others fold down to slim panels with their titles running vertically. On a phone they stack as full-width photo cards.',
  },
  bento: {
    label: 'G2 — Bento spotlight',
    note: 'An asymmetric mosaic of photo tiles in different sizes. A soft light follows the cursor across the tiles and each one tilts gently towards it in 3D, with glass labels over the photographs.',
  },
  glide: {
    label: 'G3 — Horizontal glide',
    note: 'The section holds in place while four large cards glide sideways as you scroll down the page, a progress line filling beneath them. On a phone the cards become a swipeable row that snaps card by card.',
  },
  index: {
    label: 'G4 — Editorial index',
    note: 'A large typographic contents list — numbered rows with oversized titles and fine rules. Pointing at a row brings its photograph up beside the cursor, floating and following it, while the row’s title slides and underlines. On a phone each row carries its photo as a thumbnail.',
  },
};

const argOnly = process.argv.indexOf('--only');
const only = argOnly > -1 ? process.argv[argOnly + 1] : null;
if (only && !OPTIONS[only]) throw new Error(`build-grow-course: unknown option "${only}"`);

let failed = 0;
for (const k of Object.keys(OPTIONS)) {
  if (only && k !== only) continue;
  const css = path.join(ROOT, `src/styles/explore/grow-${k}.css`);
  if (fs.existsSync(css)) fs.copyFileSync(css, path.join(dist, `xp-grow-${k}.css`));
  let html;
  try {
    const mod = await import(`../src/partials/explore/grow/${k}.mjs?v=${Date.now()}`);
    const page = { courses: (s, cc) => coursesWith(s, cc, undefined, mod.grow) };
    html = renderExplore(page, 'luminous', site, c, vids, 'courses');
  } catch (e) { failed++; console.error(`build-grow-course: ${k} failed —`, e.stack); continue; }
  fs.writeFileSync(path.join(dist, `growc-${k}.html`), base
    .replace(mainRe, `<main id="main">${html}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Courses — ${esc(OPTIONS[k].label)} — ${esc(site.brand.name)}</title>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/growc-${k}.html#xl-grow-h" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="960"><iframe src="/growc-${k}.html" data-scroll="xl-grow-h" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="960"></iframe></div><figcaption>Desktop · 1440 wide · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/growc-${k}.html" data-scroll="xl-grow-h" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'grow-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Courses — More ways to grow options — ${esc(site.brand.name)}</title>
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
  <h1>Courses — “More ways to grow” options</h1>
  <p class="lead">Four premium designs for the section under No Longer Bound, each linking to Masterclasses, Events, 1:1 Coaching
     and the Free resource. Copy is unchanged. Each preview opens scrolled to the section — they are interactive, so point,
     scroll and swipe inside them, or use “Open full page” to see one at full size.</p>
  ${Object.entries(OPTIONS).map(([k, o]) => card(k, o)).join('')}
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
  document.querySelectorAll('iframe[data-scroll]').forEach(function (f) {
    f.addEventListener('load', function () {
      try {
        var d = f.contentWindow, el = d.document.getElementById(f.dataset.scroll);
        if (el) d.scrollTo(0, el.getBoundingClientRect().top + d.scrollY - 60);
      } catch (e) {}
    });
  });
  addEventListener('resize', fit); fit();
})();
</script>
</body></html>`);
console.log(`built dist/grow-options.html + frames for ${only || 'all options'}${failed ? ` — ${failed} FAILED` : ''}`);
if (failed) process.exitCode = 1;
