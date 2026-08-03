export interface Category {
  key: string; // matches the report.id folder segment (lowercased by Astro)
  label: string;
  spine: string; // leather tone for the shelf card
  icon: string; // inline SVG markup, bold filled silhouette, currentColor
}

// Bold filled-silhouette glyphs, hand-drawn originals (no game assets) —
// same visual weight as flat single-color emblem sets: solid shapes first,
// a couple of ringed/stroke forms where that reads better.
const fill = (viewBox: string, paths: string) =>
  `<svg viewBox="${viewBox}" fill="currentColor">${paths}</svg>`;
const mixed = (viewBox: string, body: string) =>
  `<svg viewBox="${viewBox}" fill="none">${body}</svg>`;

export const CATEGORIES: Category[] = [
  {
    key: '01_intelligence',
    label: 'Intelligence Reports',
    spine: '#5b2a2a',
    // the same spread-wing mark as the book insignia, flattened to one tone
    icon: fill(
      '0 0 200 150',
      `<circle cx="100" cy="15" r="8"/>
       <path d="M92,12 L78,16 L92,20 Z"/>
       <path d="M100,22 C130,22 138,45 132,75 C128,100 115,115 100,120 C85,115 72,100 68,75 C62,45 70,22 100,22 Z"/>
       <path d="M88,115 L82,138 L96,124 L100,142 L104,124 L118,138 L112,115 Z"/>
       <path d="M141,39.3 L189.3,9.8 L161,36.5 L199.6,31.9 L163.8,46.1 L198,50 L163.6,55 L191,69.2 L144.1,57 Z"/>
       <path d="M59,39.3 L10.7,9.8 L39,36.5 L0.4,31.9 L36.2,46.1 L2,50 L36.4,55 L9,69.2 L55.9,57 Z"/>`
    ),
  },
  {
    key: '02_incident_reports',
    label: 'Patrol &amp; Incident Reports',
    spine: '#4a3420',
    icon: fill(
      '0 0 24 24',
      `<path d="M11.25 2 L12.75 2 L13.4 11 L10.6 11 Z"/>
       <path d="M7 12.2h10v1.6H7z"/>
       <path d="M11 14.3h2v4.2h-2z"/>
       <path d="M9.3 19h5.4v1.6H9.3z"/>`
    ),
  },
  {
    key: '03_diplomatic_correspondence',
    label: 'Diplomatic Correspondence',
    spine: '#2c3d4a',
    icon: fill(
      '0 0 24 24',
      `<path d="M20 2c-4.5 1-9.5 4.5-13 10.5C5.5 15 4.5 17.5 4 20c2.7-1 5.3-2.3 8-4.5C17 11 19.5 6 20 2Z"/>
       <path d="M5 19l-1.5 3 3-1.2z"/>`
    ),
  },
  {
    key: '04_administrative_orders',
    label: 'Administrative Orders',
    spine: '#3a2e17',
    icon: fill(
      '0 0 24 24',
      `<circle cx="12" cy="8.5" r="5.5"/>
       <path d="M9 13.5 6.5 21 11 18.3 12 20 13 18.3 17.5 21 15 13.5Z"/>`
    ),
  },
  {
    key: '05_promotions_and_appointments',
    label: 'Promotions &amp; Appointments',
    spine: '#4d3a1d',
    icon: fill(
      '0 0 24 24',
      `<path d="M12 2l2.6 6.6 7.1.4-5.5 4.5 1.9 6.9L12 16.9 5.9 20.4l1.9-6.9L2.3 9l7.1-.4Z"/>`
    ),
  },
  {
    key: '06_procurement_and_trade',
    label: 'Procurement &amp; Trade',
    spine: '#3f2a3a',
    icon: mixed(
      '0 0 24 24',
      `<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2.1"/>
       <circle cx="12" cy="12" r="2.6" fill="currentColor"/>`
    ),
  },
  {
    key: '07_mining_and_supply',
    label: 'Mining &amp; Supply',
    spine: '#33322a',
    icon: mixed(
      '0 0 24 24',
      `<path d="M5 20 12 8" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/>
       <path d="M6 9 12 4 18 9" stroke="currentColor" stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    ),
  },
  {
    key: '08_training',
    label: 'Training',
    spine: '#2f3d2f',
    icon: mixed(
      '0 0 24 24',
      `<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/>
       <circle cx="12" cy="12" r="4.8" stroke="currentColor" stroke-width="1.8"/>
       <circle cx="12" cy="12" r="1.4" fill="currentColor"/>`
    ),
  },
  {
    key: '09_personnel_files',
    label: 'Personnel Files',
    spine: '#463228',
    icon: fill(
      '0 0 24 24',
      `<circle cx="12" cy="6.5" r="3.3"/>
       <path d="M5 20c0-4.5 3.1-7.5 7-7.5s7 3 7 7.5Z"/>`
    ),
  },
  {
    key: '10_meeting_minutes',
    label: 'Meeting Minutes',
    spine: '#2e3a3a',
    icon: fill(
      '0 0 24 24',
      `<circle cx="12" cy="12" r="4.2"/>
       <circle cx="12" cy="3.6" r="1.7"/>
       <circle cx="12" cy="20.4" r="1.7"/>
       <circle cx="3.6" cy="12" r="1.7"/>
       <circle cx="20.4" cy="12" r="1.7"/>`
    ),
  },
  {
    key: '11_ledger_audits',
    label: 'Ledger Audits',
    spine: '#39301c',
    icon: fill('0 0 24 24', `<path d="M5 2h9l5 5v15H5Z"/>`),
  },
  {
    key: 'appendix',
    label: 'Appendix',
    spine: '#302a2a',
    icon: fill('0 0 24 24', `<path d="M6 2h12v20l-6-4-6 4Z"/>`),
  },
];

export const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.key, c]));
