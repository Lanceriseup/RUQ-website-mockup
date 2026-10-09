// Builds /g1-options.html — options for two elements of the Courses page's
// "More ways to grow" section (G1, expanding panels): the heading with its
// lead, and the 01–04 marker on each panel. One frame per option:
// /g1h-<head>.html and /g1m-<mark>.html, each the real Courses page with the
// section rendered by makeGrow({ head } | { mark }).
//
// Must run after scripts/build.mjs and scripts/build-explore.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { coursesWith } from '../src/partials/explore/luminous.mjs';
import { renderExplore } from '../src/partials/explore/render.mjs';
import { makeGrow, HEADS, MARKS } from '../src/partials/explore/grow/panels.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const vids = read('src/data/videos.json');
const dist = path.join(ROOT, 'dist');
const base = fs.readFileSync(path.join(dist, 'courses.html'), 'utf8');
const mainRe = /<main id="main">[\s\S]*?<\/main>/;
if (!mainRe.test(base)) throw new Error('build-g1-options: main not found in dist/courses.html');

const HEAD_NOTES = {
  current: ['Current', 'For comparison: “More ways to” in Montserrat with “grow” in the pink script, the lead on the right beside a thin gradient rule.'],
  hero: ['H1 — Centred script', '“MORE WAYS TO” as a small tracked teal line, then a huge pink brush-script “grow” whose swash draws itself underneath — the same treatment as “Courses” at the top of the page, so the two headings rhyme. The lead sits centred below in serif italic.'],
  stack: ['H2 — Bold stack', 'The heading set big on two lines — “More ways / to grow” — with “grow” in a magenta-to-teal gradient that drifts slowly through the letters. The lines rise in one after the other; the lead sits at the right under a short gradient rule.'],
  ghost: ['H3 — Ghost word', 'A giant outlined “GROW” stretches behind the section like a watermark, settling in from wide letter-spacing as it arrives; the heading sits centred in front of it with the lead beneath.'],
  serif: ['H4 — Serif italic', 'The heading in Cormorant Garamond with “grow” in gradient italic — quieter and more editorial — and the lead as small tracked capitals beside a gradient rule.'],
};
const MARK_NOTES = {
  current: ['Current', 'For comparison: “01” with a short gradient tick on the folded panels, and a frosted “01 —” chip above the open panel’s title.'],
  serif: ['N1 — Serif numerals', 'Italic Cormorant numerals with a fine fading line beneath on the folded panels; the open panel carries a large italic numeral above its title. Elegant and editorial.'],
  outline: ['N2 — Outline numerals', 'Big outlined numerals on the folded panels; when a panel opens, a giant outlined number rises into its top-right corner as a watermark.'],
  medal: ['N3 — Progress medallion', 'A frosted medallion with a gradient ring that shows the step — a quarter, a half, three-quarters, full. When a panel opens its ring fills round, with “of 4” beside it.'],
  icons: ['N4 — Icons, no numbers', 'Numbers replaced by an icon for each path — a mortarboard, a calendar, a speech bubble, a gift — in a frosted circle on the folded panels and a gradient circle when open.'],
};

const frame = (file, grow, title) => {
  const page = { courses: (s, cc) => coursesWith(s, cc, undefined, grow) };
  fs.writeFileSync(path.join(dist, file), base
    .replace(mainRe, `<main id="main">${renderExplore(page, 'luminous', site, c, vids, 'courses')}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Courses — ${esc(title)} — ${esc(site.brand.name)}</title>`));
};
for (const h of HEADS) frame(`g1h-${h}.html`, makeGrow({ head: h }), HEAD_NOTES[h][0]);
for (const m of MARKS) frame(`g1m-${m}.html`, makeGrow({ mark: m }), MARK_NOTES[m][0]);

const card = (file, [label, note], { q = '', h = 900, ref = false } = {}) => `
<article class="opt${ref ? ' ref' : ''}">
  <span class="tag${ref ? ' cur' : ''}">${ref ? 'Current' : 'Option'}</span>
  <h3>${esc(label)}</h3>
  <p class="note">${esc(note)}</p>
  <p class="links"><a href="/${file}${q}#xl-grow-h" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="${h}"><iframe src="/${file}${q}" data-scroll="xl-grow-h" title="${esc(label)} — desktop" loading="lazy" width="1440" height="${h}"></iframe></div><figcaption>Desktop · 1440 wide · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/${file}${q}" data-scroll="xl-grow-h" title="${esc(label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'g1-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Courses — More ways to grow: heading and number options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
h2 { font:800 24px/1.2 Montserrat, sans-serif; margin:72px 0 0; padding-top:28px; border-top:2px solid #eee; }
.lead { color:var(--soft); max-width:860px; margin:10px 0 0; }
.jump { display:flex; gap:10px; margin-top:16px; }
.jump a { font:700 12px Montserrat, sans-serif; letter-spacing:.06em; padding:9px 16px; border-radius:999px; background:#f4f4f4; color:var(--ink); text-decoration:none; }
.opt { margin-top:48px; }
.opt h3 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:860px; font-size:15px; }
.links { margin:10px 0 0; font:700 13px Montserrat, sans-serif; } .links a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.cur { background:#777; }
.ref { opacity:.92; }
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
  <h1>Courses — “More ways to grow”: heading and number options</h1>
  <p class="lead">G1 (expanding panels) is now on the Courses page. Below are options for its heading and lead, and for the
     01–04 numbers on the panels. Each set is shown on its own against the current version, so you can mix and match —
     pick one of each. Copy is unchanged. Previews are interactive: point at the panels to open them.</p>
  <nav class="jump"><a href="#heading">Heading &amp; lead</a><a href="#numbers">Panel numbers</a></nav>

  <h2 id="heading">Heading &amp; lead</h2>
  ${HEADS.map(k => card(`g1h-${k}.html`, HEAD_NOTES[k], { ref: k === 'current', h: 820 })).join('')}

  <h2 id="numbers">Panel numbers</h2>
  <p class="lead">The open panel in each preview is the second (Events) so you can see both states: folded panels on either
     side, and the open one.</p>
  ${MARKS.map(k => card(`g1m-${k}.html`, MARK_NOTES[k], { ref: k === 'current', q: '?gp=2', h: 820 })).join('')}
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
        if (el) d.scrollTo(0, el.getBoundingClientRect().top + d.scrollY - 90);
      } catch (e) {}
    });
  });
  addEventListener('resize', fit); fit();
})();
</script>
</body></html>`);
console.log(`built dist/g1-options.html + ${HEADS.length + MARKS.length} frames`);
