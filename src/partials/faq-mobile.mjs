// Compact mobile treatments for the About page FAQs.
//
// Shipped: seven <details> rows on hairlines, all closed, question at 18px.
//
// ── Something the codebase already argues with itself about ──────────────────
// faq-variants.mjs describes its own "open" option like this:
//
//   "All seven answers are under 170 characters, so hiding them buys almost
//    no height and costs a click each."
//
// That is worth taking seriously here, because it means the disclosure is not
// actually a compaction device on this content. The longest answer is 165
// characters — about three lines at phone width — and two are under 60. The
// height being saved by hiding them is real but small, and it is bought with
// seven taps.
//
// So the options are in two groups:
//
//   A-B   keep the disclosure and make the closed list genuinely tight
//   C-D   spend some of that height on not making people tap at all
//
// The question type is the lever that matters most in group A. At 18px in a
// 342px column, four of the seven questions wrap to two lines; at 16px only
// one does. Each avoided wrap is 24px, and there are seven rows.
//
// All options are MOBILE ONLY; the desktop list is untouched.
import { esc } from './layout.mjs';

const A_CLS = 'font-body leading-relaxed text-ink-soft';

export const FAQ_MODES = {
  current: {
    label: 'Current — what ships today',
    note: 'The baseline: seven closed rows, question at 18px, 20px of padding above and below each, heading at 30px.',
    pad: 'py-12', gapTop: 'mt-10', rowPad: 'py-5', q: 'text-lg', a: 'text-[15px]',
    head: 'text-3xl', open: 'none',
  },

  tighten: {
    label: 'A — Tighten the rows',
    note: 'Section padding 48→32px, the gap under the heading 40→24px, heading 30→24px, and each row 20px of padding above and below becomes 14px. Same list, same behaviour, nothing to decide.',
    pad: 'py-8 sm:py-20', gapTop: 'mt-6 sm:mt-10', rowPad: 'py-3.5 sm:py-5', q: 'text-lg', a: 'text-[15px]',
    head: 'text-2xl sm:text-4xl', open: 'none',
  },

  qSize: {
    label: 'B — A, question type down a step',
    note: 'A, with the question at 16px below sm instead of 18px. That sounds cosmetic and is not: at 18px in a 342px column four of the seven questions wrap onto a second line, and at 16px only one does. Three avoided wraps at 24px each, on top of A. The best height-per-risk of the four.',
    pad: 'py-8 sm:py-20', gapTop: 'mt-6 sm:mt-10', rowPad: 'py-3.5 sm:py-5', q: 'text-base sm:text-lg', a: 'text-[15px] sm:text-[15px]',
    open: 'none', head: 'text-2xl sm:text-4xl',
  },

  firstOpen: {
    label: 'C — B, with the first answer open',
    note: 'B, and the first row is open on load. Costs about 60px and buys the thing a closed accordion never does: it shows that the rows open at all. A stack of seven identical closed lines with a chevron is easy to scroll straight past — especially on a phone, where the chevron is the only affordance and there is no hover to hint at it.',
    pad: 'py-8 sm:py-20', gapTop: 'mt-6 sm:mt-10', rowPad: 'py-3.5 sm:py-5', q: 'text-base sm:text-lg', a: 'text-[15px] sm:text-[15px]',
    open: 'first', head: 'text-2xl sm:text-4xl',
  },

  allOpen: {
    label: 'D — B, with nothing hidden',
    note: 'B, with the disclosure dropped below sm: every question and answer visible, hairlines between. TALLER than the others, and included because the file that builds this section already makes the argument — the answers are all under 170 characters, so hiding them saves little and costs a tap each. On a phone, where a tap means losing your scroll position and finding it again, that trade is worse than on desktop. Pick this if the FAQs are there to be read rather than to look tidy.',
    pad: 'py-8 sm:py-20', gapTop: 'mt-6 sm:mt-10', rowPad: 'py-3.5 sm:py-5', q: 'text-base sm:text-lg', a: 'text-[15px] sm:text-[15px]',
    open: 'all', head: 'text-2xl sm:text-4xl',
  },
};

const answerHtml = (f) => {
  let out = esc(f.a);
  if (f.emphasis) {
    const e = esc(f.emphasis);
    const i = out.indexOf(e);
    if (i >= 0) out = out.slice(0, i) + `<em>${e}</em>` + out.slice(i + e.length);
  }
  if (f.linkText && f.linkUrl) {
    const t = esc(f.linkText);
    const i = out.indexOf(t);
    if (i >= 0) out = out.slice(0, i) + `<a href="${esc(f.linkUrl)}" class="font-semibold underline decoration-2 underline-offset-4" style="color:#00838d">${t}</a>` + out.slice(i + t.length);
  }
  return out;
};

const chevron = `
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
     class="shrink-0 transition group-open/f:rotate-180"><path d="M6 9l6 6 6-6"/></svg>`;

export const renderFaqMobile = (c, modeKey) => {
  const m = FAQ_MODES[modeKey];
  const faqs = c.about.faqs;

  // D renders the answers as plain markup below sm and keeps the real
  // <details> for sm and up, so the desktop disclosure is untouched.
  const plainList = `
  <div class="mx-auto ${m.gapTop} max-w-3xl divide-y divide-ink/10 border-y border-ink/10 sm:hidden">
    ${faqs.map(f => `
    <div class="${m.rowPad}">
      <h3 class="font-display ${m.q} font-bold leading-snug text-ink">${esc(f.q)}</h3>
      <p class="mt-1.5 ${A_CLS} ${m.a}">${answerHtml(f)}</p>
    </div>`).join('')}
  </div>`;

  const detailsList = `
  <div class="mx-auto ${m.gapTop} max-w-3xl divide-y divide-ink/10 border-y border-ink/10 ${m.open === 'all' ? 'hidden sm:block' : ''}">
    ${faqs.map((f, i) => `
    <details class="group/f ${m.rowPad}"${m.open === 'first' && i === 0 ? ' open' : ''}>
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-display ${m.q} font-bold leading-snug text-ink">
        ${esc(f.q)}${chevron}
      </summary>
      <p class="mt-2 ${A_CLS} ${m.a}">${answerHtml(f)}</p>
    </details>`).join('')}
  </div>`;

  return `
<div id="faqs" class="bg-white">
  <div class="mx-auto max-w-content px-6 ${m.pad}">
    <h2 class="text-center font-display ${m.head} font-bold text-ink">Frequently Asked Questions</h2>
    ${m.open === 'all' ? plainList + detailsList : detailsList}
  </div>
</div>`;
};
