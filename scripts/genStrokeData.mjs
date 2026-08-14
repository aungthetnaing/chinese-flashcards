// Generates src/data/strokeData.json containing Hanzi Writer stroke data for
// only the characters used in the flashcard deck, so the Write tab works offline.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "src", "data");
const hwDir = path.join(root, "node_modules", "hanzi-writer-data");

const sourceFiles = [
  path.join(dataDir, "integratedChinese1.ts"),
  path.join(dataDir, "integratedChinese1Part2.ts"),
];

const hanRegex = /\p{Script=Han}/u;
const chars = new Set();

for (const file of sourceFiles) {
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/simplified:\s*"([^"]+)"/g)) {
    for (const ch of match[1]) {
      if (hanRegex.test(ch)) {
        chars.add(ch);
      }
    }
  }
}

const out = {};
let missing = 0;
for (const ch of chars) {
  const jsonPath = path.join(hwDir, `${ch}.json`);
  if (fs.existsSync(jsonPath)) {
    out[ch] = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  } else {
    missing += 1;
    console.warn(`No stroke data for: ${ch}`);
  }
}

const outPath = path.join(dataDir, "strokeData.json");
fs.writeFileSync(outPath, JSON.stringify(out));
const sizeKb = (fs.statSync(outPath).size / 1024).toFixed(0);
console.log(
  `Wrote ${Object.keys(out).length} characters (${sizeKb} KB) to strokeData.json` +
    (missing ? `, ${missing} missing` : ""),
);

// Inline the Hanzi Writer library itself so the Write tab needs no network.
const libSrc = fs.readFileSync(
  path.join(root, "node_modules", "hanzi-writer", "dist", "hanzi-writer.min.js"),
  "utf8",
);
const libPath = path.join(dataDir, "hanziWriterLib.json");
fs.writeFileSync(libPath, JSON.stringify({ lib: libSrc }));
const libKb = (fs.statSync(libPath).size / 1024).toFixed(0);
console.log(`Wrote Hanzi Writer library (${libKb} KB) to hanziWriterLib.json`);
