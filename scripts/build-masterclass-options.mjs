// Builds /masterclass-options.html and /masterclass-options-2.html — premium
// directions for the Masterclasses page (asked for 2026-11-02; round two the
// same day, each on its own light ground), plus one frame per direction,
// /mc-<key>.html.
//
// Each frame is the real Courses page (clear header over the sky, footer,
// explore.js) with <main> swapped for that direction's page. Markup:
// src/partials/masterclass-options.mjs; styles src/styles/masterclass.css on
// top of /xp-luminous.css; behaviour src/styles/masterclass.js.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { header } from '../src/partials/nav.mjs';
import { masterclassPage } from '../src/partials/masterclass-options.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const dist = path.join(ROOT, 'dist');
fs.copyFileSync(path.join(ROOT, 'src/styles/masterclass.css'), path.join(dist, 'masterclass.css'));
fs.copyFileSync(path.join(ROOT, 'src/styles/masterclass.js'), path.join(dist, 'masterclass.js'));

const OPTIONS = {
  doors: {
    label: 'A — Three doors',
    note: 'Three tall photographs of the classes stand side by side under the “Masterclasses” script. Point at one (or tap it) and it swings open to nearly three times the width while the others narrow to slim panels with the name running up the side; the class rises out of the photograph in white, the name in the brush script, its length and coach as glass chips, then the description and “Join the waitlist”. On a phone the three become full photo cards, one after another. The most cinematic.',
  },
  chapters: {
    label: 'B — Chapters',
    note: 'One magazine spread per class, alternating sides. Each photograph wipes up into a tall arch as you reach it, with an oversized outlined “01 / 02 / 03” behind it and a slowly turning seal (“Masterclass · 12 weeks · Rise Up Queens”) around the pink crown. The class name is set big in the brush script, and a pink-to-teal swash draws itself under it as you scroll. The most editorial and high-end.',
  },
  stack: {
    label: 'C — The stack',
    note: 'Each class is a large glass card, photograph on one side and the class on the other, with “12 weeks” as a big pink-to-teal number beside “Your coach”. As you scroll the cards stick and pile up: each new one slides over the last, which sinks back and softens beneath it, until the three sit stacked like a deck. The most modern and tactile.',
  },
  select: {
    label: 'D — The chooser',
    note: 'The page opens straight onto a choice. “Masterclasses” and the line under it on the left, the three classes listed below in big type; on the right the chosen class’s photograph in a tall arch with a glass card over it. It cycles through the three on its own (a fine line fills under each name) until the visitor picks one, then cross-fades with a slow zoom. On a phone the list becomes three pills above the photograph. The most interactive, and the class is in view without scrolling.',
  },
  // Round two (2026-11-02): other layouts, each on its own light ground.
  gallery: {
    round: 2,
    label: 'E — The gallery walk · ivory paper',
    note: 'Warm ivory paper with a fine grain and faint column lines, like a gallery wall. As you scroll down the page holds still and the classes slide past sideways: an index of the three first, then each class with its photograph in a tall arch, a huge outlined numeral behind it and the name in the script. The photographs drift slightly against the walk, and a pink-to-teal line along the bottom shows how far through you are. On a phone it becomes a swipeable row of cards. The most surprising.',
  },
  deck: {
    round: 2,
    label: 'F — The deck · blush silk',
    note: 'The stack you liked, made more personal. Each class is a full photograph in a white print border, with the class written over it in white script. As you scroll the photographs pile up and each one tilts a little (left, then right) as the next lands on it, like prints dealt onto a table. Set on soft blush with fine satin ribbons drifting across it. The warmest and most emotional.',
  },
  index: {
    round: 2,
    label: 'G — The index · pearl aurora',
    note: 'Near-white pearl with a slow aurora of lilac, mint and peach. The three class names are set very large in Lato Black, as a list. Move the mouse over a name and that class’s photograph appears in an arch and follows the cursor, tilting as it moves, while the name fills with the pink-to-teal gradient. Click a name and it opens in place with the photograph, details and button. On a phone it is a clean tap-to-open list. The most confident and type-led.',
  },
  story: {
    round: 2,
    label: 'H — The story · dawn',
    note: 'A sunrise behind the title: a warm peach glow with fine pink and teal arcs that draw themselves in. Below it the photograph stays still in a tall arch on the left while the three classes scroll past on the right; as each one reaches the middle of the screen it brightens and the photograph cross-fades to it, with I, II, III marking the place. On a phone each class has its own photograph. The calmest and most elegant to read.',
  },
  // Round three (2026-11-02): F chosen; its closing section, in place of the
  // waitlist panel. Previews open at the closing (#mc-close).
  'deck-sign': {
    round: 3, anchor: 'mc-close',
    label: 'F1 — The sign-off',
    note: 'The closing line set large and light, centred under the pink crown between two fine lines, with “healing and growth” in the brush script. The three buttons sit underneath as pills: two outlined in the pink-to-teal edge, and “Start with Rise Up Queens” filled as the main action. Stays on the blush silk, so the page ends quietly. The simplest and closest to the current site.',
  },
  'deck-cards': {
    round: 3, anchor: 'mc-close',
    label: 'F2 — Photo doors',
    note: 'The line above three tall photographs that are the buttons: the crowd waving for Events, a one-to-one conversation for the coaches, arms raised for Start with Rise Up Queens. Each has its name in white over a plum fade and a round arrow; pointing at one lifts it, zooms the photo and turns the arrow pink. The most visual: every next step has a face.',
  },
  'deck-velvet': {
    round: 3, anchor: 'mc-close',
    label: 'F3 — Velvet band',
    note: 'The current site’s dark closing, made richer: a deep plum velvet band with a fine grain, a slow pink glow and a pink-to-teal hairline along the top, running straight into the footer. The line in white with “healing and growth” glowing pink; the three buttons as frosted glass pills, the last one filled pink, each filling pink when pointed at. The most dramatic ending after the light page.',
  },
  'deck-prints': {
    round: 3, anchor: 'mc-close',
    label: 'F4 — Three prints',
    note: 'Carries the deck’s white-bordered prints to the end of the page: three square photographs (the same three as F2) dealt in a loose fan on the blush, each captioned by hand in the pink script. Pointing at one straightens it and lifts it out of the fan. On a phone they stack. The most personal, and the closest to the deck above it.',
  },
};

const headerRe = /<header id="site-nav"[\s\S]*?<\/header>/;
const mainRe = /<main id="main">[\s\S]*?<\/main>/;
const base = fs.readFileSync(path.join(dist, 'courses.html'), 'utf8');
if (!headerRe.test(base) || !mainRe.test(base)) throw new Error('build-masterclass-options: header or main not found in dist/courses.html');

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `mc-${k}.html`), base
    .replace(headerRe, () => header(site, '/masterclasses.html', { clear: true }))
    .replace(mainRe, () => `<main id="main">${masterclassPage(site, c, k)}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Masterclasses — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}

const card = (k, o) => {
  const src = `/mc-${k}.html${o.anchor ? `#${o.anchor}` : ''}`;
  return `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Chosen' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="${src}" target="_blank" rel="noopener">Open ${o.anchor ? 'at the closing' : 'full page'} ↗</a>${o.anchor ? ` <a href="/mc-${k}.html" target="_blank" rel="noopener">Open from the top ↗</a>` : ''}</p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1180"><iframe src="${src}" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="1180"></iframe></div><figcaption>Desktop · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="${src}" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;
};

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
  <h1>${esc(heading)}</h1>
  <p class="lead">${lead}</p>
  ${keys.map(k => card(k, OPTIONS[k])).join('')}
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

const keys = (round) => Object.keys(OPTIONS).filter(k => (OPTIONS[k].round || 1) === round);

optionsPage('masterclass-options.html', 'Masterclasses — four directions',
  `A redesign of the Masterclasses page on the same sky-and-glass ground as Courses. Every option
     uses the same copy: Control, Walking in Freedom and Body Image, with each class’s length, its coach and its
     photograph from the current site, then one waitlist form with a class picker at the foot of the page
     (still a preview: nothing is sent). Each class’s “Join the waitlist” takes you to the form with that class
     already picked. Each preview is the real page; scroll inside it, or open it full size, which shows the
     motion best. <a href="/masterclass-options-2.html" style="color:var(--magenta);font-weight:700">Round two: four more, each on its own light ground →</a>`,
  keys(1));

optionsPage('masterclass-options-2.html', 'Masterclasses — round two',
  `Four more directions, each on its own light ground instead of the sky: ivory paper, blush silk, pearl
     aurora and dawn. Same copy, coaches, photographs and waitlist as round one. F is the stack from round one
     (<a href="/mc-stack.html" target="_blank" rel="noopener" style="color:var(--magenta);font-weight:700">C — The stack ↗</a>)
     taken further. The motion shows best full size: open each page and scroll.
     <a href="/masterclass-options.html" style="color:var(--magenta);font-weight:700">← Round one</a>`,
  keys(2));

optionsPage('masterclass-options-3.html', 'Masterclasses — F, closing section',
  `F (the deck on blush silk), with the waitlist panel at the foot of the page replaced by the current site’s
     sign-off: “Each topic is designed to meet you where you’re at — and walk with you into the next layer of
     healing and growth.” and its three buttons, Explore Our Events, Get to know our coaches and Start with
     Rise Up Queens. Four ways to set it; each preview opens at the closing, scroll up for the deck. The
     classes’ “Join the waitlist” buttons now open the waitlist in a pop-up, with that class already picked.
     <a href="/masterclass-options-2.html" style="color:var(--magenta);font-weight:700">← Round two</a>`,
  keys(3));

console.log('built dist/masterclass-options.html, -2.html, -3.html + frames for all options');
