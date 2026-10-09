// Header submenus — a nav item with `children` renders as a disclosure: a
// button that opens a panel of links, instead of a single link.
//
//   { "label": "About", "children": [
//       { "label": "About Rise Up Queens", "href": "/about.html",
//         "blurb": "...", "thumb": "/assets/..." },
//       { "label": "Meet the Team", "href": "/team.html", ... } ] }
//
// The trigger is a <button>, not a link to the first child: a button that also
// navigates cannot be opened by touch or keyboard without leaving the page.
// It reads as current when any child is the current page.
//
// Open/close is driven by app.js (click, Escape, outside click, and hover with
// a short close delay on pointer devices). Without JS the panel stays closed
// but every child is still in the footer and the phone drawer.
//
// Four panel styles, chosen by opts.submenu or site.navSubmenu:
//   card    small white card under the trigger, teal top edge
//   rich    wider white panel, thumbnail and one-line description per page
//   inline  no card: a centred row of links revealed under the hairline
//   glass   dark frosted panel with teal dots, matching the scrolled capsule
import { esc } from './layout.mjs';

const caret = `<svg class="nav-sub-caret h-3 w-3 shrink-0 transition-transform duration-200" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>`;

const isCurrent = (n, current) => (n.children || []).some(c => c.href === current);

let uid = 0;

// onHero: the trigger sits on the dark photograph (white type). The panels
// carry their own ground, so only `inline`, which has none, reads it.
export const subMenu = (n, current, { style = 'card', triggerClass = '', activeClass = '', onHero = false } = {}) => {
  const id = `nav-sub-${++uid}`;
  const on = isCurrent(n, current);
  const kids = n.children;
  const here = (c) => c.href === current ? 'aria-current="page"' : '';

  const trigger = `<button type="button" data-nav-sub-toggle aria-expanded="false" aria-controls="${id}"
      class="${triggerClass} ${on ? activeClass : ''} gap-1.5">${esc(n.label)}${caret}</button>`;

  const panels = {
    card: `
      <div id="${id}" data-nav-sub-panel class="nav-sub-panel absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2">
        <ul class="w-64 overflow-hidden rounded-xl border border-ink-line bg-white py-2 shadow-[0_24px_50px_-24px_rgba(0,0,0,.45)]">
          <li aria-hidden="true" class="mx-5 mb-1 h-0.5 rounded-full bg-cyan"></li>
          ${kids.map(c => `<li><a href="${esc(c.href)}" ${here(c)}
            class="group flex min-h-11 items-center justify-between gap-3 px-5 font-body text-[12px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-magenta-tint/60 hover:text-magenta-text aria-[current=page]:text-magenta-text focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-magenta">
            ${esc(c.label)}<span aria-hidden="true" class="text-cyan-text opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">→</span></a></li>`).join('')}
        </ul>
      </div>`,

    rich: `
      <div id="${id}" data-nav-sub-panel class="nav-sub-panel absolute left-0 top-full z-50 pt-2">
        <ul class="grid w-[26rem] gap-1 rounded-2xl border border-ink-line bg-white p-2 shadow-[0_30px_60px_-28px_rgba(0,0,0,.5)]">
          ${kids.map(c => `<li><a href="${esc(c.href)}" ${here(c)}
            class="group flex items-center gap-4 rounded-xl p-3 transition hover:bg-magenta-tint/60 aria-[current=page]:bg-cyan-tint/70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-magenta">
            ${(c.thumbs || [c.thumb]).length > 1
              ? `<span class="flex h-16 w-20 shrink-0 items-center justify-center" aria-hidden="true">${c.thumbs.map((t, i) => `<img src="${esc(t)}" alt="" width="40" height="40" loading="lazy" class="${i ? '-ml-3' : ''} h-10 w-10 rounded-full object-cover ring-2 ring-white">`).join('')}</span>`
              : `<img src="${esc(c.thumb)}" alt="" width="80" height="64" loading="lazy" class="h-16 w-20 shrink-0 rounded-lg object-cover">`}
            <span class="min-w-0">
              <span class="block font-display text-[13px] font-bold uppercase tracking-[0.14em] text-ink group-hover:text-magenta-text">${esc(c.label)}</span>
              <span class="mt-0.5 block font-body text-[14px] leading-snug text-ink-soft">${esc(c.blurb || '')}</span>
            </span>
            <span aria-hidden="true" class="ml-auto text-cyan-text transition group-hover:translate-x-1">→</span></a></li>`).join('')}
        </ul>
      </div>`,

    // Positioned against #site-nav-panel (the wrapper is static in this style),
    // so the row centres on the whole bar and lands just under the hairline.
    inline: `
      <div id="${id}" data-nav-sub-panel class="nav-sub-panel absolute inset-x-0 top-full z-50 -mt-3 sm:-mt-4">
        <ul class="flex items-center justify-center gap-2">
          ${kids.map((c, i) => `${i ? `<li aria-hidden="true" class="h-1 w-1 rounded-full ${onHero ? 'bg-white/70' : 'bg-cyan'}"></li>` : ''}<li><a href="${esc(c.href)}" ${here(c)}
            class="relative flex min-h-11 items-center px-4 font-body text-[12px] font-semibold uppercase tracking-[0.25em] transition after:absolute after:inset-x-4 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-cyan after:transition-transform hover:after:scale-x-100 aria-[current=page]:after:scale-x-100
                   ${onHero ? 'text-white [text-shadow:0_1px_10px_rgba(0,0,0,.7)] focus-visible:outline-white' : 'text-ink hover:text-magenta-text focus-visible:outline-magenta'} focus-visible:outline-2">
            ${esc(c.label)}</a></li>`).join('')}
        </ul>
      </div>`,

    glass: `
      <div id="${id}" data-nav-sub-panel class="nav-sub-panel absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2">
        <ul class="w-64 overflow-hidden rounded-2xl border border-white/20 p-2 shadow-[0_24px_50px_-20px_rgba(0,0,0,.65)] backdrop-blur-xl" style="background:rgba(22,22,22,.72)">
          ${kids.map(c => `<li><a href="${esc(c.href)}" ${here(c)}
            class="flex min-h-11 items-center gap-3 rounded-xl px-4 font-body text-[12px] font-semibold uppercase tracking-[0.2em] text-white/85 transition hover:bg-white/10 hover:text-white aria-[current=page]:bg-white/15 aria-[current=page]:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white">
            <span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-cyan"></span>${esc(c.label)}</a></li>`).join('')}
        </ul>
      </div>`,
  };

  return `<div data-nav-sub data-style="${style}" class="nav-sub ${style === 'inline' ? '' : 'relative'} flex">${trigger}${panels[style] || panels.card}</div>`;
};

// Phone drawer: an accordion row. The children sit indented on a cyan rule
// so they read as belonging to About rather than as more top-level pages.
export const drawerSub = (n, current, { linkClass = '', ruleClass = 'border-cyan' } = {}) => {
  const id = `nav-acc-${++uid}`;
  return `<li data-nav-acc>
    <button type="button" data-nav-acc-toggle aria-expanded="false" aria-controls="${id}"
      class="${linkClass} w-full justify-between">${esc(n.label)}${caret}</button>
    <ul id="${id}" hidden class="mb-2 ml-1 border-l ${ruleClass} pl-4">
      ${n.children.map(c => `<li><a href="${esc(c.href)}" ${c.href === current ? 'aria-current="page"' : ''}
        class="${linkClass}">${esc(c.label)}</a></li>`).join('')}
    </ul>
  </li>`;
};
