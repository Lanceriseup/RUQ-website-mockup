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

// "Stay close" over the form inside the Freedom note, where the form replaced
// the note's Reserve button (2026-11-05). Four looks for
// /freedom-stay-options.html (scripts/build-freedom-stay-options.mjs):
//
//   arrow   the script with the hand-drawn arrow to the form, as option J had
//           it on the wall below the note. LIVE (2026-11-05) until one is picked
//   rule    the script between two hairlines, like "3-day intensive" above
//           it, with "Be the first to know" under it
//   tape    the script on a strip of washi tape stuck across the form's top
//   line    the script, then the reason to sign up (home.stay.body)
//
// The form carries no title of its own since Lance shortened it in MultiplyOS
// (2026-11-05), so the words here are its only heading. Styles .sc-n-* in
// stay.css.
//
// Arrow was chosen (2026-11-05). Round two, /freedom-stay-options-2.html,
// sizes it: `form` is narrow (380px wide), s90 or s80 (the whole form scaled
// to 90% or 80%); `script` is s, l or xl ("Stay close" at 44, 68 or 80px on
// desktop). Left out, each keeps today's size (the full width of the note;
// the script at 56px).
// Arrow chosen and sized 2026-11-05: the form at 90% (s90), the script as
// it was, a little more room between them. Round three,
// /freedom-stay-options-3.html, is five livelier takes on the script and
// arrow (the WOW looks below). Each plays once when the form comes into view:
// stay.js adds .is-on to [data-sc-anim] (and starts the plane's flight);
// with reduced motion they show their finished state.
//
//   write    the script writes itself in, then the arrow draws and nudges
//   loop     a heart draws in, and a looping flourish runs to the form
//   shimmer  a light sweeps the script; the arrow's dashes march; the form glows
//   spark    a teal swoosh underlines it, sparkles twinkle, the arrow draws
//   plane    a paper plane flies a dotted trail from the script to the form
const ARROW_D = 'M20 8 C 70 6, 104 30, 88 74';
const HEAD_D = 'M76 62 L 88 76 L 100 62';
const NOTE_ARROW = `<svg class="sc-n-arrow" viewBox="0 0 120 90" aria-hidden="true"><path d="${ARROW_D} ${HEAD_D}"/></svg>`;
const DRAWN_ARROW = (cls = '') => `<svg class="sc-n-arrow sc-n-draw ${cls}" viewBox="0 0 120 90" aria-hidden="true"><path pathLength="1" d="${ARROW_D}"/><path pathLength="1" class="sc-n-head" d="${HEAD_D}"/></svg>`;
const STAR = '<svg viewBox="0 0 24 24"><path d="M12 0C13 8 16 11 24 12 16 13 13 16 12 24 11 16 8 13 0 12 8 11 11 8 12 0Z"/></svg>';
const PLANE_D = 'M8 70 C 40 18, 112 0, 142 30 C 166 56, 142 96, 100 110';
export const NOTE_STAY = ['arrow', 'rule', 'tape', 'line'];
export const NOTE_WOW = ['write', 'loop', 'shimmer', 'spark', 'plane'];
export const noteStay = (c, look = 'arrow', { form: fs = '', script: ss = '' } = {}) => {
  const s = c.home.stay;
  const script = `<p class="sc-n-script" aria-hidden="true">${esc(s.script)}</p>`;
  const sr = `<h2 class="sr-only">${esc(s.script)}: ${esc(s.heading)}</h2>`;
  const head = {
    arrow: `${script}${NOTE_ARROW}`,
    rule: `<div class="sc-n-rule">${script}</div><p class="sc-n-k" aria-hidden="true">${esc(s.heading)}</p>`,
    tape: '',
    line: `${script}<p class="sc-n-body">${esc(s.body)}</p>`,
    write: `${script}${DRAWN_ARROW()}`,
    loop: `<svg class="sc-n-heart sc-n-draw" viewBox="0 0 40 36" aria-hidden="true"><path pathLength="1" d="M20 32 C 6 22, 2 14, 6 8 C 10 2, 18 4, 20 11 C 22 4, 30 2, 34 8 C 38 14, 34 22, 20 32 Z"/></svg>${script}<svg class="sc-n-loop sc-n-draw" viewBox="0 0 160 130" aria-hidden="true"><path pathLength="1" d="M6 40 C 40 30, 80 18, 108 24 C 140 30, 142 66, 116 68 C 92 70, 96 36, 124 44 C 150 52, 150 92, 128 118"/><path pathLength="1" class="sc-n-head" d="M116 108 L 128 120 L 140 108"/></svg>`,
    shimmer: `<p class="sc-n-script sc-n-shine" aria-hidden="true">${esc(s.script)}</p><svg class="sc-n-arrow sc-n-march" viewBox="0 0 120 90" aria-hidden="true"><path class="sc-n-dash" d="${ARROW_D}"/><path d="${HEAD_D}"/></svg>`,
    spark: `${script}<svg class="sc-n-swoosh sc-n-draw" viewBox="0 0 240 20" aria-hidden="true"><path pathLength="1" d="M8 13 C 60 4, 150 3, 232 9"/></svg>${DRAWN_ARROW()}${['s1', 's2', 's3', 's4', 's5'].map(k => `<i class="sc-n-star sc-n-${k}" aria-hidden="true">${STAR}</i>`).join('')}`,
    plane: `${script}<svg class="sc-n-plane" viewBox="0 0 170 120" aria-hidden="true"><defs><mask id="sc-pl-m" maskUnits="userSpaceOnUse" x="-20" y="-20" width="210" height="160"><path class="sc-n-reveal" pathLength="1" d="${PLANE_D}"/></mask></defs><path id="sc-pl-path" class="sc-n-trail" d="${PLANE_D}" mask="url(#sc-pl-m)"/><g class="sc-n-pl"><path d="M-16 -12 L 17 0 L -16 12 L -8 0 Z"/><path class="sc-n-fold" d="M-8 0 L 17 0"/><animateMotion dur="1.6s" begin="indefinite" fill="freeze" rotate="auto" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines=".45 0 .25 1"><mpath href="#sc-pl-path"/></animateMotion></g></svg>`,
  }[look] ?? '';
  const body = look === 'tape'
    ? `<div class="sc-n-pin"><span class="sc-n-tape" aria-hidden="true">${esc(s.script)}</span>${form(s)}</div>`
    : form(s);
  const wow = NOTE_WOW.includes(look);
  return `<div id="stay" class="sc-n sc-n--${look}${wow ? ' sc-n-wow' : ''}${fs ? ` sc-nf-${fs}` : ''}${ss ? ` sc-ns-${ss}` : ''}"${wow ? ' data-sc-anim' : ''}>${sr}${head}${body}</div>`;
};

// Any MultiplyOS form, framed the same way ({ src, origin, title }): the
// Contact page's Contact Us form (contact-mos-options.mjs) and the coaching
// intro-call form (coaching-options.mjs). `cls` is extra classes on the
// frame's wrapper; `lazy` false leaves the frame without a src for a script
// to fill (data-sc-src), as the coaching dialog does with the coach chosen.
export const mosForm = (f, cls = '', { lazy = true } = {}) =>
  form({ form: f }, { lazy }).replace('class="sc-form"', `class="sc-form${cls ? ` ${cls}` : ''}"`);
