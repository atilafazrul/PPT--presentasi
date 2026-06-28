/**
 * Renderer flowchart SVG.
 * Menggambar flowchart dengan bentuk baku (terminator/proses/keputusan/IO)
 * dan alur dari ATAS ke BAWAH. Tata letak berbasis grid (row, col).
 *
 * Definisi flow:
 * {
 *   cols: <jumlah kolom>,
 *   nodes: [{ id, type, text, r, c }],
 *      type: "start" | "end" | "process" | "decision" | "io"
 *   edges: [{ from, to, label, lane }]
 *      lane: "left" | "right"  (untuk jalur memutar / loop)
 * }
 */

// Palet gaya diagram (mirip draw.io): isian pastel solid, teks gelap.
const FLOW_STYLE = {
  start:    { stroke: "#b85450", fill: "#f8cecc", text: "#1f2430", bold: true },
  end:      { stroke: "#b85450", fill: "#f8cecc", text: "#1f2430", bold: true },
  process:  { stroke: "#d6a829", fill: "#ffe28a", text: "#1f2430", bold: false },
  decision: { stroke: "#d79b00", fill: "#ffc48a", text: "#1f2430", bold: false },
  io:       { stroke: "#6c8ebf", fill: "#dae8fc", text: "#1f2430", bold: false },
};

const FC = {
  colW: 220,
  colGap: 54,
  rowGap: 42,
  padX: 16,
  padY: 11,
  lineH: 17,
  charW: 6.9,
  fontSize: 12.5,
  minW: 130,
  marginX: 56,
  marginY: 26,
  lanePad: 40,
};

function fcWrap(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (test.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function fcEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function fcMeasure(node) {
  const isDecision = node.type === "decision";
  const isTerminator = node.type === "start" || node.type === "end";
  const maxChars = isDecision ? 18 : 24;
  const lines = fcWrap(node.text, maxChars);
  const longest = lines.reduce((m, l) => Math.max(m, l.length), 0);
  let w = Math.max(FC.minW, longest * FC.charW + FC.padX * 2);
  w = Math.min(w, FC.colW);
  let h = lines.length * FC.lineH + FC.padY * 2;

  if (isDecision) {
    w = Math.min(FC.colW, Math.max(w * 1.35, 120));
    h = h * 1.55 + 8;
  } else if (isTerminator) {
    // oval: butuh ekstra lebar & tinggi agar teks tidak menyentuh tepi lengkung
    w = Math.min(FC.colW, Math.max(w * 1.3, 120));
    h += 16;
  }
  node._lines = lines;
  node._w = Math.round(w);
  node._h = Math.round(h);
  return node;
}

function fcShape(node, x, y) {
  const st = FLOW_STYLE[node.type] || FLOW_STYLE.process;
  const w = node._w;
  const h = node._h;
  const cx = x + w / 2;
  const cy = y + h / 2;
  let shape = "";

  if (node.type === "start" || node.type === "end") {
    shape = `<ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="${h / 2}" fill="${st.fill}" stroke="${st.stroke}" stroke-width="1.8"/>`;
  } else if (node.type === "decision") {
    const pts = `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`;
    shape = `<polygon points="${pts}" fill="${st.fill}" stroke="${st.stroke}" stroke-width="1.8"/>`;
  } else if (node.type === "io") {
    const sk = Math.min(26, w * 0.16);
    const pts = `${x + sk},${y} ${x + w},${y} ${x + w - sk},${y + h} ${x},${y + h}`;
    shape = `<polygon points="${pts}" fill="${st.fill}" stroke="${st.stroke}" stroke-width="1.8"/>`;
  } else {
    shape = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" ry="3" fill="${st.fill}" stroke="${st.stroke}" stroke-width="1.8"/>`;
  }

  const lines = node._lines;
  const totalTextH = lines.length * FC.lineH;
  const startY = cy - totalTextH / 2 + FC.lineH * 0.72;
  const weight = st.bold ? 600 : 500;
  let text = `<text x="${cx}" y="${startY}" text-anchor="middle" font-family="'IBM Plex Sans',sans-serif" font-size="${FC.fontSize}" font-weight="${weight}" fill="${st.text}">`;
  lines.forEach((ln, i) => {
    text += `<tspan x="${cx}" dy="${i === 0 ? 0 : FC.lineH}">${fcEscape(ln)}</tspan>`;
  });
  text += `</text>`;
  return shape + text;
}

function renderFlowchart(flow) {
  const nodes = flow.nodes.map((n) => fcMeasure({ ...n }));
  const byId = {};
  nodes.forEach((n) => (byId[n.id] = n));

  const maxRow = Math.max(...nodes.map((n) => n.r));
  const maxCol = Math.max(...nodes.map((n) => n.c), (flow.cols || 1) - 1);

  // tinggi tiap baris = node tertinggi pada baris itu
  const rowH = [];
  for (let r = 0; r <= maxRow; r++) {
    const h = Math.max(0, ...nodes.filter((n) => n.r === r).map((n) => n._h));
    rowH[r] = h || 40;
  }
  const rowTop = [];
  let acc = FC.marginY;
  for (let r = 0; r <= maxRow; r++) {
    rowTop[r] = acc;
    acc += rowH[r] + FC.rowGap;
  }
  const totalH = acc - FC.rowGap + FC.marginY;

  const colStep = FC.colW + FC.colGap;
  const colCenterX = (c) => FC.marginX + FC.lanePad + c * colStep + FC.colW / 2;
  const totalW =
    FC.marginX * 2 + FC.lanePad * 2 + (maxCol + 1) * FC.colW + maxCol * FC.colGap;

  // posisi tiap node
  nodes.forEach((n) => {
    const cx = colCenterX(n.c);
    n._x = Math.round(cx - n._w / 2);
    n._y = Math.round(rowTop[n.r] + (rowH[n.r] - n._h) / 2);
    n._cx = cx;
    n._cy = n._y + n._h / 2;
  });

  const leftLane = FC.marginX + FC.lanePad * 0.45;
  const rightLane = totalW - FC.marginX - FC.lanePad * 0.45;

  // gambar edges
  let edgesSvg = "";
  let labelsSvg = "";
  (flow.edges || []).forEach((e) => {
    const F = byId[e.from];
    const T = byId[e.to];
    if (!F || !T) return;

    let pts;
    if (e.lane === "left" || e.lane === "right") {
      const lx = e.lane === "left" ? leftLane : rightLane;
      const fy = F._cy;
      const ty = T._cy;
      const fx = e.lane === "left" ? F._x : F._x + F._w;
      const tx = e.lane === "left" ? T._x : T._x + T._w;
      pts = [[fx, fy], [lx, fy], [lx, ty], [tx, ty]];
    } else if (T.r > F.r) {
      // alur turun normal: bawah -> atas
      const fx = F._cx;
      const fy = F._y + F._h;
      const tx = T._cx;
      const ty = T._y;
      if (Math.abs(fx - tx) < 1) {
        pts = [[fx, fy], [tx, ty]];
      } else {
        const midY = fy + (ty - fy) / 2;
        pts = [[fx, fy], [fx, midY], [tx, midY], [tx, ty]];
      }
    } else if (T.r === F.r) {
      // samping (jarang)
      const toRight = T._cx > F._cx;
      const fx = toRight ? F._x + F._w : F._x;
      const tx = toRight ? T._x : T._x + T._w;
      const fy = F._cy;
      const ty = T._cy;
      const midX = fx + (tx - fx) / 2;
      pts = [[fx, fy], [midX, fy], [midX, ty], [tx, ty]];
    } else {
      // ke atas tanpa lane -> pakai lane kiri default
      const lx = leftLane;
      pts = [[F._x, F._cy], [lx, F._cy], [lx, T._cy], [T._x, T._cy]];
    }

    const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${Math.round(p[0])},${Math.round(p[1])}`).join(" ");
    edgesSvg += `<path d="${d}" fill="none" stroke="rgba(255,255,255,0.32)" stroke-width="1.5" marker-end="url(#fc-arrow)"/>`;

    if (e.label) {
      let tx, ty;
      // Cari segmen horizontal terpanjang agar label cabang kiri/kanan tidak menumpuk.
      let bestLen = -1;
      for (let i = 0; i < pts.length - 1; i++) {
        const dx = pts[i + 1][0] - pts[i][0];
        const dy = pts[i + 1][1] - pts[i][1];
        if (Math.abs(dy) < 1 && Math.abs(dx) > bestLen) {
          bestLen = Math.abs(dx);
          tx = (pts[i][0] + pts[i + 1][0]) / 2;
          ty = pts[i][1] - 7;
        }
      }
      if (tx === undefined) {
        // tidak ada segmen horizontal: taruh di sisi segmen vertikal pertama
        tx = pts[0][0] + 6;
        ty = pts[0][1] + 18;
      }
      const w = e.label.length * 6.2 + 8;
      labelsSvg += `<g>
        <rect x="${Math.round(tx - w / 2)}" y="${Math.round(ty - 10)}" width="${Math.round(w)}" height="15" rx="3" fill="#0b0d12" stroke="rgba(255,255,255,0.10)" stroke-width="0.8"/>
        <text x="${Math.round(tx)}" y="${Math.round(ty + 1)}" text-anchor="middle" font-family="'IBM Plex Sans',sans-serif" font-size="10.5" font-weight="600" fill="#9aa3b2">${fcEscape(e.label)}</text>
      </g>`;
    }
  });

  let nodesSvg = "";
  nodes.forEach((n) => {
    nodesSvg += fcShape(n, n._x, n._y);
  });

  const W = Math.round(totalW);
  const H = Math.round(totalH);
  return `<svg class="flow-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img">
    <defs>
      <marker id="fc-arrow" markerWidth="9" markerHeight="9" refX="7.5" refY="4" orient="auto" markerUnits="userSpaceOnUse">
        <path d="M0,0 L8,4 L0,8 Z" fill="rgba(255,255,255,0.55)"/>
      </marker>
    </defs>
    <g>${edgesSvg}</g>
    <g>${nodesSvg}</g>
    <g>${labelsSvg}</g>
  </svg>`;
}
