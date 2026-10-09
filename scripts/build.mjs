// Static build: data + templates -> dist/. No CMS, no runtime dependency.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { header, footer, esc } from '../src/partials/layout.mjs';
import { pages as buildPages } from '../src/pages/pages.mjs';
import { capsule } from '../src/partials/capsule.mjs';
import { announce } from '../src/partials/announce.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const site = read('src/data/site.json');
const content = read('src/data/content.json');
const videos = read('src/data/videos.json');

const shell = (page) => `<!doctype html>
<html lang="en" class="scroll-smooth">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.desc)}">
<meta name="robots" content="noindex, nofollow">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.desc)}">
<meta property="og:type" content="website">
<link rel="icon" sizes="32x32" href="${esc(site.assets.faviconSizes['32'])}">
<link rel="icon" sizes="192x192" href="${esc(site.assets.faviconSizes['192'])}">
<link rel="apple-touch-icon" href="${esc(site.assets.faviconSizes['180'])}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap">
<link rel="stylesheet" href="/styles.css">${page.body.includes('class="fx ') ? `
<link rel="stylesheet" href="/freedom-photo.css">` : ''}${page.body.includes('class="cx ') ? `
<link rel="stylesheet" href="/contact-photo.css">` : ''}${site.announceBar ? `
<link rel="stylesheet" href="/announce.css">` : ''}
</head>
<body class="bg-white font-body text-ink antialiased">
<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:ring-2 focus:ring-magenta">Skip to content</a>
${site.announceBar ? announce(site, site.announceBar) : ''}
${header(site, page.href, { overHero: Boolean(page.overHero ?? page.hero), scrim: page.navScrim !== false, clear: Boolean(page.navClear) })}
${capsule(site, page.href)}
<main id="main">
${page.body}
</main>
${footer(site)}
<script src="/app.js" defer></script>${site.announceBar ? `
<script src="/announce.js" defer></script>` : ''}
<script src="/hero-rotate.js" defer></script>${page.body.includes('data-bio-open') ? `
<!-- Keyed off the trigger the page rendered, so a page with coach bios on it
     cannot ship without the script that opens them. -->
<script src="/bio-modal.js" defer></script>` : ''}${page.body.includes('data-countdown') ? `
<!-- Keyed off the attribute that drives it rather than a flag, so a page that
     renders a countdown cannot ship without the script that fills it in. -->
<script src="/countdown.js" defer></script>` : ''}${page.body.includes('data-vsl-id') ? `
<!-- Keyed off the VSL mount, so any page with the shared player (homepage,
     about) gets Wistia and vsl.js, and no other page pays for them. -->
<script src="https://fast.wistia.com/assets/external/E-v1.js" async></script>
<script src="/vsl.js" defer></script>` : ''}${page.body.includes('data-xp') ? `
<!-- Keyed off the explore markup (the data-xp wrapper or any data-xp-rv
     reveal): reveal-on-scroll, drawn paths and the masterclass picker. -->
<script src="/explore.js" defer></script>` : ''}
</body>
</html>
`;

const dist = path.join(ROOT, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const list = buildPages(site, content, videos);
for (const page of list) {
  fs.writeFileSync(path.join(dist, page.file), shell(page));
}
fs.copyFileSync(path.join(ROOT, 'src/styles/app.js'), path.join(dist, 'app.js'));
fs.copyFileSync(path.join(ROOT, 'src/styles/freedom-photo.css'), path.join(dist, 'freedom-photo.css'));
fs.copyFileSync(path.join(ROOT, 'src/styles/contact-photo.css'), path.join(dist, 'contact-photo.css'));
fs.copyFileSync(path.join(ROOT, 'src/styles/announce.js'), path.join(dist, 'announce.js'));
fs.copyFileSync(path.join(ROOT, 'src/styles/announce.css'), path.join(dist, 'announce.css'));
fs.copyFileSync(path.join(ROOT, 'src/styles/hero-rotate.js'), path.join(dist, 'hero-rotate.js'));
fs.copyFileSync(path.join(ROOT, 'src/styles/vsl.js'), path.join(dist, 'vsl.js'));
fs.copyFileSync(path.join(ROOT, 'src/styles/countdown.js'), path.join(dist, 'countdown.js'));
fs.copyFileSync(path.join(ROOT, 'src/styles/bio-modal.js'), path.join(dist, 'bio-modal.js'));
fs.copyFileSync(path.join(ROOT, 'src/styles/explore.js'), path.join(dist, 'explore.js'));
// One stylesheet per explore direction, linked by the page that uses it.
for (const f of fs.readdirSync(path.join(ROOT, 'src/styles/explore'))) {
  if (f.endsWith('.css') && f !== 'base.css') fs.copyFileSync(path.join(ROOT, 'src/styles/explore', f), path.join(dist, 'xp-' + f));
}

// Static assets (hero video, poster) ship as-is.
const assetsSrc = path.join(ROOT, 'src/assets');
if (fs.existsSync(assetsSrc)) {
  fs.cpSync(assetsSrc, path.join(dist, 'assets'), { recursive: true });
}

const report = {
  builtAt: new Date().toISOString(),
  pages: list.map(p => p.file),
  videos: { wistia: videos.wistia.length, youtube: videos.youtube.length, vimeo: videos.vimeo.length },
  warnings: [
    'Event dates conflict on the live site — confirm src/data/site.json nextEvent.',
    'Vimeo embeds are private and were not carried over.',
    'Legacy hero video is a 127 MB .mov — re-encode before use.',
    'Images still point at the live WordPress CDN.',
    'Forms are inert; MOS -> Ontraport wiring pending.',
  ],
};
fs.writeFileSync(path.join(ROOT, 'dist/build-report.json'), JSON.stringify(report, null, 2));

console.log(`built ${list.length} pages -> dist/`);
for (const p of list) console.log('  ' + p.file);
