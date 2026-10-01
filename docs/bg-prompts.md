# RUQ — Background Image Prompts

Generated backgrounds for three mockup directions. Portable phrasing — works in
Midjourney, Flux, Ideogram, Nano Banana, Higgsfield, SDXL. Optional Midjourney
params sit on their own line; delete them for other tools.

**Brand:** magenta `#e8208f` · cyan `#00b9c6` · white · ink `#1c1c1c`
**Type:** Montserrat (display) / Lato (body)
**Subject:** Rise Up Queens — faith-based women's empowerment, events, coaching

---

## How to use these

Every prompt below is a *background*. Text goes on top of it. Three rules make
the difference between a usable background and a pretty image you can't set type
on:

1. **Clear zone.** Each prompt names a low-detail region where the headline
   lands. Without this you get gorgeous images that fight the copy.
2. **Value range.** Backgrounds for white text are specified dark (roughly 0–35%
   luminance). Backgrounds for dark text are specified light (75–100%). That is
   what keeps contrast passing.
3. **No letterforms.** Generators love inventing text. The negative prompt kills
   it.

Generate **two ratios** for every hero: `16:9` desktop and `9:16` mobile. Do not
crop one from the other — the clear zone moves.

**Universal negative** (append to all): `text, letters, words, typography,
watermark, signature, logo, borders, frame, collage, split panels, extra limbs,
distorted hands, deformed faces, plastic skin, oversaturated, HDR halos,
stock-photo cliche, low resolution, jpeg artifacts`

---

# Direction A — "Cathedral Light"

**Feel:** cinematic, reverent, dark. Light is the hero. Brand colours appear as
*light sources* — a magenta shaft, a cyan rim — never as flat fills.

**Why it might win:** every women's-ministry site is bright and pastel. Going
dark and cinematic reads as serious and expensive, and it makes the magenta hit.

### A1 · Homepage hero
**Ratio:** 16:9 + 9:16 · **Text:** white

```
Vast dark interior space, volumetric shafts of light falling from high windows at
a steep angle, fine dust and haze suspended in the beams, deep charcoal and
near-black atmosphere, a single warm magenta-pink glow bleeding in from the far
right edge and a faint turquoise-cyan rim light on the left, cathedral scale but
abstract and architectural with no recognisable religious iconography, empty
floor, immense negative space through the centre-left, cinematic anamorphic
photography, 35mm, shallow depth of field, soft film grain, muted contrast,
shadows lifted slightly so detail survives in the blacks
```

**Clear zone:** centre-left, empty haze — headline and CTA sit here.
**MJ:** `--ar 16:9 --style raw --s 250 --chaos 8`

### A2 · Section background (testimonials / faith)
**Ratio:** 16:9 · **Text:** white

```
Extreme close-up of dark fabric catching a single raking light, deep folds
running diagonally, near-black velvet with a subtle sheen, faint magenta-pink
colour temperature in the highlights only, the lower two-thirds falling into pure
shadow, macro photography, natural light, heavy soft grain, no pattern, no print,
minimal and abstract
```

**Clear zone:** lower two-thirds, in shadow.
**MJ:** `--ar 16:9 --style raw --s 150`

### A3 · CTA band
**Ratio:** 21:9 · **Text:** white, centred

```
Abstract gradient of deep ink black transitioning into a rich magenta-pink glow
rising from the bottom edge like distant city light on a night sky, a thin band
of turquoise-cyan where the two meet, extremely smooth falloff, no objects, no
horizon line, subtle vertical light streaks, fine analogue grain across the whole
frame, dark and moody, centre of frame kept flat and even
```

**Clear zone:** centre, flat by design.
**MJ:** `--ar 21:9 --s 100 --chaos 4`

### A4 · Tileable texture (cards, nav, footer)
**Ratio:** 1:1 · seamless

```
Seamless tileable texture, matte black paper with very fine fibre grain, almost
imperceptible, lit evenly with no hotspots, subtle tonal variation only, extreme
close-up, flat lay, no pattern, no motif, no visible edges or seams
```

**MJ:** `--ar 1:1 --tile --s 50`

---

# Direction B — "Editorial Bloom"

**Feel:** bright, airy, print-magazine. Paper white, enormous margins, organic
botanical forms abstracted almost to pure colour. Magenta used once per screen.

**Why it might win:** it reads *premium* rather than *church craft night*. Closest
to a fashion editorial, which flatters the photography you already have.

### B1 · Homepage hero
**Ratio:** 16:9 + 9:16 · **Text:** ink

```
Soft-focus botanical abstraction on a warm off-white paper background, a single
out-of-focus magenta-pink peony bloom entering from the far right edge, petals
blown out to near-white where the light catches, a delicate shadow falling left
across the paper, seventy percent of the frame is empty warm white space, natural
window light from the right, shot on medium format film, gentle grain, very low
contrast, pale and luminous, nothing at all in the left half of the frame
```

**Clear zone:** left 60% — pure paper.
**MJ:** `--ar 16:9 --style raw --s 400 --chaos 6`

### B2 · Section background (about / story)
**Ratio:** 3:2 · **Text:** ink

```
Torn edge of thick cotton watercolour paper laid on warm cream, raw deckled
fibres visible along one diagonal edge, a wash of pale turquoise-cyan watercolour
bleeding softly into the fibres at the top corner and fading to nothing, overhead
flat lay, diffuse north light, no props, no hands, no tools, gentle paper texture
across the whole surface, generous empty space
```

**Clear zone:** everything below the diagonal.
**MJ:** `--ar 3:2 --style raw --s 300`

### B3 · Pull-quote / divider
**Ratio:** 16:9 · **Text:** ink

```
Extremely minimal abstract still life, a length of blush silk ribbon resting in a
single soft curve on a warm white surface, shallow depth of field so both ends
fall out of focus, one small area of saturated magenta-pink where the fabric
folds on itself, everything else pale and desaturated, overhead natural light,
long soft shadow, vast empty space around the subject, editorial minimalism
```

**Clear zone:** upper-left quadrant.
**MJ:** `--ar 16:9 --style raw --s 250`

### B4 · Tileable texture
**Ratio:** 1:1 · seamless

```
Seamless tileable texture, warm off-white handmade cotton paper, visible fibre
inclusions and a soft cold-press tooth, lit perfectly evenly, no shadows, no
visible edges, very subtle, scanned at high resolution
```

**MJ:** `--ar 1:1 --tile --s 50`

---

# Direction C — "Kinetic Crown"

**Feel:** loud, graphic, poster-like. High-contrast duotone, halftone dots,
gradient mesh, motion blur. Energy over elegance.

**Why it might win:** it is the only one that feels like a *movement* rather than
a brochure — and it scales to Instagram assets for free.

### C1 · Homepage hero
**Ratio:** 16:9 + 9:16 · **Text:** white

```
Bold graphic duotone treatment of a crowd of raised hands photographed from
below, rendered entirely in two colours — hot magenta-pink in the shadows and
electric turquoise-cyan in the highlights with no intermediate tones, heavy
halftone dot pattern visible through the midtones like screen-printed poster art,
strong motion blur at the outer edges of the frame, silhouettes only with no
facial detail, the upper third fading to flat solid magenta, high contrast,
risograph print texture, slight ink misregistration
```

**Clear zone:** upper third, flat magenta.
**MJ:** `--ar 16:9 --s 300 --chaos 15`

### C2 · Section background
**Ratio:** 16:9 · **Text:** white

```
Abstract gradient mesh, liquid blend of hot magenta-pink, deep violet and
turquoise-cyan flowing diagonally across the frame, smooth continuous colour
transitions with no banding, soft focus blur, a fine layer of monochrome noise
over the top, dark ink-black vignette in the lower left corner, no shapes, no
objects, pure colour field
```

**Clear zone:** lower-left, darkened.
**MJ:** `--ar 16:9 --s 200`

### C3 · CTA band
**Ratio:** 21:9 · **Text:** white

```
Dense field of halftone dots in hot magenta-pink on a flat ink-black background,
dots scaling smoothly from large and sparse on the left to tiny and dense on the
right, creating a directional gradient, screen-print texture with slight ink
bleed, completely flat and graphic, no depth, no lighting, no objects
```

**Clear zone:** left half, sparse.
**MJ:** `--ar 21:9 --s 100`

### C4 · Tileable texture
**Ratio:** 1:1 · seamless

```
Seamless tileable risograph paper texture, flat ink-black with visible newsprint
grain and faint magenta-pink ink misregistration speckle, evenly lit, no seams,
no pattern motif, subtle
```

**MJ:** `--ar 1:1 --tile --s 50`

---

# Motion versions

Each hero has a matching loop for Higgsfield / Runway / Kling. Feed the still in
as the first frame, then use the motion prompt. Keep it **5 seconds, seamless
loop, locked-off camera** — background video that pans is background video that
fights the copy.

| # | Motion prompt |
|---|---|
| **A1** | `Dust motes drift slowly through the light shafts, the beams breathe almost imperceptibly brighter and dimmer, camera completely static, no subject movement, extremely slow, hypnotic` |
| **B1** | `The peony petals shift very slightly as if in a faint breeze, the shadow on the paper creeps a few degrees, camera locked off, barely-there movement, serene` |
| **C1** | `The halftone dots pulse and shimmer, the motion blur streaks drift outward from centre, colour boundaries ripple slowly, camera static, rhythmic and looping` |

**Negative for all motion:** `camera pan, camera zoom, camera shake, rack focus,
morphing faces, warping geometry, text, flicker`

---

# Checklist before this goes to the client

- [ ] Generated both 16:9 and 9:16 for every hero
- [ ] Headline sits in the named clear zone, not over detail
- [ ] White text on A/C backgrounds clears 4.5:1 — darken the clear zone if not
- [ ] No invented letterforms anywhere in frame
- [ ] Tileable textures actually tile (butt two copies together and look)
- [ ] Magenta appears **at most twice** per screen — it is an accent, not a theme
