// Builds /contact-photo-options.html — four photo-led redesigns of the Contact
// page, each showing the support email (src/partials/contact-photo.mjs).
//
// Each frame is the real contact page with <main> swapped for one option and
// the header switched to suit it: over-photo (white type) on the dark ones,
// clear (ink type) on the light ones.
//
// Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { header } from '../src/partials/nav.mjs';
import { contactPhoto, CONTACT_PHOTO } from '../src/partials/contact-photo.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const vids = read('src/data/videos.json');
const dist = path.join(ROOT, 'dist');
fs.copyFileSync(path.join(ROOT, 'src/styles/contact-photo.css'), path.join(dist, 'contact-photo.css'));
const page = fs.readFileSync(path.join(dist, 'contact.html'), 'utf8');

const headerRe = /<header id="site-nav"[\s\S]*?<\/header>/;
const mainRe = /<main id="main">[\s\S]*?<\/main>/;
if (!headerRe.test(page) || !mainRe.test(page)) throw new Error('build-contact-photo-options: header or main not found in dist/contact.html');

const OPTIONS = {
  glass: {
    label: 'P1 — Cinematic glass',
    note: 'A warm photo of women in conversation fills the top of the page under a deep fade, slowly pushing in as it loads. “Contact” in the pink script, the lead, a glass email card with a one-tap Copy button and the socials sit on the left; the form floats on frosted glass on the right. Rise Up Kings and the videos follow on white. The most dramatic and premium.',
    pick: true,
  },
  split: {
    label: 'P2 — Split screen',
    note: 'A tall photograph of an embrace fills the left half and stays in place as you scroll, with “Come as you are.” in script over it. The right half is calm and bright: the heading, the email card, the form, the socials and Rise Up Kings in one column. Elegant and editorial; on phones the photo sits on top.',
  },
  ways: {
    label: 'P3 — Three ways to reach us',
    note: 'The big group photo sits behind a soft blush veil, so the page stays light and airy. One white panel opens with three ways to reach us side by side — the email (with Copy), the socials and Rise Up Kings — and the form runs full width beneath with “Or send us a message”. The clearest and most organised.',
  },
  letter: {
    label: 'P4 — The email as the headline',
    note: 'The embrace photo recoloured in brand magenta, purple and teal, with “Contact” in white script and the email address itself set huge as the headline, with Send an email and Copy buttons beneath. The form card rises over the photo’s lower edge with a pink-to-teal line along its top. Bold and unmistakable: nobody will miss how to reach you.',
  },
};

const head = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300&display=swap">
<link rel="stylesheet" href="/contact-photo.css">
<meta name="robots" content="noindex,nofollow">
</head>`;

const GLASS = {
  gday: {
    label: 'G1 — Daylight',
    note: 'P1’s layout made light: the same photo of women in conversation, washed with soft white from the left so the heading, email and socials sit in dark type on a bright ground, and the women show clearly on the right. The form is a solid white card with a soft pink glow. Airy and welcoming.',
  },
  gduo: {
    label: 'G2 — Brand duotone',
    note: 'The big group photo recoloured in brand magenta, purple and teal with fine film grain, the colours slowly drifting. “Contact” glows white, and the glass form card has a pink-to-teal edge that slowly travels around it. The most on-brand and striking.',
    pick: true,
  },
  gimm: {
    label: 'G3 — Immersive',
    note: 'The photo stays fixed behind the whole page as you scroll, so the form, then the Rise Up Kings card and the videos, all glide up over it on frosted glass. Everything lives in one continuous scene rather than ending in a white section.',
  },
  ggold: {
    label: 'G4 — Golden hour',
    note: 'Warm amber light glows in from the top corner over the photo, fading into deep rose, like an evening session. “Contact” is lettered in a peach-to-pink gradient, and the form is a solid white card with a warm glow and a gold-to-pink-to-teal line along its top. Warm and premium.',
  },
};

for (const [k, o] of Object.entries({ ...OPTIONS, ...GLASS })) {
  const dark = CONTACT_PHOTO[k].dark;
  fs.writeFileSync(path.join(dist, `cxp-${k}.html`), page
    .replace(headerRe, () => header(site, '/contact.html', dark ? { overHero: true, scrim: false } : { clear: true }))
    .replace(mainRe, () => `<main id="main">${contactPhoto(site, c, vids, k)}</main>`)
    .replace('</head>', head)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Contact — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/cxp-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1300"><iframe src="/cxp-${k}.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="1300"></iframe></div><figcaption>Desktop · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/cxp-${k}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · scrolls</figcaption></figure>
  </div>
</article>`;

const pageHtml = (title, intro, opts) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} — ${esc(site.brand.name)}</title>
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
  <h1>${esc(title)}</h1>
  <p class="lead">${intro}</p>
  ${Object.entries(opts).map(([k, o]) => card(k, o)).join('')}
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

fs.writeFileSync(path.join(dist, 'contact-photo-options.html'), pageHtml('Contact page — photo-led redesign',
  `Four new layouts for the Contact page, each with an event photograph behind it in place of the bright
     sky, and the support email <strong>${esc(c.contact.email)}</strong> shown prominently with a one-tap Copy button.
     Everything on today’s page is kept: the form, socials, Rise Up Kings and the two videos. All set in Lato. The form
     is still switched off until it is connected to somewhere that receives the messages. The live site has not
     changed yet.`, OPTIONS));
fs.writeFileSync(path.join(dist, 'contact-glass-options.html'), pageHtml('Contact page — variants on P1',
  `Four takes on P1, Cinematic glass: the same layout — “Contact”, the email card and socials on the left, the form
     on the right, over a full-width photograph — each with a different photo treatment and card. The support email
     <strong>${esc(c.contact.email)}</strong> with its Copy button, the form, Rise Up Kings and the videos are in all
     four. The form is still switched off until it is connected. The live site has not changed yet.`, GLASS));
console.log('built dist/contact-photo-options.html and dist/contact-glass-options.html + frames');
