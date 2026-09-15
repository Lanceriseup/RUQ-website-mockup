// The scrolled-state capsule.
//
// This is a SEPARATE element from the tall editorial header, not the same one
// re-styled. That matters: the previous approach flipped the header from
// `absolute` to `fixed` while animating width, margin and border-radius, and
// none of that is smooth — position changes are discrete jumps, and the rest
// force layout on every frame.
//
// Here the capsule is permanently fixed and parked off-screen with
// translateY(-160%). Scrolling past the threshold moves it to translateY(0).
// Transform and opacity are the only animated properties, so the whole thing
// runs on the compositor and never touches layout.
//
// On desktop it carries the four links only — no wordmark. The logo has
// already been seen at full size in the header above; repeating it small adds
// nothing.
//
// ── Below sm ─────────────────────────────────────────────────────────────────
// That row does not survive a phone. Four links plus Register measures 576px
// against the 358px a 390px viewport has after gutters, so the pill ran 218px
// off the right edge, "Meet the team" broke onto three lines, and the CTA was
// cut in half.
//
// Below sm the pill therefore carries the wordmark and a burger, and nothing
// else. The links and Register move into a panel the burger opens. Both pills
// are in the DOM and swap at sm — `hidden sm:flex` on the desktop one,
// `flex sm:hidden` on the phone one — so the desktop row is untouched: same
// classes, same order, same everything, from 640px up.
//
// The panel has to live here rather than being shared with the header's
// #navMain drawer, because that drawer is a child of the header and the header
// has scrolled away by the time this exists — toggling it would open a menu
// 800px up the page.
import { esc } from './layout.mjs';

export const capsule = (site, current) => `
<div id="nav-capsule" aria-hidden="true"
     class="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center px-4 pt-3">
  <!-- Pill fill is .65, not the .55 it started at. The capsule is fixed to the
       top of the viewport, so it sits over whatever is scrolled under it, and
       most of this site is white. At .55 it composited to #7f7f7f over a white
       section and its 12px semibold links measured 4.01:1, under the 4.5:1
       small text needs. .65 gives 5.61:1 there and costs nothing over a dark
       section, where it was 18.5:1 and is still 18.4:1.

       Two things this note must not do, both of which it did at some point:
       sit inside the opening tag below, and contain a comment-closing
       sequence. Either one ends the comment early and dumps the rest of it
       onto the page as visible text. HTML comments cannot carry a double
       hyphen at all, so no comment anywhere in this project should quote one. -->
  <nav data-glass class="pointer-events-auto hidden sm:flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 shadow-[0_20px_45px_-20px_rgba(0,0,0,.65)]"
       style="background:rgba(22,22,22,.65)" aria-label="Primary, condensed">
    ${site.nav.map(n => `<a href="${esc(n.href)}"
      class="flex min-h-11 items-center rounded-full px-4 font-body text-[12px] font-semibold uppercase tracking-[0.2em] text-white/85 transition hover:bg-white/10 hover:text-white
             ${current === n.href ? 'bg-white/15 text-white' : ''}
             focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      ${current === n.href ? 'aria-current="page"' : ''}>${esc(n.label)}</a>`).join('')}
    <a href="${esc(site.nextEvent.ctaUrl)}"
       class="ml-1 flex min-h-11 items-center rounded-full bg-cyan px-5 font-body text-[12px] font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-white
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
       ${esc(site.nextEvent.ctaText)}</a>
  </nav>

  <!-- Phone pill. pl-5 pr-2 rather than a symmetric px: the wordmark needs
       air on its left, the burger already carries its own 44px of padding on
       the right, so equal padding would look lopsided in the other direction.

       min-w plus justify-between rather than letting it hug: hugging made the
       pill exactly as wide as the wordmark happened to be, which is a width
       nobody chose — it read cramped, and it would shift if the logo asset
       were ever swapped. A stated width sets the gap between the two controls
       instead of inheriting it. -->
  <nav data-glass class="pointer-events-auto flex sm:hidden min-w-[13rem] items-center justify-between gap-3 rounded-full border border-white/20 py-1.5 pl-5 pr-2 shadow-[0_20px_45px_-20px_rgba(0,0,0,.65)]"
       style="background:rgba(22,22,22,.65)" aria-label="Primary, condensed">
    <a href="/index.html" class="flex shrink-0 items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
      <span class="sr-only">${esc(site.brand.name)} — home</span>
      <img src="${esc(site.assets.logoWhite)}" alt="" width="240" height="88" aria-hidden="true"
           class="h-8 w-auto object-contain" loading="lazy" decoding="async">
    </a>
    <button type="button" id="nav-capsule-toggle" aria-expanded="false" aria-controls="nav-capsule-menu"
            class="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
      <span class="sr-only">Toggle menu</span>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
    </button>
  </nav>

  <!-- Register is the last item rather than a link in the list: the phone pill
       gave up the standing CTA to fit, so this is the only place it survives
       once the hero has scrolled past. -->
  <div id="nav-capsule-menu" data-glass hidden
       class="pointer-events-auto mt-2 w-56 overflow-hidden rounded-2xl border border-white/20 shadow-[0_20px_45px_-20px_rgba(0,0,0,.65)] sm:hidden"
       style="background:rgba(22,22,22,.65)">
    <ul class="p-2">
      ${site.nav.map(n => `<li><a href="${esc(n.href)}"
        class="flex min-h-11 items-center rounded-xl px-4 font-body text-[12px] font-semibold uppercase tracking-[0.2em] text-white/85 transition hover:bg-white/10 hover:text-white ${current === n.href ? 'bg-white/15 text-white' : ''} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        ${current === n.href ? 'aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('')}
      <li class="px-2 pb-1 pt-2">
        <a href="${esc(site.nextEvent.ctaUrl)}"
           class="flex min-h-11 items-center justify-center rounded-full bg-cyan px-4 font-body text-[12px] font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
           ${esc(site.nextEvent.ctaText)}</a>
      </li>
    </ul>
  </div>
</div>`;
