// Animate counters
function animateCount(el, target, suffix, duration){
  const start = performance.now();
  function step(t){
    const p = Math.min((t-start)/duration, 1);
    const eased = 1 - Math.pow(1-p, 3);
    const val = Math.floor(eased * target);
    el.textContent = val.toLocaleString('pt-BR') + suffix;
    if(p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
animateCount(document.getElementById('stat1'), 500, '+', 1200);
animateCount(document.getElementById('stat2'), 2.5, 'M', 1200); // handled below for decimal
animateCount(document.getElementById('stat3'), 45, '', 1200);

// Special handling for 2.5M (decimal)
(function(){
  const el = document.getElementById('stat2');
  const start = performance.now();
  const duration = 1200;
  function step(t){
    const p = Math.min((t-start)/duration, 1);
    const eased = 1 - Math.pow(1-p, 3);
    const val = (eased * 2.5).toFixed(1);
    el.textContent = val + 'M';
    if(p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();

/* =========================================================
   MENU MOBILE (HAMBÚRGUER) — MAGEN
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!menuBtn || !mobileMenu) return;

  function openMenu() {
    menuBtn.classList.add("active");
    mobileMenu.classList.add("open");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    menuBtn.classList.remove("active");
    mobileMenu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  }

  // Abre/fecha ao clicar no botão hambúrguer
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Fecha o menu ao clicar em qualquer link dentro dele
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Fecha o menu ao clicar fora dele
  document.addEventListener("click", (e) => {
    if (
      mobileMenu.classList.contains("open") &&
      !mobileMenu.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Fecha o menu ao pressionar ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      closeMenu();
    }
  });

  // Fecha o menu automaticamente se a tela for redimensionada para desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && mobileMenu.classList.contains("open")) {
      closeMenu();
    }
  });
});

