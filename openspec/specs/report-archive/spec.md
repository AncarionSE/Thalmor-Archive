# report-archive Specification

## Purpose
The landing page: a parchment ledger listing every report in the collection,
newest first, each entry opening its book.

## Requirements

### Requirement: Automatic listing
The archive SHALL list every Markdown file in `src/content/reports/` with its
title, in-world date, classification and summary, sorted by the frontmatter
`order` field descending (newest report first). Adding a new file SHALL require
no code changes.

#### Scenario: New report added
- **WHEN** a valid `.md` file is added to `src/content/reports/`
- **THEN** after rebuild it appears as a ledger entry linking to `/reports/<slug>/`

### Requirement: Ledger presentation
The archive SHALL be styled as a single parchment sheet on the same dark
backdrop as the reader: a Cinzel masthead, a rule, and entries as inked ledger
rows. Entry hover/focus states SHALL be visible without breaking the aged-ink
look. All copy SHALL stay in-character (e.g. "File a new report" instructions
live in the README, not on the page).

### Requirement: Content schema
Report frontmatter SHALL be validated at build time: `title` (string, required),
`author` (string, required), `date` (string, required — in-world date),
`classification` (string, default "Internal"), `summary` (string, required),
`order` (number, required — monotonically increasing filing number).

#### Scenario: Missing title
- **WHEN** a report file lacks `title`
- **THEN** `astro build` fails with a schema error naming the file
