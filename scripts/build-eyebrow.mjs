// Builds /eyebrow-options.html — treatments for "Rise Up Queens presents",
// the line above the Freedom logo.
//
// Each option is the real homepage with only that line swapped. The wrapper
// keeps the fr-eye class so it rises in with the rest of the section. Must run
// after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
// Matches the shipped credit (a div since option C) or the original line.
const EYE = /<(p|div) class="fr-eye[^"]*">[\s\S]*?<\/\1>/;
// The brush-stroke Freedom section this review page was built on was replaced
// by the memory wall (2026-10-10). Skip rather than fail the build; the page
// built before then stays in dist.
if (!EYE.test(home)) {
  console.log('build-eyebrow: skipped — the Freedom section it reviews is no longer on the homepage');
  process.exit(0);
}

const PINK = '/assets/brand/stroke-hook-lightpink.svg';
const TEAL = '/assets/brand/stroke-hook-teal.svg';

const OPTIONS = {
  now: {
    label: 'Before',
    note: 'For reference — the original single line of small pink letter-spaced capitals.',
    html: `<p class="fr-eye">Rise Up Queens presents</p>`,
  },
  credit: {
    label: 'A — Film credit',
    note: 'Set like the opening titles of a film: RISE UP QUEENS in wide-spaced capitals, then “presents” in a pink italic serif between two fine rules. Quiet, and the most elegant.',
    pick: true,
    html: `<div class="fr-eye ey ey-credit"><span class="a">Rise Up Queens</span><span class="b">presents</span></div>`,
  },
  script: {
    label: 'B — Script and caps',
    note: '“Rise Up Queens” in the same brush script as Common Struggles, in pink, with PRESENTS in small capitals beneath. Ties the section to the rest of the page.',
    html: `<div class="fr-eye ey ey-script"><span class="a">Rise Up Queens</span><span class="b">presents</span></div>`,
  },
  mark: {
    label: 'C — The logo',
    note: 'The Rise Up Queens logo itself, crown and all, with PRESENTS under it — brand presents event, the way a production company credit reads. Two logos, one above the other.',
    html: `<div class="fr-eye ey ey-mark"><img src="/assets/brand/logo-ruq-ink.png" alt="Rise Up Queens" width="480" height="249" decoding="async"><span class="b">presents</span></div>`,
  },
  badge: {
    label: 'D — Crown badge',
    note: 'A frosted pill with the pink crown from the logo, a fine pink edge, and a glint of light that crosses it as the section arrives.',
    html: `<div class="fr-eye ey ey-badge"><span class="pill"><img src="/assets/brand/crown-magenta.png" alt="" width="240" height="199" decoding="async"><span>Rise Up Queens presents</span></span></div>`,
  },
  brush: {
    label: 'E — Brush flicks',
    note: 'The line as it is now, held between two small flicks cut from the section’s own brush strokes — pink on the left, teal on the right, mirrored like the large ones.',
    html: `<div class="fr-eye ey ey-brush"><img class="fl fl-p" src="${PINK}" alt="" decoding="async"><span>Rise Up Queens presents</span><img class="fl fl-t" src="${TEAL}" alt="" decoding="async"></div>`,
  },
};

const CSS = `
.ey{display:flex;flex-direction:column;align-items:center;gap:6px;font:inherit;letter-spacing:normal;text-transform:none;color:inherit}
.ey img{display:block;height:auto}

/* A — film credit */
.ey-credit .a{font:700 clamp(12px,1.1vw,14px)/1.3 Montserrat,sans-serif;letter-spacing:.44em;padding-left:.44em;text-transform:uppercase;color:#1c1c1c}
.ey-credit .b{display:flex;align-items:center;gap:12px;font:italic 500 clamp(18px,1.6vw,22px)/1 'Cormorant Garamond',Georgia,serif;color:#dc1e88;letter-spacing:.02em}
.ey-credit .b::before,.ey-credit .b::after{content:"";width:34px;height:1px;background:linear-gradient(90deg,transparent,rgba(232,32,143,.6))}
.ey-credit .b::after{background:linear-gradient(90deg,rgba(232,32,143,.6),transparent)}

/* B — script and caps */
.ey-script{gap:12px}
.ey-script .a{font:400 clamp(34px,3.4vw,46px)/1 'Julietta Messie',cursive;color:#e8208f}
.ey-script .b{font:700 10px/1.4 Lato,sans-serif;letter-spacing:.42em;padding-left:.42em;text-transform:uppercase;color:#6b6b6b}

/* C — the logo */
.ey-mark{gap:8px}
.ey-mark img{width:clamp(108px,11vw,146px)}
.ey-mark .b{display:flex;align-items:center;gap:12px;font:700 10px/1.4 Lato,sans-serif;letter-spacing:.42em;padding-left:.42em;text-transform:uppercase;color:#6b6b6b}
.ey-mark .b::before,.ey-mark .b::after{content:"";width:26px;height:1px;background:rgba(28,28,28,.2)}

/* D — crown badge */
.ey-badge .pill{position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:10px;padding:8px 18px 8px 12px;border-radius:999px;
  background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);
  box-shadow:inset 0 0 0 1px rgba(232,32,143,.28),0 12px 30px -18px rgba(232,32,143,.75)}
.ey-badge .pill img{width:26px}
.ey-badge .pill span{font:700 11px/1.4 Lato,sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#dc1e88}
.ey-badge .pill::after{content:"";position:absolute;top:0;bottom:0;left:-40%;width:30%;transform:skewX(-20deg);
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.95),transparent);opacity:0}
.fr.is-in .ey-badge .pill::after{animation:ey-glint 1.3s cubic-bezier(.45,0,.25,1) .9s both}
@keyframes ey-glint{0%{left:-40%;opacity:1}100%{left:120%;opacity:1}}

/* E — brush flicks */
.ey-brush{flex-direction:row;gap:14px}
.ey-brush span{font:700 11px/1.4 Lato,sans-serif;letter-spacing:.32em;padding-left:.32em;text-transform:uppercase;color:#dc1e88}
.ey-brush .fl{width:58px}
.ey-brush .fl-p{transform:scaleX(-1) rotate(8deg)}
.ey-brush .fl-t{opacity:.45;transform:rotate(188deg)}
@media (max-width:479px){.ey-brush{gap:8px}.ey-brush .fl{width:30px}.ey-brush span{letter-spacing:.22em}}

@media (prefers-reduced-motion:reduce){.ey-badge .pill::after{display:none}}`;

for (const [k, o] of Object.entries(OPTIONS)) {
  const html = o.html ? home.replace(EYE, o.html) : home;
  fs.writeFileSync(path.join(dist, `ey-${k}.html`), html
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : k === 'now' ? ' now' : ''}">${k === 'mark' ? 'Live' : o.pick ? 'Recommended' : k === 'now' ? 'Before' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><button type="button" data-replay="${k}">↻ Replay</button> · <a href="/ey-${k}.html#freedom" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="560"><iframe data-k="${k}" src="/ey-${k}.html#freedom" title="${esc(o.label)}" loading="lazy" width="1440" height="560"></iframe></div><figcaption>Desktop · 1440 wide</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="560"><iframe data-k="${k}" src="/ey-${k}.html#freedom" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="560"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Eyebrow options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:820px; margin:10px 0 0; }
.opt { margin-top:52px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:820px; font-size:15px; }
.links { margin:6px 0 0; font:700 13px Montserrat, sans-serif; }
.links a, .links button { color:var(--magenta); background:none; border:0; padding:0; font:inherit; cursor:pointer; }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.now { background:var(--soft); } .tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
.pair { display:grid; gap:24px; margin-top:14px; }
@media (min-width:1100px) { .pair { grid-template-columns:1fr 300px; align-items:start; } }
figure { margin:0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
.pf { max-width:300px; }
.screen { position:relative; overflow:hidden; border-radius:14px; background:#111; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen.phone { border-radius:22px; box-shadow:0 0 0 7px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>“Rise Up Queens presents”</h1>
  <p class="lead">Five treatments for the line above the Freedom logo, each in the real homepage. Only that line changes —
     everything else is what ships now, including the brush-ribbon wave.</p>
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
  document.querySelectorAll('[data-replay]').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('iframe[data-k="' + b.dataset.replay + '"]').forEach(function (f) {
        f.src = '/ey-' + b.dataset.replay + '.html?r=' + Date.now() + '#freedom';
      });
    });
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'eyebrow-options.html'), page);
console.log('built dist/eyebrow-options.html + ' + Object.keys(OPTIONS).length + ' frames');
