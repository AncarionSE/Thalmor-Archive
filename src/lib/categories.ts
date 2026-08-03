export interface Category {
  key: string; // matches the report.id folder segment (lowercased by Astro)
  label: string;
  spine: string; // leather tone for the shelf card
  icon: string; // inline SVG markup, stroke-based, currentColor
}

const icon = (paths: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

export const CATEGORIES: Category[] = [
  {
    key: '01_intelligence',
    label: 'Intelligence Reports',
    spine: '#5b2a2a',
    icon: icon('<path d="M2 12c2.8-4.5 6.4-6.8 10-6.8s7.2 2.3 10 6.8c-2.8 4.5-6.4 6.8-10 6.8S4.8 16.5 2 12Z"/><circle cx="12" cy="12" r="3"/>'),
  },
  {
    key: '02_incident_reports',
    label: 'Patrol &amp; Incident Reports',
    spine: '#4a3420',
    icon: icon('<path d="M6 3l6 6-9 9-3-3 9-9Z"/><path d="M18 21l-6-6 9-9 3 3-9 9Z"/>'),
  },
  {
    key: '03_diplomatic_correspondence',
    label: 'Diplomatic Correspondence',
    spine: '#2c3d4a',
    icon: icon('<path d="M4 20 19 5"/><path d="M19 5 15 4l1 4Z"/><path d="M9 15l-2 5 5-2"/>'),
  },
  {
    key: '04_administrative_orders',
    label: 'Administrative Orders',
    spine: '#3a2e17',
    icon: icon('<circle cx="12" cy="9" r="5"/><path d="M9 13.5 7 21l5-3 5 3-2-7.5"/>'),
  },
  {
    key: '05_promotions_and_appointments',
    label: 'Promotions &amp; Appointments',
    spine: '#4d3a1d',
    icon: icon('<path d="M12 2 14.5 8.5 21 9l-5 4.3 1.7 7.2L12 16.8l-5.7 3.7L8 13.3 3 9l6.5-.5Z"/>'),
  },
  {
    key: '06_procurement_and_trade',
    label: 'Procurement &amp; Trade',
    spine: '#3f2a3a',
    icon: icon('<circle cx="9" cy="9" r="6"/><circle cx="15" cy="15" r="6"/>'),
  },
  {
    key: '07_mining_and_supply',
    label: 'Mining &amp; Supply',
    spine: '#33322a',
    icon: icon('<path d="M4 15 15 4a4 4 0 0 1 5 5L9 20Z"/><path d="M4 15l2 5 5-2"/>'),
  },
  {
    key: '08_training',
    label: 'Training',
    spine: '#2f3d2f',
    icon: icon('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".6" fill="currentColor"/>'),
  },
  {
    key: '09_personnel_files',
    label: 'Personnel Files',
    spine: '#463228',
    icon: icon('<circle cx="12" cy="8" r="3.4"/><path d="M5 20c1.4-4 4-6 7-6s5.6 2 7 6"/>'),
  },
  {
    key: '10_meeting_minutes',
    label: 'Meeting Minutes',
    spine: '#2e3a3a',
    icon: icon('<circle cx="12" cy="12" r="7"/><path d="M12 5v7l5 3"/>'),
  },
  {
    key: '11_ledger_audits',
    label: 'Ledger Audits',
    spine: '#39301c',
    icon: icon('<path d="M5 3h14v18H5z"/><path d="M8 8h8M8 12h8M8 16h4"/>'),
  },
  {
    key: 'appendix',
    label: 'Appendix',
    spine: '#302a2a',
    icon: icon('<path d="M6 2h9l3 3v17H6z"/><path d="M15 2v3h3"/><path d="M9 14l2 2 4-4"/>'),
  },
];

export const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.key, c]));
