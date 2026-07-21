/* =========================================================
   JUSTECH CONVITES PREMIUM — "Site do Evento"
   script.js — Vanilla JS, sem dependências.
   ========================================================= */

/* =========================================================
   ⚙️  PAINEL DE CONFIGURAÇÃO
   -----------------------------------------------------------
   Para reutilizar este convite em outro evento, edite APENAS
   os valores abaixo.
   ========================================================= */
const config = {

  // Sempre que trocar qualquer arquivo em /assets, mude este
  // valor (força o navegador a baixar os arquivos novos).
  CACHE_VERSION: "20260720b",

  music: "assets/music.mp3",

  // Link do Google Maps do local da festa
  mapsLink: "https://maps.google.com/?q=Local+da+Festa",

  // WhatsApp que recebe a confirmação de presença (DDI+DDD+NÚMERO)
  whatsappNumber: "5524999999999",
  whatsappMessage:
    "Olá! Confirmo minha presença na festa de 15 anos da Sophia.\nMeu nome é: ",

  // WhatsApp do desenvolvedor (assinatura no rodapé)
  developerWhatsapp: "5524998694118",
  developerWhatsappMessage: "Olá! Vi seu convite digital e quero um também.",

  // Chave PIX exibida na Etapa 3
  pix: {
    key: "24999999999",
    keyType: "Celular",
    ownerName: "Nome do Responsável",
  },

  // =========================================================
  // DADOS DO EVENTO
  // =========================================================
  event: {
    nome: "Sophia Micaelle",
    tituloAniversario: "XV Anos",
    subtitulo: "Venha participar\nde uma noite\ninesquecível",

    diaSemana: "Sábado",
    dia: "26",
    mes: "Julho",
    ano: "2026",
    hora: "19\n00\nH",

    // Usado no contador regressivo e no Google Agenda.
    // Formato ISO com fuso horário (-03:00 = horário de Brasília).
    dataISO: "2026-07-26T19:00:00-03:00",
    duracaoHoras: 5,

    dataLabel: "Sábado, 26 de Julho de 2026",
    horaLabel: "às 19:00h",

    local: "Espaço Villa Jardim",
    endereco: "Três Rios, RJ",
    traje: "Esporte Fino / Gala",
  },
};

/* =========================================================
   ELEMENTOS
   ========================================================= */
const splashScreen = document.getElementById("splash-screen");
const appScreen = document.getElementById("app");
const enterBtn = document.getElementById("enter-btn");

const envelopeScene = document.getElementById("envelope-scene");
const envelopeVisual = document.getElementById("envelope-visual");
const letterCard = document.getElementById("letter-card");
const letterSparkles = document.getElementById("letter-sparkles");

const bgAudio = document.getElementById("bg-audio");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");
const musicVolume = document.getElementById("music-volume");

function withCacheBust(path) {
  if (!path) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}v=${encodeURIComponent(config.CACHE_VERSION || "1")}`;
}

bgAudio.src = withCacheBust(config.music);
bgAudio.preload = "auto";
bgAudio.volume = parseFloat(musicVolume.value);
bgAudio.load();

/* =========================================================
   TRANSIÇÃO: ENVELOPE -> SITE DO EVENTO
   ========================================================= */
enterBtn.addEventListener("click", enterInvite);

let inviteOpened = false;

function enterInvite() {
  if (inviteOpened) return;
  inviteOpened = true;
  enterBtn.disabled = true;

  if (navigator.vibrate) navigator.vibrate(25);
  attemptPlayMusic();

  envelopeScene.classList.add("opening");
  envelopeVisual.classList.add("opening");

  window.setTimeout(() => {
    letterSparkles.classList.add("active");
    letterCard.classList.add("rising");
  }, 650);

  window.setTimeout(() => {
    envelopeVisual.classList.remove("opening");
    envelopeVisual.classList.add("receding");
  }, 1450);

  window.setTimeout(() => { letterCard.classList.add("at-peak"); }, 1600);
  window.setTimeout(() => { letterCard.classList.add("expanding"); }, 1950);

  window.setTimeout(() => {
    splashScreen.setAttribute("hidden", "");
    splashScreen.style.display = "none";
    splashScreen.style.pointerEvents = "none";
    appScreen.removeAttribute("hidden");
    renderEventData();
    initWizard();
  }, 2000);
}

/* =========================================================
   TEXTOS DA ETAPA 1 (arte do convite)
   ========================================================= */
function renderEventData() {
  const e = config.event;
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  set("htxt-name", e.nome);
  set("htxt-xvanos", e.tituloAniversario);
  set("htxt-subtitle", e.subtitulo);
  set("htxt-weekday", e.diaSemana);
  set("htxt-day", e.dia);
  set("htxt-month", e.mes);
  set("htxt-year", e.ano);
  set("htxt-time", e.hora);

  set("venue-name", e.local);
  set("venue-address", e.endereco);
  set("event-date-label", e.dataLabel);
  set("event-time-label", e.horaLabel);
  set("dresscode-label", e.traje);

  set("pix-type", config.pix.keyType);
  set("pix-key", config.pix.key);
  set("pix-owner", config.pix.ownerName);
}

/* =========================================================
   WIZARD — navegação por etapas (slide + fade)
   ========================================================= */
const wizardTrack = document.getElementById("wizard-track");
const steps = Array.from(document.querySelectorAll(".step"));
const dots = Array.from(document.querySelectorAll(".dot"));
const navBack = document.getElementById("nav-back");
const navNext = document.getElementById("nav-next");

const STEP_LABELS_NEXT = [
  "Avançar Detalhes +",
  "Confirmar Presença ➜",
  "🏠 Voltar ao Início",
];

let currentStep = 0;
let wizardInitialized = false;

function initWizard() {
  if (wizardInitialized) return;
  wizardInitialized = true;

  navBack.addEventListener("click", () => goToStep(currentStep - 1));
  navNext.addEventListener("click", () => {
    if (currentStep === 2) {
      goToStep(0);
    } else {
      goToStep(currentStep + 1);
    }
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => goToStep(parseInt(dot.dataset.i, 10)));
  });

  // Deslizar (swipe) entre etapas no toque
  let touchStartX = null;
  wizardTrack.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  wizardTrack.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 60) {
      if (dx < 0 && currentStep < 2) goToStep(currentStep + 1);
      if (dx > 0 && currentStep > 0) goToStep(currentStep - 1);
    }
    touchStartX = null;
  }, { passive: true });

  goToStep(0, true);
  startCountdown();
}

function goToStep(index, isInitial) {
  index = Math.max(0, Math.min(2, index));
  currentStep = index;

  wizardTrack.style.transform = `translate3d(${-index * (100 / 3)}%, 0, 0)`;

  steps.forEach((step, i) => {
    step.classList.toggle("is-active", i === index);
  });

  dots.forEach((dot, i) => {
    const di = parseInt(dot.dataset.i, 10);
    dot.classList.toggle("is-active", di === index);
    dot.classList.toggle("is-done", di < index);
  });

  navBack.hidden = index === 0;
  navNext.textContent = STEP_LABELS_NEXT[index];

  if (navigator.vibrate && !isInitial) navigator.vibrate(12);
}

/* =========================================================
   CONTAGEM REGRESSIVA
   ========================================================= */
function startCountdown() {
  const target = new Date(config.event.dataISO).getTime();
  const dEl = document.getElementById("cd-days");
  const hEl = document.getElementById("cd-hours");
  const mEl = document.getElementById("cd-min");
  const sEl = document.getElementById("cd-sec");
  if (!dEl || Number.isNaN(target)) return;

  const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

  function tick() {
    const now = Date.now();
    let diff = Math.max(0, target - now);

    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const minutes = Math.floor(diff / 60000);
    diff -= minutes * 60000;
    const seconds = Math.floor(diff / 1000);

    dEl.textContent = pad(days);
    hEl.textContent = pad(hours);
    mEl.textContent = pad(minutes);
    sEl.textContent = pad(seconds);
  }

  tick();
  window.setInterval(tick, 1000);
}

/* =========================================================
   AÇÕES: MAPA, GOOGLE AGENDA, WHATSAPP, PIX
   ========================================================= */
function toUtcCompact(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function buildGoogleCalendarLink() {
  const e = config.event;
  const start = new Date(e.dataISO);
  const end = new Date(start.getTime() + (e.duracaoHoras || 4) * 3600000);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${e.tituloAniversario} de ${e.nome}`,
    dates: `${toUtcCompact(start)}/${toUtcCompact(end)}`,
    details: `Venha celebrar os ${e.tituloAniversario} de ${e.nome}! ${e.subtitulo.replace(/\n/g, " ")}`,
    location: `${e.local}, ${e.endereco}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function pressFeedback(btn) {
  if (navigator.vibrate) navigator.vibrate(15);
  btn.classList.remove("is-pressed");
  void btn.offsetWidth;
  btn.classList.add("is-pressed");
}

document.getElementById("btn-maps").addEventListener("click", (e) => {
  pressFeedback(e.currentTarget);
  window.open(config.mapsLink, "_blank", "noopener");
});

document.getElementById("btn-calendar").addEventListener("click", (e) => {
  pressFeedback(e.currentTarget);
  window.open(buildGoogleCalendarLink(), "_blank", "noopener");
});

document.getElementById("btn-rsvp").addEventListener("click", (e) => {
  pressFeedback(e.currentTarget);
  const text = encodeURIComponent(config.whatsappMessage);
  window.open(`https://wa.me/${config.whatsappNumber}?text=${text}`, "_blank", "noopener");
});

/* =========================================================
   MODAL — PRESENTE / PIX
   ========================================================= */
const giftModal = document.getElementById("gift-modal");
const btnGift = document.getElementById("btn-gift");
const modalClose = document.getElementById("modal-close");
const modalBackdrop = document.getElementById("modal-backdrop");
const pixCopyBtn = document.getElementById("pix-copy");
const pixToast = document.getElementById("pix-toast");

function openGiftModal() {
  giftModal.removeAttribute("hidden");
  requestAnimationFrame(() => giftModal.classList.add("is-open"));
}
function closeGiftModal() {
  giftModal.classList.remove("is-open");
  window.setTimeout(() => giftModal.setAttribute("hidden", ""), 350);
}

btnGift.addEventListener("click", (e) => { pressFeedback(e.currentTarget); openGiftModal(); });
modalClose.addEventListener("click", closeGiftModal);
modalBackdrop.addEventListener("click", closeGiftModal);

pixCopyBtn.addEventListener("click", async () => {
  const key = config.pix.key;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(key);
    } else {
      const ta = document.createElement("textarea");
      ta.value = key;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    if (navigator.vibrate) navigator.vibrate(15);
    pixToast.classList.add("is-visible");
    window.setTimeout(() => pixToast.classList.remove("is-visible"), 2200);
  } catch (err) {
    console.warn("Não foi possível copiar a chave PIX automaticamente.", err);
  }
});

/* =========================================================
   SAPINHO — toque interativo (Etapa 1)
   ========================================================= */
(function setupFrogTap() {
  const frog = document.getElementById("hero-frog");
  const tapLayer = document.getElementById("hero-frog-tap");
  if (!frog || !tapLayer) return;

  frog.style.pointerEvents = "auto";
  frog.style.cursor = "pointer";
  frog.setAttribute("role", "button");
  frog.setAttribute("aria-label", "Sapinho");

  frog.addEventListener("click", () => {
    if (tapLayer.classList.contains("frog-tap")) return;
    tapLayer.classList.add("frog-tap");
    if (navigator.vibrate) navigator.vibrate(10);
  });
  tapLayer.addEventListener("animationend", () => {
    tapLayer.classList.remove("frog-tap");
  });
})();

/* =========================================================
   ASSINATURA — "Desenvolvido por LéoTech"
   ========================================================= */
(function setupStudioSignature() {
  const sig = document.getElementById("studio-signature");
  if (!sig) return;
  sig.addEventListener("click", () => {
    const text = encodeURIComponent(config.developerWhatsappMessage || "");
    window.open(`https://wa.me/${config.developerWhatsapp}?text=${text}`, "_blank", "noopener");
  });
})();

/* =========================================================
   MÚSICA AMBIENTE
   ========================================================= */
let musicStarted = false;

bgAudio.addEventListener("error", () => {
  console.warn("Não foi possível carregar assets/music.mp3 — confira o arquivo no repositório.");
});

function attemptPlayMusic() {
  if (musicStarted) return;
  bgAudio.play()
    .then(() => {
      musicStarted = true;
      musicIcon.textContent = "⏸";
      musicToggle.setAttribute("aria-label", "Pausar música");
    })
    .catch(() => { musicIcon.textContent = "▶"; });
}

musicToggle.addEventListener("click", () => {
  const control = document.getElementById("music-control");
  control.classList.add("is-expanded");

  if (bgAudio.paused) {
    bgAudio.play();
    musicIcon.textContent = "⏸";
    musicToggle.setAttribute("aria-label", "Pausar música");
    musicStarted = true;
  } else {
    bgAudio.pause();
    musicIcon.textContent = "▶";
    musicToggle.setAttribute("aria-label", "Tocar música");
  }
});

musicVolume.addEventListener("input", (e) => {
  bgAudio.volume = parseFloat(e.target.value);
});

document.addEventListener("pointerdown", (e) => {
  const control = document.getElementById("music-control");
  if (control && !control.contains(e.target)) {
    control.classList.remove("is-expanded");
  }
});

/* =========================================================
   PARTÍCULAS DOURADAS (splash + app, ritmo lento e orgânico)
   ========================================================= */
function createParticleField(canvasEl, options = {}) {
  if (!canvasEl) return null;
  const ctx = canvasEl.getContext("2d");
  const density = options.density || 0.00009;
  const maxSpeed = options.maxSpeed || 0.15;
  const reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width, height, particles, rafId;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    width = canvasEl.clientWidth;
    height = canvasEl.clientHeight;
    canvasEl.width = width * dpr;
    canvasEl.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(16, Math.floor(width * height * density));
    particles = Array.from({ length: count }, spawnParticle);
  }

  function spawnParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      speed: Math.random() * maxSpeed + 0.02,
      drift: (Math.random() - 0.5) * 0.05,
      alpha: Math.random() * 0.5 + 0.15,
      twinkleSpeed: Math.random() * 0.015 + 0.004,
      twinklePhase: Math.random() * Math.PI * 2,
    };
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -4) { p.y = height + 4; p.x = Math.random() * width; }
      const tw = 0.6 + 0.4 * Math.sin(time * p.twinkleSpeed + p.twinklePhase);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(228, 196, 128, ${p.alpha * tw})`;
      ctx.shadowColor = "rgba(228, 196, 128, 0.8)";
      ctx.shadowBlur = 4;
      ctx.fill();
    });
    rafId = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);

  if (!reduced) {
    rafId = requestAnimationFrame(draw);
  } else {
    draw(0);
    cancelAnimationFrame(rafId);
  }

  return { stop() { cancelAnimationFrame(rafId); window.removeEventListener("resize", resize); } };
}

createParticleField(document.getElementById("particles-canvas"), {
  density: 0.00012,
  maxSpeed: 0.16,
});

createParticleField(document.getElementById("particles-canvas-app"), {
  density: 0.00006,
  maxSpeed: 0.09,
});
