// Downloads every source asset from the live site into src/assets/.
// Re-runnable: existing files are skipped unless --force is passed.
//
// The team headshots appear on the live site only as Brizy-generated crops
// (name-<w>x<h>x<cropX>x<cropY>x<dispW>x<dispH>x<ts>.jpg). The originals were
// located by probing the uploads folders, so what lands here is the
// full-resolution source, not a derivative.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src/assets');
const FORCE = process.argv.includes('--force');
const BASE = 'https://riseupqueens.com/wp-content/uploads';

export const ASSETS = {
  brand: [
    ['2025/06/RUQ-Logo-White-01-1-scaled.png', 'logo-ruq-white.png'],
    ['2025/07/Rise-Up-Kings-Logo-04-scaled.png', 'logo-ruk.png'],
    ['2025/06/RUQ.png', 'logo-ruq.png'],
    ['2025/06/RUQ-Pattern.png', 'pattern.png'],
    ['2025/06/JL-Signature-white.png', 'signature-jl-white.png'],
    ['2025/07/cropped-RUQ-favicon-01-01-32x32.png', 'favicon-32.png'],
    ['2025/07/cropped-RUQ-favicon-01-01-180x180.png', 'favicon-180.png'],
    ['2025/07/cropped-RUQ-favicon-01-01-192x192.png', 'favicon-192.png'],
    ['2025/07/cropped-RUQ-favicon-01-01-270x270.png', 'favicon-270.png'],
  ],
  team: [
    ['2025/09/JL-1-scaled.jpg', 'jessica-lewis.jpg'],
    ['2025/07/Molly-2-scaled.jpg', 'molly-rhodes.jpg'],
    ['2025/09/Becky-1-scaled.jpg', 'becky-hilty.jpg'],
    ['2025/07/Christy-2-scaled.jpg', 'christy-tijerina.jpg'],
    ['2025/09/Natasha-5-scaled.jpg', 'natasha-seguin-congrove.jpg'],
    ['2026/01/Maurie-Shipp-3-scaled.jpg', 'maurie-shipp.jpg'],
    ['2025/08/Jayden-4-scaled.jpg', 'jayden-ngoi.jpg'],
    ['2025/08/Jess-1-scaled.jpg', 'jessica-craycraft.jpg'],
    ['2025/08/Carolyn-1-scaled.jpg', 'carolyn-johnson.jpg'],
    ['2025/08/Maria-1-scaled.jpg', 'maria-hazzard.jpg'],
    ['2025/08/Justin.png', 'justin-baker.png'],
    ['2025/08/Griffey-Headshot-1-scaled.jpg', 'nathan-griffey.jpg'],
  ],
  photos: [
    ['2025/06/Queens-Waving-Photo-2-scaled.jpg', 'queens-waving.jpg'],
    ['2025/07/8.png', 'event-8.png'],
    ['2025/07/9.png', 'event-9.png'],
    ['2025/07/1-1.png', 'gallery-1-1.png'],
    ['2025/07/1-2.png', 'gallery-1-2.png'],
    ['2025/07/2-1.png', 'gallery-2-1.png'],
    ['2025/07/2-2.png', 'gallery-2-2.png'],
  ],
};

const get = (url) => fetch(url).then(async (r) => {
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
});

const run = async () => {
  let ok = 0, skip = 0, fail = 0, bytes = 0;
  for (const [group, list] of Object.entries(ASSETS)) {
    const dir = path.join(OUT, group);
    fs.mkdirSync(dir, { recursive: true });
    for (const [remote, local] of list) {
      const dest = path.join(dir, local);
      if (fs.existsSync(dest) && !FORCE) { skip++; continue; }
      try {
        const buf = await get(`${BASE}/${remote}`);
        fs.writeFileSync(dest, buf);
        bytes += buf.length;
        ok++;
        console.log(`  ${(buf.length / 1024).toFixed(0).padStart(6)} KB  ${group}/${local}`);
      } catch (e) {
        fail++;
        console.error(`  FAILED          ${group}/${local} — ${e.message}`);
      }
    }
  }
  console.log(`\ndownloaded ${ok}, skipped ${skip}, failed ${fail} — ${(bytes / 1024 / 1024).toFixed(1)} MB`);
  if (fail) process.exitCode = 1;
};

run();
