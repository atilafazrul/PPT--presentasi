const CODE_LINES = [
  "const Dashboard = () => {",
  "  const [data, setData] = useState([]);",
  "  useEffect(() => fetchAssets(), []);",
  "  return <AssetChart data={data} />;",
  "};",
  "",
  "Route::get('/api/inventory', [",
  "  InventoryController::class, 'index'",
  "]);",
  "",
  "public function store(Request $req) {",
  "  $validated = $req->validate([",
  "    'nama' => 'required|string',",
  "    'status' => 'in:active,done',",
  "  ]);",
  "  return Asset::create($validated);",
  "}",
  "",
  "SELECT a.*, k.nama FROM assets a",
  "JOIN karyawan k ON a.pic_id = k.id",
  "WHERE a.status = 'active';",
  "",
  "axios.get('/api/proyek')",
  "  .then(res => setProjects(res.data))",
  "  .catch(err => console.error(err));",
  "",
  "Schema::create('cuti', function ($t) {",
  "  $t->id();",
  "  $t->foreignId('karyawan_id');",
  "  $t->date('tanggal_mulai');",
  "  $t->enum('status', ['pending','approved']);",
  "});",
  "",
  "// MANSYS - Management System",
  "export default function App() {",
  "  return (",
  "    <BrowserRouter>",
  "      <Routes>",
  "        <Route path='/' element={<Dashboard />} />",
  "        <Route path='/inventory' element={<Inventory />} />",
  "      </Routes>",
  "    </BrowserRouter>",
  "  );",
  "}",
];

function buildStream() {
  const stream = [];
  CODE_LINES.forEach((line) => {
    stream.push(...line.split(""));
    stream.push("\n");
  });
  return stream;
}

function initCodeRain(canvas) {
  if (!canvas) return null;

  const parent = canvas.parentElement;
  const ctx = canvas.getContext("2d");
  const stream = buildStream();
  const colWidth = 14;
  let columns = [];
  let animId = null;
  let running = true;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function isEdgeColumn(x, w) {
    const edge = w * 0.2;
    return x < edge || x > w - edge;
  }

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (w === 0 || h === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const totalCols = Math.ceil(w / colWidth);
    columns = [];
    for (let i = 0; i < totalCols; i++) {
      const x = i * colWidth;
      if (!isEdgeColumn(x + colWidth / 2, w)) continue;
      columns.push({
        x,
        y: Math.random() * h,
        speed: 0.4 + Math.random() * 0.9,
        offset: Math.floor(Math.random() * stream.length),
        len: 8 + Math.floor(Math.random() * 14),
        opacity: 0.18 + Math.random() * 0.28,
      });
    }
  }

  function draw() {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, w, h);

    const fontSize = 11;
    ctx.font = `${fontSize}px "IBM Plex Mono", "Courier New", monospace`;
    ctx.textBaseline = "top";

    columns.forEach((col) => {
      for (let j = 0; j < col.len; j++) {
        const charY = col.y - j * fontSize;
        if (charY < -fontSize || charY > h) continue;

        const idx = (col.offset + j) % stream.length;
        const ch = stream[idx] === "\n" ? " " : stream[idx];

        const fade = 1 - j / col.len;
        const alpha = col.opacity * fade;

        if (j === 0) {
          ctx.fillStyle = `rgba(94, 234, 212, ${Math.min(alpha * 2.2, 0.55)})`;
        } else if (ch === "{" || ch === "}" || ch === "(" || ch === ")") {
          ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;
        } else if (ch === "/" || ch === "*") {
          ctx.fillStyle = `rgba(96, 165, 250, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(139, 147, 163, ${alpha})`;
        }

        ctx.fillText(ch, col.x, charY);
      }

      if (!prefersReduced) {
        col.y += col.speed;
        if (col.y - col.len * fontSize > h) {
          col.y = -col.len * fontSize;
          col.offset = Math.floor(Math.random() * stream.length);
          col.speed = 0.4 + Math.random() * 0.9;
        }
      }
    });
  }

  function loop() {
    if (!running) return;
    draw();
    animId = requestAnimationFrame(loop);
  }

  resize();
  loop();

  const onResize = () => resize();
  window.addEventListener("resize", onResize);

  const ro = new ResizeObserver(() => {
    if (parent.clientWidth > 0 && parent.clientHeight > 0) resize();
  });
  ro.observe(parent);

  return {
    resize,
    destroy() {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    },
    pause() {
      running = false;
      if (animId) cancelAnimationFrame(animId);
    },
    resume() {
      resize();
      if (running) return;
      running = true;
      loop();
    },
  };
}

let landingRain = null;
let presRain = null;

function setupCodeBackgrounds() {
  const landingCanvas = document.getElementById("code-canvas-landing");
  const presCanvas = document.getElementById("code-canvas-pres");
  const landing = document.getElementById("landing");
  const presentation = document.getElementById("presentation");

  landingRain = initCodeRain(landingCanvas);
  presRain = initCodeRain(presCanvas);

  // landing aktif dulu, pause presentasi
  if (presRain) presRain.pause();

  const syncScreens = () => {
    const landingActive = landing.classList.contains("active");
    const presActive = presentation.classList.contains("active");
    if (landingRain) {
      landingActive ? landingRain.resume() : landingRain.pause();
    }
    if (presRain) {
      if (presActive) {
        presRain.resize();
        presRain.resume();
      } else {
        presRain.pause();
      }
    }
  };

  const observer = new MutationObserver(syncScreens);

  observer.observe(landing, { attributes: true, attributeFilter: ["class"] });
  observer.observe(presentation, { attributes: true, attributeFilter: ["class"] });

  window.addEventListener("presentation-start", () => {
    requestAnimationFrame(() => {
      if (presRain) {
        presRain.resize();
        presRain.resume();
      }
      if (landingRain) landingRain.pause();
    });
  });
}

document.addEventListener("DOMContentLoaded", setupCodeBackgrounds);
