// Compact mobile treatments for the "It's time for your breakthrough" CTA.
//
// Measured at 390px the section runs about 710px:
//
//   py-12 top            48
//   heading              72   text-3xl, wraps to two lines
//   mt-6                 24
//   mission paragraph   290   391 characters at 18px/1.625 — about ten lines
//   mt-10                40
//   form                186   two stacked inputs and a button, gap-3
//   py-12 bottom         48
//   ────────────────────────
//                       708
//
// The paragraph is 40% of it on its own. Three things about that are worth
// separating before choosing:
//
//   size      18px was chosen to match the struggles list exactly, so the two
//             read as one voice. That list is now 16px on phones, so the
//             match the 18px was protecting no longer exists below sm.
//
//   measure   at 390px this sets about 42 characters a line. Comfortable
//             reading is 45-75, so it is already under the range — dropping
//             to 16px moves it toward 45, which reads better AND is shorter.
//
//   alignment centred is right for two or three lines. At ten, both edges are
//             ragged and every line starts in a different place, which is the
//             hardest thing to read on a phone.
//
// And one structural question: the form is the only conversion point on this
// page after the hero, and 380px of heading and prose sit above it.
//
// Copy is verbatim and every word is kept in all options — including D, where
// it is behind a control rather than deleted. Inputs stay disabled: the form
// posts nowhere, and a disabled field cannot swallow a real signup.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';
const HIGHLIGHT_COLOUR = '#dc1e88';

const HIGHLIGHTS = [
  'the unshakable truth of the Gospel',
  'true freedom',
  'strength, identity, and purpose',
];

const missionHtml = (c) => {
  let out = esc(c.home.faith.mission);
  for (const phrase of HIGHLIGHTS) {
    const e = esc(phrase);
    out = out.split(e).join(`<strong class="font-bold" style="color:${HIGHLIGHT_COLOUR}">${e}</strong>`);
  }
  return out;
};

export const CTA_MODES = {
  current: {
    label: 'Current — what ships today',
    note: 'The baseline: 48px of section padding, a 30px heading, then 391 characters set centred at 18px, then the form.',
    pad: 'py-12', heading: 'text-3xl', gapBody: 'mt-6', body: 'text-lg leading-relaxed',
    align: 'center', gapForm: 'mt-10', order: 'bodyFirst',
  },

  tighten: {
    label: 'A — Tighten, keep the structure',
    note: 'Nothing moves, everything closes up: section padding 48→32px, heading 30→24px, body 18→16px, and the gaps 24/40→16/24. The body dropping to 16px is not just smaller — it puts the line length closer to a comfortable measure than 18px did, because this column is narrow enough that 18px was setting only about 42 characters a line.',
    pad: 'py-8 sm:py-20', heading: 'text-2xl sm:text-4xl', gapBody: 'mt-4 sm:mt-6',
    body: 'text-base leading-relaxed sm:text-lg', align: 'center', gapForm: 'mt-6 sm:mt-10', order: 'bodyFirst',
  },

  leftBody: {
    label: 'B — A, with the body left-aligned',
    note: 'A, and the paragraph sets flush left below sm while the heading stays centred. No height saved at all — this is purely a readability change, and it is the one I would argue hardest for: centring is right for two or three lines, but at nine every line starts in a different place and both edges are ragged. Phones are where that costs the most.',
    pad: 'py-8 sm:py-20', heading: 'text-2xl sm:text-4xl', gapBody: 'mt-4 sm:mt-6',
    body: 'text-base leading-relaxed sm:text-lg', align: 'left', gapForm: 'mt-6 sm:mt-10', order: 'bodyFirst',
  },

  formFirst: {
    label: 'C — Form first, body beneath it',
    note: 'A and B, but the form moves directly under the heading and the mission statement follows it. This is the only option that changes what the section is for rather than how tall it is: the form is the single conversion point on the page after the hero, and today 380px of heading and prose sit on top of it. The statement still gets read — by the people who scroll, which is the same people who were going to read it anyway.',
    pad: 'py-8 sm:py-20', heading: 'text-2xl sm:text-4xl', gapBody: 'mt-6 sm:mt-6',
    body: 'text-base leading-relaxed sm:text-lg', align: 'left', gapForm: 'mt-6 sm:mt-10', order: 'formFirst',
  },

  reveal: {
    label: 'D — Body collapsed behind "Read more"',
    note: 'A and B, with the paragraph clamped to three lines and the rest behind a control. The shortest option by a distance. The honest cost: this is a statement of faith, and it is the part of the page that says what the movement actually believes — collapsing it means most phone visitors read the first sentence and no more. Every word stays in the page and in the markup; it is hidden, not cut.',
    pad: 'py-8 sm:py-20', heading: 'text-2xl sm:text-4xl', gapBody: 'mt-4 sm:mt-6',
    body: 'text-base leading-relaxed sm:text-lg', align: 'left', gapForm: 'mt-6 sm:mt-10',
    order: 'bodyFirst', clamp: true,
  },
};

const formHtml = (c, m) => `
<form action="#" method="post" novalidate class="${m.formClass} flex flex-col gap-3 sm:flex-row sm:items-center">
  ${c.home.cta.fields.map(f => `
  <div class="flex-1">
    <label for="ctc-${esc(f.name)}" class="sr-only">${esc(f.label)}</label>
    <input id="ctc-${esc(f.name)}" name="${esc(f.name)}" type="${esc(f.type)}"
           placeholder="${esc(f.label)}" disabled
           class="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 font-body text-ink placeholder:text-ink-soft/60 disabled:cursor-not-allowed sm:py-3.5">
  </div>`).join('')}
  <button type="submit" disabled
          class="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-8 py-3 font-body text-sm font-bold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed sm:w-auto sm:py-3.5"
          style="background:${MAGENTA}">
    ${esc(c.home.cta.button)}
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  </button>
</form>`;

export const renderCta = (c, modeKey) => {
  const m = CTA_MODES[modeKey];

  // line-clamp keeps the full text in the DOM and in the accessibility tree —
  // it is a visual truncation, not a content one. The button removes the class
  // rather than swapping any text in.
  const bodyEl = `<p data-body class="mx-auto ${m.gapBody} max-w-6xl font-body ${m.body} text-ink ${m.align === 'left' ? 'text-left sm:text-center' : ''} ${m.clamp ? 'line-clamp-3 sm:line-clamp-none' : ''}">${missionHtml(c)}</p>
    ${m.clamp ? `<button type="button" data-more aria-expanded="false"
      class="mt-2 inline-flex min-h-11 items-center gap-1 font-body text-[12px] font-bold uppercase tracking-[0.2em] text-magenta-text sm:hidden">
      Read more
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
    </button>` : ''}`;

  const form = formHtml(c, { formClass: m.order === 'formFirst' ? 'mt-6' : m.gapForm });
  const body = m.order === 'formFirst'
    ? `<div class="mt-8 border-t border-ink/10 pt-6 sm:border-0 sm:pt-0">${bodyEl}</div>`
    : bodyEl;

  return `
<section id="cta" class="relative overflow-hidden bg-white ${m.pad}">
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-px"
       style="background:linear-gradient(to right,transparent,${MAGENTA} 30%,${MAGENTA} 70%,transparent)"></div>
  <div class="relative mx-auto max-w-content px-6 text-center">
    <div class="flex items-center justify-center gap-5">
      <span aria-hidden="true" class="hidden h-0.5 w-16 rounded-full sm:block"
            style="background:linear-gradient(to right,transparent,${MAGENTA})"></span>
      <h2 class="font-display ${m.heading} font-bold text-ink">${esc(c.home.cta.heading)}</h2>
      <span aria-hidden="true" class="hidden h-0.5 w-16 rounded-full sm:block"
            style="background:linear-gradient(to left,transparent,${CYAN})"></span>
    </div>
    ${m.order === 'formFirst' ? form + body : body + form}
  </div>
</section>`;
};

export const CTA_JS = `
(function () {
  document.querySelectorAll('[data-more]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      var p = btn.parentElement.querySelector('[data-body]') ||
              btn.previousElementSibling;
      btn.setAttribute('aria-expanded', String(!open));
      p.classList.toggle('line-clamp-3', open);
      btn.firstChild.textContent = open ? 'Read more ' : 'Show less ';
    });
  });
})();
`;
