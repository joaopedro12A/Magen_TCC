/* =========================================================================
   MAGEN — Pop-up "Ver Perfil" da página Quem Somos
   Edite os campos abaixo (role, bio, redes sociais) com as informações
   reais de cada integrante quando estiverem disponíveis.
   ========================================================================= */

const TEAM_PROFILES = {
  "erick": {
    name: "Erick Ferraz",
    role: "Descrição..",
    image: "../Integrantes/Erick.png",
    bio: "Ainda não adicionamos uma biografia para este integrante. Edite este texto em team-profiles.js com uma descrição real do papel dele no projeto MAGEN.",
    socials: { instagram: "#", linkedin: "#", email: "#" }
  },
  "joao": {
    name: "João Pedro",
    role: "Descrição..",
    image: "../Integrantes/João.png",
    bio: "Ainda não adicionamos uma biografia para este integrante. Edite este texto em team-profiles.js com uma descrição real do papel dele no projeto MAGEN.",
    socials: { instagram: "#", linkedin: "#", email: "#" }
  },
  "leonardo": {
    name: "Leonardo Braga",
    role: "Descrição..",
    image: "../Integrantes/Leonardo.png",
    bio: "Ainda não adicionamos uma biografia para este integrante. Edite este texto em team-profiles.js com uma descrição real do papel dele no projeto MAGEN.",
    socials: { instagram: "#", linkedin: "#", email: "#" }
  },
  "raul": {
    name: "Raul Egas",
    role: "Descrição..",
    image: "../Integrantes/Raul.png",
    bio: "Ainda não adicionamos uma biografia para este integrante. Edite este texto em team-profiles.js com uma descrição real do papel dele no projeto MAGEN.",
    socials: { instagram: "#", linkedin: "#", email: "#" }
  },
  "vini": {
    name: "Vinicius Ferreira",
    role: "Descrição..",
    image: "../Integrantes/Vini.png",
    bio: "Ainda não adicionamos uma biografia para este integrante. Edite este texto em team-profiles.js com uma descrição real do papel dele no projeto MAGEN.",
    socials: { instagram: "#", linkedin: "#", email: "#" }
  }
};

const SOCIAL_ICONS = {
  instagram: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.7"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="1.7"/><circle cx="8" cy="8.3" r="1.15" fill="currentColor"/><path d="M8 11v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12.2 17v-3.4c0-1.4 1-2.3 2.2-2.3s2 0.8 2 2.2V17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.2 11v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  email: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M4 6.5l8 6 8-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

(function () {
  const overlay = document.getElementById("profileModalOverlay");
  if (!overlay) return;

  const imgEl = document.getElementById("profileModalImg");
  const nameEl = document.getElementById("profileModalName");
  const roleEl = document.getElementById("profileModalRole");
  const bioEl = document.getElementById("profileModalBio");
  const socialsEl = document.getElementById("profileModalSocials");
  const closeBtn = document.getElementById("profileModalClose");

  function openModal(key) {
    const person = TEAM_PROFILES[key];
    if (!person) return;

    imgEl.src = person.image;
    imgEl.alt = person.name;
    nameEl.textContent = person.name;
    roleEl.textContent = person.role;
    bioEl.textContent = person.bio;

    socialsEl.innerHTML = "";
    const labels = { instagram: "Instagram de " + person.name, linkedin: "LinkedIn de " + person.name, email: "E-mail de " + person.name };
    Object.keys(person.socials).forEach((key2) => {
      const a = document.createElement("a");
      a.href = key2 === "email" ? person.socials[key2] : person.socials[key2];
      a.setAttribute("aria-label", labels[key2]);
      if (key2 !== "email") {
        a.target = "_blank";
        a.rel = "noopener";
      }
      a.innerHTML = SOCIAL_ICONS[key2];
      socialsEl.appendChild(a);
    });

    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-profile-trigger]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(el.getAttribute("data-profile-trigger"));
    });
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });
})();
