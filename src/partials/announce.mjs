// Announcement banner — a slim bar above the header announcing the next event.
//
// The whole bar is one link to registration, so there is a single, large
// target and no nested controls. Copy comes from site.nextEvent.upcoming[0],
// so it moves on by itself when the dates in site.json change.
//
// Styles live in src/styles/announce.css (published as /announce.css), the
// behaviour in src/styles/announce.js: it offsets the over-hero header by the
// bar's height and drives the live countdown in the `countdown` style.
//
// Animated styles:
//   aurora     ink bar, drifting magenta and cyan light, "Freedom" in script
//   countdown  ink bar with a live days/hours/minutes/seconds counter
//   marquee    brand-gradient band with the details scrolling across it
//   editorial  blush paper bar, serif italic and script, a light sweep
//
// Static styles (nothing moves until it is hovered):
//   neon       "Freedom" as a lit magenta neon sign on a dark dotted wall
//   holo       holographic-foil script and date on ink, a foil sheen
//   ticket     an admission ticket with the Freedom logo on the brand gradient
//   photo      the queens themselves, duotoned magenta to cyan, behind the copy
//   poster     concert-poster blocks: magenta date, ink title, cyan button
//
// The photo layout — "Freedom" | date, place, white button — in other skins.
// Same markup and copy; only the backdrop and colours change:
//   d-crowd     the group photo in full colour under a dark wash
//   d-sky       a sunset sky, pink into teal
//   d-rays      light falling through tall windows, on near-black
//   d-gradient  the brand gradient, no photo
//   d-teal, d-royal, d-ocean, d-navy   d-gradient in blues only
//   t-duo, t-rays, t-silk, t-aurora, t-metal, t-glass   richer teal grounds
//   d-ink       near-black lit by a magenta and a cyan glow
//   d-blush     blush paper, magenta script, ink button — the light version
import { esc } from './layout.mjs';

const ARROW = '<svg class="ann-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const SPARK = '<svg class="ann-spark" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z"/></svg>';

// `light` marks a page whose header is not over a dark hero (Team, Courses,
// Contact, Register…): the bar gets .ann-on-light, which on T5 lifts it off
// the teal sky with a shadow (L1, chosen 2026-10-30 from
// /announce-light-options.html).
export const announce = (site, style = 'aurora', { light = false } = {}) => {
  const ev = site.nextEvent.upcoming[0];
  const href = esc(site.nextEvent.ctaUrl);
  const dates = esc(ev.dates);
  const place = esc(ev.location);
  const label = `Next event: Freedom, ${ev.dates}. Reserve your seat`;

  // The photo layout. `img` adds the backdrop layer, `tint` the duotone
  // layer over it; skins without a photo leave both out.
  const line = (skin, { img = false, tint = false } = {}) => `
  <a href="${href}" class="ann ann-s ann-photo${skin ? ` ann-${skin}` : ''}" aria-label="${esc(label)}">${img ? `
    <span class="ann-ph-img" aria-hidden="true"></span>` : ''}${tint ? `
    <span class="ann-ph-tint" aria-hidden="true"></span>` : ''}
    <span class="ann-row">
      <span class="ann-script">Freedom</span>
      <span class="ann-bar" aria-hidden="true"></span>
      <span class="ann-date">${dates}</span>
      <span class="ann-place">${place}</span>
      <span class="ann-cta">Reserve<span class="ann-long"> your seat</span>${ARROW}</span>
    </span>
  </a>`;

  const bars = {
    aurora: `
  <a href="${href}" class="ann ann-aurora" aria-label="${esc(label)}">
    <span class="ann-glow" aria-hidden="true"></span>
    <span class="ann-row">
      <span class="ann-badge"><span class="ann-pulse" aria-hidden="true"></span>Next event</span>
      <span class="ann-script">Freedom</span>
      <span class="ann-date">${dates}</span>
      <span class="ann-cta">Reserve<span class="ann-long"> your seat</span>${ARROW}</span>
    </span>
  </a>`,

    countdown: `
  <a href="${href}" class="ann ann-count" aria-label="${esc(label)}" data-ann-cd="${esc(ev.startsAt)}">
    <span class="ann-row">
      <span class="ann-what"><span class="ann-script">Freedom</span><span class="ann-date">${dates}</span></span>
      <span class="ann-cd" aria-hidden="true">
        <span class="ann-cd-box"><b data-u="d">000</b><i>days</i></span><span class="ann-cd-sep">:</span>
        <span class="ann-cd-box"><b data-u="h">00</b><i>hrs</i></span><span class="ann-cd-sep">:</span>
        <span class="ann-cd-box"><b data-u="m">00</b><i>min</i></span><span class="ann-cd-sep ann-sm">:</span>
        <span class="ann-cd-box ann-sm"><b data-u="s">00</b><i>sec</i></span>
      </span>
      <span class="ann-btn">Register${ARROW}</span>
    </span>
  </a>`,

    // The run is repeated so the loop is seamless: the track is two identical
    // halves and the animation moves it exactly one half to the left.
    marquee: (() => {
      const run = ['Next event', 'Freedom', ev.dates, '3-day intensive', 'Limited spots', 'Reserve your seat']
        .map((t, i) => `<span class="${i === 1 ? 'ann-script' : 'ann-word'}">${esc(t)}</span>${SPARK}`).join('');
      const half = `<span class="ann-run">${run}${run}</span>`;
      return `
  <a href="${href}" class="ann ann-marquee" aria-label="${esc(label)}">
    <span class="ann-track" aria-hidden="true">${half}${half}</span>
  </a>`;
    })(),

    editorial: `
  <a href="${href}" class="ann ann-edit" aria-label="${esc(label)}">
    <span class="ann-sweep" aria-hidden="true"></span>
    <span class="ann-row">
      <span class="ann-serif">The next gathering</span>
      <span class="ann-rule" aria-hidden="true"></span>
      <span class="ann-script">Freedom</span>
      <span class="ann-date">${dates}</span>
      <span class="ann-rule ann-sm" aria-hidden="true"></span>
      <span class="ann-cta">Reserve<span class="ann-long"> your seat</span>${ARROW}</span>
    </span>
  </a>`,

    neon: `
  <a href="${href}" class="ann ann-s ann-neon" aria-label="${esc(label)}">
    <span class="ann-row">
      <span class="ann-tube">Next event</span>
      <span class="ann-script">Freedom</span>
      <span class="ann-date">${dates}</span>
      <span class="ann-dot" aria-hidden="true"></span>
      <span class="ann-place">${place}</span>
      <span class="ann-cta">Reserve<span class="ann-long"> your seat</span>${ARROW}</span>
    </span>
  </a>`,

    holo: `
  <a href="${href}" class="ann ann-s ann-holo" aria-label="${esc(label)}">
    <span class="ann-sheen" aria-hidden="true"></span>
    <span class="ann-row">
      <span class="ann-kicker">The next gathering</span>
      <span class="ann-flank" aria-hidden="true">${SPARK}</span>
      <span class="ann-script">Freedom</span>
      <span class="ann-flank ann-flank-r" aria-hidden="true">${SPARK}</span>
      <span class="ann-date">${dates}</span>
      <span class="ann-cta">Reserve<span class="ann-long"> your seat</span>${ARROW}</span>
    </span>
  </a>`,

    // The ticket is notched with a mask, which would also clip a box-shadow,
    // so its shadow is a drop-shadow on the wrapper instead.
    ticket: `
  <a href="${href}" class="ann ann-s ann-ticket" aria-label="${esc(label)}">
    <span class="ann-row">
      <span class="ann-side">${SPARK}Limited spots</span>
      <span class="ann-tkw">
        <span class="ann-tk">
          <span class="ann-tk-main">
            <span class="ann-admit">Admit one<b>Next event</b></span>
            <img class="ann-logo" src="/assets/brand/freedom-logo-trim.png" alt="" width="114" height="35">
            <span class="ann-date">${dates}</span>
          </span>
          <span class="ann-tk-stub">Reserve<span class="ann-long"> your seat</span>${ARROW}</span>
        </span>
      </span>
      <span class="ann-side">${place}${SPARK}</span>
    </span>
  </a>`,

    photo: line('', { img: true, tint: true }),
    'd-crowd': line('d-crowd', { img: true }),
    'd-sky': line('d-sky', { img: true }),
    'd-rays': line('d-rays', { img: true }),
    'd-gradient': line('d-gradient'),
    'd-teal': line('d-teal'),
    'd-royal': line('d-royal'),
    'd-ocean': line('d-ocean'),
    'd-navy': line('d-navy'),
    't-duo': line('t-duo', { img: true, tint: true }),
    't-rays': line('t-rays', { img: true, tint: true }),
    't-silk': line('t-silk'),
    't-aurora': line('t-aurora'),
    't-metal': line('t-metal'),
    't-glass': line('t-glass'),
    'd-ink': line('d-ink'),
    'd-blush': line('d-blush'),

    // "May 5–7, 2027" is set as a big "May 5–7" with the year beside it.
    poster: (() => {
      const cut = ev.dates.lastIndexOf(',');
      const day = cut > 0 ? ev.dates.slice(0, cut) : ev.dates;
      const year = cut > 0 ? ev.dates.slice(cut + 1).trim() : '';
      return `
  <a href="${href}" class="ann ann-s ann-poster" aria-label="${esc(label)}">
    <span class="ann-pd"><span class="ann-day">${esc(day)}</span>${year ? `<span class="ann-year">${esc(year)}</span>` : ''}</span>
    <span class="ann-pm">
      <span class="ann-script">Freedom</span>
      <span class="ann-tag">3-day intensive${SPARK}${place}</span>
    </span>
    <span class="ann-pc">Reserve<span class="ann-long"> your seat</span>${ARROW}</span>
  </a>`;
    })(),
  };

  const bar = bars[style] || bars.aurora;
  return `<div id="announce" class="ann-wrap">${light ? bar.replace('class="ann ', 'class="ann ann-on-light ') : bar}</div>`;
};
