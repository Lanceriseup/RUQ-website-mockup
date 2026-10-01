// Contact, light. SHIPPING: "sky" (L1), chosen from /contact-light-options.html;
// the other three stay here for that comparison page.
//
// Every one keeps the page's content exactly: the client's heading, lead,
// form fields, socials, the Rise Up Kings invitation and the two videos. The
// form stays disabled, as before — see contact-parts.mjs.
//
// "Contact" is set in the brush script with the hand-drawn swash under it,
// the same treatment as "Common struggles" on the homepage (spread.mjs).
//
//   sky      the Meet the Team sky, the shipped two-column layout, made light
//   arch     warm blush ground, an arched photograph under the heading with
//            the Rise Up Kings card pinned to its corner
//   split    centred heading, then one white card: photograph left, form right
//   letter   the whole contact block as a sheet of stationery, with a crown
//            stamp and ruled writing-line fields
//
// The header renders in its "clear" mode (ink type, no bar) over all four.
import { esc } from './layout.mjs';
import { swash } from './spread.mjs';
import { socials, form, video } from './contact-parts.mjs';

const MAGENTA = '#e8208f';
const PHOTO = '/assets/photos/close-talk.jpg';

const scriptHeading = (c, cls = '') => `
<h1 class="cl-h ${cls}">
  <span class="relative inline-block">
    <span class="script block" style="color:${MAGENTA}">${esc(c.contact.heading)}</span>
    ${swash(MAGENTA)}
  </span>
</h1>`;

const lead = (c, cls = '') => `<p class="cl-lead ${cls}">${esc(c.contact.lead)}</p>`;

const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

// Rise Up Kings on a light ground: a cream card, the crest as a faint
// watermark in its corner (the shipped "watermark" shape), gold button edge.
const ruk = (site, c, cls = '') => {
  const p = c.contact.partner;
  return `
<div class="cl-ruk ${cls}">
  <img src="${esc(site.assets.logoParent)}" alt="" aria-hidden="true" width="1762" height="2560" loading="lazy" decoding="async" class="cl-ruk-crest">
  <div class="relative">
    <h2 class="cl-ruk-h">${esc(p.heading)}</h2>
    <p class="cl-ruk-p">${esc(p.body)}</p>
    <a href="${esc(p.url)}" target="_blank" rel="noopener" class="cl-ruk-a">${esc(p.cta)}${arrow}</a>
  </div>
</div>`;
};

const soc = (site, align = 'start') => socials(site, { tone: 'light', style: 'tile', align });

const videos = (c, vids) => `
<div class="cl-vids">
  <h2 class="cl-label">Watch</h2>
  <div class="mt-4 grid grid-cols-2 gap-4 sm:mt-6 sm:gap-8">${c.contact.videos.map(id => video(id, vids)).join('')}</div>
</div>`;

const theForm = (c, skin = 'light') => form(c, { skin, label: 'capsLight', idPrefix: 'cl' });

// --------------------------------------------------------------- variants

const VARIANTS = {
  // The shipped composition — heading, socials and Rise Up Kings down the
  // left, the form beside them — on the team page's sky. Mobile order is the
  // shipped one too: heading, form, Rise Up Kings, socials.
  sky: (site, c, vids) => `
<div class="cl cl-sky">
  <div class="cl-skyimg" aria-hidden="true"><img src="/assets/photos/sky-wide.jpg" alt="" decoding="async"></div>
  <div class="cl-wrap">
    <div class="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
      <div class="order-1 text-center sm:text-left lg:order-none lg:col-start-1 lg:row-start-1">${scriptHeading(c)}${lead(c)}</div>
      <div class="order-2 lg:order-none lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:h-full lg:[&>div]:h-full">
        <div class="cl-card">${theForm(c, 'blush')}</div>
      </div>
      <div class="order-3 lg:order-none lg:col-start-1 lg:row-start-3 lg:mt-auto lg:pt-12">${ruk(site, c)}</div>
      <div class="order-4 lg:order-none lg:col-start-1 lg:row-start-2 lg:mt-4">${soc(site)}</div>
    </div>
    ${videos(c, vids)}
  </div>
</div>`,

  // The photograph carries the warmth; the Rise Up Kings card is pinned over
  // its lower corner so the two read as one object.
  arch: (site, c, vids) => `
<div class="cl cl-arch">
  <div class="cl-glow cl-glow-a" aria-hidden="true"></div>
  <div class="cl-glow cl-glow-b" aria-hidden="true"></div>
  <div class="cl-wrap">
    <!-- Below lg: heading, form, socials, photo — the form is not pushed
         under a photograph on a phone. -->
    <div class="grid gap-8 lg:grid-cols-[5fr_6fr] lg:gap-x-16 lg:gap-y-0">
      <div class="order-1 text-center sm:text-left lg:order-none lg:col-start-1 lg:row-start-1">${scriptHeading(c)}${lead(c)}</div>
      <div class="order-2 lg:order-none lg:col-start-2 lg:row-span-3 lg:row-start-1"><div class="cl-card cl-card-lit lg:sticky lg:top-8">${theForm(c, 'light')}</div></div>
      <div class="order-3 lg:order-none lg:col-start-1 lg:row-start-2 lg:mt-7">${soc(site)}</div>
      <div class="order-4 lg:order-none lg:col-start-1 lg:row-start-3">
        <div class="cl-archwrap">
          <div class="cl-archimg"><img src="${PHOTO}" alt="Two women talking together at a Rise Up Queens event" loading="lazy" decoding="async"></div>
          ${ruk(site, c, 'cl-ruk-pin')}
        </div>
      </div>
    </div>
    ${videos(c, vids)}
  </div>
</div>`,

  // One white card holding the photograph and the form side by side; Rise Up
  // Kings becomes a single row underneath.
  split: (site, c, vids) => `
<div class="cl cl-split">
  <div class="cl-skyimg cl-skyimg-soft" aria-hidden="true"><img src="/assets/photos/sky-wide.jpg" alt="" decoding="async"></div>
  <div class="cl-wrap">
    <div class="text-center">${scriptHeading(c, 'cl-h-centre')}${lead(c, 'mx-auto')}</div>
    <div class="cl-splitcard">
      <div class="cl-splitimg">
        <img src="${PHOTO}" alt="Two women talking together at a Rise Up Queens event" loading="lazy" decoding="async">
        <div class="cl-splitsoc">${socials(site, { tone: 'dark', style: 'tile' })}</div>
      </div>
      <div class="cl-splitform">${theForm(c, 'blush')}</div>
    </div>
    ${ruk(site, c, 'cl-ruk-row')}
    ${videos(c, vids)}
  </div>
</div>`,

  // Stationery: a cream sheet with a stitched inner edge, a crown stamp in the
  // corner, and fields drawn as ruled lines to write on.
  letter: (site, c, vids) => `
<div class="cl cl-letter">
  <div class="cl-glow cl-glow-a" aria-hidden="true"></div>
  <div class="cl-glow cl-glow-b" aria-hidden="true"></div>
  <div class="cl-wrap">
    <div class="cl-sheet">
      <div class="cl-stamp" aria-hidden="true"><img src="/assets/brand/crown-magenta.png" alt=""></div>
      <svg class="cl-postmark" aria-hidden="true" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="60" cy="60" r="38" fill="none" stroke="currentColor" stroke-width="1"/>
        <path id="clpm" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" fill="none"/>
        <text font-family="Montserrat, sans-serif" font-size="9" font-weight="700" letter-spacing="3" fill="currentColor"><textPath href="#clpm">RISE UP QUEENS · RISE UP QUEENS ·</textPath></text></svg>
      <div class="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div class="text-center sm:text-left">
          ${scriptHeading(c)}${lead(c)}
          <div class="mt-8">${soc(site)}</div>
        </div>
        <div class="cl-lines">${theForm(c, 'line')}</div>
      </div>
    </div>
    ${ruk(site, c, 'cl-ruk-row cl-ruk-under')}
    ${videos(c, vids)}
  </div>
</div>`,
};

export const CONTACT_LIGHT = Object.keys(VARIANTS);
export const contactLight = (site, c, vids, key = 'sky') => (VARIANTS[key] ?? VARIANTS.sky)(site, c, vids);

// Styles: the .cl-* block in tailwind.css.
