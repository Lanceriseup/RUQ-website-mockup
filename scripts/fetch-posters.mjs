// Downloads a poster frame for every Wistia video into src/assets/posters/.
// Re-runnable: existing files are skipped unless --force is passed.
//
// Wistia's oEmbed endpoint hands back a thumbnail_url with the crop size
// baked into the query string (image_crop_resized=960x540). That is rewritten
// to 1280x720 here — the facades are rendered large enough that 960 goes soft
// on a retina display, and Wistia serves the larger crop from the same asset.
//
// YouTube thumbnails come from i.ytimg.com. maxresdefault does not exist for
// every video and the request still returns 200 with a 120x90 grey placeholder,
// so the size is checked rather than the status before accepting it.
//
// Without these the video facades are blank dark rectangles. A section made of
// blank rectangles cannot be judged, so this runs before any design work on one.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src/assets/posters');
const FORCE = process.argv.includes('--force');

const videos = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/videos.json'), 'utf8'));

const oembed = async (id) => {
  const url = `https://fast.wistia.com/oembed?url=${encodeURIComponent(`https://home.wistia.com/medias/${id}`)}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`oembed HTTP ${r.status}`);
  const j = await r.json();
  if (!j.thumbnail_url) throw new Error('no thumbnail_url');
  return j.thumbnail_url.replace(/image_crop_resized=\d+x\d+/, 'image_crop_resized=1280x720');
};

const run = async () => {
  fs.mkdirSync(OUT, { recursive: true });
  let ok = 0, skip = 0, fail = 0, bytes = 0;

  for (const v of videos.wistia) {
    const dest = path.join(OUT, `${v.id}.jpg`);
    if (fs.existsSync(dest) && !FORCE) { skip++; continue; }
    try {
      const src = await oembed(v.id);
      const r = await fetch(src);
      if (!r.ok) throw new Error(`image HTTP ${r.status}`);
      const buf = Buffer.from(await r.arrayBuffer());
      fs.writeFileSync(dest, buf);
      bytes += buf.length;
      ok++;
      console.log(`  ${(buf.length / 1024).toFixed(0).padStart(5)} KB  ${v.id}.jpg  ${v.title}`);
    } catch (e) {
      fail++;
      console.error(`  FAILED        ${v.id}.jpg  ${v.title} — ${e.message}`);
    }
  }

  for (const v of videos.youtube) {
    const dest = path.join(OUT, `yt-${v.id}.jpg`);
    if (fs.existsSync(dest) && !FORCE) { skip++; continue; }
    let buf = null;
    for (const name of ['maxresdefault', 'hqdefault']) {
      try {
        const r = await fetch(`https://i.ytimg.com/vi/${v.id}/${name}.jpg`);
        if (!r.ok) continue;
        const b = Buffer.from(await r.arrayBuffer());
        // A missing maxresdefault still answers 200, with a 120x90 grey
        // placeholder a few KB in size. Checking the status is not enough.
        if (b.length < 8000) continue;
        buf = b;
        break;
      } catch (e) { /* fall through to the smaller size */ }
    }
    if (!buf) {
      fail++;
      console.error(`  FAILED        yt-${v.id}.jpg  ${v.title}`);
      continue;
    }
    fs.writeFileSync(dest, buf);
    bytes += buf.length;
    ok++;
    console.log(`  ${(buf.length / 1024).toFixed(0).padStart(5)} KB  yt-${v.id}.jpg  ${v.title}`);
  }

  console.log(`\nposters: downloaded ${ok}, skipped ${skip}, failed ${fail} — ${(bytes / 1024 / 1024).toFixed(1)} MB`);
  if (fail) process.exitCode = 1;
};

run();
