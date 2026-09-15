// Production header — design G, "editorial hairline".
//
// Centred oversized wordmark, links split either side as small uppercase type
// with wide letter-spacing, and a single cyan hairline beneath. No filled
// buttons in the bar itself; the CTA is a link with a rule under it.
//
// Two modes, because the design has to survive both contexts:
//
//   overHero  — absolutely positioned on top of the dark video hero, white
//               type, transparent ground. Used on the homepage.
//   standard  — a normal white bar with ink type for the eight interior
//               pages, which have light backgrounds and would render white
//               text invisible. Structure, spacing and the cyan hairline are
//               identical, so the two read as the same component.
//
// Links are 12px uppercase at 0.25em tracking — small enough that the 88px
// wordmark stays dominant. Touch targets are still 44px via min-h-11 despite
// the small glyphs.
//
// Over the video the links use the "combined" legibility treatment: a gradient
// scrim fading down from the top edge, plus full-opacity semibold white with a
// soft text shadow. The scrim handles bright frames in the b-roll; the shadow
// handles the scrim's own fade-out. Neither is applied in standard mode.
//
// ── Compact below sm ─────────────────────────────────────────────────────────
// The masthead above is a desktop composition. On a 390px phone it was costing
// 153px — a fifth of the viewport — before a word of content, because the
// wordmark, its padding and the hairline's margins were all sized for a bar
// that has links in it. Below sm that is dialled back to 73px:
//
//               phone (was)   phone (now)   sm and up
//   top pad        28             16           28
//   wordmark       80             44           88
//   rule margins   24 / 20        12 / 0       24 / 20
//   ───────────────────────────────────────────────────
//   total         153             73          161
//
// The breakpoint is sm, not md, deliberately: sm is where the wordmark already
// grew and where every page's header clearance already stepped up, so the
// 640–767px band — which shows a burger but a full-size mark — is left exactly
// as it was. Only phones change.
//
// This is paired, not standalone. The header is absolutely positioned over the
// hero, so each of the four over-hero pages carries its own top padding to
// clear it (hero.mjs, about-hero.mjs, contact.mjs, team.mjs). Those came down
// from pt-44 to pt-24 with this change and have to move together — shrink the
// bar alone and the page looks identical, just with a smaller logo floating in
// the same gap.
import { esc } from './layout.mjs';

export const header = (site, current, opts = {}) => {
  const onHero = Boolean(opts.overHero);

  const linkBase =
    'flex min-h-11 items-center px-3 font-body text-[12px] uppercase tracking-[0.25em] transition focus-visible:outline-2 focus-visible:outline-offset-2';

  // Over the video: full-opacity white, semibold, and a soft text shadow.
  // The shadow is the second half of the "combined" treatment — the scrim
  // below covers bright frames, and this covers the scrim's own soft edge
  // where it fades to transparent.
  const linkTone = onHero
    ? 'text-white font-semibold hover:text-cyan focus-visible:outline-white [text-shadow:0_1px_10px_rgba(0,0,0,.7)]'
    : 'text-ink-soft hover:text-magenta-text focus-visible:outline-magenta';
  const linkActive = onHero ? 'text-cyan' : 'text-magenta-text';

  const link = (n) => `<a href="${esc(n.href)}"
      class="${linkBase} ${linkTone} ${current === n.href ? linkActive : ''}"
      ${current === n.href ? 'aria-current="page"' : ''}>${esc(n.label)}</a>`;

  const half = Math.ceil(site.nav.length / 2);

  // justify-evenly, not justify-center: it distributes the two links across
  // their half so the gap between Home and Meet the team matches the gap to
  // the logo and to the edge, rather than clumping them in the middle.
  const group = 'flex-1 justify-evenly';

  // Logo at +60% (80px / 88px) from sm up. Ships as a white PNG; on light
  // ground `brightness-0` renders it solid black rather than shipping a 2nd
  // asset.
  //
  // -translate-y-2 is optical, not geometric. The crown sits above the
  // wordmark and adds mass to the top of the bounding box, so aligning the box
  // centre to the links leaves the *word* "Rise Up Queens" reading low. Lifting
  // it 8px puts the wordmark's visual centre on the links' baseline instead.
  // It is a large-size correction only — at the phone size below there is no
  // perceptible error to correct, and applying it just pushes the mark off
  // centre against the burger.
  //
  // Below sm the mark drops to 44px, matching the burger's height so the two
  // read as one row. That is the single biggest saving in the compact header:
  // the phone was spending 80px on a logo that only needs to be recognisable,
  // not dominant — there are no links beside it to out-weigh.
  const logo = `<img src="${esc(site.assets.logoWhite)}" alt="${esc(site.brand.name)}"
      width="240" height="88" loading="eager" decoding="async"
      id="site-nav-logo" class="h-11 w-auto object-contain sm:h-[5.5rem] sm:-translate-y-2 ${onHero ? '' : 'brightness-0'}">`;

  const burgerTone = onHero ? 'text-white' : 'text-ink';

  // Gradient scrim, hero mode only. Extends below the header and fades out, so
  // the type sits on a controlled ground regardless of what the footage is
  // doing. Interior pages need none of this — ink on white is already at full
  // contrast.
  //
  // It can be turned off while staying in hero mode. The header paints above
  // the page, so on a page that is already dark at the top the scrim buys no
  // legibility and instead lays 80% ink over the first 288px of content —
  // which turns a white page heading grey. Pass scrim: false there.
  // Scaled to the header it sits behind: a 288px gradient under a 73px phone
  // bar is mostly gradient over content, which greys the top of the hero for
  // no legibility gain.
  const wantsScrim = onHero && opts.scrim !== false;
  const scrim = wantsScrim
    ? `<div id="site-nav-scrim" class="pointer-events-none absolute inset-x-0 top-0 h-56 sm:h-72 bg-gradient-to-b from-ink/80 via-ink/40 to-transparent"></div>`
    : '';

  return `
<header id="site-nav" data-over-hero="${onHero ? '1' : '0'}"
        class="${onHero ? 'absolute inset-x-0 top-0' : 'relative border-b border-ink-line bg-white'} z-40">
  ${scrim}
  <div id="site-nav-panel" class="relative mx-auto max-w-content px-4 pt-4 ${onHero ? 'sm:pt-7' : 'sm:pt-5'}">
    <nav class="flex items-center justify-between gap-4" aria-label="Primary">
      <!-- Phone-only counterweight. The two link groups are hidden below md,
           so justify-between used to pin the wordmark to the left edge — the
           masthead was only ever centred on desktop. This empty 44px box
           matches the burger opposite it, which puts the mark back on the
           centre axis without moving the burger off the right edge where the
           thumb already expects it. Gone from sm up, where the real links take
           over the job of balancing the row. -->
      <div class="h-11 w-11 shrink-0 sm:hidden" aria-hidden="true"></div>
      <div class="hidden ${group} md:flex">${site.nav.slice(0, half).map(link).join('')}</div>
      <a href="/index.html" class="shrink-0">${logo}</a>
      <div class="hidden ${group} md:flex">${site.nav.slice(half).map(link).join('')}</div>
      <button type="button" id="site-nav-burger" class="nav-toggle grid h-11 w-11 place-items-center rounded-lg md:hidden ${burgerTone}"
              data-target="navMain" aria-expanded="false" aria-controls="navMain">
        <span class="sr-only">Toggle menu</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
    </nav>

    <!-- The header's Register Now was removed: the hero carries the real CTA
         as a filled button, and two of them on one screen split the action.
         The scrolled capsule still has one, for after the hero is gone. -->
    <!-- The hairline is 1px that costs 45px: on a phone its margins were the
         second-biggest line in the header's budget. Below sm they come down to
         12px above and, over the hero, nothing below — the rule becomes the
         bar's bottom edge. Interior pages keep 12px underneath, because there
         the header also carries a grey border-b and butting the two together
         reads as an accidental double rule. -->
    <div id="site-nav-rule" class="mt-3 ${onHero ? '' : 'mb-3'} sm:mt-6 sm:mb-5 h-px w-full bg-gradient-to-r from-transparent via-cyan to-transparent"></div>
  </div>

  <ul id="navMain" hidden
      class="md:hidden ${onHero ? 'bg-ink/95 backdrop-blur' : 'border-t border-ink-line bg-white'} px-6 py-4">
    ${site.nav.map(n => `<li><a href="${esc(n.href)}"
      class="flex min-h-11 items-center font-body text-[12px] uppercase tracking-[0.25em] ${onHero ? 'text-white' : 'text-ink'}">${esc(n.label)}</a></li>`).join('')}
  </ul>
</header>`;
};
