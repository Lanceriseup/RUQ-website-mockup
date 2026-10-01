// About — "event lights", the background behind "Who is it for?" and the
// journey. Chosen from /about-bg-options.html (C2).
//
// Soft out-of-focus circles of pink, teal and warm gold drifting upward, like
// stage lights and balloons through a lens at the event. One layer spans both
// sections so they read as one band; it fades in and out at its ends (mask),
// so it never starts or stops on a line.
//
// It is rendered first in the journey panel's opening slot, so it paints
// under the founder, who-for and journey content that follow it. Its top and
// height are measured by app.js — from just above #whofor to the closing
// CTA — because those sections are not one element. Without script it simply
// has no height: purely decorative, nothing depends on it.
//
// The scatter is seeded, so every build draws the same field. Styles are
// .al-* in tailwind.css; reduced motion holds the lights still.

const COLOURS = ['232,32,143', '0,185,198', '228,190,120', '240,86,159'];

export const aboutLights = (count = 26) => {
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  let dots = '';
  for (let i = 0; i < count; i++) {
    const size = Math.round(24 + rnd() * 130);
    const x = (rnd() * 100).toFixed(1), y = (rnd() * 100).toFixed(1);
    const c = COLOURS[i % COLOURS.length];
    const a = 0.16 + rnd() * 0.22;
    const dur = (14 + rnd() * 16).toFixed(1), delay = (-rnd() * 20).toFixed(1);
    dots += `<i style="left:${x}%;top:${y}%;width:${size}px;height:${size}px;`
      + `background:radial-gradient(circle,rgba(${c},${a.toFixed(2)}) 0%,rgba(${c},${(a / 2).toFixed(2)}) 45%,transparent 70%);`
      + `animation-duration:${dur}s;animation-delay:${delay}s"></i>`;
  }
  return `<div class="al" data-al aria-hidden="true">${dots}</div>`;
};
