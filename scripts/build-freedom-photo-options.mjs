// Builds the Freedom section redesign options, each built on the breakthrough
// CTA's photograph:
//
//   /freedom-photo-options.html  the first round (A–D)
//   /freedom-d-options.html      variants on D's background (D1–D4)
//
// Each option is a style of src/partials/freedom-photo.mjs, swapped into the
// built homepage as /freedomx-<key>.html, so the live section is untouched
// until one is chosen. Frames open at #freedom.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { freedomPhoto } from '../src/partials/freedom-photo.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const dist = path.join(ROOT, 'dist');
fs.copyFileSync(path.join(ROOT, 'src/styles/freedom-photo.css'), path.join(dist, 'freedom-photo.css'));

const PAGES = {
  'freedom-photo-options': {
    title: 'Freedom section — design options',
    lead: `Four redesigns of the Freedom section on the homepage, each built on the crowned group photograph
     from the “It’s time for your breakthrough” section. Same copy as today, set in Lato, the client’s font, with the
     Freedom wordmark and the wave into Common Struggles kept. Each adds the next date and a Reserve button, since
     this is where the event is introduced. Every preview is the real homepage, opened at the section; scroll inside
     it to see the sections around it. The live site has not changed yet.`,
    options: {
      cinema: {
        label: 'A — Cinematic',
        note: 'The photograph fills the section edge to edge under a deep fade. The copy sits in white over the quiet wall at the top, and the fade lifts away so the crowned women fill the bottom half. A slow push-in on the photo as you arrive, and soft magenta and teal light in the top corners. Dramatic and emotional: you see the room before you read about it.',
        pick: true,
      },
      veil: {
        label: 'B — Rising photo',
        note: 'Keeps the light, airy blush ground and the pink and teal brush strokes, so the page still opens bright after the dark hero. The photograph rises out of the bottom edge through a soft fade, with the women appearing beneath the copy as you scroll. The gentlest change from today.',
      },
      split: {
        label: 'C — Split',
        note: 'Half photograph, half copy. The photo fills the left side with a light magenta-to-teal tint and a frosted badge with the next dates; the copy sits left-aligned on blush beside it. Clean and editorial, like a magazine spread. On phones the photo stacks above the copy.',
      },
      glass: {
        label: 'D — Frosted glass',
        note: 'The photograph fills the section under a magenta-to-teal tint, and the copy sits on a large frosted-glass card floating over the middle, with the women visible all around it. The card rises in as you arrive. Modern and premium.',
      },
    },
  },
  'freedom-d-options': {
    title: 'Freedom section — variants on D',
    lead: `Four new designs that keep D’s background exactly — the crowned group photograph edge to edge under the
     magenta-to-teal tint, with a slow push-in as you arrive — and replace the frosted card with something bolder.
     Same copy, set in Lato, with the next date and a Reserve button. Every preview is the real homepage, opened at
     the section, with the animation live; open one full size to try the effects properly. The live site has not
     changed yet.`,
    options: {
      spot: {
        label: 'D1 — Spotlight',
        note: 'The room is dark, and a soft spotlight moves across it, lighting up the women as it passes. On a computer the light follows your mouse, so visitors can explore the room themselves; on phones it drifts on its own. A ribbon of pink-and-teal light sweeps through the Freedom wordmark every few seconds. The most interactive and the most memorable.',
        pick: true,
      },
      knock: {
        label: 'D2 — Knockout',
        note: 'A giant FREEDOM is cut right out of a dark veil, so the only place you see the women is through the letters, edge to edge across the page, with the photo slowly moving behind them. On phones the word stacks as FREE / DOM to stay huge. Bold, graphic, poster-like. (The giant word is in Lato; the script wordmark is left out of this one.)',
      },
      ribbon: {
        label: 'D3 — Glass ribbon',
        note: 'Instead of a box, a frosted-glass band runs edge to edge across the top of the photo, with a pink-to-teal line along its top and a light that glides along it. Wordmark, copy and the next date sit in one row inside it, and the women fill the whole space beneath. Elegant and architectural.',
      },
      duo: {
        label: 'D4 — Duotone poster',
        note: 'The photograph is recoloured entirely in the brand’s magenta and teal, like a concert poster, with film grain and colours that slowly shift. The white Freedom wordmark carries a light sweep, and the Reserve button turns white to stand out. The most striking and the most on-brand.',
      },
    },
  },
  'freedom-light-options': {
    title: 'Freedom section — light options',
    lead: `Four light designs on D’s background: the crowned group photograph edge to edge, slowly pushing in as you
     arrive, but on a bright, airy ground with dark type, so the page opens light after the dark hero, the way it
     does today. Same copy, set in Lato, with the next date and a Reserve button. Every preview is the real homepage,
     opened at the section, with the animation live; open one full size to try the effects properly. The live site
     has not changed yet.`,
    options: {
      lreveal: {
        label: 'L1 — Reveal',
        note: 'The light twin of the Spotlight. The photo sits under a soft white haze, and a clear window moves across it, showing the women in full colour where it passes. On a computer it follows your mouse, so visitors uncover the room themselves; on phones it drifts on its own. The copy keeps a soft glow behind it so it always reads.',
        pick: true,
      },
      lknock: {
        label: 'L2 — Light knockout',
        note: 'A giant FREEDOM cut out of a soft blush veil, so the women appear in full colour inside the letters, edge to edge, with a fine pink outline and the photo slowly moving behind them. On phones the word stacks as FREE / DOM. Bold but bright. (The giant word is in Lato; the script wordmark is left out of this one.)',
      },
      lduo: {
        label: 'L3 — Pastel dream',
        note: 'The photograph is washed into soft pastel pink, lilac and aqua, with colours that drift slowly, and a white glow behind the copy. Dreamy, feminine and calm, and very on-brand.',
      },
      lhalo: {
        label: 'L4 — Halo',
        note: 'The copy sits inside a large glowing white circle over the photo, ringed by a thin line of magenta-to-teal light that slowly turns, like a crown of light. The women fill the space around it. Elegant and iconic. On phones the circle becomes a rounded panel with a gradient rim.',
      },
    },
  },
  'freedom-ideas-options': {
    title: 'Freedom section — five new light ideas',
    lead: `Five light designs, each built on a different idea, so no two look alike, and each drawn from what Rise Up
     Queens is about: crowns, faith, sisterhood, the message itself, and the event as something to hold. Same copy,
     set in Lato, with the next date and a Reserve button. Every preview is the real homepage, opened at the section,
     with the animation live; open one full size to try the effects properly. The live site has not changed yet.`,
    options: {
      crown: {
        label: 'E1 — Crowned',
        note: 'A giant crown is drawn in a pink-to-teal line, then the crowned group photograph fades in inside it, so you see the women through the crown, with gems popping onto its points and sparkles twinkling around it. The copy sits beside it. The most “Queens” idea: it says who they become in one image.',
        pick: true,
      },
      arch: {
        label: 'E2 — Sanctuary',
        note: 'A church-window arch with a white frame and a fine gradient outline, holding a joyful event photo, under a soft pink-and-blue sky. Gentle rays of light pour down through it and small motes of light drift upward. Peaceful, faith-filled and luminous.',
      },
      wall: {
        label: 'E3 — Memory wall',
        note: 'Six real event photographs as taped polaroids, each with a one-word caption in script (Sisterhood, Held, Crowned, Breakthrough, Joy, Freedom), floating gently around a paper note that holds the copy. Hover one and it straightens and lifts. Warm, personal and real: it feels like the women’s own scrapbook.',
      },
      manifesto: {
        label: 'E4 — Manifesto',
        note: 'The paragraph itself becomes the hero, set huge. As you scroll, it lights up word by word from pale to ink, and the two key phrases glow in a pink-to-teal gradient. A rotating badge reads “Freedom · May 5–7, 2027 · 3-day intensive” around the pink crown. Bold, modern and confident; no photo needed.',
      },
      cover: {
        label: 'E5 — Cover story',
        note: 'Freedom as a magazine cover: a joyful event photo with the white Freedom wordmark as the masthead, cover lines drawn from the copy, a date and a barcode, stacked on a second pastel issue. It tilts in 3D toward your mouse with a gloss that follows. Playful, premium and very shareable.',
      },
    },
  },
  'freedom-wall-options': {
    title: 'Freedom section — Memory wall variants',
    lead: `Four takes on E3, the memory wall: the same polaroids and paper note, each with a richer background and its
     own hand-over into Common Struggles in place of the smooth wave, so the edge matches the scrapbook feel. The grab
     handle at the top of the panel has been removed. Every preview is the real homepage, opened at the section, with
     the animation live; hover a polaroid to lift it. The live Freedom section has not changed yet.`,
    options: {
      wtorn: {
        label: 'W1 — Torn paper',
        note: 'Warm paper with a soft fibre texture, sunlight in one corner and the pink and teal brush strokes. The section ends in a torn white paper edge with a soft shadow, as if Common Struggles is the next page torn from the same book. The most natural fit for polaroids and a note.',
        pick: true,
      },
      wlights: {
        label: 'W2 — String lights',
        note: 'A garland of twinkling fairy lights in warm gold, pink and teal runs across the top on a dreamy pink-to-lilac sky with soft bokeh. The polaroids hang from it on threads and little wooden pegs at different heights, swaying gently. The section ends in a scalloped edge with a dotted stitch. Romantic and celebratory, like the night of the event.',
      },
      wpaint: {
        label: 'W3 — Watercolour & doodles',
        note: 'Soft pink and teal watercolour blooms bleed across the background, and hand-drawn doodles (a crown, a heart, sparkles, a swirl) draw themselves in as you arrive. The section ends in a rough, painted brush edge in pink-to-teal. Creative, feminine and playful.',
      },
      wbook: {
        label: 'W4 — Journal page',
        note: 'A journal page: grid paper with a pink margin line, striped washi tape at the corners, an ink stamp reading “Freedom · Rise Up Queens · 2027” around “May 5–7”, and “Save the date!” handwritten with an arrow. The section ends in a pinking-shears zigzag with a dashed stitch line. Personal and crafted.',
      },
    },
  },
};

const sectionRe = /<section id="freedom"[\s\S]*?<\/section>/;
const base = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!sectionRe.test(base)) throw new Error('build-freedom-photo-options: Freedom section not found in dist/index.html');

// Lato 900 and the light italic are not in the site's font request yet.
const head = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300&display=swap">
<link rel="stylesheet" href="/freedom-photo.css">
</head>`;

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/freedomx-${k}.html#freedom" target="_blank" rel="noopener">Open on the homepage ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1000"><iframe src="/freedomx-${k}.html#freedom" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="1000"></iframe></div><figcaption>Desktop · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/freedomx-${k}.html#freedom" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

const page = (p) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.title)} — ${esc(site.brand.name)}</title>
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
  <h1>${esc(p.title)}</h1>
  <p class="lead">${p.lead}</p>
  ${Object.entries(p.options).map(([k, o]) => card(k, o)).join('')}
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
</body></html>`;

for (const [file, p] of Object.entries(PAGES)) {
  for (const [k, o] of Object.entries(p.options)) {
    fs.writeFileSync(path.join(dist, `freedomx-${k}.html`), base
      .replace('</head>', head)
      .replace(sectionRe, () => freedomPhoto(site, c, k))
      .replace(/<title>[\s\S]*?<\/title>/, `<title>Freedom — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
  }
  fs.writeFileSync(path.join(dist, `${file}.html`), page(p));
  console.log(`built dist/${file}.html + frames`);
}
