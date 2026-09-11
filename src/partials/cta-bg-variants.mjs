// CTA backgrounds built from CSS and SVG — no photography.
//
// A generated ground has one real advantage over a photo here: it cannot
// compete with the form. The photo version had a face and a hand in it, both
// of which pull the eye away from the two fields that are the entire point of
// the section.
//
// Anything that animates does so on transform and opacity only, and every
// animation is disabled under prefers-reduced-motion. Blur is set once and
// never animated — animating a blur radius re-rasterises the layer every
// frame and is the usual cause of a janky hero.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

export const CTA_BGS = {
  aurora: {
    label: 'Aurora — brand light drifting behind the card',
    note: 'Four large blurred brand blobs moving slowly on different cycles, so the ground never quite repeats. The most alive of the six without anything literal in frame.',
  },
  rays: {
    label: 'Rays — a conic burst radiating from behind the form',
    note: 'A conic gradient fans out from the centre in alternating brand tones, rotating almost imperceptibly. Puts the card at the centre of something rather than on top of it.',
  },
  grain: {
    label: 'Grain — deep brand gradient under fine film noise',
    note: 'A rich magenta-to-cyan field with a noise layer over it. The grain is what stops a big gradient looking like a default CSS gradient, and it hides banding on cheap screens.',
  },
  arcs: {
    label: 'Arcs — concentric hairlines expanding outward',
    note: 'Large thin rings in brand colour on deep ink, with the card sitting over their centre. Geometric and calm; the most restrained option here.',
  },
  mesh: {
    label: 'Mesh — soft blended colour field, still',
    note: 'A layered radial mesh with no motion at all. Premium in the way good packaging is: rich, considered and completely quiet. Cheapest to render.',
  },
  spotlight: {
    label: 'Spotlight — a cone of light falling on the card',
    note: 'A widening beam from above picks out the form against near-black. The most theatrical, and it echoes the VSL treatment further up the page.',
  },
};

// One form, used by all six. Fields stay disabled — the endpoint does not
// exist yet, and a disabled field cannot swallow a real signup.
const form = (c, opts = {}) => {
  const { buttonBg = MAGENTA, buttonText = '#fff' } = opts;
  return `
<form action="#" method="post" novalidate class="mt-8 space-y-4">
  ${c.home.cta.fields.map(f => `
  <div>
    <label for="cta-${esc(f.name)}" class="sr-only">${esc(f.label)}</label>
    <input id="cta-${esc(f.name)}" name="${esc(f.name)}" type="${esc(f.type)}"
           placeholder="${esc(f.label)}" disabled
           class="w-full rounded-xl border border-white/25 bg-white/92 px-4 py-3.5 font-body text-ink
                  placeholder:text-ink-soft/70 disabled:cursor-not-allowed">
  </div>`).join('')}
  <button type="submit" disabled
          class="flex min-h-11 w-full items-center justify-center gap-3 rounded-xl px-6 py-4 font-body text-sm font-bold uppercase tracking-[0.2em] disabled:cursor-not-allowed"
          style="background:${buttonBg};color:${buttonText}">
    ${esc(c.home.cta.button)}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  </button>
</form>`;
};

const card = (c, inner, cardStyle, headingTone = 'text-white') => `
<div class="relative mx-auto max-w-xl px-6">
  <div class="rounded-[2rem] p-9 ring-1 ring-white/25 shadow-[0_40px_90px_-40px_rgba(0,0,0,.85)]" style="${cardStyle}">
    <h2 class="text-center font-display text-3xl font-bold leading-tight ${headingTone} sm:text-[2.5rem]">${esc(c.home.cta.heading)}</h2>
    ${inner}
  </div>
</div>`;

const GLASS = 'background:rgba(255,255,255,.12);backdrop-filter:blur(26px) saturate(1.4);-webkit-backdrop-filter:blur(26px) saturate(1.4)';

export const renderCtaBg = (site, c, key) => {
  if (key === 'aurora') {
    return `
<section class="relative overflow-hidden bg-ink py-28">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0">
    <div class="cta-blob cta-blob-1 absolute h-[36rem] w-[36rem] rounded-full blur-3xl" style="background:radial-gradient(circle,${MAGENTA}aa,transparent 66%)"></div>
    <div class="cta-blob cta-blob-2 absolute h-[32rem] w-[32rem] rounded-full blur-3xl" style="background:radial-gradient(circle,${CYAN}99,transparent 66%)"></div>
    <div class="cta-blob cta-blob-3 absolute h-[28rem] w-[28rem] rounded-full blur-3xl" style="background:radial-gradient(circle,#f0569f88,transparent 68%)"></div>
    <div class="cta-blob cta-blob-4 absolute h-[24rem] w-[24rem] rounded-full blur-3xl" style="background:radial-gradient(circle,${CYAN}77,transparent 70%)"></div>
  </div>
  ${card(c, form(c), GLASS)}
</section>`;
  }

  if (key === 'rays') {
    return `
<section class="relative overflow-hidden bg-ink py-28">
  <div aria-hidden="true" class="cta-rays pointer-events-none absolute left-1/2 top-1/2 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 opacity-45"
       style="background:conic-gradient(from 0deg,${MAGENTA}00,${MAGENTA}66 8%,${MAGENTA}00 16%,${CYAN}00 24%,${CYAN}66 32%,${CYAN}00 40%,${MAGENTA}00 48%,${MAGENTA}55 56%,${MAGENTA}00 64%,${CYAN}00 72%,${CYAN}55 80%,${CYAN}00 88%,${MAGENTA}00 100%)"></div>
  <div aria-hidden="true" class="pointer-events-none absolute inset-0" style="background:radial-gradient(50% 50% at 50% 50%,rgba(28,28,28,.55),rgba(28,28,28,.92))"></div>
  ${card(c, form(c), GLASS)}
</section>`;
  }

  if (key === 'grain') {
    return `
<section class="relative overflow-hidden py-28" style="background:linear-gradient(135deg,${MAGENTA},#d0338f 38%,#4b5fa8 68%,${CYAN})">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 opacity-[.22]"
       style="background-image:url(&quot;data:image/svg+xml;utf8,&lt;svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'&gt;&lt;filter id='n'&gt;&lt;feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/&gt;&lt;/filter&gt;&lt;rect width='150' height='150' filter='url(%23n)' opacity='.6'/&gt;&lt;/svg&gt;&quot;)"></div>
  <div aria-hidden="true" class="pointer-events-none absolute inset-0" style="background:radial-gradient(70% 70% at 50% 50%,transparent,rgba(28,28,28,.45))"></div>
  ${card(c, form(c, { buttonBg: '#1c1c1c' }), 'background:rgba(255,255,255,.96)', 'text-ink')}
</section>`;
  }

  if (key === 'arcs') {
    return `
<section class="relative overflow-hidden bg-ink py-28">
  <svg aria-hidden="true" class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" width="1400" height="1400" viewBox="0 0 1400 1400" fill="none">
    ${[660, 560, 460, 360, 260, 160].map((r, i) =>
      `<circle cx="700" cy="700" r="${r}" stroke="${i % 2 ? CYAN : MAGENTA}" stroke-opacity="${(0.30 - i * 0.035).toFixed(2)}" stroke-width="1"/>`).join('')}
  </svg>
  <div aria-hidden="true" class="pointer-events-none absolute inset-0" style="background:radial-gradient(46% 46% at 50% 50%,rgba(232,32,143,.18),transparent 70%)"></div>
  ${card(c, form(c), GLASS)}
</section>`;
  }

  if (key === 'mesh') {
    return `
<section class="relative overflow-hidden py-28"
         style="background:
           radial-gradient(42% 55% at 12% 18%, ${MAGENTA}55, transparent 62%),
           radial-gradient(46% 56% at 88% 24%, ${CYAN}4d, transparent 64%),
           radial-gradient(52% 60% at 28% 88%, #f0569f4d, transparent 66%),
           radial-gradient(46% 52% at 78% 84%, ${CYAN}40, transparent 66%),
           #16161a">
  ${card(c, form(c), GLASS)}
</section>`;
  }

  // spotlight — a cone of light from above
  return `
<section class="relative overflow-hidden py-28" style="background:#0d0d10">
  <div aria-hidden="true" class="pointer-events-none absolute -top-40 left-1/2 h-[52rem] w-[46rem] -translate-x-1/2 blur-2xl"
       style="background:conic-gradient(from 168deg at 50% 0%,transparent 0deg,rgba(0,185,198,.30) 12deg,rgba(255,255,255,.22) 24deg,rgba(232,32,143,.28) 36deg,transparent 48deg)"></div>
  <div aria-hidden="true" class="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
       style="background:radial-gradient(circle,rgba(0,185,198,.28),transparent 70%)"></div>
  ${card(c, form(c), GLASS)}
</section>`;
};
