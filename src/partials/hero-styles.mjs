// Six distinct hero directions — different type systems, not variations on one.
//
// Each pairs a different font strategy with a different visual technique, so
// the question being answered is "what kind of brand is this" rather than
// "where do the words sit". Only the copy is held constant.
import { esc } from './layout.mjs';

export const STYLES = {
  masked: {
    label: 'Photographic type — the word is cut out of the imagery',
    fonts: 'Montserrat 800',
    tech: 'background-clip:text over the event photography',
    note: 'The rotating word is a window onto the b-roll rather than a coloured word. Uses the client\'s own footage as the ornament, so it cannot look generic. Biggest single wow, and it needs no third colour.',
  },
  luxe: {
    label: 'Luxe serif — Cormorant, enormous, mostly space',
    fonts: 'Cormorant Garamond 300 + Montserrat',
    tech: 'Hairline rules, wide tracking, lowercase',
    note: 'The high-end route: a light serif at large size with a lot of air around it. Cormorant is already in the RUK family — NLB uses it — so this is consistent rather than invented.',
  },
  statement: {
    label: 'Statement — heavy sans, tight, colour block',
    fonts: 'Montserrat 800 only',
    tech: 'Solid magenta block behind the rotating word',
    note: 'No script at all. Confident modern sans set tight, with the changing word sitting in a magenta block that resizes to fit it. Reads contemporary and decisive rather than pretty.',
  },
  outline: {
    label: 'Outline and fill — layered poster type',
    fonts: 'Montserrat 800',
    tech: 'Stroked ghost word offset behind the solid one',
    note: 'The word is set twice: an outlined copy offset behind a solid one. Fashion-poster device that gives flat type depth without any imagery.',
  },
  duotone: {
    label: 'Duotone gradient type with a moving sheen',
    fonts: 'Montserrat 800',
    tech: 'magenta→cyan gradient text, animated highlight',
    note: 'The word carries a gradient across both brand colours with a slow highlight travelling through it. The only option that uses magenta and cyan together at scale.',
  },
  editorial: {
    label: 'Editorial rule — Italiana, letter-spaced, framed',
    fonts: 'Italiana + Montserrat',
    tech: 'Thin double rules above and below, wide tracking',
    note: 'Magazine masthead treatment. Very thin display face, generous letter-spacing, framed by hairlines. The most restrained, and the most obviously "designed".',
  },
};

const rotator = (c, inner, swap = 'fade', extraCls = '', style = '') => `
  <span class="hero-rotator relative inline-grid ${extraCls}" data-swap="${esc(swap)}" style="${style}">
    ${c.home.hero.rotatingWords.map((w, i) => inner(w, i)).join('')}
  </span>`;

export const renderHeroStyle = (site, c, key) => {
  const W = c.home.hero;
  const sr = `<p class="sr-only">${esc(W.headingBefore)} ${esc(W.rotatingWords.join(', '))} ${esc(W.headingAfter)}</p>`;

  if (key === 'masked') {
    return `
<div class="text-center">
  <p class="font-display text-lg font-bold uppercase tracking-[0.28em] text-white/70 sm:text-xl">${esc(W.headingBefore)}</p>
  ${rotator(c, (w, i) => `
    <span class="hero-word ${i === 0 ? 'is-on' : ''} font-display font-extrabold uppercase"
          style="grid-area:1/1;font-size:clamp(3rem,11vw,7.5rem);line-height:.9;letter-spacing:-.02em;
                 background-image:url('${esc(site.assets.heroPoster)}');background-size:cover;background-position:center 30%;
                 -webkit-background-clip:text;background-clip:text;color:transparent;
                 filter:contrast(1.15) saturate(1.2)">${esc(w)}</span>`, 'fade', 'mt-2')}
  <p class="mt-6 font-display text-base font-bold uppercase leading-snug tracking-[0.2em] text-white sm:text-2xl">${esc(W.headingAfter)}</p>
  ${sr}
</div>`;
  }

  if (key === 'luxe') {
    return `
<div class="text-center">
  <div class="mx-auto h-px w-16 bg-white/30"></div>
  <p class="mt-8 font-body text-xs uppercase tracking-[0.42em] text-white/60">${esc(W.headingBefore)}</p>
  ${rotator(c, (w, i) => `
    <span class="hero-word ${i === 0 ? 'is-on' : ''}"
          style="grid-area:1/1;font-family:'Cormorant Garamond',serif;font-weight:300;font-style:italic;
                 font-size:clamp(3.5rem,10vw,7rem);line-height:1;color:#fff">${esc(w)}</span>`, 'fade', 'mt-6')}
  <p class="mx-auto mt-10 max-w-xl font-body text-sm font-light uppercase leading-relaxed tracking-[0.3em] text-white/75">${esc(W.headingAfter)}</p>
  <div class="mx-auto mt-10 h-px w-16 bg-white/30"></div>
  ${sr}
</div>`;
  }

  if (key === 'statement') {
    return `
<div class="text-left">
  <h1 class="font-display font-extrabold uppercase text-white" style="font-size:clamp(2.25rem,7vw,5rem);line-height:.95;letter-spacing:-.02em">
    <span class="block">${esc(W.headingBefore)}</span>
    ${rotator(c, (w, i) => `
      <span class="hero-word ${i === 0 ? 'is-on' : ''} bg-magenta px-4 py-1 text-white"
            style="grid-area:1/1;line-height:1.05">${esc(w)}</span>`, 'wipe', 'my-2 justify-items-start')}
    <span class="block">${esc(W.headingAfter)}</span>
  </h1>
  ${sr}
</div>`;
  }

  if (key === 'outline') {
    return `
<div class="text-center">
  <p class="font-display text-base font-bold uppercase tracking-[0.28em] text-cyan sm:text-lg">${esc(W.headingBefore)}</p>
  ${rotator(c, (w, i) => `
    <span class="hero-word ${i === 0 ? 'is-on' : ''} relative font-display font-extrabold uppercase text-white"
          style="grid-area:1/1;font-size:clamp(3rem,10vw,6.5rem);line-height:1;letter-spacing:-.01em">
      <span aria-hidden="true" class="absolute left-1.5 top-1.5 -z-10 text-transparent"
            style="-webkit-text-stroke:2px rgba(232,32,143,.85)">${esc(w)}</span>
      ${esc(w)}
    </span>`, 'rise', 'mt-4')}
  <p class="mt-8 font-display text-base font-bold uppercase leading-snug tracking-[0.2em] text-white/85 sm:text-xl">${esc(W.headingAfter)}</p>
  ${sr}
</div>`;
  }

  if (key === 'duotone') {
    return `
<div class="text-center">
  <p class="font-display text-base font-bold uppercase tracking-[0.28em] text-white/70 sm:text-lg">${esc(W.headingBefore)}</p>
  ${rotator(c, (w, i) => `
    <span class="hero-word sheen ${i === 0 ? 'is-on' : ''} font-display font-extrabold uppercase"
          style="grid-area:1/1;font-size:clamp(3rem,10vw,6.5rem);line-height:1;letter-spacing:-.01em">${esc(w)}</span>`, 'fade', 'mt-3')}
  <p class="mt-8 font-display text-base font-bold uppercase leading-snug tracking-[0.2em] text-white sm:text-xl">${esc(W.headingAfter)}</p>
  ${sr}
</div>`;
  }

  // editorial
  return `
<div class="text-center">
  <div class="mx-auto max-w-3xl border-y border-white/25 py-10">
    <p class="font-body text-[11px] uppercase tracking-[0.45em] text-white/60">${esc(W.headingBefore)}</p>
    ${rotator(c, (w, i) => `
      <span class="hero-word ${i === 0 ? 'is-on' : ''}"
            style="grid-area:1/1;font-family:'Italiana',serif;font-size:clamp(3rem,9vw,6rem);
                   line-height:1.05;letter-spacing:.06em;color:#fff">${esc(w)}</span>`, 'fade', 'mt-5')}
    <p class="mt-6 font-body text-[11px] uppercase tracking-[0.32em] text-white/70">${esc(W.headingAfter)}</p>
  </div>
  ${sr}
</div>`;
};
