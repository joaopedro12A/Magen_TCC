// Navegação lateral
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

// Busca na base de ajuda (placeholder)
document.getElementById('helpSearch').addEventListener('keydown', (e) => {
  if(e.key === 'Enter' && e.target.value.trim()){
    alert('Buscando por: "' + e.target.value.trim() + '"');
  }
});

// Ações de suporte
document.getElementById('talkBtn').addEventListener('click', () => alert('Abrindo canal de suporte...'));
document.querySelectorAll('.support-btn, .help-link').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Ação: ' + el.textContent.trim());
  });
});
