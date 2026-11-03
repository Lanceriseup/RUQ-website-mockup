// Builds /coaching-options.html: four directions for the 1-on-1 Coaching
// page (asked for 2026-11-03), plus one frame per direction, /co-<key>.html:
// the real site page (header, footer, app.js for the film lightbox) with
// <main> swapped. Markup src/partials/coaching-options.mjs; styles
// src/styles/coaching.css; behaviour src/styles/coaching.js; the intro-call
// form's frame stay.css/stay.js.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { header } from '../src/partials/nav.mjs';
import { coachingOption } from '../src/partials/coaching-options.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const dist = path.join(ROOT, 'dist');
for (const f of ['coaching.css', 'coaching.js', 'stay.css', 'stay.js']) fs.copyFileSync(path.join(ROOT, 'src/styles', f), path.join(dist, f));

const OPTIONS = {
  spotlight: {
    label: 'A — The spotlight',
    note: 'A dark, warm stage that picks up the amber studio light of the coaches’ own videos. One coach at a time, large: her video on one side (play it right there), her first name in pink script over her surname, her role, her full words and “Schedule your introductory call”. Below, a filmstrip of the four portraits; pick one and the stage cross-fades to her. It moves on by itself every few seconds, with a fine pink line filling under the current coach, until the visitor picks one. The most cinematic.',
  },
  match: {
    label: 'B — Find your coach',
    note: 'Starts with a question: “Which sounds like you?”, with four lines drawn from the coaches’ own words (“Stuck, exhausted, weighed down by shame”, “Tired of striving, yet unsure how to stop”…). Beside it the four portraits sit fanned like cards in a hand; choose a line and that coach’s card comes forward, opens to her first line and her buttons, while the others drop back. All four follow in full below. On a phone each line jumps to its coach. The most personal, and it helps a visitor choose.',
  },
  spreads: {
    label: 'C — Editorial spreads',
    note: 'A magazine spread for each coach on warm ivory paper: her portrait in a tall arch with a white mat, which opens upward as you reach it, a “Watch her video” pill on the arch, and on the other side a large italic pull quote taken from her own words, her name in the pink script, her full words and her button. The four alternate sides. The most elegant.',
  },
  cards: {
    label: 'D — Turn the card',
    note: 'Four tall portrait cards side by side on the soft sky, each with the coach’s first name in white script over a plum fade. The cards tilt gently toward the cursor; “Read about her” turns the card over in 3D to show her words on frosted glass, with her button and video, and “Back” turns it again. The most playful and tactile, and all four coaches are in view at once.',
  },
};

const headerRe = /<header id="site-nav"[\s\S]*?<\/header>/;
const mainRe = /<main id="main">[\s\S]*?<\/main>/;
const base = fs.readFileSync(path.join(dist, 'courses.html'), 'utf8');
if (!headerRe.test(base) || !mainRe.test(base)) throw new Error('build-coaching-options: header or main not found in dist/courses.html');

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `co-${k}.html`), base
    .replace(headerRe, () => header(site, '/coaching.html', k === 'spotlight' ? { overHero: true } : { clear: true }))
    .replace(mainRe, () => `<main id="main">${coachingOption(site, c, k)}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/,`<title>1-on-1 Coaching — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag">Option</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/co-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1100"><iframe src="/co-${k}.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="1100"></iframe></div><figcaption>Desktop · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/co-${k}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

const optionsPage = (file, heading, lead, keys) => fs.writeFileSync(path.join(dist, file), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(heading)} — ${esc(site.brand.name)}</title>
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
.tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
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
  <h1>${esc(heading)}</h1>
  <p class="lead">${lead}</p>
  ${keys.map(k => OPTIONS[k] ? card(k, OPTIONS[k]) : POP[k].card(k, POP[k])).join('')}
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

optionsPage('coaching-options.html', '1-on-1 Coaching — four directions',
  `A redesign of the 1-on-1 Coaching page. Every direction has the four coaches from the live page, Molly, Becky,
     Christy and Natasha, with their own words, their portraits and their videos (which play). Each coach’s “Schedule
     your introductory call” opens the live MultiplyOS intro-call form in a pop-up with her already chosen as the
     preferred coach, so <b>anything submitted here is a real request.</b> Each ends with “Not sure who to choose?” and
     the same form with no coach chosen. Scroll inside each preview, or open it full size.`,
  Object.keys(OPTIONS));

// ---- The coach pop-up's designs (asked for 2026-11-03): the live page,
// D, with a co-pop-* class on its .co, opening Molly's pop-up on load so the
// preview shows it straight away. Frames /cop-<key>.html.
const popCard = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Live now' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/cop-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe src="/cop-${k}.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="900"></iframe></div><figcaption>Desktop · Molly’s pop-up open</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/cop-${k}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;
const POP = {
  'pop-current': { card: popCard,
    label: 'P0 — Split',
    note: 'The first pop-up: the video on the left over a soft blur of her video still, her name, role, words and button on white on the right.' },
  'pop-cinema': { card: popCard,
    label: 'P1 — Cinema',
    note: 'Dark and warm like the coaches’ videos. Her video plays across the full width of the top, her first name in large glowing pink script sits where the video meets her words, and below it her name, role and button on one side and her words on the other, with an amber glow around the whole pop-up. The most cinematic.' },
  'pop-glass': { card: popCard, pick: true,
    label: 'P2 — Frosted glass',
    note: 'The page behind blurs into soft pink and teal light, and the pop-up is a frosted glass panel with a fine pink-to-teal rim. Her video sits inset like a framed screen with a white mat, and her first name is written huge and faint behind her words, with “01 / 04” above her name. The most luxurious and light.' },
  'pop-polaroid': { card: popCard,
    label: 'P3 — Polaroid',
    note: 'Blush paper with a fine dot grid. Her video is taped on as a tilted polaroid with her first name handwritten in pink underneath, and her words beside it, like the polaroids and taped notes on the homepage’s Freedom wall. The warmest and most personal.' },
  'pop-stage': { card: popCard,
    label: 'P4 — Full-screen stage',
    note: 'The whole screen goes dark with a warm amber and pink glow. Her video plays large on the left with her first name glowing beneath it in script; her words slide in on a glass panel on the right with “01 / 04”, her button, and the other three coaches’ faces at the bottom to go straight to the next coach. The biggest moment, like a feature film’s cast page.' },
};
const live = fs.readFileSync(path.join(dist, 'coaching.html'), 'utf8');
if (!/class="co co-is-cards/.test(live)) throw new Error('build-coaching-options: D not found in dist/coaching.html');
for (const [k, o] of Object.entries(POP)) {
  fs.writeFileSync(path.join(dist, `cop-${k.slice(4)}.html`), live
    .replace(/class="co co-is-cards( co-pop-\w+)?"/, `class="co co-is-cards co-${k}"`)
    .replace('</body>', `<script>addEventListener('load', function () { setTimeout(function () { var b = document.querySelector('[data-co-open="co-dlg-molly"]'); if (b) b.click(); }, 400); });</script>
</body>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Coach pop-up — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}
// frame names drop the "pop-" prefix: /cop-cinema.html
for (const o of Object.values(POP)) o.card = (k, x) => popCard(k.slice(4), x);

optionsPage('coaching-popup-options.html', '1-on-1 Coaching — the coach pop-up',
  `Designs for the pop-up that opens from each coach’s card on the live coaching page. Every one keeps the same
     content: her own video (it plays), her name, role and words from the current site, and “Schedule your introductory
     call”, which opens the intro-call form with her chosen (live form: <b>anything submitted is a real request</b>).
     Each preview opens Molly’s pop-up; open it full size and try the others.`,
  Object.keys(POP));

// ---- The intro-call form's size (asked for 2026-11-03: "too narrow in the
// middle"). The live page with a co-form-* class on dialog.co-dlg, opening
// the form from Molly's button on load. Frames /cof-<key>.html.
const formCard = (k, o) => `
<article class="opt">
  <span class="tag${o.now ? ' pick' : ''}">${o.now ? 'Live now' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/cof-${k.slice(5)}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe src="/cof-${k.slice(5)}.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="900"></iframe></div><figcaption>Desktop · the form open from Molly’s button</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/cof-${k.slice(5)}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;
const FORM = {
  'form-now': { card: formCard, cls: '',
    label: 'F0 — The first size (560px)',
    note: 'The intro-call form at 560px wide, centred, with the page blurred behind it.' },
  'form-wide': { card: formCard, now: true, cls: 'co-form-wide',
    label: 'F1 — Full width of the form (696px)',
    note: 'As wide as the form itself will go: MultiplyOS stops widening its form at 672px and centres it in anything wider, so this is its full size. The fields, the coach photos and the choices all get more room, and the name fields sit side by side, so the form is also a good deal shorter. The simplest change.' },
  'form-side': { card: formCard, cls: 'co-form-side',
    label: 'F2 — Wide, with the coach beside it',
    note: 'A wide pop-up: the form at its full 696px on the right, and on the left a tall portrait of the coach you chose with “Your introductory call” and her name in white script over it (or just the portrait panel from the “Not sure” button). It feels personal, like booking with her, and fills the screen. On a phone it is the form alone.' },
  'form-sheet': { card: formCard, cls: 'co-form-sheet',
    label: 'F3 — Full-height side sheet',
    note: 'The form slides in from the right as a full-height panel at its full width, on soft blush, with the page still visible and blurred on the left. Scrolls inside the panel, with no box floating in the middle. The most app-like.' },
};
for (const [k, o] of Object.entries(FORM)) {
  fs.writeFileSync(path.join(dist, `cof-${k.slice(5)}.html`), live
    .replace(/<dialog class="co-dlg( co-form-\w+)?"/,`<dialog class="co-dlg${o.cls ? ` ${o.cls}` : ''}"`)
    .replace('</body>', `<script>addEventListener('load', function () { setTimeout(function () { var b = document.querySelector('[data-co-pick="Molly Rhodes"]'); if (b) b.click(); }, 400); });</script>
</body>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Intro-call form — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}
for (const [k, o] of Object.entries(FORM)) POP[k] = o;

optionsPage('coaching-form-options.html', '1-on-1 Coaching — the intro-call form’s size',
  `Sizes for the pop-up with the intro-call form, which opens from “Schedule your introductory call”. One thing
     sets the limit: MultiplyOS stops widening the form at 672px and centres it in anything wider, so the form itself can
     be at most 696px (its card plus a little room around it). F1 uses that; F2 and F3 make the whole pop-up feel wider
     around it. Each preview opens the form from Molly’s button, with her already chosen. Live form: <b>anything
     submitted is a real request.</b>`,
  Object.keys(FORM));

console.log('built dist/coaching-options.html, coaching-popup-options.html, coaching-form-options.html + frames');
