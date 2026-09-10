import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const ROOT = resolve(process.argv[2] || "dist");
const PORT = Number(process.argv[3] || 8765);
const HOST = '127.0.0.1';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.otf': 'font/otf', '.mp4': 'video/mp4',
  '.webm': 'video/webm', '.mp3': 'audio/mpeg', '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf', '.xml': 'application/xml',
};

async function resolveTarget(pathname) {
  // Serve only from ROOT; reject traversal outside it.
  const decoded = decodeURIComponent(pathname.split('?')[0]);
  let p = resolve(join(ROOT, normalize(decoded)));
  if (p !== ROOT && !p.startsWith(ROOT + sep)) return null;
  try {
    const s = await stat(p);
    if (s.isDirectory()) { p = join(p, 'index.html'); await stat(p); }
    return p;
  } catch {
    // Extensionless URL -> try .html (matches the deployed clean-URL behavior)
    if (!extname(p)) { try { await stat(p + '.html'); return p + '.html'; } catch {} }
    return null;
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  const file = await resolveTarget(url.pathname);
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' });
    return res.end(`404 Not Found: ${url.pathname}`);
  }
  const type = TYPES[extname(file).toLowerCase()] || 'application/octet-stream';
  const { size } = await stat(file);
  const base = {
    'content-type': type,
    'cache-control': 'no-store',
    'x-robots-tag': 'noindex, nofollow',   // keep the preview's search-exclusion safeguard
    'accept-ranges': 'bytes',
  };

  // Range support. Safari will not play a video at all unless the server
  // answers 206, so the local preview has to behave like a real host here.
  const range = req.headers.range;
  const m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (m) {
    let start = m[1] === '' ? size - Number(m[2]) : Number(m[1]);
    let end = m[1] === '' || m[2] === '' ? size - 1 : Number(m[2]);
    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start < 0 || end >= size) {
      res.writeHead(416, { ...base, 'content-range': `bytes */${size}` });
      return res.end();
    }
    res.writeHead(206, { ...base, 'content-range': `bytes ${start}-${end}/${size}`, 'content-length': end - start + 1 });
    return createReadStream(file, { start, end }).pipe(res);
  }

  res.writeHead(200, { ...base, 'content-length': size });
  createReadStream(file).pipe(res);
}).listen(PORT, HOST, () => {
  console.log(`RUQ preview serving ${ROOT}`);
  console.log(`ready: http://${HOST}:${PORT}/`);
});
