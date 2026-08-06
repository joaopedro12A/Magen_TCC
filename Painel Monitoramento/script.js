// Navegação lateral: alterna a classe "active"
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

// Tooltip simples ao passar o mouse nos pinos do mapa
document.querySelectorAll('.map-pin').forEach(pin => {
  pin.addEventListener('mouseenter', () => { pin.style.transform = 'scale(1.3)'; });
  pin.addEventListener('mouseleave', () => { pin.style.transform = 'scale(1)'; });
});

// Busca (filtra visualmente os alertas por palavra-chave, apenas demonstrativo)
document.getElementById('searchInput').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll('#alertsList .alert-item').forEach(item => {
    const text = item.innerText.toLowerCase();
    item.style.display = text.includes(q) ? 'flex' : 'none';
  });
});

// Botão "Cadastrar Edifício" (placeholder de ação)
document.getElementById('cadastrarBtn').addEventListener('click', () => {
  alert('Abrir formulário de cadastro de edifício.');
});
