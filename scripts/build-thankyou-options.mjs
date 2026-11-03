// Builds /thank-you-options.html: four simple designs for the thank-you page
// the Contact Us form sends the visitor to after a submit (asked for
// 2026-11-04), plus one frame per option, /ty-<key>.html: the real Contact
// page (its header in "clear" mode) with <main> swapped. Markup
// src/partials/thankyou-options.mjs; styles src/styles/thankyou.css.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { thankYouOption } from '../src/partials/thankyou-options.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const dist = path.join(ROOT, 'dist');
fs.copyFileSync(path.join(ROOT, 'src/styles/thankyou.css'), path.join(dist, 'thankyou.css'));

const OPTIONS = {
  day: { pick: true,
    label: 'T1 — Daylight',
    note: 'The same washed daylight photograph as the Contact page, so the visitor lands somewhere that looks like where they just were: the crown, “Thank you, Queen” in pink script, the message, the way home and the socials, centred over it.',
  },
  card: {
    label: 'T2 — One card',
    note: 'A single white card in the middle of soft blush and teal light. Nothing else on the page. The simplest and calmest.',
  },
  note: {
    label: 'T3 — Taped note',
    note: 'The message on a note taped at a slight tilt to blush dotted paper, like the Stay Connected note on the homepage’s Freedom wall. The warmest and most personal.',
  },
  split: {
    label: 'T4 — Photo and message',
    note: 'The queens waving on the left half, the message on the right (on a phone, the photo on top). Brings the people into it.',
  },
};

const mainRe = /<main id="main">[\s\S]*?<\/main>/;
const base = fs.readFileSync(path.join(dist, 'contact.html'), 'utf8');
if (!mainRe.test(base)) throw new Error('build-thankyou-options: main not found in dist/contact.html');

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `ty-${k}.html`), base
    .replace(mainRe, () => `<main id="main">${thankYouOption(site, c, k)}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Thank you — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag">${o.pick ? 'Live now' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/ty-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe src="/ty-${k}.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="900"></iframe></div><figcaption>Desktop · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/ty-${k}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'thank-you-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Thank-you page — ${esc(site.brand.name)}</title>
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
  <h1>The thank-you page</h1>
  <p class="lead">Where the Contact Us form now sends the visitor after they submit. Four simple designs; each says the
     same few things: thank you, the message is on its way, the way back home, upcoming events and the socials. Open
     one full size to see it as the visitor will.</p>
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

console.log('built dist/thank-you-options.html + frames ty-*.html');
