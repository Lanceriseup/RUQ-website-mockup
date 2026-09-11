// FAQ treatments for the about page.
//
// Seven questions, all the client's own and now verbatim — the four that were
// here before were written during the first extraction pass and were not
// theirs. Two carry markup inside the answer: an italic "you" in the first and
// a mailto in the last. Both survive every option below.
//
// The answers are short. All seven are under 170 characters, and two are under
// 60 — one is "Dallas, TX". That is the fact that decides the set: a
// disclosure exists to hide length, and there is very little length here to
// hide. Half of these show everything at once, and the ones that do still
// disclose say what they are buying with it.
//
// Where a disclosure is used it is <details>/<summary>, never a JS accordion:
// it opens with the script blocked, it is keyboard-operable for nothing, and
// find-in-page can reach inside a closed one where the browser supports it.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

export const FAQ_OPTIONS = {
  current: {
    label: 'Current — plain disclosure list',
    note: 'What is there now, for comparison. A stack of closed rows on white.',
  },
  open: {
    label: 'Open — everything visible, two columns',
    note: 'No disclosure at all. Every question and answer on the page, in two columns, separated by hairlines. All seven answers are under 170 characters, so hiding them buys almost no height and costs a click each. The fastest of the six to actually read.',
  },
  cards: {
    label: 'Cards — each question on its own plate',
    note: 'Seven white cards on the warm ground, question in ink, answer beneath, all open. Reads as a reference sheet rather than a list. The most scannable, and the easiest to scale if the list grows.',
  },
  accordion: {
    label: 'Accordion — refined disclosure',
    note: 'The same idea as now but properly set: brand-coloured question, a rule between rows, and a chevron that turns. The first is open on load so the pattern is obvious. Still the right choice if the answers ever get long.',
  },
  split: {
    label: 'Split — heading holds its place, questions scroll',
    note: 'The heading and a line of support sit on the left and stay put while the questions run down the right. Gives the section a shape instead of a centred stack, and leaves room for a contact prompt beside it.',
  },
  numbered: {
    label: 'Numbered — an index of seven',
    note: 'Large brand numerals against each question, all answers open, hairlines between. Says there are seven and they are finite, which a closed accordion never does. Tallest of the six.',
  },
};

// ------------------------------------------------------------------ parts

// The first answer italicises "you" and the last carries a mailto. Both are
// matched on their text rather than hard-coded, so an edit to the copy renders
// plainly instead of breaking.
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
    if (i >= 0) {
      out = out.slice(0, i) +
        `<a href="${esc(f.linkUrl)}" class="font-semibold underline decoration-2 underline-offset-4 transition hover:opacity-70" style="color:#00838d">${t}</a>` +
        out.slice(i + t.length);
    }
  }
  return out;
};

const Q = 'font-display text-lg font-bold leading-snug';
const A = 'font-body text-[15px] leading-relaxed text-ink-soft';

const heading = (align = 'center') => `
<h2 class="font-display text-3xl font-bold text-ink sm:text-4xl${align === 'center' ? ' text-center' : ''}">Frequently Asked Questions</h2>`;

const chevron = `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
     class="shrink-0 transition group-open/f:rotate-180"><path d="M6 9l6 6 6-6"/></svg>`;

// ---------------------------------------------------------------- options

const RENDER = {
  current: (c) => `
<div class="mx-auto max-w-content px-6 py-20">
  ${heading()}
  <div class="mx-auto mt-10 max-w-3xl divide-y divide-ink/10 border-y border-ink/10">
    ${c.about.faqs.map(f => `
    <details class="group/f py-5">
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 ${Q} text-ink">
        ${esc(f.q)}${chevron}
      </summary>
      <p class="mt-3 ${A}">${answerHtml(f)}</p>
    </details>`).join('')}
  </div>
</div>`,

  open: (c) => `
<div class="mx-auto max-w-content px-6 py-20">
  ${heading()}
  <!-- columns, not a grid: the answers are different lengths and a grid would
       leave a ragged gap under every short one. -->
  <div class="mx-auto mt-12 max-w-5xl columns-1 gap-12 lg:columns-2">
    ${c.about.faqs.map(f => `
    <div class="mb-8 break-inside-avoid">
      <h3 class="${Q}" style="color:${MAGENTA}">${esc(f.q)}</h3>
      <p class="mt-2 ${A}">${answerHtml(f)}</p>
    </div>`).join('')}
  </div>
</div>`,

  cards: (c) => `
<div class="mx-auto max-w-content px-6 py-20">
  ${heading()}
  <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
    ${c.about.faqs.map(f => `
    <article class="rounded-2xl bg-white p-6 shadow-[0_18px_40px_-28px_rgba(28,28,28,.4)] ring-1 ring-ink/[.07]">
      <h3 class="${Q} text-ink">${esc(f.q)}</h3>
      <p class="mt-3 ${A}">${answerHtml(f)}</p>
    </article>`).join('')}
  </div>
</div>`,

  accordion: (c) => `
<div class="mx-auto max-w-content px-6 py-20">
  ${heading()}
  <div class="mx-auto mt-10 max-w-3xl">
    ${c.about.faqs.map((f, i) => `
    <details class="group/f border-b border-ink/10"${i === 0 ? ' open' : ''}>
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 py-5 ${Q}
                      transition hover:opacity-70
                      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta"
               style="color:${MAGENTA}">
        ${esc(f.q)}${chevron}
      </summary>
      <p class="pb-5 ${A}">${answerHtml(f)}</p>
    </details>`).join('')}
  </div>
</div>`,

  split: (c) => `
<div class="mx-auto max-w-content px-6 py-20">
  <div class="grid gap-12 lg:grid-cols-[5fr_7fr]">
    <div>
      <!-- sticky, so nothing above it may clip: an overflow-hidden ancestor
           turns this straight back into a static block. -->
      <div class="lg:sticky lg:top-28">
        ${heading('left')}
        <span aria-hidden="true" class="mt-6 block h-1 w-20 rounded-full" style="background:linear-gradient(to right,${MAGENTA},${CYAN})"></span>
        <p class="mt-6 max-w-sm ${A}">Still unsure about something? Email
          <a href="mailto:support@riseupqueens.com" class="font-semibold underline decoration-2 underline-offset-4" style="color:#00838d">support@riseupqueens.com</a>
          and a person will answer.</p>
      </div>
    </div>
    <div>
      ${c.about.faqs.map((f, i) => `
      <details class="group/f border-b border-ink/10"${i === 0 ? ' open' : ''}>
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 py-5 ${Q} text-ink
                        transition hover:opacity-70
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta">
          ${esc(f.q)}${chevron}
        </summary>
        <p class="pb-5 ${A}">${answerHtml(f)}</p>
      </details>`).join('')}
    </div>
  </div>
</div>`,

  numbered: (c) => `
<div class="mx-auto max-w-content px-6 py-20">
  ${heading()}
  <div class="mx-auto mt-12 max-w-3xl">
    ${c.about.faqs.map((f, i) => `
    <div class="flex gap-6 border-b border-ink/10 py-6">
      <span aria-hidden="true" class="w-10 shrink-0 font-display text-2xl font-extrabold leading-none tabular-nums"
            style="color:${MAGENTA}40">${String(i + 1).padStart(2, '0')}</span>
      <div class="min-w-0 flex-1">
        <h3 class="${Q} text-ink">${esc(f.q)}</h3>
        <p class="mt-2 ${A}">${answerHtml(f)}</p>
      </div>
    </div>`).join('')}
  </div>
</div>`,
};

export const renderFaqs = (c, key = 'current') => (RENDER[key] ?? RENDER.current)(c);
