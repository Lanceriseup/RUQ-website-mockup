// Builds /freedom-stay-options.html — for the Freedom note on the homepage,
// which holds the Stay Connected form in place of its Reserve button since
// 2026-11-05 (the client's ask), and the form in it shortened in MultiplyOS
// the same day (no title or logo of its own):
//
//   1. four looks for "Stay close" over the form (noteStay in
//      src/partials/stay-options.mjs; styles .sc-n-* in stay.css)
//   2. four sizes for the whole Freedom section (freedomPhoto's `size`;
//      styles .fx-sz-* in freedom-photo.css), each shown with the live look
//
// Frames are the built homepage with the Freedom section swapped, as
// /fstay-<look>.html and /fsize-<size>.html. Each preview measures its own
// section and prints the height, so the sizes are measured, not asserted.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { freedomPhoto } from '../src/partials/freedom-photo.mjs';
import { noteStay } from '../src/partials/stay-options.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const dist = path.join(ROOT, 'dist');

// The look the live homepage uses (pages.mjs); the sizes are shown with it.
const LIVE_LOOK = 'arrow';
const LIVE_SIZE = '';

const LOOKS = {
  arrow: {
    label: 'A — Script and arrow',
    note: '“Stay close” in the pink script, with the hand-drawn arrow curving down to the form. The look it had before, when the form was taped to the wall under the note, now inside the note.',
  },
  rule: {
    label: 'B — Between hairlines',
    note: '“Stay close” set between two fine lines, the same way “3-day intensive” sits above the dates, with “Be the first to know” in small capitals under it. The note reads as one tidy card: the event, then the dates, then the form.',
  },
  tape: {
    label: 'C — On the tape',
    note: '“Stay close” written on a strip of pink washi tape stuck across the top of the form, like the tape holding the note and the polaroids to the wall. The most scrapbook of the four, and it adds no height of its own.',
  },
  line: {
    label: 'D — Script and a reason',
    note: '“Stay close” in the script, then one line on what she gets: “Event dates, new masterclasses and a word of encouragement between events, sent straight to your inbox.” The form no longer has a title, so this tells her why to fill it in.',
  },
};

const SIZES = {
  '': {
    label: 'As it is now',
    note: 'The note and the wall at the sizes they had with the button. The form makes the note much taller than the polaroids beside it, so the section is now the tallest on the page.',
  },
  trim: {
    label: '1 — Trimmed',
    note: 'Everything the same size; only the air comes out: less space above and below the section, inside the note, and between the logo, the words, the dates and the form.',
  },
  compact: {
    label: '2 — Compact',
    note: 'Trimmed, plus a narrower note, a smaller Freedom logo and type a step down, with slightly smaller polaroids so they stay in proportion to the note.',
  },
  small: {
    label: '3 — Small',
    note: 'The smallest that keeps everything: a narrower note again, the logo and type another step down, and smaller polaroids. Nothing is cut; the body text stays readable at 15px (14.5px on a phone).',
  },
};

const sectionRe = /<section id="freedom"[\s\S]*?<\/section>/;
const base = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!sectionRe.test(base)) throw new Error('build-freedom-stay-options: Freedom section not found in dist/index.html');

const frame = (file, title, look, size) => fs.writeFileSync(path.join(dist, file), base
  .replace(sectionRe, () => freedomPhoto(site, c, 'memory', { dates: 'note', form: noteStay(c, look), size }))
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)} — ${esc(site.brand.name)}</title>`));

for (const [k, o] of Object.entries(LOOKS)) frame(`fstay-${k}.html`, `Stay close — ${o.label}`, k, LIVE_SIZE);
for (const [k, o] of Object.entries(SIZES)) frame(`fsize-${k || 'now'}.html`, `Freedom size — ${o.label}`, LIVE_LOOK, k);

const card = (file, o, tag, cls, dh) => `
<article class="opt">
  <span class="tag ${cls}">${tag}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/${file}#freedom" target="_blank" rel="noopener">Open on the homepage ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="${dh}"><iframe src="/${file}#freedom" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="${dh}"></iframe></div><figcaption>Desktop · 1440 wide · scrolls<span class="h"></span></figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/${file}#freedom" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls<span class="h"></span></figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'freedom-stay-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Stay close and Freedom sizes — options — ${esc(site.brand.name)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.part { font:700 24px/1.25 Montserrat, sans-serif; margin:72px 0 0; padding-top:28px; border-top:1px solid #eee; }
.lead { color:var(--soft); max-width:860px; margin:10px 0 0; }
.opt { margin-top:56px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:860px; font-size:15px; }
.links { margin:10px 0 0; font:700 13px Montserrat, sans-serif; } .links a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.live { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
.pair { display:grid; gap:24px; margin-top:14px; }
@media (min-width:1100px) { .pair { grid-template-columns:1fr 280px; align-items:start; } }
figure { margin:0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
figcaption .h { display:block; margin-top:2px; color:var(--magenta); letter-spacing:.06em; text-transform:none; font-size:13px; }
.pf { max-width:280px; }
.screen { position:relative; overflow:hidden; border-radius:14px; background:#fff; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen.phone { border-radius:22px; box-shadow:0 0 0 7px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Freedom note — “Stay close” and section size</h1>
  <p class="lead">The Stay Connected form now sits in the Freedom note in place of the Reserve button, and the
     form itself is shorter since its title and logo came out in MultiplyOS (333px tall, down from 467). Part one
     is four ways to put “Stay close” back over it; part two is four sizes for the whole section. Any look works
     with any size. Every preview is the real homepage, opened at the Freedom section, with the real form; scroll
     inside it. The pink figure under each preview is that section’s height, measured in the preview.</p>

  <h2 class="part">1 · “Stay close” over the form</h2>
  <p class="lead">Each shown at today’s section size. A is on the live homepage now, as it was before.</p>
  ${Object.entries(LOOKS).map(([k, o]) => card(`fstay-${k}.html`, o, k === LIVE_LOOK ? 'Live' : 'Option', k === LIVE_LOOK ? 'live' : '', 1180)).join('')}

  <h2 class="part">2 · Size of the Freedom section</h2>
  <p class="lead">Each shown with look ${esc(LOOKS[LIVE_LOOK].label.split(' — ')[0])}. The desktop previews are tall enough to show the
     whole section at once, so the four can be compared at a glance; the heights underneath are the real difference.</p>
  ${Object.entries(SIZES).map(([k, o]) => card(`fsize-${k || 'now'}.html`, o, k === LIVE_SIZE ? 'Live' : 'Option', k === LIVE_SIZE ? 'live' : '', 1760)).join('')}
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
  // Each preview's Freedom section height, printed under it.
  screens.forEach(function (s) {
    var f = s.querySelector('iframe'), out = s.parentNode.querySelector('.h');
    function measure() {
      try {
        var sec = f.contentDocument.getElementById('freedom');
        if (sec) out.textContent = 'Freedom section: ' + Math.round(sec.getBoundingClientRect().height) + 'px tall';
      } catch (e) {}
    }
    f.addEventListener('load', function () { measure(); setTimeout(measure, 1500); setTimeout(measure, 4000); });
  });
})();
</script>
</body></html>`);
console.log('built dist/freedom-stay-options.html + frames fstay-*.html, fsize-*.html');

// ── Round two (2026-11-05): look A and the section size were kept; what
// Lance wanted sized was the form and "Stay close" themselves. Frames
// /fform-<k>.html and /fscript-<k>.html, opened at the form (#stay).
const FORMS = {
  '': { label: 'As it is now', note: 'The form fills the width of the note: about 456px wide and 317px tall on desktop.' },
  narrow: { label: 'F1 — Narrower', note: 'The form 380px wide, centred in the note, with its text and fields the same size as now. Only the width changes; the fields get shorter from side to side and there is more paper either side.' },
  s90: { label: 'F2 — 90%', note: 'The whole form a tenth smaller: text, fields and the Submit button together. About 410 × 285px on desktop, so the note gets about 30px shorter.' },
  s80: { label: 'F3 — 80%', note: 'The whole form a fifth smaller: about 365 × 254px on desktop, so the note gets about 65px shorter. On a phone it stops at 88% so the text stays readable.' },
};
const SCRIPTS = {
  '': { label: 'As it is now', note: '“Stay close” at 56px on desktop (44px on a phone), with the arrow beside it.' },
  s: { label: 'S1 — Smaller', note: '44px on desktop (36px on a phone), with a smaller arrow. Quieter: a label for the form rather than a headline.' },
  l: { label: 'S2 — Larger', note: '68px on desktop (52px on a phone), with a larger arrow. About the size it was when it hung on the wall under the note.' },
  xl: { label: 'S3 — Largest', note: '80px on desktop (60px on a phone), with the arrow larger still. A headline of its own, as large as the note’s width allows.' },
};

const frame2 = (file, title, o) => fs.writeFileSync(path.join(dist, file), base
  .replace(sectionRe, () => freedomPhoto(site, c, 'memory', { dates: 'note', form: noteStay(c, LIVE_LOOK, o) }))
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)} — ${esc(site.brand.name)}</title>`));
for (const [k, o] of Object.entries(FORMS)) frame2(`fform-${k || 'now'}.html`, `Form size — ${o.label}`, { form: k });
for (const [k, o] of Object.entries(SCRIPTS)) frame2(`fscript-${k || 'now'}.html`, `Stay close size — ${o.label}`, { script: k });

const card2 = (file, o, now) => `
<article class="opt">
  <span class="tag ${now ? 'live' : ''}">${now ? 'Live' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/${file}#stay" target="_blank" rel="noopener">Open on the homepage ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe src="/${file}#stay" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="900"></iframe></div><figcaption>Desktop · 1440 wide · scrolls<span class="h"></span></figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/${file}#stay" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls<span class="h"></span></figcaption></figure>
  </div>
</article>`;

const page1 = fs.readFileSync(path.join(dist, 'freedom-stay-options.html'), 'utf8');
fs.writeFileSync(path.join(dist, 'freedom-stay-options-2.html'), page1
  .replace(/<title>[\s\S]*?<\/title>/, `<title>Stay close and form sizes — options — ${esc(site.brand.name)}</title>`)
  .replace(/<div class="wrap">[\s\S]*?\n<\/div>\n<script>/, () => `<div class="wrap">
  <h1>Freedom note — size of the form and “Stay close”</h1>
  <p class="lead">Look A (the script and arrow) and the section as it is are kept. These size the two pieces
     themselves: part one the form, part two “Stay close”. Any form size works with any script size. Every
     preview is the real homepage opened at the form, with the real form; scroll inside it. The pink figure
     under each preview is the whole Freedom section’s height, measured in the preview.
     <a href="/freedom-stay-options.html" style="color:var(--magenta);font-weight:700">← Round one</a></p>

  <h2 class="part">1 · The form</h2>
  <p class="lead">Each with “Stay close” as it is now.</p>
  ${Object.entries(FORMS).map(([k, o]) => card2(`fform-${k || 'now'}.html`, o, !k)).join('')}

  <h2 class="part">2 · “Stay close”</h2>
  <p class="lead">Each with the form as it is now.</p>
  ${Object.entries(SCRIPTS).map(([k, o]) => card2(`fscript-${k || 'now'}.html`, o, !k)).join('')}
</div>
<script>`));
console.log('built dist/freedom-stay-options-2.html + frames fform-*.html, fscript-*.html');

// ── Round three (2026-11-05): F2 (the form at 90%) and the script at its own
// size were chosen, with more room between them; then livelier takes on the
// script and arrow, "with that wow factor". Frames /fwow-<k>.html, opened at
// the form; each plays when the form comes into view, and Replay reloads it.
const WOWS = {
  arrow: { label: 'As it is now', note: 'The chosen look, still: the script and the hand-drawn arrow, the form at 90%, a little more room between them. No movement.' },
  write: { label: 'W1 — Written by hand', note: '“Stay close” writes itself in from left to right, as if by pen, then the arrow draws itself down to the form and nudges toward it three times. The closest to what you have, brought to life.' },
  loop: { label: 'W2 — Heart and flourish', note: 'A small heart draws itself in to the left of the words and beats twice; on the right, a long flourish loops once in the air and comes down to the form as the arrow. Romantic and handwritten.' },
  shimmer: { label: 'W3 — Shimmer', note: 'A soft light sweeps across the pink script every few seconds, the arrow’s dashes march toward the form, and the form itself breathes a gentle pink glow. It keeps moving, so the eye keeps coming back to the form.' },
  spark: { label: 'W4 — Sparkle', note: 'A teal brush swoosh underlines the words, the arrow draws in, and little magenta, teal and gold sparkles twinkle around “Stay close”, like the bokeh on the wall behind.' },
  plane: { label: 'W5 — Paper plane', note: 'A pink paper plane takes off from the end of “Stay close” and flies a dotted loop down to the form, leaving its trail behind it: a message on its way to her inbox. The arrow becomes the flight.' },
};
for (const [k, o] of Object.entries(WOWS)) fs.writeFileSync(path.join(dist, `fwow-${k}.html`), base
  .replace(sectionRe, () => freedomPhoto(site, c, 'memory', { dates: 'note', form: noteStay(c, k, { form: 's90' }) }))
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(`Stay close — ${o.label}`)} — ${esc(site.brand.name)}</title>`));

const card3 = (k, o) => `
<article class="opt">
  <span class="tag ${k === 'arrow' ? 'live' : ''}">${k === 'arrow' ? 'Live' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/fwow-${k}.html#stay" target="_blank" rel="noopener">Open on the homepage ↗</a>${k === 'arrow' ? '' : ' <button type="button" class="replay">Replay ↻</button>'}</p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="820"><iframe src="/fwow-${k}.html#stay" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="820"></iframe></div><figcaption>Desktop · 1440 wide · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/fwow-${k}.html#stay" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'freedom-stay-options-3.html'), page1
  .replace(/<title>[\s\S]*?<\/title>/, `<title>Stay close, with movement — options — ${esc(site.brand.name)}</title>`)
  .replace('</style>', `.replay { margin-left:14px; font:700 13px Montserrat, sans-serif; color:#fff; background:var(--magenta); border:0; border-radius:999px; padding:5px 14px; cursor:pointer; }
</style>`)
  .replace(/<div class="wrap">[\s\S]*?\n<\/div>\n<script>/, () => `<div class="wrap">
  <h1>“Stay close” with the arrow — with movement</h1>
  <p class="lead">Five livelier takes on the chosen look, each with the form at 90% and the room you asked for
     under the words, with today’s for comparison at the top. Each plays once when the form comes into view, the
     way it would for a visitor scrolling down; press <strong>Replay</strong> to see it again. Every preview is the real
     homepage opened at the form, with the real form. For anyone who has asked their device for less motion, each
     shows its finished state, still.
     <a href="/freedom-stay-options-2.html" style="color:var(--magenta);font-weight:700">← Round two</a></p>
  ${Object.entries(WOWS).map(([k, o]) => card3(k, o)).join('')}
</div>
<script>
[].forEach.call(document.querySelectorAll('.replay'), function (b) {
  b.addEventListener('click', function () {
    [].forEach.call(b.closest('.opt').querySelectorAll('iframe'), function (f) { f.contentWindow.location.reload(); });
  });
});`));
console.log('built dist/freedom-stay-options-3.html + frames fwow-*.html');

// ── Balance (2026-11-05): the static arrow kept (as live). The note grew by
// the form, so its polaroids bunched at the top and read small; options to
// balance the whole section. Frames /fbal-<k>.html, with the live note.
const LIVE_FORM = noteStay(c, 'arrow', { form: 's90' });
const BAL = {
  now: { label: 'As it is now', o: {}, note: 'The note with the form is about 1,100px tall, but the polaroids are still placed for the old 860px note: they bunch at its top, leave its lower third bare, and look small beside it.' },
  big: { label: 'B1 — Bigger photos, spread out', o: { balance: 'big' }, note: 'The same six polaroids about a fifth larger (280px instead of 230px on a wide screen), spread evenly down the full height of the note: top, middle and bottom on each side. The note stays as it is.' },
  eight: { label: 'B2 — Eight photos', o: { balance: 'eight' }, note: 'Four polaroids a side instead of three, filling the note’s height: two more from the event (a queen laughing, and the group in their crowns). Busier and fuller, the most “memory wall”. Tablets and phones keep six and three.' },
  slim: { label: 'B3 — Smaller note, bigger photos', o: { balance: 'big', size: 'compact' }, note: 'Both moves at once: the note slimmer (500px, a smaller Freedom logo and type a step down, so it is shorter), and the polaroids larger and spread out as in B1. The note and the photos meet in the middle.' },
  side: { label: 'B4 — Side by side', o: { balance: 'side' }, note: 'The note goes wide and splits in two: Freedom and its words on the left, the dates, “Stay close” and the form on the right, with a fine line between. The note becomes about as tall as the photo columns, so the wall reads as one even row. The boldest change; on phones it stacks as now.' },
};
for (const [k, b] of Object.entries(BAL)) fs.writeFileSync(path.join(dist, `fbal-${k}.html`), base
  .replace(sectionRe, () => freedomPhoto(site, c, 'memory', { dates: 'note', form: LIVE_FORM, ...b.o }))
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(`Freedom balance — ${b.label}`)} — ${esc(site.brand.name)}</title>`));

fs.writeFileSync(path.join(dist, 'freedom-balance-options.html'), page1
  .replace(/<title>[\s\S]*?<\/title>/, `<title>Freedom section balance — options — ${esc(site.brand.name)}</title>`)
  .replace(/<div class="wrap">[\s\S]*?\n<\/div>\n<script>/, () => `<div class="wrap">
  <h1>Freedom section — balancing the note and the photos</h1>
  <p class="lead">With the form in it, the note is much taller than it was, and the polaroids beside it now look
     small and bunched at the top. Four ways to balance the whole section, with today’s for comparison. All
     keep the note exactly as chosen (“Stay close” with the arrow, the form at 90%). The desktop previews are tall
     enough to show the whole section; the pink figure under each is that section’s height, measured in the
     preview. The change is mostly for desktop, where the photos hang beside the note; on phones they are a row
     above it either way.</p>
  ${Object.entries(BAL).map(([k, b]) => card(`fbal-${k}.html`, b, k === 'now' ? 'Live' : 'Option', k === 'now' ? 'live' : '', 1500)).join('')}
</div>
<script>`));
console.log('built dist/freedom-balance-options.html + frames fbal-*.html');
