// Contact — the approved split layout, with three things still open.
//
// The layout and the form panel's character are settled: heading, socials and
// Rise Up Kings down a narrow left column, the form opposite on a raised glass
// panel, the two videos in a band underneath. The six alternative treatments
// that briefly lived here have been dropped — they changed the thing that was
// already right.
//
// What is open is three separate choices, and they are kept as three separate
// arguments so they can be mixed rather than picked as a set:
//
//   rule     what sits under the word "Contact" (the magenta-to-cyan bar is out)
//   partner  how the Rise Up Kings crest is built into its block
//   panel    how far the form panel's own styling is pushed
//
// There is no mockup note in any combination. The fields are still disabled —
// see contact-parts.mjs for what that costs.
import { GROUND, SPOTLIGHT } from './team.mjs';
import { MAGENTA, CYAN, socials, form, video, partner, heading, watchLabel } from './contact-parts.mjs';

export { HEADING_RULES } from './contact-parts.mjs';
export { PARTNER_SHAPES } from './contact-parts.mjs';
export { SOCIAL_STYLES } from './contact-parts.mjs';

// The form panel. `current` is what is on the page now and what was approved;
// the other five push it without changing its character, because the character
// is not what was objected to.
export const PANEL_STYLES = {
  current: {
    label: 'Current — soft glass, wide radius',
    note: 'What is on the page now: a 24px radius, a 5% white fill, a hairline ring and a deep soft shadow, over a light blur. Here for comparison — the others are all measured against it.',
  },
  sharper: {
    label: 'Sharper — tighter radius, brighter edge, no blur',
    note: 'Half the corner radius and a ring at twice the strength, with the backdrop blur dropped so the ground reads cleanly through the fill. Crisper and more deliberate; the panel stops looking soft-focus and starts looking cut.',
  },
  lip: {
    label: 'Lip — a lit top edge',
    note: 'The same panel with a single hairline of light running across its top edge and fading out at both ends. It is the smallest change here and the one that does the most: the panel reads as a physical surface catching light from above rather than as a flat tint.',
  },
  framed: {
    label: 'Framed — a second rule set inside the panel',
    note: 'A thin inset frame drawn inside the panel edge, leaving a narrow margin between the two. Gives the form a sense of being mounted rather than dropped in, and it is the option that most resembles the ticket treatment on the homepage.',
  },
  deep: {
    label: 'Deep — darker than the page, not lighter',
    note: 'The panel goes darker than the plum instead of lighter, with a stronger blur behind it. The form recedes and the left column becomes the brightest thing on the page. Pick this if the heading and Rise Up Kings should carry as much weight as the form.',
  },
  edge: {
    label: 'Edge — a brand hairline on the panel itself',
    note: 'A one-pixel magenta-to-cyan edge around the panel, replacing the neutral ring. It puts the brand gradient back on the page after it comes off the heading, which may be exactly the trade worth making — or may just move the problem.',
  },
};

const PANEL_BASE = 'p-7 sm:p-9';

const PANEL = {
  current: (inner) => `
<div class="rounded-3xl bg-white/[.05] ${PANEL_BASE} ring-1 ring-white/10 shadow-[0_40px_90px_-50px_rgba(0,0,0,1)] backdrop-blur-sm">${inner}</div>`,

  sharper: (inner) => `
<div class="rounded-xl bg-white/[.05] ${PANEL_BASE} ring-1 ring-white/20 shadow-[0_30px_70px_-40px_rgba(0,0,0,1)]">${inner}</div>`,

  // The lip is a child rather than a border-top: a border would run the full
  // width at full strength and meet the rounded corners as two hard stops.
  // This fades out at both ends, so it reads as light rather than as a line.
  lip: (inner) => `
<div class="relative rounded-3xl bg-white/[.05] ${PANEL_BASE} ring-1 ring-white/10 shadow-[0_40px_90px_-50px_rgba(0,0,0,1)] backdrop-blur-sm">
  <span aria-hidden="true" class="pointer-events-none absolute inset-x-8 top-0 h-px"
        style="background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent)"></span>
  ${inner}
</div>`,

  framed: (inner) => `
<div class="relative rounded-3xl bg-white/[.05] p-3 ring-1 ring-white/10 shadow-[0_40px_90px_-50px_rgba(0,0,0,1)] backdrop-blur-sm">
  <div class="rounded-[1rem] p-5 ring-1 ring-white/10 sm:p-7">${inner}</div>
</div>`,

  deep: (inner) => `
<div class="rounded-3xl bg-black/30 ${PANEL_BASE} ring-1 ring-white/10 shadow-[0_40px_90px_-45px_rgba(0,0,0,1)] backdrop-blur-md">${inner}</div>`,

  // A padded gradient wrapper, not a gradient border: a gradient border-image
  // has no reliable corner radius in Safari.
  edge: (inner) => `
<div class="rounded-3xl p-px shadow-[0_40px_90px_-50px_rgba(0,0,0,1)]" style="background:linear-gradient(140deg,${MAGENTA},${CYAN})">
  <div class="rounded-[calc(1.5rem-1px)] ${PANEL_BASE}" style="background:#170c12">${inner}</div>
</div>`,
};

export const renderPanel = (key, inner) => (PANEL[key] ?? PANEL.current)(inner);

// -------------------------------------------------------------------- page

const videoBand = (c, vids) => `
<div class="mt-20">
  ${watchLabel}
  <div class="mt-6 grid gap-8 sm:grid-cols-2">
    ${c.contact.videos.map(id => video(id, vids)).join('')}
  </div>
</div>`;

export const renderContactPage = (site, c, vids, opts = {}) => {
  const { rule = 'hair', partnerShape = 'watermark', panel = 'current', social = 'chip' } = opts;
  return `
<div class="relative" style="background:${GROUND}">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0" style="background:${SPOTLIGHT}"></div>
  <div class="relative mx-auto max-w-content px-4 pb-24 pt-44 sm:pt-48">

    <!-- The Rise Up Kings block sits on the same baseline as the foot of the
         form panel. That works because grid rows stretch by default, so the
         left column is already as tall as the form; making it a flex column
         and giving the last child lg:mt-auto pushes it to that bottom edge.
         No height is measured and none is hard-coded, so it stays aligned
         whatever the form grows to.

         lg only. Below that the grid is a single column and there is no
         second column to align with — mt-auto would just add a gap. -->
    <div class="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
      <div class="flex h-full flex-col">
        ${heading(c, { rule })}
        <div class="mt-12">${socials(site, { style: social })}</div>
        <div class="mt-12 lg:mt-auto lg:pt-12">${partner(site, c, partnerShape)}</div>
      </div>
      <div>${renderPanel(panel, form(c, { idPrefix: 'ct' }))}</div>
    </div>

    ${videoBand(c, vids)}
  </div>
</div>`;
};
