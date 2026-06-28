/**
 * Renderer Use Case Diagram (SVG) untuk MANSYS.
 * Notasi UML: aktor (stick figure), system boundary per modul,
 * use case (elips), garis asosiasi (solid), dependensi <<include>>/<<extend>> (putus-putus).
 * Tata letak diatur manual dengan jarak longgar agar label tidak menumpuk.
 */

const UC_STYLE = {
  main: { stroke: "#2dd4bf", fill: "rgba(45,212,191,0.14)", text: "#8af2e3" },
  uc:   { stroke: "#7c83ff", fill: "rgba(124,131,255,0.12)", text: "#cfd2ff" },
};

const UC_CHARW = 6.3;

// ---- DATA ----
const UC_ACTORS = [
  { id: "sales", name: "Sales", x: 180, pill: false },
  { id: "shared", name: "Akses Projek (shared)", x: 700, pill: true },
  { id: "service", name: "Service", x: 1190, pill: false },
  { id: "purchasing", name: "Purchasing", x: 1575, pill: false },
];

const UC_NODES = [
  // Modul Target
  { id: "t_main", text: "Kelola Target Penjualan", x: 180, y: 188, kind: "main" },
  { id: "t_input", text: "Input Target", x: 118, y: 320, kind: "uc" },
  { id: "t_edit", text: "Edit Target", x: 250, y: 320, kind: "uc" },
  // Modul Projek Kerja
  { id: "p_main", text: "Kelola Projek Kerja", x: 700, y: 188, kind: "main" },
  { id: "p_tambah", text: "Tambah Projek", x: 470, y: 300, kind: "uc" },
  { id: "p_edit", text: "Edit Projek", x: 615, y: 300, kind: "uc" },
  { id: "p_hapus", text: "Hapus Projek", x: 770, y: 300, kind: "uc" },
  { id: "p_status", text: "Ubah Status Projek", x: 945, y: 300, kind: "uc" },
  { id: "p_inputdok", text: "Input Dokumentasi", x: 470, y: 392, kind: "uc" },
  { id: "s_dibuat", text: "Dibuat", x: 415, y: 502, kind: "uc" },
  { id: "s_persiapan", text: "Persiapan", x: 535, y: 502, kind: "uc" },
  { id: "s_proses", text: "Proses Pekerjaan", x: 663, y: 502, kind: "uc" },
  { id: "s_editing", text: "Editing", x: 790, y: 502, kind: "uc" },
  { id: "s_invoicing", text: "Invoicing", x: 905, y: 502, kind: "uc" },
  { id: "s_selesai", text: "Selesai", x: 1010, y: 502, kind: "uc" },
  // Modul Inventory
  { id: "i_main", text: "Kelola Inventory", x: 1190, y: 188, kind: "main" },
  { id: "i_tambah", text: "Tambah Barang", x: 1128, y: 320, kind: "uc" },
  { id: "i_edit", text: "Edit Barang", x: 1255, y: 320, kind: "uc" },
  // Modul Pembelian
  { id: "pb_main", text: "Kelola Pembelian Barang", x: 1575, y: 188, kind: "main" },
  { id: "pb_tambah", text: "Tambah Pembelian", x: 1470, y: 300, kind: "uc" },
  { id: "pb_status", text: "Ubah Status Pembelian", x: 1665, y: 300, kind: "uc" },
  { id: "pb_dipesan", text: "Dipesan", x: 1495, y: 400, kind: "uc" },
  { id: "pb_dikirim", text: "Dikirim", x: 1600, y: 400, kind: "uc" },
  { id: "pb_diterima", text: "Diterima", x: 1705, y: 400, kind: "uc" },
];

const UC_EDGES = [
  // asosiasi aktor -> use case utama
  { from: "sales", to: "t_main", type: "assoc" },
  { from: "shared", to: "p_main", type: "assoc" },
  { from: "service", to: "i_main", type: "assoc" },
  { from: "purchasing", to: "pb_main", type: "assoc" },
  // Target
  { from: "t_main", to: "t_input", type: "include" },
  { from: "t_main", to: "t_edit", type: "include" },
  // Projek
  { from: "p_main", to: "p_tambah", type: "include" },
  { from: "p_main", to: "p_edit", type: "include" },
  { from: "p_main", to: "p_hapus", type: "include" },
  { from: "p_main", to: "p_status", type: "include" },
  { from: "p_tambah", to: "p_inputdok", type: "extend" },
  { from: "p_status", to: "s_dibuat", type: "extend", trunkLabel: true },
  { from: "p_status", to: "s_persiapan", type: "extend" },
  { from: "p_status", to: "s_proses", type: "extend" },
  { from: "p_status", to: "s_editing", type: "extend" },
  { from: "p_status", to: "s_invoicing", type: "extend" },
  { from: "p_status", to: "s_selesai", type: "extend" },
  // Inventory
  { from: "i_main", to: "i_tambah", type: "include" },
  { from: "i_main", to: "i_edit", type: "include" },
  // Pembelian
  { from: "pb_main", to: "pb_tambah", type: "include" },
  { from: "pb_main", to: "pb_status", type: "include" },
  { from: "pb_status", to: "pb_dipesan", type: "extend", trunkLabel: true },
  { from: "pb_status", to: "pb_dikirim", type: "extend" },
  { from: "pb_status", to: "pb_diterima", type: "extend" },
];

const UC_MODULES = [
  { label: "Modul Target", nodes: ["t_main", "t_input", "t_edit"] },
  { label: "Modul Projek Kerja", nodes: ["p_main", "p_tambah", "p_edit", "p_hapus", "p_status", "p_inputdok", "s_dibuat", "s_persiapan", "s_proses", "s_editing", "s_invoicing", "s_selesai"] },
  { label: "Modul Inventory", nodes: ["i_main", "i_tambah", "i_edit"] },
  { label: "Modul Pembelian", nodes: ["pb_main", "pb_tambah", "pb_status", "pb_dipesan", "pb_dikirim", "pb_diterima"] },
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
  const rx = Math.max(isMain ? 74 : 52, (longest * UC_CHARW) / 2 + 17);
  const ry = (lines.length > 1 ? 30 : 21) + (isMain ? 4 : 0);
  n._lines = lines;
  n.rx = Math.round(rx);
  n.ry = Math.round(ry);
  n.cx = n.x;
  n.cy = n.y;
  return n;
}

function ucEllipse(n) {
  const st = UC_STYLE[n.kind] || UC_STYLE.uc;
  const fs = n.kind === "main" ? 12.5 : 11.5;
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
  const x = a.x;
  if (a.pill) {
    const w = a.name.length * UC_CHARW + 26;
    const y = 70;
    return `<g>
      <rect x="${Math.round(x - w / 2)}" y="${y - 13}" width="${Math.round(w)}" height="26" rx="13" fill="rgba(45,212,191,0.12)" stroke="#2dd4bf" stroke-width="1.4"/>
      <text x="${x}" y="${y + 1}" text-anchor="middle" dominant-baseline="middle" font-family="'IBM Plex Sans',sans-serif" font-size="11.5" font-weight="600" fill="#8af2e3">${ucEsc(a.name)}</text>
    </g>`;
  }
  const top = 46;
  return `<g stroke="#cfd2ff" stroke-width="1.8" fill="none" stroke-linecap="round">
    <circle cx="${x}" cy="${top}" r="8.5" fill="rgba(124,131,255,0.15)"/>
    <line x1="${x}" y1="${top + 8.5}" x2="${x}" y2="${top + 30}"/>
    <line x1="${x - 12}" y1="${top + 17}" x2="${x + 12}" y2="${top + 17}"/>
    <line x1="${x}" y1="${top + 30}" x2="${x - 10}" y2="${top + 46}"/>
    <line x1="${x}" y1="${top + 30}" x2="${x + 10}" y2="${top + 46}"/>
    <text x="${x}" y="${top + 64}" text-anchor="middle" font-family="'IBM Plex Sans',sans-serif" font-size="11.5" font-weight="600" fill="#cfd2ff" stroke="none">${ucEsc(a.name)}</text>
  </g>`;
}

function ucEdgePath(F, T) {
  // F, T adalah node (punya cx, cy, ry). Alur turun: bawah F -> atas T.
  const fx = F.cx, fy = F.cy + F.ry;
  const tx = T.cx, ty = T.cy - T.ry;
  if (Math.abs(fx - tx) < 1) return [[fx, fy], [tx, ty]];
  // Bus horizontal diletakkan tepat di atas target (22px) agar tidak menembus node lain.
  const my = Math.max(fy + 12, ty - 22);
  return [[fx, fy], [fx, my], [tx, my], [tx, ty]];
}

function renderUsecase() {
  const nodes = UC_NODES.map((n) => ucMeasure({ ...n }));
  const byId = {};
  nodes.forEach((n) => (byId[n.id] = n));
  UC_ACTORS.forEach((a) => {
    byId[a.id] = { cx: a.x, cy: a.pill ? 83 : 92, ry: 0, isActor: true };
  });

  const W = 1840;
  const boxTop = 116;
  const boxBottom = 556;

  // system boundaries per modul
  let boxesSvg = "";
  UC_MODULES.forEach((m) => {
    const ns = m.nodes.map((id) => byId[id]);
    const minX = Math.min(...ns.map((n) => n.cx - n.rx));
    const maxX = Math.max(...ns.map((n) => n.cx + n.rx));
    const x = Math.round(minX - 22);
    const w = Math.round(maxX - minX + 44);
    boxesSvg += `<g>
      <rect x="${x}" y="${boxTop}" width="${w}" height="${boxBottom - boxTop}" rx="12" fill="rgba(255,255,255,0.018)" stroke="rgba(255,255,255,0.14)" stroke-width="1.2" stroke-dasharray="3 4"/>
      <text x="${x + 14}" y="${boxTop + 18}" font-family="'IBM Plex Sans',sans-serif" font-size="11" font-weight="600" letter-spacing="0.04em" fill="#8b93a3">${ucEsc(m.label)}</text>
    </g>`;
  });

  // edges
  let edgesSvg = "";
  let labelsSvg = "";
  UC_EDGES.forEach((e) => {
    const F = byId[e.from];
    const T = byId[e.to];
    if (!F || !T) return;

    if (e.type === "assoc") {
      const fx = F.cx, fy = F.cy;
      const tx = T.cx, ty = T.cy - T.ry;
      edgesSvg += `<path d="M${fx},${fy} L${tx},${ty}" fill="none" stroke="#2dd4bf" stroke-width="1.6" opacity="0.85"/>`;
      return;
    }

    const pts = ucEdgePath(F, T);
    const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${Math.round(p[0])},${Math.round(p[1])}`).join(" ");
    const color = e.type === "extend" ? "#fbbf24" : "#a78bfa";
    edgesSvg += `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.4" stroke-dasharray="6 5" marker-end="url(#uc-arrow)" opacity="0.9"/>`;

    // label stereotip: trunk grup hanya sekali, selain itu per-edge yang x-nya berbeda jelas
    const stereo = e.type === "extend" ? "«extend»" : "«include»";
    const showLabel = e.trunkLabel || e.type === "include" || e.type === "extend";
    if (e.trunkLabel) {
      // taruh di segmen vertikal pertama (dekat sumber) agar mewakili grup
      const lx = pts[0][0], ly = pts[0][1] + 16;
      labelsSvg += ucLabel(lx, ly, stereo, color);
    } else if (e.type === "include") {
      const last = pts[pts.length - 1], prev = pts[pts.length - 2];
      const lx = last[0], ly = (last[1] + prev[1]) / 2;
      labelsSvg += ucLabel(lx, ly, stereo, color);
    } else if (e.type === "extend" && e.from === "p_tambah") {
      const last = pts[pts.length - 1], prev = pts[pts.length - 2];
      labelsSvg += ucLabel(last[0], (last[1] + prev[1]) / 2, stereo, color);
    }
  });

  let nodesSvg = "";
  nodes.forEach((n) => (nodesSvg += ucEllipse(n)));
  let actorsSvg = "";
  UC_ACTORS.forEach((a) => (actorsSvg += ucActor(a)));

  const H = 600;
  return `<svg class="flow-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img">
    <defs>
      <marker id="uc-arrow" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto" markerUnits="userSpaceOnUse">
        <path d="M0,0 L8,4 L0,8" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.2"/>
      </marker>
    </defs>
    <text x="${W / 2}" y="26" text-anchor="middle" font-family="'IBM Plex Sans',sans-serif" font-size="16" font-weight="700" fill="#eef1f6">Use Case Diagram — Sistem MANSYS</text>
    <text x="${W / 2}" y="${H - 12}" text-anchor="middle" font-family="'IBM Plex Sans',sans-serif" font-size="10.5" fill="#555d6d">Garis putus-putus «include» wajib dijalankan, «extend» bersifat opsional/kondisional</text>
    <g>${boxesSvg}</g>
    <g>${edgesSvg}</g>
    <g>${actorsSvg}</g>
    <g>${nodesSvg}</g>
    <g>${labelsSvg}</g>
  </svg>`;
}

function ucLabel(x, y, text, color) {
  const w = text.length * 5.6 + 12;
  return `<g>
    <rect x="${Math.round(x - w / 2)}" y="${Math.round(y - 8)}" width="${Math.round(w)}" height="16" rx="3" fill="#0b0d12" stroke="${color}" stroke-width="0.8" opacity="0.95"/>
    <text x="${Math.round(x)}" y="${Math.round(y + 1)}" text-anchor="middle" dominant-baseline="middle" font-family="'IBM Plex Mono',monospace" font-size="9.5" font-weight="500" fill="${color}">${ucEsc(text)}</text>
  </g>`;
}
