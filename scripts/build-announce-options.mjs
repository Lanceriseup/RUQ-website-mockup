// Builds /announce-options.html — design options for an announcement banner
// above the header, announcing the next event (site.nextEvent.upcoming[0]).
//
// Each option is a style of src/partials/announce.mjs. Frames add the bar to
// built pages, so the live site is untouched until one is chosen:
//
//   /announce-<key>.html        the homepage (header over the hero video)
//   /announce-<key>-light.html  the Team page (ink header on the light sky)
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { announce } from '../src/partials/announce.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
fs.copyFileSync(path.join(ROOT, 'src/styles/announce.css'), path.join(dist, 'announce.css'));
fs.copyFileSync(path.join(ROOT, 'src/styles/announce.js'), path.join(dist, 'announce.js'));

const OPTIONS = {
  aurora: {
    label: 'A — Aurora',
    note: 'A deep ink bar lit from within by slowly drifting magenta and cyan light, with gradient hairlines top and bottom. A glowing “Next event” badge pulses beside “Freedom” in the event’s own script, then the date and “Reserve your seat”. Dramatic and cinematic: it feels like the house lights going down before the event.',
  },
  countdown: {
    label: 'B — Live countdown',
    note: 'The days, hours, minutes and seconds to May 5 tick live in small glass tiles, between “Freedom · May 5–7, 2027” and a glowing magenta Register button, with a brand-gradient line underneath. The strongest at creating urgency, and the most useful: it tells people exactly how long they have.',
  },
  marquee: {
    label: 'C — Marquee',
    note: 'A full brand-gradient band that slowly shifts colour, with the details gliding across it like a ticker: Next event ✦ Freedom ✦ May 5–7, 2027 ✦ 3-day intensive ✦ Limited spots ✦ Reserve your seat. Bold and energetic; it pauses when you hover. The most eye-catching option.',
    pick: true,
  },
  editorial: {
    label: 'D — Editorial',
    note: 'A soft blush paper bar with a gradient top edge: “The next gathering” in an italic serif, “Freedom” in magenta script, the date, and an outlined “Reserve your seat” pill that fills on hover. A light sweep glides across every few seconds. Refined and luxurious, like a printed invitation.',
  },
};

const headerRe = /<header id="site-nav"/;
const FRAMES = [
  { src: 'index.html', suffix: '' },
  { src: 'team.html', suffix: '-light' },
];

for (const k of Object.keys(OPTIONS)) {
  for (const f of FRAMES) {
    const base = fs.readFileSync(path.join(dist, f.src), 'utf8');
    if (!headerRe.test(base)) throw new Error(`build-announce-options: header not found in dist/${f.src}`);
    // Built pages may already carry the live bar, its stylesheet and script:
    // swap the bar, and add the other two only where they are missing.
    let html = base.replace(/<div id="announce" class="ann-wrap">[\s\S]*?<\/a><\/div>\n?/, '');
    if (!html.includes('/announce.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/announce.css">\n</head>');
    if (!html.includes('/announce.js')) html = html.replace('</body>', '<script src="/announce.js" defer></script>\n</body>');
    fs.writeFileSync(path.join(dist, `announce-${k}${f.suffix}.html`), html
      .replace(headerRe, (m) => `${announce(site, k)}\n${m}`)
      .replace(/<title>[\s\S]*?<\/title>/, `<title>Banner — ${esc(OPTIONS[k].label)} — ${esc(site.brand.name)}</title>`));
  }
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Chosen' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/announce-${k}.html" target="_blank" rel="noopener">Open on the homepage ↗</a>
     <a href="/announce-${k}-light.html" target="_blank" rel="noopener">Open on the Team page ↗</a></p>
  <div class="pair">
    <div class="stack">
      <figure><div class="screen" data-w="1440" data-h="560"><iframe src="/announce-${k}.html" title="${esc(o.label)} — homepage" loading="lazy" width="1440" height="560"></iframe></div><figcaption>Desktop · homepage</figcaption></figure>
      <figure><div class="screen" data-w="1440" data-h="380"><iframe src="/announce-${k}-light.html" title="${esc(o.label)} — light page" loading="lazy" width="1440" height="380"></iframe></div><figcaption>Desktop · light page</figcaption></figure>
    </div>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="700"><iframe src="/announce-${k}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="700"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'announce-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Event banner — design options — ${esc(site.brand.name)}</title>
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
  <h1>Next-event banner — design options</h1>
  <p class="lead">A slim banner above the header on every page, announcing the next event:
     <strong>Freedom, ${esc(site.nextEvent.upcoming[0].dates)}</strong>. The whole banner is one link to registration.
     The date comes from the same place as every other date on the site, so when May has passed and the
     dates are updated, the banner moves on by itself. All animation is live in these previews, and stops
     for visitors who have reduced motion turned on. The live site has not changed yet.</p>
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
console.log('built dist/announce-options.html + frames for all options');
