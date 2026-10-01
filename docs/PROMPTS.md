# Asset prompts — one file each

Open a file, copy what it tells you to copy. Nothing else to work out.

Start with **1–4**. Those are the cut-outs, and they unlock the floating-
layer look that the mockup cannot do without them.

| # | File to open | What it is | Save the result as |
|---|---|---|---|
| 01 | [`01-cutout-1.txt`](prompts/01-cutout-1.txt) | Cut-out — confident, arms folded | `cutout-1.png` |
| 02 | [`02-cutout-2.txt`](prompts/02-cutout-2.txt) | Cut-out — mid-stride, joyful | `cutout-2.png` |
| 03 | [`03-cutout-3.txt`](prompts/03-cutout-3.txt) | Cut-out — seated, hands in lap | `cutout-3.png` |
| 04 | [`04-cutout-4.txt`](prompts/04-cutout-4.txt) | Cut-out — over the shoulder, hands open | `cutout-4.png` |
| 05 | [`05-close-talk.txt`](prompts/05-close-talk.txt) | Close-up — two women talking | `close-talk.jpg` |
| 06 | [`06-close-hands.txt`](prompts/06-close-hands.txt) | Close-up — raised hands, worship | `close-hands.jpg` |
| 07 | [`07-close-laugh.txt`](prompts/07-close-laugh.txt) | Close-up — mid-laugh portrait | `close-laugh.jpg` |
| 08 | [`08-close-group.txt`](prompts/08-close-group.txt) | Close-up — small group, seated | `close-group.jpg` |
| 09 | [`09-sky-wide.txt`](prompts/09-sky-wide.txt) | Sky plate — desktop | `sky-wide.jpg` |
| 10 | [`10-sky-tall.txt`](prompts/10-sky-tall.txt) | Sky plate — mobile | `sky-tall.jpg` |
| 11 | [`11-sky-loop.txt`](prompts/11-sky-loop.txt) | Video loop — sky | `sky-loop.mp4` |
| 12 | [`12-room-loop.txt`](prompts/12-room-loop.txt) | Video loop — the room | `room-loop.mp4` |
| 13 | [`13-cathedral-wide.txt`](prompts/13-cathedral-wide.txt) | Cathedral Light — hero plate, desktop | `cathedral-wide.jpg` |
| 14 | [`14-cathedral-tall.txt`](prompts/14-cathedral-tall.txt) | Cathedral Light — hero plate, mobile | `cathedral-tall.jpg` |
| 15 | [`15-cathedral-loop.txt`](prompts/15-cathedral-loop.txt) | Cathedral Light — video loop | `cathedral-loop.mp4` |
| 16 | [`16-illo-hero.txt`](prompts/16-illo-hero.txt) | Illustration — hero group | `illo-hero.png` |
| 17 | [`17-illo-pray.txt`](prompts/17-illo-pray.txt) | Illustration — hands together, praying | `illo-pray.png` |
| 18 | [`18-illo-talk.txt`](prompts/18-illo-talk.txt) | Illustration — two women talking | `illo-talk.png` |
| 19 | [`19-illo-celebrate.txt`](prompts/19-illo-celebrate.txt) | Illustration — celebrating, arms up | `illo-celebrate.png` |
| 20 | [`20-illo-walk.txt`](prompts/20-illo-walk.txt) | Illustration — walking forward | `illo-walk.png` |

## Mockup 3 — Storybook

Assets **16–20** are flat paper-cut illustrations for the cream direction.
Drop them in `src/assets/illustrations/`.

These need **no background removal**. They are generated on a flat cream field
and keyed out in code, so send them exactly as the generator produces them.

## Mockup 1 — Midnight

Assets **13–15** belong to the dark direction only. Drop the two stills in
`src/assets/photos/` and the loop in `src/assets/video/`.

No cut-outs for this one — people floating in a void would blur the line
between the two directions, and they read as distinct ideas when one is
people-in-sky and the other is type-and-void.

## Priority

| Do these | Why |
|---|---|
| **1–4** first | Cut-outs. Without them I can only lay flat rectangles on the sky — this is why the first version looked plain. |
| **5–8** next | Close-ups. Your nine existing photos are all wide room shots; the page needs faces and hands. |
| **9–10** optional | Sky plates. I already build the sky in CSS and it holds up. |
| **11–12** last | Video loops. Only once the stills are settled. |

## Where to put them

Drop the finished files in `src/assets/photos/` and tell me. I run the
resize, crop and compression pass, then swap them into the mockups.

## One thing I will not generate

A portrait of Jessica. She is a real person and a synthetic likeness of your
founder would be the wrong call. `asset-brief.md` has a photographer brief
for that shot instead — framing, wardrobe, lighting ratio, lens, delivery.
