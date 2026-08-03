#!/usr/bin/env node
// Scaffold a new report: creates the file in the right category folder with
// frontmatter filled in (title, a computed next `order`, sensible defaults)
// and a short body stub. Keep the CATEGORIES list here in sync with
// src/lib/categories.ts if a category is ever added/renamed.
//
// Usage:
//   npm run new-report -- <category-key> "Report Title"
//   npm run new-report            # lists valid category keys

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPORTS_ROOT = path.join(REPO_ROOT, "src/content/reports");

// key -> { folder on disk, default classification }
const CATEGORIES = {
  "01_intelligence": { folder: "01_Intelligence", classification: "Thalmor Eyes Only" },
  "02_incident_reports": { folder: "02_Incident_Reports", classification: "Thalmor Eyes Only" },
  "03_diplomatic_correspondence": { folder: "03_Diplomatic_Correspondence", classification: "Thalmor Eyes Only" },
  "04_administrative_orders": { folder: "04_Administrative_Orders", classification: "Internal" },
  "05_promotions_and_appointments": { folder: "05_Promotions_and_Appointments", classification: "Internal" },
  "06_procurement_and_trade": { folder: "06_Procurement_and_Trade", classification: "Internal" },
  "07_mining_and_supply": { folder: "07_Mining_and_Supply", classification: "Internal" },
  "08_training": { folder: "08_Training", classification: "Internal" },
  "09_personnel_files": { folder: "09_Personnel_Files", classification: "Internal" },
  "10_meeting_minutes": { folder: "10_Meeting_Minutes", classification: "Internal" },
  "11_ledger_audits": { folder: "11_Ledger_Audits", classification: "Internal" },
  "appendix": { folder: "Appendix", classification: "Internal" },
};

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.name.endsWith(".md")) out.push(p);
  }
  return out;
}

function nextOrder() {
  let max = 0;
  for (const file of walk(REPORTS_ROOT)) {
    const raw = fs.readFileSync(file, "utf8");
    const m = raw.match(/^order:\s*(\d+)/m);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return max + 1;
}

const [categoryKey, title] = process.argv.slice(2);

if (!categoryKey || !title) {
  console.log("Usage: npm run new-report -- <category-key> \"Report Title\"\n");
  console.log("Category keys:");
  for (const key of Object.keys(CATEGORIES)) console.log(" -", key);
  process.exit(categoryKey ? 1 : 0);
}

const category = CATEGORIES[categoryKey];
if (!category) {
  console.error(`Unknown category "${categoryKey}". Valid keys:\n` + Object.keys(CATEGORIES).map((k) => " - " + k).join("\n"));
  process.exit(1);
}

const slug = slugify(title);
if (!slug) {
  console.error("Title produced an empty slug — use at least one letter or number.");
  process.exit(1);
}

const dir = path.join(REPORTS_ROOT, category.folder);
fs.mkdirSync(dir, { recursive: true });
const filePath = path.join(dir, `${slug}.md`);
if (fs.existsSync(filePath)) {
  console.error(`Already exists: ${path.relative(REPO_ROOT, filePath)}`);
  process.exit(1);
}

const order = nextOrder();
const content = `---
title: "${title.replace(/"/g, '\\"')}"
author: "Canonreeve Ancarion Saelthar"
date: "TODO: in-world date"
classification: "${category.classification}"
summary: "TODO: one-sentence summary shown in the ledger."
order: ${order}
---

## Report

Write the report here. Plain paragraphs, ## headings, - lists, and
Markdown tables all work. Don't add <!--page--> markers by hand — run
\`npm run paginate\` when you're done and it inserts them for you.
`;

fs.writeFileSync(filePath, content);
console.log(`Created ${path.relative(REPO_ROOT, filePath)} (order: ${order})`);
console.log("Next: write the report, then run `npm run paginate` and `npm run dev` to preview.");
