const { norm } = require("./utils");

function mapStyleKey(wineStyle) {
  const s = norm(wineStyle);
  if (s.includes("rioja") || s.includes("tempranillo") || s.includes("crianza")) return "rioja_crianza";
  if (s.includes("albarino") || s.includes("rias baixas") || s.includes("verdejo") || s.includes("blanco")) return "blanco_fresco";
  if (s.includes("cava") || s.includes("espumoso") || s.includes("brut")) return "cava_brut";
  return "rioja_crianza";
}

function pickN(arr, n) {
  const a = Array.isArray(arr) ? [...arr] : [];
  // shuffle simple
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(n, a.length));
}

function buildPairingText(styleKey, pairings) {
  const p = pairings[styleKey] || pairings["rioja_crianza"];

  const classicPick = pickN(p.classic || [], 2);
  const creativePick = pickN(p.creative || [], 1);

  const classic = classicPick.map((x) => `• ${x}`).join("\n") || "• (sin datos)";
  const creative = creativePick.map((x) => `• ${x}`).join("\n") || "• (sin dato)";

  return (
    `Genial. Para este estilo:\n` +
    `✅ Clásicos:\n${classic}\n` +
    `✨ Creativo:\n${creative}\n\n` +
    `¿Quieres una receta rápida o lo dejamos aquí?`
  );
}

function buildRecipeText(styleKey, pairings) {
  const p = pairings[styleKey] || pairings["rioja_crianza"];
  const list = (p.recipes && Array.isArray(p.recipes)) ? p.recipes : [];
  const r = list.length ? list[Math.floor(Math.random() * list.length)] : null;

  if (!r) return "Perfecto. ¿Volvemos al menú o quieres otro maridaje?";

  const steps = (r.steps || []).map((x, i) => `${i + 1}) ${x}`).join("\n");
  return (
    `Receta rápida: ${r.title}\n` +
    `${steps}\n` +
    `Por qué encaja: ${r.why}\n\n` +
    `¿Volvemos al menú o quieres otro maridaje?`
  );
}

module.exports = { mapStyleKey, buildPairingText, buildRecipeText };
