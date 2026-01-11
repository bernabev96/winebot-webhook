const { norm } = require("./utils");

function mapTopic(text) {
  const t = norm(text);
  if (t.includes("crianza") || t.includes("reserva")) return "crianza_vs_reserva";
  if (t.includes("temperatura")) return "temperatura_servicio";
  if (t.includes("decant")) return "decantar";
  return "temperatura_servicio";
}

function buildEduText(topicKey, edu, mode = "short") {
  const item = edu[topicKey] || edu["temperatura_servicio"];
  if (mode === "long") {
    const tips = (item.tips || []).slice(0, 3).map((x) => `• ${x}`).join("\n");
    return `${item.long}\n\nTips:\n${tips}\n\n¿Quieres otro tema o volvemos al menú?`;
  }
  return `${item.short}\n\n¿Quieres más detalle o volvemos al menú?`;
}

module.exports = { mapTopic, buildEduText };
