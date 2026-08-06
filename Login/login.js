// Password visibility toggle
const pwd = document.getElementById('password');
const toggleEye = document.getElementById('toggleEye');
toggleEye.addEventListener('click', ()=>{
  if(pwd.type === 'password'){
    pwd.type = 'text';
    toggleEye.textContent = '🙈';
  } else {
    pwd.type = 'password';
    toggleEye.textContent = '👁';
  }
});

// Simple form submit handling (front-end only demo)
const form = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');
const errorMsg = document.getElementById('errorMsg');

form.addEventListener('submit', function(e){
  e.preventDefault();
  errorMsg.style.display = 'none';

  const email = document.getElementById('email').value.trim();
  const password = pwd.value;

  if(!email || !password){
    errorMsg.textContent = 'Preencha e-mail e senha para continuar.';
    errorMsg.style.display = 'block';
    return;
  }

  submitBtn.classList.add('loading');
  submitBtn.textContent = 'Entrando...';

  // Simulated authentication delay
  setTimeout(()=>{
    submitBtn.classList.remove('loading');
    submitBtn.innerHTML = 'Entrar →';
    // Replace this with a real redirect/auth call in production:
    window.location.href = 'index.html';
  }, 1400);
});
