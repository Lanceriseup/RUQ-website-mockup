// Direction B — Luminous (sky & glass).
//
// The five explore pages on the sky from Meet the Team and Contact: the soft
// sky photograph runs up behind the clear nav and fades into a warm blush
// ground, the page name is set in the pink brush script with its hand-drawn
// swash (exactly as contact-light.mjs does), and the content floats on
// frosted-glass cards edged with a fine pink-to-teal line over slowly
// drifting magenta and teal light.
//
// Wow moments: the No Longer Bound ring turning behind its photograph, the
// Freedom ticket with a live countdown, section swashes that draw themselves
// in pink-to-teal as you scroll, and a halo that slowly circles each coach.
//
// Copy is content.json `explore` only. Styles: src/styles/explore/luminous.css
// (every class here is .xl-*, every rule scoped under .xp-luminous).
import { esc, ICON, action, linkAttrs, newTab, isExternal, disabledForm, waitlistForm, videoButton, countdown, coaches, rv } from './shared.mjs';
import { swash } from '../spread.mjs';
import { grow as panelsGrow } from './grow/panels.mjs';

const MAGENTA = '#e8208f';
const LAZY = 'loading="lazy" decoding="async"';

// ------------------------------------------------------------------ atoms

// One gradient for every drawn swash on the page (referenced by id).
const defs = `<svg class="xl-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>
  <linearGradient id="xl-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8208f"/><stop offset=".55" stop-color="#f06aa8"/><stop offset="1" stop-color="#00b9c6"/></linearGradient>
</defs></svg>`;

// The sky (wide on desktop, tall on phones) and the drifting light.
const sky = `
<div class="xl-sky" aria-hidden="true">
  <picture>
    <source media="(max-width: 639px)" srcset="/assets/photos/sky-tall.jpg">
    <img src="/assets/photos/sky-wide.jpg" alt="" decoding="async" fetchpriority="high">
  </picture>
</div>
<div class="xl-orbs" aria-hidden="true">
  <span class="xl-orb xl-orb-m1"></span><span class="xl-orb xl-orb-t1"></span>
  <span class="xl-orb xl-orb-m2"></span><span class="xl-orb xl-orb-t2"></span>
  <span class="xl-orb xl-orb-m3"></span>
</div>`;

// The page shell: sky, light, then the content column.
const page = (cls, body) => `
<div class="xl ${cls}">
  ${defs}${sky}
  <div class="xl-in">${body}</div>
</div>`;

// The page name in the brush script with the hand-drawn swash, as on Contact.
// `sub` joins the h1 as a sans line (Courses: "Continue your journey.").
const hero = ({ title, sub = '', lead = '', id = '' }) => `
<div class="xl-hero${sub ? "" : " xl-hero-solo"}" style="--n:${String(title).length}">
  <h1 class="xl-h1"${id ? ` id="${id}"` : ""}>
    <span class="xl-scriptwrap"><span class="script xl-script">${esc(title)}</span>${swash(MAGENTA)}</span>
    ${sub ? `<span class="xl-h1-sub">${esc(sub)}</span>` : ''}
  </h1>
  ${lead ? `<p class="xl-lead">${esc(lead)}</p>` : ''}
</div>`;

// A swash in the pink-to-teal gradient that draws itself on scroll.
const drawn = `<svg class="xl-swash" viewBox="0 0 300 22" aria-hidden="true" focusable="false"><path data-xp-draw d="M4 14 C 60 6, 110 5, 158 8 S 250 14, 296 9" stroke="url(#xl-grad)" stroke-width="3" stroke-linecap="round" fill="none"/></svg>`;

// Section heading: short names in the script with a drawn swash; long ones
// in the serif. Optional lead under it.
const sectionHead = (heading, lead = '', { script = true, id = '', align = 'centre' } = {}) => `
<div class="xl-head xl-head-${align}" ${rv()}>
  ${script
    ? `<h2 class="xl-h2s"${id ? ` id="${id}"` : ''}><span class="xl-scriptwrap"><span class="script">${esc(heading)}</span>${drawn}</span></h2>`
    : `<h2 class="xl-h2"${id ? ` id="${id}"` : ''}>${esc(heading)}</h2>`}
  ${lead ? `<p class="xl-sublead">${esc(lead)}</p>` : ''}
</div>`;

const btn = (label, href, kind = '') => action(label, href, `xl-btn ${kind}`);

// A text link whose icon never wraps onto a line of its own.
const textLink = (label, href) => {
  const words = String(label).split(' ');
  const last = words.pop();
  return `<a ${linkAttrs(href)} class="xl-textlink">${esc(words.join(' '))}${words.length ? ' ' : ''}<span class="xl-nw">${esc(last)}${isExternal(href) ? ICON.out : ICON.arrow}</span>${newTab(href)}</a>`;
};

// Glass play button for video facades.
const play = `<span class="xl-play" aria-hidden="true"><span class="xl-play-core">${ICON.play}</span></span>`;
const video = (v, { cls = '', label = true } = {}) => videoButton(v, {
  cls: `xl-video ${cls}`,
  ratio: 'xl-ar',
  inner: `<span class="xl-video-shade" aria-hidden="true"></span>${play}${label ? `<span class="xl-video-name" aria-hidden="true">${esc(v.name)}</span>` : ''}`,
});

const formCls = { form: 'xl-form', button: 'xl-submit' };

// ------------------------------------------------------------------ courses

// No Longer Bound on Courses: the mark alone, no photograph, in No Longer
// Bound's own gold rather than Rise Up Queens pink, animated the way the
// homepage banner animates it (nlb.mjs). The mark is four layers — ring and
// leaf, left chain, right chain, fragments: the ring draws itself round, the
// chains slide apart, the fragments scatter, then "Find Freedom" writes itself
// in. Layout B ("side by side") was chosen on 2026-10-04; these are its
// variants, compared on /nlb-course-options.html; B3 "dust" was chosen
// (COURSE_NLB). The "Course 01" pill was removed on request, so the card
// opens on the course name.
//
//   orbit   cream disc circled by two slowly turning gold orbits with beads
//   rays    gold sunburst that blooms in and turns; a shimmer sweeps the ring
//   dust    chains burst apart harder; gold dust rises, sparkles twinkle
//   arch    a gold arched frame draws its keyline first, then the mark
//           animates inside it; a soft light sweeps down the arch
export const NLB_LAYOUTS = ['orbit', 'rays', 'dust', 'arch'];
const COURSE_NLB = 'dust';   // B3, chosen 2026-10-04

const NLB_A = '/assets/nlb/';
const nlbMark = (extra = '') => `
<div class="xl-nbm" role="img" aria-label="No Longer Bound">
  <span class="xl-nbm-glow" aria-hidden="true"></span>
  <img class="xl-nbm-ring" src="${NLB_A}mark-ring.png" alt="" width="900" height="522" ${LAZY}>
  <img class="xl-nbm-left" src="${NLB_A}mark-left.png" alt="" width="900" height="522" ${LAZY}>
  <img class="xl-nbm-right" src="${NLB_A}mark-right.png" alt="" width="900" height="522" ${LAZY}>
  <img class="xl-nbm-bits" src="${NLB_A}mark-bits.png" alt="" width="900" height="522" ${LAZY}>
  ${extra}
</div>`;

// Gold dust for the "dust" variant: fixed, evenly scattered positions, sizes
// and timings (no randomness, so the build is stable).
const DUST = Array.from({ length: 16 }, (_, i) => {
  const left = 8 + ((i * 37) % 84);
  const size = 3 + (i % 3) * 2;
  const dur = (5 + (i % 4) * 1.3).toFixed(1);
  const delay = (-i * 0.55).toFixed(2);
  return `<i style="left:${left}%;--s:${size}px;--dur:${dur}s;--dl:${delay}s"></i>`;
}).join('');

// What sits behind (and, for the shimmer and sparkles, on) the mark.
const STAGE = {
  orbit: () => ({
    back: `<span class="xl-nb-disc" aria-hidden="true"></span>
      <span class="xl-nb-orbit" aria-hidden="true"></span>
      <span class="xl-nb-orbit xl-nb-orbit-2" aria-hidden="true"></span>`,
  }),
  rays: () => ({
    back: `<span class="xl-nb-rays" aria-hidden="true"></span><span class="xl-nb-disc" aria-hidden="true"></span>`,
    on: `<span class="xl-nb-shimmer" aria-hidden="true"></span>`,
  }),
  dust: () => ({
    back: `<span class="xl-nb-disc xl-nb-disc-soft" aria-hidden="true"></span>
      <span class="xl-nb-dust" aria-hidden="true">${DUST}</span>`,
    on: `<span class="xl-nb-sparks" aria-hidden="true">${[0, 1, 2, 3, 4].map(i => `<i style="--i:${i}"><svg viewBox="0 0 24 24"><path d="M12 0c.9 6.6 2.8 9.6 12 12-9.2 2.4-11.1 5.4-12 12-.9-6.6-2.8-9.6-12-12C9.2 9.6 11.1 6.6 12 0z"/></svg></i>`).join('')}</span>`,
  }),
  arch: () => ({
    back: `<span class="xl-nb-arch" aria-hidden="true">
        <span class="xl-nb-arch-sweep"></span>
        <svg class="xl-nb-arch-line" viewBox="0 0 400 480" preserveAspectRatio="none">
          <path pathLength="1" d="M8 472 V200 A192 192 0 0 1 392 200 V472 Z"/>
          <path pathLength="1" d="M24 458 V200 A176 176 0 0 1 376 200 V458 Z"/>
        </svg>
      </span>`,
  }),
};

const nlbCard = (f, layout) => {
  const st = STAGE[layout]();
  return `
  <article class="xl-glass xl-nb xl-nb--${layout}" data-xl-nb ${rv()}>
    <div class="xl-nb-stage">
      ${st.back}
      ${nlbMark(st.on || '')}
    </div>
    <div class="xl-nb-copy">
      <h2 class="xl-nb-name" id="xl-nlb-h">${esc(f.name)}</h2>
      <p class="script xl-nb-script">${esc(f.script)}</p>
      <p class="xl-nb-headline">${esc(f.headline)}</p>
      <p class="xl-nb-q">${esc(f.question)}</p>
      <div class="xl-rule" aria-hidden="true"></div>
      ${f.body ? `<p class="xl-nb-body">${esc(f.body)}</p>` : ''}
      ${btn(f.cta, f.url, 'xl-btn-lg')}
    </div>
  </article>`;
};

/** Courses with a given No Longer Bound layout and "More ways to grow"
 *  section (for the options pages). `grow` is a renderer (g) => HTML; the
 *  default is G1, the expanding panels (grow/panels.mjs), chosen 2026-10-05
 *  from /grow-options.html. */
export const coursesWith = (site, c, layout = COURSE_NLB, grow = panelsGrow) => {
  const x = c.explore.courses;
  const f = x.featured;
  const g = x.grow;
  return page('xl-courses', `
<section class="xl-sec xl-sec-hero" aria-labelledby="xl-courses-h">
  ${hero({ title: x.eyebrow, sub: x.heading, lead: x.lead, id: 'xl-courses-h' })}
</section>

<section class="xl-sec xl-wrap" aria-labelledby="xl-nlb-h">
  ${nlbCard(f, STAGE[layout] ? layout : COURSE_NLB)}
</section>

${grow(g)}`);
};

export const courses = (site, c) => coursesWith(site, c);

// ------------------------------------------------------------------ masterclasses

const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

export const masterclasses = (site, c) => {
  const m = c.explore.masterclasses;
  return page('xl-master', `
<section class="xl-sec xl-sec-hero">
  ${hero({ title: m.heading, lead: m.lead })}
</section>

<section class="xl-sec xl-wrap" aria-label="${esc(m.heading)}">
  <ol class="xl-classes" role="list">
    ${m.items.map((it, i) => `
    <li class="xl-glass xl-class" ${rv(i * 110)}>
      <span class="xl-class-num" aria-hidden="true">${ROMAN[i] || i + 1}</span>
      <p class="xl-pill">${ICON.clock}<span>${esc(it.duration)}</span></p>
      <h2 class="xl-class-name">${esc(it.name)}</h2>
      <p class="xl-class-blurb">${esc(it.blurb)}</p>
      ${textLink(m.form.heading, '#xl-wl-h')}
    </li>`).join('')}
  </ol>
</section>

<section class="xl-sec xl-wrap" aria-labelledby="xl-wl-h">
  <div class="xl-glass xl-panel xl-wl" ${rv()}>
    <div class="xl-wl-art" aria-hidden="true">
      <div class="xl-wl-photo"><img src="/assets/photos/close-laugh.jpg" alt="" ${LAZY}></div>
          </div>
    <div class="xl-wl-form">
      <h2 class="xl-h2s xl-h2s-left" id="xl-wl-h"><span class="xl-scriptwrap"><span class="script">${esc(m.form.heading)}</span>${drawn}</span></h2>
      ${waitlistForm(m, { id: 'xl-wl', cls: formCls })}
    </div>
  </div>
</section>`);
};

// ------------------------------------------------------------------ events

const dayRange = (s) => { const m = String(s).match(/(\d{1,2})\s*[–-]\s*(?:[A-Za-z]+\.?\s+)?(\d{1,2})\b/); return m ? `${m[1]}–${m[2]}` : ''; };
// "May 5–7, 2027" → "May"; "Sept. 29 – Oct. 1, 2027" → "Sep–Oct".
const monthAbbr = (s) => [...new Set(String(s).match(/[A-Z][a-z]+/g) || [])].map(m => m.slice(0, 3)).join('–');

export const events = (site, c) => {
  const e = c.explore.events;
  const [first, ...rest] = e.dates;
  const ticket = `
  <article class="xl-ticket" ${rv()}>
    <div class="xl-ticket-media">
      <img src="/assets/photos/journey-cheer.jpg" alt="A woman wearing a crown cheers with both arms raised at a Freedom event" width="1200" height="1600" ${LAZY}>
      <div class="xl-ticket-shade" aria-hidden="true"></div>
      <div class="xl-ticket-tag">
        <h2 class="script xl-ticket-name">${esc(first.name)}</h2>
        <p class="xl-ticket-month">${esc(first.month)}</p>
      </div>
    </div>
    <div class="xl-ticket-perf" aria-hidden="true"></div>
    <div class="xl-ticket-body">
      <div class="xl-ticket-top">
        <p class="xl-ticket-days" aria-hidden="true">${esc(dayRange(first.dates))}</p>
        <div class="xl-ticket-when">
          <p class="xl-ticket-dates">${ICON.cal}<span>${esc(first.dates)}</span></p>
          <p class="xl-ticket-loc">${ICON.pin}<span>${esc(first.location)}</span></p>
        </div>
      </div>
      ${countdown(first.startsAt, { wrap: 'xl-cd', box: 'xl-cd-box' })}
      <div class="xl-ticket-buy">
        ${first.price ? `<p class="xl-price"><span class="xl-price-n">${esc(first.price)}</span><span class="xl-price-note">${esc(first.priceNote || '')}</span></p>` : ''}
        ${btn(first.cta, first.url, 'xl-btn-lg')}
      </div>
    </div>
  </article>`;

  const later = rest.map(d => `
  <article class="xl-glass xl-date" ${rv(120)}>
    <div class="xl-date-cal" aria-hidden="true"><span>${esc(monthAbbr(d.dates))}</span><b>${esc(dayRange(d.dates))}</b><span>${esc(d.month.split(' ')[1] || '')}</span></div>
    <div class="xl-date-copy">
      <p class="xl-eyebrow">${esc(d.month)}</p>
      <h2 class="xl-date-name">${esc(d.name)}</h2>
      <p class="xl-date-meta"><span class="xl-nw">${ICON.cal} ${esc(d.dates)}</span><span class="xl-sep" aria-hidden="true"></span><span class="xl-nw">${ICON.pin} ${esc(d.location)}</span></p>
    </div>
    ${btn(d.cta, d.url, 'xl-btn-ghost')}
  </article>`).join('');

  const b = e.beyond;
  const journeys = b.journeys.map((j, i) => `
    <li class="xl-glass xl-journey${j.url ? '' : ' xl-journey-quiet'}" ${rv((i % 3) * 90)}>
      <span class="xl-journey-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
      <h3 class="xl-journey-name">${esc(j.name)}</h3>
      <p class="xl-journey-blurb">${esc(j.blurb)}</p>
      ${j.url && j.cta ? textLink(j.cta, j.url) : ''}
    </li>`).join('');

  const info = e.info;
  const w = e.watch;
  const [lead, ...others] = w.videos;

  return page('xl-events', `
<section class="xl-sec xl-sec-hero">
  ${hero({ title: e.heading, lead: e.lead })}
</section>

<section class="xl-sec xl-wrap xl-dates" aria-label="Freedom dates">
  ${ticket}
  ${later}
</section>

<section class="xl-sec xl-wrap" aria-labelledby="xl-beyond-h">
  ${sectionHead(b.heading, b.lead, { id: 'xl-beyond-h' })}
  <ol class="xl-journeys" role="list">${journeys}</ol>
</section>

<section class="xl-sec xl-wrap" aria-labelledby="xl-info-h">
  <div class="xl-info" ${rv()}>
    <div class="xl-info-bg" aria-hidden="true"><img src="/assets/photos/queens-waving.jpg" alt="" ${LAZY}></div>
    <div class="xl-glass xl-info-card">
      <div class="xl-info-copy">
        <p class="script xl-info-script" aria-hidden="true">${esc(first.name)}</p>
        <h2 class="xl-h2" id="xl-info-h">${esc(info.heading)}</h2>
        <p class="xl-sublead xl-sublead-left">${esc(info.lead)}</p>
      </div>
      ${disabledForm({ fields: info.fields, submit: info.submit, id: 'xl-info', cls: formCls, cols: true })}
    </div>
  </div>
</section>

<section class="xl-sec xl-wrap" aria-labelledby="xl-watch-h">
  ${sectionHead(w.heading, w.lead, { script: false, id: 'xl-watch-h' })}
  <div class="xl-vids" ${rv()}>
    ${video(lead, { cls: 'xl-vid-big' })}
    ${others.map(v => video(v)).join('')}
  </div>
</section>`);
};

// ------------------------------------------------------------------ coaching

export const coaching = (site, c) => {
  const k = c.explore.coaching;
  const list = coaches(c);
  return page('xl-coaching', `
<section class="xl-sec xl-sec-hero">
  ${hero({ title: k.heading, lead: k.lead })}
</section>

<section class="xl-sec xl-wrap" aria-label="Coaches">
  <ul class="xl-coaches" role="list">
    ${list.map((p, i) => `
    <li class="xl-glass xl-coach" ${rv((i % 2) * 110)}>
      <div class="xl-coach-photo">
        <span class="xl-coach-halo" aria-hidden="true"></span>
        <img src="${esc(p.photo)}" alt="Portrait of ${esc(p.name)}" ${LAZY}>
      </div>
      <div class="xl-coach-copy">
        <p class="xl-eyebrow">Coach</p>
        <h2 class="xl-coach-name">${esc(p.name)}</h2>
        <p class="xl-coach-blurb">${esc(p.blurb)}</p>
        ${btn(p.cta, p.url, 'xl-btn-sm')}
      </div>
    </li>`).join('')}
  </ul>
</section>

<section class="xl-sec xl-wrap" aria-labelledby="xl-cv-h">
  ${sectionHead(k.videosHeading, '', { id: 'xl-cv-h' })}
  <div class="xl-vids xl-vids-2" ${rv()}>
    ${k.videos.map(v => video(v)).join('')}
  </div>
</section>`);
};

// ------------------------------------------------------------------ free resource

export const free = (site, c) => {
  const r = c.explore.freeResource;
  return page('xl-free', `
<section class="xl-sec xl-sec-hero">
  ${hero({ title: r.heading, lead: r.lead })}
</section>

<section class="xl-sec xl-wrap" aria-labelledby="xl-pending-h">
  <div class="xl-glass xl-pending" ${rv()}>
    <div class="xl-gift" aria-hidden="true">
      <span class="xl-gift-ring xl-gift-ring-1"></span><span class="xl-gift-ring xl-gift-ring-2"></span>
      <span class="xl-spark xl-spark-1"></span><span class="xl-spark xl-spark-2"></span><span class="xl-spark xl-spark-3"></span><span class="xl-spark xl-spark-4"></span>
      <span class="xl-gift-core">${ICON.gift}</span>
    </div>
    <h2 class="xl-h2" id="xl-pending-h">${esc(r.pending.heading)}</h2>
    <div class="xl-rule xl-rule-c" aria-hidden="true"></div>
    <p class="xl-pending-body">${esc(r.pending.body)}</p>
  </div>
</section>`);
};

