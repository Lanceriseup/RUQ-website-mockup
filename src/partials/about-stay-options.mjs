// The About page's closing "Join us at Freedom" panel with the Stay Connected
// form in place of its two buttons: four designs for
// /about-stay-options.html (asked for 2026-11-03).
// scripts/build-about-stay-options.mjs swaps each in for the live panel.
//
// Every option keeps id="closing-about" and the .jc section (app.js
// aboutLights measures the event lights' end from this section's top), and
// the panel's copy, about.closingCta: script, heading and line. The form is
// the homepage's framed MultiplyOS embed (stayForm). Styles are .ak-* in
// src/styles/stay.css, beside the homepage's; the panel's own type is the
// live .jc-* in tailwind.css.
import { esc } from './layout.mjs';
import { eventDates } from './hero.mjs';
import { stayForm } from './stay-options.mjs';

// "Join us at Freedom" → the last word in the sheen, as the live panel has it.
const heading = (text) => {
  const h = esc(text);
  const i = h.lastIndexOf(' ');
  return i < 0 ? h : `${h.slice(0, i)} <span class="sheen">${h.slice(i + 1)}</span>`;
};

const words = (k) => `
      <p class="jc-script">${esc(k.script)}</p>
      <h2 class="jc-h">${heading(k.heading)}</h2>`;

const ground = (site) => `<img class="jc-bg" src="${esc(site.assets.heroPoster)}" alt="" aria-hidden="true" loading="lazy" decoding="async">`;

export const ABOUT_STAY_OPTIONS = {
  // K1 — the panel grows into two halves: the words, the line and both
  // dates on the left, the form on the right (the homepage's A, in the About
  // panel's own type).
  split: (site, c, k) => `
<section id="closing-about" class="jc sc ak ak-split">
  <div class="jc-panel">
    ${ground(site)}
    <div class="ak-in">
      <div class="ak-copy">
        ${words(k)}
        <p class="jc-p ak-p">${esc(k.body)}</p>
        <div class="ak-dates">${eventDates(site)}</div>
      </div>
      ${stayForm(c)}
    </div>
  </div>
</section>`,

  // K2 — the slim one-row band stays, and the form stands up out of it on
  // the right, taller than the band above and below.
  rise: (site, c, k) => `
<section id="closing-about" class="jc sc ak ak-rise">
  <div class="ak-rise-in">
    <div class="jc-panel ak-band" aria-hidden="true">${ground(site)}</div>
    <div class="ak-copy">
      <div class="ak-words">${words(k)}</div>
      <p class="jc-p ak-p">${esc(k.body)}</p>
    </div>
    ${stayForm(c)}
  </div>
</section>`,

  // K3 — everything centred: the words, the line, a fine pink-to-teal rule,
  // then the form.
  centre: (site, c, k) => `
<section id="closing-about" class="jc sc ak ak-centre">
  <div class="jc-panel">
    ${ground(site)}
    <div class="ak-in">
      <div class="ak-copy">
        ${words(k)}
        <p class="jc-p ak-p">${esc(k.body)}</p>
        <span class="ak-rule" aria-hidden="true"></span>
      </div>
      ${stayForm(c)}
    </div>
  </div>
</section>`,

  // K4 — light instead of dark: a blush glass panel with a taped polaroid
  // of the women at Freedom, the words, and the form.
  light: (site, c, k) => `
<section id="closing-about" class="jc sc ak ak-light">
  <div class="ak-light-panel">
    <figure class="sc-pol ak-pol" aria-hidden="true"><span class="sc-tape sc-tape-pink"></span><img src="/assets/photos/journey-cheer.jpg" alt="" loading="lazy" decoding="async"></figure>
    <div class="ak-copy">
      ${words(k)}
      <p class="ak-p ak-p-ink">${esc(k.body)}</p>
    </div>
    ${stayForm(c)}
  </div>
</section>`,
};

export const aboutStayOption = (site, c, key) => ABOUT_STAY_OPTIONS[key](site, c, c.about.closingCta);
