// Shared contact-page parts.
//
// Pulled out of contact-layouts.mjs so the layout gallery and the shipped page
// build from one set of pieces. Two copies of a form is how a field gets fixed
// in one place and not the other.
//
// THE FORM IS DISABLED. Every field carries `disabled`, and so does Submit.
// There is no endpoint: the live page posts to a Brizy handler, the Jotform
// routes were reported broken, and the plan of record was MOS into Ontraport.
// A form that looks live and posts nowhere swallows real enquiries in silence.
//
// The visible "this is a mockup" note that used to sit above the first field
// has been removed — it was the largest thing in the panel and it was aimed at
// us, not at a visitor. What that costs: the fields no longer *say* they are
// inert, they only behave that way, so someone clicking in will find they
// cannot type. Turning the form on is dropping the `disabled` attributes here
// and giving the <form> a real action.
import { esc } from './layout.mjs';

export const MAGENTA = '#e8208f';
export const CYAN = '#00b9c6';
// Sampled from logo-ruk.png itself rather than guessed, so the rule under the
// partner block is the same gold as the crest above it.
export const RUK_GOLD = '#c09761';

// ------------------------------------------------------------------ socials

const SOCIAL_ICONS = {
  instagram: '<path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.2 1 .5 1.4 1 .4.4.7.8 1 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.3.6-.6 1-1 1.4-.4.4-.8.7-1.4 1-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.3-1-.6-1.4-1-.4-.4-.7-.8-1-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.3-.6.6-1 1-1.4.4-.4.8-.7 1.4-1 .4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.07-1.1.05-1.7.24-2.1.4-.5.2-.9.44-1.3.84-.4.4-.64.8-.84 1.3-.16.4-.35 1-.4 2.1C2.6 9.9 2.6 10.3 2.6 12s0 2.1.06 3.3c.05 1.1.24 1.7.4 2.1.2.5.44.9.84 1.3.4.4.8.64 1.3.84.4.16 1 .35 2.1.4 1.2.06 1.6.06 4.7.06s3.5 0 4.7-.06c1.1-.05 1.7-.24 2.1-.4.5-.2.9-.44 1.3-.84.4-.4.64-.8.84-1.3.16-.4.35-1 .4-2.1.06-1.2.06-1.6.06-3.3s0-2.1-.06-3.3c-.05-1.1-.24-1.7-.4-2.1-.2-.5-.44-.9-.84-1.3-.4-.4-.8-.64-1.3-.84-.4-.16-1-.35-2.1-.4C15.5 4 15.1 4 12 4zm0 3.1a4.9 4.9 0 110 9.8 4.9 4.9 0 010-9.8zm0 8.08a3.18 3.18 0 100-6.36 3.18 3.18 0 000 6.36zm6.24-8.28a1.14 1.14 0 11-2.29 0 1.14 1.14 0 012.29 0z"/>',
  facebook: '<path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94z"/>',
  youtube: '<path d="M21.58 7.19a2.5 2.5 0 00-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42a2.5 2.5 0 00-1.77 1.77A26 26 0 002 12a26 26 0 00.42 4.81 2.5 2.5 0 001.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.5 2.5 0 001.77-1.77A26 26 0 0022 12a26 26 0 00-.42-4.81zM10 15.02V8.98L15.2 12 10 15.02z"/>',
};

const SOCIAL_KEYS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'youtube', label: 'YouTube' },
];

// `shape` — round chips, square tiles, or bare icons with no container at all.
export const socials = (site, { tone = 'dark', align = 'start', shape = 'chip', heading = true } = {}) => {
  const dark = tone === 'dark';
  const box = {
    chip: dark
      ? 'h-12 w-12 rounded-full bg-white/[.06] text-white ring-1 ring-white/15 hover:bg-white/[.14] hover:ring-white/30'
      : 'h-12 w-12 rounded-full bg-ink/[.04] text-ink ring-1 ring-ink/10 hover:bg-ink/[.08] hover:ring-ink/25',
    tile: dark
      ? 'h-12 w-12 rounded-lg bg-white/[.05] text-white ring-1 ring-white/15 hover:bg-white/[.12]'
      : 'h-12 w-12 rounded-lg bg-ink/[.04] text-ink ring-1 ring-ink/10 hover:bg-ink/[.08]',
    bare: dark
      ? 'h-10 w-10 text-white/70 hover:text-white'
      : 'h-10 w-10 text-ink-soft hover:text-ink',
  }[shape];

  return `
<div class="${align === 'center' ? 'text-center' : ''}">
  ${heading ? `<h2 class="font-display text-xs font-bold uppercase tracking-[.22em] ${dark ? 'text-white/55' : 'text-ink-soft'}">Find Us On Socials</h2>` : ''}
  <ul class="${heading ? 'mt-4 ' : ''}flex ${align === 'center' ? 'justify-center' : ''} ${shape === 'bare' ? 'gap-5' : 'gap-3'}">
    ${SOCIAL_KEYS.filter(s => site.social[s.key]).map(s => `
    <li>
      <a href="${esc(site.social[s.key])}" target="_blank" rel="noopener"
         class="flex items-center justify-center transition ${box}
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta">
        <span class="sr-only">${esc(s.label)}</span>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${SOCIAL_ICONS[s.key]}</svg>
      </a>
    </li>`).join('')}
  </ul>
</div>`;
};

// --------------------------------------------------------------------- form

// Field skins. Disabled deliberately looks the same as enabled in every one of
// them: the note that explained the disabled state is gone, so a greyed-out
// field would read as broken rather than as a mockup.
const FIELD_SKIN = {
  filled: 'rounded-xl border border-white/15 bg-white/[.05] text-white placeholder:text-white/30 focus:border-magenta focus:ring-2 focus:ring-magenta/40',
  underline: 'rounded-none border-0 border-b border-white/20 bg-transparent px-0 text-white placeholder:text-white/25 focus:border-magenta focus:ring-0',
  inset: 'rounded-xl border border-black/40 bg-black/30 text-white placeholder:text-white/25 shadow-[inset_0_2px_10px_rgba(0,0,0,.7)] focus:border-magenta focus:ring-2 focus:ring-magenta/30',
  outline: 'rounded-full border border-white/25 bg-transparent text-white placeholder:text-white/25 focus:border-cyan focus:ring-2 focus:ring-cyan/30',
  soft: 'rounded-2xl border-0 bg-white/[.07] text-white placeholder:text-white/30 focus:bg-white/[.11] focus:ring-2 focus:ring-magenta/40',
  light: 'rounded-xl border border-ink/20 bg-white text-ink placeholder:text-ink/35 focus:border-magenta focus:ring-2 focus:ring-magenta/30',
};

// Each entry is [class, inlineStyle]. Keeping the two apart rather than
// smuggling a style attribute out of the end of a class string: the smuggled
// form works right up until someone adds a class after it.
const LABEL_SKIN = {
  caps: ['font-display text-xs font-bold uppercase tracking-[.16em] text-white/85', ''],
  capsLight: ['font-display text-xs font-bold uppercase tracking-[.16em] text-ink', ''],
  quiet: ['font-body text-[13px] font-semibold uppercase tracking-[.18em] text-white/45', ''],
  brand: ['font-display text-xs font-bold uppercase tracking-[.16em]', `color:${MAGENTA}`],
};

const field = (f, { skin = 'filled', label = 'caps', idPrefix = 'c' } = {}) => {
  const id = `${idPrefix}-${f.name}`;
  const pad = skin === 'underline' ? 'py-3' : skin === 'outline' ? 'px-5 py-3' : 'px-4 py-3';
  const cls = `mt-2 w-full ${pad} font-body text-[15px] transition focus:outline-none
               disabled:cursor-not-allowed ${FIELD_SKIN[skin]}`;
  const [labelCls, labelStyle] = LABEL_SKIN[label];
  const auto = f.name === 'name' ? 'name' : f.name === 'email' ? 'email' : f.name === 'phone' ? 'tel' : 'off';
  return `
<div>
  <label for="${id}" class="block ${labelCls}"${labelStyle ? ` style="${labelStyle}"` : ''}>${esc(f.label)}</label>
  ${f.type === 'textarea'
    ? `<textarea id="${id}" name="${esc(f.name)}" rows="5" disabled class="${cls} resize-y"></textarea>`
    : `<input id="${id}" name="${esc(f.name)}" type="${esc(f.type)}" disabled autocomplete="${auto}" class="${cls}">`}
</div>`;
};

const SUBMIT_SKIN = {
  solid: ['rounded-full bg-magenta text-white shadow-[0_16px_34px_-16px_rgba(232,32,143,.9)]', ''],
  gradient: ['rounded-full text-white shadow-[0_16px_34px_-16px_rgba(232,32,143,.9)]', `background:linear-gradient(90deg,${MAGENTA},${CYAN})`],
  outline: ['rounded-full bg-transparent text-white ring-1 ring-white/40 hover:bg-white/10', ''],
  square: ['rounded-xl bg-magenta text-white', ''],
};

// `columns` puts Name and Phone on one row. Email and Message always run full
// width — a cramped Message box invites a short message.
export const form = (c, { skin = 'filled', label = 'caps', submit = 'solid', idPrefix = 'c', columns = true } = {}) => {
  const [name, phone, email, message] = c.contact.fields;
  const o = { skin, label, idPrefix };
  const [btnCls, btnStyle] = SUBMIT_SKIN[submit];
  return `
<form action="#" method="post" novalidate class="space-y-5">
  ${columns
    ? `<div class="grid gap-5 sm:grid-cols-2">${field(name, o)}${field(phone, o)}</div>${field(email, o)}`
    : `${field(name, o)}${field(phone, o)}${field(email, o)}`}
  ${field(message, o)}
  <button type="submit" disabled
          class="w-full cursor-not-allowed px-8 py-3.5 font-display text-sm font-bold uppercase tracking-[.14em]
                 transition ${btnCls}"${btnStyle ? ` style="${btnStyle}"` : ''}>
    ${esc(c.contact.submit)}
  </button>
</form>`;
};

// -------------------------------------------------------------------- video

// Poster frames are local files from scripts/fetch-posters.mjs, not hotlinks to
// i.ytimg.com: nothing is requested from Google until a visitor clicks, and
// then it opens in the lightbox in app.js on the nocookie domain.
const VIDEO_TITLES = {
  MsKV8OsY2pg: 'The Most Effective Way to Communicate in Your Marriage',
  jO_JIAVVRdE: 'How to Get Addicted to Intimacy with Your Spouse Again',
};

export const video = (id, vids, { radius = 'rounded-2xl', ring = 'ring-1 ring-white/15' } = {}) => {
  const v = vids.youtube.find(x => x.id === id) || { id, title: VIDEO_TITLES[id] || 'Watch' };
  const short = VIDEO_TITLES[id] || v.title.replace(/\s*\|\s*Jessica Lewis\s*$/, '');
  return `
<figure class="group">
  <button type="button" data-lightbox data-provider="youtube" data-id="${esc(v.id)}" data-title="${esc(v.title)}"
          class="video-facade relative block w-full overflow-hidden ${radius} ${ring}
                 shadow-[0_26px_60px_-28px_rgba(0,0,0,.95)]
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta">
    <span class="sr-only">Play ${esc(v.title)}</span>
    <span class="relative block aspect-video w-full">
      <img src="/assets/posters/yt-${esc(v.id)}.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async"
           class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105">
      <span aria-hidden="true" class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,.55),transparent 55%)"></span>
      <span aria-hidden="true" class="absolute inset-0 flex items-center justify-center">
        <span class="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-[0_12px_34px_-8px_rgba(0,0,0,.7)] transition group-hover:scale-110">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="${MAGENTA}" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
        </span>
      </span>
    </span>
  </button>
  <figcaption class="mt-3 font-body text-sm leading-snug text-white/65">${esc(short)}</figcaption>
</figure>`;
};

// ------------------------------------------------------------------ partner

// The Rise Up Kings crest, from site.assets.logoParent — which was in the data
// all along and had never been rendered anywhere.
//
// alt="" on purpose. The crest reads "RISE UP KINGS", and so does the heading
// beside it and the link beneath it; giving it alt text would make a screen
// reader say the name three times in a row. It is decoration here, not
// information.
export const rukCrest = (site, cls = 'w-16') => `
<img src="${esc(site.assets.logoParent)}" alt="" aria-hidden="true"
     width="1762" height="2560" loading="lazy" decoding="async"
     class="${cls} shrink-0">`;

// How the crest is built into the Rise Up Kings block.
//
// The first attempt — a tall crest standing beside two short lines of text —
// is kept as `beside` so the comparison is honest, but it is the one that was
// rejected and the reason is structural: the crest is a portrait shield at
// roughly 2:3, and it was set against a two-line text block half its height,
// so nothing lined up at the top or the bottom. Every option below either
// gives it a horizontal band of its own, shrinks it to text scale, or stops
// treating it as a sibling of the text altogether.
export const PARTNER_SHAPES = {
  beside: {
    label: 'Current — crest standing beside the text',
    note: 'What is there now, for comparison. A portrait shield against a two-line text block half its height, so the two align at neither the top nor the bottom and the block reads as two unrelated objects.',
  },
  badge: {
    label: 'Badge — a bordered card, crest centred at the top',
    note: 'The block becomes a card with a gold hairline edge, the crest centred above the text and the button running the full width beneath. The crest gets a symmetrical space of its own, which is the shape a shield actually wants, and the whole thing reads as a sealed invitation rather than a link with a picture next to it.',
  },
  above: {
    label: 'Above — crest over the heading, left aligned',
    note: 'The smallest change that fixes the alignment: the crest moves off the side and sits above the heading on the same left edge as everything else in the column. Nothing else in the block moves. Safest of the six.',
  },
  watermark: {
    label: 'Watermark — the crest behind the text, faint',
    note: 'A large crest set into the top-right corner of a tinted panel at low opacity, with the text over it. The crest stops being an object to align and becomes texture, so there is nothing left to line up. Most designed of the six and the least literal.',
  },
  banner: {
    label: 'Banner — a gold rule, then crest and heading on one line',
    note: 'A gold hairline opens the block, then a small crest and the heading share a single baseline. The rule does the separating that the crest was being asked to do, which lets the crest come down to the size of the type beside it.',
  },
  inButton: {
    label: 'In the button — the crest as the button’s own mark',
    note: 'No standalone crest at all. It sits inside the Rise Up Kings button at text size, ahead of the label, the way a sign-in-with button carries a mark. Tidiest option by a distance, and the only one where the crest is attached to the thing it actually leads to.',
  },
};

export const partner = (site, c, shape = 'above') => {
  const p = c.contact.partner;

  const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const linkCls = (extra = '') => `inline-flex items-center gap-2 rounded-full border px-6 py-3 font-display text-xs font-bold uppercase
     tracking-[.14em] text-white transition hover:bg-white/10
     focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${extra}`;

  const link = (extra = '') => `
<a href="${esc(p.url)}" target="_blank" rel="noopener" class="${linkCls(extra)}" style="border-color:${RUK_GOLD}">
  ${esc(p.cta)}${arrow}
</a>`;

  const text = `
<div>
  <h2 class="font-display text-xl font-bold text-white">${esc(p.heading)}</h2>
  <p class="mt-1 font-body text-white/60">${esc(p.body)}</p>
</div>`;

  if (shape === 'badge') return `
<div class="rounded-2xl border p-7 text-center" style="border-color:rgba(192,151,97,.35)">
  <div class="flex justify-center">${rukCrest(site, 'w-16')}</div>
  <h2 class="mt-5 font-display text-xl font-bold text-white">${esc(p.heading)}</h2>
  <p class="mt-1 font-body text-white/60">${esc(p.body)}</p>
  ${link('mt-6 w-full justify-center')}
</div>`;

  if (shape === 'above') return `
<div>
  ${rukCrest(site, 'w-16')}
  <div class="mt-5">${text}</div>
  <div class="mt-5">${link()}</div>
</div>`;

  // The crest is meant to run off the corner here, so this overflow-hidden is
  // doing intended work rather than accidentally clipping a decoration.
  if (shape === 'watermark') return `
<div class="relative overflow-hidden rounded-2xl bg-white/[.04] p-7 ring-1 ring-white/10">
  <span aria-hidden="true" class="pointer-events-none absolute -right-6 -top-8 opacity-10">
    ${rukCrest(site, 'w-36')}
  </span>
  <div class="relative">
    ${text}
    <div class="mt-5">${link()}</div>
  </div>
</div>`;

  if (shape === 'banner') return `
<div class="border-t pt-6" style="border-color:rgba(192,151,97,.4)">
  <div class="flex items-center gap-4">
    ${rukCrest(site, 'w-10')}
    <h2 class="font-display text-xl font-bold text-white">${esc(p.heading)}</h2>
  </div>
  <p class="mt-3 font-body text-white/60">${esc(p.body)}</p>
  <div class="mt-5">${link()}</div>
</div>`;

  if (shape === 'inButton') return `
<div>
  ${text}
  <a href="${esc(p.url)}" target="_blank" rel="noopener"
     class="${linkCls('mt-5 gap-3 py-2.5 pl-3')}" style="border-color:${RUK_GOLD}">
    ${rukCrest(site, 'w-5')}
    ${esc(p.cta)}${arrow}
  </a>
</div>`;

  return `
<div>
  <div class="flex items-start gap-5">
    ${rukCrest(site, 'w-16')}
    ${text}
  </div>
  <div class="mt-5">${link()}</div>
</div>`;
};

// ------------------------------------------------------------------ heading

// What sits under the word "Contact". The magenta-to-cyan bar that was there
// is kept as `gradient` for comparison only — it is the thing being replaced.
export const HEADING_RULES = {
  gradient: {
    label: 'Current — the two-tone bar',
    note: 'What is there now, for comparison: a short magenta-to-cyan bar. The gradient is doing decorative work here that it does structural work for elsewhere on the site, which is most of why it reads as an ornament stuck under the word.',
  },
  none: {
    label: 'None — the heading and the lead, nothing between',
    note: 'The rule simply goes. The lead moves up to sit close under the heading, and the two read as one block. Quietest option, and the one that makes the left column feel least decorated — which suits a page that is mostly a form.',
  },
  hair: {
    label: 'Hairline — a full-width rule across the column',
    note: 'A single hairline at 15% white running the whole width of the column rather than a short stub. It stops being an ornament and becomes structure: it separates the heading from the lead and sets the column width at the same time.',
  },
  solid: {
    label: 'Solid — one colour, no gradient',
    note: 'The same short bar, but magenta only. Keeps the brand accent and the proportion that is already there, and removes only the two-tone fade. The smallest possible change if the shape was never the problem.',
  },
  stub: {
    label: 'Stub — short, thick, white',
    note: 'Half the width and half again the thickness, in plain white. Reads as a typographic mark rather than a brand device, which is what lets it sit under a word this heavy without competing with it.',
  },
  side: {
    label: 'Side bar — a vertical rule beside the heading',
    note: 'The rule moves off the bottom and stands to the left of the heading and the lead together, running the full height of both. Gives the column a left edge and makes the heading feel set into the page rather than floating at the top of it.',
  },
  word: {
    label: 'Word rule — underlining the word itself',
    note: 'A hairline tucked directly under "Contact" at exactly the width of the word, not an arbitrary length. It is the only option here where the rule is measured by the type rather than chosen, which is why it always looks in proportion.',
  },
};

export const heading = (c, { align = 'left', size = 'big', rule = 'none' } = {}) => {
  const sizes = { huge: 'text-6xl sm:text-7xl', big: 'text-5xl sm:text-6xl', small: 'text-4xl sm:text-5xl' };
  const centred = align === 'center';
  const h1 = `<h1 class="font-display font-extrabold leading-[.95] text-white ${sizes[size]}">${esc(c.contact.heading)}</h1>`;
  const lead = (mt) => `<p class="${mt} ${centred ? 'mx-auto ' : ''}max-w-xl font-body text-lg leading-relaxed text-white/70">${esc(c.contact.lead)}</p>`;

  // The vertical bar is a flex sibling, not an absolute element: it has to be
  // the height of the heading AND the lead together, and that height is not
  // knowable at build time.
  if (rule === 'side') return `
<div class="flex gap-6">
  <span aria-hidden="true" class="w-1 shrink-0 rounded-full" style="background:${MAGENTA}"></span>
  <div>${h1}${lead('mt-6')}</div>
</div>`;

  // inline-block so the border is the width of the word rather than the width
  // of the column.
  if (rule === 'word') return `
<div class="${centred ? 'text-center' : ''}">
  <h1 class="font-display font-extrabold leading-[.95] text-white ${sizes[size]}">
    <span class="inline-block border-b-2 border-white/25 pb-2">${esc(c.contact.heading)}</span>
  </h1>
  ${lead('mt-6')}
</div>`;

  const rules = {
    gradient: `<span aria-hidden="true" class="mt-6 block h-1 w-20 rounded-full ${centred ? 'mx-auto' : ''}" style="background:linear-gradient(to right,${MAGENTA},${CYAN})"></span>`,
    solid: `<span aria-hidden="true" class="mt-6 block h-1 w-20 rounded-full ${centred ? 'mx-auto' : ''}" style="background:${MAGENTA}"></span>`,
    stub: `<span aria-hidden="true" class="mt-6 block h-1.5 w-10 rounded-full bg-white ${centred ? 'mx-auto' : ''}"></span>`,
    hair: `<span aria-hidden="true" class="mt-7 block h-px w-full bg-white/15"></span>`,
    none: '',
  };
  return `
<div class="${centred ? 'text-center' : ''}">
  ${h1}
  ${rules[rule] ?? ''}
  ${lead(rule === 'none' ? 'mt-5' : 'mt-6')}
</div>`;
};

export const watchLabel = `
<h2 class="font-display text-xs font-bold uppercase tracking-[.22em] text-white/55">Watch</h2>`;
