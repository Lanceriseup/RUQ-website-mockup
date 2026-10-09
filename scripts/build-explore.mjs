// Builds /explore-options.html — three design directions for the five explore
// pages (Courses, Masterclasses, Events, Coaching, Free resource) — plus one
// frame per direction × page: /xp-<direction>-<page>.html.
//
// Each frame is the real courses page (header in clear mode, footer, scripts)
// with <main> swapped for that direction's page. Must run after
// scripts/build.mjs.
//
//   --only <direction>   rebuild just that direction's frames and stylesheet.
//                        Directions are imported one at a time, so a broken
//                        module only fails its own frames.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { header } from '../src/partials/nav.mjs';
import { renderExplore, EXPLORE_PAGES } from '../src/partials/explore/render.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const vids = read('src/data/videos.json');
const dist = path.join(ROOT, 'dist');
const base = fs.readFileSync(path.join(dist, 'courses.html'), 'utf8');

const headerRe = /<header id="site-nav"[\s\S]*?<\/header>/;
const mainRe = /<main id="main">[\s\S]*?<\/main>/;
const titleRe = /<title>[\s\S]*?<\/title>/;
if (!headerRe.test(base) || !mainRe.test(base)) throw new Error('build-explore: header or main not found in dist/courses.html');

const PAGES = {
  courses: { label: 'Courses', href: '/courses.html' },
  masterclasses: { label: 'Masterclasses', href: '/masterclasses.html' },
  events: { label: 'Events', href: '/events.html' },
  coaching: { label: 'Coaching', href: '/coaching.html' },
  free: { label: 'Free resource', href: '/free-resource.html' },
};

// Which pages the comparison page offers. Courses only for now — the other
// four were supplied as context, and their frames are still built (above) so
// they can be added back here when it is their turn.
const COMPARE = ['courses'];

const OPTIONS = {
  couture: {
    label: 'A — Couture',
    note: 'Editorial magazine on warm ivory paper. “Courses” in the pink brush script at poster size beside a tall arched photograph with a turning Rise Up Queens seal, and a small contents list. No Longer Bound gets a full blush magazine spread: arched photo, the NLB medallion, “Find Freedom” in script, the headline set big and the question as an italic pull quote. “More ways to grow” reads as a numbered contents page. The most high-end and print-like.',
  },
  luminous: {
    label: 'B — Luminous',
    note: 'The sky from Meet the Team and Contact, so Courses sits with the two pages you have already approved. Frosted-glass cards float over drifting pink and teal light, edged with a fine pink-to-teal line. No Longer Bound is a large glass card where the gold NLB ring turns slowly around an arched photo; “More to explore” glows softly as a reserved slot; four glass tiles lead to the other journeys. Soft, bright and calm.',
    pick: true,
  },
  pathway: {
    label: 'C — Pathway',
    note: 'Built on the headline “Continue your journey.” A hand-drawn pink-to-teal line starts from the swash under “journey.”, draws itself as you scroll, and threads numbered stations: No Longer Bound, past the reserved “More to explore” tile, then through the four “More ways to grow” tiles. Large rounded photo tiles. The most distinctive and the most motion-led.',
  },
};

const pageScripts = (html) => {
  // The courses base already loads explore.js; events needs countdown.js too.
  const add = [];
  if (html.includes('data-countdown') && !base.includes('/countdown.js')) add.push('<script src="/countdown.js" defer></script>');
  return add.join('\n');
};

const argOnly = process.argv.indexOf('--only');
const only = argOnly > -1 ? process.argv[argOnly + 1] : null;
if (only && !OPTIONS[only]) throw new Error(`build-explore: unknown direction "${only}"`);

let failed = 0;
for (const dir of Object.keys(OPTIONS)) {
  if (only && dir !== only) continue;
  fs.copyFileSync(path.join(ROOT, `src/styles/explore/${dir}.css`), path.join(dist, `xp-${dir}.css`));
  let mod;
  try { mod = await import(`../src/partials/explore/${dir}.mjs?v=${Date.now()}`); }
  catch (e) { failed++; console.error(`build-explore: ${dir} failed to load —`, e.message); continue; }
  for (const p of EXPLORE_PAGES) {
    let main;
    try { main = renderExplore(mod, dir, site, c, vids, p); }
    catch (e) { failed++; console.error(`build-explore: ${dir}/${p} failed —`, e.stack); continue; }
    const out = base
      .replace(titleRe, `<title>${esc(PAGES[p].label)} — ${esc(OPTIONS[dir].label)} — ${esc(site.brand.name)}</title>`)
      .replace(headerRe, header(site, PAGES[p].href, { clear: true }))
      .replace(mainRe, `<main id="main">${main}</main>`)
      .replace('</body>', `${pageScripts(main)}\n</body>`);
    fs.writeFileSync(path.join(dist, `xp-${dir}-${p}.html`), out);
  }
}

const tabs = (dir) => COMPARE.length < 2 ? '' : COMPARE.map((p, i) => `<button type="button" class="tab" role="tab" aria-selected="${i === 0}" data-dir="${dir}" data-page="${p}">${esc(PAGES[p].label)}</button>`).join('');

const card = (dir, o) => `
<article class="opt" id="${dir}" data-opt="${dir}">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  ${tabs(dir) ? `<div class="tabs" role="tablist" aria-label="${esc(o.label)} pages">${tabs(dir)}</div>` : ''}
  <p class="links"><a data-open href="/xp-${dir}-courses.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1600"><iframe data-frame="desk" src="/xp-${dir}-courses.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="1600"></iframe></div><figcaption>Desktop · 1440 wide · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe data-frame="phone" src="/xp-${dir}-courses.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'explore-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Courses — design options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:860px; margin:10px 0 0; }
.all { position:sticky; top:0; z-index:5; display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin:24px -16px 0; padding:12px 16px; background:rgba(255,255,255,.92); backdrop-filter:blur(8px); border-bottom:1px solid #eee; }
.all b { font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); margin-right:4px; }
.opt { margin-top:56px; scroll-margin-top:80px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:860px; font-size:15px; }
.links { margin:10px 0 0; font:700 13px Montserrat, sans-serif; } .links a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
.tabs { display:flex; flex-wrap:wrap; gap:6px; margin-top:14px; }
.tab { font:700 12px Montserrat, sans-serif; letter-spacing:.04em; min-height:36px; padding:0 14px; border-radius:999px; border:1px solid #ddd; background:#fff; color:var(--ink); cursor:pointer; }
.tab[aria-selected="true"] { background:var(--ink); border-color:var(--ink); color:#fff; }
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
  <h1>Courses page — design options</h1>
  <p class="lead">Three premium directions for the new Courses page, all using the copy you supplied. Live-site links open in
     a new tab. The supplied review caveats sit in a small “Preview notes” disclosure at the foot of the page rather than
     in the page copy. The page is built at /courses.html but not linked from the nav, footer or any other page.</p>
  ${COMPARE.length < 2 ? '' : `<div class="all" role="group" aria-label="Show this page in every direction"><b>Show in all three</b>${COMPARE.map(p => `<button type="button" class="tab" data-all="${p}">${esc(PAGES[p].label)}</button>`).join('')}</div>`}
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
  function show(dir, page) {
    var opt = document.querySelector('[data-opt="' + dir + '"]');
    var url = '/xp-' + dir + '-' + page + '.html';
    opt.querySelectorAll('iframe').forEach(function (f) { if (f.getAttribute('src') !== url) f.setAttribute('src', url); });
    opt.querySelector('[data-open]').href = url;
    opt.querySelectorAll('.tab').forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.page === page)); });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.tab'); if (!t) return;
    if (t.dataset.all) { ['couture', 'luminous', 'pathway'].forEach(function (d) { show(d, t.dataset.all); }); return; }
    show(t.dataset.dir, t.dataset.page);
  });
  addEventListener('resize', fit); fit();
})();
</script>
</body></html>`);
console.log(`built dist/explore-options.html + frames for ${only || 'all directions'}${failed ? ` — ${failed} FAILED` : ''}`);
if (failed) process.exitCode = 1;
