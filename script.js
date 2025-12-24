(() => {
  /* Sistema de navegação */

  const navLinks = document.querySelectorAll(".nav a");
  const sections = Array.from(document.querySelectorAll("section[id]"));

  function activateSection(id) {
    // sempre faz scroll suave
    const activeSection = document.getElementById(id);
    if (activeSection) {
      const top = activeSection.offsetTop - 100; // offset para header
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

  // função para onclick dos links
  window.scrollToSection = activateSection;

  // Dark mode toggle
  const toggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Detecta preferência inicial
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    body.classList.add("dark");
  }

  toggle.addEventListener("click", () => {
    body.classList.toggle("dark");
  });

  // Atualiza se o usuário mudar a preferência do sistema
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      body.classList.toggle("dark", e.matches);
    });
})();
