// Original hand-drawn Thalmor eagle mark — no game assets. A gold/bronze
// metallic medallion look built from SVG gradients, not traced artwork.
export function insignia(idSuffix: string) {
  const g = `eagleGrad-${idSuffix}`;
  const rw = `rwing-${idSuffix}`;
  return `<svg class="insignia" viewBox="0 0 200 150" aria-hidden="true">
    <defs>
      <linearGradient id="${g}" x1="15%" y1="0%" x2="85%" y2="100%">
        <stop offset="0%" stop-color="#f6e6ac"/>
        <stop offset="30%" stop-color="#d8b355"/>
        <stop offset="60%" stop-color="#9c7422"/>
        <stop offset="100%" stop-color="#4f3a12"/>
      </linearGradient>
    </defs>
    <g fill="url(#${g})">
      <circle cx="100" cy="15" r="8"/>
      <path d="M92,12 L78,16 L92,20 Z"/>
      <path d="M100,22 C130,22 138,45 132,75 C128,100 115,115 100,120 C85,115 72,100 68,75 C62,45 70,22 100,22 Z"/>
      <path d="M88,115 L82,138 L96,124 L100,142 L104,124 L118,138 L112,115 Z"/>
      <path id="${rw}" d="M141,39.3 L189.3,9.8 L161,36.5 L199.6,31.9 L163.8,46.1 L198,50 L163.6,55 L191,69.2 L144.1,57 Z"/>
      <use href="#${rw}" transform="translate(200,0) scale(-1,1)"/>
    </g>
  </svg>`;
}
