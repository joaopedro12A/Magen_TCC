/* =========================================================================
   MAGEN — ENHANCE.JS
   1) Revela seções/cartões com animação suave ao rolar a página.
   2) Alterna entre tema claro/escuro (agora com o botão dentro do header).
   ========================================================================= */

(function initScrollReveal() {
  const selectors = [
    '.hero-copy', '.hero-visual',
    '.objetivo .obj-copy', '.obj-card',
    '.diff-table',
    '.credito-content',
    '.faq-item',
    '.page-head',
    '.featured', '.product-card',
    '.instr-hero-content',
    '.step-card', '.tip-card', '.video-card', '.links-card',
    '.footer-grid',
    /* Quem Somos */
    '.team-head', '.team-card',
    /* Referências */
    '.featured-article', '.article-card',
    /* Jogo */
    '.game-frame', '.info-box', '.meta-card'
  ];

  const els = Array.from(document.querySelectorAll(selectors.join(',')));
  if (!els.length) return;

  // Aplica um pequeno atraso escalonado para elementos que dividem o mesmo pai
  const counters = new Map();
  els.forEach((el) => {
    el.classList.add('reveal');
    const parent = el.parentElement;
    const i = counters.get(parent) || 0;
    counters.set(parent, i + 1);
    el.style.setProperty('--reveal-i', Math.min(i, 5));
  });

  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach((el) => observer.observe(el));
})();

(function initHamburgerMenu() {
  const btn = document.getElementById('hamburgerBtn');
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileMenuOverlay');
  if (!btn || !menu || !overlay) return;

  function openMenu() {
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    overlay.classList.add('open');
    document.body.classList.add('menu-open');
  }
  function closeMenu() {
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  btn.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });
  overlay.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && menu.classList.contains('open')) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
})();

(function initThemeToggle() {
  const STORAGE_KEY = 'magen-theme';
  const buttons = document.querySelectorAll('.theme-toggle-header, .theme-toggle-mobile-row');
  if (!buttons.length) return;

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
  }

  function applyTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    buttons.forEach((btn) => {
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute('aria-label', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
    });
  }

  applyTheme(document.body.classList.contains('dark-mode'));

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyTheme(!document.body.classList.contains('dark-mode'));
    });
  });
})();