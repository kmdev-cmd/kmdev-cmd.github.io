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

  // Particle System
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-1';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles(); // Reinitialize particles on resize to adjust count
  });
  resizeCanvas();

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 1.5 - 0.75;
      this.speedY = Math.random() * 1.5 - 0.75;
      this.color = `rgba(255, 107, 53, ${Math.random() * 0.3 + 0.1})`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
      if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    // Reduce particle count on mobile devices
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 15 : 30;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    // Draw connections
    particles.forEach(particle => {
      particles.forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.strokeStyle = `rgba(255, 107, 53, ${(100 - distance) / 100 * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
        }
      });

      // Connect to mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.strokeStyle = `rgba(255, 107, 53, ${(150 - distance) / 150 * 0.5})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animateParticles);
  }

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  initParticles();
  animateParticles();

  // Custom cursor effect
  const cursor = document.body;
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;

    cursor.style.setProperty('--cursor-x', cursorX + 'px');
    cursor.style.setProperty('--cursor-y', cursorY + 'px');

    requestAnimationFrame(updateCursor);
  }

  updateCursor();

  // Certificate Modal Functionality
  const certificateModal = document.getElementById('certificate-modal');
  const certificateImage = document.getElementById('certificate-image');
  const certificateClose = document.getElementById('certificate-modal-close');

  // Certificate images mapping
  const certificateImages = {
    python: 'imgs/pythondevcertificate.png',
    web: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=600&fit=crop',
    database: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=600&fit=crop'
  };

  // Open modal function
  function openCertificateModal(certificateType) {
    certificateImage.src = certificateImages[certificateType] || '';
    certificateModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  // Close modal function
  function closeCertificateModal() {
    certificateModal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }

  // Event listeners for certificate buttons
  document.querySelectorAll('.certificate-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const certificateType = button.getAttribute('data-certificate');
      openCertificateModal(certificateType);
    });
  });

  // Close modal on X button click
  certificateClose.addEventListener('click', closeCertificateModal);

  // Close modal on background click
  certificateModal.addEventListener('click', (e) => {
    if (e.target === certificateModal) {
      closeCertificateModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certificateModal.classList.contains('show')) {
      closeCertificateModal();
    }
  });

  // Profile Picture Modal
  const profileLogo = document.getElementById('profile-logo');
  const profileModal = document.createElement('div');
  profileModal.id = 'profile-modal';
  profileModal.className = 'certificate-modal';
  profileModal.innerHTML = `
    <div class="certificate-modal-content">
      <button class="certificate-modal-close" id="profile-modal-close">&times;</button>
      <div class="certificate-modal-body">
        <img src="imgs/kmdevpfp.png" alt="Kauê Monteiro" class="certificate-modal-image profile-image">
      </div>
    </div>
  `;
  document.body.appendChild(profileModal);

  const profileModalClose = document.getElementById('profile-modal-close');

  function openProfileModal() {
    profileModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeProfileModal() {
    profileModal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }

  // Open profile modal on logo click
  profileLogo.addEventListener('click', openProfileModal);

  // Close profile modal
  profileModalClose.addEventListener('click', closeProfileModal);

  // Close profile modal on background click
  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) {
      closeProfileModal();
    }
  });

  // Close profile modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && profileModal.classList.contains('show')) {
      closeProfileModal();
    }
  });
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
