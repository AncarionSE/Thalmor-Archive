#!/usr/bin/env node
// Auto-paginate report bodies: reads each report's Markdown, strips any
// existing <!--page--> markers, and re-inserts them so every page fits the
// book's page height without scrolling. Run after writing or editing a
// report — no need to place page breaks by hand.
//
// Usage:
//   npm run paginate            # repaginate every report
//   npm run paginate -- <file>  # repaginate one file (path relative to repo root, or absolute)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPORTS_ROOT = path.join(REPO_ROOT, "src/content/reports");

// Calibrated against the live-rendered page: .page-text clientHeight
// measured at ~481px on desktop. Budget kept safely under that — see
// openspec/specs/report-archive/spec.md for how this was derived.
const PAGE_BUDGET = 405;
const CPL_BODY = 56; // chars/line for body text & list/table cells (~16.3px font)
const CPL_HEADING = 30; // chars/line for h2/h3 (~23px font)
const LH_BODY = 24.5;
const LH_HEADING = 32;
const PARA_MARGIN = 14;
const LIST_BLOCK_MARGIN = 14;
const LIST_ITEM_MARGIN = 5;
const ORNAMENT_OVERHEAD = 32; // gap + divider height + gap under the page's first heading
const TABLE_ROW_MARGIN = 6;

function plainLen(s) {
  return s.replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "").length;
}
function headingHeight(text, withOrnament) {
  const lines = Math.max(1, Math.ceil(plainLen(text) / CPL_HEADING));
  return lines * LH_HEADING + (withOrnament ? ORNAMENT_OVERHEAD : 6);
}
function paraHeight(text) {
  const lines = Math.max(1, Math.ceil(plainLen(text) / CPL_BODY));
  return lines * LH_BODY + PARA_MARGIN;
}
function listItemHeight(text) {
  const lines = Math.max(1, Math.ceil(plainLen(text) / CPL_BODY));
  return lines * LH_BODY + LIST_ITEM_MARGIN;
}
function tableRowHeight(cells) {
  const widest = Math.max(...cells.map(plainLen));
  const lines = Math.max(1, Math.ceil(widest / (CPL_BODY / cells.length)));
  return lines * LH_BODY + TABLE_ROW_MARGIN;
}

function classify(line) {
  if (/^\s*<!--\s*force-page\s*-->\s*$/.test(line)) return "break";
  if (/^#{1,6}\s/.test(line)) return "heading";
  if (/^\s*([-*]|\d+\.)\s/.test(line)) return "list";
  if (/^\s*\|/.test(line)) return "table";
  return "para";
}

// Line-based tokenizer: groups consecutive lines of the SAME type into one
// typed block. A heading is always its own single-line block. Type changes
// always start a new block, WITH or WITHOUT a blank line between them (a
// `## Heading` directly followed by `- item` with no blank line is valid
// Markdown and must still be recognized as heading+list, not one blob).
// A blank line only ends a run when the next non-blank line is a DIFFERENT
// type than the current run (so a "loose list" with blank lines between
// items still counts as one continuous list block).
function tokenize(body) {
  const rawLines = body.replace(/\n?\s*<!--\s*page\s*-->\s*\n?/g, "\n\n").split("\n");
  const blocks = [];
  let current = null;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (!line.trim()) {
      let j = i + 1;
      while (j < rawLines.length && !rawLines[j].trim()) j++;
      const nextType = j < rawLines.length ? classify(rawLines[j]) : null;
      if (current && current.type === "list" && nextType === "list") {
        continue; // swallow the blank line, loose list continues
      }
      current = null;
      continue;
    }
    const type = classify(line);
    if (type === "heading" || type === "break" || !current || current.type !== type) {
      current = { type, lines: [] };
      blocks.push(current);
    }
    current.lines.push(line);
  }
  return blocks.map((b) => ({ type: b.type, text: b.lines.join("\n") }));
}

// Turn a raw markdown body into a flat list of atoms: { text, height, isTableRow/isListItem, ... }
function toAtoms(body) {
  const blocks = tokenize(body);
  const atoms = [];
  let tableCounter = 0;
  let listCounter = 0;

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "heading") continue; // always consumed by the block that follows it, below
    if (b.type === "break") { atoms.push({ forceBreak: true, text: "", height: 0 }); continue; }

    const headingBefore = i > 0 && blocks[i - 1].type === "heading" ? blocks[i - 1].text : null;

    if (b.type === "list") {
      const items = b.text.split("\n").filter(Boolean);
      listCounter++;
      const listId = listCounter;
      items.forEach((item, idx) => {
        const h = listItemHeight(item);
        if (idx === 0 && headingBefore) {
          atoms.push({ text: `${headingBefore}\n\n${item}`, height: headingHeight(headingBefore, true) + h, isListItem: true, listId });
        } else {
          atoms.push({ text: item, height: h, isListItem: true, listId });
        }
      });
      continue;
    }

    if (b.type === "table") {
      const lines = b.text.split("\n").filter(Boolean);
      const header = lines[0];
      const sep = lines[1];
      // Drop any repeated header/separator rows already baked in by a
      // previous pagination pass (they read as plain `|`-prefixed lines
      // once <!--page--> markers are stripped, so a naive re-run would
      // otherwise treat them as real data rows and re-inject yet another
      // copy — this keeps the script idempotent to re-run.
      const rows = lines.slice(2).filter((l) => l !== header && l !== sep);
      const headerMd = `${header}\n${sep}`;
      const headerH = tableRowHeight(header.split("|").filter(Boolean)) + tableRowHeight(sep.split("|").filter(Boolean));
      tableCounter++;
      const tableId = tableCounter;
      rows.forEach((row, idx) => {
        const rowH = tableRowHeight(row.split("|").filter(Boolean));
        if (idx === 0) {
          const prefix = headingBefore ? `${headingBefore}\n\n` : "";
          const prefixH = headingBefore ? headingHeight(headingBefore, true) : 0;
          atoms.push({
            text: `${prefix}${headerMd}\n${row}`,
            height: prefixH + headerH + rowH,
            isTableRow: true,
            headerMd,
            headerH,
            tableId,
          });
        } else {
          atoms.push({ text: row, height: rowH, isTableRow: true, headerMd, headerH, tableId });
        }
      });
      continue;
    }

    // paragraph
    if (headingBefore) {
      atoms.push({ text: `${headingBefore}\n\n${b.text}`, height: headingHeight(headingBefore, true) + paraHeight(b.text) });
    } else {
      atoms.push({ text: b.text, height: paraHeight(b.text) });
    }
  }

  // a heading with nothing after it at all (edge case) — shouldn't occur in
  // practice, but don't silently drop it
  if (blocks.length && blocks[blocks.length - 1].type === "heading") {
    const h = blocks[blocks.length - 1];
    atoms.push({ text: h.text, height: headingHeight(h.text, true) });
  }

  return atoms;
}

// Join placed atoms for one page: consecutive rows of the SAME table, or
// consecutive items of the SAME list, must stay on contiguous lines (a blank
// line terminates a GFM table, and turns each list item into its own
// separate <ul> instead of one continuous list) — everything else gets the
// normal blank-line block separator.
function joinPage(placed) {
  let out = placed[0].text;
  for (let i = 1; i < placed.length; i++) {
    const prev = placed[i - 1];
    const cur = placed[i];
    const sameTable = prev.isTableRow && cur.isTableRow && prev.tableId === cur.tableId;
    const sameList = prev.isListItem && cur.isListItem && prev.listId === cur.listId;
    out += (sameTable || sameList ? "\n" : "\n\n") + cur.text;
  }
  return out;
}

// Does this atom, at this position (first in `current`, or right after
// `prevAtom`), need the extra cost of opening a fresh block (a table header
// repeat, or a new <ul>'s block margin)?
function restartCost(atom, prevAtom) {
  if (atom.isTableRow && (!prevAtom || !(prevAtom.isTableRow && prevAtom.tableId === atom.tableId))) {
    return { extra: atom.headerH, prefix: `${atom.headerMd}\n` };
  }
  if (atom.isListItem && (!prevAtom || !(prevAtom.isListItem && prevAtom.listId === atom.listId))) {
    return { extra: LIST_BLOCK_MARGIN, prefix: "" };
  }
  return { extra: 0, prefix: "" };
}

function pack(atoms) {
  const pages = [];
  // forcedStart[i] = page i began at an explicit <!--force-page--> boundary
  // rather than the packer just running out of budget. Preserved through to
  // the output (as a literal <!--force-page--> marker) so a forced break
  // survives being re-run through this script any number of times — a plain
  // <!--page--> is regenerated fresh every run and carries no such promise.
  const forcedStart = [];
  let current = [];
  let currentHeight = 0;
  let pendingForce = false;

  for (const atom of atoms) {
    if (atom.forceBreak) {
      if (current.length) {
        pages.push(joinPage(current));
        current = [];
        currentHeight = 0;
      }
      pendingForce = true;
      continue;
    }
    const prevAtom = current.length ? current[current.length - 1] : null;
    let { extra, prefix } = restartCost(atom, prevAtom);
    let text = prefix + atom.text;
    let h = atom.height + extra;

    if (current.length > 0 && currentHeight + h > PAGE_BUDGET) {
      pages.push(joinPage(current));
      current = [];
      currentHeight = 0;
      pendingForce = false; // ran out of budget, not an explicit break
      ({ extra, prefix } = restartCost(atom, null));
      text = prefix + atom.text;
      h = atom.height + extra;
    }
    if (current.length === 0) {
      forcedStart.push(pendingForce);
      pendingForce = false;
    }
    current.push({ ...atom, text });
    currentHeight += h;
  }
  if (current.length) pages.push(joinPage(current));

  let out = pages[0] ?? "";
  for (let i = 1; i < pages.length; i++) {
    out += (forcedStart[i] ? "\n\n<!--force-page-->\n\n" : "\n\n<!--page-->\n\n") + pages[i];
  }
  return out;
}

function paginate(rawBody) {
  return pack(toAtoms(rawBody));
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

const arg = process.argv[2];
const files = arg
  ? [path.isAbsolute(arg) ? arg : path.join(REPO_ROOT, arg)]
  : walk(REPORTS_ROOT);

let changed = 0;
for (const file of files) {
  const raw = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const m = raw.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
  if (!m) { console.error("NO FRONTMATTER MATCH", file); continue; }
  const [, frontmatter, body] = m;
  const newBody = paginate(body);
  const beforePages = (body.match(/<!--\s*page\s*-->/g) || []).length + 1;
  const afterPages = (newBody.match(/<!--\s*page\s*-->/g) || []).length + 1;
  if (newBody.trim() !== body.trim()) {
    fs.writeFileSync(file, frontmatter + "\n" + newBody.trim() + "\n");
    changed++;
    if (beforePages !== afterPages) {
      console.log(path.relative(REPORTS_ROOT, file), `pages ${beforePages} -> ${afterPages}`);
    }
  }
}
console.log(`paginate: ${changed}/${files.length} file(s) updated`);
