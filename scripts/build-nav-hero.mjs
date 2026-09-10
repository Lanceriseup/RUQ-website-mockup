// Builds /nav-hero.html — the five hero-overlay navs, each rendered over the
// real b-roll video so they can be judged in the context they'll live in.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HERO_VARIANTS, HERO_LABELS } from '../src/partials/nav-hero-variants.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const TRAITS = {
  E: { wow: 'Frosted glass over moving footage', motion: 'Blur + hover fills', risk: 'backdrop-blur costs GPU on low-end phones' },
  F: { wow: 'The transition itself', motion: 'Morphs on scroll', risk: 'Nothing to see at rest — no wow until you scroll' },
  G: { wow: 'Restraint and letter-spacing', motion: 'Hairline gradient only', risk: 'Needs a calm top edge on the video' },
  H: { wow: 'Hard colour edge against video', motion: 'Cyan underline wipes', risk: 'Asymmetry fights a centred hero headline' },
  I: { wow: 'Menu dims video but keeps it playing', motion: 'Staggered display type', risk: 'One extra click to every page' },
};

const heroBody = (key) => `
<section class="relative min-h-[640px] overflow-hidden bg-ink">
  <video class="absolute inset-0 h-full w-full object-cover opacity-50"
         poster="${esc(site.assets.heroVideo.poster)}" src="${esc(site.assets.heroVideo.src)}"
         autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>
  <div class="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/20 to-ink/70"></div>
  ${HERO_VARIANTS[key](site, '/index.html')}
  <div class="relative mx-auto flex min-h-[640px] max-w-content flex-col justify-center px-4 pt-28">
    <p class="font-body text-xs uppercase tracking-[0.3em] text-cyan">${esc(content.home.hero.eyebrow)}</p>
    <h1 class="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.05] text-white sm:text-6xl">${esc(content.home.hero.heading)}</h1>
    <p class="mt-5 max-w-xl font-body text-lg text-white/80">${esc(content.home.hero.sub)}</p>
    <p class="mt-8 font-body text-sm text-white/60">${esc(site.nextEvent.dates)} &middot; ${esc(site.nextEvent.location)}</p>
  </div>
</section>
<section class="bg-white px-4 py-20">
  <p class="mx-auto max-w-content font-body text-ink-soft">Scroll region — option F morphs its bar here.</p>
</section>`;

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">${heroBody(key)}<script src="/app.js" defer></script></body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hero nav options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Hero nav options</h1>
  <p class="mt-2 max-w-2xl text-ink-soft">Five overlay navs, each on the real b-roll video. These sit <em>on</em> the hero
     rather than above it, so each one answers legibility-over-moving-footage differently — scrim, blur, solid block,
     hairline, full-bleed. Mix and match: tell me which logo treatment, which link style, which CTA.</p>

  <div class="mt-4 flex flex-wrap gap-4 rounded-xl bg-magenta-tint p-4 text-sm">
    <span class="font-semibold">Palette:</span>
    <span class="flex items-center gap-2"><span class="inline-block h-4 w-4 rounded" style="background:#e8208f"></span>#e8208f</span>
    <span class="flex items-center gap-2"><span class="inline-block h-4 w-4 rounded" style="background:#00b9c6"></span>#00b9c6</span>
    <span class="flex items-center gap-2"><span class="inline-block h-4 w-4 rounded border border-ink/20" style="background:#fff"></span>#ffffff</span>
  </div>

  ${Object.keys(HERO_VARIANTS).map(k => `
  <section class="mt-14">
    <div class="flex flex-wrap items-baseline justify-between gap-3">
      <h2 class="font-display text-xl font-bold">
        <span class="mr-2 inline-grid h-8 w-8 place-items-center rounded-full bg-magenta text-sm text-white">${k}</span>
        ${esc(HERO_LABELS[k])}
      </h2>
      <div class="flex gap-2 text-xs">
        ${[['Desktop', '100%'], ['Mobile', '390px']].map(([lbl, w]) =>
          `<button type="button" data-w="${w}" data-frame="h${k}"
             class="wbtn min-h-11 rounded-full border border-ink/20 px-4 font-semibold hover:border-magenta hover:text-magenta-text">${lbl}</button>`).join('')}
        <a href="/nav-hero-${k}.html" target="_blank" rel="noopener"
           class="min-h-11 rounded-full bg-ink px-4 font-semibold leading-[2.75rem] text-white">Open full ↗</a>
      </div>
    </div>
    <dl class="mt-3 grid gap-2 text-sm sm:grid-cols-3">
      <div><dt class="font-semibold text-magenta-text">Wow</dt><dd class="text-ink-soft">${esc(TRAITS[k].wow)}</dd></div>
      <div><dt class="font-semibold text-magenta-text">Motion</dt><dd class="text-ink-soft">${esc(TRAITS[k].motion)}</dd></div>
      <div><dt class="font-semibold text-magenta-text">Trade-off</dt><dd class="text-ink-soft">${esc(TRAITS[k].risk)}</dd></div>
    </dl>
    <div class="mt-4 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe id="h${k}" src="/nav-hero-${k}.html" title="Hero nav ${k}" loading="lazy"
              class="block h-[560px] w-full border-0 bg-ink"></iframe>
    </div>
  </section>`).join('')}
</div>
<script>
document.querySelectorAll('.wbtn').forEach(function (b) {
  b.addEventListener('click', function () {
    var f = document.getElementById(b.dataset.frame);
    f.style.width = b.dataset.w;
    f.style.margin = b.dataset.w === '100%' ? '0' : '0 auto';
  });
});
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'nav-hero.html'), page);
for (const k of Object.keys(HERO_VARIANTS)) {
  fs.writeFileSync(path.join(dist, `nav-hero-${k}.html`), frame(k));
}
console.log('built nav-hero.html + ' + Object.keys(HERO_VARIANTS).length + ' hero frames');
