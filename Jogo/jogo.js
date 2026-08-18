// Controla a exibição do loading enquanto o jogo (iframe GDevelop 5) carrega
document.addEventListener('DOMContentLoaded', () => {
  const loading = document.getElementById('gameLoading');
  const frame = document.getElementById('gameFrame');

  function hideLoading(){
    if(loading) loading.classList.add('hidden');
  }

  if(frame){
    // Quando o iframe do jogo terminar de carregar, esconde o "Carregando..."
    frame.addEventListener('load', hideLoading);

    // Fallback: caso o iframe não emita 'load' (ex: sem src definido ainda),
    // some com o loading depois de alguns segundos.
    setTimeout(hideLoading, 4000);
  }

  // Botão "Share Results"
  const shareBtn = document.getElementById('shareBtn');

  if(shareBtn){
    shareBtn.addEventListener('click', () => {

      if(navigator.share){

        navigator.share({
          title: 'Fix-It Ezra Eitan — MAGEN',
          text: 'Confira meu resultado no jogo Fix-It Ezra Eitan!',
          url: window.location.href
        }).catch(() => {});

      } else {

        navigator.clipboard.writeText(window.location.href);

        alert('Link copiado para a área de transferência!');
      }

    });
  }

  // Botão "Back to Library"
  const backBtn = document.getElementById('backBtn');

  if(backBtn){
    backBtn.addEventListener('click', () => {
      window.location.href = '../Produtos/index.html';
    });
  }

  // ==========================================
  // BOTÃO DE TEMA
  // ==========================================

  const themeToggle = document.getElementById('themeToggle');

  if(themeToggle){

    themeToggle.addEventListener('click', () => {

      // O CSS usa "dark-theme", então o JS também precisa usar
      document.body.classList.toggle('dark-theme');

      // Verifica se o modo escuro está ativo
      const darkMode = document.body.classList.contains('dark-theme');

      // Troca o símbolo do botão
      themeToggle.textContent = darkMode ? '☀' : '☾';

      // Atualiza o texto de acessibilidade
      themeToggle.setAttribute(
        'aria-label',
        darkMode
          ? 'Ativar modo claro'
          : 'Ativar modo escuro'
      );

    });

  }

});