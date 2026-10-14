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

  /* Respeita a escolha salva do visitante (inclusive "claro"), mesmo nas páginas
     que trazem class="dark-mode" fixa no <body>. */
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
  } else if (saved === 'light') {
    document.body.classList.remove('dark-mode');
  }

  function applyTheme(isDark, persist = true) {
    document.body.classList.toggle('dark-mode', isDark);
    if (persist) localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    buttons.forEach((btn) => {
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute('aria-label', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
    });
  }

  applyTheme(document.body.classList.contains('dark-mode'), false); // só sincroniza, não sobrescreve a escolha salva

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyTheme(!document.body.classList.contains('dark-mode'));
    });
  });
})();

/* =========================================================================
   FUNDO ANIMADO — rede de partículas (canvas)
   - Muda de cores automaticamente com o tema (claro/escuro), com transição suave.
   - Pontos conectados por linhas; reage ao mouse/toque; pulsos de "dados" viajam
     pelas conexões (lembra sensores enviando medições).
   - Leve: pausa com a aba oculta, limita a quantidade de pontos no celular
     e respeita "prefers-reduced-motion" (mostra apenas um quadro estático).
   Para ajustar o visual, mexa só no objeto CONFIG logo abaixo.
   ========================================================================= */
(function initNetworkBackground() {
  const CONFIG = {
    density: 15000,        // menor = mais pontos (px² por ponto)
    maxParticles: 110,
    maxParticlesMobile: 48,
    linkDistance: 150,     // distância máxima para ligar dois pontos (px)
    linkDistanceMobile: 105,
    speed: 0.22,           // velocidade base dos pontos
    mouseRadius: 190,      // raio de influência do mouse
    parallax: 0.06,        // quanto o fundo "desliza" ao rolar a página
    pulseEvery: 650,       // intervalo (ms) entre pulsos de dados
    maxPulses: 7,
    themes: {
      light: {
        dot:   [47, 95, 224],    // azul MAGEN
        dot2:  [14, 165, 200],   // ciano
        line:  [47, 95, 224],
        dotAlpha: 0.55, lineAlpha: 0.20,
        glowA: [47, 95, 224, 0.10], glowB: [34, 211, 238, 0.09], glowC: [99, 102, 241, 0.06]
      },
      dark: {
        dot:   [109, 140, 255],
        dot2:  [34, 211, 238],
        line:  [79, 125, 255],
        dotAlpha: 0.80, lineAlpha: 0.26,
        glowA: [47, 95, 224, 0.20], glowB: [34, 211, 238, 0.10], glowC: [99, 102, 241, 0.14]
      }
    }
  };

  if (document.getElementById('magen-bg')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'magen-bg';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDark = () => document.body.classList.contains('dark-mode');

  /* ---------- Cores com transição suave entre os temas ---------- */
  const flat = (t) => [...t.dot, ...t.dot2, ...t.line, t.dotAlpha, t.lineAlpha,
                       ...t.glowA, ...t.glowB, ...t.glowC];
  const colors = flat(CONFIG.themes[isDark() ? 'dark' : 'light']);
  let colorTarget = colors.slice();
  const syncTheme = () => { colorTarget = flat(CONFIG.themes[isDark() ? 'dark' : 'light']); };
  new MutationObserver(syncTheme).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  const rgba = (c, o, a) => `rgba(${c[o] | 0},${c[o + 1] | 0},${c[o + 2] | 0},${a})`;
  // índices dentro do vetor "colors"
  const I = { dot: 0, dot2: 3, line: 6, dotA: 9, lineA: 10, gA: 11, gB: 15, gC: 19 };

  /* ---------- Estado ---------- */
  let W = 0, H = 0, dpr = 1, particles = [], pulses = [];
  let linkDist = CONFIG.linkDistance;
  const mouse = { x: -9999, y: -9999, active: false };
  let scrollY = window.scrollY || 0;
  let last = performance.now(), lastPulse = 0, raf = 0, t0 = last;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const mobile = W < 700;
    linkDist = mobile ? CONFIG.linkDistanceMobile : CONFIG.linkDistance;
    const max = mobile ? CONFIG.maxParticlesMobile : CONFIG.maxParticles;
    const target = Math.max(24, Math.min(max, Math.round((W * H) / CONFIG.density)));

    while (particles.length < target) particles.push(makeParticle());
    if (particles.length > target) particles.length = target;
    particles.forEach((p) => { if (p.x > W) p.x = Math.random() * W; });
    if (reduceMotion) draw(performance.now());
  }

  function makeParticle() {
    const depth = 0.45 + Math.random() * 0.55;            // 0.45 (longe) → 1 (perto)
    const ang = Math.random() * Math.PI * 2;
    const v = CONFIG.speed * (0.4 + Math.random() * 0.9) * depth;
    return {
      x: Math.random() * W, y: Math.random() * H,
      vx: Math.cos(ang) * v, vy: Math.sin(ang) * v,
      r: 1.1 + depth * 1.7, depth,
      accent: Math.random() < 0.22,                        // alguns pontos em ciano
      phase: Math.random() * Math.PI * 2
    };
  }

  /* ---------- Atualização ---------- */
  function step(dt, now) {
    // transição de cor suave
    const k = Math.min(1, dt * 0.006);
    for (let i = 0; i < colors.length; i++) colors[i] += (colorTarget[i] - colors[i]) * k;

    const f = dt / 16.67;
    for (const p of particles) {
      p.x += p.vx * f; p.y += p.vy * f;

      if (mouse.active) {                                   // leve atração pelo mouse
        const dx = mouse.x - p.x, dy = mouse.y - (p.y - scrollY * CONFIG.parallax * p.depth);
        const d2 = dx * dx + dy * dy, R = CONFIG.mouseRadius;
        if (d2 < R * R && d2 > 1) {
          const d = Math.sqrt(d2), pull = (1 - d / R) * 0.018 * f;
          p.x += dx * pull; p.y += dy * pull;
        }
      }
      const m = 30;                                         // dá a volta nas bordas
      if (p.x < -m) p.x = W + m; else if (p.x > W + m) p.x = -m;
      if (p.y < -m) p.y = H + m; else if (p.y > H + m) p.y = -m;
    }

    // novos pulsos de dados
    if (now - lastPulse > CONFIG.pulseEvery && pulses.length < CONFIG.maxPulses) {
      lastPulse = now;
      const a = particles[(Math.random() * particles.length) | 0];
      let best = null, bd = Infinity;
      for (const b of particles) {
        if (b === a) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < linkDist && d > 30 && d < bd * (0.6 + Math.random() * 0.8)) { best = b; bd = d; }
      }
      if (best) pulses.push({ a, b: best, t: 0, speed: 0.0009 + Math.random() * 0.0008 });
    }
    pulses = pulses.filter((p) => (p.t += dt * p.speed) < 1);
  }

  /* ---------- Desenho ---------- */
  const posY = (p) => {
    // parallax: pontos "mais perto" deslizam mais ao rolar a página
    let y = p.y - scrollY * CONFIG.parallax * p.depth;
    y = ((y % H) + H) % H;
    return y;
  };

  function draw(now) {
    ctx.clearRect(0, 0, W, H);
    const time = (now - t0) / 1000;

    /* Brilhos grandes e suaves que flutuam lentamente (dá o ar de "vídeo") */
    const glows = [
      { o: I.gA, x: 0.18 + Math.sin(time * 0.11) * 0.08, y: 0.22 + Math.cos(time * 0.09) * 0.10, r: 0.55 },
      { o: I.gB, x: 0.82 + Math.cos(time * 0.08) * 0.07, y: 0.30 + Math.sin(time * 0.12) * 0.12, r: 0.50 },
      { o: I.gC, x: 0.55 + Math.sin(time * 0.07) * 0.12, y: 0.88 + Math.cos(time * 0.10) * 0.08, r: 0.60 }
    ];
    const big = Math.max(W, H);
    for (const g of glows) {
      const gx = g.x * W, gy = g.y * H, gr = g.r * big;
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      grad.addColorStop(0, rgba(colors, g.o, colors[g.o + 3]));
      grad.addColorStop(1, rgba(colors, g.o, 0));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    /* Linhas entre pontos próximos */
    const n = particles.length, ld2 = linkDist * linkDist;
    const pos = particles.map((p) => [p.x, posY(p)]);
    ctx.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = pos[i][0] - pos[j][0], dy = pos[i][1] - pos[j][1];
        const d2 = dx * dx + dy * dy;
        if (d2 < ld2) {
          const a = (1 - Math.sqrt(d2) / linkDist) * colors[I.lineA] *
                    Math.min(particles[i].depth, particles[j].depth) * 1.2;
          ctx.strokeStyle = rgba(colors, I.line, a.toFixed(3));
          ctx.beginPath(); ctx.moveTo(pos[i][0], pos[i][1]); ctx.lineTo(pos[j][0], pos[j][1]); ctx.stroke();
        }
      }
    }

    /* Linhas até o mouse */
    if (mouse.active) {
      const R = CONFIG.mouseRadius;
      for (let i = 0; i < n; i++) {
        const dx = pos[i][0] - mouse.x, dy = pos[i][1] - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < R) {
          ctx.strokeStyle = rgba(colors, I.dot2, ((1 - d / R) * 0.55).toFixed(3));
          ctx.beginPath(); ctx.moveTo(pos[i][0], pos[i][1]); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
    }

    /* Pontos */
    for (let i = 0; i < n; i++) {
      const p = particles[i];
      const tw = 0.82 + 0.18 * Math.sin(time * 1.3 + p.phase);   // cintilar leve
      const base = p.accent ? I.dot2 : I.dot;
      ctx.fillStyle = rgba(colors, base, (colors[I.dotA] * p.depth * tw).toFixed(3));
      ctx.beginPath(); ctx.arc(pos[i][0], pos[i][1], p.r, 0, Math.PI * 2); ctx.fill();
    }

    /* Pulsos de dados viajando pelas conexões */
    for (const pl of pulses) {
      const ia = particles.indexOf(pl.a), ib = particles.indexOf(pl.b);
      if (ia < 0 || ib < 0) continue;
      const x = pos[ia][0] + (pos[ib][0] - pos[ia][0]) * pl.t;
      const y = pos[ia][1] + (pos[ib][1] - pos[ia][1]) * pl.t;
      const fade = Math.sin(pl.t * Math.PI);
      const g = ctx.createRadialGradient(x, y, 0, x, y, 14);
      g.addColorStop(0, rgba(colors, I.dot2, (0.85 * fade).toFixed(3)));
      g.addColorStop(1, rgba(colors, I.dot2, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();
    }
  }

  function loop(now) {
    const dt = Math.min(48, now - last); last = now;
    step(dt, now); draw(now);
    raf = requestAnimationFrame(loop);
  }

  /* ---------- Eventos ---------- */
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
  window.addEventListener('scroll', () => { scrollY = window.scrollY || 0; }, { passive: true });
  window.addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; }, { passive: true });
  document.addEventListener('pointerleave', () => { mouse.active = false; });
  window.addEventListener('pointerup', (e) => { if (e.pointerType === 'touch') mouse.active = false; });

  resize();
  if (reduceMotion) {
    for (let i = 0; i < colors.length; i++) colors[i] = colorTarget[i];
    new MutationObserver(() => { syncTheme(); for (let i = 0; i < colors.length; i++) colors[i] = colorTarget[i]; draw(performance.now()); })
      .observe(document.body, { attributes: true, attributeFilter: ['class'] });
    draw(performance.now());
    return;
  }
  raf = requestAnimationFrame(loop);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else { last = performance.now(); raf = requestAnimationFrame(loop); }
  });
})();


/* =========================================================================
   HEADER REPAGINADO — comportamento (visual está no enhance.css)
   - Marca vira link para a Home e ganha subtítulo
   - Indicador deslizante no menu (acompanha hover/foco e volta à página atual)
   - Botão "Ver aplicativo" no header e no menu mobile
   - Header encolhe ao rolar e mostra a barra de progresso de leitura
   Para mudar o link do botão, edite APP_URL.
   ========================================================================= */
(function initHeaderUpgrade() {
  const APP_URL = 'https://aplicativomagen.vercel.app/?sim';
  const header = document.querySelector('header.site');
  if (!header) return;

  /* 1) Marca: link para a Home + subtítulo */
  const brand = header.querySelector('.brand');
  const nav = header.querySelector('nav.main-nav');
  if (brand && !brand.querySelector('.brand-link')) {
    const img = brand.querySelector('img');
    const homeLink = nav && nav.querySelector('a');
    const link = document.createElement('a');
    link.className = 'brand-link';
    link.href = homeLink ? homeLink.getAttribute('href') : 'index.html';
    link.setAttribute('aria-label', 'MAGEN — ir para a página inicial');
    if (img) link.appendChild(img);
    const text = document.createElement('span');
    text.className = 'brand-text';
    const strong = document.createElement('strong');
    strong.textContent = 'MAGEN';
    const small = document.createElement('small');
    small.textContent = 'tecnologia';
    text.append(strong, small);
    link.appendChild(text);
    brand.textContent = '';
    brand.appendChild(link);
  }

  /* 2) Botão "Ver aplicativo" (desktop e menu mobile) */
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
  function makeCta() {
    const a = document.createElement('a');
    a.className = 'header-cta';
    a.href = APP_URL;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', 'Ver aplicativo MAGEN');
    const label = document.createElement('span');
    label.textContent = 'Ver aplicativo';
    a.appendChild(label);
    a.insertAdjacentHTML('beforeend', arrow);
    return a;
  }
  const actions = header.querySelector('.header-actions');
  if (actions && !actions.querySelector('.header-cta')) actions.appendChild(makeCta());
  const mobileActions = document.querySelector('.mobile-menu-actions');
  if (mobileActions && !mobileActions.querySelector('.header-cta')) mobileActions.insertBefore(makeCta(), mobileActions.firstChild);

  /* 3) Indicador deslizante do menu */
  if (nav) {
    const ind = document.createElement('span');
    ind.className = 'nav-indicator';
    nav.appendChild(ind);
    const links = Array.from(nav.querySelectorAll('a'));
    const current = () => nav.querySelector('a.active');
    const moveTo = (el) => {
      if (!el || !el.offsetWidth) { ind.style.opacity = '0'; return; }
      ind.style.opacity = '1';
      ind.style.width = el.offsetWidth + 'px';
      ind.style.transform = 'translateX(' + el.offsetLeft + 'px)';
    };
    links.forEach((l) => {
      l.addEventListener('mouseenter', () => moveTo(l));
      l.addEventListener('focus', () => moveTo(l));
    });
    nav.addEventListener('mouseleave', () => moveTo(current()));
    nav.addEventListener('focusout', () => moveTo(current()));
    window.addEventListener('resize', () => moveTo(current()));
    moveTo(current());
    // liga a animação só depois do primeiro posicionamento (evita "voo" inicial)
    requestAnimationFrame(() => requestAnimationFrame(() => ind.classList.add('ready')));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moveTo(current()));
    window.addEventListener('load', () => moveTo(current()));
  }

  /* 4) Encolher ao rolar + progresso de leitura */
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = window.scrollY || 0;
    header.classList.toggle('is-scrolled', y > 12);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.style.setProperty('--read', max > 0 ? Math.min(1, y / max).toFixed(4) : '0');
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
