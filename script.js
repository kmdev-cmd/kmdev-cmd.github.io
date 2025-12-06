/* partículas — mantive igual */
(() => {
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  let w = (canvas.width = innerWidth);
  let h = (canvas.height = innerHeight);

  const config = {
    count: Math.round(Math.max(18, (w * h) / 140000)),
    speed: 0.2,
    sizeMin: 0.5,
    sizeMax: 2.6,
    color: "rgba(124,240,255,0.06)",
  };

  const particles = [];
  const rand = (min, max) => Math.random() * (max - min) + min;

  function Particle() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.r = rand(config.sizeMin, config.sizeMax);
    this.vx = rand(-config.speed, config.speed);
    this.vy = rand(-config.speed, config.speed);
    this.alpha = rand(0.2, 0.6);
  }

  function init() {
    particles.length = 0;
    for (let i = 0; i < config.count; i++) particles.push(new Particle());
  }

  function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    init();
  }
  addEventListener("resize", resize);

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let p of particles) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(124,240,255,${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
    }
    requestAnimationFrame(draw);
  }

  init();
  draw();

  /* --------- Sistema de navegação SEM SCROLL --------- */

  const navLinks = document.querySelectorAll(".nav a");
  const sections = Array.from(document.querySelectorAll("section[id]"));

  function activateSection(id) {
    // verifica se é mobile (≤768px)
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
      // PC: ativa/desativa sections
      navLinks.forEach((l) => l.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));

      // ativa nav
      const activeLink = document.querySelector(`.nav a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add("active");

      // ativa section
      const activeSection = document.getElementById(id);
      if (activeSection) activeSection.classList.add("active");
    }

    // sempre faz scroll suave
    const activeSection = document.getElementById(id);
    if (activeSection) {
      const top = activeSection.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  // intercepta todos os cliques
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = link.getAttribute("href").replace("#", "");
      activateSection(id);
    });
  });

  // primeira ativação
  activateSection("hero");

  /* botão de topo */
  window.scrollToTop = () => activateSection("hero");

  /* função para onclick dos links */
  window.scrollToSection = activateSection;
})();
