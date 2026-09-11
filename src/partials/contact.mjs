// Contact — the split skeleton, six ways.
//
// The layout is settled: a narrow left column carrying the heading, the lead,
// the socials and Rise Up Kings, the form opposite it, and the two videos in a
// band underneath. What is open is how it is dressed, and that is what these
// six vary — the form in particular, because it is the largest object on the
// page and nearly all of the page's character comes from it.
//
//   lined     no panel at all; underline fields straight on the plum
//   plate     the form on a white card, the page flipping light where you type
//   glow      dark glass with a magenta rim glow, echoing the homepage CTA
//   inset     the form recessed into the page rather than raised off it
//   brand     magenta-to-cyan edge, brand labels, gradient Submit
//   float     an oversized card lifted off the page, overlapping the column
//
// No mockup note in any of them — see contact-parts.mjs for what that costs.
// The Rise Up Kings crest is rendered in all six from site.assets.logoParent.
import { GROUND, SPOTLIGHT } from './team.mjs';
import { MAGENTA, CYAN, socials, form, video, partner, heading, watchLabel } from './contact-parts.mjs';

export const CONTACT_STYLES = {
  lined: {
    label: 'Lined — no panel, nothing but type and rules',
    note: 'The form has no container at all. Fields are a single hairline each, sitting straight on the plum, and a vertical rule separates the two columns. The lightest and most editorial of the six — it makes the page feel like a letterhead rather than an app screen. Also the only one where the ground is visible behind the form, so the spotlight reads across the whole width.',
  },
  plate: {
    label: 'Plate — the form on white, the page flipping light where you type',
    note: 'The form is lifted onto a white card while the left column stays dark, so the page changes temperature exactly where you are asked to act. The highest-contrast option and the one that reads most obviously as "this is the thing to fill in". It is also the only one where the form would still look right if the fields were ever switched on and showed real typed text.',
  },
  glow: {
    label: 'Glow — dark glass under a magenta rim light',
    note: 'The panel is darker than the page rather than lighter, and a magenta rim light runs around its edge on a slow loop — the same rimGlow the homepage closing CTA uses, so the two ends of the site rhyme. Fields are recessed into the glass. The most atmospheric, and the closest in feel to the rest of the redesign.',
  },
  inset: {
    label: 'Inset — the form pressed into the page, not raised off it',
    note: 'Everything else here floats a panel above the ground; this one cuts a well into it. The form area is darker than the plum with an inner shadow around the lip, and the fields sit deeper still. Quiet, tactile, and it leaves the left column as the brightest thing on the page — worth it if the heading and the Rise Up Kings block matter as much as the form.',
  },
  brand: {
    label: 'Brand — magenta to cyan on the edge, the labels and the button',
    note: 'The panel is edged in the brand gradient, each field label is set in magenta, and Submit runs the full magenta-to-cyan sweep. The most colourful of the six and the most obviously on-brand at a glance. The risk is that the gradient is already doing a lot of work elsewhere on the site, so this page stops being a quiet end point.',
  },
  float: {
    label: 'Float — an oversized card lifted clear of the page',
    note: 'The form card is wider than its column, overlaps the left one, and casts a deep shadow, so it reads as something laid on top of the page rather than set into it. The most three-dimensional option and the one with the most physical presence. It needs the widest screen of the six to look right; below lg it settles back into a normal stack.',
  },
};

// -------------------------------------------------------------- shared body

// The videos always run as a band under both columns. They are the one part of
// the page that does not change between the six, because a YouTube poster is a
// photograph and no amount of framing makes two of them read differently.
const videoBand = (c, vids, opts = {}) => `
<div class="mt-20">
  ${watchLabel}
  <div class="mt-6 grid gap-8 sm:grid-cols-2">
    ${c.contact.videos.map(id => video(id, vids, opts)).join('')}
  </div>
</div>`;

const shell = (inner) => `
<div class="relative mx-auto max-w-content px-4 pb-24 pt-44 sm:pt-48">${inner}</div>`;

// ---------------------------------------------------------------- treatments

const RENDER = {
  lined: (site, c, vids) => shell(`
  <!-- The divider is a border on the right-hand column rather than an absolute
       rule, so it starts and stops with the content instead of needing a
       height in pixels that would be wrong at every other breakpoint. -->
  <div class="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-0">
    <div class="lg:pr-14">
      ${heading(c, { rule: 'hair' })}
      <div class="mt-12">${socials(site, { shape: 'bare' })}</div>
      <div class="mt-12">${partner(site, c, 'beside')}</div>
    </div>
    <div class="lg:border-l lg:border-white/10 lg:pl-14">
      ${form(c, { skin: 'underline', label: 'quiet', submit: 'outline', idPrefix: 'ln' })}
    </div>
  </div>
  ${videoBand(c, vids, { radius: 'rounded-none', ring: 'ring-0' })}`),

  plate: (site, c, vids) => shell(`
  <div class="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
    <div>
      ${heading(c)}
      <div class="mt-12">${socials(site)}</div>
      <div class="mt-12">${partner(site, c, 'beside')}</div>
    </div>
    <div>
      <div class="rounded-[2rem] bg-white p-8 shadow-[0_50px_110px_-45px_rgba(0,0,0,1)] sm:p-10">
        <h2 class="font-display text-2xl font-bold text-ink">Send us a message</h2>
        <p class="mt-2 font-body text-ink-soft">Our team reads every one.</p>
        <div class="mt-8">${form(c, { skin: 'light', label: 'capsLight', idPrefix: 'pl' })}</div>
      </div>
    </div>
  </div>
  ${videoBand(c, vids)}`),

  // Reuses the closing CTA's rim light rather than building a second one:
  // .ctk-rimGlow on an ancestor drives .cta-shell::after, which is already in
  // tailwind.css and already hidden under prefers-reduced-motion. The panel
  // therefore has to BE .cta-shell, and it has to be `relative` for the
  // pseudo-element's inset-0 to have something to sit in.
  glow: (site, c, vids) => shell(`
  <div class="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
    <div>
      ${heading(c)}
      <div class="mt-12">${socials(site)}</div>
      <div class="mt-12">${partner(site, c, 'beside')}</div>
    </div>
    <div class="ctk-rimGlow">
      <div class="cta-shell relative rounded-[2rem] bg-black/35 p-8 ring-1 ring-white/10 backdrop-blur-md sm:p-10">
        ${form(c, { skin: 'inset', idPrefix: 'gl' })}
      </div>
    </div>
  </div>
  ${videoBand(c, vids)}`),

  inset: (site, c, vids) => shell(`
  <div class="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
    <div>
      ${heading(c)}
      <div class="mt-12">${socials(site)}</div>
      <div class="mt-12">${partner(site, c, 'beside')}</div>
    </div>
    <div>
      <!-- A well, not a panel: darker than the page, with the highlight on the
           BOTTOM lip and the shadow on the top one, which is what reads as cut
           in rather than raised. -->
      <div class="rounded-[2rem] bg-black/25 p-8 shadow-[inset_0_3px_18px_rgba(0,0,0,.85),inset_0_-1px_0_rgba(255,255,255,.07)] sm:p-10">
        ${form(c, { skin: 'inset', idPrefix: 'in' })}
      </div>
    </div>
  </div>
  ${videoBand(c, vids)}`),

  brand: (site, c, vids) => shell(`
  <div class="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
    <div>
      ${heading(c)}
      <div class="mt-12">${socials(site, { shape: 'tile' })}</div>
      <div class="mt-12">${partner(site, c, 'beside')}</div>
    </div>
    <div>
      <!-- The gradient edge is a padded wrapper, not a border-image: a
           gradient border has no reliable radius in Safari. -->
      <div class="rounded-[2rem] p-[2px]" style="background:linear-gradient(140deg,${MAGENTA},${CYAN})">
        <div class="rounded-[calc(2rem-2px)] p-8 sm:p-10" style="background:#170c12">
          ${form(c, { skin: 'soft', label: 'brand', submit: 'gradient', idPrefix: 'br' })}
        </div>
      </div>
    </div>
  </div>
  ${videoBand(c, vids)}`),

  float: (site, c, vids) => shell(`
  <!-- items-center, so the lifted card is centred against the left column
       rather than hanging off the top of it. The overlap is lg-only; at
       narrower widths the grid is one column and a negative margin would drag
       the card off the side of the screen. -->
  <div class="grid items-center gap-12 lg:grid-cols-[5fr_7fr] lg:gap-8">
    <div class="lg:pr-6">
      ${heading(c)}
      <div class="mt-12">${socials(site)}</div>
      <div class="mt-12">${partner(site, c, 'beside')}</div>
    </div>
    <div class="relative z-10 lg:-ml-16 lg:-mr-6">
      <div class="rounded-[2rem] bg-white/[.07] p-8 ring-1 ring-white/[.14] shadow-[0_70px_140px_-50px_rgba(0,0,0,1)] backdrop-blur-md sm:p-11">
        ${form(c, { skin: 'filled', idPrefix: 'fl' })}
      </div>
    </div>
  </div>
  ${videoBand(c, vids)}`),
};

// The page ground: the team page's, imported rather than copied.
export const renderContactPage = (site, c, vids, key = 'lined') => `
<div class="relative" style="background:${GROUND}">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0" style="background:${SPOTLIGHT}"></div>
  ${(RENDER[key] ?? RENDER.lined)(site, c, vids)}
</div>`;
