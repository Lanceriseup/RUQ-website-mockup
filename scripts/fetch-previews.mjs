// Looks up a preview MP4 for every homepage testimonial and writes
// src/data/video-previews.json, which the "centre stage" rails read.
//
// Run with `npm run previews` when a testimonial is added or replaced — like
// fetch-posters.mjs, it is deliberately not part of the build, so a build
// never depends on the network.
//
// Source: Wistia's public media JSON (fast.wistia.com/embed/medias/<id>.json),
// the same endpoint its own player reads. `url` is the 640px rendition, which
// covers the 230px card at 2x+; `small` is the 400px one as a fallback.
// Delivery URLs are tied to the uploaded file, so re-run this if a video is
// re-uploaded in Wistia.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vids = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/videos.json'), 'utf8'));
const OUT = path.join(ROOT, 'src/data/video-previews.json');
const list = vids.wistia.filter(v => v.page === 'home' && /Testimonial/i.test(v.title));

const media = {};
for (const v of list) {
  const r = await fetch(`https://fast.wistia.com/embed/medias/${v.id}.json`);
  if (!r.ok) { console.warn(`  ${v.id}: HTTP ${r.status}, skipped`); continue; }
  const assets = ((await r.json()).media?.assets || []).filter(a => /mp4_video$|^iphone_video$/.test(a.type));
  const pick = (w) => assets.filter(a => a.width <= w).sort((a, b) => b.width - a.width)[0];
  const url = pick(640) || assets[0];
  const small = pick(400) || url;
  if (!url) { console.warn(`  ${v.id}: no MP4 rendition, skipped`); continue; }
  const mp4 = (a) => a.url.replace(/\.bin$/, '.mp4');
  media[v.id] = { url: mp4(url), small: mp4(small), width: url.width, height: url.height };
  console.log(`  ${v.id}  ${url.width}x${url.height}  ${v.title}`);
}

fs.writeFileSync(OUT, JSON.stringify({
  _note: 'Preview MP4s for the testimonial rails (centre stage). Written by scripts/fetch-previews.mjs from Wistia’s media JSON — re-run `npm run previews` if a video is added or re-uploaded.',
  fetched: new Date().toISOString().slice(0, 10),
  media,
}, null, 2) + '\n');
console.log(`wrote ${path.relative(ROOT, OUT)} — ${Object.keys(media).length} of ${list.length}`);
