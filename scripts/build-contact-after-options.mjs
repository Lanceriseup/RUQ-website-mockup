// Builds /contact-after-options.html: three premium designs for the section
// under the Contact page photograph (Rise Up Kings and the two videos), asked
// for 2026-11-05 "premium, with a wow factor". Frames are the built Contact
// page with <main> swapped, /cafter-<key>.html, opened at the section (#ca).
// Markup src/partials/contact-after-options.mjs; styles contact-after.css.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { contactBg } from '../src/partials/contact-bg-options.mjs';
import { contactAfter } from '../src/partials/contact-after-options.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const vids = read('src/data/videos.json');
const dist = path.join(ROOT, 'dist');

const OPTIONS = {
  now: {
    label: 'Before',
    note: 'The Rise Up Kings card and the two videos as they were, for comparison.',
  },
  gold: {
    label: 'P1 — Ivory and gold',
    note: 'The Rise Up Kings card in ivory and champagne with a gold foil edge that a light slowly runs round, the crest lifted on its own tile and gently floating, a faint large crest behind, and a gold “Learn about Rise Up Kings” button. Under it “Watch” in the pink script; each video glows in its own colour (teal, then pink), tilts toward the pointer with a sheen, has a pulsing play button, and carries its title.',
  },
  stage: {
    label: 'P2 — The theatre',
    note: 'The panel goes dark, like a theatre: soft spotlights sway down from above, specks of light drift, and “Now showing · Watch” sits over the two videos, which glow in their colours on a polished floor that reflects them. Rise Up Kings closes the section as a gold-edged banner with the crest glowing. The most dramatic; it also puts the videos first.',
  },
  pair: {
    label: 'P3 — Him and her',
    note: 'One card joins the two movements: the Rise Up Queens crown on blush on the left, the Rise Up Kings crest on champagne on the right, and between them a large pink-to-gold “&” over “Is Your Husband Interested?” (the two emblems lean toward each other when you hover). The videos below are numbered 01 and 02 in outlined numerals, with their titles beside them.',
  },
};

const mainRe = /<main id="main">[\s\S]*?<\/main>/;
const base = fs.readFileSync(path.join(dist, 'contact.html'), 'utf8');
if (!mainRe.test(base)) throw new Error('build-contact-after-options: main not found in dist/contact.html');

for (const [k, o] of Object.entries(OPTIONS)) {
  let body = k === 'now'
    ? contactBg(site, c, vids, 'day').replace('<div class="cx-wrap cx-after">', '<div class="cx-wrap cx-after" id="ca">')
    : contactBg(site, c, vids, 'day', { after: contactAfter(site, c, vids, k) });
  fs.writeFileSync(path.join(dist, `cafter-${k}.html`), base
    .replace(mainRe, () => `<main id="main">${body}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Contact — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${k === 'now' ? ' now' : ''}">${k === 'now' ? 'Before' : k === 'gold' ? 'Chosen' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/cafter-${k}.html#ca" target="_blank" rel="noopener">Open on the Contact page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1100"><iframe src="/cafter-${k}.html#ca" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="1100"></iframe></div><figcaption>Desktop · scrolls${k === 'gold' ? ' · hover the videos' : ''}</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/cafter-${k}.html#ca" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'contact-after-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Contact — Rise Up Kings and videos — options — ${esc(site.brand.name)}</title>
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
  <h1>Contact page — the section under the photograph</h1>
  <p class="lead">The Rise Up Kings card (“Is Your Husband Interested?”) and the two videos, redesigned to feel premium,
     with today’s for comparison. The words and links are the same in all of them; each video still opens in the
     site’s player. Every preview is the real Contact page (now with the new photograph), opened at this section;
     scroll inside it.</p>
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
console.log('built dist/contact-after-options.html + frames cafter-*.html');
