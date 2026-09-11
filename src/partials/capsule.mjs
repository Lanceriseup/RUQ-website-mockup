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
// It carries the four links only — no wordmark. The logo has already been
// seen at full size in the header above; repeating it small adds nothing.
import { esc } from './layout.mjs';

export const capsule = (site, current) => `
<div id="nav-capsule" aria-hidden="true"
     class="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3">
  <!-- Pill fill is .65, not the .55 it started at. The capsule is fixed to the
       top of the viewport, so it sits over whatever is scrolled under it — and
       most of this site is white. At .55 it composited to #7f7f7f over a white
       section and its 12px semibold links measured 4.01:1, under the 4.5:1
       small text needs. .65 gives 5.61:1 there and costs nothing over a dark
       section, where it was 18.5:1 and is still 18.4:1.

       This note lives above the tag, not inside it. A comment inside an
       opening tag is not a comment: the parser ends the tag at the first > it
       finds, which is the one in -->, and everything after it renders as text. -->
  <nav class="pointer-events-auto flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 shadow-[0_20px_45px_-20px_rgba(0,0,0,.65)]"
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
</div>`;
