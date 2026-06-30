let currentSlide = 0;
let notesVisible = false;
let slideDirection = "next";

const landing = document.getElementById("landing");
const presentation = document.getElementById("presentation");
const slideCard = document.getElementById("slide-card");
const progressFill = document.getElementById("progress-fill");
const slideCounter = document.getElementById("slide-counter");
const slideCategory = document.getElementById("slide-category");
const notesText = document.getElementById("notes-text");
const speakerNotes = document.getElementById("speaker-notes");
const slideDots = document.getElementById("slide-dots");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const startBtn = document.getElementById("start-btn");
const notesToggle = document.getElementById("notes-toggle");

function buildDots() {
  slideDots.innerHTML = "";
  SLIDES.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("aria-label", `Slide ${i + 1}`);
    dot.addEventListener("click", () => {
      slideDirection = i > currentSlide ? "next" : "prev";
      goToSlide(i);
    });
    slideDots.appendChild(dot);
  });
}

function pointCard(pt, index) {
  const cls = pt.type ? `point-card ${pt.type}` : "point-card";
  const num = String(index + 1).padStart(2, "0");
  return `
    <div class="${cls}">
      <span class="point-num">${num}</span>
      <div class="point-body">
        <div class="point-title">${pt.title}</div>
        <div class="point-desc">${pt.desc}</div>
      </div>
    </div>
  `;
}

function buildSlideHTML(slide, slideIndex) {
  const cat = slide.category || "default";

  if (slide.thankYou) {
    return `
      <div class="slide-panel cat-${cat} thankyou-panel">
        <img src="assets/logos/logo-hsr.png" alt="PT. HSR" class="ty-corner-logo ty-corner-hsr" />
        <img src="assets/logos/logo-umn-white.png" alt="UMN" class="ty-corner-logo ty-corner-umn" />
        <div class="thankyou-slide">
          <span class="slide-tag">${slide.categoryLabel || "Terima Kasih"}</span>
          <div class="thankyou-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <h2>Terima Kasih</h2>
          <p>Sesi Tanya Jawab</p>
          <span class="thankyou-meta">Atila Fazrul Falah &middot; Informatika UMN &middot; PT. Hayati Semesta Raharja</span>
        </div>
      </div>
    `;
  }

  let body = "";

  if (slide.endpoints && slide.tables?.length) {
    const methodClass = (m) => `ep-method ep-${String(m).toLowerCase()}`;
    body += `<div class="endpoint-grid endpoint-grid-${slide.tables.length}">`;
    slide.tables.forEach((tbl) => {
      body += `
        <div class="endpoint-card">
          <span class="endpoint-title">${tbl.title}</span>
          <table class="endpoint-table">
            <thead>
              <tr><th class="ep-no">No</th><th class="ep-m">Method</th><th class="ep-ep">Endpoint</th><th class="ep-d">Deskripsi</th></tr>
            </thead>
            <tbody>`;
      tbl.rows.forEach((r, i) => {
        body += `<tr>
          <td class="ep-no">${i + 1}</td>
          <td><span class="${methodClass(r.method)}">${r.method}</span></td>
          <td><code class="ep-path">${r.path}</code></td>
          <td class="ep-desc">${r.desc}</td>
        </tr>`;
      });
      body += `
            </tbody>
          </table>
        </div>`;
    });
    body += `</div>`;
    if (slide.imageCaption) body += `<p class="image-caption">${slide.imageCaption}</p>`;
  } else if (slide.flowGallery?.length) {
    const n = slide.flowGallery.length;
    body += `<div class="flow-gallery flow-gallery-${n}">`;
    slide.flowGallery.forEach((fc) => {
      const inner = fc.flow
        ? renderFlowchart(fc.flow)
        : `<img src="${fc.src}" alt="${fc.label}" />`;
      body += `
        <div class="image-frame flow-gallery-item">
          <span class="image-label">${fc.label}</span>
          <div class="image-wrap flowchart-wrap">${inner}</div>
        </div>`;
    });
    body += `</div>`;
    if (slide.imageCaption) body += `<p class="image-caption">${slide.imageCaption}</p>`;
  } else if (slide.moduleImpl) {
    body += `<div class="module-impl">`;
    body += `<div class="module-split">`;
    if (slide.desc) {
      const paras = Array.isArray(slide.desc) ? slide.desc : [slide.desc];
      body += `
        <div class="module-col module-col-info">
          <div class="image-frame module-info-frame">
            <span class="image-label">Penjelasan Modul</span>
            <div class="module-info-body">`;
      paras.forEach((p) => {
        body += `<p class="module-summary">${p}</p>`;
      });
      body += `
            </div>
          </div>
        </div>`;
    }
    if (slide.images?.length) {
      let gridClass = "screenshot-single";
      if (slide.images.length === 2) gridClass = "screenshot-grid";
      else if (slide.images.length > 2) gridClass = "screenshot-grid screenshot-grid-2col";
      body += `<div class="module-col module-col-shots"><div class="${gridClass}">`;
      slide.images.forEach((img) => {
        body += `
          <div class="image-frame">
            <span class="image-label">${img.label}</span>
            <div class="image-wrap screenshot-wrap"><img src="${img.src}" alt="${img.label}" /></div>
          </div>`;
      });
      body += `</div></div>`;
    }
    body += `</div>`;
    if (slide.imageCaption) body += `<p class="image-caption">${slide.imageCaption}</p>`;
    body += `</div>`;
  } else if (slide.usecase && slide.points?.length) {
    body += `<div class="usecase-split">`;
    body += `<div class="usecase-col-text">`;
    if (slide.intro) body += `<p class="usecase-lead">${slide.intro}</p>`;
    body += `<ul class="usecase-intro">`;
    slide.points.forEach((pt) => {
      body += `<li><strong>${pt.title}:</strong> ${pt.desc}</li>`;
    });
    body += `</ul>`;
    if (slide.outro) body += `<p class="usecase-lead usecase-outro">${slide.outro}</p>`;
    body += `</div>`;
    body += `<div class="usecase-col-diagram">
      <div class="image-frame">
        <span class="image-label">Use Case Diagram</span>
        <div class="image-wrap flowchart-wrap flowchart-full">${renderUsecase()}</div>
      </div>
      ${slide.imageCaption ? `<p class="image-caption">${slide.imageCaption}</p>` : ""}
    </div>`;
    body += `</div>`;
  } else if (slide.image || slide.usecase) {
    body += `<div class="image-slide">`;
    if (slide.image2) {
      body += `<div class="image-grid-2">
        <div class="image-frame"><span class="image-label">Tampilan 1</span><div class="image-wrap"><img src="${slide.image}" alt="${slide.title}" /></div></div>
        <div class="image-frame"><span class="image-label">Tampilan 2</span><div class="image-wrap"><img src="${slide.image2}" alt="${slide.title}" /></div></div>
      </div>`;
    } else {
      const label = slide.imageLabel || (slide.flowchart ? "Flowchart Sistem" : "Implementasi Sistem");
      const wrapClass = slide.flowchartFull
        ? "image-wrap flowchart-wrap flowchart-full"
        : slide.flowchart
          ? "image-wrap flowchart-wrap"
          : "image-wrap";
      const inner = slide.usecase
        ? renderUsecase()
        : slide.flow
          ? renderFlowchart(slide.flow)
          : `<img src="${slide.image}" alt="${slide.title}" />`;
      body += `
        <div class="image-frame">
          <span class="image-label">${label}</span>
          <div class="${wrapClass}">${inner}</div>
        </div>
      `;
    }
    if (slide.imageCaption) body += `<p class="image-caption">${slide.imageCaption}</p>`;
    body += `</div>`;
  } else if (slide.narrative || slide.sections) {
    if (slide.companyProfile && slide.logo) {
      body += `
        <div class="company-profile-banner">
          <img src="${slide.logo}" alt="PT. Hayati Semesta Raharja" class="company-profile-logo" />
          <div class="company-profile-copy">
            <strong>PT. Hayati Semesta Raharja</strong>
            <span>Your Partner in Healthcare Business</span>
          </div>
        </div>`;
    }
    body += `<div class="uraian-block">`;
    (slide.narrative || []).forEach((p) => {
      body += `<p class="uraian-lead">${p}</p>`;
    });
    if (slide.sections?.length) {
      body += `<div class="uraian-sections">`;
      slide.sections.forEach((sec) => {
        body += `
          <div class="uraian-section">
            <span class="uraian-heading">${sec.heading}</span>
            <ul class="uraian-list">`;
        sec.items.forEach((it) => {
          body += `<li><span class="ul-bullet" aria-hidden="true"></span><span>${it}</span></li>`;
        });
        body += `
            </ul>
          </div>`;
      });
      body += `</div>`;
    }
    body += `</div>`;
  } else if (slide.points) {
    const gridClass = slide.points.length === 5 ? "points-grid five-items" : "points-grid";
    if (slide.companyProfile && slide.logo) {
      body += `
        <div class="company-profile-banner">
          <img src="${slide.logo}" alt="PT. Hayati Semesta Raharja" class="company-profile-logo" />
          <div class="company-profile-copy">
            <strong>PT. Hayati Semesta Raharja</strong>
            <span>Your Partner in Healthcare Business</span>
          </div>
        </div>`;
    }
    body += `<div class="${gridClass}">`;
    slide.points.forEach((pt, i) => { body += pointCard(pt, i); });
    body += `</div>`;
  }

  return `
    <div class="slide-panel cat-${cat}${slide.moduleImpl ? " impl-slide" : ""}${slide.flowchartFull ? " flowchart-slide" : ""}">
      <div class="slide-header">
        <div class="slide-header-top">
          <span class="slide-tag">${slide.categoryLabel || ""}</span>
          <span class="slide-index">${String(slideIndex + 1).padStart(2, "0")}</span>
        </div>
        <h2 class="slide-title">${slide.title}</h2>
        <p class="slide-subtitle">${slide.subtitle}</p>
      </div>
      <div class="slide-body">${body}</div>
    </div>
  `;
}

function renderSlide(index, instant = false) {
  const slide = SLIDES[index];
  if (!slide) return;

  const slideStage = document.querySelector(".slide-stage");
  const slideContainer = document.getElementById("slide-container");
  if (slideStage) slideStage.classList.toggle("wide-slide", !!(slide.flowchartFull || slide.moduleImpl));
  if (slideContainer) slideContainer.classList.toggle("wide-container", !!(slide.flowchartFull || slide.moduleImpl));

  slideCard.className = instant
    ? "slide-card no-anim"
    : `slide-card enter-${slideDirection}`;
  if (!instant) void slideCard.offsetWidth;

  slideCard.innerHTML = buildSlideHTML(slide, index);
  notesText.textContent = slide.notes || "";

  const container = document.getElementById("slide-container");
  if (container) container.scrollTop = 0;

  updateUI(index);
}

function updateUI(index) {
  const total = SLIDES.length;
  progressFill.style.width = `${((index + 1) / total) * 100}%`;
  slideCounter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  slideCategory.textContent = SLIDES[index].categoryLabel || "";
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === total - 1;

  slideDots.querySelectorAll(".dot").forEach((el, i) => {
    el.classList.toggle("active", i === index);
  });

  notesToggle.classList.toggle("active", notesVisible);
}

function goToSlide(index) {
  if (index < 0 || index >= SLIDES.length || index === currentSlide) return;
  currentSlide = index;
  renderSlide(currentSlide);
}

function nextSlide() {
  if (currentSlide < SLIDES.length - 1) {
    slideDirection = "next";
    goToSlide(currentSlide + 1);
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    slideDirection = "prev";
    goToSlide(currentSlide - 1);
  }
}

function startPresentation() {
  landing.style.opacity = "0";
  landing.style.transform = "scale(0.98)";
  landing.style.transition = "opacity 0.4s ease, transform 0.4s ease";
  setTimeout(() => {
    landing.classList.remove("active");
    landing.style.cssText = "";
    presentation.classList.add("active");
    slideDirection = "next";
    currentSlide = 0;
    renderSlide(0, true);
    window.dispatchEvent(new Event("presentation-start"));
  }, 400);
}

function toggleNotes() {
  notesVisible = !notesVisible;
  speakerNotes.classList.toggle("hidden", !notesVisible);
  notesToggle.classList.toggle("active", notesVisible);
}

startBtn.addEventListener("click", startPresentation);
prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);
notesToggle.addEventListener("click", toggleNotes);

document.addEventListener("keydown", (e) => {
  if (!presentation.classList.contains("active")) return;
  if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); nextSlide(); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); prevSlide(); }
  else if (e.key === "n" || e.key === "N") toggleNotes();
  else if (e.key === "Escape") {
    presentation.classList.remove("active");
    landing.classList.add("active");
  }
});

// swipe navigation untuk layar sentuh
(function setupSwipe() {
  let startX = 0;
  let startY = 0;
  let startT = 0;
  let tracking = false;

  presentation.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) { tracking = false; return; }
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    startT = Date.now();
    tracking = true;
  }, { passive: true });

  presentation.addEventListener("touchend", (e) => {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    const dt = Date.now() - startT;
    // horizontal dominan, jarak cukup, dan tidak terlalu lambat (bukan scroll)
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.6 && dt < 600) {
      if (dx < 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });
})();

buildDots();
