// One-time migration: photographs stored as PNG become JPEGs.
//
// Several of the site's photographs arrived as PNG. A PNG cannot use a DCT, so
// a photograph in one costs roughly four times what the same picture costs as
// a JPEG, and none of these has anything to gain from lossless storage — they
// are camera images, not flat graphics with sharp edges.
//
// This is not part of the build. It rewrites src/assets and every reference to
// them, once, and is then done. Re-running it is harmless: anything already
// converted no longer matches.
//
// Anything whose alpha channel is actually used is left alone — the logos and
// the plaid pattern sit on coloured grounds and need their transparency.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APPLY = process.argv.includes('--apply');

const pngs = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (/\.png$/i.test(e.name)) pngs.push(f);
  }
};
walk(path.join(ROOT, 'src/assets'));

// Files that must stay PNG regardless of what the pixels say.
const KEEP = /favicon|logo-|pattern\./i;

const convert = [];
for (const f of pngs) {
  const rel = path.relative(path.join(ROOT, 'src/assets'), f).replace(/\\/g, '/');
  if (KEEP.test(rel)) { console.log(`  keep   ${rel.padEnd(30)} (logo, icon or pattern)`); continue; }

  const input = fs.readFileSync(f);
  const meta = await sharp(input).metadata();
  let used = false;
  if (meta.hasAlpha) {
    const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let i = 3; i < data.length; i += info.channels) if (data[i] < 250) { used = true; break; }
  }
  if (used) { console.log(`  keep   ${rel.padEnd(30)} (transparency in use)`); continue; }
  convert.push({ f, rel, size: input.length, meta });
}

console.log('');
let from = 0, to = 0;
for (const c of convert) {
  const out = c.f.replace(/\.png$/i, '.jpg');
  const buf = await sharp(fs.readFileSync(c.f)).jpeg({ quality: 86, mozjpeg: true, progressive: true }).toBuffer();
  from += c.size; to += buf.length;
  console.log(`  ${APPLY ? 'conv ' : 'would'}  ${c.rel.padEnd(30)} ${(c.size / 1024).toFixed(0).padStart(5)}KB -> ${(buf.length / 1024).toFixed(0).padStart(5)}KB`);
  if (!APPLY) continue;
  fs.writeFileSync(out, buf);
  fs.unlinkSync(c.f);
}

// Rewrite every reference. Data files and partials both carry these paths.
const refFiles = [];
const walkSrc = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory() && e.name !== 'assets') walkSrc(f);
    else if (/\.(mjs|js|json)$/.test(e.name)) refFiles.push(f);
  }
};
walkSrc(path.join(ROOT, 'src'));
// fetch-assets.mjs is deliberately excluded. Its table maps a remote URL to a
// local filename, and the remote files really are PNGs — rewriting its targets
// to .jpg would make it write PNG bytes into a file named .jpg. It keeps
// fetching PNGs; re-run this afterwards to convert them again.
refFiles.push(...fs.readdirSync(path.join(ROOT, 'scripts'))
  .filter(f => /\.mjs$/.test(f) && f !== 'fetch-assets.mjs' && f !== 'png-to-jpeg.mjs')
  .map(f => path.join(ROOT, 'scripts', f)));

let edits = 0;
for (const rf of refFiles) {
  let s = fs.readFileSync(rf, 'utf8');
  const orig = s;
  for (const c of convert) {
    const base = path.basename(c.rel);
    if (!s.includes(base)) continue;
    s = s.split(base).join(base.replace(/\.png$/i, '.jpg'));
    edits++;
  }
  if (s !== orig) {
    console.log(`  ref    ${path.relative(ROOT, rf).replace(/\\/g, '/')}`);
    if (APPLY) fs.writeFileSync(rf, s);
  }
}

console.log(`\n${convert.length} photographs, ${(from / 1024 / 1024).toFixed(2)} MB -> ${(to / 1024 / 1024).toFixed(2)} MB` +
  ` in source, ${edits} references${APPLY ? ' rewritten' : ' would be rewritten (dry run — pass --apply)'}`);
