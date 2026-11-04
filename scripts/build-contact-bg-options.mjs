// Builds /contact-bg-options.html: four ways to use the client's new Contact
// background photograph (the queens in their crowns, supplied 2026-11-05),
// asked for "with a wow factor". Frames are the built Contact page with
// <main> swapped, /cbg-<key>.html; the darker designs get the header in its
// white over-photo mode. Markup src/partials/contact-bg-options.mjs; styles
// src/styles/contact-bg.css.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { header } from '../src/partials/nav.mjs';
import { contactBg, contactBgDark } from '../src/partials/contact-bg-options.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const vids = read('src/data/videos.json');
const dist = path.join(ROOT, 'dist');

const OPTIONS = {
  day: {
    label: 'A — Daylight (the photo swapped in)',
    note: 'Today’s design with the new photograph: the same pale wash over the left behind the words, fading to the room on the right. The simplest change, shown so the others have something to beat. The wash softens many of the faces.',
  },
  focus: {
    label: 'B — Into focus',
    note: 'The page opens on the room out of focus, dark and close, and over two seconds it pulls sharp: the queens come into view. Soft stage lights in the brand’s pink and teal breathe over it, a single sweep of light crosses once it is sharp, then “Contact”, the words and the email rise in, in white with a pink glow. Cinematic, like the moment before an event starts.',
  },
  spot: {
    label: 'C — Spotlight',
    note: 'The room is washed soft and blush, and a circle of full colour follows the pointer across it, lighting up whichever faces it passes, with a fine glowing ring. Until the visitor moves the pointer (and always on a phone) it drifts slowly across the room by itself. Playful, and it invites people to look at the women.',
  },
  hero: {
    label: 'D — The queens first',
    note: 'The photograph runs the full width at the top of the page, bright and sharp, and opens from the centre like a curtain as the page loads. The words and the form start on its lower edge, the form rising over the photo. The only design where every face is seen clearly, with no text over them.',
  },
};

const headerRe = /<header id="site-nav"[\s\S]*?<\/header>/;
const mainRe = /<main id="main">[\s\S]*?<\/main>/;
const base = fs.readFileSync(path.join(dist, 'contact.html'), 'utf8');
if (!mainRe.test(base) || !headerRe.test(base)) throw new Error('build-contact-bg-options: header or main not found in dist/contact.html');

for (const [k, o] of Object.entries(OPTIONS)) {
  let html = base
    .replace(mainRe, () => `<main id="main">${contactBg(site, c, vids, k)}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Contact — ${esc(o.label)} — ${esc(site.brand.name)}</title>`);
  if (contactBgDark(k)) html = html.replace(headerRe, () => header(site, '/contact.html', { overHero: true }));
  fs.writeFileSync(path.join(dist, `cbg-${k}.html`), html);
}

const card = (k, o) => `
<article class="opt">
  <span class="tag">Option</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/cbg-${k}.html" target="_blank" rel="noopener">Open full page ↗</a>${k === 'day' ? '' : ' <button type="button" class="replay">Replay ↻</button>'}</p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="960"><iframe src="/cbg-${k}.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="960"></iframe></div><figcaption>Desktop · scrolls${k === 'spot' ? ' · move the pointer over it' : ''}</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/cbg-${k}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'contact-bg-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Contact background — options — ${esc(site.brand.name)}</title>
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
.replay { margin-left:14px; font:700 13px Montserrat, sans-serif; color:#fff; background:var(--magenta); border:0; border-radius:999px; padding:5px 14px; cursor:pointer; }
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
  <h1>Contact page — the new background photograph</h1>
  <p class="lead">Four ways to use the photograph of the queens in their crowns behind the Contact page. Everything
     else is the live page: “Contact”, the email and socials, the Contact Us form (now sized to your shorter
     form), and the panel with Rise Up Kings and the videos below. B, C and D move as the page opens; press
     <strong>Replay</strong> to see it again. Each preview is the real page; scroll inside it.</p>
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
  [].forEach.call(document.querySelectorAll('.replay'), function (b) {
    b.addEventListener('click', function () {
      [].forEach.call(b.closest('.opt').querySelectorAll('iframe'), function (f) { f.contentWindow.location.reload(); });
    });
  });
})();
</script>
</body></html>`);
console.log('built dist/contact-bg-options.html + frames cbg-*.html');
