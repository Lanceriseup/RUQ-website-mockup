// Direction A — Couture. The five explore pages as an editorial magazine:
// warm ivory paper, each page named in the pink brush script at poster size,
// photographs in tall arched frames, Cormorant numerals and pull quotes, fine
// hairline rules. Copy comes only from content.json → explore; the few words
// written here are neutral labels ("Chapter I", "Contents", "Watch").
//
// Styles: src/styles/explore/couture.css (every class prefixed xc-).
import {
  esc, ICON, action, linkAttrs, newTab, isExternal, fill,
  disabledForm, waitlistForm, videoButton, countdown, coaches, rv,
} from './shared.mjs';

// ------------------------------------------------------------------ helpers

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const nn = (i) => String(i + 1).padStart(2, '0');

/** Hand-drawn swash under a script word; draws itself once on load. */
const swash = () => `<svg class="xc-swash" aria-hidden="true" viewBox="0 0 300 20" fill="none" preserveAspectRatio="none"><path pathLength="1" d="M4 13 C 60 5, 110 4, 158 7 S 250 13, 296 8" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/></svg>`;

/** The page's name in the brush script with its swash. */
const script = (text, cls = '') => `<span class="xc-scriptwrap ${cls}"><span class="xc-script">${esc(text)}</span>${swash()}</span>`;

/** Masthead folio: a hairline with the brand and the section. */
const folio = (section) => `
<div class="xc-folio" ${rv()}><span>Rise Up Queens</span><span class="xc-folio-rule" aria-hidden="true"></span><span>${esc(section)}</span></div>`;

/** A photograph in an arched frame that wipes open on scroll. */
const arch = ({ src, alt = '', cls = '', pos = '50% 50%', w, h, eager = false, delay = 0 }) => `
<figure class="xc-arch ${cls}" ${rv(delay)}>
  <span class="xc-arch-line" aria-hidden="true"></span>
  <span class="xc-arch-in"><img src="${esc(src)}" alt="${esc(alt)}" ${w ? `width="${w}" height="${h}"` : ''} style="object-position:${pos}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></span>
</figure>`;

/** Primary button and quiet text link, both via the shared action(). */
const btn = (label, href, cls = '') => action(label, href, `xc-btn ${cls}`);
const tlink = (label, href, cls = '') => action(label, href, `xc-tlink ${cls}`);

/** "Inside" cover lines: anchors to the page's own sections. */
const inside = (rows, label = 'Inside') => `
<nav class="xc-inside" aria-label="${esc(label)}" ${rv(420)}>
  <p class="xc-label">${esc(label)}</p>
  <ol>${rows.map(r => `<li><a href="${esc(r.href)}"><span class="xc-inside-n" aria-hidden="true">${esc(r.n)}</span><span class="xc-inside-t">${esc(r.t)}</span>${r.sub ? `<span class="xc-inside-s">${esc(r.sub)}</span>` : ''}</a></li>`).join('')}</ol>
</nav>`;

const play = `<span class="xc-play" aria-hidden="true">${ICON.play}</span>`;

// Form class hooks shared by both forms.
const FORM_CLS = { form: 'xc-form', field: 'xc-field', button: 'xc-submit' };

// ================================================================== COURSES

export const courses = (site, c) => {
  const k = c.explore.courses, f = k.featured, m = k.more, g = k.grow;
  return `
<section class="xc-hero xc-hero-courses">
  <div class="xc-wrap">${folio(k.eyebrow)}</div>
  <div class="xc-wrap xc-hero-grid">
    <div class="xc-hero-copy">
      <h1 class="xc-h1">
        <span class="xc-h1-script" ${rv(60)}>${script(k.eyebrow)}</span>
        <span class="xc-display xc-h1-display" ${rv(200)}>${esc(k.heading)}</span>
      </h1>
      <p class="xc-lead" ${rv(300)}>${esc(k.lead)}</p>
      ${inside([
        { n: '01', t: f.name, href: '#xc-nlb' },
        { n: '02', t: m.name, href: '#xc-more' },
        { n: '—', t: g.heading, href: '#xc-grow' },
      ])}
    </div>
    <div class="xc-hero-media">
      ${arch({ src: '/assets/photos/journey-embrace.jpg', alt: 'Two women embracing at a Rise Up Queens event', w: 1200, h: 1600, pos: '50% 35%', eager: true, cls: 'xc-arch-hero', delay: 150 })}
      <div class="xc-seal-ring" aria-hidden="true">
        <svg viewBox="0 0 120 120"><defs><path id="xc-ring-c" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0"/></defs>
          <text><textPath href="#xc-ring-c" textLength="286" lengthAdjust="spacing">RISE UP QUEENS · RISE UP QUEENS · </textPath></text></svg>
        <img src="/assets/brand/crown-magenta.png" alt="" loading="lazy" decoding="async">
      </div>
    </div>
  </div>
</section>

<section id="xc-nlb" class="xc-spread" aria-labelledby="xc-nlb-h">
  <span class="xc-spread-ghost" aria-hidden="true">01</span>
  <div class="xc-wrap xc-spread-grid">
    <div class="xc-spread-media">
      ${arch({ src: '/assets/nlb/nlb-photo-embrace.jpg', alt: 'Women holding one another in an embrace during a No Longer Bound session', w: 960, h: 1046, pos: '50% 40%', cls: 'xc-arch-spread' })}
      <span class="xc-spread-mark" ${rv(300)}><img src="/assets/nlb/nlb-mark.png" alt="" loading="lazy" decoding="async"></span>
      <span class="xc-vert" aria-hidden="true">${esc(f.label)} — ${esc(f.name)}</span>
    </div>
    <div class="xc-spread-copy">
      <p class="xc-label xc-label-mag" ${rv()}><span class="xc-label-rule" aria-hidden="true"></span>${esc(f.label)}</p>
      <h2 id="xc-nlb-h" class="xc-spread-name" ${rv(80)}>${esc(f.name)}</h2>
      <p class="xc-spread-script" ${rv(160)}><span class="xc-script">${esc(f.script)}</span></p>
      <p class="xc-display xc-spread-head" ${rv(220)}>${esc(f.headline)}</p>
      <p class="xc-pull" ${rv(280)}>${esc(f.question)}</p>
      <div class="xc-spread-foot" ${rv(340)}>
        <p class="xc-body">${esc(f.body)}</p>
        ${btn(f.cta, f.url)}
      </div>
    </div>
  </div>
</section>

<section id="xc-more" class="xc-more" aria-labelledby="xc-more-h">
  <div class="xc-wrap">
    <div class="xc-plate" ${rv()}>
      <span class="xc-plate-n" aria-hidden="true">02</span>
      <span class="xc-plate-arch" aria-hidden="true"></span>
      <div class="xc-plate-copy">
        <p class="xc-label">${esc(m.label)}</p>
        <h2 id="xc-more-h" class="xc-plate-h">${esc(m.name)}</h2>
        <p class="xc-body">${esc(m.body)}</p>
      </div>
    </div>
  </div>
</section>

<section id="xc-grow" class="xc-toc" aria-labelledby="xc-grow-h">
  <div class="xc-wrap xc-toc-grid">
    <header class="xc-toc-head" ${rv()}>
      <p class="xc-label">Contents</p>
      <h2 id="xc-grow-h" class="xc-h2">${esc(g.heading)}</h2>
      <p class="xc-lead xc-lead-sm">${esc(g.lead)}</p>
    </header>
    <ol class="xc-toc-list">
      ${g.links.map((l, i) => `
      <li ${rv(i * 90)}>
        <a ${linkAttrs(l.href)} class="xc-toc-row">
          <span class="xc-toc-n" aria-hidden="true">${nn(i)}</span>
          <span class="xc-toc-t"><span class="xc-toc-label">${esc(l.label)}</span><span class="xc-toc-blurb">${esc(l.blurb)}</span></span>
          <span class="xc-toc-go" aria-hidden="true">${isExternal(l.href) ? ICON.out : ICON.arrow}</span>${newTab(l.href)}
        </a>
      </li>`).join('')}
    </ol>
  </div>
</section>`;
};

// ============================================================ MASTERCLASSES

const MC_PHOTOS = {
  control: { src: '/assets/photos/close-hands.jpg', alt: 'A woman lifting her hands in worship', w: 1856, h: 2304, pos: '50% 40%' },
  freedom: { src: '/assets/photos/journey-cheer.jpg', alt: 'A woman wearing a crown raising both arms in celebration', w: 1200, h: 1600, pos: '50% 30%' },
  body: { src: '/assets/photos/close-laugh.jpg', alt: 'A woman laughing with her hand on her heart', w: 1856, h: 2304, pos: '50% 30%' },
};

export const masterclasses = (site, c) => {
  const m = c.explore.masterclasses;
  return `
<section class="xc-hero xc-hero-mc">
  <div class="xc-wrap">
    ${folio(m.heading)}
    <div class="xc-mc-top">
      <h1 class="xc-h1 xc-h1-solo" ${rv(60)}>${script(m.heading)}</h1>
    </div>
    <div class="xc-mc-intro">
      <p class="xc-lead" ${rv(200)}>${esc(m.lead)}</p>
      ${inside(m.items.map((it, i) => ({ n: ROMAN[i], t: it.name, sub: it.duration, href: `#xc-mc-${it.key}` })), 'Chapters')}
    </div>
  </div>
</section>

<div class="xc-chapters">
  ${m.items.map((it, i) => {
    const p = MC_PHOTOS[it.key] || MC_PHOTOS.control;
    return `
  <article id="xc-mc-${esc(it.key)}" class="xc-chapter ${i % 2 ? 'xc-chapter-r' : ''}" aria-labelledby="xc-mc-${esc(it.key)}-h">
    <div class="xc-wrap xc-chapter-grid">
      <div class="xc-chapter-media">
        ${arch({ ...p, cls: 'xc-arch-chapter' })}
        <span class="xc-chapter-roman" aria-hidden="true">${ROMAN[i]}</span>
      </div>
      <div class="xc-chapter-copy">
        <p class="xc-label xc-label-mag" ${rv()}><span class="xc-label-rule" aria-hidden="true"></span>Chapter ${ROMAN[i]}</p>
        <h2 id="xc-mc-${esc(it.key)}-h" class="xc-display xc-chapter-h" ${rv(80)}>${esc(it.name)}</h2>
        <p class="xc-dur" ${rv(140)}>${ICON.clock}<span>${esc(it.duration)}</span></p>
        <p class="xc-chapter-blurb" ${rv(200)}>${esc(it.blurb)}</p>
        <p ${rv(260)}><a href="#xc-waitlist" class="xc-tlink">${esc(m.form.heading)}${ICON.arrow}</a></p>
      </div>
    </div>
  </article>`;
  }).join('')}
</div>

<section id="xc-waitlist" class="xc-wlsec" aria-labelledby="xc-wl-h">
  <div class="xc-wrap">
    <div class="xc-card xc-wl" ${rv()}>
      <div class="xc-wl-head">
        <p class="xc-label">Waitlist</p>
        <h2 id="xc-wl-h" class="xc-h2">${esc(m.form.heading)}</h2>
        <ol class="xc-wl-list" aria-hidden="true">${m.items.map((it, i) => `<li><span>${ROMAN[i]}</span>${esc(it.name)}</li>`).join('')}</ol>
      </div>
      <div class="xc-wl-form">
        ${waitlistForm(m, { id: 'xc-wl', cls: { ...FORM_CLS, picker: 'xc-picker' } })}
      </div>
    </div>
  </div>
</section>`;
};

// =================================================================== EVENTS

/** "October 15–17, 2026" → "15–17", for the poster-size date. */
const dayRange = (s) => { const m = String(s).match(/(\d{1,2})\s*[–-]\s*(?:[A-Za-z]+\.?\s+)?(\d{1,2})\b/); return m ? `${m[1]}–${m[2]}` : ''; };

export const events = (site, c) => {
  const e = c.explore.events, [d1, d2] = e.dates, b = e.beyond, inf = e.info, w = e.watch;
  const [a, z] = dayRange(d1.dates).split('–');
  const [firstVid, ...restVids] = w.videos;
  return `
<section class="xc-hero xc-hero-ev">
  <div class="xc-wrap">
    ${folio('Events')}
    <div class="xc-ev-grid">
      <div class="xc-ev-copy">
        <h1 class="xc-h1 xc-ev-h1" ${rv(60)}>${(() => {
          // "Upcoming events": the last word in the script, the rest set as a
          // tracked kicker above it. Same words, same order.
          const words = e.heading.split(' ');
          const last = words.pop();
          return `<span class="xc-ev-kick">${esc(words.join(' '))}</span> ${script(last)}`;
        })()}</h1>
        <p class="xc-lead" ${rv(180)}>${esc(e.lead)}</p>

        <div class="xc-date" ${rv(260)}>
          <div class="xc-date-top">
            <p class="xc-label">Next date</p>
            <img class="xc-date-logo" src="/assets/brand/freedom-logo.png" alt="${esc(d1.name)}" loading="lazy" decoding="async">
          </div>
          <p class="xc-date-days" aria-hidden="true"><span>${esc(a)}</span><span class="xc-date-dash">–</span><span>${esc(z)}</span></p>
          <p class="xc-date-month">${esc(d1.month)}</p>
          <p class="xc-date-meta"><span>${ICON.cal}${esc(d1.dates)}</span><span>${ICON.pin}${esc(d1.location)}</span></p>
        </div>
      </div>

      <div class="xc-ev-media">
        ${arch({ src: '/assets/photos/journey-selfie.jpg', alt: 'Women in crowns taking a group selfie at a Rise Up Queens event', w: 1200, h: 1600, pos: '50% 30%', eager: true, cls: 'xc-arch-ev', delay: 150 })}
      </div>
    </div>

    <div class="xc-ev-bar" ${rv()}>
      <div class="xc-price">
        <p class="xc-price-n">${esc(d1.price)}</p>
        <p class="xc-price-note">${esc(d1.priceNote)}</p>
      </div>
      <div class="xc-ev-cd">
        <p class="xc-label">${esc(d1.name)} begins in</p>
        ${countdown(d1.startsAt, { wrap: 'xc-cd' })}
      </div>
      <div class="xc-ev-cta">${btn(d1.cta, d1.url)}</div>
    </div>

    <div class="xc-date2" ${rv()}>
      <p class="xc-label">Following date</p>
      <p class="xc-date2-month">${esc(d2.month)}</p>
      <div class="xc-date2-info">
        <p class="xc-date2-name">${esc(d2.name)}</p>
        <p class="xc-date-meta"><span>${ICON.cal}${esc(d2.dates)}</span><span>${ICON.pin}${esc(d2.location)}</span></p>
      </div>
      ${tlink(d2.cta, d2.url, 'xc-date2-cta')}
    </div>
  </div>
</section>

<section class="xc-beyond" aria-labelledby="xc-beyond-h">
  <div class="xc-wrap xc-beyond-grid">
    <header class="xc-beyond-head">
      <div class="xc-beyond-sticky">
        <p class="xc-label" ${rv()}>Contents</p>
        <h2 id="xc-beyond-h" class="xc-h2" ${rv(80)}>${esc(b.heading)}</h2>
        <p class="xc-lead xc-lead-sm" ${rv(160)}>${esc(b.lead)}</p>
        ${arch({ src: '/assets/photos/cathedral-tall.jpg', alt: '', w: 1536, h: 2752, pos: '50% 30%', cls: 'xc-arch-beyond', delay: 200 })}
      </div>
    </header>
    <ol class="xc-contents">
      ${b.journeys.map((j, i) => `
      <li class="xc-entry" ${rv(i * 70)}>
        <span class="xc-entry-n" aria-hidden="true">${nn(i)}</span>
        <div class="xc-entry-body">
          <h3 class="xc-entry-h">${esc(j.name)}</h3>
          <p class="xc-entry-blurb">${esc(j.blurb)}</p>
          ${j.url && j.cta ? tlink(j.cta, j.url) : ''}
        </div>
      </li>`).join('')}
    </ol>
  </div>
</section>

<section class="xc-infosec" aria-labelledby="xc-info-h">
  <div class="xc-wrap">
    <div class="xc-card xc-letter" ${rv()}>
      <span class="xc-stamp" aria-hidden="true"><img src="/assets/brand/crown-magenta.png" alt="" loading="lazy" decoding="async"></span>
      <div class="xc-letter-head">
        <p class="xc-label xc-label-mag">${esc(d1.name)}</p>
        <h2 id="xc-info-h" class="xc-h2 xc-h2-sm">${esc(inf.heading)}</h2>
        <p class="xc-lead xc-lead-sm">${esc(inf.lead)}</p>
      </div>
      <div class="xc-letter-form">
        ${disabledForm({ fields: inf.fields, submit: inf.submit, id: 'xc-info', cls: FORM_CLS })}
      </div>
    </div>
  </div>
</section>

<section class="xc-watch" aria-labelledby="xc-watch-h">
  <div class="xc-wrap">
    <header class="xc-watch-head" ${rv()}>
      <p class="xc-label">Watch</p>
      <h2 id="xc-watch-h" class="xc-h2">${esc(w.heading)}</h2>
      <p class="xc-lead xc-lead-sm">${esc(w.lead)}</p>
    </header>
    <ol class="xc-films">
      ${[firstVid, ...restVids].map((v, i) => `
      <li class="xc-film" ${rv(i * 80)}>
        ${videoButton(v, { cls: 'xc-film-btn', inner: play, ratio: 'xc-film-frame' })}
        <p class="xc-film-cap" aria-hidden="true"><span>${nn(i)}</span>${esc(v.name)}</p>
      </li>`).join('')}
    </ol>
  </div>
</section>`;
};

// ================================================================= COACHING

export const coaching = (site, c, vids) => {
  const k = c.explore.coaching, list = coaches(c);
  return `
<section class="xc-hero xc-hero-co">
  <div class="xc-wrap">${folio(k.heading)}</div>
  <div class="xc-wrap xc-co-top">
    <div>
      <h1 class="xc-h1 xc-h1-solo" ${rv(60)}>${script(k.heading)}</h1>
    </div>
    <div class="xc-co-intro">
      <p class="xc-lead" ${rv(200)}>${esc(k.lead)}</p>
      ${inside(list.map((x, i) => ({ n: nn(i), t: x.name, href: `#xc-coach-${i + 1}` })), 'Coaches')}
    </div>
  </div>
</section>

<section class="xc-coaches" aria-label="Coaches">
  <div class="xc-wrap">
    <ol class="xc-coach-grid">
      ${list.map((x, i) => `
      <li id="xc-coach-${i + 1}" class="xc-coach">
        ${arch({ src: x.photo, alt: `Portrait of ${x.name}`, w: 1707, h: 2560, pos: '50% 22%', cls: 'xc-arch-coach', delay: i * 90 })}
        <div class="xc-coach-copy" ${rv(i * 90 + 120)}>
          <p class="xc-coach-n"><span aria-hidden="true">${nn(i)}</span>Coach</p>
          <h2 class="xc-coach-name">${esc(x.name)}</h2>
          <p class="xc-coach-words">${esc(x.blurb)}</p>
          ${tlink(x.cta, x.url, 'xc-coach-cta')}
        </div>
      </li>`).join('')}
    </ol>
  </div>
</section>

<section class="xc-convo" aria-labelledby="xc-convo-h">
  <div class="xc-wrap">
    <header class="xc-watch-head" ${rv()}>
      <p class="xc-label">Watch</p>
      <h2 id="xc-convo-h" class="xc-h2">${esc(k.videosHeading)}</h2>
    </header>
    <ol class="xc-convo-grid">
      ${k.videos.map((v, i) => `
      <li class="xc-convo-item" ${rv(i * 120)}>
        ${videoButton(v, { cls: 'xc-convo-btn', inner: play, ratio: 'xc-convo-frame' })}
        <p class="xc-film-cap" aria-hidden="true"><span>${nn(i)}</span>${esc(v.name)}</p>
      </li>`).join('')}
    </ol>
  </div>
</section>`;
};

// ============================================================ FREE RESOURCE

export const free = (site, c) => {
  const r = c.explore.freeResource;
  return `
<section class="xc-hero xc-hero-free">
  <span class="xc-free-arch xc-free-arch-l" aria-hidden="true"></span>
  <span class="xc-free-arch xc-free-arch-r" aria-hidden="true"></span>
  <div class="xc-wrap xc-free-wrap">
    ${folio(r.heading)}
    <h1 class="xc-h1 xc-h1-solo xc-h1-centre" ${rv(60)}>${script(r.heading)}</h1>
    <p class="xc-lead xc-lead-centre" ${rv(180)}>${esc(r.lead)}</p>

    <div class="xc-env" ${rv(280)}>
      <div class="xc-env-paper">
        <svg class="xc-env-flap" viewBox="0 0 600 220" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0 L300 200 L600 0" fill="none" stroke="currentColor" stroke-width="1"/>
          <path d="M0 0 L300 200 L600 0 Z" fill="url(#xc-flap-g)" stroke="none"/>
          <defs><linearGradient id="xc-flap-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e7dc"/><stop offset="1" stop-color="#fbf7f2"/></linearGradient></defs>
        </svg>
        <span class="xc-wax" aria-hidden="true"><img src="/assets/brand/crown-magenta.png" alt="" loading="lazy" decoding="async"></span>
        <div class="xc-env-copy">
          <h2 class="xc-env-h">${esc(r.pending.heading)}</h2>
          <p class="xc-body">${esc(r.pending.body)}</p>
        </div>
      </div>
    </div>
  </div>
</section>`;
};
