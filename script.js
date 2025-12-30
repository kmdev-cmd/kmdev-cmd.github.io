(() => {
  const GITHUB_USERNAME = "kmdev-cmd";

  async function fetchRecentRepos() {
    const container = document.getElementById("repo-cards-container");
    container.innerHTML =
      '<p class="section-text">Buscando repositórios...</p>';

    try {
      const response = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=3`
      );
      if (!response.ok) throw new Error("Falha na API");

      const repos = await response.json();
      container.innerHTML = "";

      repos.forEach((repo) => {
        const card = document.createElement("article");
        card.className = "project-card repo-mini";
        const date = new Date(repo.updated_at).toLocaleDateString("pt-BR");

        card.innerHTML = `
          <div class="project-content">
            <span class="project-tech">${
              repo.language || "Code"
            } • ${date}</span>
            <h4 class="project-name">${repo.name}</h4>
            <p class="project-desc">${
              repo.description ||
              "Projeto focado em automação e ferramentas utilitárias."
            }</p>
            <a href="${
              repo.html_url
            }" class="project-link" target="_blank">Repositório →</a>
          </div>
        `;
        container.appendChild(card);
      });
    } catch (error) {
      container.innerHTML =
        '<p class="section-text">O GitHub está ocupado agora, mas você pode ver meus projetos clicando no botão abaixo.</p>';
    }
  }

  fetchRecentRepos();

  // Theme Logic
  const toggle = document.getElementById("theme-toggle");
  const body = document.body;

  const savedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  body.classList.toggle("dark", savedTheme === "dark");

  toggle.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  window.scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section)
      window.scrollTo({ top: section.offsetTop - 80, behavior: "smooth" });
  };
})();

function updateAge() {
  const birthDate = new Date("2009-02-03");
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Ajusta se ainda não fez aniversário no ano corrente
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  const ageElement = document.getElementById("dynamic-age");
  if (ageElement) {
    ageElement.textContent = age;
  }
}

// Chame a função logo após o carregamento
updateAge();
