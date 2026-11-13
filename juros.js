// Usa brl e r2 de tabelas.js
function calcularJuros(e) {
  e.preventDefault();
  const num = (id) => parseFloat(document.getElementById(id).value) || 0;
  const inicial = num("inicial"), mensal = num("mensal"), taxa = num("taxa"), periodo = num("periodo");
  const tipoTaxa = document.getElementById("tipoTaxa").value;
  const tipoPeriodo = document.getElementById("tipoPeriodo").value;
  const out = document.getElementById("resultado");

  const n = Math.round(tipoPeriodo === "anos" ? periodo * 12 : periodo);
  if (inicial < 0 || mensal < 0 || taxa < 0) { out.innerHTML = '<p class="msg">Use apenas valores positivos.</p>'; return; }
  if (inicial === 0 && mensal === 0) { out.innerHTML = '<p class="msg">Informe o valor inicial ou o valor mensal.</p>'; return; }
  if (n < 1 || n > 1200) { out.innerHTML = '<p class="msg">Informe um período entre 1 mês e 100 anos.</p>'; return; }

  // taxa mensal: se a taxa é anual, usa a taxa equivalente composta
  const i = tipoTaxa === "anual" ? Math.pow(1 + taxa / 100, 1 / 12) - 1 : taxa / 100;
  let saldo = inicial, investido = inicial;
  const linhas = [];
  for (let m = 1; m <= n; m++) {
    saldo = saldo * (1 + i) + mensal; // aporte no fim de cada mês
    investido += mensal;
    if (n <= 24 || m % 12 === 0 || m === n) {
      const rot = n <= 24 ? `Mês ${m}` : (m % 12 === 0 ? `${m / 12} ${m / 12 === 1 ? "ano" : "anos"}` : `${m} meses`);
      linhas.push(`<tr><td>${rot}</td><td>${brl(r2(investido))}</td><td>${brl(r2(saldo - investido))}</td><td>${brl(r2(saldo))}</td></tr>`);
    }
  }
  const juros = saldo - investido;
  const linha = (nome, v, cls = "") => `<tr class="${cls}"><td>${nome}</td><td>${brl(r2(v))}</td></tr>`;
  out.innerHTML = `<div class="slip">
    <h2>Simulação em ${n} ${n === 1 ? "mês" : "meses"}${n >= 12 && n % 12 === 0 ? ` (${n / 12} ${n / 12 === 1 ? "ano" : "anos"})` : ""}</h2>
    <table>
      ${linha("Total investido", investido)}
      ${linha("Total em juros", juros, "sub")}
    </table>
    <div class="net"><span>Valor total final</span><span>${brl(r2(saldo))}</span></div>
    <p class="note">Simulação com taxa constante, aportes no fim de cada mês e valores brutos, sem imposto nem inflação. Rentabilidade passada não garante resultado futuro, e isto não é recomendação de investimento.</p>
  </div>
  <div class="evo-wrap"><table class="evo"><thead><tr><th>Período</th><th>Investido</th><th>Juros</th><th>Saldo</th></tr></thead><tbody>${linhas.join("")}</tbody></table></div>`;
}
document.getElementById("form").addEventListener("submit", calcularJuros);
