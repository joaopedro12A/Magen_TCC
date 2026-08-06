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
