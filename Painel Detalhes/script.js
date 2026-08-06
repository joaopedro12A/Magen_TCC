document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});
document.querySelector('.link').addEventListener('click', () => alert('Abrindo galeria completa de fotos...'));
document.querySelector('.gallery-upload').addEventListener('click', () => alert('Selecionar foto para enviar...'));
document.querySelector('.btn-outline').addEventListener('click', () => alert('Baixando relatório em PDF...'));
document.querySelector('.btn-block').addEventListener('click', () => alert('Abrindo histórico completo de registros...'));
