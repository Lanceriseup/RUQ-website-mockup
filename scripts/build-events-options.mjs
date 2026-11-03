// Builds /events-options.html: four directions for the Events page ("Your
// Path with Rise Up Queens", asked for 2026-11-03), plus one frame per
// direction, /ev-<key>.html: the real site page (header, footer, app.js for
// the film lightbox) with <main> swapped for the direction.
// Markup src/partials/events-options.mjs; styles src/styles/events.css;
// behaviour src/styles/events.js; the closing's form is stay.css/stay.js.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { header } from '../src/partials/nav.mjs';
import { eventsOption } from '../src/partials/events-options.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const dist = path.join(ROOT, 'dist');
for (const f of ['events.css', 'events.js', 'stay.css', 'stay.js']) fs.copyFileSync(path.join(ROOT, 'src/styles', f), path.join(dist, f));

const OPTIONS = {
  trail: {
    label: 'A — The trail',
    note: 'A modern take on the live page’s timeline. A soft blush hero (“Your Path” in the pink script over WITH RISE UP QUEENS, and the live lead), then a winding pink-to-teal trail that draws itself down the page as you scroll, swinging from side to side between seven crowns. At each crown a program: its film, a big italic 01–07, its format as a small tag, the name, its line, its points and its button, alternating left and right. The crown nearest the middle of the screen glows. On a phone the trail runs straight down the left edge. The most like a journey.',
  },
  map: {
    label: 'B — The map',
    note: 'Dark and cinematic, keeping your Path to Mastery map. The map is the hero, framed in a pink glow, and every stop on it is now a link: pulsing rings mark the stops, pointing at one shows its name and format, and clicking jumps to it. Below, each program is a wide row on near-black: a large film with a pink glow on one side, and a big italic 01 / 07, the name in white, its line, points and button on the other, alternating. The closest to the current site’s look, made richer.',
  },
  steps: {
    label: 'C — Seven steps',
    note: 'Warm ivory paper. On the left a sticky list of the seven steps (01 Freedom to 07 1:1 Coaching) stays in view while the programs scroll past on the right; the step you are reading turns dark and the line beside the list fills pink-to-teal as you go. Each program is a full-width film, then its name in the pink script, line and button beside its points. On a phone the list becomes a strip of pills along the top. The clearest sense of where you are on the path.',
  },
  feature: {
    label: 'D — Freedom first',
    note: 'Leads with the event everyone starts with. Under a sky, the heading and lead, then one large glass card for Freedom: its film, “Where it begins”, its line, both dates and Register Now. Below, “and then · Where the path leads”: the other six as a grid of photo cards (film still, number, format, name and line). Click a card and it opens in a pop-up with its film, points and button. The most scannable, and puts registration first.',
  },
  // Round two (2026-11-03): A was chosen and went live; these are the trail
  // with more wow, each closing on the About page's band (K2) instead of the
  // light closing, as asked. "Seven stops" is gone from all of them.
  'trail-rise': {
    round: 2, pick: true,
    label: 'A — The trail, with the About closing',
    note: 'The live page as it is now, without “Seven stops”, and with the new closing: the slim dark band from the About page, with “You don’t need to have it all figured out.” in the pink script, “You just need the courage to take the first step” as the heading, the next event dates behind a hairline, and the Stay Connected form standing up out of the band. Every option below closes the same way.',
  },
  ribbon: {
    round: 2,
    label: 'A1 — Satin ribbon',
    note: 'The thin line becomes a wide satin ribbon in pink, violet and teal, with a soft highlight along it and a shadow under it, unrolling down the page as you scroll. A large crown medallion rides the end of the ribbon, so you are always carried along the path. Behind each program, a huge outlined italic numeral (01 to 07) drifts slower than the page. The most luxurious.',
  },
  neon: {
    round: 2,
    label: 'A2 — Night trail',
    note: 'The path at night. A deep night sky with stars and soft pink and violet glows; the trail is a glowing neon line with a bright comet at its head that follows your scroll. Each program waits in grey with an unlit crown; the moment the light reaches it, the crown ignites pink and the film comes up into full colour. The most dramatic, and the closest to the dark live page, made magical.',
  },
  sunrise: {
    round: 2,
    label: 'A3 — Sunrise',
    note: 'The page is a sunrise. The hero is dawn: deep plum to rose to peach, with the sun rising behind the title as the page opens. Down the trail the sky warms from peach to clear morning blue, with a glow that climbs as you go. A pink “you are here” pin rides the trail, big soft numerals sit behind each program, and on wide screens a counter at the side keeps your place (“03 / 07 · Life By Design”). The most hopeful, and it tells the story: you start in the dark and walk into the light.',
  },
  arch: {
    round: 2,
    label: 'A4 — Arches',
    note: 'Ivory paper and a fine bronze and pink line. Each film sits in a tall arch with a white mat, which opens upward like a curtain as you arrive, and each program’s name is set in the pink script, with the same name written huge and faint behind it, drifting as you scroll. A small crown rides the line. The most elegant and editorial, like a printed invitation.',
  },
  // Round three (2026-11-03): A1 went live; the crowns marking each stop on
  // the ribbon "look weird", so they are off the live page (ev-mk-none) and
  // these are natural alternatives. Each frame is A1 with its ev-mk-* class.
  'mk-none': {
    round: 3, base: 'ribbon', mk: 'none',
    label: 'R0 — Nothing at the stops',
    note: 'The crowns at each stop are gone, so the ribbon flows uninterrupted from program to program, and the crown medallion riding the end of the ribbon is the only marker. The cleanest.',
  },
  'mk-loop': {
    round: 3, base: 'ribbon', mk: 'loop',
    label: 'R1 — A loop at each stop',
    note: 'The ribbon ties a soft loop as it passes each program, curling out and back over itself like satin ribbon really does, then carries on down. The loops draw in as the ribbon unrolls, and the crown rides through them. The most natural for a ribbon, and the most playful.',
  },
  'mk-pearl': {
    round: 3, base: 'ribbon', mk: 'pearl',
    label: 'R2 — Pearls on the ribbon',
    note: 'A small glossy pearl threaded on the ribbon at each program, with no white disc or ring around it. The pearls start soft blush, and each one warms to a pink gem as the ribbon reaches it. Quiet and jewellery-like, in keeping with the crowns and tiaras.',
  },
  'mk-label': {
    round: 3, base: 'ribbon', mk: 'label', pick: true,
    label: 'R3 — Printed on the ribbon',
    note: 'The ribbon is a little wider and carries each program’s number and name printed along it in fine white capitals, like a woven label (“01 · FREEDOM”, “02 · DEEPER”…), appearing as the ribbon reaches it. The marker becomes part of the ribbon rather than something sitting on it.',
  },
  'mk-bloom': {
    round: 3, base: 'ribbon', mk: 'bloom',
    label: 'R4 — A glow, not a marker',
    note: 'Nothing sits on the ribbon. Instead, as the ribbon reaches each program, a soft pink-to-teal glow blooms behind its film and the film lifts slightly toward you, so the program itself lights up. The most subtle: the stop is felt rather than drawn.',
  },
  // Round four (2026-11-03): R3 (labels on the ribbon) went live; these swap
  // the white disc with the crown that rides the ribbon's end (ev-rd-*).
  'rd-disc': {
    round: 4, base: 'ribbon', mk: 'label', rd: 'disc',
    label: 'P0 — The disc',
    note: 'The original: a white disc with your crown in it, riding the end of the ribbon as it unrolls.',
  },
  'rd-none': {
    round: 4, base: 'ribbon', mk: 'label', rd: 'none',
    label: 'P1 — Just the ribbon',
    note: 'Nothing rides the ribbon. Its end simply carries a soft white-to-pink glow as it unrolls down the page, so the ribbon and its printed labels are the whole show. The cleanest.',
  },
  'rd-crown': {
    round: 4, base: 'ribbon', mk: 'label', rd: 'crown',
    label: 'P2 — The crown alone',
    note: 'Your crown on its own, with no white circle around it: filled with the pink-to-teal gradient, tilted as if worn, and glowing softly, riding the end of the ribbon. Keeps the brand mark without the badge.',
  },
  'rd-bow': {
    round: 4, base: 'ribbon', mk: 'label', rd: 'bow',
    label: 'P3 — A satin bow',
    note: 'A small satin bow tied on the end of the ribbon, in the same pinks with a highlight on its loops, which turns with the ribbon as it sways from side to side. The most natural partner for a ribbon, and the most feminine.',
  },
  'rd-spark': {
    round: 4, base: 'ribbon', mk: 'label', rd: 'spark',
    label: 'P4 — A sparkle',
    note: 'A white four-point sparkle with a pink glow at the end of the ribbon, gently turning and twinkling as it travels, like light catching the satin. The most magical, and the lightest.',
  },
  // Round five (2026-11-03): "more of an arrow" for what rides the ribbon.
  'rd-arrow': {
    round: 5, base: 'ribbon', mk: 'label', rd: 'arrow',
    label: 'V1 — Arrowhead',
    note: 'The end of the ribbon becomes an arrowhead in the same satin pinks, with a fine white edge and a highlight, so the ribbon itself is the arrow. It turns with the ribbon as it sways from side to side, always pointing the way down the path. The boldest.',
  },
  'rd-line': {
    round: 5, base: 'ribbon', mk: 'label', rd: 'line',
    label: 'V2 — Drawn arrow',
    note: 'An open, hand-drawn arrowhead in deep pink at the end of the ribbon, like the brush swashes and arrows used elsewhere on the site. Lighter than V1, and more personal. Turns with the ribbon.',
  },
  'rd-darrow': {
    round: 5, base: 'ribbon', mk: 'label', rd: 'darrow',
    label: 'V3 — Arrow in a circle',
    note: 'Keeps the white circle you have now, but with a pink arrow in it instead of the crown, turning to point along the ribbon. Reads instantly as “keep going”, like a button pointing the way.',
  },
  'rd-pulse': {
    round: 5, base: 'ribbon', mk: 'label', rd: 'pulse', pick: true,
    label: 'V4 — Pulsing chevrons',
    note: 'Two pink chevrons at the end of the ribbon that pulse forward one after the other, like a gentle “this way”, turning with the ribbon. The most alive, and the clearest cue to keep scrolling.',
  },
};

const headerRe = /<header id="site-nav"[\s\S]*?<\/header>/;
const mainRe = /<main id="main">[\s\S]*?<\/main>/;
const base = fs.readFileSync(path.join(dist, 'courses.html'), 'utf8');
if (!headerRe.test(base) || !mainRe.test(base)) throw new Error('build-events-options: header or main not found in dist/courses.html');

for (const [k, o] of Object.entries(OPTIONS)) {
  const html = o.base ? eventsOption(site, c, o.base).replace(/ev-mk-\w+( ev-rd-\w+)?/, `ev-mk-${o.mk}${o.rd ? ` ev-rd-${o.rd}` : ''}`) : eventsOption(site, c, k);
  fs.writeFileSync(path.join(dist, `ev-${k}.html`), base
    .replace(headerRe, () => header(site, '/events.html', k === 'map' ? { overHero: true } : k === 'neon' || k === 'sunrise' ? { overHero: true, scrim: false } : { clear: true }))
    .replace(mainRe, () => `<main id="main">${html}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Events — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Live now' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/ev-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1100"><iframe src="/ev-${k}.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="1100"></iframe></div><figcaption>Desktop · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/ev-${k}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
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

optionsPage('events-options.html', 'Events — four directions',
  `A redesign of “Your Path with Rise Up Queens”. Every direction uses the live page’s own words, word for
     word: the seven programs in the live order (Freedom, Deeper, Life By Design, Elevate, Elevate International, Coaches
     Academy, 1:1 Coaching), each with its line, its points, its film and its button. Each ends as the live page does: the
     closing line, the next event dates (the current ones, May and September 2027) and the Stay Connected form, which is
     live, so <b>anything submitted here is a real sign-up.</b> The films play. Scroll inside each preview, or open it
     full size, which shows the motion best.
     <a href="/events-options-2.html" style="color:var(--magenta);font-weight:700">Round two: the trail, with more wow →</a>`,
  keys(1));

optionsPage('events-options-2.html', 'Events — the trail, round two',
  `A (the trail) is live. Here it is four more ways, each with its own wow, all keeping the trail flow: the
     path draws itself as you scroll, the programs alternate either side of it, word for word as the live page. “Seven
     stops” is gone from every one. Every option, and A at the top, now closes the way the About page does: the slim dark
     band with the Stay Connected form standing out of it (live form: <b>anything submitted is a real sign-up</b>). The
     motion is the point here, so open each one full size and scroll slowly.
     <a href="/events-options.html" style="color:var(--magenta);font-weight:700">← Round one</a>`,
  keys(2));


optionsPage('events-options-3.html', 'Events — the ribbon’s stops',
  `A1, the satin ribbon, is live. The crowns that sat on the ribbon at each program are gone from the live page
     (R0, below). Here are four more natural ways to mark where the ribbon meets each program, so you can compare. The
     Coaches Academy graphic now shows whole. Scroll slowly through each one full size: the markers appear as the
     ribbon reaches them.
     <a href="/events-options-2.html" style="color:var(--magenta);font-weight:700">← Round two</a>`,
  keys(3));

optionsPage('events-options-4.html', 'Events — what rides the ribbon',
  `R3 is live: each program’s number and name printed along the ribbon. Here are four alternatives to the white
     circle with the crown that rides the end of the ribbon (P0, the live one, first). Open each one full size and
     scroll: the rider travels with the end of the ribbon.
     <a href="/events-options-3.html" style="color:var(--magenta);font-weight:700">← The stops</a>`,
  keys(4));

optionsPage('events-options-5.html', 'Events — an arrow on the ribbon',
  `Arrows for the end of the ribbon, in place of the white circle with the crown. Each one turns with the ribbon as it
     sways, always pointing the way down the path. Open each one full size and scroll to see it travel.
     <a href="/events-options-4.html" style="color:var(--magenta);font-weight:700">← The other riders</a>`,
  keys(5));

console.log('built dist/events-options.html, -2.html … -5.html + frames ev-*.html');
