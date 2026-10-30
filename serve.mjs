// TV Kumanda: docs/ klasörünü ev ağında yayınlar, /wol ile TV'ye açma sinyali gönderir.
// Kullanım: node serve.mjs [port]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import dgram from "node:dgram";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "docs");
const PORT = Number(process.argv[2]) || 8080;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

function lanAddresses() {
  return Object.values(os.networkInterfaces()).flat()
    .filter((i) => i && i.family === "IPv4" && !i.internal);
}

function broadcastAddresses() {
  const out = new Set(["255.255.255.255"]);
  for (const i of lanAddresses()) {
    const ip = i.address.split(".").map(Number), mask = i.netmask.split(".").map(Number);
    out.add(ip.map((b, k) => (b | (~mask[k] & 255))).join("."));
  }
  return [...out];
}

function sendWol(mac) {
  const hex = String(mac).replace(/[^0-9a-f]/gi, "");
  if (hex.length !== 12) throw new Error("Geçersiz MAC adresi");
  const m = Buffer.from(hex, "hex");
  const packet = Buffer.concat([Buffer.alloc(6, 0xff), ...Array(16).fill(m)]);
  const targets = broadcastAddresses().flatMap((a) => [[a, 9], [a, 7]]);
  const sock = dgram.createSocket("udp4");
  sock.bind(() => {
    sock.setBroadcast(true);
    let left = targets.length;
    for (const [addr, port] of targets) sock.send(packet, port, addr, () => { if (--left === 0) sock.close(); });
  });
}

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (req.method === "POST" && url.pathname === "/wol") {
    let body = "";
    req.on("data", (c) => { body += c; if (body.length > 1000) req.destroy(); });
    req.on("end", () => {
      try {
        sendWol(JSON.parse(body || "{}").mac);
        console.log(new Date().toLocaleTimeString("tr-TR"), "açma sinyali gönderildi");
        res.writeHead(204).end();
      } catch (e) { res.writeHead(400).end(e.message); }
    });
    return;
  }
  let p = decodeURIComponent(url.pathname);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Bulunamadı"); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(data);
  });
}).listen(PORT, "0.0.0.0", () => {
  console.log("TV Kumanda yayında. iPhone'da Safari ile aç:");
  for (const i of lanAddresses()) console.log(`  http://${i.address}:${PORT}`);
});
