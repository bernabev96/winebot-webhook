const { norm } = require("./utils");

function mapTopic(text) {
  const t = norm(text);

  // 1) Crianza / Reserva
  if (t.includes("crianza") || t.includes("reserva") || t.includes("gran reserva")) {
    return "crianza_vs_reserva";
  }
  // 2) Temperaturas
  if (t.includes("temperatura") || t.includes("temperaturas") || t.includes("grados") || t.includes("servir")) {
    return "temperatura_servicio";
  }
  // 3) Decantar / airear
  if (t.includes("decant") || t.includes("decantar") || t.includes("airear") || t.includes("oxigenar")) {
    return "decantar";
  }
  // 4) Taninos
  if (t.includes("tanino") || t.includes("taninos") || t.includes("astring") || t.includes("aspero") || t.includes("áspero")) {
    return "taninos";
  }
  // 5) Sulfitos
  if (t.includes("sulfito") || t.includes("sulfitos") || t.includes("so2") || t.includes("s02")) {
    return "sulfitos";
  }
  // 6) Conservación (botella abierta)
  if (
    t.includes("conservar") || t.includes("conservacion") || t.includes("conservación") ||
    t.includes("botella abierta") || t.includes("abierta") || t.includes("guardar") ||
    t.includes("cuanto dura") || t.includes("cuánto dura")
  ) {
    return "conservacion_abierto";
  }
  // 7) Copas
  if (t.includes("copa") || t.includes("copas") || t.includes("vaso")) {
    return "copas";
  }
  // 8) Brut / espumoso
  if (t.includes("brut") || t.includes("extra brut") || t.includes("extra dry") || t.includes("espumoso") || t.includes("cava")) {
    return "brut_espumoso";
  }
  // Fallback: tema no reconocido
  return "unknown";
}

function buildEduText(topicKey, edu, mode = "short") {
  if (topicKey === "unknown" || !edu[topicKey]) {
    return (
      "No tengo ese tema todavía 😅\n\n" +
      "Puedo ayudarte, por ejemplo, con:\n" +
      "· Temperatura de servicio\n" +
      "· Crianza vs reserva\n" +
      "· Decantar\n" +
      "· Taninos\n" +
      "· Sulfitos\n" +
      "· Conservación de una botella abierta\n" +
      "· Copas\n" +
      "· Qué significa Brut\n\n" +
      "Escribe uno de esos temas o pregúntame de otra forma."
    );
  }

  const item = edu[topicKey];

  if (mode === "long") {
    const tips = (item.tips || []).slice(0, 3).map((x) => `· ${x}`).join("\n");
    return `${item.long}\n\nTips:\n${tips}\n\n¿Quieres otro tema o volvemos al menú?`;
  }

  return `${item.short}\n\n¿Quieres más detalle o volvemos al menú?`;
}

module.exports = { mapTopic, buildEduText };
