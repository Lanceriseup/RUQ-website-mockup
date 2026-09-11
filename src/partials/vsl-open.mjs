// What happens when the about hero's video starts.
//
// The frame sits at 2.39:1 over a 16:9 source, so 25.6% of the picture is
// hidden behind two letterbox bars of 12.81% each. That is the fact the whole
// set is built on: there is something real to open into, not just a scale to
// apply.
//
// Every option shares one shell so the resting state is identical across all
// six — a 16:9 stage with the bars masking it down to 2.39:1. The poster and
// the player both fill the stage; only the bars decide what you see. What
// differs is what the stage does when `is-playing` lands on it.
//
// The bars animate with transform: scaleY from their outer edge, not height —
// height is a layout property and would reflow the hero on every frame of the
// transition.
//
// All of it is off under prefers-reduced-motion: the stage opens instantly to
// whatever its playing state is, because the point is to see the video, not
// the transition.
export const VSL_OPEN = {
  none: {
    label: 'None — the player just appears',
    note: 'What happens now. Shown for comparison.',
  },
  unfold: {
    label: 'Unfold — the letterbox opens to the full frame',
    note: 'The bars retract over 900ms and the 2.39:1 window becomes the full 16:9. The only option that reveals something rather than moving something: a quarter of the picture is genuinely hidden at rest and this is what gives it back. Also the only one whose end state is a different shape from its start.',
  },
  swell: {
    label: 'Swell — the frame grows and the bloom rises with it',
    note: 'The frame scales from 1 to 1.05 while the cyan bloom behind it brightens and spreads. Stays letterboxed throughout, so the shape never changes — the gentlest of the six and the only one that touches the light around the frame.',
  },
  widen: {
    label: 'Widen — the frame outgrows its column',
    note: 'The stage expands from the hero column out to a wider measure over a second, so the video ends up bigger than anything else on the page. The most literal reading of “expanding”, and the one that makes the most of a long interview.',
  },
  dim: {
    label: 'Dim — everything else steps back',
    note: 'The headline, the CTA and the dates fade to a third while the frame lifts on a deeper shadow. Nothing about the video changes size; the page gets out of its way instead. Closest to a cinema going dark.',
  },
  iris: {
    label: 'Iris — the player opens from the middle',
    note: 'A circular reveal expands from where the play button was until it covers the frame. The most obviously an effect of the six, and the only one that draws attention to the click rather than to the video.',
  },
};

export const UNFOLD_FEEL = {
  snap: {
    label: 'Snap — 0.9s, fast start',
    note: 'The original timing. Expo-out: most of the movement happens in the first third, then it decelerates hard. Quick, and the one that reads as abrupt.',
  },
  gentle: {
    label: 'Gentle — 1.4s, even',
    note: 'A symmetric ease over half again the time. Eases in as well as out, so there is no sudden start — that is usually what is missing when an animation feels rough rather than slow.',
  },
  glide: {
    label: 'Glide — 1.8s, long soft landing',
    note: 'Starts promptly and spends most of the time arriving. The frame appears to settle into place rather than stop. Softest of the four.',
  },
  slow: {
    label: 'Slow — 2.4s, deliberate',
    note: 'Nearly three times the original, eased at both ends. Unmistakably an unfolding. Long enough that a visitor may look away before it finishes.',
  },
};

export const stageClass = (key, feel) =>
  `vsl-stage vsl-fx-${key || 'none'}${feel ? ' vsl-ease-' + feel : ''}`;

// The stage. The frame is a percentage-padding box, so its height is a ratio
// of its own width and nothing else — 41.84% is 1/2.39, which is exactly the
// shape the button had before any of this existed. Nothing is painted over the
// picture: the poster is object-cover inside the frame, so a 16:9 source is
// cropped to 2.39:1 the same way it always was.
//
// This replaces a first attempt that made the stage 16:9 and masked it down
// with two solid bars. That was wrong twice over — the element became 25.6%
// taller than it had been, and the crop became paint, so the bars were
// visible as bars.
//
// padding-bottom rather than aspect-ratio because it is the property that
// opens: percentage padding transitions everywhere, and aspect-ratio only
// interpolates in Chrome 117+, Safari 17.4+ and Firefox 126+.
export const vslStage = (key, inner, feel) => `
<div data-vsl-stage class="${stageClass(key, feel)} relative w-full">
  <div class="vsl-frame relative h-0 w-full overflow-hidden">
    ${inner}
  </div>
</div>`;
