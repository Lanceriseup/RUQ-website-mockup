// Builds /contact-reach-options.html — four designs for the email and socials
// on the Contact page, none with a copy button (contact-photo.mjs reach).
// Each is the live page (G1 with the arc) with its email-and-socials swapped,
// written as /cxr-<key>.html.
//
// Must run after scripts/build.mjs (which publishes /contact-photo.css).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { contactReach } from '../src/partials/contact-photo.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const vids = read('src/data/videos.json');
const dist = path.join(ROOT, 'dist');
const page = fs.readFileSync(path.join(dist, 'contact.html'), 'utf8');
const mainRe = /<main id="main">[\s\S]*?<\/main>/;
if (!mainRe.test(page)) throw new Error('build-contact-reach-options: main not found in dist/contact.html');

const OPTIONS = {
  list: {
    label: 'A — Contact list',
    note: 'One clean white card with a row for each way to reach you: Email us with the address, then Instagram, Facebook and YouTube, each with its handle and an arrow. Rows tint pink on hover and the icon fills. Tidy and very easy to scan; everything is one tap.',
  },
  pills: {
    label: 'B — Big link & pills',
    note: 'No card: the email address is set large in Lato Black with a short pink-to-teal underline that sweeps across on hover, and the socials sit beneath as white pill buttons with the platform name, filling pink on hover. The most open and typographic.',
    pick: true,
  },
  tiles: {
    label: 'C — Tiles',
    note: 'A wide Email us tile across the top, then three small tiles for Instagram, Facebook and YouTube with their handles. Each tile lifts on hover and its icon fills with the pink-to-teal gradient. Playful and app-like.',
  },
  sign: {
    label: 'D — Signature card',
    note: 'One elegant card with a pink-to-teal edge down its left side: the address with a round pink send button beside it, a fine rule, then “Follow along” with three gradient social circles that bounce up on hover. Polished and premium.',
  },
};

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `cxr-${k}.html`), page
    .replace(mainRe, () => `<main id="main">${contactReach(site, c, vids, k)}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Contact — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Chosen' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/cxr-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="860"><iframe src="/cxr-${k}.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="860"></iframe></div><figcaption>Desktop · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/cxr-${k}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'contact-reach-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Contact — email and socials options — ${esc(site.brand.name)}</title>
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
  <h1>Contact — email and socials</h1>
  <p class="lead">Four designs for the “Email us” and socials block on the new Contact page, with no Copy button: the
     address opens the visitor’s email app in all four, and each social shows its handle. Every preview is the live
     Contact page with only this block changed; hover to see the effects. The live site has not changed yet.</p>
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
console.log('built dist/contact-reach-options.html + frames for all options');
