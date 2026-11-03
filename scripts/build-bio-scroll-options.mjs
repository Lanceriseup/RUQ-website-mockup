// Builds /bio-scroll-options.html — a fixed-size bio dialog on the Team page,
// with three ways through a bio too long for it (asked for 2026-10-30).
//
// Each option is a data-bio-scroll mode read by src/styles/bio-modal.js;
// frames are the built team page with that attribute set, as
// /bioscroll-<key>.html. Option A ('fade') was chosen 2026-10-30 and is live,
// so the frames strip the live page's own attribute before setting theirs.
// A frame opened with #bio=<name> opens that person's bio on load, which is
// how the previews show a long bio (Jessica Lewis) and a short one (Molly
// Rhodes) without a click.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const OPTIONS = {
  current: {
    label: 'Before — grows to fit',
    note: 'For comparison: the dialog is as tall as the bio, up to the height of the screen, so Molly’s is short, Jessica’s and Becky’s run to the bottom of the screen, and there is no sign that there is more to read.',
  },
  fade: {
    label: 'A — Fade and “Keep reading”',
    note: 'Every dialog is the same size. When a bio is longer than the space, its last lines fade into the paper under a black “Keep reading ↓” pill; each press scrolls the text down, and at the end the pill becomes “Back to top ↑” and the fade lifts. Scrolling with the mouse or a finger works as normal. The clearest signal that there is more.',
    pick: true,
  },
  rail: {
    label: 'B — Progress rail',
    note: 'Every dialog is the same size. A slim rail down the right edge fills from pink to teal as you read, in place of the grey scrollbar, with a round pink arrow under it that scrolls the text; at the end it turns over and takes you back to the top. A soft fade marks where the text continues. Shows how far through the bio you are at a glance.',
  },
  pages: {
    label: 'C — Pages',
    note: 'Every dialog is the same size and nothing scrolls. A long bio is laid out in pages, like a book, with “‹ 1 / 2 ›” under the text; the arrows (or the arrow keys, or a swipe on a phone) turn the page while the name stays put. The most composed, but a reader has to notice the arrows to know there is more.',
  },
};

const pageRe = /class="team-light bio-fx bio-fx-lift"/;
const base = fs.readFileSync(path.join(dist, 'team.html'), 'utf8').replace(/ data-bio-scroll="[^"]*"/, '');
if (!pageRe.test(base)) throw new Error('build-bio-scroll-options: bio page class not found in dist/team.html');

// Preview helper: open the named bio once the page has settled.
const opener = `<script>
addEventListener('load', function () {
  var m = /#bio=(.+)$/.exec(location.hash); if (!m) return;
  var n = decodeURIComponent(m[1]);
  setTimeout(function () {
    var b = document.querySelector('[data-bio-card][data-bio-name="' + n + '"] [data-bio-open]');
    if (b) b.click();
  }, 700);
});
</script>
</body>`;

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `bioscroll-${k}.html`), base
    .replace(pageRe, (m) => k === 'current' ? m : `${m} data-bio-scroll="${k}"`)
    .replace('</body>', opener)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Bio dialog — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}

const LONG = encodeURIComponent('Jessica Lewis'), SHORT = encodeURIComponent('Molly Rhodes');
const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Chosen' : k === 'current' ? 'Before' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/bioscroll-${k}.html#bio=${LONG}" target="_blank" rel="noopener">Open with a long bio (Jessica) ↗</a>
     <a href="/bioscroll-${k}.html#bio=${SHORT}" target="_blank" rel="noopener">Open with a short bio (Molly) ↗</a>
     <a href="/bioscroll-${k}.html" target="_blank" rel="noopener">Open the Team page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="860"><iframe src="/bioscroll-${k}.html#bio=${LONG}" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="860"></iframe></div><figcaption>Desktop · Jessica’s bio · try the controls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/bioscroll-${k}.html#bio=${LONG}" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'bio-scroll-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Team bios — fixed-size dialog options — ${esc(site.brand.name)}</title>
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
  <h1>Team bios — a fixed-size dialog</h1>
  <p class="lead">Today the bio dialog grows to fit each bio, so every person’s is a different size and a long
     one runs to the bottom of the screen with no sign there is more. In each option below the dialog is one
     fixed size for everyone (38rem tall on desktop, or the screen height if that is less), and a bio that does
     not fit gets a control to move through it. A bio that fits shows no control at all. Every preview is the
     real Team page with Jessica’s bio open; the controls work. Option A is live.</p>
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
console.log('built dist/bio-scroll-options.html + frames for all options');
