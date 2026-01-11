const { norm } = require("./utils");

function scoreWine(wine, prefs) {
  let score = 0;

  const color = norm(prefs.color);
  const sweetness = norm(prefs.dulzor);
  const body = norm(prefs.cuerpo);
  const occasion = norm(prefs.ocasion);
  const budget = Number(prefs.presupuesto);

  if (color && norm(wine.color) === color) score += 3;
  if (sweetness && norm(wine.sweetness) === sweetness) score += 2;
  if (body && norm(wine.body) === body) score += 2;

  if (occasion && Array.isArray(wine.occasion)) {
    const occs = wine.occasion.map(norm);
    if (occs.includes(occasion)) score += 2;
  }

  if (!Number.isNaN(budget)) {
    const price = Number(wine.price);
    if (price <= budget) score += 3;
    else if (price <= budget * 1.2) score += 1;
    else score -= 3;
  }

  return score;
}

function recommendWines(wines, prefs, n = 3) {
  const ranked = wines
    .map((w) => ({ w, s: scoreWine(w, prefs) }))
    .sort((a, b) => b.s - a.s);

  return ranked.slice(0, n).map((x) => x.w);
}

function buildRecommendText(prefs, recs) {
  const b = Number(prefs.presupuesto);
  const budgetTxt = Number.isNaN(b) ? "" : `, ~${b}€`;

  const header =
    `Perfecto. Con tu perfil (${prefs.color}, ${prefs.dulzor}, ${prefs.cuerpo}, ` +
    `${prefs.ocasion}${budgetTxt}) te encajan estas opciones:\n`;

  const lines = recs.map((w, i) => {
    const notes = Array.isArray(w.notes) ? w.notes.slice(0, 2).join(", ") : "";
    return `${i + 1}) ${w.name} — ${w.region} — ${w.price}€` + (notes ? ` (${notes})` : "");
  });

  return header + lines.join("\n") + `\n\n¿Quieres que guarde estas preferencias durante esta sesión?`;
}

function buildAlternativesText(prefs, baseWine, altA, altB) {
  const budgetTxt = prefs.presupuesto ? `~${prefs.presupuesto}€` : "";
  return (
    `Perfecto. Mantengo tu perfil (${prefs.color}, ${prefs.dulzor}, ${prefs.cuerpo}, ${prefs.ocasion} ${budgetTxt}).\n` +
    `Aquí van 2 alternativas similares, con matiz distinto:\n\n` +
    `1) ${altA.name} — ${altA.region} — ${altA.price}€\n` +
    `2) ${altB.name} — ${altB.region} — ${altB.price}€\n\n` +
    `¿Quieres 1, 2, pedir maridaje o volver al menú?`
  );
}

function pickAlternatives(wines, prefs) {
  const recs = recommendWines(wines, prefs, 5);
  const base = recs[0] || wines[0];

  // Alternativa "más fresca": body más ligero si existe
  const altA =
    recs.find((w) => norm(w.body) === "ligero" && w.id !== base.id) ||
    recs.find((w) => w.id !== base.id) ||
    base;

  // Alternativa "más seria": con_cuerpo si existe
  const altB =
    recs.find((w) => norm(w.body) === "con_cuerpo" && w.id !== base.id) ||
    recs.find((w) => w.id !== base.id && w.id !== altA.id) ||
    base;

  return { base, altA, altB };
}

module.exports = { recommendWines, buildRecommendText, pickAlternatives, buildAlternativesText };
