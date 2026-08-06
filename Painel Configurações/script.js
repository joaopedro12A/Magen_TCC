// Navegação lateral
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

// Toggles de notificação
document.querySelectorAll('.switch').forEach(sw => {
  sw.addEventListener('click', () => sw.classList.toggle('on'));
});

// Salvar alterações (placeholder)
document.getElementById('saveBtn').addEventListener('click', () => {
  alert('Alterações salvas com sucesso.');
});

// Atualizar senha (validação simples)
document.getElementById('updatePassBtn').addEventListener('click', () => {
  const newPass = document.getElementById('newPass').value;
  const confirmPass = document.getElementById('confirmPass').value;
  if(!newPass || !confirmPass){
    alert('Preencha a nova senha e a confirmação.');
    return;
  }
  if(newPass !== confirmPass){
    alert('As senhas não coincidem.');
    return;
  }
  alert('Senha atualizada com sucesso.');
  document.getElementById('newPass').value = '';
  document.getElementById('confirmPass').value = '';
});
