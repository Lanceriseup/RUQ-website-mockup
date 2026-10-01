# RUQ Mockups — Asset Generation Brief

Production spec for every image and video slot in the mockups. Each entry gives
the **slot** it fills, the **output spec** it must hit, a **full prompt**, a
**negative prompt**, and **per-generator parameters**.

Supersedes the sketch prompts in `bg-prompts.md`, which stay valid for
background plates only.

---

## 0 · How to read an entry

| Line | Means |
|---|---|
| **Slot** | Where it lands in the build — filename and the component that uses it |
| **Native** | The pixel size I need delivered. Generate at this or larger, never smaller |
| **Ratio** | Aspect ratio. If your generator can't hit it, use the fallback and I'll crop |
| **Budget** | Max file size after my optimisation pass. Informational — send full quality |
| **Clear zone** | The region that must stay low-detail because type or UI sits on it |

**Deliver the largest thing your generator makes.** Downscaling is free and I do
it with `sharp`; upscaling is not. Send originals, not exports.

**Colour target across everything:** warm neutral base, skin tones true, no
teal-orange grade. RUQ magenta `#e8208f` and cyan `#00b9c6` should appear only
where the prompt asks for them — never as an overall cast.

---

## 1 · Output spec, all slots

| # | Slot | File | Native | Ratio | Format | Budget |
|---|---|---|---|---|---|---|
| A1–A4 | Floating cut-outs | `cutout-1..4.png` | 1400 × 2100 | 2:3 | **PNG, alpha** | 260 KB ea. |
| B1 | Two women talking | `close-talk.jpg` | 2400 × 1600 | 3:2 | JPEG | 120 KB |
| B2 | Raised hands, worship | `close-hands.jpg` | 1800 × 2250 | 4:5 | JPEG | 110 KB |
| B3 | Mid-laugh portrait | `close-laugh.jpg` | 1800 × 2250 | 4:5 | JPEG | 110 KB |
| B4 | Small group, seated | `close-group.jpg` | 2400 × 1600 | 3:2 | JPEG | 120 KB |
| C1 | Sky plate, desktop | `sky-wide.jpg` | 2560 × 1440 | 16:9 | JPEG | 180 KB |
| C2 | Sky plate, mobile | `sky-tall.jpg` | 1200 × 2133 | 9:16 | JPEG | 140 KB |
| D1 | Sky loop, desktop | `sky-loop.mp4` | 1920 × 1080 | 16:9 | H.264 MP4 | **3 MB** |
| D2 | Room loop | `room-loop.mp4` | 1920 × 1080 | 16:9 | H.264 MP4 | **3 MB** |
| E1 | Jessica, studio portrait | `jessica-studio.jpg` | 1600 × 2000 | 4:5 | JPEG | 130 KB |

Send me the raw files into `src/assets/photos/` (or anywhere — just tell me
where) and I'll run the resize, crop and compression pass.

---

# A · Floating cut-outs — highest impact

Air floats objects in its sky. Without transparent PNGs I can only lay flat
rectangles on the gradient, which is exactly why the first pass looked plain.
**These four assets unlock the whole direction.**

Generate **four separate women** — vary age, ethnicity and build. The room in
your existing photos is genuinely diverse and the mockup should show that.

### Critical for a clean cut-out

Background removal fails at hair edges. Two things prevent it:

1. **Hair down but smooth** — no flyaway wisps, no backlit halo, no wind
2. **Rim light separating subject from background** — a hard edge to cut along

Both are written into the prompt below. Don't drop them.

---

### A1 · Confident, arms folded

**Slot:** `cutout-1.png` → floats right of the hero headline
**Native:** 1400 × 2100 · **Ratio:** 2:3 · **PNG with alpha**

```
Full-length studio photograph of a confident woman in her late thirties, warm
genuine smile with eyes engaged with the camera, arms loosely folded, weight on
one hip, relaxed and open posture. Wearing an elegant cream silk blouse and
soft blush wide-leg trousers, minimal gold jewellery. Hair worn down, smooth and
controlled with no flyaway strands. Photographed head to mid-calf, full body in
frame with even margin above and below. Lit with a large softbox key at 45
degrees camera left about one metre from subject, a white bounce fill camera
right at a 1:2 ratio so shadows stay open, and a hard rim light behind camera
right separating her hair and shoulder cleanly from the background. Flat evenly
lit seamless pale grey studio backdrop with no gradient, no vignette and no
shadow cast onto it. Shot on a Canon EOS R5 with an 85mm lens at f/5.6, ISO 100,
tack sharp from head to foot, photorealistic, natural skin texture with visible
pores, neutral colour balance, true skin tones.
```

**Negative:** `blurred edges, motion blur, hair flyaways, wind, backlit halo, shadow on backdrop, gradient background, busy background, props, furniture, text, watermark, logo, cropped limbs, extra fingers, deformed hands, distorted face, plastic skin, waxy skin, oversaturated, heavy retouching, teal and orange grade`

| Generator | Parameters |
|---|---|
| **Midjourney v7** | `--ar 2:3 --style raw --s 150 --chaos 4 --q 2` |
| **Gemini / Nano Banana** | Paste prompt, then: *"Portrait orientation, 2:3 aspect ratio, highest resolution available. Plain flat light grey background for clean background removal."* |
| **GPT Image** | `size: 1024x1536`, `quality: high` — then upscale to 1400 × 2100 |
| **Flux 1.1 Pro** | `aspect_ratio: 2:3`, `guidance: 3.0`, `steps: 40`, `raw: true` |

---

### A2 · Mid-stride, joyful

**Slot:** `cutout-2.png` → lower-left of the pillars block
**Native:** 1400 × 2100 · **Ratio:** 2:3 · **PNG with alpha**

```
Full-length studio photograph of a Black woman in her late twenties caught
mid-stride walking toward camera, laughing openly with her head slightly turned,
one hand lifted lightly at waist height. Wearing a flowing white midi dress with
soft movement in the hem and simple tan sandals. Natural coil hair styled close
and defined with a clean silhouette and no loose strands. Photographed head to
ankles, full body in frame. Lit with a large softbox key at 45 degrees camera
right, silver bounce fill camera left at a 1:2 ratio, and a hard rim light from
behind camera left cleanly separating her hair and arm from the background.
Flat evenly lit seamless pale grey studio backdrop, no gradient, no vignette, no
shadow cast onto the backdrop. Shot on a Canon EOS R5 with an 85mm lens at
f/5.6, ISO 100, sharp throughout with no motion blur, photorealistic, natural
skin texture, neutral colour balance, true skin tones.
```

**Negative:** same as A1, plus `frozen awkward pose, floating feet, tilted horizon`

**Parameters:** as A1.

---

### A3 · Seated, hands in lap

**Slot:** `cutout-3.png` → beside the founder card
**Native:** 1400 × 2100 · **Ratio:** 2:3 · **PNG with alpha**

```
Full-length studio photograph of a Latina woman in her mid forties seated on a
simple pale wooden stool, back straight, hands resting together in her lap,
calm warm half-smile looking slightly off camera to the left. Wearing a soft
dusty rose knit sweater and ivory tailored trousers. Shoulder-length dark hair
worn smooth with a clean silhouette. Full body visible including the stool and
both feet flat on the floor. Lit with a large softbox key at 45 degrees camera
left, white bounce fill camera right at a 1:2 ratio, hard rim light behind
camera right separating hair and shoulder from the background. Flat evenly lit
seamless pale grey studio backdrop, no gradient, no shadow on the backdrop.
Shot on a Canon EOS R5 with an 85mm lens at f/5.6, ISO 100, tack sharp,
photorealistic, natural skin texture, neutral colour balance, true skin tones.
```

**Negative:** as A1, plus `ornate chair, patterned upholstery, cluttered props`

---

### A4 · Three-quarter, hands open

**Slot:** `cutout-4.png` → the closing CTA
**Native:** 1400 × 2100 · **Ratio:** 2:3 · **PNG with alpha**

```
Three-quarter-length studio photograph of an Asian woman in her early fifties
turned slightly away from camera and looking back over her shoulder, serene
confident expression, both hands open and relaxed at her sides with palms
slightly forward. Wearing a soft white linen shirt and light grey trousers,
sleeves rolled to the forearm. Hair in a smooth low bun with a clean silhouette.
Photographed head to mid-thigh. Lit with a large softbox key at 45 degrees
camera right, white bounce fill camera left at a 1:2 ratio, hard rim light from
behind camera left separating her shoulder and jaw from the background. Flat
evenly lit seamless pale grey studio backdrop, no gradient, no shadow on the
backdrop. Shot on a Canon EOS R5 with an 85mm lens at f/5.6, ISO 100, tack
sharp, photorealistic, natural skin texture, neutral colour balance.
```

**Negative:** as A1.

### After generating A1–A4

Remove the background before sending, or send as-is and say so. Options that
handle hair well: **remove.bg**, Photoshop *Select Subject → Refine Hair*,
Canva *BG Remover*, or Affinity *Selection Brush*. Export **PNG-24 with alpha**,
not PNG-8, or the edges will fringe.

---

# B · Close-up emotional moments

Your library is nine photographs and nearly all of them are wide shots of a full
room. These four fix the gap — the page needs faces and hands, not crowds.

All four are **documentary style, not studio**. They should look shot at a real
event, not art-directed.

---

### B1 · Two women talking

**Slot:** `close-talk.jpg` → pillar 2, "Reignite Love & Intimacy"
**Native:** 2400 × 1600 · **Ratio:** 3:2 · **Clear zone:** none, used full-bleed in a card

```
Candid documentary photograph of two women in their forties sitting close
together on upholstered conference chairs, turned toward each other in intent
conversation. One rests a hand gently on the other's forearm; the other listens
with her head tilted, eyes glistening. Both are mid-emotion, unposed and
unaware of the camera. Soft diffused daylight falling from a large window to
camera left, warm neutral tones, no colour cast. Background is an out-of-focus
hotel conference room with warm bokeh from ceiling lights. Shot on a Sony A7 IV
with an 85mm lens at f/1.8, ISO 640, focus on the listening woman's eyes,
shallow depth of field with the background falling away softly. Photojournalism,
natural skin texture, no retouching, Kodak Portra 400 colour rendering, fine
grain.
```

**Negative:** `posed, looking at camera, smiling for the camera, stock photo, studio lighting, flash, harsh shadows, text, watermark, logo, deformed hands, extra fingers, distorted faces, plastic skin, oversaturated, HDR, teal and orange grade, cluttered foreground`

| Generator | Parameters |
|---|---|
| **Midjourney v7** | `--ar 3:2 --style raw --s 250 --chaos 10 --q 2` |
| **Gemini / Nano Banana** | Paste, then: *"Landscape 3:2, highest resolution. Documentary photojournalism, not a stock photo. Subjects unaware of camera."* |
| **GPT Image** | `size: 1536x1024`, `quality: high` |
| **Flux 1.1 Pro** | `aspect_ratio: 3:2`, `guidance: 2.5`, `steps: 40`, `raw: true` |

---

### B2 · Raised hands, worship

**Slot:** `close-hands.jpg` → pillar 1, "Rediscover Your True Identity"
**Native:** 1800 × 2250 · **Ratio:** 4:5

```
Candid documentary photograph shot from slightly behind and below of a woman's
two raised open hands in a moment of worship, fingers relaxed and slightly
apart, forearms entering frame from the bottom edge. Warm stage light from above
and behind rakes across her fingers and catches the edge of her hair, creating a
soft glow. Her face is not visible. Beyond her, a deeply out-of-focus crowd of
standing figures with warm bokeh highlights. Dim room, single warm key source,
deep soft shadows with detail retained. Shot on a Sony A7 IV with a 50mm lens at
f/1.4, ISO 2000, focus on the fingertips, extremely shallow depth of field.
Photojournalism, natural grain from the high ISO, Kodak Portra 800 colour
rendering, warm neutral tones, no colour cast.
```

**Negative:** `faces visible, identifiable people, posed, studio lighting, flash, text, watermark, logo, deformed hands, extra fingers, six fingers, fused fingers, plastic skin, oversaturated, HDR, religious iconography, crosses, stained glass`

| Generator | Parameters |
|---|---|
| **Midjourney v7** | `--ar 4:5 --style raw --s 200 --chaos 8 --q 2` |
| **Gemini / Nano Banana** | Paste, then: *"Portrait 4:5, highest resolution. Hands must be anatomically correct — exactly five fingers per hand. No faces visible."* |
| **GPT Image** | `size: 1024x1536`, `quality: high` |
| **Flux 1.1 Pro** | `aspect_ratio: 4:5`, `guidance: 2.5`, `steps: 45`, `raw: true` |

> **Watch the hands.** This is the single most likely generation to fail — count
> the fingers before you send it. Generate 4 variants and pick.

---

### B3 · Mid-laugh portrait

**Slot:** `close-laugh.jpg` → pillar 3, "Live with Lasting Freedom & Passion"
**Native:** 1800 × 2250 · **Ratio:** 4:5

```
Candid documentary photograph of a woman in her thirties caught mid-laugh, head
tipped slightly back, eyes crinkled almost closed, one hand half-raised toward
her chest, completely unguarded genuine joy. Photographed from chest up. Soft
warm afternoon light from a window to camera right wraps across her cheek and
catches loose strands of hair. Background is a deeply out-of-focus indoor event
space in warm neutral tones. Shot on a Sony A7 IV with an 85mm lens at f/1.4,
ISO 400, focus on her near eye, very shallow depth of field. Photojournalism,
natural skin texture with visible pores and fine lines, no retouching, Kodak
Portra 400 colour rendering, fine grain, true skin tones.
```

**Negative:** `posed smile, looking at camera, stock photo, studio lighting, flash, beauty retouching, airbrushed skin, plastic skin, text, watermark, logo, deformed teeth, distorted face, oversaturated, HDR, teal and orange grade`

**Parameters:** as B2.

---

### B4 · Small group, seated

**Slot:** `close-group.jpg` → The Event page gallery
**Native:** 2400 × 1600 · **Ratio:** 3:2

```
Candid documentary photograph of five women of mixed ages and ethnicities seated
in a loose circle on conference chairs, leaning in toward one another, one
speaking with her hands while the others listen intently. Notebooks and paper
coffee cups rest on the floor between them. Soft diffused daylight from large
windows camera left, warm neutral tones. Shot from standing height slightly
above the group on a Sony A7 IV with a 35mm lens at f/2.8, ISO 500, focus on the
speaking woman, moderate depth of field so all five read clearly with the room
falling away behind. Photojournalism, natural skin texture, no retouching,
Kodak Portra 400 colour rendering, fine grain.
```

**Negative:** `posed group photo, everyone looking at camera, arranged symmetrically, stock photo, studio lighting, flash, text, watermark, logo, deformed hands, extra limbs, distorted faces, plastic skin, oversaturated, HDR, empty chairs, clutter`

**Parameters:** as B1.

---

# C · Sky plates — optional

I build the sky in CSS and it holds up well. Generate these only if you want a
photographic atmosphere instead.

### C1 · Sky, desktop

**Slot:** `sky-wide.jpg` → full-page fixed background
**Native:** 2560 × 1440 · **Ratio:** 16:9 · **Clear zone:** the middle band stays smooth

```
Wide-format atmospheric sky photograph shot at golden hour looking upward with
no ground and no horizon line. Deep turquoise and pale cyan occupy the top
quarter, transitioning through a broad band of soft luminous white haze across
the middle, then warming into pale rose pink and deeper magenta toward the
bottom edge. Delicate wispy cirrus cloud texture catches light at the edges of
each band. No sun disc visible, no lens flare, no birds, no aircraft. Extremely
smooth continuous gradient with no banding. Shot on a Hasselblad medium format
camera at f/8, ISO 100, dreamy luminous atmosphere, fine film grain, Kodak
Ektar 100 colour rendering.
```

**Negative:** `horizon, ground, buildings, trees, mountains, sun, lens flare, birds, aircraft, banding, posterisation, colour steps, text, watermark, vignette, dark corners, storm clouds, dramatic contrast`

| Generator | Parameters |
|---|---|
| **Midjourney v7** | `--ar 16:9 --style raw --s 300 --chaos 5 --q 2` |
| **Gemini / Nano Banana** | Paste, then: *"Landscape 16:9, highest resolution. Perfectly smooth gradient, absolutely no colour banding."* |
| **GPT Image** | `size: 1536x1024`, `quality: high` |
| **Flux 1.1 Pro** | `aspect_ratio: 16:9`, `guidance: 3.5`, `steps: 50` |

### C2 · Sky, mobile

**Slot:** `sky-tall.jpg` · **Native:** 1200 × 2133 · **Ratio:** 9:16

Same prompt, but replace the first sentence with:

```
Tall vertical atmospheric sky photograph shot at golden hour looking upward with
no ground and no horizon line, composed so the turquoise-to-rose transition runs
the full height of the frame.
```

**Parameters:** `--ar 9:16` / `size: 1024x1536` / `aspect_ratio: 9:16`.

> **Do not crop C2 out of C1.** The gradient bands sit at different heights and
> the headline would land on texture instead of haze.

---

# D · Video loops

For **Higgsfield, Runway Gen-3, Kling or Luma**. Feed the matching still in as
the first frame, then use the motion prompt.

**Non-negotiable specs:** 5 seconds · seamless loop · **locked-off camera** ·
1920 × 1080 · H.264 MP4 · no audio · **under 3 MB**.

Background video that pans fights the copy sitting on it. Every prompt below
forbids camera movement.

### D1 · Sky loop

**Slot:** `sky-loop.mp4` → behind the hero, replacing the CSS gradient
**First frame:** C1

```
Wispy cirrus clouds drift slowly and continuously upward through the frame,
almost imperceptibly. The luminous haze band brightens and dims very gently as
if the light source behind it is breathing. Camera completely static, locked
off on a tripod. No pan, no tilt, no zoom, no parallax. Extremely slow, serene,
hypnotic, seamless loop where the final frame matches the first.
```

**Negative:** `camera pan, camera tilt, camera zoom, camera shake, dolly, parallax, rack focus, fast motion, morphing, warping, flickering, colour shift, text, watermark, birds, aircraft`

### D2 · Room loop

**Slot:** `room-loop.mp4` → The Event page header
**First frame:** B4, or your existing `queens-waving.jpg`

```
A room full of seated women, filmed from the back. Very subtle natural movement
only — shoulders shifting, heads turning slightly, a hand rising somewhere in
the crowd. Warm stage light holds steady. Camera completely static, locked off
on a tripod. No pan, no tilt, no zoom. Slow, ambient, observational, seamless
loop where the final frame matches the first.
```

**Negative:** as D1, plus `people standing up, people leaving, fast movement, morphing faces, warping bodies, extra limbs`

### Encoding, once you have the raw file

```bash
ffmpeg -i raw.mp4 -an -c:v libx264 -crf 30 -preset slow \
  -pix_fmt yuv420p -g 60 -vf scale=1920:-2 -movflags +faststart sky-loop.mp4
```

`-an` strips audio (it's never heard), `+faststart` moves the index to the front
so playback begins immediately. Your old 127 MB `.mov` failed precisely because
it lacked faststart — the note is already in `site.json`.

---

# E · Jessica, studio portrait

Right now I'm using her event headshot, which is the best available but was not
shot for this. A proper portrait would lift the founder block on both mockups.

**This is a real person — generate nothing.** Brief it to a photographer, or
shoot it. Spec so it matches everything above:

**Slot:** `jessica-studio.jpg` · **Native:** 1600 × 2000 · **Ratio:** 4:5

- **Framing:** chest up, eyes on the upper third line, looking directly to camera
- **Expression:** warm, settled, a half-smile — not a broad grin
- **Wardrobe:** solid cream, ivory or dusty rose. No patterns, no logos, no black
- **Lighting:** large softbox key 45° camera left, white bounce fill camera right
  at 1:2, subtle hair light behind. Soft, open shadows
- **Background:** flat mid-grey or warm off-white seamless, evenly lit
- **Lens:** 85mm at f/4, ISO 100, focus on the near eye
- **Delivery:** RAW plus a 16-bit TIFF, minimal retouching — keep skin texture
- **Also shoot:** one frame on a plain white sweep for a cut-out, hair smooth,
  with a rim light for edge separation

---

# F · Generator cheat sheet

| | Native ratios | Max resolution | Best for here |
|---|---|---|---|
| **Midjourney v7** | Any | ~2048px, 4× upscale | B-series documentary, C skies |
| **Gemini / Nano Banana** | 1:1, 3:4, 4:3, 9:16, 16:9 | ~2048px | A cut-outs, editing and retries |
| **GPT Image** | 1024², 1024×1536, 1536×1024 | 1536px | Prompt adherence; needs upscaling |
| **Flux 1.1 Pro** | Any | 2048px+ | Skin texture, most photoreal |

**If your generator can't hit the ratio:** take the nearest one *wider* than the
target and I'll crop. Never take one narrower — I'd have to invent edges.

**Always generate 4 variants and pick.** Especially anything with hands.

---

# G · Delivery checklist

- [ ] A1–A4 are **PNG-24 with alpha**, background actually removed, hair edges clean
- [ ] Four different women across A1–A4 — age, ethnicity, build
- [ ] Every hand in frame has exactly five fingers *(check B2 twice)*
- [ ] No generated text, letterforms, logos or watermarks anywhere
- [ ] Skin looks like skin — pores and fine lines, not airbrushed plastic
- [ ] C2 generated separately, not cropped from C1
- [ ] Videos are ≤ 3 MB, locked-off, and loop without a visible seam
- [ ] Files dropped in `src/assets/photos/` (or tell me where they are)

Send them over and I'll do the resize, crop, compression and swap-in.
