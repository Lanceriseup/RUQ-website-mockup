// Background filter treatments for the hero video.
//
// Different approaches, not different dim levels. The problem each is solving
// is the same — make white text legible over moving footage — but they trade
// differently: how much of the footage survives, how branded it looks, and
// what it costs the GPU.
//
// Each returns the <video> class list plus whatever overlay layers sit on top.
import { esc } from './layout.mjs';

export const FILTERS = {
  current: {
    label: 'Current — opacity plus a dark vertical gradient',
    trade: 'Even, safe, slightly flat. Dims the footage everywhere including where nothing needs dimming.',
    cost: 'free',
  },
  vignette: {
    label: 'Vignette — bright centre, dark edges',
    trade: 'Keeps the middle of the footage bright and readable while the edges carry the text. The most footage survives here.',
    cost: 'free',
  },
  blur: {
    label: 'Soft focus — blurred, barely dimmed',
    trade: 'Motion and colour stay, detail goes. Reads dreamy and expensive. Costs real GPU on a playing video, which matters on older phones.',
    cost: 'expensive on low-end devices',
  },
  mono: {
    label: 'Monochrome — desaturated to near black and white',
    trade: 'Timeless and editorial, and it stops the footage competing with the magenta and cyan. Loses the warmth of the room.',
    cost: 'cheap',
  },
  duotone: {
    label: 'Duotone — footage recoloured into the brand palette',
    trade: 'The strongest branding available: the b-roll is remapped to magenta shadows and cyan highlights. Unmistakably yours, but it is a big commitment.',
    cost: 'cheap',
  },
  wash: {
    label: 'Teal wash — a single deep colour over the footage',
    trade: 'A flat brand-coloured film rather than a grey one. Cooler and more deliberate than plain black, and it matches the VSL spotlight.',
    cost: 'free',
  },
  crush: {
    label: 'Crushed contrast — deep blacks, footage as texture',
    trade: 'Pushes contrast hard so mid-tones fall away and only shapes remain. The footage becomes texture rather than a scene.',
    cost: 'cheap',
  },
  grain: {
    label: 'Grain — dark with fine film noise over it',
    trade: 'Adds an analogue texture that hides banding in the gradient and makes flat dark areas feel intentional rather than empty.',
    cost: 'free (one small SVG)',
  },
};

export const renderFilter = (site, key) => {
  const src = esc(site.assets.heroVideo.src);
  const poster = esc(site.assets.heroVideo.poster);
  const vid = (cls, style = '') =>
    `<video class="absolute inset-0 h-full w-full object-cover ${cls}" ${style ? `style="${style}"` : ''}
            poster="${poster}" src="${src}" autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>`;

  switch (key) {
    case 'vignette':
      return `${vid('opacity-60')}
        <div class="absolute inset-0" style="background:radial-gradient(70% 60% at 50% 45%,rgba(28,28,28,.35),rgba(28,28,28,.92) 100%)"></div>`;

    case 'blur':
      // 12px is enough to abstract faces without turning to mush.
      return `${vid('opacity-70', 'filter:blur(12px) saturate(1.1);transform:scale(1.06)')}
        <div class="absolute inset-0 bg-ink/45"></div>`;

    case 'mono':
      return `${vid('opacity-45', 'filter:grayscale(1) contrast(1.1)')}
        <div class="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/55 to-ink/80"></div>`;

    case 'duotone':
      // Grayscale first so the blends map luminance cleanly: multiply pushes
      // magenta into the shadows, screen lifts cyan into the highlights.
      return `${vid('opacity-70', 'filter:grayscale(1) contrast(1.15)')}
        <div class="absolute inset-0" style="background:#e8208f;mix-blend-mode:multiply"></div>
        <div class="absolute inset-0" style="background:#00b9c6;mix-blend-mode:screen;opacity:.45"></div>
        <div class="absolute inset-0 bg-ink/45"></div>`;

    case 'wash':
      return `${vid('opacity-55')}
        <div class="absolute inset-0" style="background:#04333a;mix-blend-mode:multiply"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-ink/55 to-ink/75"></div>`;

    case 'crush':
      return `${vid('opacity-70', 'filter:contrast(1.75) brightness(.55) saturate(.85)')}
        <div class="absolute inset-0 bg-ink/45"></div>`;

    case 'grain':
      return `${vid('opacity-30')}
        <div class="absolute inset-0 bg-gradient-to-b from-ink/86 via-ink/72 to-ink/90"></div>
        <div class="absolute inset-0 opacity-[.22]" style="background-image:url(&quot;data:image/svg+xml;utf8,&lt;svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'&gt;&lt;filter id='n'&gt;&lt;feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/&gt;&lt;/filter&gt;&lt;rect width='140' height='140' filter='url(%23n)' opacity='.5'/&gt;&lt;/svg&gt;&quot;)"></div>`;

    default:
      return `${vid('opacity-25')}
        <div class="absolute inset-0 bg-gradient-to-b from-ink/86 via-ink/72 to-ink/90"></div>`;
  }
};
