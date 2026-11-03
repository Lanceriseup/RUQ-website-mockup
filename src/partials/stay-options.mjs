// "Stay connected" on the homepage: the live MultiplyOS form
// (content.json home.stay.form), in six placements and designs for
// /stay-options.html (asked for 2026-11-03). scripts/build-stay-options.mjs
// drops each into a copy of the homepage at its `place`.
//
// The form draws its own card, title ("Stay Connected") and logo, so every
// option frames it rather than restyling it, and the section's own words
// (home.stay) say why to sign up instead of repeating the title.
//
// Styles src/styles/stay.css (plain CSS, .sc-*, so no Tailwind rebuild);
// behaviour src/styles/stay.js: frame heights from the form's own
// 'mos-form-height' messages, and F's slide-in card.
import { esc } from './layout.mjs';
import { eventDates } from './hero.mjs';

const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const PIN = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
const CLOSE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

// The form. `lazy` false leaves src empty for stay.js to fill on demand (F).
// A form with a `height` keeps that height (data-sc-fixed); one without is
// sized from its messages. `next` is where the page goes after a submit.
const form = (s, { lazy = true } = {}) => `
<div class="sc-form">
  <iframe class="sc-frame" title="${esc(s.form.title)}" ${lazy ? `src="${esc(s.form.src)}" loading="lazy"` : `data-sc-src="${esc(s.form.src)}"`}
          data-sc-form data-sc-origin="${esc(s.form.origin)}"${s.form.height ? ` data-sc-fixed style="height:${+s.form.height}px"` : ''}${s.form.next ? ` data-sc-next="${esc(s.form.next)}"` : ''}></iframe>
</div>`;

const crown = (cls = '') => `<span class="sc-crown ${cls}" aria-hidden="true"></span>`;

// Script line, heading and body; tone is 'light' (dark ink) or 'dark' (white).
const copy = (s, { tone = 'light', align = 'left', tag = 'h2', id = 'sc-h' } = {}) => `
<div class="sc-copy sc-copy-${tone} sc-copy-${align}">
  <p class="sc-script script" aria-hidden="true">${esc(s.script)}</p>
  <${tag} class="sc-h" id="${id}"><span class="sr-only">${esc(s.script)}: </span>${esc(s.heading)}</${tag}>
  <p class="sc-body">${esc(s.body)}</p>
</div>`;

// Both event dates as one quiet line, for the light grounds.
const datesLine = (site, cls = '') => `
<p class="sc-dates ${cls}">${site.nextEvent.upcoming.map((e, i) => `
  <span><b>${i ? 'Also coming' : 'Next event'}</b> ${esc(e.dates)} <i>${PIN}${esc(e.location)}</i></span>`).join('<span class="sc-dot" aria-hidden="true"></span>')}
</p>`;

// A's dark panel: the breakthrough panel's ground (event photograph, shade,
// pink pulse) with copy and dates on the left and the form on the right.
// `head` is the copy; A keeps "It’s time for your breakthrough", I uses
// home.stay.
const darkPanel = (site, s, { id, cls, head }) => `
<section id="${id}" class="sc ${cls}" aria-labelledby="sc-a-h">
  <div class="cta-panel sc-a-panel">
    <img src="${esc(site.assets.heroPoster)}" alt="" aria-hidden="true" loading="lazy" decoding="async" class="sc-a-bg">
    <div class="sc-a-shade" aria-hidden="true"></div>
    <div class="sc-a-grid">
      <div class="sc-a-copy">
        ${head}
        <div class="sc-a-dates">${eventDates(site)}</div>
      </div>
      ${form(s)}
    </div>
  </div>
</section>`;

export const STAY_OPTIONS = {
  // A — the breakthrough panel, with the form beside its dates, where the
  // current site has it. Replaces <section id="breakthrough">. Its Register
  // Now button was taken out on 2026-11-03 at the client's request, so the
  // form is the panel's one action.
  panel: {
    place: 'breakthrough',
    render: (site, c, s) => darkPanel(site, s, {
      id: 'breakthrough', cls: 'sc-a',
      head: `<h2 class="sc-a-h" id="sc-a-h">It’s time for your <span class="sheen">breakthrough</span></h2>
        <p class="sc-a-body">${esc(s.body)}</p>`,
    }),
  },

  // B — after the testimonies: the memory wall's polaroids and tape, with
  // the form pinned between two photographs.
  note: {
    place: 'after-testimonials',
    render: (site, c, s) => `
<section id="stay" class="sc sc-b" aria-labelledby="sc-h">
  ${copy(s, { align: 'centre' })}
  <div class="sc-b-row">
    <figure class="sc-pol sc-pol-l" aria-hidden="true"><span class="sc-tape sc-tape-pink"></span><img src="/assets/photos/journey-cheer.jpg" alt="" loading="lazy" decoding="async"></figure>
    <div class="sc-b-pin"><span class="sc-tape sc-tape-teal sc-tape-top"></span>${form(s)}</div>
    <figure class="sc-pol sc-pol-r" aria-hidden="true"><span class="sc-tape sc-tape-teal"></span><img src="/assets/photos/close-laugh.jpg" alt="" loading="lazy" decoding="async"></figure>
  </div>
  ${datesLine(site)}
</section>`,
  },

  // C — the last thing on the page: the faith section's sky, the crown, and
  // the form in a frosted frame.
  sky: {
    place: 'before-footer',
    render: (site, c, s) => `
<section id="stay" class="sc sc-c" aria-labelledby="sc-h">
  <div class="sc-c-sky" aria-hidden="true"></div>
  <div class="sc-c-in">
    ${crown()}
    ${copy(s, { align: 'centre' })}
    <div class="sc-c-glass">${form(s)}</div>
    ${datesLine(site)}
  </div>
</section>`,
  },

  // D — the top of the footer, so it closes every page, not only this one.
  footer: {
    place: 'footer',
    render: (site, c, s) => `
<section id="stay" class="sc sc-d" aria-labelledby="sc-h">
  <div class="sc-d-glow" aria-hidden="true"></div>
  <div class="sc-d-grid">
    <div>
      ${crown('sc-crown-light')}
      ${copy(s, { tone: 'dark' })}
      <div class="sc-d-dates">${eventDates(site)}</div>
    </div>
    ${form(s)}
  </div>
</section>`,
  },

  // E — after the creed: a full-bleed photograph beside the form.
  split: {
    place: 'after-faith',
    render: (site, c, s) => `
<section id="stay" class="sc sc-e" aria-labelledby="sc-h">
  <div class="sc-e-photo">
    <img src="/assets/photos/queens-waving.jpg" alt="Women at a Rise Up Queens event waving, wearing tiaras" loading="lazy" decoding="async">
    <p class="sc-e-mark script" aria-hidden="true">${esc(s.script)}</p>
  </div>
  <div class="sc-e-side">
    <div class="sc-e-in">
      ${copy(s)}
      ${form(s)}
      ${datesLine(site, 'sc-dates-left')}
    </div>
  </div>
</section>`,
  },

  // F — no section: a card slides in once the visitor is past the Freedom
  // wall, and opens to the form. Dismissed, it stays away for the visit.
  float: {
    place: 'float',
    render: (site, c, s) => `
<aside class="sc sc-f" data-sc-pop aria-labelledby="sc-f-h" hidden>
  <button type="button" class="sc-f-x" data-sc-dismiss aria-label="Close">${CLOSE}</button>
  <div class="sc-f-head">
    ${crown()}
    <div>
      <p class="sc-script script" aria-hidden="true">${esc(s.script)}</p>
      <h2 class="sc-f-h" id="sc-f-h"><span class="sr-only">${esc(s.script)}: </span>${esc(s.heading)}</h2>
    </div>
  </div>
  <p class="sc-f-body">${esc(s.body)}</p>
  <button type="button" class="sc-btn sc-btn-pink sc-f-open" data-sc-open aria-expanded="false" aria-controls="sc-f-form">Stay connected${ARROW}</button>
  <div class="sc-f-form" id="sc-f-form" hidden>${form(s, { lazy: false })}</div>
</aside>`,
  },

  // Round two (2026-11-03): the form in the first or second section.

  // G — in the hero, beside the video: the build script wraps the video and
  // this card in one row (place 'hero-video'), so the form is in view on
  // arrival.
  video: {
    place: 'hero-video',
    render: (site, c, s) => `
<aside id="stay" class="sc sc-g" aria-labelledby="sc-g-h">
  <p class="sc-script script" aria-hidden="true">${esc(s.script)}</p>
  <h2 class="sc-g-h" id="sc-g-h"><span class="sr-only">${esc(s.script)}: </span>${esc(s.heading)}</h2>
  ${form(s)}
</aside>`,
  },

  // H — the foot of the hero, under Register Now: a frosted band on the
  // hero's own dark ground, for anyone not ready to register.
  herofoot: {
    place: 'hero-end',
    render: (site, c, s) => `
<div id="stay" class="sc sc-hf">
  <div class="sc-hf-panel">
    <div class="sc-hf-copy">
      ${crown('sc-crown-light')}
      <p class="sc-hf-nudge">${esc(s.nudge)}</p>
      ${copy(s, { tone: 'dark' })}
    </div>
    ${form(s)}
  </div>
</div>`,
  },

  // I — A's dark panel with home.stay's words, opening the second section:
  // the first thing on the lifted panel, above the Freedom wall.
  opener: {
    place: 'before-freedom',
    render: (site, c, s) => darkPanel(site, s, {
      id: 'stay', cls: 'sc-a sc-i',
      head: `${crown('sc-crown-light sc-i-crown')}
        <p class="sc-script script" aria-hidden="true">${esc(s.script)}</p>
        <h2 class="sc-a-h sc-i-h" id="sc-a-h"><span class="sr-only">${esc(s.script)}: </span>${esc(s.heading)}</h2>
        <p class="sc-a-body">${esc(s.body)}</p>`,
    }),
  },

  // J — on the Freedom wall itself: under the Freedom note, a second note
  // taped to the board, with "Stay close" and an arrow pointing at it. Its
  // "Not ready to register yet?" line was taken out on 2026-11-03 at the
  // client's request (H still has it).
  wall: {
    place: 'freedom-wall',
    render: (site, c, s) => `
<div id="stay" class="sc sc-j">
  <p class="sc-j-script script" aria-hidden="true">${esc(s.script)}</p>
  <h2 class="sr-only">${esc(s.script)}: ${esc(s.heading)}</h2>
  <svg class="sc-j-arrow" viewBox="0 0 120 90" aria-hidden="true"><path d="M20 8 C 70 6, 104 30, 88 74 M76 62 L 88 76 L 100 62"/></svg>
  <div class="sc-j-pin"><span class="sc-tape sc-tape-pink sc-tape-top"></span>${form(s)}</div>
</div>`,
  },
};

// Marked with comments so build-stay-options.mjs can lift the live ones (A
// and J, on the homepage since 2026-11-03) back out of its base page.
export const stayOption = (site, c, key) =>
  `<!-- sc:${key} -->${STAY_OPTIONS[key].render(site, c, c.home.stay)}<!-- /sc:${key} -->`;

// The framed form on its own, for the About page's options
// (about-stay-options.mjs).
export const stayForm = (c) => form(c.home.stay);

// Any MultiplyOS form, framed the same way ({ src, origin, title }): the
// Contact page's Contact Us form (contact-mos-options.mjs) and the coaching
// intro-call form (coaching-options.mjs). `cls` is extra classes on the
// frame's wrapper; `lazy` false leaves the frame without a src for a script
// to fill (data-sc-src), as the coaching dialog does with the coach chosen.
export const mosForm = (f, cls = '', { lazy = true } = {}) =>
  form({ form: f }, { lazy }).replace('class="sc-form"', `class="sc-form${cls ? ` ${cls}` : ''}"`);
