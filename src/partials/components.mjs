import { esc } from './layout.mjs';

// `cls` carries structural classes that are not background or padding — the
// overlapping panel transition needs negative margin, radius, z-index and a
// pseudo-element on the section itself.
export const section = (o) => `
<section class="${o.bg ?? ''} ${o.pad ?? 'py-10 sm:py-16 lg:py-24'} ${o.cls ?? ''}" ${o.id?`id="${esc(o.id)}"`:''}>
  <div class="mx-auto max-w-content px-4">
    ${o.eyebrow?`<p class="font-body text-sm uppercase tracking-[0.2em] text-magenta-text">${esc(o.eyebrow)}</p>`:''}
    ${o.heading?`<h2 class="mt-3 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">${esc(o.heading)}</h2>`:''}
    ${o.lead?`<p class="mt-4 max-w-2xl font-body text-lg text-ink-soft">${esc(o.lead)}</p>`:''}
    ${o.body ?? ''}
  </div>
</section>`;

const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

// Click-to-load facade: no third-party iframe until the visitor asks for it.
// Keeps 15 embeds off the critical path and avoids Wistia/YouTube cookies on load.
export const videoFacade = (v, provider = 'wistia') => `
<figure class="group relative overflow-hidden rounded-xl bg-ink/5 ring-1 ring-ink/10">
  <button type="button" class="video-facade relative flex aspect-video w-full items-center justify-center bg-ink/80"
          data-provider="${esc(provider)}" data-id="${esc(v.id)}" data-title="${esc(v.title)}"
          ${v.hash ? `data-hash="${esc(v.hash)}"` : ''}>
    <span class="sr-only">Play ${esc(v.title)}</span>
    <span aria-hidden="true" class="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg transition group-hover:scale-110">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#B76E79"><path d="M8 5v14l11-7z"/></svg>
    </span>
  </button>
  <figcaption class="flex items-baseline justify-between gap-3 px-4 py-3">
    <span class="font-body text-sm text-ink">${esc(v.title)}</span>
    ${v.seconds?`<span class="shrink-0 font-body text-xs tabular-nums text-ink-soft">${fmt(v.seconds)}</span>`:''}
  </figcaption>
</figure>`;

export const card = (title, body, meta) => `
<article class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink/10 transition hover:shadow-md">
  <h3 class="font-display text-lg font-semibold text-ink">${esc(title)}</h3>
  ${meta?`<p class="mt-1 font-body text-xs uppercase tracking-wider text-magenta-text">${esc(meta)}</p>`:''}
  ${body?`<p class="mt-3 font-body text-sm leading-relaxed text-ink-soft">${esc(body)}</p>`:''}
</article>`;

export const personCard = (m) => `
<article class="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ink/10 transition hover:shadow-md">
  <img src="${esc(m.photo)}" alt="${esc(m.name)}" width="600" height="800" loading="lazy" decoding="async"
       class="aspect-[3/4] w-full bg-ink-line object-cover object-top">
  <div class="p-5">
    <h3 class="font-display text-lg font-semibold text-ink">${esc(m.name)}</h3>
    ${m.role ? `<p class="mt-0.5 font-body text-xs uppercase tracking-wider text-magenta-text">${esc(m.role)}</p>` : ''}
    ${m.bio ? `<p class="mt-3 font-body text-sm leading-relaxed text-ink-soft">${esc(m.bio)}</p>` : ''}
  </div>
</article>`;

export const cta = (label, href, style = 'primary') => {
  const cls = style === 'primary'
    ? 'bg-magenta text-white hover:bg-magenta-deep'
    : 'bg-transparent text-ink ring-1 ring-ink/25 hover:bg-ink/5';
  return `<a href="${esc(href)}" class="inline-block rounded-full px-7 py-3 font-body font-semibold transition ${cls} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">${esc(label)}</a>`;
};

export const faq = (items) => `
<div class="mt-8 divide-y divide-ink/10 border-y border-ink/10">
  ${items.map(f=>`
  <details class="group py-4">
    <summary class="flex cursor-pointer items-center justify-between gap-4 font-display font-semibold text-ink marker:content-none">
      ${esc(f.q)}
      <svg class="shrink-0 transition group-open:rotate-45" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
    </summary>
    <p class="mt-3 max-w-2xl font-body text-ink-soft">${esc(f.a)}</p>
  </details>`).join('')}
</div>`;
