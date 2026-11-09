(function () {
  const FRASE = "Você é algo além da imaginação. Para mim você é";
  const DELAY_LETRA = 35; // ms entre cada letra (menor = mais rápido)

  // ---------- 1. Frase montando letra por letra ----------
  const introText = document.getElementById("intro-text");
  let i = 0;
  FRASE.split(" ").forEach((palavra, wi, arr) => {
    const w = document.createElement("span");
    w.className = "word";
    for (const ch of palavra) {
      const c = document.createElement("span");
      c.className = "char";
      c.textContent = ch;
      c.style.animationDelay = i++ * DELAY_LETRA + "ms";
      w.appendChild(c);
    }
    introText.appendChild(w);
    if (wi < arr.length - 1) { introText.appendChild(document.createTextNode(" ")); i++; }
  });
  const totalMs = i * DELAY_LETRA + 600;
  setTimeout(() => {
    document.getElementById("intro").classList.add("hide");
    document.getElementById("globe-wrapper").classList.add("show");
  }, totalMs + 1300);

  // ---------- 2. Globo ----------
  const globe = document.getElementById("globe");
  const palavras = window.PALAVRAS || [];
  const n = palavras.length;
  const tags = palavras.map((p, k) => {
    // distribuição uniforme numa esfera (espiral de Fibonacci)
    const y = 1 - (2 * (k + 0.5)) / n;
    const r = Math.sqrt(1 - y * y);
    const th = k * Math.PI * (3 - Math.sqrt(5));
    const el = document.createElement("span");
    el.className = "tag";
    el.textContent = p.palavra;
    globe.appendChild(el);
    return { el, x: Math.cos(th) * r, y, z: Math.sin(th) * r, data: p };
  });

  // velocidade de rotação (direção atual). Mantém girando até mudar de novo.
  let vx = 0.0015, vy = 0.0009; // velocidade (menor = mais devagar)
  let hovering = false; // pausa com o mouse em cima de uma palavra
  globe.addEventListener("pointerover", (e) => { if (e.target.classList.contains("tag")) hovering = true; });
  globe.addEventListener("pointerout", (e) => { if (e.target.classList.contains("tag")) hovering = false; });

  function rotate(ax, ay) {
    const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
    for (const t of tags) {
      // em torno do eixo Y (horizontal) e eixo X (vertical)
      let x = t.x * cy + t.z * sy, z = -t.x * sy + t.z * cy;
      let y = t.y * cx - z * sx; z = t.y * sx + z * cx;
      t.x = x; t.y = y; t.z = z;
    }
  }

  function render() {
    const R = globe.clientWidth / 2 * 0.85;
    for (const t of tags) {
      const s = (t.z + 2) / 3; // perspectiva
      t.el.style.transform = `translate(-50%,-50%) translate(${t.x * R}px, ${t.y * R}px) scale(${0.6 + s * 0.6})`;
      t.el.style.opacity = 0.25 + ((t.z + 1) / 2) * 0.75;
      t.el.style.zIndex = Math.round((t.z + 1) * 100);
    }
  }

  let dragging = false, moved = false, lastX = 0, lastY = 0, lastT = 0;
  function loop() {
    if (!dragging && !hovering) rotate(vy, vx);
    render();
    requestAnimationFrame(loop);
  }
  loop();

  globe.addEventListener("pointerdown", (e) => {
    dragging = true; moved = false;
    lastX = e.clientX; lastY = e.clientY; lastT = performance.now();
    globe.classList.add("dragging");
    globe.setPointerCapture(e.pointerId);
  });
  globe.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
    const k = 0.006;
    rotate(-dy * k, dx * k);
    // nova direção = direção do arraste (velocidade limitada)
    const now = performance.now(), dt = Math.max(16, now - lastT);
    const lim = 0.012;
    if (moved) {
      vx = Math.max(-lim, Math.min(lim, (dx / dt) * 0.03));
      vy = Math.max(-lim, Math.min(lim, (-dy / dt) * 0.03));
    }
    lastX = e.clientX; lastY = e.clientY; lastT = now;
  });
  const end = (e) => {
    if (!dragging) return;
    dragging = false;
    globe.classList.remove("dragging");
    // garante que nunca pare totalmente
    if (Math.abs(vx) + Math.abs(vy) < 0.002) { vx = vx || 0.0015; }
    if (!moved) {
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const t = tags.find((t) => t.el === target);
      if (t) openPanel(t);
    }
  };
  globe.addEventListener("pointerup", end);
  globe.addEventListener("pointercancel", () => { dragging = false; globe.classList.remove("dragging"); });

  // setas do teclado também mudam a direção
  window.addEventListener("keydown", (e) => {
    const s = 0.0025;
    if (e.key === "ArrowLeft") { vx = -s; vy = 0; }
    if (e.key === "ArrowRight") { vx = s; vy = 0; }
    if (e.key === "ArrowUp") { vy = s; vx = 0; }
    if (e.key === "ArrowDown") { vy = -s; vx = 0; }
    if (e.key === "Escape") closePanel();
  });

  // ---------- 3. Caixinha lateral ----------
  const panel = document.getElementById("panel");
  let active = null;
  function openPanel(t) {
    if (active) active.el.classList.remove("active");
    active = t; t.el.classList.add("active");
    document.getElementById("panel-title").textContent = t.data.palavra;
    document.getElementById("panel-meaning").textContent = t.data.significado;
    const why = (t.data.porque || "").trim();
    document.getElementById("panel-why").textContent = why;
    document.getElementById("panel-why-box").style.display = why ? "" : "none";
    panel.classList.remove("open"); void panel.offsetWidth; // reinicia animação
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    document.body.classList.add("panel-open");
  }
  function closePanel() {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("panel-open");
    if (active) active.el.classList.remove("active");
    active = null;
  }
  document.getElementById("panel-close").addEventListener("click", closePanel);
})();
