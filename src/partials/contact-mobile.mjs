// Compact mobile treatments for the contact page.
//
// Desktop is a two-column grid: heading, socials and the Rise Up Kings block
// on the left; the form panel on the right, with both columns ending on the
// same line. Below lg the grid collapses to one column and that layout becomes
// a reading order — and the order it produces is:
//
//   heading + lead -> socials -> Rise Up Kings -> FORM -> videos
//
// which puts three blocks in front of the only thing on the page that does
// anything. On desktop the form is level with the heading and needs no
// scrolling to find; on a phone it is roughly 900px down. That is the same
// problem the breakthrough CTA had, and it is worth more here, because this
// page has no other purpose.
//
// Measured at 390px the page is 2465px.
//
// All options are MOBILE ONLY; the two-column desktop layout, including the
// baseline alignment between the columns, is untouched.
import { esc } from './layout.mjs';
import { heading, socials, form, partner, video, watchLabel } from './contact-parts.mjs';
import { renderPanel } from './contact.mjs';

export const GROUND = 'linear-gradient(180deg,#0b0b0b 0%,#130c11 45%,#220d19 100%)';
const SPOTLIGHT = 'radial-gradient(120% 55% at 50% 0%,rgba(255,255,255,.14),rgba(255,255,255,.04) 40%,transparent 72%)';

export const CONTACT_MODES = {
  current: {
    label: 'Current — what ships today',
    note: 'The baseline: heading, socials, the Rise Up Kings block, then the form, then the videos. 96px of header clearance, 48px between blocks, heading at 36px and lead at 18px.',
    pad: 'pb-14 pt-24', gap: 'gap-12', headSize: 'big', lead: 'text-lg',
    socialGap: 'mt-8', partnerGap: 'mt-12', videoGap: 'mt-12', formSpace: 'space-y-5',
    order: 'asIs', videoCols: 1,
  },

  tighten: {
    label: 'A — Tighten, same order',
    note: 'Heading 36→30px, lead 18→16px, the gap between blocks 48→32px, and the form\'s own field spacing 20→16px. Nothing moves; this is the page with its desktop spacing re-judged for a single column. Leaves the form where it is.',
    pad: 'pb-10 pt-24', gap: 'gap-8 lg:gap-12', headSize: 'small', lead: 'text-base',
    socialGap: 'mt-6 sm:mt-8', partnerGap: 'mt-8 sm:mt-12', videoGap: 'mt-10 sm:mt-20', formSpace: 'space-y-4',
    order: 'asIs', videoCols: 1,
  },

  formFirst: {
    label: 'B — A, form straight after the heading',
    note: 'A, and below lg the form moves directly under the heading, with the socials and the Rise Up Kings block following it. This is the only change here that alters what the page does rather than how tall it is: the form is the entire point of a contact page, and today a phone visitor scrolls past three blocks to reach it. The left column keeps its order on desktop, where the form is already level with the heading.',
    pad: 'pb-10 pt-24', gap: 'gap-8 lg:gap-12', headSize: 'small', lead: 'text-base',
    socialGap: 'mt-8', partnerGap: 'mt-8 sm:mt-12', videoGap: 'mt-10 sm:mt-20', formSpace: 'space-y-4',
    order: 'formFirst', videoCols: 1,
  },

  videosTwoUp: {
    label: 'C — B, videos two-up',
    note: 'B, and the two videos sit side by side below sm instead of stacked. At 390px that makes each about 165px wide — small for a 16:9 thumbnail, but these are click-to-open facades with YouTube\'s own play mark on them, not something anyone reads. Saves a full video\'s height at the foot of the page.',
    pad: 'pb-10 pt-24', gap: 'gap-8 lg:gap-12', headSize: 'small', lead: 'text-base',
    socialGap: 'mt-8', partnerGap: 'mt-8 sm:mt-12', videoGap: 'mt-10 sm:mt-20', formSpace: 'space-y-4',
    order: 'formFirst', videoCols: 2,
  },

  leanTail: {
    label: 'D — B, and the tail trimmed',
    note: 'B, with the Rise Up Kings block and the videos pulled tighter still: less air around the partner crest and the video band reduced to its label plus the two thumbnails with no extra top margin. The tail of this page is supporting material — the partner movement and two marriage talks — and on a phone it currently occupies more than the form does. Shortest of the four.',
    pad: 'pb-8 pt-24', gap: 'gap-8 lg:gap-12', headSize: 'small', lead: 'text-base',
    socialGap: 'mt-6', partnerGap: 'mt-6 sm:mt-12', videoGap: 'mt-8 sm:mt-20', formSpace: 'space-y-4',
    order: 'formFirst', videoCols: 2, tightTail: true,
  },
};

export const renderContactMobile = (site, c, vids, modeKey) => {
  const m = CONTACT_MODES[modeKey];

  // The lead's size is set inside heading(), so it is overridden here with a
  // wrapper rule rather than by forking that builder.
  const headBlock = `<div class="${m.lead === 'text-base' ? '[&_p]:text-base [&_h1]:text-3xl sm:[&_p]:text-lg sm:[&_h1]:text-4xl' : ''}">${heading(c, { rule: 'hair' })}</div>`;

  const formBlock = `<div class="${m.formSpace === 'space-y-4' ? '[&_form]:space-y-4 sm:[&_form]:space-y-5' : ''}">${renderPanel('current', form(c, { idPrefix: 'cm' }))}</div>`;
  const socialBlock = `<div class="${m.socialGap}">${socials(site, { style: 'tile' })}</div>`;
  const partnerBlock = `<div class="${m.partnerGap} lg:mt-auto lg:pt-12">${partner(site, c, 'watermark')}</div>`;

  const videoBand = `
  <div class="${m.videoGap}">
    ${watchLabel}
    <div class="mt-4 grid gap-4 sm:mt-6 sm:gap-8 ${m.videoCols === 2 ? 'grid-cols-2' : ''} sm:grid-cols-2">
      ${c.contact.videos.map(id => video(id, vids)).join('')}
    </div>
  </div>`;

  // formFirst reorders only below lg. From lg the grid takes over and the
  // explicit column/row placement rebuilds the shipped two-column layout, so
  // the baseline alignment between the columns is unaffected.
  const body = m.order === 'formFirst'
    ? `
    <div class="grid ${m.gap} lg:grid-cols-[5fr_7fr] lg:gap-16">
      <div class="order-1 lg:order-none lg:col-start-1 lg:row-start-1">${headBlock}</div>
      <div class="order-2 lg:order-none lg:col-start-2 lg:row-span-3 lg:row-start-1">${formBlock}</div>
      <div class="order-3 lg:order-none lg:col-start-1 lg:row-start-2">${socialBlock}</div>
      <div class="order-4 lg:order-none lg:col-start-1 lg:row-start-3 lg:h-full">${partnerBlock}</div>
    </div>`
    : `
    <div class="grid ${m.gap} lg:grid-cols-[5fr_7fr] lg:gap-16">
      <div class="flex h-full flex-col">
        ${headBlock}
        ${socialBlock}
        ${partnerBlock}
      </div>
      ${formBlock}
    </div>`;

  return `
<div id="contact" class="relative" style="background:${GROUND}">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0" style="background:${SPOTLIGHT}"></div>
  <div class="relative mx-auto max-w-content px-4 ${m.pad} sm:pb-24 sm:pt-48">
    ${body}
    ${videoBand}
  </div>
</div>`;
};
