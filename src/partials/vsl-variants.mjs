// VSL treatments. Six frames, one shared playback mechanic.
//
// MECHANIC: the video autoplays muted and loops the moment the page loads, so
// the hero is alive rather than a still. Clicking anywhere on it unmutes and
// restarts from the top — that click is the "real" play.
//
// Muted is not optional: every browser blocks autoplay with sound. Wistia's
// silentAutoPlay option is the supported way to ask for it, and unmuting is
// driven through their JS API so the video keeps playing rather than
// reloading. That also preserves Wistia's view analytics, which matters for a
// marketing VSL — self-hosting the MP4 would be lighter but would lose them.
import { esc } from './layout.mjs';

export const VSLS = {
  glow: {
    label: 'Gradient bloom — brand-coloured light behind the frame',
    note: 'A soft magenta-to-cyan halo sits behind the video and breathes slowly. Reads expensive because the light appears to come off the screen. Uses both brand colours without putting them on the video itself.',
  },
  glass: {
    label: 'Frosted plate — video inset into a glass slab',
    note: 'The video sits inside a thick frosted panel with a bright inner edge, as though set into the page rather than dropped on it. Matches the nav capsule, so the page reads as one system.',
  },
  cinema: {
    label: 'Cinema — letterboxed, vignetted, thin light frame',
    note: 'Widescreen crop with a vignette and a hairline frame. The most restrained, and the most film-like — it makes the VSL feel like a trailer rather than a web embed.',
  },
  offset: {
    label: 'Offset frame — outlined plate behind the video',
    note: 'A magenta outline sits offset behind the video, the same device as the outline headline. Flat, graphic, and it gives depth with no blur or shadow.',
  },
  spotlight: {
    label: 'Spotlight — everything else falls away',
    note: 'The surrounding hero darkens sharply and a radial bloom isolates the video. The most dramatic; it makes the VSL unmistakably the thing to look at.',
  },
  bleed: {
    label: 'Full bleed — the video breaks the column',
    note: 'The video runs wider than the text column and past the section edges. Confident and modern, and it gives the footage the most actual pixels.',
  },
};

const soundBadge = () => `
<button type="button" class="vsl-sound absolute bottom-4 right-4 z-20 flex min-h-11 items-center gap-2 rounded-full bg-ink/70 px-4 font-body text-xs font-bold uppercase tracking-[0.15em] text-white backdrop-blur transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
  <svg class="vsl-icon-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M11 5 6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6"/>
  </svg>
  <svg class="vsl-icon-on hidden" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M11 5 6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>
  </svg>
  <span class="vsl-label">Tap for sound</span>
</button>`;

// The Wistia container. videoFoam makes it fill whatever box we put it in.
const player = (c) => `
<div class="wistia_embed wistia_async_${esc(c.home.vsl.wistiaId)} videoFoam=true absolute inset-0 h-full w-full">&nbsp;</div>`;

export const renderVsl = (site, c, key) => {
  const inner = `${player(c)}${soundBadge()}`;

  if (key === 'glow') {
    return `
<div class="relative mx-auto max-w-3xl">
  <div aria-hidden="true" class="vsl-bloom absolute -inset-8 rounded-[2.5rem] opacity-70 blur-3xl"
       style="background:radial-gradient(60% 60% at 30% 30%,#e8208f66,transparent 70%),radial-gradient(60% 60% at 70% 70%,#00b9c666,transparent 70%)"></div>
  <div class="relative aspect-video overflow-hidden rounded-2xl ring-1 ring-white/25 shadow-[0_40px_90px_-40px_rgba(0,0,0,.85)]">${inner}</div>
</div>`;
  }

  if (key === 'glass') {
    return `
<div class="relative mx-auto max-w-3xl rounded-[1.75rem] border border-white/25 p-3 shadow-[0_40px_90px_-40px_rgba(0,0,0,.85)]"
     style="background:rgba(255,255,255,.10);backdrop-filter:blur(24px) saturate(1.5);-webkit-backdrop-filter:blur(24px) saturate(1.5)">
  <div class="relative aspect-video overflow-hidden rounded-[1.25rem] ring-1 ring-white/30">${inner}</div>
</div>`;
  }

  if (key === 'cinema') {
    return `
<div class="relative mx-auto max-w-4xl">
  <div class="relative overflow-hidden ring-1 ring-white/30" style="aspect-ratio:2.39/1">
    <div class="absolute inset-0 [&>div]:h-full [&>div]:w-full">${player(c)}</div>
    <div aria-hidden="true" class="pointer-events-none absolute inset-0"
         style="box-shadow:inset 0 0 140px 40px rgba(0,0,0,.75)"></div>
    ${soundBadge()}
  </div>
  <p class="mt-4 text-center font-body text-[11px] uppercase tracking-[0.35em] text-white/55">${esc(c.home.vsl.title.split('—')[0].trim())}</p>
</div>`;
  }

  if (key === 'offset') {
    return `
<div class="relative mx-auto max-w-3xl">
  <div aria-hidden="true" class="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border-2 border-magenta"></div>
  <div class="relative aspect-video overflow-hidden rounded-2xl bg-ink ring-1 ring-white/25">${inner}</div>
</div>`;
  }

  if (key === 'spotlight') {
    return `
<div class="relative mx-auto max-w-3xl">
  <div aria-hidden="true" class="absolute -inset-24 -z-10"
       style="background:radial-gradient(50% 50% at 50% 50%,rgba(255,255,255,.16),transparent 70%)"></div>
  <div class="relative aspect-video overflow-hidden rounded-xl shadow-[0_0_120px_-10px_rgba(232,32,143,.45),0_50px_100px_-40px_rgba(0,0,0,.9)] ring-1 ring-white/20">${inner}</div>
</div>`;
  }

  // bleed
  return `
<div class="relative w-screen max-w-none" style="left:50%;transform:translateX(-50%)">
  <div class="relative mx-auto aspect-video max-w-6xl overflow-hidden ring-1 ring-white/15 sm:rounded-xl">${inner}</div>
</div>`;
};
