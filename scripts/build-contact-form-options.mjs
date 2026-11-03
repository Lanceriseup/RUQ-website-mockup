// Builds /contact-form-options.html: four ways to set the live MultiplyOS
// "Contact Us" form on the Contact page (asked for 2026-11-03), plus one frame
// per option, /cf-<key>.html: the real Contact page with <main> swapped.
// Markup src/partials/contact-mos-options.mjs; styles .cf-* in
// src/styles/stay.css; frame sizing src/styles/stay.js.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { contactFormOption } from '../src/partials/contact-mos-options.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const vids = read('src/data/videos.json');
const dist = path.join(ROOT, 'dist');
for (const f of ['stay.css', 'stay.js']) fs.copyFileSync(path.join(ROOT, 'src/styles', f), path.join(dist, f));

const OPTIONS = {
  drop: {
    label: 'C1 — In place',
    note: 'The new form goes exactly where the old one was, beside “Contact”, the email and the socials, over the daylight photograph. It keeps its own “Contact Us” title and logo, framed with the same soft shadow as the homepage forms. The simplest, and the page looks as it does now.',
  },
  glass: {
    label: 'C2 — Glass frame',
    note: 'The form held in a frosted glass mat with a fine pink-to-teal rim, so the photograph glows softly through around it and the form feels part of the picture rather than sitting on top of it. The most premium.',
  },
  note: {
    label: 'C3 — Taped note',
    note: 'The form taped to the page at a slight tilt, like the Stay Connected note on the homepage’s Freedom wall, with “say hello” written by hand in pink and an arrow pointing to it (on wide screens). The warmest, and matches the homepage.',
  },
  rise: {
    label: 'C4 — Rising over the edge',
    note: 'The form stands out of the photograph and over the edge of the white panel below it, the way the About page’s form stands out of its band. The left side stays as it is; Rise Up Kings and the videos sit below. The most dramatic.',
  },
};

const headerRe = /<header id="site-nav"[\s\S]*?<\/header>/;
const mainRe = /<main id="main">[\s\S]*?<\/main>/;
const base = fs.readFileSync(path.join(dist, 'contact.html'), 'utf8');
if (!mainRe.test(base)) throw new Error('build-contact-form-options: main not found in dist/contact.html');

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `cf-${k}.html`), base
    .replace(mainRe, () => `<main id="main">${contactFormOption(site, c, vids, k)}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Contact — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag">Option</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/cf-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1100"><iframe src="/cf-${k}.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="1100"></iframe></div><figcaption>Desktop · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/cf-${k}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'contact-form-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Contact — the new form — ${esc(site.brand.name)}</title>
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
  <h1>Contact — the new form</h1>
  <p class="lead">The Contact page with the live MultiplyOS “Contact Us” form (name, phone, email and message) in place of
     the old disabled one. Four ways to set it; the rest of the page stays as it is. The form is live, so <b>anything
     submitted here is a real enquiry.</b> Scroll inside each preview, or open it full size.</p>
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

console.log('built dist/contact-form-options.html + frames cf-*.html');
