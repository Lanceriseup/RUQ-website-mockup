// Builds /announce-light-options.html — ways to give the live banner (T5,
// brushed teal metal) contrast on the light pages, where it sat on the teal
// sky as one band (reported 2026-10-30).
//
// Each option is an .ann-lc-<key> class in src/styles/announce.css, added to
// the banner in built light pages as /annl-<key>-team.html and
// /annl-<key>-courses.html, so the live site is untouched until one is
// chosen. The homepage and About keep the banner as it is.
//
// Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
fs.copyFileSync(path.join(ROOT, 'src/styles/announce.css'), path.join(dist, 'announce.css'));

const OPTIONS = {
  current: {
    label: 'Before',
    note: 'For comparison: the banner as it is, teal metal on the teal sky.',
  },
  lift: {
    label: 'L1 — Lifted',
    note: 'The banner exactly as it is, casting a soft shadow onto the page with a fine dark edge underneath, so it reads as a layer above the sky. The smallest change.',
    pick: true,
  },
  deep: {
    label: 'L2 — Deep teal',
    note: 'The same brushed metal, three steps darker, with the bright highlights kept at the ends. Clearly darker than the sky behind it while staying the same banner.',
  },
  night: {
    label: 'L3 — Midnight metal',
    note: 'Gunmetal teal, almost black, lit only at the ends, with a bright teal hairline underneath. The strongest contrast of the metal options, and the white button stands out most.',
  },
  edge: {
    label: 'L4 — Brand edge',
    note: 'The banner unchanged, with the brand’s pink-to-teal stripe along its foot and a soft shadow. The pink is the one colour the sky does not have, so the line separates them.',
  },
  white: {
    label: 'L5 — White',
    note: 'Inverted: a clean white bar with “Freedom” in teal script, the date in ink and a teal-metal button that turns pink on hover. Crisp against the sky, and calm on a light page.',
  },
};

const BAR = 'class="ann ann-s ann-photo ann-t-metal"';
const PAGES = [['team', 'Team'], ['courses', 'Courses']];
for (const [src] of PAGES) {
  // L1 is live, so strip its class from the built page before each option adds its own.
  const base = fs.readFileSync(path.join(dist, `${src}.html`), 'utf8').replace('class="ann ann-on-light ', 'class="ann ');
  if (!base.includes(BAR)) throw new Error(`build-announce-light-options: T5 banner not found in dist/${src}.html`);
  for (const [k, o] of Object.entries(OPTIONS)) {
    fs.writeFileSync(path.join(dist, `annl-${k}-${src}.html`), base
      .replace(BAR, k === 'current' ? BAR : `class="ann ann-s ann-photo ann-t-metal ann-lc-${k}"`)
      .replace(/<title>[\s\S]*?<\/title>/, `<title>Banner on light pages — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
  }
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Chosen' : k === 'current' ? 'Before' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links">${PAGES.map(([p, n]) => `<a href="/annl-${k}-${p}.html" target="_blank" rel="noopener">Open on the ${n} page ↗</a>`).join('\n     ')}</p>
  <div class="pair">
    <div class="stack">${PAGES.map(([p, n]) => `
      <figure><div class="screen" data-w="1440" data-h="300"><iframe src="/annl-${k}-${p}.html" title="${esc(o.label)} — ${n}" loading="lazy" width="1440" height="300"></iframe></div><figcaption>Desktop · ${n}</figcaption></figure>`).join('')}
    </div>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="420"><iframe src="/annl-${k}-team.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="420"></iframe></div><figcaption>Phone · Team</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'announce-light-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Banner on light pages — options — ${esc(site.brand.name)}</title>
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
.links { margin:10px 0 0; font:700 13px Montserrat, sans-serif; display:flex; flex-wrap:wrap; gap:6px 20px; } .links a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
.pair { display:grid; gap:24px; margin-top:14px; }
.stack { display:grid; gap:20px; min-width:0; }
@media (min-width:1100px) { .pair { grid-template-columns:1fr 260px; align-items:start; } }
figure { margin:0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
.pf { max-width:260px; }
.screen { position:relative; overflow:hidden; border-radius:14px; background:#fff; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen.phone { border-radius:22px; box-shadow:0 0 0 7px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Freedom banner — contrast on light pages</h1>
  <p class="lead">On the Team, Courses, Contact and Register pages the teal banner sits on a teal sky and the two
     run together. Each option below changes the banner on those light pages only; the homepage and About, where it
     sits on a dark hero, keep it exactly as it is. Wording and layout do not change. Previews are the real pages.
     L1 is live.</p>
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
  addEventListener('resize', fit); fit();
})();
</script>
</body></html>`);
console.log('built dist/announce-light-options.html + frames for all options');
