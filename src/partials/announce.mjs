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
// Four styles:
//   aurora     ink bar, drifting magenta and cyan light, "Freedom" in script
//   countdown  ink bar with a live days/hours/minutes/seconds counter
//   marquee    brand-gradient band with the details scrolling across it
//   editorial  blush paper bar, serif italic and script, a light sweep
import { esc } from './layout.mjs';

const ARROW = '<svg class="ann-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const SPARK = '<svg class="ann-spark" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z"/></svg>';

export const announce = (site, style = 'aurora') => {
  const ev = site.nextEvent.upcoming[0];
  const href = esc(site.nextEvent.ctaUrl);
  const dates = esc(ev.dates);
  const label = `Next event: Freedom, ${ev.dates}. Reserve your seat`;

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
  };

  return `<div id="announce" class="ann-wrap">${bars[style] || bars.aurora}</div>`;
};
