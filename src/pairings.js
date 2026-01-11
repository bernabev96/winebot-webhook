const { norm } = require("./utils");

function mapStyleKey(wineStyle) {
  const s = norm(wineStyle);
  if (s.includes("rioja") || s.includes("tempranillo") || s.includes("crianza")) return "rioja_crianza";
  if (s.includes("albarino") || s.includes("rias baixas") || s.includes("verdejo") || s.includes("blanco")) return "blanco_fresco";
  if (s.includes("cava") || s.includes("espumoso") || s.includes("brut")) return "cava_brut";
  return "rioja_crianza";
}

function buildPairingText(styleKey, pairings) {
  const p = pairings[styleKey] || pairings["rioja_crianza"];
  const classic = p.classic.slice(0, 2).map((x) => `• ${x}`).join("\n");
  const creative = p.creative.slice(0, 1).map((x) => `• ${x}`).join("\n");
  return (
    `Genial. Para este estilo:\n` +
    `✅ Clásicos:\n${classic}\n` +
    `✨ Creativo:\n${creative}\n\n` +
    `¿Quieres una receta rápida o lo dejamos aquí?`
  );
}

function buildRecipeText(styleKey, pairings) {
  const p = pairings[styleKey] || pairings["rioja_crianza"];
  const r = (p.recipes && p.recipes[0]) ? p.recipes[0] : null;
  if (!r) return "Perfecto. ¿Volvemos al menú o quieres otro maridaje?";

  const steps = r.steps.map((x, i) => `${i + 1}) ${x}`).join("\n");
  return (
    `Receta rápida: ${r.title}\n` +
    `${steps}\n` +
    `Por qué encaja: ${r.why}\n\n` +
    `¿Volvemos al menú o quieres otro maridaje?`
  );
}

module.exports = { mapStyleKey, buildPairingText, buildRecipeText };
