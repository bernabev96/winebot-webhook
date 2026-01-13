const express = require("express");
const { loadJson } = require("./src/utils");
const {
  recommendWines,
  buildRecommendText,
  pickAlternatives,
  buildAlternativesText,
} = require("./src/recommend");
const {
  mapStyleKey,
  buildPairingText,
  buildRecipeText,
} = require("./src/pairings");
const { mapTopic, buildEduText } = require("./src/edu");

const app = express();
app.use(express.json());

const wines = loadJson("data/wines.json");
const pairings = loadJson("data/pairings.json");
const edu = loadJson("data/edu.json");

app.get("/", (_, res) => res.status(200).send("winebot webhook ok"));

app.post("/winebot", (req, res) => {
  try {
    const action = req.body?.queryResult?.action || "";
    const params = req.body?.queryResult?.parameters || {};
    const queryText = req.body?.queryResult?.queryText || "";
    const session = req.body?.session || "";
    const ctxEduName = session ? `${session}/contexts/ctx_edu_followup` : "";

    let fulfillmentText =
      "Lo siento, no he podido procesar tu petición. ¿Volvemos al menú?";

    switch (action) {
      case "wine_recommend": {
        const recs = recommendWines(wines, params, 3);
        fulfillmentText = buildRecommendText(params, recs);
        break;
      }
      case "wine_alternatives": {
        const { base, altA, altB } = pickAlternatives(wines, params);
        fulfillmentText = buildAlternativesText(params, base, altA, altB);
        break;
      }
      case "wine_pairing": {
        const styleKey = mapStyleKey(params.wine_style || queryText);
        fulfillmentText = buildPairingText(styleKey, pairings);
        break;
      }
      case "wine_recipe": {
        const styleKey = mapStyleKey(params.wine_style || queryText);
        fulfillmentText = buildRecipeText(styleKey, pairings);
        break;
      }
      case "wine_edu": {
        const topicKey = mapTopic(params.topic || queryText);
        const mode =
          String(params.mode || "").toLowerCase() === "long" ? "long" : "short";
        fulfillmentText = buildEduText(topicKey, edu, mode);

        // Guardar el último topic para el "más detalle"
        if (ctxEduName) {
          return res.json({
            fulfillmentText,
            outputContexts: [
              {
                name: ctxEduName,
                lifespanCount: 2,
                parameters: { topic: topicKey },
              },
            ],
          });
        }
        break;
      }
      case "wine_edu_more": {
        const topicKey = params.topic || mapTopic(queryText);
        fulfillmentText = buildEduText(topicKey, edu, "long");
        break;
      }
      default:
        fulfillmentText =
          "Acción no reconocida. ¿Menú, recomendación, maridaje o educación?";
    }

    res.json({ fulfillmentText });
  } catch (e) {
    res.json({
      fulfillmentText: "Error interno en el webhook. ¿Volvemos al menú?",
    });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`Winebot webhook listening on ${port}`));
