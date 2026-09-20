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