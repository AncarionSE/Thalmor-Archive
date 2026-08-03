# book-reader Specification

## Purpose
Render a single report as a Skyrim-style book: a two-page parchment spread on
a dark backdrop, with a physical page-turn between spreads.

## Requirements

### Requirement: Spread layout
The reader SHALL display two facing parchment pages joined at a spine, centered
on a dark room backdrop. The first spread SHALL show the report's title page on
the right-hand page with a closed cover board on the left. Subsequent spreads
SHALL show pages in book order (odd pages left, even pages right).

#### Scenario: Report with six pages
- **WHEN** a report body contains six `<!--page-->`-delimited pages
- **THEN** the reader produces four spreads: [board | p1], [p2 | p3], [p4 | p5], [p6 | end board]

### Requirement: Page turn
Turning forward SHALL animate a leaf pivoting on the spine from right to left,
showing the outgoing right page on its front face and the incoming left page on
its back face. Turning backward SHALL mirror this. During the turn the pages
beneath SHALL already show the destination spread content so the leaf reveals it.

#### Scenario: Reduced motion
- **WHEN** the user agent reports `prefers-reduced-motion: reduce`
- **THEN** page turns swap content instantly with no 3D animation

### Requirement: Navigation
The reader SHALL support: clicking the outer margin of either page, dedicated
previous/next controls, and ArrowLeft/ArrowRight keys. Controls SHALL be
disabled (visually and functionally) at the first and last spread. Folio
numbers SHALL appear at the outer bottom corner of each content page, and the
report title as a running head in small caps.

#### Scenario: First spread
- **WHEN** the reader is on the first spread
- **THEN** the previous control is disabled and ArrowLeft does nothing

### Requirement: Title page insignia
The title page SHALL display the archive's Thalmor eagle emblem
(`public/icons/eagle.png`, a transparent cutout) above the classification
stamp, and the closed cover board SHALL bear the same emblem centered on the
leather.

### Requirement: Typography
Body text SHALL use an aged-print serif (IM Fell English). Titles and running
heads SHALL use Cinzel / IM Fell English SC. Each content page's first
paragraph SHALL open with an inked drop cap. Lists, emphasis and horizontal
rules in the Markdown SHALL be styled in-theme (ink, no default browser look).

### Requirement: Single-page fallback
Below a 900px viewport the reader SHALL collapse to a single page per turn,
preserving all navigation behaviors.

#### Scenario: Narrow viewport
- **WHEN** the viewport is narrower than 900px
- **THEN** each turn advances exactly one page and the spine/board are hidden
