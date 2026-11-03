// The Masterclasses page — four premium directions, compared on
// /masterclass-options.html (scripts/build-masterclass-options.mjs).
//
//   doors     three tall photographs side by side; the one you point at
//             opens wide and the class rises out of it
//   chapters  one magazine spread per class: arched photograph that wipes
//             in, oversized outlined numeral, turning seal, script name
//   stack     glass cards that stick and pile up as you scroll, each one
//             sinking back as the next slides over it
//   select    the page opens on a chooser: pick a class and its photograph
//             cross-fades in an arch beside you (cycles on its own until
//             touched)
//
// Round two (asked for 2026-11-02: other layouts, each on its own light
// ground rather than the sky):
//
//   gallery   ivory paper — the page pins and the classes slide past
//             sideways as you scroll down, like walking a gallery wall
//   deck      blush silk — the stack again, as full photographs in a white
//             print border that tilt into a fanned deck as they pile up
//   index     pearl aurora — the class names as a huge type index; the
//             photograph follows the cursor over them, a row opens in place
//   story     dawn — the photograph holds still in an arch while the
//             classes scroll past beside it, cross-fading as each arrives
//
// Round one sits on the Luminous ground Courses already uses (sky, drifting
// light, glass, pink brush script); round two swaps the sky for its own
// ground (GROUND below). All reuse /xp-luminous.css for type, buttons, glass
// and the form, and add /masterclass.css (src/styles/masterclass.css, every
// class mc-*). Behaviour: src/styles/masterclass.js.
//
// Copy is content.json explore.masterclasses only. Each class's coach and
// photograph come from the live masterclasses page.
import { esc } from './layout.mjs';
import { ICON, rv, waitlistForm } from './explore/shared.mjs';
import { swash } from './spread.mjs';

const MAGENTA = '#e8208f';
const LAZY = 'loading="lazy" decoding="async"';
const ROMAN = ['I', 'II', 'III', 'IV', 'V'];
const pad = (n) => String(n).padStart(2, '0');
const weeks = (it) => (String(it.duration).match(/(\d+)\s*weeks/) || [])[1] || '';

const PERSON = '<svg class="xp-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="3.75"/><path d="M4.5 20c.9-3.6 3.9-5.75 7.5-5.75s6.6 2.15 7.5 5.75"/></svg>';

// ------------------------------------------------------------------ shell

const defs = `<svg class="xl-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>
  <linearGradient id="xl-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8208f"/><stop offset=".55" stop-color="#f06aa8"/><stop offset="1" stop-color="#00b9c6"/></linearGradient>
</defs></svg>`;

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

// The light grounds for round two. Decoration only: soft washes made of
// radial gradients and fine SVG lines, transform-only motion.
const GROUND = {
  sky,
  // warm ivory paper, a fine grain and two faint washes of brand colour
  ivory: `
<div class="mc-ground" aria-hidden="true">
  <span class="mc-grain"></span>
  <span class="mc-wash mc-wash-m"></span><span class="mc-wash mc-wash-t"></span>
</div>`,
  // blush with slow satin ribbons drawn across it
  blush: `
<div class="mc-ground" aria-hidden="true">
  <svg class="mc-silk mc-silk-a" viewBox="0 0 1440 600" preserveAspectRatio="none">
    <path d="M-40 380 C 240 200, 520 520, 820 330 S 1300 140, 1500 300" />
    <path d="M-40 420 C 260 250, 540 560, 840 370 S 1310 190, 1500 345" />
    <path d="M-40 460 C 280 300, 560 600, 860 410 S 1320 240, 1500 390" />
  </svg>
  <svg class="mc-silk mc-silk-b" viewBox="0 0 1440 600" preserveAspectRatio="none">
    <path d="M-40 200 C 300 360, 600 80, 900 260 S 1320 420, 1500 240" />
    <path d="M-40 240 C 320 400, 620 120, 920 300 S 1330 460, 1500 280" />
  </svg>
  <span class="mc-wash mc-wash-m"></span>
</div>`,
  // near-white pearl with a slow aurora of lilac, mint and peach
  pearl: `
<div class="mc-ground" aria-hidden="true">
  <span class="mc-aur mc-aur-l"></span><span class="mc-aur mc-aur-m"></span>
  <span class="mc-aur mc-aur-p"></span><span class="mc-aur mc-aur-k"></span>
</div>`,
  // a sunrise behind the title: a warm glow and fine concentric arcs
  dawn: `
<div class="mc-ground" aria-hidden="true">
  <span class="mc-sun"></span>
  <svg class="mc-arcs" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMax meet">
    ${[150, 230, 310, 390, 470, 550].map((r, i) => `<circle cx="600" cy="600" r="${r}" style="--i:${i}"/>`).join('')}
  </svg>
  <span class="mc-wash mc-wash-t"></span>
</div>`,
};

const page = (key, ground, body) => `
<div class="xl mc mc-is-${key} mc-g-${ground}">
  ${defs}${GROUND[ground]}
  <div class="xl-in">${body}</div>
</div>`;

// The page name in the brush script with its swash, as on Courses.
const title = (m, { align = 'centre' } = {}) => `
<h1 class="xl-h1 mc-h1 mc-h1-${align}">
  <span class="xl-scriptwrap"><span class="script xl-script mc-script">${esc(m.heading)}</span>${swash(MAGENTA)}</span>
</h1>`;

const hero = (m) => `
<section class="xl-sec xl-sec-hero">
  <div class="xl-hero xl-hero-solo" style="--n:${m.heading.length}">
    ${title(m)}
    <p class="xl-lead">${esc(m.lead)}</p>
  </div>
</section>`;

// Every class links down to the one waitlist form with itself picked
// (masterclass.js ticks the radio, or pre-fills the embedded form by
// data-mc-class; the link still works without it).
const join = (it, cls = 'xl-btn') => `
<a href="#mc-wl" class="${cls}" data-mc-pick="${esc(it.key)}" data-mc-class="${esc(it.name)}">Join the waitlist<span class="sr-only"> for ${esc(it.name)}</span>${ICON.arrow}</a>`;

const facts = (it, cls = '') => `
<ul class="mc-facts ${cls}" role="list">
  <li>${ICON.clock}<span>${esc(it.duration)}</span></li>
  ${it.coach ? `<li>${PERSON}<span>With ${esc(it.coach)}</span></li>` : ''}
</ul>`;

// The waitlist: the Luminous glass panel, one form with a class picker.
const waitlist = (m) => `
<section class="xl-sec xl-wrap mc-wl-sec" aria-labelledby="mc-wl-h" id="mc-wl">
  <div class="xl-glass xl-panel xl-wl mc-wl" ${rv()}>
    <div class="xl-wl-art" aria-hidden="true">
      <div class="xl-wl-photo"><img src="/assets/photos/close-laugh.jpg" alt="" ${LAZY}></div>
    </div>
    <div class="xl-wl-form">
      <h2 class="xl-h2s xl-h2s-left" id="mc-wl-h"><span class="xl-scriptwrap"><span class="script">${esc(m.form.heading)}</span><svg class="xl-swash" viewBox="0 0 300 22" aria-hidden="true" focusable="false"><path data-xp-draw d="M4 14 C 60 6, 110 5, 158 8 S 250 14, 296 9" stroke="url(#xl-grad)" stroke-width="3" stroke-linecap="round" fill="none"/></svg></span></h2>
      ${waitlistForm(m, { id: 'mc-wlf', cls: { form: 'xl-form', button: 'xl-submit' } })}
    </div>
  </div>
</section>`;

// ------------------------------------------------------------------ A — doors

const doors = (m) => `
${hero(m)}
<section class="xl-sec mc-doors-sec" aria-label="${esc(m.heading)}">
  <ul class="mc-doors" role="list" data-mc-doors>
    ${m.items.map((it, i) => `
    <li class="mc-door${i === 0 ? ' is-open' : ''}" data-mc-door ${rv(i * 120)}>
      <img class="mc-door-img" src="${esc(it.photo)}" alt="" ${LAZY}>
      <span class="mc-door-shade" aria-hidden="true"></span>
      <span class="mc-door-tab" aria-hidden="true">
        <span class="mc-door-n">${ROMAN[i]}</span>
        <span class="mc-door-vname">${esc(it.name)}</span>
      </span>
      <div class="mc-door-body">
        <p class="mc-eyebrow mc-eyebrow-light">Masterclass ${ROMAN[i]}</p>
        <h2 class="mc-door-name"><span class="script">${esc(it.name)}</span></h2>
        ${facts(it, 'mc-facts-light')}
        <p class="mc-door-blurb">${esc(it.blurb)}</p>
        ${join(it)}
      </div>
    </li>`).join('')}
  </ul>
</section>
${waitlist(m)}`;

// ------------------------------------------------------------------ B — chapters

// A seal of circling text around the crown, turning slowly.
const seal = (it) => `
<span class="mc-seal" aria-hidden="true">
  <svg viewBox="0 0 120 120"><defs><path id="mc-ring-${esc(it.key)}" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0"/></defs>
    <text><textPath textLength="286" lengthAdjust="spacing" href="#mc-ring-${esc(it.key)}">Masterclass · ${esc(weeks(it))} weeks · Rise Up Queens ·</textPath></text></svg>
  <img src="/assets/brand/crown-magenta.png" alt="" ${LAZY}>
</span>`;

const chapters = (m) => `
${hero(m)}
<section class="xl-sec xl-wrap mc-chapters" aria-label="${esc(m.heading)}">
  ${m.items.map((it, i) => `
  <article class="mc-ch${i % 2 ? ' mc-ch-flip' : ''}" aria-labelledby="mc-ch-${esc(it.key)}">
    <figure class="mc-ch-art" ${rv()}>
      <span class="mc-ch-num" aria-hidden="true">${pad(i + 1)}</span>
      <span class="mc-ch-glow" aria-hidden="true"></span>
      <div class="mc-ch-photo"><img src="${esc(it.photo)}" alt="" ${LAZY}></div>
      ${seal(it)}
    </figure>
    <div class="mc-ch-copy" ${rv(140)}>
      <p class="mc-eyebrow">Masterclass ${ROMAN[i]} <span class="mc-of">of ${ROMAN[m.items.length - 1]}</span></p>
      <h2 class="mc-ch-name" id="mc-ch-${esc(it.key)}"><span class="xl-scriptwrap"><span class="script">${esc(it.name)}</span><svg class="xl-swash" viewBox="0 0 300 22" aria-hidden="true" focusable="false"><path data-xp-draw d="M4 14 C 60 6, 110 5, 158 8 S 250 14, 296 9" stroke="url(#xl-grad)" stroke-width="3" stroke-linecap="round" fill="none"/></svg></span></h2>
      ${facts(it)}
      <p class="mc-ch-blurb">${esc(it.blurb)}</p>
      ${join(it)}
    </div>
  </article>`).join('')}
</section>
${waitlist(m)}`;

// ------------------------------------------------------------------ C — stack

const stack = (m) => `
${hero(m)}
<section class="xl-sec xl-wrap mc-stack" aria-label="${esc(m.heading)}" data-mc-stack>
  <ol class="mc-stack-list" role="list">
    ${m.items.map((it, i) => `
    <li class="mc-card" style="--i:${i}" data-mc-card>
      <article class="xl-glass mc-card-in" aria-labelledby="mc-card-${esc(it.key)}">
        <div class="mc-card-media">
          <img src="${esc(it.photo)}" alt="" ${LAZY}>
          <span class="mc-card-shade" aria-hidden="true"></span>
          <span class="mc-card-count" aria-hidden="true">${pad(i + 1)}<span> / ${pad(m.items.length)}</span></span>
        </div>
        <div class="mc-card-body">
          <p class="mc-eyebrow">Masterclass ${ROMAN[i]}</p>
          <h2 class="mc-card-name" id="mc-card-${esc(it.key)}">${esc(it.name)}</h2>
          <div class="mc-card-stats">
            <p class="mc-stat"><span class="mc-stat-n">${esc(weeks(it))}</span><span class="mc-stat-u">weeks</span></p>
            ${it.coach ? `<p class="mc-stat mc-stat-coach"><span class="mc-stat-k">Your coach</span><span class="mc-stat-v">${esc(it.coach)}</span></p>` : ''}
          </div>
          <p class="mc-card-blurb">${esc(it.blurb)}</p>
          ${join(it)}
        </div>
      </article>
    </li>`).join('')}
  </ol>
</section>
${waitlist(m)}`;

// ------------------------------------------------------------------ D — select

const select = (m) => `
<section class="xl-sec mc-sel-sec" aria-label="${esc(m.heading)}">
  <div class="xl-wrap mc-sel" data-mc-sel>
    <div class="mc-sel-intro">
      ${title(m, { align: 'left' })}
      <p class="mc-sel-lead">${esc(m.lead)}</p>
      <div class="mc-tabs" role="tablist" aria-label="Choose a masterclass">
        ${m.items.map((it, i) => `
        <button type="button" role="tab" class="mc-tab" id="mc-tab-${esc(it.key)}" aria-controls="mc-panel-${esc(it.key)}"
                aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
          <span class="mc-tab-n" aria-hidden="true">${pad(i + 1)}</span>
          <span class="mc-tab-name">${esc(it.name)}</span>
          <span class="mc-tab-dur">${esc(weeks(it))} weeks</span>
          <span class="mc-tab-bar" aria-hidden="true"><i></i></span>
        </button>`).join('')}
      </div>
    </div>
    <div class="mc-stage">
      <span class="mc-stage-glow" aria-hidden="true"></span>
      ${m.items.map((it, i) => `
      <div role="tabpanel" class="mc-panel${i === 0 ? ' is-active' : ''}" id="mc-panel-${esc(it.key)}" aria-labelledby="mc-tab-${esc(it.key)}"${i === 0 ? '' : ' inert aria-hidden="true"'}>
        <div class="mc-panel-photo"><img src="${esc(it.photo)}" alt="" ${i === 0 ? 'decoding="async"' : LAZY}></div>
        <div class="xl-glass mc-panel-card">
          <p class="mc-eyebrow">Masterclass ${ROMAN[i]}</p>
          <h2 class="mc-panel-name"><span class="script">${esc(it.name)}</span></h2>
          ${facts(it)}
          <p class="mc-panel-blurb">${esc(it.blurb)}</p>
          ${join(it)}
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>
${waitlist(m)}`;

// ------------------------------------------------------------------ E — gallery

// Without JS (and on phones) the wall is a sideways swipe with snap points;
// on desktop masterclass.js pins it and turns the page's scroll into the
// sideways walk.
const gallery = (m) => `
${hero(m)}
<section class="xl-sec mc-gw" aria-label="${esc(m.heading)}" data-mc-gw>
  <div class="mc-gw-pin">
    <ol class="mc-gw-track" role="list">
      <li class="mc-gw-intro" aria-hidden="true">
        <p class="mc-eyebrow">Masterclasses ${ROMAN[0]} – ${ROMAN[m.items.length - 1]}</p>
        <ul class="mc-gw-index" role="list">
          ${m.items.map((it, i) => `<li><span>${ROMAN[i]}</span>${esc(it.name)}</li>`).join('')}
        </ul>
        <p class="mc-gw-hint"><span>Scroll</span>${ICON.arrow}</p>
      </li>
      ${m.items.map((it, i) => `
      <li class="mc-gw-item" aria-labelledby="mc-gw-${esc(it.key)}">
        <span class="mc-gw-num" aria-hidden="true">${pad(i + 1)}</span>
        <div class="mc-gw-photo"><img src="${esc(it.photo)}" alt="" ${LAZY}></div>
        <div class="mc-gw-copy">
          <p class="mc-eyebrow">Masterclass ${ROMAN[i]}</p>
          <h2 class="mc-gw-name" id="mc-gw-${esc(it.key)}"><span class="script">${esc(it.name)}</span></h2>
          ${facts(it)}
          <p class="mc-gw-blurb">${esc(it.blurb)}</p>
          ${join(it)}
        </div>
      </li>`).join('')}
    </ol>
    <div class="mc-gw-bar" aria-hidden="true"><i></i></div>
  </div>
</section>
${waitlist(m)}`;

// ------------------------------------------------------------------ F — deck

// The stack's scroll behaviour (data-mc-stack sets --cover on each card);
// here the cards are photographs in a print border and tilt as they pile.
const deck = (m) => `
${hero(m)}
<section class="xl-sec xl-wrap mc-deck" aria-label="${esc(m.heading)}" data-mc-stack>
  <ol class="mc-deck-list" role="list">
    ${m.items.map((it, i) => `
    <li class="mc-dk" style="--i:${i};--tilt:${i % 2 ? 3 : -3}deg" data-mc-card>
      <article class="mc-dk-in" aria-labelledby="mc-dk-${esc(it.key)}">
        <div class="mc-dk-photo"><img src="${esc(it.photo)}" alt="" ${LAZY}><span class="mc-dk-shade" aria-hidden="true"></span></div>
        <div class="mc-dk-copy">
          <p class="mc-eyebrow">Masterclass ${ROMAN[i]} <span class="mc-of">· ${pad(i + 1)} / ${pad(m.items.length)}</span></p>
          <h2 class="mc-dk-name" id="mc-dk-${esc(it.key)}"><span class="script">${esc(it.name)}</span></h2>
          ${facts(it)}
          <p class="mc-dk-blurb">${esc(it.blurb)}</p>
          ${join(it)}
        </div>
      </article>
    </li>`).join('')}
  </ol>
</section>
${waitlist(m)}`;

// ------------------------------------------------------------------ F — closings
//
// Round three (2026-11-02): F chosen, and the waitlist panel at its foot
// replaced by the live page's sign-off — its closing line and three buttons
// (content.json explore.masterclasses.closing). Four ways to set it, below.
// The classes' "Join the waitlist" buttons now open the same form in a
// dialog (waitlistDialog), so the waitlist is still one tap away.

// The closing line with its last words in the pink script.
const closingLine = (cl, cls = '') => {
  const at = cl.emphasis ? cl.line.lastIndexOf(cl.emphasis) : -1;
  if (at < 0) return `<p class="mc-cl-line ${cls}">${esc(cl.line)}</p>`;
  return `<p class="mc-cl-line ${cls}">${esc(cl.line.slice(0, at))}<span class="script mc-cl-em">${esc(cl.emphasis)}</span>${esc(cl.line.slice(at + cl.emphasis.length))}</p>`;
};
const out = (l, cls) => `<a href="${esc(l.href)}" class="${cls}">${esc(l.label)}${ICON.arrow}</a>`;

const CLOSING = {
  // A sign-off: the line set large and centred, the three as pills, the
  // last one filled.
  sign: (cl) => `
<section class="xl-sec xl-wrap mc-cl mc-cl-sign" id="mc-close" aria-label="Where to next">
  <div class="mc-cl-sign-in" ${rv()}>
    <span class="mc-cl-crown" aria-hidden="true"><span class="mc-cl-crown-mark"></span></span>
    ${closingLine(cl)}
    <div class="mc-cl-actions">
      ${cl.links.map((l, i) => out(l, i === cl.links.length - 1 ? 'xl-btn xl-btn-lg' : 'xl-btn xl-btn-lg xl-btn-ghost')).join('')}
    </div>
  </div>
</section>`,

  // Three photographs as the buttons, under the line.
  cards: (cl) => `
<section class="xl-sec xl-wrap mc-cl mc-cl-cards" id="mc-close" aria-label="Where to next">
  ${closingLine(cl, 'mc-cl-line-c')}
  <ul class="mc-cl-tiles" role="list">
    ${cl.links.map((l, i) => `
    <li ${rv(i * 110)}>
      <a href="${esc(l.href)}" class="mc-cl-tile">
        <img src="${esc(l.photo)}" alt="" ${LAZY}>
        <span class="mc-cl-tile-shade" aria-hidden="true"></span>
        <span class="mc-cl-tile-n" aria-hidden="true">${pad(i + 1)}</span>
        <span class="mc-cl-tile-label">${esc(l.label)}<span class="mc-cl-tile-go">${ICON.arrow}</span></span>
      </a>
    </li>`).join('')}
  </ul>
</section>`,

  // The live page's dark band, in deep plum velvet with a pink glow.
  velvet: (cl) => `
<section class="mc-cl mc-cl-velvet" id="mc-close" aria-label="Where to next">
  <span class="mc-cl-glow" aria-hidden="true"></span>
  <div class="xl-wrap mc-cl-velvet-in" ${rv()}>
    ${closingLine(cl, 'mc-cl-line-light')}
    <div class="mc-cl-actions mc-cl-actions-glass">
      ${cl.links.map(l => out(l, 'mc-cl-glassbtn')).join('')}
    </div>
  </div>
</section>`,

  // Three prints, as in the deck, fanned on the table; each one straightens
  // and lifts under the pointer.
  prints: (cl) => `
<section class="xl-sec xl-wrap mc-cl mc-cl-prints" id="mc-close" aria-label="Where to next">
  ${closingLine(cl, 'mc-cl-line-c')}
  <ul class="mc-cl-fan" role="list">
    ${cl.links.map((l, i) => `
    <li style="--r:${[-5, 1.5, 5][i] ?? 0}deg;--y:${[18, 0, 22][i] ?? 0}px" ${rv(i * 120)}>
      <a href="${esc(l.href)}" class="mc-cl-print">
        <span class="mc-cl-print-photo"><img src="${esc(l.photo)}" alt="" ${LAZY}></span>
        <span class="mc-cl-print-cap">${esc(l.label)}${ICON.arrow}</span>
      </a>
    </li>`).join('')}
  </ul>
</section>`,
};

// The waitlist, in a dialog the classes' buttons open (masterclass.js): the
// live MultiplyOS form, which carries its own heading. The frame has no src
// until the dialog first opens, so nothing loads from MultiplyOS before a
// visitor asks for it; masterclass.js then sets it with the class pre-filled
// and sizes the frame to the height the form posts back.
const waitlistDialog = (m) => {
  const f = m.form.embed;
  return `
<dialog class="mc-dlg" id="mc-wl" aria-label="${esc(f.title)}">
  <div class="mc-dlg-in mc-dlg-in-frame">
    <button type="button" class="mc-dlg-x" data-mc-close aria-label="Close">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
    </button>
    <iframe class="mc-dlg-frame" title="${esc(f.title)}" data-mc-form="${esc(f.src)}" data-mc-origin="${esc(f.origin)}" data-mc-field="${esc(f.classField)}"></iframe>
  </div>
</dialog>`;
};

const deckWith = (closing) => (m) => deck(m).replace(waitlist(m), () => `${CLOSING[closing](m.closing)}\n${waitlistDialog(m)}`);

// ------------------------------------------------------------------ G — index

// Native <details> rows sharing a name, so one is open at a time and every
// row works with no JS. On a mouse, masterclass.js floats the row's
// photograph after the cursor.
const index = (m) => `
${hero(m)}
<section class="xl-sec xl-wrap mc-ix" aria-label="${esc(m.heading)}" data-mc-ix>
  <div class="mc-ix-list">
    ${m.items.map((it, i) => `
    <details class="mc-ix-row" name="mc-ix" data-photo="${esc(it.photo)}"${i === 0 ? ' open' : ''} ${rv(i * 90)}>
      <summary class="mc-ix-sum">
        <span class="mc-ix-n" aria-hidden="true">${pad(i + 1)}</span>
        <h2 class="mc-ix-name"><span>${esc(it.name)}</span></h2>
        <span class="mc-ix-dur">${esc(weeks(it))} weeks</span>
        <span class="mc-ix-plus" aria-hidden="true"></span>
      </summary>
      <div class="mc-ix-body">
        <div class="mc-ix-photo"><img src="${esc(it.photo)}" alt="" ${LAZY}></div>
        <div class="mc-ix-copy">
          ${facts(it)}
          <p class="mc-ix-blurb">${esc(it.blurb)}</p>
          ${join(it)}
        </div>
      </div>
    </details>`).join('')}
  </div>
  <div class="mc-ix-float" aria-hidden="true">${m.items.map(it => `<img src="${esc(it.photo)}" alt="" ${LAZY} data-src="${esc(it.photo)}">`).join('')}</div>
</section>
${waitlist(m)}`;

// ------------------------------------------------------------------ H — story

// Desktop: the arch on the left sticks while the classes scroll past on the
// right, and masterclass.js cross-fades it to whichever class is mid-screen.
// Phones: each class carries its own photograph and nothing sticks.
const story = (m) => `
${hero(m)}
<section class="xl-sec xl-wrap mc-st" aria-label="${esc(m.heading)}" data-mc-story>
  <div class="mc-st-stage" aria-hidden="true">
    <div class="mc-st-frame">
      ${m.items.map((it, i) => `<img src="${esc(it.photo)}" alt="" ${LAZY} class="${i === 0 ? 'is-on' : ''}">`).join('')}
    </div>
    <ol class="mc-st-dots" role="list">
      ${m.items.map((it, i) => `<li class="${i === 0 ? 'is-on' : ''}"><span>${ROMAN[i]}</span></li>`).join('')}
    </ol>
  </div>
  <div class="mc-st-steps">
    ${m.items.map((it, i) => `
    <article class="mc-st-step${i === 0 ? ' is-on' : ''}" aria-labelledby="mc-st-${esc(it.key)}" data-mc-step>
      <div class="mc-st-photo"><img src="${esc(it.photo)}" alt="" ${LAZY}></div>
      <p class="mc-eyebrow">Masterclass ${ROMAN[i]}</p>
      <h2 class="mc-st-name" id="mc-st-${esc(it.key)}"><span class="script">${esc(it.name)}</span></h2>
      ${facts(it)}
      <p class="mc-st-blurb">${esc(it.blurb)}</p>
      ${join(it)}
    </article>`).join('')}
  </div>
</section>
${waitlist(m)}`;

// ------------------------------------------------------------------ export

export const MASTERCLASS_OPTIONS = {
  doors: { ground: 'sky', render: doors },
  chapters: { ground: 'sky', render: chapters },
  stack: { ground: 'sky', render: stack },
  select: { ground: 'sky', render: select },
  gallery: { ground: 'ivory', render: gallery },
  deck: { ground: 'blush', render: deck },
  index: { ground: 'pearl', render: index },
  story: { ground: 'dawn', render: story },
  'deck-sign': { ground: 'blush', render: deckWith('sign') },
  'deck-cards': { ground: 'blush', render: deckWith('cards') },
  'deck-velvet': { ground: 'blush', render: deckWith('velvet') },
  'deck-prints': { ground: 'blush', render: deckWith('prints') },
};

/** The page's <main> contents for direction `key`. */
export const masterclassPage = (site, c, key) => {
  const o = MASTERCLASS_OPTIONS[key];
  return `<link rel="stylesheet" href="/xp-luminous.css">
<link rel="stylesheet" href="/masterclass.css">
<div data-xp="masterclasses" class="xp xp-luminous">${page(key, o.ground, o.render(c.explore.masterclasses))}</div>
<script src="/masterclass.js" defer></script>`;
};
