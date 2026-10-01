// Homepage hero: rotating headline, VSL, event dates, Register CTA.
//
// Stacked layout: small letter-spaced sans above, the rotating word oversized
// beneath it, then the rest of the sentence in sans. The word is heavy
// Montserrat filled with a magenta-to-cyan gradient — see .sheen.
//
// The three words share one inline-grid cell, so the widest ("passionate")
// sets the width once and the sentence does not reflow as it cycles.
//
// The header no longer carries a Register link — this button is the page's
// single primary action until the hero scrolls away and the capsule takes over.
import { esc } from './layout.mjs';

// Both sans lines of the headline — the one above the rotating word and the
// one below — share this. They are two halves of a single sentence, so they
// need identical size, weight, colour and tracking; defining it once stops
// them drifting apart again.
const SANS_LINE =
  'block font-display text-base font-bold uppercase leading-snug tracking-[0.2em] text-white sm:text-2xl';

// The VSL player, shared by the homepage and about heroes so the two cannot
// drift: same 16:9 frame, same bloom, same muted autoplay and the same
// "Tap for sound" badge. vsl.js mounts the Wistia player into the one
// [data-vsl-id] on the page, and build.mjs loads it whenever that attribute is
// present. `gap` is the space above it, which each hero tunes for phones.
export const vslPlayer = (id, gap = 'mt-10 sm:mt-16') => `
    <!-- VSL: full 16:9 frame with a cyan spotlight.
         Plays muted and looping on load; clicking unmutes and restarts. See
         vsl.js — the Wistia player is mounted into the div below. -->
    <div class="relative mx-auto ${gap} max-w-4xl" data-vsl-id="${esc(id)}">

      <!-- Cyan bloom. Deliberately restrained: wider and more diffuse than a
           tight halo, at low alpha, so it reads as the frame sitting in light
           rather than as a glow effect applied to it. Scales and fades rather
           than animating blur, so it composites. -->
      <div aria-hidden="true" class="vsl-bloom pointer-events-none absolute -inset-x-28 -inset-y-20 -z-10 blur-3xl"
           style="background:radial-gradient(50% 50% at 50% 50%,rgba(0,185,198,.3),transparent 74%)"></div>

      <!-- Full 16:9 from the start, at the column's full width. This used to
           sit at 41.84% (1/2.39) and unfold to 9/16 on the first real view,
           which hid a quarter of the picture until sound was turned on.
           Chosen from /vsl-size-options.html (option A). The inline padding
           overrides the 2.39:1 default on .vsl-frame. -->
      <div data-vsl-stage class="vsl-stage relative overflow-hidden ring-1 ring-cyan/40 shadow-[0_0_100px_-20px_rgba(0,185,198,.48),0_40px_90px_-45px_rgba(0,0,0,.85)]">
        <div class="vsl-frame relative h-0 w-full overflow-hidden" style="padding-bottom:56.25%">
        <div class="absolute inset-0 [&>div]:h-full [&>div]:w-full">
          <div class="wistia_embed wistia_async_${esc(id)} videoFoam=true h-full w-full">&nbsp;</div>
        </div>

        <!-- Vignette, over the player but not catching clicks. -->
        <div aria-hidden="true" class="pointer-events-none absolute inset-0 z-10"
             style="box-shadow:inset 0 0 140px 40px rgba(0,0,0,.72)"></div>

        </div>

        <button type="button" class="vsl-sound absolute bottom-4 right-4 z-20 flex min-h-11 items-center gap-2 rounded-full bg-ink/70 px-4 font-body text-[11px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan">
          <svg class="vsl-icon-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6"/></svg>
          <svg class="vsl-icon-on hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>
          <span class="vsl-label">Tap for sound</span>
        </button>
      </div>
    </div>`;

// The two event dates under the Register button, shared by the homepage and
// about heroes. Each date carries a small label in a brand hue, so a visitor
// can tell the next event from the one after it at a glance; the second date
// is no longer dimmed. Chosen from /dates-options.html (option B, without the
// "limited spots" note). Pink is the magenta tint #f0569f rather than
// magenta itself, which reads too dark at 10px on ink.
const PIN = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true" class="opacity-80"><path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';

export const eventDates = (site) => {
  const [first, second] = site.nextEvent.upcoming;
  const one = (e, label, tone) => `
        <div>
          <p class="font-display text-[10px] font-extrabold uppercase tracking-[0.18em] ${tone} sm:text-[11px]">${label}</p>
          <p class="mt-1.5 font-display text-base font-bold leading-snug text-white sm:text-xl">${esc(e.dates)}</p>
          <p class="mt-1 flex items-center justify-center gap-[5px] font-body text-[11px] font-bold uppercase tracking-[0.18em] text-white/70 sm:text-xs">${PIN}${esc(e.location)}</p>
        </div>`;
  return `
      <div class="flex items-stretch gap-[18px] text-center sm:gap-10">${one(first, 'Next event', 'text-[#f0569f]')}
        <div aria-hidden="true" class="w-px bg-white/25"></div>${one(second, 'Also coming', 'text-cyan')}
      </div>`;
};

export const hero = (site, c) => {

  // Duotone: the word is transparent and filled by a magenta-to-cyan gradient,
  // with a highlight band that sweeps across once each time a word arrives,
  // so every word gets the same pass. See .sheen and .hero-rotator in
  // tailwind.css — they also carry the no-background-clip fallback and hold
  // still under prefers-reduced-motion.
  //
  // clamp() rather than breakpoints: the word has to scale smoothly because
  // "passionate" is nearly twice the width of "joyful", and a step change at a
  // breakpoint would be visible mid-rotation.
  const words = c.home.hero.rotatingWords.map((w, i) =>
    `<span class="hero-word sheen ${i === 0 ? 'is-on' : ''} font-display font-extrabold uppercase"
       style="grid-area:1/1;font-size:clamp(2.75rem,9vw,6rem);line-height:1;letter-spacing:-.01em">${esc(w)}</span>`
  ).join('');

  return `
<section class="relative overflow-hidden bg-ink">
  <video id="hero-video" class="absolute inset-0 h-full w-full object-cover opacity-50"
         poster="${esc(site.assets.heroVideo.poster)}"
         autoplay muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"
         data-src="${esc(site.assets.heroVideo.src)}"></video>

  <!-- Vignette: darkness at the edges, footage bright through the middle. The
       video runs at 50% here against 25% for the flat wash it replaces, so
       twice as much of it survives. -->
  <div class="absolute inset-0"
       style="background:radial-gradient(78% 62% at 50% 46%,rgba(28,28,28,.45),rgba(28,28,28,.9) 100%)"></div>

  <!-- Text band. A pure vignette leaves the middle bright, and the headline's
       magenta gradient stop measured 1.99:1 there — unreadable. This darkens
       only the top and bottom, where the words are, and stays clear through
       the centre where the VSL sits. Headline and dates land at 3.35 and 3.39
       for magenta, the worst case of the palette. -->
  <div class="absolute inset-0"
       style="background:linear-gradient(to bottom,rgba(28,28,28,.68) 0%,rgba(28,28,28,0) 34%,rgba(28,28,28,0) 62%,rgba(28,28,28,.58) 100%)"></div>

  <!-- pt clears the overlaid header: 161px now the Register row is gone. -->
  <div class="relative mx-auto max-w-4xl px-4 pb-20 sm:pb-36 pt-24 text-center sm:pt-52">

    <h1 class="text-white">
      <span class="${SANS_LINE}">${esc(c.home.hero.headingBefore)}</span>

      <!-- Gaps are mobile-tightened. 12px and 28px were judged at desktop size,
           where the rotating word is 96px tall and needs that much air to sit
           apart from the sans lines. On a phone the clamp() bottoms out at
           44px, so the same margins hold a much smaller word apart and the
           sentence reads as three stacked lines rather than one thought.
           8px and 12px below sm; the shipped values return at sm.

           Worth knowing if this is revisited: the closing line needs two rows
           at any readable size — fitting it on one at 390px would take roughly
           11px type — so tightening its tracking buys nothing in height. The
           gaps were the only real saving available without resizing. -->
      <span class="mt-2 sm:mt-3 block">
        <span class="hero-rotator relative inline-grid" data-swap="fade">${words}</span>
      </span>

      <span class="mt-3 sm:mt-7 ${SANS_LINE}">${esc(c.home.hero.headingAfter)}</span>
    </h1>
    <!-- The rotator swaps text under assistive tech, so the sentence is also
         announced once, statically, for screen readers. -->
    <p class="sr-only">${esc(c.home.hero.headingBefore)} ${esc(c.home.hero.rotatingWords.join(', '))} ${esc(c.home.hero.headingAfter)}</p>

    ${vslPlayer(c.home.vsl.wistiaId)}

    <!-- Divided: action first, then the two dates either side of a hairline.
         The rule does the organising instead of boxes, which is what keeps
         this to roughly 112px against the marquee's ~180px.
         Note: this treatment has no room for the LIMITED SPOTS badge or the
         eyebrow — both are still in site.json and one line away if wanted. -->
    <div class="mt-8 sm:mt-12 flex flex-col items-center gap-5">
      <a href="${esc(site.nextEvent.ctaUrl)}"
         class="group inline-flex min-h-11 items-center gap-3 rounded-full bg-magenta px-9 py-4 font-body text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_16px_36px_-16px_rgba(232,32,143,.9)] transition hover:bg-magenta-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-magenta">
         ${esc(site.nextEvent.ctaText)}
         <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
              class="transition-transform group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>

      ${eventDates(site)}
    </div>
  </div>
</section>`;
};
