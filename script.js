function toggleFaq(btn){
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  if(!wasOpen) item.classList.add('open');
}

 
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
  heroVideo.muted = true;
  const playPromise = heroVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay bloqueado pelo navegador — o poster continua visível
      console.log('Autoplay do vídeo de fundo foi bloqueado pelo navegador.');
    });
  }
}

// Card de integridade do hero: sobe de 0 até o valor e depois oscila de leve,
// como se fosse uma leitura ao vivo. É apenas uma simulação visual.
(function () {
  const valueEl = document.getElementById('icValue');
  const barEl = document.getElementById('icBar');
  if (!valueEl || !barEl) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 87;

  function render(v) {
    valueEl.textContent = Math.round(v);
    barEl.style.width = v + '%';
  }

  if (reduce) { render(current); return; }

  // count-up inicial
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    render(current * eased);
    if (p < 1) requestAnimationFrame(tick);
    else startDrift();
  }
  requestAnimationFrame(tick);

  // oscilação leve entre 83% e 91% (sempre na faixa "normal", acima de 60%)
  function startDrift() {
    setInterval(function () {
      const next = Math.min(91, Math.max(83, current + (Math.random() * 4 - 2)));
      current = next;
      render(next);
    }, 3000);
  }
})();
