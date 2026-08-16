// ---- Efficiency bar animation ----
const effBar = document.getElementById('effBar');
const effVal = document.getElementById('effVal');
function setEfficiency(v){
  effBar.style.width = v + '%';
  effVal.textContent = v + '%';
}
setTimeout(()=> setEfficiency(92), 300);
setInterval(()=>{
  const v = 88 + Math.round(Math.random()*8);
  setEfficiency(v);
}, 4000);

// ---- Live metric jitter ----
const vibVal = document.getElementById('vibVal');
const loadVal = document.getElementById('loadVal');
setInterval(()=>{
  const vib = (0.035 + Math.random()*0.015).toFixed(3);
  vibVal.textContent = vib + 'g';
  const load = 830 + Math.round(Math.random()*25);
  loadVal.textContent = load + ' MPa';
}, 2500);

// ---- Alert timestamp ----
let mins = 2;
const alertTime = document.getElementById('alertTime');
setInterval(()=>{
  mins++;
  alertTime.textContent = mins + ' mins ago';
}, 60000);

// ---- Canvas: stylized structural / network live feed ----
const canvas = document.getElementById('feedCanvas');
const ctx = canvas.getContext('2d');
let W, H;
function resize(){
  W = canvas.clientWidth;
  H = canvas.clientHeight;
  canvas.width = W * devicePixelRatio;
  canvas.height = H * devicePixelRatio;
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
window.addEventListener('resize', resize);
resize();

// network node graph (hexagonal cluster) over a dark gradient
const nodes = [];
const cx = () => W*0.62, cy = () => H*0.42;
const nodeCount = 7;
for(let i=0;i<nodeCount;i++){
  const angle = (i/nodeCount) * Math.PI*2;
  nodes.push({
    baseAngle: angle,
    radius: 42 + Math.random()*8,
    phase: Math.random()*Math.PI*2
  });
}

// background grid dots (map-like)
const gridDots = [];
for(let i=0;i<70;i++){
  gridDots.push({x: Math.random(), y: Math.random(), r: Math.random()*1.4+0.4});
}

// scaffolding lines (right side, structural silhouette)
function drawScaffold(t){
  ctx.save();
  ctx.strokeStyle = 'rgba(160,180,255,0.18)';
  ctx.lineWidth = 1;
  const baseX = W*0.72, baseY = H*0.95;
  for(let i=0;i<5;i++){
    ctx.beginPath();
    ctx.moveTo(baseX + i*14, baseY);
    ctx.lineTo(baseX + i*14 - 40, H*0.15);
    ctx.stroke();
  }
  for(let j=0;j<6;j++){
    const y = H*0.15 + j*(H*0.8/6);
    ctx.beginPath();
    ctx.moveTo(baseX - 40, y);
    ctx.lineTo(baseX + 56, y);
    ctx.stroke();
  }
  ctx.restore();
}

function draw(t){
  // background
  const g = ctx.createLinearGradient(0,0,W,H);
  g.addColorStop(0, '#141a3a');
  g.addColorStop(1, '#0c1230');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,W,H);

  // faint world-map style dots
  ctx.fillStyle = 'rgba(140,160,255,0.10)';
  gridDots.forEach(d=>{
    ctx.beginPath();
    ctx.arc(d.x*W, d.y*H, d.r, 0, Math.PI*2);
    ctx.fill();
  });

  drawScaffold(t);

  // hex network graph
  const time = t/1000;
  const cxv = cx(), cyv = cy();
  const pts = nodes.map(n=>{
    const wob = Math.sin(time*0.6 + n.phase) * 3;
    const r = n.radius + wob;
    return {
      x: cxv + Math.cos(n.baseAngle + time*0.05) * r,
      y: cyv + Math.sin(n.baseAngle + time*0.05) * r
    };
  });

  // connecting lines
  ctx.strokeStyle = 'rgba(94,234,255,0.55)';
  ctx.lineWidth = 1.2;
  for(let i=0;i<pts.length;i++){
    const a = pts[i], b = pts[(i+1)%pts.length];
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.stroke();
    // spokes to center
    ctx.beginPath();
    ctx.moveTo(cxv,cyv);
    ctx.lineTo(a.x,a.y);
    ctx.strokeStyle = 'rgba(94,234,255,0.22)';
    ctx.stroke();
    ctx.strokeStyle = 'rgba(94,234,255,0.55)';
  }

  // pulse traveling along one edge
  const pulseIdx = Math.floor(time*0.8) % pts.length;
  const a = pts[pulseIdx], b = pts[(pulseIdx+1)%pts.length];
  const frac = (time*0.8) % 1;
  const px = a.x + (b.x-a.x)*frac;
  const py = a.y + (b.y-a.y)*frac;
  ctx.beginPath();
  ctx.arc(px,py,3,0,Math.PI*2);
  ctx.fillStyle = '#eafcff';
  ctx.shadowColor = '#5eeaff';
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.shadowBlur = 0;

  // nodes
  pts.forEach((p,i)=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y, i===0?4:2.6, 0, Math.PI*2);
    ctx.fillStyle = '#bff3ff';
    ctx.fill();
  });
  // center node
  ctx.beginPath();
  ctx.arc(cxv,cyv,4,0,Math.PI*2);
  ctx.fillStyle = '#5eeaff';
  ctx.shadowColor = '#5eeaff';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

function toggleFaq(btn){
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  if(!wasOpen) item.classList.add('open');
}

// ---- Mobile hamburger menu ----
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

function openMenu(){
  hamburgerBtn.classList.add('open');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.add('open');
  mobileMenuOverlay.classList.add('open');
  document.body.classList.add('menu-open');
}

function closeMenu(){
  hamburgerBtn.classList.remove('open');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  mobileMenuOverlay.classList.remove('open');
  document.body.classList.remove('menu-open');
}

function toggleMenu(){
  if(mobileMenu.classList.contains('open')){
    closeMenu();
  } else {
    openMenu();
  }
}

// Fecha o menu automaticamente se a tela for redimensionada para desktop
window.addEventListener('resize', ()=>{
  if(window.innerWidth > 860 && mobileMenu.classList.contains('open')){
    closeMenu();
  }
});

// Fecha o menu com a tecla Esc
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && mobileMenu.classList.contains('open')){
    closeMenu();
  }
});
