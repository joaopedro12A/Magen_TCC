/* =========================================================================
   MAGEN — Pop-up "Ver Perfil" da página Quem Somos
   Edite os campos abaixo (role, bio, redes sociais) com as informações
   reais de cada integrante quando estiverem disponíveis.
   ========================================================================= */

const TEAM_PROFILES = {
  "erick": {
    name: "Erick Ferraz",
    role: "Hardware & UI Design",
    image: "../Integrantes/Erick.png",
    bio: "Responsável pela montagem física do protótipo YESOD e pelo design da interface do site.",
    socials: { instagram: "https://www.instagram.com/itz_eerick/", linkedin: "https://www.linkedin.com/in/erick-ferraz-visenfad-17482b396/", email: "#" }
  },
  "joao": {
    name: "João Pedro",
    role: "Frontend & UI/UX",
    image: "../Integrantes/João.png",
    bio: "Atua no design e desenvolvimento das interfaces do site e do aplicativo, do wireframe à implementação final.",
    socials: { instagram: "https://www.instagram.com/itzjota_/", linkedin: "https://www.linkedin.com/in/jo%C3%A3o-pedro-borges-643352390/", email: "#" }
  },
  "leonardo": {
    name: "Leonardo Braga",
    role: "Hardware & QA",
    image: "../Integrantes/Leonardo.png",
    bio: "Responsável pela montagem do dispositivo YESOD e pela condução dos testes de validação dos sensores em campo.",
    socials: { instagram: "ttps://www.instagram.com/leozinho007c/", linkedin: "https://www.linkedin.com/in/leonardo-braga-de-souza-479243392/", email: "#" }
  },
  "raul": {
    name: "Raul Egas",
    role: "Firmware & Integração de Sistemas",
    image: "../Integrantes/Raul.png",
    bio: "Desenvolve o firmware do dispositivo e a camada de comunicação entre sensores, site e aplicativo, além de coordenar a integração técnica do grupo.",
    socials: { instagram: "https://www.instagram.com/raul9egas/", linkedin: "https://www.linkedin.com/in/raul-egas-855a04391/", email: "#" }
  },
  "vini": {
    name: "Vinicius Ferreira",
    role: "Full Stack Web & QA",
    image: "../Integrantes/Vini.png",
    bio: "Desenvolveu o site do zero — design e codificação — e participa ativamente dos testes do protótipo YESOD.",
    socials: { instagram: "https://www.instagram.com/vinizzkf/", linkedin: "https://www.linkedin.com/in/vinicius-ferreira-souza-3507bb398/", email: "#" }
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
