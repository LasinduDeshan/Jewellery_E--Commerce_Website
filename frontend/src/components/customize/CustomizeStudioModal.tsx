import React, { useState, useEffect, useRef, useId } from 'react';
import { X, Check, AlertCircle, ArrowLeft, ArrowRight, Loader2, Upload, Trash2, Info } from 'lucide-react';

export interface SubmissionSuccessData {
  ticketId: string;
  customerName: string;
  email: string;
  jewellerySummary: {
    type: string;
    metal: string;
    sapphire: string;
    cut: string;
  };
}

export interface CustomizeStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: SubmissionSuccessData) => void;
  initialJewelleryType?: string;
  initialMetal?: string;
  initialSapphire?: string;
  initialCut?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// --- CONFIG & DATA ---
interface JewelleryItem {
  id: string;
  name: string;
  desc: string;
  sizeType: 'ring' | 'chain' | 'bracelet' | 'none';
}

interface MetalItem {
  id: string;
  name: string;
  desc: string;
  l: string;
  m: string;
  d: string;
}

interface SapphireItem {
  id: string;
  name: string;
  desc: string;
  star?: boolean;
  c: {
    l: string;
    m: string;
    d: string;
    glow: string;
  };
}

interface CutItem {
  id: string;
  name: string;
  desc: string;
}

const JEWELLERY: JewelleryItem[] = [
  { id: 'ring', name: 'Ring', desc: 'Engagement, statement or everyday.', sizeType: 'ring' },
  { id: 'necklace', name: 'Necklace', desc: 'A pendant that rests close to the heart.', sizeType: 'chain' },
  { id: 'earrings', name: 'Earrings', desc: 'Studs or drops, made as a matched pair.', sizeType: 'none' },
  { id: 'bracelet', name: 'Bracelet', desc: 'A fine line of colour at the wrist.', sizeType: 'bracelet' },
];

const METALS: MetalItem[] = [
  { id: 'silver', name: 'Silver', desc: 'Bright, cool and timeless. It lets blue and white sapphires glow.', l: '#F7F9FC', m: '#C5CCD8', d: '#7D8798' },
  { id: 'rose-gold', name: 'Rose Gold', desc: 'A warm blush tone that flatters every sapphire colour.', l: '#FFE3D6', m: '#E5A68D', d: '#A9634F' },
];

const SAPPHIRES: SapphireItem[] = [
  { id: 'blue', name: 'Blue Sapphire', desc: 'The classic. Deep, velvety blue prized for centuries.', c: { l: '#7AA5FF', m: '#2457D6', d: '#0C1F6B', glow: '#4B7BFF' } },
  { id: 'pink', name: 'Pink Sapphire', desc: 'Soft rose to vivid magenta, with a lively sparkle.', c: { l: '#FFC1DA', m: '#E0568F', d: '#8F1F55', glow: '#FF7AAF' } },
  { id: 'yellow', name: 'Yellow Sapphire', desc: 'Sunlit golden tones, bright and cheerful.', c: { l: '#FFF0A0', m: '#F0BE1C', d: '#A96D00', glow: '#FFD44F' } },
  { id: 'padparadscha', name: 'Padparadscha Sapphire', desc: 'A rare blend of pink and orange, like a Ceylon sunset.', c: { l: '#FFC9AB', m: '#F58F6E', d: '#CF4D6C', glow: '#FFB08A' } },
  { id: 'white', name: 'White Sapphire', desc: 'Colourless and luminous, a refined alternative to diamond.', c: { l: '#FFFFFF', m: '#DCE6F4', d: '#8FA2BD', glow: '#E8F0FF' } },
  { id: 'star', name: 'Star Sapphire', desc: 'A polished dome that reveals a six-rayed star in the light.', star: true, c: { l: '#9BB8FF', m: '#3558C8', d: '#101F66', glow: '#5E86FF' } },
];

const CUTS: CutItem[] = [
  { id: 'round', name: 'Round', desc: 'Maximum brilliance in a classic outline.' },
  { id: 'oval', name: 'Oval', desc: 'Elongated and elegant.' },
  { id: 'cushion', name: 'Cushion', desc: 'Soft square with vintage romance.' },
  { id: 'emerald', name: 'Emerald', desc: 'Step facets, sophisticated depth.' },
  { id: 'pear', name: 'Pear', desc: 'A graceful teardrop.' },
  { id: 'princess', name: 'Princess', desc: 'Sharp-cornered, modern and brilliant.' },
  { id: 'marquise', name: 'Marquise', desc: 'Boat-shaped, dramatic length.' },
  { id: 'heart', name: 'Heart', desc: 'Romantic and symbolic.' },
];

const SIZES = {
  ring: {
    label: 'Ring size (US)',
    options: Array.from({ length: 19 }, (_, i) => {
      const v = 4 + i * 0.5;
      return { id: String(v), label: 'US ' + v, note: '' };
    }),
  },
  chain: {
    label: 'Chain length',
    options: [
      { id: '14', label: '14"', note: 'Choker' },
      { id: '16', label: '16"', note: 'Choker' },
      { id: '18', label: '18"', note: 'Princess' },
      { id: '20', label: '20"', note: 'Matinee' },
      { id: '22', label: '22"', note: 'Matinee' },
      { id: '24', label: '24"', note: 'Matinee' },
    ],
  },
  bracelet: {
    label: 'Bracelet length',
    options: [
      { id: '6', label: '6"', note: '15.2 cm' },
      { id: '6.5', label: '6.5"', note: '16.5 cm' },
      { id: '7', label: '7"', note: '17.8 cm' },
      { id: '7.5', label: '7.5"', note: '19.1 cm' },
      { id: '8', label: '8"', note: '20.3 cm' },
      { id: '8.5', label: '8.5"', note: '21.6 cm' },
    ],
  },
};

const EARRING_STYLES = [
  { id: 'studs', label: 'Studs' },
  { id: 'drops', label: 'Drops' },
  { id: 'hoops', label: 'Hoops' },
];

const OCCASIONS = ['Birthday', 'Engagement', 'Anniversary', 'Gift', 'Self-Purchase', 'Other'];

const BUDGETS = [
  { id: 'u500', label: 'Under $500' },
  { id: '500-1000', label: '$500 – $1,000' },
  { id: '1000-2500', label: '$1,000 – $2,500' },
  { id: '2500-5000', label: '$2,500 – $5,000' },
  { id: '5000-10000', label: '$5,000 – $10,000' },
  { id: '10000+', label: '$10,000 and above' },
  { id: 'discuss', label: 'I would like to discuss' },
];

const CONTACT_METHODS = [
  { id: 'email', label: 'Email' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'phone', label: 'Phone' },
];

const COUNTRIES = [
  'Australia', 'Austria', 'Bahrain', 'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'China', 'Denmark',
  'Egypt', 'Finland', 'France', 'Germany', 'Greece', 'Hong Kong', 'India', 'Indonesia', 'Ireland',
  'Israel', 'Italy', 'Japan', 'Jordan', 'Kuwait', 'Malaysia', 'Maldives', 'Mexico', 'Netherlands',
  'New Zealand', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Philippines', 'Poland', 'Portugal', 'Qatar',
  'Saudi Arabia', 'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden',
  'Switzerland', 'Taiwan', 'Thailand', 'Turkey', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Vietnam', 'Other',
];

const SIZE_GUIDE_RING = [
  ['4', '14.9', '46.8'],
  ['5', '15.7', '49.3'],
  ['6', '16.5', '51.9'],
  ['7', '17.3', '54.4'],
  ['8', '18.2', '57.0'],
  ['9', '18.9', '59.5'],
  ['10', '19.8', '62.1'],
  ['11', '20.6', '64.6'],
  ['12', '21.4', '67.2'],
  ['13', '22.2', '69.7'],
];

const CHAIN_GUIDE = [
  ['14"', 'Choker', 'Sits snugly at the neck'],
  ['16"', 'Choker', 'Rests at the base of the neck'],
  ['18"', 'Princess', 'Falls at the collarbone'],
  ['20"', 'Matinee', 'Just below the collarbone'],
  ['22"', 'Matinee', 'Upper chest'],
  ['24"', 'Matinee', 'Mid chest'],
];

// --- 3D SVG GEMSTONE & JEWELLERY RENDERERS ---
const ring2 = (n: number, f: (t: number) => [number, number]) =>
  Array.from({ length: n }, (_, i) => f((i / n) * Math.PI * 2));

const SHAPES: Record<string, () => [number, number][]> = {
  round: () => ring2(32, (t) => [Math.cos(t), Math.sin(t)]),
  oval: () => ring2(32, (t) => [0.72 * Math.cos(t), Math.sin(t)]),
  cushion: () =>
    ring2(32, (t) => {
      const c = Math.cos(t),
        s = Math.sin(t),
        n = 3.4,
        r = Math.pow(Math.pow(Math.abs(c), n) + Math.pow(Math.abs(s), n), -1 / n);
      return [r * c, r * s];
    }),
  emerald: () => [
    [-0.5, -1],
    [0.5, -1],
    [0.8, -0.7],
    [0.8, 0.7],
    [0.5, 1],
    [-0.5, 1],
    [-0.8, 0.7],
    [-0.8, -0.7],
  ],
  pear: () => ring2(36, (t) => [Math.sin(t) * Math.pow(Math.sin(t / 2), 1.4), -Math.cos(t)]),
  princess: () => [
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
  ],
  marquise: () => {
    const a: [number, number][] = [],
      n = 12;
    for (let i = 0; i <= n; i++) {
      const y = -1 + (2 * i) / n;
      a.push([0.56 * (1 - y * y), y]);
    }
    for (let i = n - 1; i >= 1; i--) {
      const y = -1 + (2 * i) / n;
      a.push([-0.56 * (1 - y * y), y]);
    }
    return a;
  },
  heart: () =>
    ring2(36, (t) => [
      16 * Math.pow(Math.sin(t), 3),
      -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
    ]),
};

function normalize(p: [number, number][]): [number, number][] {
  let a = 1e9,
    b = -1e9,
    c = 1e9,
    d = -1e9;
  p.forEach(([x, y]) => {
    a = Math.min(a, x);
    b = Math.max(b, x);
    c = Math.min(c, y);
    d = Math.max(d, y);
  });
  const cx = (a + b) / 2,
    cy = (c + d) / 2,
    s = Math.max(b - a, d - c) / 2;
  return p.map(([x, y]) => [(x - cx) / s, (y - cy) / s]);
}

const pt = (p: [number, number]) => p.map((n) => n.toFixed(1)).join(',');

let uidCounter = 0;
function getUniqueId() {
  return 'gem_' + ++uidCounter;
}

function renderGemInner(cutId: string, sap: SapphireItem) {
  const id = getUniqueId();
  const c = sap.c;
  const pts = normalize((SHAPES[cutId] || SHAPES.round)());
  const R = 42;
  const P: [number, number][] = pts.map(([x, y]) => [50 + x * R, 50 + y * R]);
  const T: [number, number][] = pts.map(([x, y]) => [50 + x * R * 0.48, 50 + y * R * 0.48]);
  const n = P.length;
  const glow = c.glow || c.m;

  if (sap.star) {
    return (
      <>
        <defs>
          <radialGradient id={`r${id}`} cx=".36" cy=".3" r=".82">
            <stop offset="0" stopColor={c.l} />
            <stop offset=".35" stopColor={c.m} />
            <stop offset=".7" stopColor={c.d} />
            <stop offset="1" stopColor={c.d} />
          </radialGradient>
          <radialGradient id={`gw${id}`} cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor={glow} stopOpacity=".35" />
            <stop offset="1" stopColor={glow} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`k${id}`}>
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id={`mk${id}`}>
            <rect width="100" height="100" fill={`url(#k${id})`} />
          </mask>
          <filter id={`bl${id}`}>
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>
        <circle cx="50" cy="50" r="44" fill={`url(#gw${id})`} />
        <polygon points={P.map(pt).join(' ')} fill={`url(#r${id})`} stroke={c.d} strokeWidth="1" strokeLinejoin="round" />
        <polygon points={P.map(pt).join(' ')} fill={`url(#r${id})`} opacity=".3" filter={`url(#bl${id})`} />
        <g mask={`url(#mk${id})`} stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity=".85" filter={`url(#bl${id})`}>
          <line x1="10" y1="50" x2="90" y2="50" />
          <line x1="10" y1="50" x2="90" y2="50" transform="rotate(60 50 50)" />
          <line x1="10" y1="50" x2="90" y2="50" transform="rotate(120 50 50)" />
        </g>
        <g mask={`url(#mk${id})`} stroke="#fff" strokeWidth=".7" strokeLinecap="round" opacity=".5">
          <line x1="10" y1="50" x2="90" y2="50" />
          <line x1="10" y1="50" x2="90" y2="50" transform="rotate(60 50 50)" />
          <line x1="10" y1="50" x2="90" y2="50" transform="rotate(120 50 50)" />
        </g>
        <ellipse cx="36" cy="32" rx="10" ry="4.5" fill="#fff" opacity=".5" transform="rotate(-32 36 32)" />
        <ellipse cx="60" cy="62" rx="5" ry="2" fill="#fff" opacity=".2" transform="rotate(20 60 62)" />
      </>
    );
  }

  const facets: React.ReactNode[] = [];
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const mx = (P[i][0] + P[j][0]) / 2 - 50,
      my = (P[i][1] + P[j][1]) / 2 - 50;
    const angle = Math.atan2(my, mx);
    const k = Math.cos(angle + 2.36);
    const k2 = Math.cos(angle + 1.2);
    const lightFactor = Math.max(0, k) * 0.5 + Math.max(0, k2) * 0.15;
    const darkFactor = Math.max(0, -k) * 0.4;
    let fill =
      lightFactor > darkFactor
        ? `rgba(255,255,255,${Math.min(0.65, lightFactor).toFixed(3)})`
        : `rgba(0,10,40,${Math.min(0.55, darkFactor).toFixed(3)})`;
    facets.push(
      <polygon
        key={`f-${i}`}
        points={`${pt(P[i])} ${pt(P[j])} ${pt(T[j])} ${pt(T[i])}`}
        fill={fill}
      />
    );
    lines.push(
      <line
        key={`l-${i}`}
        x1={P[i][0].toFixed(1)}
        y1={P[i][1].toFixed(1)}
        x2={T[i][0].toFixed(1)}
        y2={T[i][1].toFixed(1)}
      />
    );
  }

  const tableFacets: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const cx2 = 50,
      cy2 = 50;
    const k = Math.cos(Math.atan2(T[i][1] - 50, T[i][0] - 50) + 2.8);
    const a = k > 0 ? Math.min(0.35, k * 0.3) : 0;
    tableFacets.push(
      <polygon
        key={`tf-${i}`}
        points={`${pt(T[i])} ${pt(T[j])} ${cx2},${cy2}`}
        fill={`rgba(255,255,255,${a.toFixed(3)})`}
      />
    );
  }

  return (
    <>
      <defs>
        <linearGradient id={`g${id}`} x1=".15" y1="0" x2=".85" y2="1">
          <stop offset="0" stopColor={c.l} />
          <stop offset=".4" stopColor={c.m} />
          <stop offset=".85" stopColor={c.d} />
          <stop offset="1" stopColor={c.d} />
        </linearGradient>
        <radialGradient id={`t${id}`} cx=".38" cy=".33" r=".75">
          <stop offset="0" stopColor="#fff" stopOpacity=".6" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".15" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`gw${id}`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor={glow} stopOpacity=".25" />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <filter id={`sh${id}`}>
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor={c.d} floodOpacity=".3" />
        </filter>
        <filter id={`hl${id}`}>
          <feGaussianBlur stdDeviation=".8" />
        </filter>
      </defs>
      <circle cx="50" cy="52" r="42" fill={`url(#gw${id})`} />
      <g filter={`url(#sh${id})`}>
        <polygon points={P.map(pt).join(' ')} fill={`url(#g${id})`} />
        {facets}
        <polygon points={T.map(pt).join(' ')} fill={`url(#t${id})`} />
        {tableFacets}
        <g stroke="#fff" strokeOpacity=".2" strokeWidth=".35">
          {lines}
        </g>
        <polygon points={T.map(pt).join(' ')} fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth=".4" />
        <polygon points={P.map(pt).join(' ')} fill="none" stroke={c.d} strokeOpacity=".5" strokeWidth=".7" strokeLinejoin="round" />
      </g>
      <ellipse cx="38" cy="35" rx="7" ry="3" fill="#fff" opacity=".6" transform="rotate(-32 38 35)" filter={`url(#hl${id})`} />
      <ellipse cx="38" cy="35" rx="5" ry="2" fill="#fff" opacity=".7" transform="rotate(-32 38 35)" />
      <ellipse cx="58" cy="60" rx="3.5" ry="1.5" fill="#fff" opacity=".25" transform="rotate(15 58 60)" />
      <circle cx="34" cy="30" r="1.2" fill="#fff" opacity=".8" />
      <circle cx="62" cy="38" r=".8" fill="#fff" opacity=".5" />
    </>
  );
}

function GemSvg({ cut, sap }: { cut: string; sap: SapphireItem }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className="w-full h-full">
      {renderGemInner(cut, sap)}
    </svg>
  );
}

function JewelSvg({
  type,
  metal,
  sap,
  cut,
}: {
  type: string;
  metal: MetalItem;
  sap: SapphireItem;
  cut: string;
}) {
  const id = getUniqueId();
  const defs = (
    <defs>
      <linearGradient id={`m${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={metal.l} />
        <stop offset=".45" stopColor={metal.m} />
        <stop offset="1" stopColor={metal.d} />
      </linearGradient>
      <linearGradient id={`mh${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={metal.l} stopOpacity=".6" />
        <stop offset="1" stopColor={metal.m} stopOpacity="0" />
      </linearGradient>
      <filter id={`ms${id}`}>
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,.15)" />
      </filter>
    </defs>
  );
  const g = `url(#m${id})`;
  const gh = `url(#mh${id})`;

  const renderAt = (cx: number, cy: number, s: number) => (
    <svg x={cx - s / 2} y={cy - s / 2} width={s} height={s} viewBox="0 0 100 100" overflow="visible">
      {renderGemInner(cut, sap)}
    </svg>
  );

  return (
    <svg viewBox="0 0 240 240" aria-hidden="true" focusable="false" className="w-full h-full">
      {defs}
      {type === 'necklace' && (
        <>
          <g filter={`url(#ms${id})`}>
            <path d="M30 56Q120 210 210 56" fill="none" stroke={g} strokeWidth="3" strokeLinecap="round" />
            <path d="M30 56Q120 210 210 56" fill="none" stroke={gh} strokeWidth="5" strokeLinecap="round" opacity=".5" />
            <circle cx="120" cy="134" r="5.5" fill={g} stroke={metal.d} strokeWidth=".5" />
            <ellipse cx="120" cy="131" rx="3" ry="1.5" fill={metal.l} opacity=".4" />
          </g>
          {renderAt(120, 168, 60)}
        </>
      )}
      {type === 'earrings' && (
        <>
          <g filter={`url(#ms${id})`}>
            <path d="M76 60V106" stroke={g} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M76 60V106" stroke={gh} strokeWidth="4" opacity=".4" />
            <path d="M164 60V106" stroke={g} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M164 60V106" stroke={gh} strokeWidth="4" opacity=".4" />
          </g>
          {renderAt(76, 46, 28)}
          {renderAt(76, 132, 52)}
          {renderAt(164, 46, 28)}
          {renderAt(164, 132, 52)}
        </>
      )}
      {type === 'bracelet' && (
        <>
          <g filter={`url(#ms${id})`}>
            <ellipse cx="120" cy="126" rx="90" ry="48" fill="none" stroke={g} strokeWidth="8" />
            <ellipse cx="120" cy="126" rx="90" ry="48" fill="none" stroke={gh} strokeWidth="12" opacity=".3" />
            <ellipse cx="120" cy="122" rx="90" ry="48" fill="none" stroke={metal.l} strokeOpacity=".2" strokeWidth="1" />
          </g>
          {renderAt(42, 152, 18)}
          {renderAt(198, 152, 18)}
          {renderAt(76, 170, 24)}
          {renderAt(164, 170, 24)}
          {renderAt(120, 176, 38)}
        </>
      )}
      {type !== 'necklace' && type !== 'earrings' && type !== 'bracelet' && (
        <>
          <g filter={`url(#ms${id})`}>
            <circle cx="120" cy="158" r="56" fill="none" stroke={g} strokeWidth="9" />
            <circle cx="120" cy="158" r="56" fill="none" stroke={gh} strokeWidth="14" opacity=".3" />
            <circle cx="120" cy="158" r="52" fill="none" stroke={metal.l} strokeOpacity=".15" strokeWidth=".8" />
            <path d="M103 108h34l-7-14h-20z" fill={g} stroke={metal.d} strokeWidth=".5" />
            <path d="M103 108h34" fill="none" stroke={metal.l} strokeOpacity=".3" strokeWidth=".5" />
          </g>
          {renderAt(120, 70, 56)}
          <circle cx="94" cy="76" r="3" fill={g} stroke={metal.d} strokeWidth=".3" />
          <circle cx="146" cy="76" r="3" fill={g} stroke={metal.d} strokeWidth=".3" />
          <ellipse cx="94" cy="75" rx="1.5" ry=".8" fill={metal.l} opacity=".4" />
          <ellipse cx="146" cy="75" rx="1.5" ry=".8" fill={metal.l} opacity=".4" />
        </>
      )}
    </svg>
  );
}

// Helper to convert File to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const CustomizeStudioModal: React.FC<CustomizeStudioModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialJewelleryType,
  initialMetal,
  initialSapphire,
  initialCut,
}) => {
  // Wizard State
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);

  // Form selections
  const [jewellery, setJewellery] = useState('ring');
  const [metal, setMetal] = useState('silver');
  const [sapphire, setSapphire] = useState('blue');
  const [cut, setCut] = useState('oval');
  const [size, setSize] = useState('');
  const [earringStyle, setEarringStyle] = useState('studs');

  // Preferences
  const [budget, setBudget] = useState('');
  const [occasion, setOccasion] = useState('');
  const [instructions, setInstructions] = useState('');
  const [engraving, setEngraving] = useState('');
  const [files, setFiles] = useState<{ id: string; file: File; url: string; base64: string }[]>([]);

  // Contact
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('United States');
  const [contactMethod, setContactMethod] = useState('email');
  const [consent, setConsent] = useState(false);

  // Submission & UI status
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeGuideTab, setSizeGuideTab] = useState<'ring' | 'chain' | 'bracelet'>('ring');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Map incoming props to defaults on open
  useEffect(() => {
    if (!isOpen) return;

    if (initialJewelleryType) {
      const lower = initialJewelleryType.toLowerCase();
      const match = JEWELLERY.find((j) => lower.includes(j.id) || lower.includes(j.name.toLowerCase()));
      if (match) setJewellery(match.id);
    }
    if (initialMetal) {
      const lower = initialMetal.toLowerCase();
      if (lower.includes('rose')) setMetal('rose-gold');
      else if (lower.includes('silver')) setMetal('silver');
    }
    if (initialSapphire) {
      const lower = initialSapphire.toLowerCase();
      const match = SAPPHIRES.find((s) => lower.includes(s.id) || lower.includes(s.name.toLowerCase()));
      if (match) setSapphire(match.id);
    }
    if (initialCut) {
      const lower = initialCut.toLowerCase();
      const match = CUTS.find((c) => lower.includes(c.id) || lower.includes(c.name.toLowerCase()));
      if (match) setCut(match.id);
    }
    setStep(0);
    setMaxReached(0);
    setErrors({});
    setSubmitError('');
  }, [isOpen, initialJewelleryType, initialMetal, initialSapphire, initialCut]);

  // Prevent background scroll & eliminate window scrollbar flash when studio is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Selected items
  const curJewel = JEWELLERY.find((j) => j.id === jewellery) || JEWELLERY[0];
  const curMetal = METALS.find((m) => m.id === metal) || METALS[0];
  const curSap = SAPPHIRES.find((s) => s.id === sapphire) || SAPPHIRES[0];
  const curCutItem = CUTS.find((c) => c.id === cut) || CUTS[0];

  const getSizeDisplay = () => {
    if (curJewel.sizeType === 'none') {
      const s = EARRING_STYLES.find((e) => e.id === earringStyle);
      return s ? s.label : 'Studs';
    }
    if (!size) return 'Not chosen yet';
    if (size === 'unsure') return 'Not sure, please advise';
    const opts = SIZES[curJewel.sizeType]?.options;
    const match = opts?.find((o) => o.id === size);
    return match ? `${match.label}${match.note ? ` · ${match.note}` : ''}` : size;
  };

  // Validations per step
  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 0 && !jewellery) errs.jewellery = 'Please choose a type of jewellery to continue.';
    if (s === 1 && !metal) errs.metal = 'Please select a metal to continue.';
    if (s === 2 && !sapphire) errs.sapphire = 'Please choose a sapphire to continue.';
    if (s === 3 && !cut) errs.cut = 'Please choose a gemstone cut to continue.';
    if (s === 4) {
      if (curJewel.sizeType !== 'none' && !size) {
        errs.size = 'Please select a size, or choose "Not sure".';
      }
    }
    if (s === 5) {
      if (engraving.length > 30) errs.engraving = 'Engraving can be up to 30 characters.';
      if (instructions.length > 1000) errs.instructions = 'Please keep instructions under 1,000 characters.';
    }
    if (s === 6) {
      if (fullName.trim().length < 2) errs.name = 'Please enter your full name.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) errs.email = 'Enter a valid email address.';
      const ph = phoneNumber.replace(/[\s\-().]/g, '');
      if (!/^\+?\d{7,15}$/.test(ph)) errs.phone = 'Enter a valid phone number with country code.';
      if (!country) errs.country = 'Please select your country.';
      if (!contactMethod) errs.contactMethod = 'Please choose a preferred contact method.';
    }
    if (s === 7 && !consent) {
      errs.consent = 'Please confirm the privacy statement.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    if (step < 7) {
      const nextStep = step + 1;
      setStep(nextStep);
      setMaxReached((prev) => Math.max(prev, nextStep));
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleJumpTo = (targetStep: number) => {
    if (targetStep <= maxReached) {
      setStep(targetStep);
    }
  };

  // File Upload Handlers
  const handleAddFiles = async (fileList: FileList | File[]) => {
    const list = Array.from(fileList);
    const newFiles: { id: string; file: File; url: string; base64: string }[] = [];
    const maxFiles = 4;
    const maxBytes = 5 * 1024 * 1024;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];

    let fileErr = '';
    for (const f of list) {
      if (files.length + newFiles.length >= maxFiles) {
        fileErr = `You can add up to ${maxFiles} images.`;
        break;
      }
      if (!allowed.includes(f.type)) {
        fileErr = `${f.name}: please use a JPG, PNG or WebP image.`;
        continue;
      }
      if (f.size > maxBytes) {
        fileErr = `${f.name} is larger than 5 MB.`;
        continue;
      }
      const base64 = await fileToBase64(f);
      newFiles.push({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        url: URL.createObjectURL(f),
        base64,
      });
    }

    if (fileErr) {
      setErrors((prev) => ({ ...prev, files: fileErr }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.files;
        return copy;
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Submit Final Custom Request
  const handleSubmit = async () => {
    if (submitting) return;
    if (!validateStep(7)) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const budgetObj = BUDGETS.find((b) => b.id === budget);
      const methodObj = CONTACT_METHODS.find((m) => m.id === contactMethod);

      const payload = {
        jewelleryType: jewellery,
        metalPreference: curMetal.name,
        sapphireColor: curSap.name,
        cutPreference: curCutItem.name,
        size: size || undefined,
        earringStyle: curJewel.sizeType === 'none' ? earringStyle : undefined,
        budget: budgetObj ? budgetObj.label : budget || undefined,
        occasion: occasion || undefined,
        specialInstructions: instructions.trim() || undefined,
        engraving: engraving.trim() || undefined,
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        country,
        preferredContactMethod: methodObj ? methodObj.label : contactMethod,
        referenceImages: files.map((f) => ({
          filename: f.file.name,
          contentType: f.file.type,
          data: f.base64.split(',')[1] || f.base64,
        })),
        jewellerySummary: {
          type: curJewel.name,
          metal: curMetal.name,
          sapphire: curSap.name,
          cut: curCutItem.name,
        },
      };

      const res = await fetch(`${API_URL}/custom-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Server error occurred. Please try again.');
      }

      const resData = await res.json();
      const ticketId = resData?.data?.ticketId || resData?.ticketId || 'CEY-' + Math.floor(100000 + Math.random() * 900000);

      onSuccess({
        ticketId,
        customerName: fullName,
        email,
        jewellerySummary: payload.jewellerySummary,
      });
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const STEP_TITLES = [
    { label: 'Jewellery', title: 'Choose your jewellery', help: 'Start with the kind of piece you would like us to create.' },
    { label: 'Metal', title: 'Select your metal', help: 'The metal sets the mood and tone of the piece.' },
    { label: 'Sapphire', title: 'Choose your sapphire', help: 'Select the sapphire colour that speaks to you.' },
    { label: 'Cut', title: 'Choose your gemstone cut', help: 'The cut decides how the stone catches and reflects light.' },
    { label: 'Size', title: 'Select your size', help: 'Not sure? Choose that option and our gemologists will guide you.' },
    { label: 'Preferences', title: 'Your personal preferences', help: 'Everything here is optional. The more you share, the closer our first proposal.' },
    { label: 'Contact', title: 'How can we reach you?', help: 'We will use these details to send your personalised quotation.' },
    { label: 'Review', title: 'Review your design', help: 'Check everything below. You can edit any section before submitting.' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Sapphire Design Studio"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Studio Modal Window */}
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-neutral-200 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full border border-neutral-200 bg-white/90 backdrop-blur text-neutral-500 hover:text-black hover:border-neutral-400 flex items-center justify-center transition-all cursor-pointer shadow-xs hover:scale-105"
          aria-label="Close studio"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT / CENTER: Interactive Step Wizard (Cols 7) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Stepper Header Progress */}
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-3 px-1">
                  <span className="font-medium text-neutral-900">
                    Step {step + 1} of {STEP_TITLES.length}
                  </span>
                  <span className="text-neutral-900 font-bold">{STEP_TITLES[step].label}</span>
                </div>

                {/* Stepper Dots & Connector */}
                <ol className="grid grid-cols-8 gap-1 relative items-center">
                  {STEP_TITLES.map((st, i) => {
                    const isDone = i < step;
                    const isCurrent = i === step;
                    return (
                      <li key={i} className="flex flex-col items-center gap-1 group relative">
                        <button
                          type="button"
                          onClick={() => handleJumpTo(i)}
                          disabled={i > maxReached}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-black text-white shadow-md ring-4 ring-neutral-200 scale-105'
                              : isDone
                              ? 'bg-black text-white cursor-pointer hover:bg-neutral-800'
                              : 'bg-white text-neutral-400 border border-neutral-200 cursor-not-allowed'
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : i + 1}
                        </button>
                        <span className="text-[10px] hidden md:block text-neutral-500 truncate max-w-[60px]">
                          {st.label}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Step Title & Subtitle */}
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">
                  {STEP_TITLES[step].title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">{STEP_TITLES[step].help}</p>
              </div>

              {/* Bespoke Studio Design Disclaimer Banner */}
              <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200/90 text-neutral-600 text-xs shadow-2xs">
                <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <span className="font-semibold text-neutral-900">Design Disclaimer:</span> These preview illustrations are conceptual references only and not the final pieces. This studio is designed solely to collect your bespoke specifications so our master gemologists can craft your own unique custom design.
                </p>
              </div>

              {/* STEP 0: JEWELLERY TYPE */}
              {step === 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {JEWELLERY.map((item) => {
                    const active = jewellery === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setJewellery(item.id);
                          setSize('');
                        }}
                        className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between group cursor-pointer relative ${
                          active
                            ? 'border-black bg-neutral-100/70 shadow-sm ring-2 ring-black'
                            : 'border-neutral-200 bg-neutral-50 hover:border-neutral-400 hover:bg-white'
                        }`}
                      >
                        <div className="aspect-square w-full rounded-xl bg-white border border-neutral-100 flex items-center justify-center p-2 mb-2.5 overflow-hidden">
                          <JewelSvg type={item.id} metal={curMetal} sap={curSap} cut={cut} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs sm:text-sm text-neutral-900 font-serif">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                        {active && (
                          <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 1: METAL PREFERENCE */}
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {METALS.map((item) => {
                    const active = metal === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMetal(item.id)}
                        className={`text-left p-5 rounded-2xl border transition-all flex items-center gap-4 group cursor-pointer relative ${
                          active
                            ? 'border-black bg-neutral-100/70 shadow-sm ring-2 ring-black'
                            : 'border-neutral-200 bg-neutral-50 hover:border-neutral-400 hover:bg-white'
                        }`}
                      >
                        <div
                          className="w-16 h-16 rounded-full shrink-0 shadow-inner border border-white/40"
                          style={{
                            background: `conic-gradient(from 30deg, ${item.l}, ${item.m}, ${item.d}, ${item.m}, ${item.l}, ${item.m}, ${item.d}, ${item.l})`,
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm sm:text-base text-neutral-900 font-serif">
                            {item.name}
                          </h4>
                          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                        {active && (
                          <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] shrink-0">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 2: SAPPHIRE VARIETY */}
              {step === 2 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {SAPPHIRES.map((item) => {
                    const active = sapphire === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSapphire(item.id)}
                        className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between group cursor-pointer relative ${
                          active
                            ? 'border-black bg-neutral-100/70 shadow-sm ring-2 ring-black'
                            : 'border-neutral-200 bg-neutral-50 hover:border-neutral-400 hover:bg-white'
                        }`}
                      >
                        <div className="aspect-square w-full rounded-xl bg-white border border-neutral-100 flex items-center justify-center p-2 mb-2.5">
                          <GemSvg cut="oval" sap={item} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs sm:text-sm text-neutral-900 font-serif">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                        {active && (
                          <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 3: GEMSTONE CUT */}
              {step === 3 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {CUTS.map((item) => {
                    const active = cut === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCut(item.id)}
                        className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between group cursor-pointer relative ${
                          active
                            ? 'border-black bg-neutral-100/70 shadow-sm ring-2 ring-black'
                            : 'border-neutral-200 bg-neutral-50 hover:border-neutral-400 hover:bg-white'
                        }`}
                      >
                        <div className="aspect-square w-full rounded-xl bg-white border border-neutral-100 flex items-center justify-center p-2 mb-2.5">
                          <GemSvg cut={item.id} sap={curSap} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs sm:text-sm text-neutral-900 font-serif">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                        {active && (
                          <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 4: SIZING & STYLE */}
              {step === 4 && (
                <div className="space-y-4">
                  {curJewel.sizeType === 'none' ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs flex items-center gap-2.5">
                        <span className="text-base">✦</span>
                        <p>Earrings are created as a perfectly matched bespoke pair and require no sizing.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-2">
                          Select Earring Style (Optional)
                        </label>
                        <div className="flex flex-wrap gap-2.5">
                          {EARRING_STYLES.map((es) => (
                            <button
                              key={es.id}
                              type="button"
                              onClick={() => setEarringStyle(es.id)}
                              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                                earringStyle === es.id
                                  ? 'bg-black text-white border-black shadow-xs'
                                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                              }`}
                            >
                              {es.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-neutral-700">
                          {SIZES[curJewel.sizeType].label}
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setSizeGuideTab(curJewel.sizeType as any);
                            setSizeGuideOpen(true);
                          }}
                          className="text-xs font-bold text-neutral-900 hover:underline cursor-pointer"
                        >
                          View Sizing Guide
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {SIZES[curJewel.sizeType].options.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSize(opt.id)}
                            className={`px-3.5 py-2 rounded-xl text-xs border transition-all flex flex-col items-center justify-center cursor-pointer min-w-[58px] ${
                              size === opt.id
                                ? 'bg-black text-white border-black font-bold shadow-xs'
                                : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-400 hover:bg-white'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {opt.note && <span className="text-[10px] opacity-75">{opt.note}</span>}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setSize('unsure')}
                          className={`px-4 py-2 rounded-xl text-xs border transition-all cursor-pointer ${
                            size === 'unsure'
                              ? 'bg-black text-white border-black font-bold'
                              : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:bg-white'
                          }`}
                        >
                          Not sure (Advise me)
                        </button>
                      </div>
                    </div>
                  )}
                  {errors.size && <p className="text-xs text-red-600 font-medium">{errors.size}</p>}
                </div>
              )}

              {/* STEP 5: PREFERENCES & REFERENCE IMAGES */}
              {step === 5 && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Budget Range (Optional)
                      </label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs bg-white"
                      >
                        <option value="">Prefer not to say</option>
                        {BUDGETS.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Occasion (Optional)
                      </label>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {OCCASIONS.map((occ) => (
                          <button
                            key={occ}
                            type="button"
                            onClick={() => setOccasion(occasion === occ ? '' : occ)}
                            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
                              occasion === occ
                                ? 'bg-black text-white border-black'
                                : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400'
                            }`}
                          >
                            {occ}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-neutral-700 font-semibold">Special Instructions (Optional)</label>
                      <span className="text-[10px] text-neutral-400">{instructions.length}/1000</span>
                    </div>
                    <textarea
                      maxLength={1000}
                      rows={3}
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Describe your aesthetic vision, claw/prong preference, halo details, or family sentimental notes..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      Engraving Text (Optional, up to 30 characters)
                    </label>
                    <input
                      type="text"
                      maxLength={30}
                      value={engraving}
                      onChange={(e) => setEngraving(e.target.value)}
                      placeholder="e.g. Forever & Always • 24.11.2025"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs"
                    />
                  </div>

                  {/* Drag and Drop Image Upload */}
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      Reference Images (Optional, up to 4 images)
                    </label>
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files) handleAddFiles(e.dataTransfer.files);
                      }}
                      className="border-2 border-dashed border-neutral-300 rounded-2xl p-5 text-center bg-neutral-50 hover:bg-neutral-100/70 transition-colors"
                    >
                      <Upload className="w-6 h-6 mx-auto text-neutral-400 mb-1" />
                      <p className="text-neutral-500 mb-2">
                        Drag & drop sketches or inspiration photos here (JPG, PNG, WebP up to 5MB each)
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-1.5 rounded-lg border border-neutral-300 bg-white font-semibold text-neutral-800 hover:border-black cursor-pointer shadow-2xs"
                      >
                        Choose Images
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) handleAddFiles(e.target.files);
                          e.target.value = '';
                        }}
                      />
                    </div>

                    {errors.files && <p className="text-xs text-red-600 font-medium mt-1">{errors.files}</p>}

                    {files.length > 0 && (
                      <div className="grid grid-cols-4 gap-3 mt-3">
                        {files.map((f) => (
                          <div key={f.id} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200 group">
                            <img src={f.url} alt="Reference thumbnail" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(f.id)}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                              title="Remove image"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 6: CONTACT INFORMATION */}
              {step === 6 && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs"
                      />
                      {errors.name && <p className="text-[11px] text-red-600 mt-0.5">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. eleanor@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs"
                      />
                      {errors.email && <p className="text-[11px] text-red-600 mt-0.5">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">Phone / WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. +1 555 234 5678"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs"
                      />
                      {errors.phone && <p className="text-[11px] text-red-600 mt-0.5">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">Country / Region *</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs bg-white"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      {errors.country && <p className="text-[11px] text-red-600 mt-0.5">{errors.country}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Preferred Contact Method</label>
                    <div className="flex gap-2.5">
                      {CONTACT_METHODS.map((cm) => (
                        <button
                          key={cm.id}
                          type="button"
                          onClick={() => setContactMethod(cm.id)}
                          className={`px-4 py-2 rounded-xl border font-semibold transition-all cursor-pointer ${
                            contactMethod === cm.id
                              ? 'bg-black text-white border-black shadow-xs'
                              : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400'
                          }`}
                        >
                          {cm.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: REVIEW & CONSENT */}
              {step === 7 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-800 leading-relaxed flex items-start gap-2.5">
                    <span className="text-base leading-none">✦</span>
                    <p>
                      There is no cart and no upfront charge. Our Colombo gemological team will inspect your requirements, source ethically certified Ceylon corundum, and email or WhatsApp you a formal complimentary atelier proposal.
                    </p>
                  </div>

                  {/* Summary Sections with Quick Edit links */}
                  <div className="border border-neutral-200 rounded-2xl divide-y divide-neutral-200 overflow-hidden bg-neutral-50/50">
                    {/* Piece specs */}
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-neutral-900 font-serif">Your Bespoke Piece</span>
                        <button
                          type="button"
                          onClick={() => handleJumpTo(0)}
                          className="font-bold text-neutral-900 hover:underline cursor-pointer"
                        >
                          Edit Piece
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-neutral-600">
                        <div>Piece: <strong className="text-neutral-900">{curJewel.name}</strong></div>
                        <div>Precious Metal: <strong className="text-neutral-900">{curMetal.name}</strong></div>
                        <div>Sapphire: <strong className="text-neutral-900">{curSap.name}</strong></div>
                        <div>Faceted Cut: <strong className="text-neutral-900">{curCutItem.name}</strong></div>
                        <div>Size / Style: <strong className="text-neutral-900">{getSizeDisplay()}</strong></div>
                      </div>
                    </div>

                    {/* Preferences specs */}
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-neutral-900 font-serif">Preferences & Details</span>
                        <button
                          type="button"
                          onClick={() => handleJumpTo(5)}
                          className="font-bold text-neutral-900 hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-neutral-600">
                        <div>Budget: <strong className="text-neutral-900">{budget || 'Prefer not to say'}</strong></div>
                        <div>Occasion: <strong className="text-neutral-900">{occasion || 'None stated'}</strong></div>
                        <div className="col-span-2">
                          Instructions: <span className="text-neutral-900">{instructions || 'None provided'}</span>
                        </div>
                        {engraving && (
                          <div className="col-span-2">
                            Engraving: <strong className="text-neutral-900 font-mono">"{engraving}"</strong>
                          </div>
                        )}
                        <div>Attached Images: <strong className="text-neutral-900">{files.length} images</strong></div>
                      </div>
                    </div>

                    {/* Contact specs */}
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-neutral-900 font-serif">Contact Information</span>
                        <button
                          type="button"
                          onClick={() => handleJumpTo(6)}
                          className="font-bold text-neutral-900 hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-neutral-600">
                        <div>Name: <strong className="text-neutral-900">{fullName}</strong></div>
                        <div>Email: <strong className="text-neutral-900">{email}</strong></div>
                        <div>Phone: <strong className="text-neutral-900">{phoneNumber}</strong></div>
                        <div>Country: <strong className="text-neutral-900">{country}</strong></div>
                        <div>Contact via: <strong className="text-neutral-900 capitalize">{contactMethod}</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Consent Checkbox */}
                  <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 rounded text-black focus:ring-black accent-black h-4 w-4"
                    />
                    <span className="text-neutral-600">
                      I agree to allow Ceylon Jewels to review my custom specifications and contact me regarding this bespoke inquiry. My details will remain strictly confidential.
                    </span>
                  </label>
                  {errors.consent && <p className="text-xs text-red-600 font-medium">{errors.consent}</p>}

                  {submitError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                      {submitError}
                    </div>
                  )}
                </div>
              )}

              {/* Wizard Bottom Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 0}
                  className={`px-5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                    step === 0
                      ? 'invisible'
                      : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100 cursor-pointer'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={submitting}
                  className="px-7 py-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : step === 7 ? (
                    <span>Submit Custom Jewellery Request</span>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT: Live Interactive Preview Panel (Cols 4) */}
            <div className="lg:col-span-4 lg:sticky lg:top-0">
              <div className="bg-neutral-50 rounded-3xl border border-neutral-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-bold text-neutral-900">Your Design So Far</h3>
                  <span className="text-[10px] font-semibold text-neutral-800 bg-neutral-200/80 border border-neutral-300 px-2.5 py-0.5 rounded-full">
                    Live Preview
                  </span>
                </div>

                {/* 3D SVG Artwork Box */}
                <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200/80 border border-neutral-200 flex items-center justify-center p-4 relative overflow-hidden shadow-inner">
                  <div className="w-[85%] h-[85%] filter drop-shadow-lg transition-transform duration-500 hover:scale-105">
                    <JewelSvg type={jewellery} metal={curMetal} sap={curSap} cut={cut} />
                  </div>
                </div>

                {/* Live Specification List */}
                <dl className="space-y-2 text-xs divide-y divide-neutral-200 pt-1">
                  <div className="flex justify-between pt-1">
                    <dt className="text-neutral-500">Piece</dt>
                    <dd className="font-semibold text-neutral-900">{curJewel.name}</dd>
                  </div>
                  <div className="flex justify-between pt-2">
                    <dt className="text-neutral-500">Metal</dt>
                    <dd className="font-semibold text-neutral-900">{curMetal.name}</dd>
                  </div>
                  <div className="flex justify-between pt-2">
                    <dt className="text-neutral-500">Sapphire</dt>
                    <dd className="font-semibold text-neutral-900">{curSap.name}</dd>
                  </div>
                  <div className="flex justify-between pt-2">
                    <dt className="text-neutral-500">Cut</dt>
                    <dd className="font-semibold text-neutral-900">{curCutItem.name}</dd>
                  </div>
                  <div className="flex justify-between pt-2">
                    <dt className="text-neutral-500">Size / Style</dt>
                    <dd className="font-semibold text-neutral-900">{getSizeDisplay()}</dd>
                  </div>
                </dl>

                <p className="text-[11px] text-neutral-400 font-light leading-relaxed pt-1 border-t border-neutral-200">
                  Illustrative preview. Your bespoke piece is shaped with our certified gemological lapidaries in Colombo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sizing Guide Popup Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setSizeGuideOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-neutral-200 z-10 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-neutral-900">Jewellery Size Guide</h3>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Guide Tabs */}
            <div className="flex gap-2 border-b border-neutral-200 pb-2">
              <button
                type="button"
                onClick={() => setSizeGuideTab('ring')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                  sizeGuideTab === 'ring' ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Ring Sizing
              </button>
              <button
                type="button"
                onClick={() => setSizeGuideTab('chain')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                  sizeGuideTab === 'chain' ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Necklace Chain
              </button>
              <button
                type="button"
                onClick={() => setSizeGuideTab('bracelet')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                  sizeGuideTab === 'bracelet' ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Bracelet
              </button>
            </div>

            {/* Guide Body */}
            {sizeGuideTab === 'ring' && (
              <div className="space-y-3">
                <p className="text-xs text-neutral-500">
                  Wrap a narrow strip of paper snugly around your finger. Mark where the ends meet and measure in millimetres.
                </p>
                <div className="max-h-56 overflow-y-auto border border-neutral-200 rounded-xl text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-100 text-neutral-600 sticky top-0">
                      <tr>
                        <th className="p-2">US Size</th>
                        <th className="p-2">Diameter (mm)</th>
                        <th className="p-2">Circumference (mm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {SIZE_GUIDE_RING.map((r) => (
                        <tr key={r[0]} className="hover:bg-neutral-50">
                          <td className="p-2 font-bold">{r[0]}</td>
                          <td className="p-2">{r[1]}</td>
                          <td className="p-2">{r[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {sizeGuideTab === 'chain' && (
              <div className="space-y-3">
                <p className="text-xs text-neutral-500">
                  Choose where you prefer your sapphire pendant to fall across your neckline.
                </p>
                <div className="border border-neutral-200 rounded-xl text-xs overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-100 text-neutral-600">
                      <tr>
                        <th className="p-2">Length</th>
                        <th className="p-2">Style</th>
                        <th className="p-2">Where it rests</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {CHAIN_GUIDE.map((r) => (
                        <tr key={r[0]} className="hover:bg-neutral-50">
                          <td className="p-2 font-bold">{r[0]}</td>
                          <td className="p-2">{r[1]}</td>
                          <td className="p-2">{r[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {sizeGuideTab === 'bracelet' && (
              <div className="text-xs text-neutral-600 space-y-2 leading-relaxed">
                <p>
                  Wrap a flexible tape measure around your wrist just above the wrist bone.
                </p>
                <p>
                  • Add <strong>0.5 inches</strong> for a classic tailored fit.
                </p>
                <p>
                  • Add <strong>1.0 inch</strong> for a relaxed drape.
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                className="px-5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizeStudioModal;
