// Builds /stay-options.html: six placements and designs for the live
// MultiplyOS "Stay Connected" form on the homepage (asked for 2026-11-03),
// plus one frame per option, /sc-<key>.html.
//
// Each frame is the real homepage with the option dropped in at its place:
//   breakthrough        replaces the breakthrough panel
//   after-testimonials  between the testimonies and No Longer Bound
//   before-footer       the last section of the page
//   footer              the top of the footer
//   after-faith         between the creed and the testimonies
//   float               no section; a card that slides in
// Markup src/partials/stay-options.mjs, styles src/styles/stay.css,
// behaviour src/styles/stay.js.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { STAY_OPTIONS, stayOption } from '../src/partials/stay-options.mjs';
import { ctaSection } from '../src/partials/cta.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const dist = path.join(ROOT, 'dist');
fs.copyFileSync(path.join(ROOT, 'src/styles/stay.css'), path.join(dist, 'stay.css'));
fs.copyFileSync(path.join(ROOT, 'src/styles/stay.js'), path.join(dist, 'stay.js'));

const OPTIONS = {
  panel: {
    label: 'A — In the breakthrough panel',
    pick: true,
    where: 'After “healing and renewal”, in place of the dark breakthrough panel',
    anchor: 'breakthrough',
    note: 'Where the current site has it, done properly. The dark breakthrough panel grows to hold the form: “It’s time for your breakthrough” with its pink-to-teal sheen, one line on what signing up brings and both event dates on the left, the form standing slightly taller than the panel on the right. Keeps the pink pulse around the edge. Register Now is gone (2026-11-03), so the form is the panel’s one action; the hero and the Freedom note still carry Register.',
  },
  note: {
    label: 'B — The pinned note',
    where: 'After the testimonies, before Find Freedom',
    anchor: 'stay',
    note: 'Picks up the Freedom memory wall from the top of the page. On soft blush, “Stay close” in the brush script over “Be the first to know”, then the form taped down between two tilted polaroids (arms raised; a laugh), with both event dates beneath. It comes straight after the women’s stories, when a visitor is most moved and most likely to want more. The warmest.',
  },
  sky: {
    label: 'C — Sky sign-off',
    where: 'The last section, after Find Freedom and before the footer',
    anchor: 'stay',
    note: 'Ends the page the way the faith section opens: a soft sky fading in from white, your crown in the pink-to-teal gradient, the script and heading centred, and the form held in a frosted glass frame, with the dates on a small pill underneath. A calm, open last word for anyone who scrolled all the way down but is not ready to register. The most elegant.',
  },
  footer: {
    label: 'D — In the footer',
    where: 'The top of the footer, so it closes every page',
    anchor: 'stay',
    note: 'The footer opens with a pink-to-teal hairline and a soft glow on the dark ground: the crown in white and pink, “Stay close” and the heading, the line, both event dates, and the form beside them. Because the footer is shared, the form is then on every page (Team, Contact, Courses, Masterclasses…) without anything added to the homepage itself. The most reach.',
  },
  split: {
    label: 'E — Photo split',
    where: 'After the statement of faith, before the testimonies',
    anchor: 'stay',
    note: 'A full-width break in the page: a large photograph of the women waving in their tiaras on one half, with “Stay close” written across it in white script, and the heading, line, form and dates on warm ivory on the other. On a phone the photograph sits on top as a banner. Straight after what the movement believes, it says “and this is who you would be with”. The most striking.',
  },
  float: {
    label: 'F — Slide-in card',
    where: 'No section: a card that slides in after the Freedom wall',
    anchor: 'testimonials',
    note: 'Nothing added to the page itself. Once a visitor has scrolled past the Freedom wall, a small card slides up in the corner (along the bottom on a phone): the crown, “Stay close”, “Be the first to know”, one line and a Stay Connected button that opens the form inside the card. Its close button puts it away for the rest of the visit. The preview opens past the wall so the card is already showing. The least intrusive on the layout, but it does sit over the page.',
  },
  // Round two (2026-11-03): A liked, without its Register Now; and the form
  // asked for in the first or second section.
  video: {
    round: 2,
    label: 'G — Beside the video',
    where: 'Section 1, the hero: next to the video',
    anchor: 'stay',
    note: 'The form is in view the moment the page opens. The hero’s video moves left and a frosted glass card sits beside it on the dark ground, with “Stay close” in pink script, “Be the first to know”, and the form inside. Register Now stays centred underneath. On a phone the card follows the video. The most immediate: watch, then sign up without scrolling.',
  },
  herofoot: {
    round: 2,
    label: 'H — The hero’s last word',
    where: 'Section 1, the hero: under Register Now',
    anchor: 'stay',
    note: 'The hero stays exactly as it is, then closes with a wide frosted band on the same dark ground: the crown, “Not ready to register yet?”, “Stay close · Be the first to know”, the line, and the form beside them. It answers the hero’s Register button with a softer second step for anyone not ready yet.',
  },
  opener: {
    round: 2,
    label: 'I — A, moved to the top',
    where: 'Section 2: opens the lifted panel, above the Freedom wall',
    anchor: 'stay',
    note: 'The A design you liked, as the first thing on the second section: the dark panel with the event photograph and the pink pulse, the crown, “Stay close” and “Be the first to know”, the line and both event dates on the left, and the form on the right. The breakthrough panel further down stays as it is now, so the dark panel appears twice on the page.',
  },
  wall: {
    round: 2,
    label: 'J — Pinned on the Freedom wall',
    where: 'Section 2: on the Freedom wall, under the Freedom note',
    anchor: 'stay',
    note: 'Part of the Freedom wall itself. Under the Freedom note (which already has both dates and Reserve Your Seat), “Stay close” in the pink script, with a hand-drawn arrow, and the form taped to the board like a second note. Reads as one moment: here is the event, and a way to stay close.',
  },
};

const bodyRe = /<\/body>/;
// The homepage as it was before any of these: A and J went live on
// 2026-11-03, so they come back out (J removed, A back to the original
// breakthrough panel) and each frame adds only its own option. stay.css and
// stay.js stay linked from the page.
const live = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const base = live
  .replace(/<!-- sc:wall -->[\s\S]*?<!-- \/sc:wall -->/, '')
  .replace(/<!-- sc:panel -->[\s\S]*?<!-- \/sc:panel -->/, () => ctaSection(site, c));
if (base === live || /<!-- sc:/.test(base)) throw new Error('build-stay-options: live options A and J not found in dist/index.html');

// Each place: the anchors it needs in dist/index.html, and how the option's
// html goes in.
const VSL = '<div class="relative mx-auto mt-10 sm:mt-16 max-w-4xl" data-vsl-id';
const HERO_COL = 'relative mx-auto max-w-4xl px-4 pb-20 sm:pb-36 pt-24 text-center sm:pt-52';
const REGISTER = '<!-- The Register button alone.';
const PLACE = {
  'breakthrough': [[/<section id="breakthrough"[\s\S]*?<\/section>/], (b, h) => b.replace(/<section id="breakthrough"[\s\S]*?<\/section>/, () => h)],
  'after-testimonials': [['<section id="nlb"'], (b, h) => b.replace('<section id="nlb"', () => `${h}\n<section id="nlb"`)],
  'before-footer': [['</main>'], (b, h) => b.replace('</main>', () => `${h}\n</main>`)],
  'footer': [[/<footer[^>]*>/], (b, h) => b.replace(/<footer[^>]*>/, (m) => `${m}\n${h}`)],
  'after-faith': [['<section id="testimonials"'], (b, h) => b.replace('<section id="testimonials"', () => `${h}\n<section id="testimonials"`)],
  'float': [['</main>'], (b, h) => b.replace('</main>', () => `</main>\n${h}`)],
  // G: widen the hero's column, and set the video and the card in one row
  'hero-video': [[HERO_COL, VSL, REGISTER], (b, h) => b
    .replace(HERO_COL, `${HERO_COL} sc-g-wide`)
    .replace(VSL, `<div class="sc-g-row">\n${VSL}`)
    .replace(REGISTER, () => `${h}\n</div>\n    ${REGISTER}`)],
  // H: after the hero's column, inside the hero section
  'hero-end': [[REGISTER], (b, h) => {
    const i = b.indexOf('</section>', b.indexOf(REGISTER));
    return `${b.slice(0, i)}${h}\n${b.slice(i)}`;
  }],
  'before-freedom': [['<section id="freedom"'], (b, h) => b.replace('<section id="freedom"', () => `${h}\n<section id="freedom"`)],
  // J: inside the Freedom section, after the board and before its torn edge
  'freedom-wall': [['<svg class="fx-div fx-div-torn"'], (b, h) => b.replace('<svg class="fx-div fx-div-torn"', () => `${h}\n<svg class="fx-div fx-div-torn"`)],
};

for (const [k, o] of Object.entries(OPTIONS)) {
  const { place } = STAY_OPTIONS[k];
  const [anchors, put] = PLACE[place];
  for (const a of anchors) if (!(typeof a === 'string' ? base.includes(a) : a.test(base))) throw new Error(`build-stay-options: "${place}" anchor ${a} not found in dist/index.html`);
  const html = stayOption(site, c, k);
  fs.writeFileSync(path.join(dist, `sc-${k}.html`), put(base, html)
    // The homepage's jump to #anchor does not survive its own load (the
    // frames opened at the top), so the frame repeats it once loaded.
    .replace(bodyRe, `<script>addEventListener('load', function () { var t = location.hash && document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView({ block: 'start', behavior: 'instant' }); }, 300); });</script>
</body>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Stay connected — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}

const card = (k, o) => {
  const src = `/sc-${k}.html#${o.anchor}`;
  return `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'You liked' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="where"><b>Placement</b> ${esc(o.where)}</p>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="${src}" target="_blank" rel="noopener">Open at the form ↗</a> <a href="/sc-${k}.html" target="_blank" rel="noopener">Open from the top ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1000"><iframe src="${src}" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="1000"></iframe></div><figcaption>Desktop · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="${src}" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;
};

// Where each option sits, top to bottom: [section, option letters, aside].
// A section name of '' is a slot between sections.
const optionsPage = (file, heading, lead, map, keys) => fs.writeFileSync(path.join(dist, file), `<!doctype html>
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
.map { margin:28px 0 0; padding:0; list-style:none; max-width:520px; border-left:2px solid #eee; }
.map li { position:relative; display:flex; align-items:center; gap:12px; min-height:30px; padding:2px 0 2px 18px; font-size:14px; color:var(--soft); }
.map li.slot { color:var(--ink); }
.map .pin { display:inline-grid; place-items:center; min-width:26px; height:26px; padding:0 8px; border-radius:999px; background:linear-gradient(92deg,var(--magenta),var(--cyan)); color:#fff; font:800 12px Montserrat, sans-serif; }
.map .gap { height:2px; flex:1; max-width:120px; background:repeating-linear-gradient(90deg,var(--magenta) 0 6px,transparent 6px 10px); }
.opt { margin-top:56px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.where { margin:6px 0 0; font-size:15px; } .where b { font:800 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--magenta); margin-right:8px; }
.note { color:var(--soft); margin:4px 0 0; max-width:860px; font-size:15px; }
.links { margin:10px 0 0; font:700 13px Montserrat, sans-serif; display:flex; flex-wrap:wrap; gap:6px 20px; } .links a { color:var(--magenta); }
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
  <ol class="map" aria-label="Where each option sits on the homepage">
    ${map.map(([name, pins = '', aside = '']) => `<li${pins ? ' class="slot"' : ''}>${name ? esc(name) : '<span class="gap" aria-hidden="true"></span>'}${aside ? ` <span>· ${esc(aside)}</span>` : ''}${[...pins].map(x => ` <span class="pin">${x}</span>`).join('')}</li>`).join('\n    ')}
  </ol>
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
const SHARED = `Every preview uses the real MultiplyOS form, so it loads and works: <b>anything submitted here is a real
     sign-up.</b> The form keeps its own card, title and logo; around it, each option says why to sign up (“Stay close ·
     Be the first to know”, our wording) rather than repeating its title. Scroll inside each preview, or open it full size.`;

optionsPage('stay-options.html', 'Stay connected — where and how on the homepage',
  `Six ways to bring the live MultiplyOS “Stay Connected” form (first name and email) onto the homepage, each a
     different place on the page and a different design. ${SHARED}
     <a href="/stay-options-2.html" style="color:var(--magenta);font-weight:700">Round two: the form in the first or second section →</a>`,
  [
    ['Hero and video'],
    ['Freedom memory wall', '', 'F starts sliding in after this'],
    ['Common struggles · healing and renewal'],
    ['Breakthrough panel', 'A'],
    ['Statement of faith'],
    ['', 'E'],
    ['Testimonies'],
    ['', 'B'],
    ['Find Freedom'],
    ['', 'C'],
    ['Footer', 'D'],
  ],
  keys(1));

optionsPage('stay-options-2.html', 'Stay connected — round two: near the top',
  `A, which you liked, now without its Register Now button, and four ways to put the form in the homepage’s first
     or second section: beside the hero’s video, closing the hero, opening the second section, or pinned to the
     Freedom wall. ${SHARED}
     <a href="/stay-options.html" style="color:var(--magenta);font-weight:700">← Round one</a>`,
  [
    ['Hero: headline and video', 'G'],
    ['Hero: Register Now'],
    ['', 'H'],
    ['', 'I'],
    ['Freedom memory wall', 'J'],
    ['Common struggles · healing and renewal'],
    ['Breakthrough panel', 'A'],
  ],
  ['panel', ...keys(2)]);

console.log('built dist/stay-options.html, -2.html + frames sc-*.html');
