const form = document.getElementById("msg-form");
const status = document.getElementById("status");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (form.action.includes("SEU_ID_FORMSPREE")) { status.textContent = "O formulário ainda não foi configurado."; return; }
  const btn = form.querySelector("button");
  btn.disabled = true; status.textContent = "Enviando...";
  try {
    const r = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error("falha");
    form.reset(); status.textContent = "Mensagem enviada. Obrigado!";
  } catch (err) {
    status.textContent = "Não foi possível enviar agora. Tente de novo em instantes.";
  }
  btn.disabled = false;
});
