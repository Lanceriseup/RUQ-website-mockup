import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { networkInterfaces } from 'node:os';
import { extname, join, normalize, resolve, sep } from 'node:path';

const ROOT = resolve(process.argv[2] || "dist");
const PORT = Number(process.argv[3] || 8765);

// Loopback by default — the preview is an unfinished site with a noindex
// header, and it has no business being on the network unless asked.
//
// `--lan` opts in, which is what checking a mobile layout on an actual phone
// requires: a phone cannot reach 127.0.0.1 on this machine, so the server has
// to answer on the Wi-Fi address instead. Both devices must be on the same
// network, and Windows Firewall will ask to allow Node the first time.
const LAN = process.argv.includes('--lan');
const HOST = LAN ? '0.0.0.0' : '127.0.0.1';
const DISPLAY_HOST = 'localhost';   // what humans type

// The machine's own address on the Wi-Fi/Ethernet network — what the phone
// needs. Skips loopback and virtual adapters (Hyper-V, WSL, VPNs) since those
// are not reachable from another device.
function lanAddresses() {
  const out = [];
  for (const [name, addrs] of Object.entries(networkInterfaces())) {
    if (/^(vEthernet|Loopback|WSL|VirtualBox|VMware)/i.test(name)) continue;
    for (const a of addrs || []) {
      if (a.family === 'IPv4' && !a.internal) out.push({ name, address: a.address });
    }
  }
  return out;
}

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
  console.log(`ready: http://${DISPLAY_HOST}:${PORT}/`);
  if (LAN) {
    const nets = lanAddresses();
    if (nets.length) {
      console.log('on this network (open on your phone):');
      for (const n of nets) console.log(`  http://${n.address}:${PORT}/   [${n.name}]`);
    } else {
      console.log('--lan was passed but no external IPv4 address was found — is Wi-Fi connected?');
    }
  } else {
    console.log('(loopback only — pass --lan to reach it from a phone on the same Wi-Fi)');
  }
});
