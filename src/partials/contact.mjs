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
  <div class="h-full rounded-[1rem] p-5 ring-1 ring-white/10 sm:p-7">${inner}</div>
</div>`,

  deep: (inner) => `
<div class="rounded-3xl bg-black/30 ${PANEL_BASE} ring-1 ring-white/10 shadow-[0_40px_90px_-45px_rgba(0,0,0,1)] backdrop-blur-md">${inner}</div>`,

  // A padded gradient wrapper, not a gradient border: a gradient border-image
  // has no reliable corner radius in Safari.
  edge: (inner) => `
<div class="rounded-3xl p-px shadow-[0_40px_90px_-50px_rgba(0,0,0,1)]" style="background:linear-gradient(140deg,${MAGENTA},${CYAN})">
  <div class="h-full rounded-[calc(1.5rem-1px)] ${PANEL_BASE}" style="background:#170c12">${inner}</div>
</div>`,
};

export const renderPanel = (key, inner) => (PANEL[key] ?? PANEL.current)(inner);

// -------------------------------------------------------------------- page

const videoBand = (c, vids) => `
<div class="mt-10 sm:mt-20">
  ${watchLabel}
  <div class="mt-4 grid grid-cols-2 gap-4 sm:mt-6 sm:gap-8">
    ${c.contact.videos.map(id => video(id, vids)).join('')}
  </div>
</div>`;

export const renderContactPage = (site, c, vids, opts = {}) => {
  const { rule = 'hair', partnerShape = 'watermark', panel = 'current', social = 'chip' } = opts;
  return `
<div class="relative" style="background:${GROUND}">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0" style="background:${SPOTLIGHT}"></div>
  <div class="relative mx-auto max-w-content px-4 pb-10 pt-24 sm:pb-24 sm:pt-48">

    <!-- The Rise Up Kings block and the form panel end on the same line.
         Which of the two is doing the work depends on which column is taller,
         and BOTH have to be handled or it only aligns half the time:

           left taller   the panel is the grid item itself, with no wrapper
                         around it, so align-items: stretch (the grid default)
                         grows it down to the row. This is the live case — the
                         heading, lead, socials and Rise Up Kings together run
                         past the foot of the form.
           right taller  the left column is a flex column and its last child
                         takes lg:mt-auto, which pushes the block down to meet
                         the panel.

         The first attempt only did the second, so on the real page mt-auto had
         no slack to use and nothing moved.

         No height is measured or hard-coded anywhere, so this survives the
         form gaining a field or the lead gaining a line. lg only: below that
         the grid is one column and there is nothing to align to. -->
    <!-- Four grid children rather than a left column plus the panel, so the
         reading order can differ from the column order.

         Collapsed to one column this page used to read heading, socials, Rise
         Up Kings, FORM, videos — three blocks in front of the only thing on a
         contact page that does anything, putting the form 652px down. On
         desktop the form is level with the heading and needs no scrolling at
         all, so the problem was created purely by the collapse.

         Below lg the order is now heading, form, Rise Up Kings, socials,
         videos, and the form starts at 293px.

         From lg the explicit col-start/row-start placement rebuilds the
         shipped two-column layout: heading, socials and Rise Up Kings down the
         left, the form spanning all three rows on the right. The partner block
         keeps lg:mt-auto, which is what makes both columns end level — see the
         note above; the form spanning the rows is what gives that mt-auto the
         slack it needs. -->
    <div class="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
      <!-- Centred below sm only. In the desktop two-column layout the heading
           is the top of a narrow left column and has to hold that column's
           left edge; collapsed to one column there is no edge to hold, and the
           form beneath it is full width. The hairline rule is w-full either
           way, so it needs nothing. -->
      <div class="order-1 text-center sm:text-left lg:order-none lg:col-start-1 lg:row-start-1">${heading(c, { rule })}</div>
      <!-- lg:h-full on the wrapper AND on the panel inside it. The panel used
           to be the grid item itself, so align-items:stretch grew it down to
           the row and that is what made both columns end level. Wrapping it to
           give it an order/placement broke that: the WRAPPER stretched and the
           panel kept its natural height, leaving Rise Up Kings 122px below it.
           The child selector puts the stretch back on the panel. -->
      <div class="order-2 lg:order-none lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:h-full lg:[&>div]:h-full">${renderPanel(panel, form(c, { idPrefix: 'ct' }))}</div>
      <div class="order-3 lg:order-none lg:col-start-1 lg:row-start-3 lg:mt-auto lg:pt-12">${partner(site, c, partnerShape)}</div>
      <div class="order-4 lg:order-none lg:col-start-1 lg:row-start-2 lg:mt-4">${socials(site, { style: social })}</div>
    </div>

    ${videoBand(c, vids)}
  </div>
</div>`;
};
