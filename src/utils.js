const fs = require("fs");
const path = require("path");

function loadJson(relPath) {
  const fullPath = path.join(__dirname, "..", relPath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

function norm(str) {
  return String(str || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

module.exports = { loadJson, norm };
