function calcular13(e) {
  e.preventDefault();
  const salario = parseFloat(document.getElementById("salario").value) || 0;
  const variavel = parseFloat(document.getElementById("variavel").value) || 0;
  const meses = parseInt(document.getElementById("meses").value, 10);
  const dependentes = parseInt(document.getElementById("dependentes").value, 10) || 0;
  const out = document.getElementById("resultado");
  if (salario <= 0) { out.innerHTML = '<p class="msg">Informe o salário bruto para calcular.</p>'; return; }

  const base = salario + variavel;
  const bruto = r2((base / 12) * meses);
  const p1 = r2(bruto / 2);
  const p2Bruta = r2(bruto - p1);
  const inss = calcInss(bruto);
  const irrf = calcIrrf(bruto, inss, dependentes);
  const p2 = r2(p2Bruta - inss - irrf);

  const linha = (nome, v, cls = "") => `<tr class="${cls}"><td>${nome}</td><td>${brl(v)}</td></tr>`;
  out.innerHTML = `<div class="slip">
    <h2>13º salário: ${meses}/12 avos</h2>
    <table>
      ${linha("13º bruto", bruto, "sub")}
      ${linha("1ª parcela (50%, sem descontos)", p1)}
      ${linha("2ª parcela bruta (50%)", p2Bruta)}
      ${linha("INSS sobre o 13º inteiro", inss, "neg")}
      ${linha("IRRF sobre o 13º inteiro", irrf, "neg")}
      ${linha("2ª parcela líquida", p2, "sub")}
    </table>
    <div class="net"><span>Total líquido do 13º</span><span>${brl(r2(p1 + p2))}</span></div>
    <p class="note">Estimativa para empregado CLT. Prazos de 2026: 1ª parcela até 30 de novembro; 2ª parcela até 20 de dezembro (domingo, então o pagamento deve sair até sexta, dia 18). Confira com o RH.</p>
  </div>`;
}
document.getElementById("form").addEventListener("submit", calcular13);
