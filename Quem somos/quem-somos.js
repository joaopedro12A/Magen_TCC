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

/* O menu mobile (hambúrguer) agora é um componente único, compartilhado
   por todas as páginas do site — veja enhance.js. */



/* =========================================================
   CONTATO — formulário (abre o app de e-mail) e copiar e-mail
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const EMAIL = "magenunasp@gmail.com";
  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactStatus");
  const copyBtn = document.getElementById("copyMail");

  function setStatus(msg, type){
    if (!status) return;
    status.textContent = msg;
    status.className = "contact-status show " + (type || "");
  }

  if (form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = form.nome.value.trim();
      const email = form.email.value.trim();
      const assunto = form.assunto.value.trim();
      const mensagem = form.mensagem.value.trim();

      form.querySelectorAll(".field").forEach(f => f.classList.remove("invalid"));
      let ok = true;
      [["nome", nome], ["email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email],
       ["assunto", assunto], ["mensagem", mensagem]].forEach(([name, val]) => {
        if (!val){ form[name].closest(".field").classList.add("invalid"); ok = false; }
      });
      if (!ok){ setStatus("Preencha todos os campos corretamente.", "error"); return; }

      const corpo = mensagem + "\n\n— " + nome + " (" + email + ")";
      window.location.href = "mailto:" + EMAIL +
        "?subject=" + encodeURIComponent("[MAGEN] " + assunto) +
        "&body=" + encodeURIComponent(corpo);

      setStatus("Abrindo seu aplicativo de e-mail para finalizar o envio…", "ok");
    });

    form.querySelectorAll("input, textarea").forEach(el => {
      el.addEventListener("input", () => el.closest(".field").classList.remove("invalid"));
    });
  }

  if (copyBtn){
    copyBtn.addEventListener("click", async () => {
      const original = copyBtn.textContent;
      try {
        await navigator.clipboard.writeText(EMAIL);
        copyBtn.textContent = "E-mail copiado ✓";
      } catch (err) {
        copyBtn.textContent = EMAIL;
      }
      setTimeout(() => (copyBtn.textContent = original), 2000);
    });
  }
});
