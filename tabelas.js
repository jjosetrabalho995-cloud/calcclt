// Tabelas de 2026. Atualize aqui quando mudarem (INSS: portaria anual; IRRF: Receita Federal).
const INSS = [[1621.00, 0.075], [2902.84, 0.09], [4354.27, 0.12], [8475.55, 0.14]];
const IR = [
  [2428.80, 0, 0],
  [2826.65, 0.075, 182.16],
  [3751.05, 0.15, 394.16],
  [4664.68, 0.225, 675.49],
  [Infinity, 0.275, 908.73],
];
const DESCONTO_SIMPLIFICADO = 607.20;
const DEDUCAO_DEPENDENTE = 189.59;

const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const r2 = (v) => Math.round(v * 100) / 100;

function calcInss(base) {
  let anterior = 0, total = 0;
  for (const [limite, aliquota] of INSS) {
    if (base > anterior) total += (Math.min(base, limite) - anterior) * aliquota;
    anterior = limite;
  }
  return r2(total);
}

// rendimento = total tributável bruto (usado na fórmula do redutor da Lei 15.270/2025)
function calcIrrf(rendimento, inss, dependentes) {
  const deducao = Math.max(inss, DESCONTO_SIMPLIFICADO) + dependentes * DEDUCAO_DEPENDENTE;
  const base = Math.max(0, rendimento - deducao);
  const faixa = IR.find((f) => base <= f[0]);
  const imposto = Math.max(0, base * faixa[1] - faixa[2]);
  let reducao = 0;
  if (rendimento <= 5000) reducao = imposto;
  else if (rendimento <= 7350) reducao = Math.max(0, 978.62 - 0.133145 * rendimento);
  return r2(Math.max(0, imposto - reducao));
}
