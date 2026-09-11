// Re-encodes the images in dist/assets for the size they are actually shown at.
//
// Runs AFTER build.mjs has copied src/assets across, and only ever writes into
// dist. The originals are never touched, which is what makes this safe to run
// on every build: each build re-copies the original and re-encodes it once, so
// quality never compounds the way in-place lossy re-encoding does.
//
// The sizes below come from what the markup asks for, not from taste:
//
//   posters/    marquee cards are 230px wide with object-cover on a 4:5 box.
//               A 16:9 source covering that box is scaled by height, so about
//               511 CSS px of it is used — 1024 covers a 2x screen. The same
//               files appear on the contact page at ~540 CSS px, which 1024
//               also covers at 2x. Wistia hands these over at 1280.
//   team/       polaroids are capped at max-w-[18rem], so 288 CSS px. 768
//               covers 2x with room to spare.
//   photos/     full-width plates and backgrounds. 1600 is a 2x phone and a
//               1x desktop; beyond that nothing on the page can show it.
//   brand/      logos. The wordmark renders under 200 CSS px.
//   favicons    left alone — the dimensions are the point.
//
// Formats are preserved so every path in the markup and in site.json stays
// valid. A photo that happens to be a PNG is still re-encoded as a PNG, which
// costs more bytes than a JPEG would; see --survey for which those are.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist/assets');
const SURVEY = process.argv.includes('--survey');

// First match wins.
const RULES = [
  { test: /^brand\/favicon/, skip: true },
  { test: /^posters\//, maxW: 1024, jpeg: 74 },
  { test: /^team\//, maxW: 768, jpeg: 76 },
  { test: /^photos\//, maxW: 1600, jpeg: 76 },
  { test: /^video\/hero-poster/, maxW: 1600, jpeg: 72 },
  { test: /^brand\/logo/, maxW: 480 },
  { test: /^brand\/pattern/, maxW: 1200 },
  { test: /./, maxW: 1600, jpeg: 78 },
];

const ruleFor = (rel) => RULES.find(r => r.test.test(rel));

const walk = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (/\.(png|jpe?g)$/i.test(e.name)) out.push(f);
  }
  return out;
};

const files = walk(DIST);
if (!files.length) {
  console.log('images: nothing in dist/assets — run build first');
  process.exit(0);
}

let before = 0, after = 0, done = 0, skipped = 0;
const rows = [];

for (const f of files) {
  const rel = path.relative(DIST, f).replace(/\\/g, '/');
  const rule = ruleFor(rel);
  const size0 = fs.statSync(f).size;
  before += size0;

  if (rule.skip) { after += size0; skipped++; continue; }

  // Read to a Buffer and work from that, never from the path. sharp keeps the
  // source file open, and on Windows writing back to a path it still holds
  // fails with an UNKNOWN open error.
  const input = fs.readFileSync(f);
  const meta = await sharp(input).metadata();
  const png = meta.format === 'png';

  // A PNG whose alpha channel is never used is a photo in the wrong wrapper.
  // Worth reporting, but changing the extension would break every reference,
  // so that stays a deliberate decision rather than something this does.
  let alphaUsed = false;
  if (SURVEY && meta.hasAlpha) {
    const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let i = 3; i < data.length; i += info.channels) if (data[i] < 250) { alphaUsed = true; break; }
  }

  let pipe = sharp(input);
  if (meta.width > rule.maxW) pipe = pipe.resize({ width: rule.maxW, withoutEnlargement: true });
  pipe = png
    ? pipe.png({ compressionLevel: 9, effort: 10, palette: true, quality: 90 })
    : pipe.jpeg({ quality: rule.jpeg, mozjpeg: true, progressive: true });

  const buf = await pipe.toBuffer();
  // Never write a bigger file than the one that was already there.
  if (buf.length < size0) { fs.writeFileSync(f, buf); after += buf.length; done++; }
  else { after += size0; skipped++; }

  rows.push({
    rel, from: size0, to: Math.min(buf.length, size0),
    dims: `${meta.width}x${meta.height}`,
    resized: meta.width > rule.maxW ? `-> ${rule.maxW}w` : '',
    png, hasAlpha: meta.hasAlpha, alphaUsed,
  });
}

if (SURVEY) {
  rows.sort((a, b) => b.from - a.from);
  console.log('  before    after   saved   dimensions        file');
  for (const r of rows.slice(0, 24)) {
    console.log(
      `${(r.from / 1024).toFixed(0).padStart(6)}KB ${(r.to / 1024).toFixed(0).padStart(7)}KB ` +
      `${(100 - r.to / r.from * 100).toFixed(0).padStart(5)}%   ${r.dims.padEnd(10)}${r.resized.padEnd(9)} ${r.rel}`);
  }
  const wrongFormat = rows.filter(r => r.png && r.hasAlpha && !r.alphaUsed);
  console.log('\nPNGs whose alpha channel is never used (a JPEG would be far smaller):');
  console.log(wrongFormat.length ? wrongFormat.map(r => '  ' + r.rel).join('\n') : '  none');
}

console.log(`images: ${done} re-encoded, ${skipped} left alone — ` +
  `${(before / 1024 / 1024).toFixed(2)} MB -> ${(after / 1024 / 1024).toFixed(2)} MB ` +
  `(${(100 - after / before * 100).toFixed(0)}% smaller)`);
