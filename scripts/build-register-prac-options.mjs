// Builds /register-prac-options.html: Location, What's included, Attendance
// and Hotel & travel on the checkout page, laid out to use the space the two
// uneven half-width cards left empty (Lance's ask, 2026-11-10), in four
// designs. Frames are the built /register.html with <main> swapped,
// /rgp-<key>.html. Markup register() in src/partials/register/split.mjs (its
// `prac`); styles at the end of src/styles/explore/reg-split.css.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { register } from '../src/partials/register/split.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const dist = path.join(ROOT, 'dist');

const OPTIONS = {
  cards: { label: 'Before', note: 'Today’s four glass cards. What’s included is short beside Attendance, so the pair leaves a hollow under it, and the session times sit in a heading-sized line.' },
  glance: { label: 'P1 — At a glance', note: 'Location and the schedule become one itinerary card: the venue with a Directions link, then the three days as tiles (Wed, Thu, Fri with their dates), each carrying its 8am – 6pm hours, and the attendance note under them. What’s included becomes three icon tiles, and Hotel & travel gets the airports as chips. Everything is full width, so nothing sits beside a shorter neighbour.' },
  bento: { label: 'P2 — Bento', note: 'A fitted grid. The venue sits over a softly drawn map with a pulsing pin and a marching route. Attendance leads with 8am – 6pm as large gradient numerals; What’s included is a checklist that stretches to match its height, so the two halves always line up. Hotel & travel runs across the bottom with the airports beside it.' },
  ticket: { label: 'P3 — Admission ticket', note: 'The event as a cream admission ticket, the one light object on the dark photo: venue, dates, days and session hours on the ticket, What’s included on a tear-off stub behind a perforation, with notched edges and a slow holographic sheen. Attendance and Hotel & travel sit under it as fine print on glass.' },
  path: { label: 'P4 — Know before you go', note: 'One card under a script heading. The details become four stops on a glowing pink-to-teal line that draws itself in: Where, When (the three days and the hours), What’s included and Getting there. Reads top to bottom like a plan, and the single card leaves no gaps.' },
};

const mainRe = /<main id="main">[\s\S]*?<\/main>/;
const base = fs.readFileSync(path.join(dist, 'register.html'), 'utf8');
if (!mainRe.test(base)) throw new Error('build-register-prac-options: main not found in dist/register.html');
for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `rgp-${k}.html`), base
    .replace(mainRe, () => `<main id="main">${register(site, c, { exp: 'none', prac: k })}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Checkout — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${k === 'cards' ? ' now' : ''}">${k === 'cards' ? 'Before' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/rgp-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1500" data-y="560"><iframe src="/rgp-${k}.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="1500"></iframe></div><figcaption>Desktop · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844" data-y="1180"><iframe src="/rgp-${k}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'register-prac-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Checkout — event details — options — ${esc(site.brand.name)}</title>
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
.tag.now { background:#777; }
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
  <h1>Checkout — the event details, using the space</h1>
  <p class="lead">Location, What’s included, Attendance and Hotel &amp; travel, in four layouts that leave no hollow
     beside a short card, with today’s for comparison. Each preview is the real checkout page, already scrolled to
     the details; scroll inside it. The copy is the client’s throughout: “8am – 6pm” comes from the Attendance line,
     the three days from each date, and the airports from the Hotel &amp; travel note. Pick the September date to see
     the days change.</p>
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
  // Open each preview on the details rather than the photo at the top.
  screens.forEach(function (s) {
    var f = s.querySelector('iframe');
    f.addEventListener('load', function () {
      try {
        var d = f.contentDocument, el = d.querySelector('.rgs-details-loc, .rgs-gl, .rgs-bn, .rgs-tk, .rgs-pt');
        if (el) f.contentWindow.scrollTo(0, el.getBoundingClientRect().top + f.contentWindow.scrollY - 40);
      } catch (e) {}
    });
  });
  addEventListener('resize', fit); fit();
})();
</script>
</body></html>`);
console.log('built dist/register-prac-options.html + frames rgp-*.html');
