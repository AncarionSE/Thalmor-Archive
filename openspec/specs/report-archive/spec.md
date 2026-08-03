# report-archive Specification

## Purpose
The landing page: a shelf of clickable archive volumes, one per report
category, each opening a parchment ledger listing that category's reports.

## Requirements

### Requirement: Category derived from folder
A report's category SHALL be the top-level folder it lives in under
`src/content/reports/` (e.g. `01_Intelligence/some-report.md` belongs to
category `01_intelligence`), not a frontmatter field. `src/lib/categories.ts`
SHALL map each category key to a display label, spine color, and icon used by
the shelf and category pages.

### Requirement: Shelf landing page
The landing page (`/`) SHALL render one clickable "volume" per category that
has at least one filed report, styled as a book cover on a shelf, showing the
category label and a count of filed reports. Categories with zero reports
SHALL NOT appear. Selecting a volume SHALL navigate to `/category/<key>/`.

#### Scenario: New category introduced
- **WHEN** a new category key is added to `src/lib/categories.ts` and at least
  one report file is placed in the matching folder
- **THEN** after rebuild a new volume appears on the shelf linking to its
  category page

### Requirement: Category listing page
Each category SHALL have a statically generated page at `/category/<key>/`
listing every report filed under that category's folder, newest first by the
frontmatter `order` field, styled as the same parchment ledger used
previously on the landing page (title, in-world date, classification,
summary), with a link back to the shelf. Adding a new report file SHALL
require no code changes beyond placing it in the right category folder.

#### Scenario: New report added
- **WHEN** a valid `.md` file is added under `src/content/reports/<category>/`
- **THEN** after rebuild it appears as a ledger entry on that category's page,
  linking to `/reports/<category>/<slug>/`

### Requirement: Content schema
Report frontmatter SHALL be validated at build time: `title` (string, required),
`author` (string, required), `date` (string, required — in-world date),
`classification` (string, default "Internal"), `summary` (string, required),
`order` (number, required — monotonically increasing filing number).

#### Scenario: Missing title
- **WHEN** a report file lacks `title`
- **THEN** `astro build` fails with a schema error naming the file
