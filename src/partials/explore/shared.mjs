// Shared pieces for the five "explore" pages — Courses, Masterclasses, Events,
// Coaching, Free resource — so every design direction renders the same copy,
// the same links and the same disabled forms. Directions own the layout and
// the look; nothing here sets a colour.
//
// Copy lives in content.json under `explore`. Each page there carries a
// `review` list: the supplied screenshots' caveats ("this preview cannot
// reserve a place", "approval pending"…). They are kept, but as one small
// preview note per page (reviewNote below) instead of being repeated through
// the page copy.
//
// Forms are DISABLED, as on the Contact page: there is no endpoint, and a form
// that looks live and posts nowhere swallows real sign-ups in silence.
import { esc } from '../layout.mjs';

export { esc };

export const ICON = {
  arrow: '<svg class="xp-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  out: '<svg class="xp-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>',
  play: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>',
  pin: '<svg class="xp-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  cal: '<svg class="xp-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  clock: '<svg class="xp-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  lock: '<svg class="xp-ic" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  gift: '<svg class="xp-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5V20h14v-7.5M12 8.5V20M12 8.5S10.5 4 8 4.5 7 8.5 12 8.5zM12 8.5S13.5 4 16 4.5 17 8.5 12 8.5z"/></svg>',
};

// External links get target=_blank, rel=noopener and an "opens in a new tab"
// hint for screen readers; internal ones stay in the tab.
export const isExternal = (href) => /^https?:/.test(href || '');
export const linkAttrs = (href) => isExternal(href)
  ? `href="${esc(href)}" target="_blank" rel="noopener"`
  : `href="${esc(href)}"`;
export const newTab = (href) => isExternal(href) ? '<span class="sr-only"> (opens in a new tab)</span>' : '';

/** A link with label, trailing icon and the new-tab hint. `cls` is the
 *  direction's button/link class. */
export const action = (label, href, cls = '') => `<a ${linkAttrs(href)} class="${cls}">${esc(label)}${newTab(href)}${isExternal(href) ? ICON.out : ICON.arrow}</a>`;

export const fill = (tpl, o) => String(tpl).replace(/\{(\w+)\}/g, (_, k) => o[k] ?? '');

// ------------------------------------------------------------------ forms

/**
 * A disabled form. Fields are real labelled inputs, so the design is honest
 * about what the live form asks for, but nothing can be typed or sent.
 *
 *   fields   [{name,label,type,autocomplete}]
 *   submit   button label (string)
 *   id       unique prefix for this form on the page
 *   cls      { form, grid, field, label, input, req, button, note } class hooks
 *   cols     lay fields in two columns from sm up
 */
export const disabledForm = ({ fields, submit, id, cls = {}, cols = true, submitAttrs = '', submitHtml = null }) => `
<form class="xp-form ${cls.form || ''}" action="#" onsubmit="return false" aria-describedby="${esc(id)}-note" novalidate>
  <div class="xp-fgrid ${cols ? 'xp-fgrid-2' : ''} ${cls.grid || ''}">
    ${fields.map(f => `
    <div class="xp-field ${cls.field || ''}">
      <label for="${esc(id)}-${esc(f.name)}" class="xp-label ${cls.label || ''}">${esc(f.label)}<span class="xp-req ${cls.req || ''}"> (required)</span></label>
      <input id="${esc(id)}-${esc(f.name)}" name="${esc(f.name)}" type="${esc(f.type)}" autocomplete="${esc(f.autocomplete || 'off')}"
             class="xp-input ${cls.input || ''}" placeholder="${esc(f.label)}" disabled required>
    </div>`).join('')}
  </div>
  <button type="submit" class="xp-submit ${cls.button || ''}" disabled ${submitAttrs}>${submitHtml ?? esc(submit)}</button>
  <p id="${esc(id)}-note" class="xp-fnote ${cls.note || ''}">${ICON.lock}<span>Preview only — this form isn’t connected yet, so nothing is sent.</span></p>
</form>`;

/**
 * The masterclass waitlist: one form with a class picker in front of it, in
 * place of three identical forms. The picker is real radios (enabled — choosing
 * a class sends nothing); the submit label follows the choice with CSS alone
 * via :has(), and explore.js updates the visible label as a fallback.
 *
 *   cls.picker / cls.chip  class hooks for the radio group
 */
export const waitlistForm = (m, { id = 'wl', cls = {} } = {}) => {
  const items = m.items;
  const picker = `
  <fieldset class="xp-picker ${cls.picker || ''}">
    <legend class="xp-label ${cls.legend || cls.label || ''}">Choose a masterclass</legend>
    <div class="xp-chips">
      ${items.map((it, i) => `
      <label class="xp-chip ${cls.chip || ''}">
        <input type="radio" name="${esc(id)}-class" value="${esc(it.key)}" ${i === 0 ? 'checked' : ''} data-xp-wl="${esc(fill(m.form.submit, it))}">
        <span>${esc(it.name)}</span>
      </label>`).join('')}
    </div>
  </fieldset>`;
  return `
<div class="xp-wl" data-xp-waitlist>
  ${picker}
  ${disabledForm({ fields: m.form.fields, submit: fill(m.form.submit, items[0]), id, cls, cols: true,
    submitHtml: `<span data-xp-wl-label>${esc(fill(m.form.submit, items[0]))}</span>` })}
</div>`;
};

// ------------------------------------------------------------------ video

/** A click-to-play facade that opens the site lightbox (app.js). No player,
 *  cookie or request to the video host until it is clicked. */
export const videoButton = (v, { cls = '', inner = '', ratio = 'aspect-video' } = {}) => `
<button type="button" data-lightbox data-provider="${esc(v.provider)}" data-id="${esc(v.id)}" ${v.hash ? `data-hash="${esc(v.hash)}"` : ''}
        data-title="${esc(v.name)}" class="video-facade xp-video ${cls}">
  <span class="sr-only">Play ${esc(v.name)}</span>
  <span class="xp-video-frame ${ratio}">
    <img src="${esc(v.poster)}" alt="" aria-hidden="true" loading="lazy" decoding="async">
    ${inner}
  </span>
</button>`;

// ------------------------------------------------------------------ countdown

/** Markup for countdown.js (one per page — it binds the first match). */
export const countdown = (startsAt, cls = {}) => `
<div class="xp-cd ${cls.wrap || ''}" data-countdown="${esc(startsAt)}" aria-label="Time until the event begins">
  ${['days', 'hours', 'minutes', 'seconds'].map(u => `
  <div class="xp-cd-box ${cls.box || ''}"><span class="xp-cd-n cd-${u} ${cls.n || ''}">00</span><span class="xp-cd-u ${cls.u || ''}">${u === 'minutes' ? 'mins' : u === 'seconds' ? 'secs' : u}</span></div>`).join('')}
</div>`;

// ------------------------------------------------------------------ review

/** The page's preview caveats, folded into one disclosure so they are on the
 *  page for the client's review without being page copy. */
export const reviewNote = (items, cls = '') => `
<details class="xp-review ${cls}">
  <summary><span class="xp-review-dot" aria-hidden="true"></span>Preview notes <span class="xp-review-n">${items.length}</span></summary>
  <ul>${items.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
</details>`;

// ------------------------------------------------------------------ data

/** Coaches from explore.coaching, with their live-site blurbs joined on. */
export const coaches = (c) => c.explore.coaching.coaches.map(x => ({
  ...x,
  blurb: (c.coaching.coaches.find(y => y.name === x.name) || {}).blurb || '',
  cta: fill(c.explore.coaching.cta, x),
}));

/** Reveal-on-scroll hook. explore.js adds .is-in; with reduced motion, no JS
 *  or no IntersectionObserver the element is simply shown. */
export const rv = (delay = 0) => `data-xp-rv${delay ? ` style="--d:${delay}ms"` : ''}`;
