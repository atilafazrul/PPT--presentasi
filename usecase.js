/**
 * Renderer Use Case Diagram (SVG) untuk MANSYS.
 * Notasi UML: aktor (stick figure), satu system boundary, use case (elips),
 * garis asosiasi (solid), dependensi «include»/«extend» (putus-putus + panah).
 * Tata letak mengikuti gambar acuan: aktor Sales, Service, Purchasing.
 */

const UC_STYLE = {
  main: { stroke: "#2dd4bf", fill: "rgba(45,212,191,0.14)", text: "#8af2e3" },
  uc:   { stroke: "#7c83ff", fill: "rgba(124,131,255,0.12)", text: "#cfd2ff" },
};

const UC_CHARW = 6.3;

// ---- DATA ----
// Aktor (stick figure). x,y = posisi kepala.
const UC_ACTORS = [
  { id: "sales", name: "Sales", x: 150, y: 360 },
  { id: "service", name: "Service", x: 1140, y: 470 },
  { id: "purchasing", name: "Purchasing", x: 1430, y: 372 },
];

const UC_NODES = [
  // Penjualan
  { id: "kp", text: "Kelola Penjualan", x: 520, y: 280, kind: "main" },
  { id: "kp_input", text: "Input Penjualan", x: 800, y: 205, kind: "uc" },
  { id: "kp_edit", text: "Edit Penjualan", x: 800, y: 330, kind: "uc" },
  // Projek Kerja
  { id: "kpk", text: "Kelola Projek Kerja", x: 560, y: 500, kind: "main" },
  { id: "pk_tambah", text: "Tambah Projek", x: 775, y: 600, kind: "uc" },
  { id: "pk_dok", text: "Input Dokumentasi", x: 1015, y: 600, kind: "uc" },
  { id: "pk_hapus", text: "Hapus Projek", x: 520, y: 730, kind: "uc" },
  { id: "pk_edit", text: "Edit Projek", x: 715, y: 730, kind: "uc" },
  { id: "pk_status", text: "Ubah Status (Proses, Invoicing, Selesai)", x: 965, y: 735, kind: "uc" },
  // Inventory
  { id: "ki", text: "Kelola Inventory", x: 1120, y: 250, kind: "main" },
  { id: "ki_tambah", text: "Tambah Barang", x: 1000, y: 120, kind: "uc" },
  { id: "ki_edit", text: "Edit Barang", x: 1255, y: 120, kind: "uc" },
  { id: "ki_hapus", text: "Hapus Barang", x: 1345, y: 250, kind: "uc" },
  // Pembelian
  { id: "kpb", text: "Kelola Pembelian Barang", x: 1430, y: 560, kind: "main" },
  { id: "pb_tambah", text: "Tambah Pembelian", x: 1430, y: 760, kind: "uc" },
];

const UC_EDGES = [
  // asosiasi aktor -> use case utama
  { from: "sales", to: "kp", type: "assoc" },
  { from: "sales", to: "kpk", type: "assoc" },
  { from: "service", to: "ki", type: "assoc" },
  { from: "service", to: "kpk", type: "assoc" },
  { from: "purchasing", to: "kpb", type: "assoc" },
  // Penjualan
  { from: "kp", to: "kp_input", type: "include" },
  { from: "kp", to: "kp_edit", type: "include" },
  // Inventory
  { from: "ki", to: "ki_tambah", type: "include" },
  { from: "ki", to: "ki_edit", type: "include" },
  { from: "ki", to: "ki_hapus", type: "include" },
  // Projek Kerja
  { from: "kpk", to: "pk_tambah", type: "include" },
  { from: "kpk", to: "pk_edit", type: "include" },
  { from: "kpk", to: "pk_hapus", type: "include" },
  { from: "pk_tambah", to: "pk_dok", type: "extend" },
  { from: "pk_edit", to: "pk_status", type: "extend" },
  // Pembelian
  { from: "kpb", to: "pb_tambah", type: "include" },
  { from: "pk_status", to: "pb_tambah", type: "extend", note: "Jika Invoicing" },
];

// ---- HELPERS ----
function ucEsc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function ucWrap(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (test.length > maxChars && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

function ucMeasure(n) {
  const isMain = n.kind === "main";
  const maxChars = isMain ? 14 : 12;
  const lines = ucWrap(n.text, maxChars);
  const longest = lines.reduce((m, l) => Math.max(m, l.length), 0);
  const rx = Math.max(isMain ? 74 : 52, (longest * UC_CHARW) / 2 + 18);
  const ry = Math.max(isMain ? 24 : 21, lines.length * 12 + 6);
  n._lines = lines;
  n.rx = Math.round(rx);
  n.ry = Math.round(ry);
  n.cx = n.x;
  n.cy = n.y;
  return n;
}

function ucEllipse(n) {
  const st = UC_STYLE[n.kind] || UC_STYLE.uc;
  const fs = n.kind === "main" ? 12.5 : 11;
  const lh = 14;
  const startY = n.cy - ((n._lines.length - 1) * lh) / 2 + 0.5;
  let txt = `<text x="${n.cx}" y="${startY}" text-anchor="middle" dominant-baseline="middle" font-family="'IBM Plex Sans',sans-serif" font-size="${fs}" font-weight="${n.kind === "main" ? 600 : 500}" fill="${st.text}">`;
  n._lines.forEach((ln, i) => {
    txt += `<tspan x="${n.cx}" dy="${i === 0 ? 0 : lh}">${ucEsc(ln)}</tspan>`;
  });
  txt += `</text>`;
  return `<ellipse cx="${n.cx}" cy="${n.cy}" rx="${n.rx}" ry="${n.ry}" fill="${st.fill}" stroke="${st.stroke}" stroke-width="1.6"/>${txt}`;
}

function ucActor(a) {
  const x = a.x, top = a.y;
  return `<g stroke="#cfd2ff" stroke-width="1.8" fill="none" stroke-linecap="round">
    <circle cx="${x}" cy="${top}" r="8.5" fill="rgba(124,131,255,0.15)"/>
    <line x1="${x}" y1="${top + 8.5}" x2="${x}" y2="${top + 30}"/>
    <line x1="${x - 12}" y1="${top + 17}" x2="${x + 12}" y2="${top + 17}"/>
    <line x1="${x}" y1="${top + 30}" x2="${x - 10}" y2="${top + 46}"/>
    <line x1="${x}" y1="${top + 30}" x2="${x + 10}" y2="${top + 46}"/>
    <text x="${x}" y="${top + 64}" text-anchor="middle" font-family="'IBM Plex Sans',sans-serif" font-size="12" font-weight="600" fill="#cfd2ff" stroke="none">${ucEsc(a.name)}</text>
  </g>`;
}

// Titik tepi pada batas node ke arah (tx,ty).
function ucEndpoint(node, tx, ty) {
  const dx = tx - node.cx, dy = ty - node.cy;
  const len = Math.hypot(dx, dy) || 1;
  if (node.isActor) {
    const r = 36;
    return [node.cx + (dx / len) * r, node.cy + (dy / len) * r];
  }
  const t = 1 / Math.sqrt((dx * dx) / (node.rx * node.rx) + (dy * dy) / (node.ry * node.ry));
  return [node.cx + dx * t, node.cy + dy * t];
}

function ucLabel(x, y, text, color) {
  const w = text.length * 5.6 + 12;
  return `<g>
    <rect x="${Math.round(x - w / 2)}" y="${Math.round(y - 8)}" width="${Math.round(w)}" height="16" rx="3" fill="#0b0d12" stroke="${color}" stroke-width="0.8" opacity="0.95"/>
    <text x="${Math.round(x)}" y="${Math.round(y + 1)}" text-anchor="middle" dominant-baseline="middle" font-family="'IBM Plex Mono',monospace" font-size="9.5" font-weight="500" fill="${color}">${ucEsc(text)}</text>
  </g>`;
}

function renderUsecase() {
  const nodes = UC_NODES.map((n) => ucMeasure({ ...n }));
  const byId = {};
  nodes.forEach((n) => (byId[n.id] = n));
  UC_ACTORS.forEach((a) => {
    byId[a.id] = { cx: a.x, cy: a.y + 20, isActor: true };
  });

  // system boundary tunggal mengelilingi seluruh use case
  const pad = 38;
  const minX = Math.min(...nodes.map((n) => n.cx - n.rx)) - pad;
  const maxX = Math.max(...nodes.map((n) => n.cx + n.rx)) + pad;
  const minY = Math.min(...nodes.map((n) => n.cy - n.ry)) - pad;
  const maxY = Math.max(...nodes.map((n) => n.cy + n.ry)) + pad;
  const boundary = `<g>
    <rect x="${Math.round(minX)}" y="${Math.round(minY)}" width="${Math.round(maxX - minX)}" height="${Math.round(maxY - minY)}" rx="16" fill="rgba(255,255,255,0.018)" stroke="rgba(255,255,255,0.18)" stroke-width="1.3"/>
    <text x="${Math.round(minX + 16)}" y="${Math.round(minY + 20)}" font-family="'IBM Plex Sans',sans-serif" font-size="11.5" font-weight="600" letter-spacing="0.05em" fill="#8b93a3">Sistem MANSYS</text>
  </g>`;

  // edges
  let edgesSvg = "";
  let labelsSvg = "";
  UC_EDGES.forEach((e) => {
    const F = byId[e.from];
    const T = byId[e.to];
    if (!F || !T) return;

    const Fp = ucEndpoint(F, T.cx, T.cy);
    const Tp = ucEndpoint(T, F.cx, F.cy);
    const mx = (Fp[0] + Tp[0]) / 2;
    const my = (Fp[1] + Tp[1]) / 2;

    if (e.type === "assoc") {
      edgesSvg += `<path d="M${Math.round(Fp[0])},${Math.round(Fp[1])} L${Math.round(Tp[0])},${Math.round(Tp[1])}" fill="none" stroke="#2dd4bf" stroke-width="1.6" opacity="0.85"/>`;
      return;
    }

    const color = e.type === "extend" ? "#fbbf24" : "#a78bfa";
    edgesSvg += `<path d="M${Math.round(Fp[0])},${Math.round(Fp[1])} L${Math.round(Tp[0])},${Math.round(Tp[1])}" fill="none" stroke="${color}" stroke-width="1.4" stroke-dasharray="6 5" marker-end="url(#uc-arrow)" opacity="0.9"/>`;

    const stereo = e.type === "extend" ? "«extend»" : "«include»";
    labelsSvg += ucLabel(mx, my, stereo, color);
    if (e.note) labelsSvg += ucLabel(mx, my + 17, e.note, color);
  });

  let nodesSvg = "";
  nodes.forEach((n) => (nodesSvg += ucEllipse(n)));
  let actorsSvg = "";
  UC_ACTORS.forEach((a) => (actorsSvg += ucActor(a)));

  const W = Math.round(maxX + 60);
  const H = Math.round(maxY + 60);
  return `<svg class="flow-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img">
    <defs>
      <marker id="uc-arrow" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto" markerUnits="userSpaceOnUse">
        <path d="M0,0 L8,4 L0,8" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.2"/>
      </marker>
    </defs>
    <text x="${W / 2}" y="26" text-anchor="middle" font-family="'IBM Plex Sans',sans-serif" font-size="16" font-weight="700" fill="#eef1f6">Use Case Diagram — Sistem MANSYS</text>
    <text x="${W / 2}" y="${H - 12}" text-anchor="middle" font-family="'IBM Plex Sans',sans-serif" font-size="10.5" fill="#555d6d">Garis solid = asosiasi aktor · «include» wajib dijalankan · «extend» bersifat opsional/kondisional</text>
    ${boundary}
    <g>${edgesSvg}</g>
    <g>${actorsSvg}</g>
    <g>${nodesSvg}</g>
    <g>${labelsSvg}</g>
  </svg>`;
}
