(function () {
  try { if (localStorage.getItem("cc-ok")) return; } catch (e) {}
  const b = document.createElement("div");
  b.className = "cookie"; b.setAttribute("role", "dialog"); b.setAttribute("aria-label", "Aviso de cookies");
  b.innerHTML = '<p>Usamos cookies para exibir anúncios e entender como o site é usado. Saiba mais na <a href="privacidade.html">Política de Privacidade</a>.</p><button type="button">Entendi</button>';
  b.querySelector("button").onclick = function () { try { localStorage.setItem("cc-ok", "1"); } catch (e) {} b.remove(); };
  document.body.appendChild(b);
})();
