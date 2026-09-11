// Background treatments for the Statement of Faith band.
//
// Two independent levers, so any filter combines with any edge:
//
//   FILTER  what happens to the cross photograph behind the plate
//   EDGE    how the dark band meets the white sections above and below
//
// The band sits between the white CTA and the white video section, so every
// edge treatment is drawn in #ffffff and dissolves into its neighbours. If a
// neighbouring section ever stops being white, the edge colour has to follow.
//
// Contrast is unaffected by any of this: the creed sits on the parchment
// plate, which is opaque. The filter only changes the mood around it.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';
const PHOTO = '/assets/photos/faith-bg.png';
const WHITE = '#ffffff';

export const FAITH_FILTERS = {
  flat: {
    label: 'Flat scrim — what is there now',
    note: 'A single even layer of ink at 80%. Even coverage, no shaping, no colour. Shown for comparison.',
  },
  spotlight: {
    label: 'Spotlight — light behind the plate, deep at the corners',
    note: 'A radial falloff lifts the photograph directly behind the parchment and drops it to near-black at the edges, so the plate looks lit rather than pasted on. Same device as the hero vignette, which ties the two dark moments on the page together.',
  },
  duotone: {
    label: 'Duotone — the photograph recoloured in the brand gradient',
    note: 'The image is desaturated then tinted magenta-to-cyan. The strongest brand statement of the six, and the only one that puts colour behind the creed.',
  },
  candle: {
    label: 'Candlelight — warm amber wash',
    note: 'Sepia plus a warm brown overlay. The parchment stops being the only warm thing on screen, so the plate reads as part of the scene instead of a pale box dropped over a cool photo.',
  },
  stone: {
    label: 'Stone — pure greyscale, no colour cast',
    note: 'All colour removed and contrast pushed. Closest in spirit to what the live site does to this image, but dark instead of blown out. Quietest option; lets the parchment carry all the warmth.',
  },
  depth: {
    label: 'Depth of field — the photograph thrown out of focus',
    note: 'A soft blur behind the plate, scaled slightly so the blur has no edge to bleed against. The creed becomes the focal plane. Reads as photography rather than as a texture.',
  },
};

export const FAITH_EDGES = {
  straight: {
    label: 'Straight — what is there now',
    note: 'Hard horizontal cut top and bottom. Shown for comparison.',
  },
  feather: {
    label: 'Feathered — the dark dissolves into the white',
    note: 'White fades down into the band at the top and up into it at the bottom, so there is no line at all. The softest option and the least likely to fight any future copy.',
  },
  framed: {
    label: 'Framed — brand rules top and bottom',
    note: 'A 3px magenta bar along the top edge and cyan along the bottom, each with a hairline set in behind it. Still a straight cut, but a deliberate one: it reads as a bordered plate rather than a section that happened to end.',
  },
  arch: {
    label: 'Arch — a shallow dome top and bottom',
    note: 'The band curves up into a wide shallow dome and mirrors it below. Architectural, and the only option that suggests a chapel window without literally drawing one.',
  },
  torn: {
    label: 'Torn — a deckle edge, like a page pulled from a book',
    note: 'An irregular torn-paper boundary at both edges. The most on-theme of the six given the creed is already set as a manuscript, and the only one that is not a geometric shape.',
  },
  scallop: {
    label: 'Scalloped — a repeating wave',
    note: 'An even row of shallow arcs at both edges. Decorative and soft; the most openly ornamental of the six.',
  },
};

// ---------------------------------------------------------------- filters

// Every filter returns { img, layers } so the photograph itself can be
// filtered rather than only covered over.
const filterFor = (key) => {
  if (key === 'spotlight') return {
    img: '',
    layers: [
      'background:radial-gradient(72% 58% at 50% 50%,rgba(28,28,28,.58),rgba(28,28,28,.95) 100%)',
    ],
  };

  if (key === 'duotone') return {
    img: 'grayscale contrast-125',
    layers: [
      `background:linear-gradient(135deg,${MAGENTA},${CYAN});mix-blend-mode:color`,
      'background:rgba(28,28,28,.74)',
    ],
  };

  if (key === 'candle') return {
    // contrast-[1.1], not contrast-110: Tailwind's contrast scale is
    // 0/50/75/100/125/150/200, so contrast-110 compiles to nothing at all.
    img: 'sepia contrast-[1.1]',
    layers: [
      'background:linear-gradient(135deg,rgba(92,48,14,.55),rgba(38,20,8,.75))',
      'background:rgba(28,20,12,.62)',
    ],
  };

  if (key === 'stone') return {
    img: 'grayscale contrast-125 brightness-90',
    layers: ['background:rgba(28,28,28,.78)'],
  };

  if (key === 'depth') return {
    // scale-105 pushes the blurred edges outside the clip. Without it the blur
    // samples past the image and leaves a pale halo around the whole band.
    img: 'scale-105 blur-[3px]',
    layers: ['background:rgba(28,28,28,.78)'],
  };

  // flat
  return { img: '', layers: ['background:rgba(28,28,28,.8)'] };
};

// ------------------------------------------------------------------ edges

// Generated rather than hand-written: a scallop is twelve identical arcs and a
// deckle is twenty-five irregular steps, both of which are unreadable as
// literal path strings and impossible to adjust once written.
const scallopPath = () => {
  const W = 1440, N = 12, seg = W / N, base = 14, depth = 30;
  let d = `M0,0 H${W} V${base}`;
  for (let i = N; i > 0; i--) {
    const x1 = seg * i, x0 = seg * (i - 1);
    d += ` Q${(x1 + x0) / 2},${depth} ${x0},${base}`;
  }
  return `${d} Z`;
};

const decklePath = () => {
  const W = 1440, N = 24, seg = W / N;
  // Deterministic wobble. Math.random() here would give every build a
  // different edge, which turns every rebuild into a diff.
  let d = `M0,0 H${W} V20`;
  for (let i = N; i >= 0; i--) {
    const x = seg * i;
    const y = 12 + (Math.sin(i * 2.7) * 0.5 + 0.5) * 20;
    d += ` L${x.toFixed(0)},${y.toFixed(1)}`;
  }
  return `${d} Z`;
};

const svgEdge = (path, viewH, flip) => `
<svg aria-hidden="true" viewBox="0 0 1440 ${viewH}" preserveAspectRatio="none" fill="${WHITE}"
     class="pointer-events-none absolute inset-x-0 ${flip ? 'bottom-0' : 'top-0'} w-full"
     style="height:${viewH}px;display:block${flip ? ';transform:scaleY(-1)' : ''}">
  <path d="${path}"/>
</svg>`;

// Returns { clipStyle, overlays, padY }. Clipping goes on the decoration
// wrapper only — overflow-hidden on the <section> itself is what silently
// kills position: sticky, and the content column may want it later.
const edgeFor = (key) => {
  if (key === 'feather') return {
    clipStyle: '', padY: 'py-20',
    overlays: `
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-24"
       style="background:linear-gradient(to bottom,${WHITE},rgba(255,255,255,0))"></div>
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-24"
       style="background:linear-gradient(to top,${WHITE},rgba(255,255,255,0))"></div>`,
  };

  if (key === 'framed') return {
    clipStyle: '', padY: 'py-16',
    overlays: `
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-[3px]" style="background:${MAGENTA}"></div>
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-[9px] h-px" style="background:rgba(255,255,255,.28)"></div>
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-[3px]" style="background:${CYAN}"></div>
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-[9px] h-px" style="background:rgba(255,255,255,.28)"></div>`,
  };

  if (key === 'arch') return {
    // Elliptical radii: 50% of the width horizontally against 5rem vertically
    // is what makes a wide shallow dome rather than a rounded rectangle.
    clipStyle: 'border-radius:50% 50% 50% 50%/5rem 5rem 5rem 5rem',
    padY: 'py-24',
    overlays: '',
  };

  if (key === 'torn') {
    const p = decklePath();
    return { clipStyle: '', padY: 'py-20', overlays: svgEdge(p, 34, false) + svgEdge(p, 34, true) };
  }

  if (key === 'scallop') {
    const p = scallopPath();
    return { clipStyle: '', padY: 'py-20', overlays: svgEdge(p, 32, false) + svgEdge(p, 32, true) };
  }

  // straight
  return { clipStyle: '', padY: 'py-16', overlays: '' };
};

// ----------------------------------------------------------------- render

export const renderFaithBg = (site, c, filterKey = 'flat', edgeKey = 'straight') => {
  const f = filterFor(filterKey);
  const e = edgeFor(edgeKey);
  const B = c.home.faith.beliefs;

  return `
<section class="relative">

  <!-- Decoration only. isolate keeps mix-blend-mode inside this wrapper, so a
       duotone tint cannot blend with the white page behind it. -->
  <div aria-hidden="true" class="absolute inset-0 overflow-hidden"
       style="isolation:isolate${e.clipStyle ? ';' + e.clipStyle : ''}">
    <img src="${PHOTO}" alt="" loading="lazy" decoding="async"
         class="absolute inset-0 h-full w-full object-cover ${f.img}">
    ${f.layers.map(l => `<div class="absolute inset-0" style="${l}"></div>`).join('\n    ')}
  </div>
${e.overlays}
  <div class="relative ${e.padY}">
    <div class="mx-auto max-w-4xl px-6">
      <div class="p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)] sm:p-10"
           style="background:#F6F1E8;font-family:'Cormorant Garamond',serif">

        <p class="text-center font-body text-[11px] uppercase tracking-[0.4em] text-ink-soft">${esc(c.home.faith.title)}</p>
        <div aria-hidden="true" class="mx-auto mt-5 h-px w-24" style="background:${MAGENTA}"></div>

        <p class="mt-6 text-[1.2rem] leading-[1.5] text-ink
                  first-letter:float-left first-letter:mr-3 first-letter:mt-1
                  first-letter:text-[3.5rem] first-letter:font-semibold first-letter:leading-[.8]
                  first-letter:text-magenta">${esc(c.home.faith.intro)}</p>

        <div aria-hidden="true" class="my-7 h-px w-full" style="background:rgba(28,28,28,.18)"></div>

        <ol class="columns-1 gap-10 sm:columns-2">
          ${B.map((b, i) => `
          <li class="mb-5 break-inside-avoid text-[1.08rem] leading-[1.45] text-ink">
            <span aria-hidden="true" class="mr-2 align-baseline font-body text-sm font-semibold" style="color:${MAGENTA}">${String(i + 1).padStart(2, '0')}</span>${esc(b)}
          </li>`).join('')}
        </ol>
      </div>
    </div>
  </div>
</section>`;
};
