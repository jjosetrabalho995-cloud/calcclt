// Usa calcInss, calcIrrf, brl e r2 de tabelas.js
function cenario(base, diasGozo, diasAbono, dependentes) {
  const ferias = r2((base / 30) * diasGozo);
  const terco = r2(ferias / 3);
  const abono = r2((base / 30) * diasAbono);
  const abonoTerco = r2(abono / 3);
  const tributavel = ferias + terco; // abono não paga INSS nem IR
  const inss = calcInss(tributavel);
  const irrf = calcIrrf(tributavel, inss, dependentes);
  const proventos = r2(ferias + terco + abono + abonoTerco);
  const liquido = r2(proventos - inss - irrf);
  const salarioDias = r2((base / 30) * diasAbono); // salário bruto dos dias que você trabalha
  return { ferias, terco, abono, abonoTerco, inss, irrf, proventos, liquido, salarioDias, total: r2(liquido + salarioDias) };
}

function calcular(e) {
  e.preventDefault();
  const salario = parseFloat(document.getElementById("salario").value) || 0;
  const variavel = parseFloat(document.getElementById("variavel").value) || 0;
  const diasDireito = parseInt(document.getElementById("faltas").value, 10);
  const vender = document.getElementById("abono").checked;
  const dependentes = parseInt(document.getElementById("dependentes").value, 10) || 0;
  const out = document.getElementById("resultado");

  if (salario <= 0) { out.innerHTML = '<p class="msg">Informe o salário bruto para calcular.</p>'; return; }
  if (diasDireito === 0) { out.innerHTML = '<p class="msg">Com mais de 32 faltas injustificadas no período, o direito às férias é perdido (CLT, art. 130).</p>'; return; }

  const base = salario + variavel;
  const diasAbono = vender ? Math.floor(diasDireito / 3) : 0;
  const diasGozo = diasDireito - diasAbono;
  const v = cenario(base, diasGozo, diasAbono, dependentes);

  const linha = (nome, valor, cls = "") => `<tr class="${cls}"><td>${nome}</td><td>${brl(valor)}</td></tr>`;
  let extra = "", fim = "", nota = "Estimativa para empregado CLT com jornada integral. O abono pecuniário não paga INSS nem IR. Confira com o RH, pois convenções coletivas e médias de variáveis podem alterar o valor.";

  if (diasAbono) {
    const s = cenario(base, diasDireito, 0, dependentes);
    const vantagem = r2(v.total - s.total);
    extra = linha(`+ Salário dos ${diasAbono} dias trabalhados (bruto)`, v.salarioDias);
    fim = `<div class="net"><span>Total aproximado</span><span>${brl(v.total)}</span></div>`;
    nota = `Você descansa ${diasGozo} dias e trabalha ${diasAbono}: por esses ${diasAbono} dias você recebe o salário normal na folha do mês, além do abono, e esse valor sofre os descontos normais da folha. Sem vender, você receberia ${brl(s.total)}, ou seja, ${vantagem >= 0 ? "ganha" : "perde"} cerca de ${brl(Math.abs(vantagem))} vendendo. ` + nota;
  } else {
    fim = `<div class="net"><span>Líquido a receber</span><span>${brl(v.liquido)}</span></div>`;
  }

  out.innerHTML = `<div class="slip">
    <h2>Recibo de férias: ${diasGozo} dias de descanso${diasAbono ? ` + ${diasAbono} vendidos` : ""}</h2>
    <table>
      ${linha(`Férias (${diasGozo} dias)`, v.ferias)}
      ${linha("Adicional de 1/3", v.terco)}
      ${diasAbono ? linha(`Abono pecuniário (${diasAbono} dias)`, v.abono) + linha("1/3 sobre o abono", v.abonoTerco) : ""}
      ${linha("Total de proventos", v.proventos, "sub")}
      ${linha("INSS", v.inss, "neg")}
      ${linha("IRRF", v.irrf, "neg")}
      ${linha("Líquido do recibo de férias", v.liquido, "sub")}
      ${extra}
    </table>
    ${fim}
    <p class="note">${nota}</p>
  </div>`;
}

document.getElementById("form").addEventListener("submit", calcular);
