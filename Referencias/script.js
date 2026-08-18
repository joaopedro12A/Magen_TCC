// Animated waveform (vibration / wave propagation visual)
const canvas = document.getElementById('waveCanvas');
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

// faint grid
function drawGrid(){
  ctx.strokeStyle = 'rgba(120,140,255,0.12)';
  ctx.lineWidth = 1;
  const step = 26;
  for(let x=0;x<W;x+=step){
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke();
  }
  for(let y=0;y<H;y+=step){
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
  }
}

function drawWave(t, amp, freq, speed, color, width, yOffset){
  ctx.beginPath();
  for(let x=0; x<=W; x+=2){
    const y = H*yOffset + Math.sin((x*freq) + t*speed) * amp * Math.sin(x/W*Math.PI);
    if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function draw(t){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0, '#101a48');
  g.addColorStop(1, '#0a0f30');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,W,H);
  drawGrid();

  const time = t/700;
  drawWave(time, H*0.16, 0.028, 2.2, 'rgba(94,234,255,0.85)', 2, 0.42);
  drawWave(time, H*0.10, 0.045, -1.6, 'rgba(255,196,74,0.75)', 1.6, 0.58);
  drawWave(time, H*0.06, 0.06, 3, 'rgba(150,170,255,0.4)', 1.2, 0.5);

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeIcon.src = "../sol.png";
    themeIcon.alt = "Modo claro";
  } else {
    themeIcon.src = "../lua.png";
    themeIcon.alt = "Modo escuro";
  }
});