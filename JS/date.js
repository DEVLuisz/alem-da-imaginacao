// Exemplos para a versão pública. Configure seus contatos e locais antes de usar.
// WhatsApp: código do país + DDD + número, somente dígitos.
const DATE_CONFIG = {
  EMAIL: "",
  WHATSAPP: "",
  LUGARES: {
    "Cidade de exemplo - UF": [
      { nome: "Café de exemplo", tipo: "Exemplo · Rua Exemplo, 100", busca: "Café de exemplo, Rua Exemplo, 100, Cidade de exemplo, UF" },
      { nome: "Pizzaria de exemplo", tipo: "Exemplo · Rua Exemplo, 200", busca: "Pizzaria de exemplo, Rua Exemplo, 200, Cidade de exemplo, UF" }
    ],
    "Outra cidade de exemplo - UF": [
      { nome: "Restaurante de exemplo", tipo: "Exemplo · Avenida Exemplo, 300", busca: "Restaurante de exemplo, Avenida Exemplo, 300, Outra cidade de exemplo, UF" },
      { nome: "Sushi de exemplo", tipo: "Exemplo · Avenida Exemplo, 400", busca: "Sushi de exemplo, Avenida Exemplo, 400, Outra cidade de exemplo, UF" }
    ]
  }
};

(function () {
  const $ = (id) => document.getElementById(id);
  const overlay = $("date-overlay"), body = $("date-body"), back = $("date-back");
  const steps = [...$("date-steps").children];
  const mapa = (q) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
  let step = 0, sel = {}, mes = new Date(); mes.setDate(1);

  function open() { step = 0; sel = {}; render(); overlay.classList.add("open"); overlay.setAttribute("aria-hidden", "false"); }
  function close() { overlay.classList.remove("open"); overlay.setAttribute("aria-hidden", "true"); }
  $("cal-btn").addEventListener("click", open);
  $("date-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  back.addEventListener("click", () => { if (step > 0) { step--; render(); } });

  const fmt = (d) => d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  function render() {
    steps.forEach((li, i) => li.classList.toggle("on", i <= step));
    back.style.visibility = step > 0 ? "visible" : "hidden";
    body.innerHTML = "";
    [diaStep, cidadeStep, lugarStep, avisarStep][step]();
  }

  function diaStep() {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    body.innerHTML = `<p class="date-q">Qual dia?</p>
      <div class="cal-head"><button id="m-prev" aria-label="Mês anterior">‹</button>
      <span>${mes.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</span>
      <button id="m-next" aria-label="Próximo mês">›</button></div><div class="cal-grid" id="cal-grid"></div>`;
    const g = $("cal-grid");
    ["D", "S", "T", "Q", "Q", "S", "S"].forEach((d) => g.insertAdjacentHTML("beforeend", `<span class="cal-dow">${d}</span>`));
    for (let i = 0; i < mes.getDay(); i++) g.appendChild(document.createElement("span"));
    const dias = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= dias; d++) {
      const data = new Date(mes.getFullYear(), mes.getMonth(), d);
      const b = document.createElement("button");
      b.className = "cal-day" + (+data === +hoje ? " today" : "");
      b.textContent = d; b.disabled = data < hoje;
      b.onclick = () => { sel.dia = data; step = 1; render(); };
      g.appendChild(b);
    }
    const atual = new Date(); atual.setDate(1); atual.setHours(0, 0, 0, 0);
    $("m-prev").disabled = mes <= atual;
    $("m-prev").onclick = () => { mes.setMonth(mes.getMonth() - 1); render(); };
    $("m-next").onclick = () => { mes.setMonth(mes.getMonth() + 1); render(); };
  }

  function lista(titulo, itens) {
    body.innerHTML = `<p class="date-q">${titulo}</p><div class="opts"></div>`;
    itens.forEach((it) => body.lastChild.appendChild(it));
  }
  function botao(html, fn) { const b = document.createElement("button"); b.className = "opt"; b.innerHTML = html; b.onclick = fn; return b; }

  function cidadeStep() {
    lista(`${fmt(sel.dia)} 💜<br>Em qual cidade?`, Object.keys(DATE_CONFIG.LUGARES).map((c) =>
      botao(`<span>${c}</span><span>→</span>`, () => { sel.cidade = c; step = 2; render(); })));
  }

  function lugarStep() {
    lista(`Onde a gente vai em ${sel.cidade.split(" - ")[0]}?`, DATE_CONFIG.LUGARES[sel.cidade].map((l) => {
      const b = botao(`<span>${l.nome}<br><small>${l.tipo}</small></span><a href="${mapa(l.busca)}" target="_blank" rel="noopener">ver no mapa ↗</a>`,
        () => { sel.lugar = l; step = 3; render(); });
      b.querySelector("a").onclick = (e) => e.stopPropagation();
      return b;
    }));
  }

  function avisarStep() {
    const link = mapa(sel.lugar.busca);
    const msg = `Vamos marcar nosso date! 💜\n\n📅 Dia: ${fmt(sel.dia)}\n📍 Cidade: ${sel.cidade}\n✨ Lugar: ${sel.lugar.nome}\n🗺️ Mapa: ${link}`;
    const mail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(DATE_CONFIG.EMAIL)}&su=${encodeURIComponent("Nosso date 💜")}&body=${encodeURIComponent(msg)}`;
    const wa = `https://api.whatsapp.com/send?phone=${DATE_CONFIG.WHATSAPP}&text=${encodeURIComponent(msg)}`;
    body.innerHTML = `<p class="date-q">Agora é só me avisar!</p>
      <div class="resumo">📅 ${fmt(sel.dia)}<br>📍 ${sel.cidade}<br>✨ ${sel.lugar.nome} · <a href="${link}" target="_blank" rel="noopener">mapa ↗</a></div>
      <div class="opts">
        <button class="opt" id="go-mail"><span>✉️ Avisar por e-mail</span><span>↗</span></button>
        <button class="opt" id="go-wa"><span>💬 Avisar pelo WhatsApp</span><span>↗</span></button>
      </div>`;
    const mailButton = $("go-mail"), waButton = $("go-wa");
    mailButton.disabled = !DATE_CONFIG.EMAIL.trim();
    waButton.disabled = !DATE_CONFIG.WHATSAPP.trim();
    mailButton.onclick = () => { if (!mailButton.disabled) window.open(mail, "_blank", "noopener"); };
    waButton.onclick = () => { if (!waButton.disabled) window.open(wa, "_blank", "noopener"); };
  }
})();
