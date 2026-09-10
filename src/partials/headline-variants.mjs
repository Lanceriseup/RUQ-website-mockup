// Premium headline treatments, built on what NLB actually does.
//
// Why the current one reads cheap, having compared them directly:
//
//   1. FONT. Great Vibes is formal copperplate calligraphy — thin, spindly,
//      wedding-invitation. NLB uses Julietta Messie, a brush script with
//      confident varying stroke weight. At display size the difference is the
//      whole effect.
//   2. SCALE. NLB sets the script at text-7xl→9xl (72–128px) on its own line.
//      Ours is inline at roughly body-headline size, so it reads as a mistake
//      rather than a decision.
//   3. LINE-HEIGHT. NLB uses 0.8 on the inline script so it tucks into the
//      sans around it. Ours sits at 1 and floats.
//   4. THE RULE. A mechanical 3px bar under a hand-drawn script is the tell.
//      NLB draws a swash — an actual curve with varying width.
//
// Each option below fixes some subset of those, so they can be compared.
import { esc } from './layout.mjs';

const BRUSH = "'Julietta Messie', cursive";

// Hand-drawn underline. A single stroke with a slight rise and uneven ends —
// the point is that it is not a rectangle.
export const swash = (colour, id) => `
<svg class="hl-swash pointer-events-none absolute left-0 w-full" viewBox="0 0 300 20" fill="none" preserveAspectRatio="none"
     aria-hidden="true" style="bottom:-.18em;height:.36em;overflow:visible">
  <path id="${esc(id)}" d="M4 13 C 60 5, 110 4, 158 7 S 250 13, 296 8"
        stroke="${esc(colour)}" stroke-width="3.2" stroke-linecap="round" fill="none"
        style="vector-effect:non-scaling-stroke" />
</svg>`;

export const HEADLINES = {
  goldInline: {
    label: 'NLB treatment, ported directly',
    note: 'Julietta Messie at 1.35em with line-height 0.8 and the gold #b7873e, exactly as NLB sets it, plus a drawn swash instead of the bar. The closest thing to the reference you liked.',
    swap: 'rise',
  },
  brandInline: {
    label: 'Same treatment, RUQ magenta instead of gold',
    note: 'Identical mechanics, but the script takes brand magenta rather than NLB gold. Tests whether the premium feel came from the font or the colour.',
    swap: 'rise',
  },
  stacked: {
    label: 'Stacked — script on its own line, oversized',
    note: 'The NLB "Find Freedom" layout: script gets a full line at 5xl–7xl with the sans set small, uppercase and letter-spaced beneath it. Script is the hero, not an inline accent.',
    swap: 'fade',
  },
  dropCap: {
    label: 'Oversized script, sans wrapped tight',
    note: 'Script pushed to 1.75em with the surrounding sans tightened to leading-none, so the word physically dominates the line. Most dramatic of the inline options.',
    swap: 'rise',
  },
};

export const renderHeadline = (c, key, onDark = true) => {
  const h = HEADLINES[key];
  const gold = '#b7873e';
  const magenta = '#e8208f';
  const sansTone = onDark ? 'text-white' : 'text-ink';

  const words = (colour, sizeEm, lh) => c.home.hero.rotatingWords.map((w, i) =>
    `<span class="hero-word ${i === 0 ? 'is-on' : ''}"
       style="grid-area:1/1;font-family:${BRUSH};color:${colour};font-size:${sizeEm};line-height:${lh};">${esc(w)}</span>`
  ).join('');

  const rotator = (colour, sizeEm, lh, swashId) => `
    <span class="hero-rotator relative inline-grid align-baseline" data-swap="${esc(h.swap)}"
          style="line-height:${lh}">
      ${words(colour, sizeEm, lh)}
      ${swash(colour, swashId)}
    </span>`;

  if (key === 'stacked') {
    return `
<h1 class="text-center ${sansTone}">
  <span class="block font-display text-2xl font-bold uppercase tracking-[0.2em] sm:text-3xl">${esc(c.home.hero.headingBefore)}</span>
  <span class="mt-2 block" style="line-height:.85">
    <span class="hero-rotator relative inline-grid" data-swap="${esc(h.swap)}" style="line-height:.85">
      ${c.home.hero.rotatingWords.map((w, i) =>
        `<span class="hero-word ${i === 0 ? 'is-on' : ''}"
           style="grid-area:1/1;font-family:${BRUSH};color:${gold};font-size:5rem;line-height:.85;">${esc(w)}</span>`).join('')}
      ${swash(gold, 'sw-stacked')}
    </span>
  </span>
  <span class="mt-6 block font-display text-lg font-bold uppercase tracking-[0.18em] sm:text-2xl">${esc(c.home.hero.headingAfter)}</span>
</h1>`;
  }

  const cfg = {
    goldInline: { colour: gold, size: '1.35em', lh: '.8', id: 'sw-gold' },
    brandInline: { colour: magenta, size: '1.35em', lh: '.8', id: 'sw-brand' },
    dropCap: { colour: gold, size: '1.75em', lh: '.75', id: 'sw-drop' },
  }[key];

  return `
<h1 class="text-center font-display text-4xl font-bold leading-[1.15] ${sansTone} sm:text-6xl">
  ${esc(c.home.hero.headingBefore)}
  ${rotator(cfg.colour, cfg.size, cfg.lh, cfg.id)}
  <br class="hidden sm:block">${esc(c.home.hero.headingAfter)}
</h1>`;
};
