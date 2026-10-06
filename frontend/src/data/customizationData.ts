export interface SapphireVariety {
  id: string;
  name: string;
  colorName: string;
  badge: string;
  accentColor: string;
  image: string;
  description: string;
  rarity: 'Rare' | 'Very Rare' | 'Ultra Rare' | 'Exclusive';
  origin: string;
  idealFor: string;
}

export interface SapphireCut {
  id: string;
  name: string;
  ratio: string;
  sparkleProfile: string;
  description: string;
  bestSuitedFor: string;
  image: string;
}

export interface BirthstoneMonth {
  month: string;
  recommendedSapphire: string;
  stoneColor: string;
  symbolism: string;
  stylingNote: string;
}

export interface ProcessStep {
  stepNumber: string;
  title: string;
  location: string;
  description: string;
  iconName: string;
}

export const SAPPHIRE_VARIETIES: SapphireVariety[] = [
  {
    id: 'royal-blue',
    name: 'Royal Blue Sapphire',
    colorName: 'Vivid Deep Blue',
    badge: 'Signature Ceylon',
    accentColor: '#102A71',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    description: 'The world-revered velvety deep blue with vivid saturation. Sourced from the legendary riverbeds of Ratnapura.',
    rarity: 'Very Rare',
    origin: 'Ratnapura, Sri Lanka',
    idealFor: 'Classic Engagement Rings & Royal Pendants',
  },
  {
    id: 'cornflower-blue',
    name: 'Cornflower Blue Sapphire',
    colorName: 'Luminous Pastel Blue',
    badge: 'Collector Choice',
    accentColor: '#4A76A8',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    description: 'A soft, mesmerizing silk-sheen sky blue with high natural light refraction and unmatched brilliance in sunlight.',
    rarity: 'Rare',
    origin: 'Elahera, Sri Lanka',
    idealFor: 'Delicate Solitaires & Modern Cocktail Rings',
  },
  {
    id: 'padparadscha',
    name: 'Padparadscha Sapphire',
    colorName: 'Lotus Sunset Pink-Orange',
    badge: 'Holy Grail Gem',
    accentColor: '#F27B66',
    image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80',
    description: 'Named after the sacred Sinhalese lotus blossom, this coveted gem captures a celestial blend of salmon pink and golden sunrise.',
    rarity: 'Ultra Rare',
    origin: 'Balangoda, Sri Lanka',
    idealFor: 'Heirloom Rings & Bespoke High Jewellery',
  },
  {
    id: 'pastel-pink',
    name: 'Pastel Pink Sapphire',
    colorName: 'Blush & Magenta Rose',
    badge: 'Romantic Elegance',
    accentColor: '#E66794',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    description: 'Radiating feminine grace, natural pink sapphires offer diamond-like hardness with warm, romantic rose undertones.',
    rarity: 'Rare',
    origin: 'Pelmadulla, Sri Lanka',
    idealFor: 'Anniversary Rings & Halo Pendants',
  },
  {
    id: 'golden-yellow',
    name: 'Golden Yellow Sapphire',
    colorName: 'Canary & Honey Gold',
    badge: 'Prosperity & Light',
    accentColor: '#D99B26',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80',
    description: 'Brimming with fiery warm brilliance. Known historically as "Pushparaga", symbolizing wisdom, clarity, and abundance.',
    rarity: 'Rare',
    origin: 'Ratnapura, Sri Lanka',
    idealFor: 'Statement Rings & Warm Gold Settings',
  },
  {
    id: 'vivid-teal',
    name: 'Teal / Peacock Sapphire',
    colorName: 'Ocean Green-Blue',
    badge: 'Contemporary Luxe',
    accentColor: '#1A6B72',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80',
    description: 'A captivating bi-colour phenomenon shifting between forest teal, oceanic blue, and moss green in varying light conditions.',
    rarity: 'Very Rare',
    origin: 'Okkampitiya, Sri Lanka',
    idealFor: 'Unique Nature-Inspired Bespoke Designs',
  },
  {
    id: 'white-sapphire',
    name: 'White / Colourless Sapphire',
    colorName: 'Pure Crystal Ice',
    badge: 'Ethical Diamond Alternative',
    accentColor: '#A8B2C1',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    description: 'Completely unheated natural crystalline corundum providing a crisp, fiery sparkle and exceptional hardness (9 on Mohs scale).',
    rarity: 'Rare',
    origin: 'Kataragama, Sri Lanka',
    idealFor: 'Pavé Accents & Minimalist Solitaires',
  },
  {
    id: 'star-sapphire',
    name: 'Ceylon Star Sapphire',
    colorName: 'Asterism Phenomenon',
    badge: 'Rare Celestial Gem',
    accentColor: '#4F5D75',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
    description: 'Natural cabochon cutting displays a sharp 6-ray floating star that glides effortlessly across the gemstone under direct light.',
    rarity: 'Exclusive',
    origin: 'Ratnapura, Sri Lanka',
    idealFor: 'Men’s Signet Rings & Statement Brooches',
  },
];

export const SAPPHIRE_CUTS: SapphireCut[] = [
  {
    id: 'oval',
    name: 'Oval Cut',
    ratio: '1.30 – 1.45 Ratio',
    sparkleProfile: 'Maximum Surface Fire & Elongation',
    description: 'Accentuates the finger with graceful elongation while preserving maximum carat weight and color density.',
    bestSuitedFor: 'Engagement rings, solitaire pendants',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cushion',
    name: 'Cushion Cut',
    ratio: '1.00 – 1.15 Ratio',
    sparkleProfile: 'Vintage Romance & Soft Pillow Corners',
    description: 'Combines antique vintage charm with large open facets that deepen the gemstone’s inherent rich color saturation.',
    bestSuitedFor: 'Halo settings, three-stone rings',
    image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'round-brilliant',
    name: 'Round Brilliant',
    ratio: '1.00 Symmetry',
    sparkleProfile: 'Maximum Scintillation & Dispersion',
    description: '57 precisely calculated facets engineered to reflect light from every angle, creating vivid kaleidoscopic sparkle.',
    bestSuitedFor: 'Classic solitaires, stud earrings',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'emerald-cut',
    name: 'Emerald / Step Cut',
    ratio: '1.35 – 1.50 Ratio',
    sparkleProfile: 'Hall-of-Mirrors Optical Clarity',
    description: 'Parallel rectangular step facets highlight crystal clarity and aristocratic elegance over flash sparkle.',
    bestSuitedFor: 'Art Deco settings, bezel-set pieces',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pear',
    name: 'Pear / Teardrop Cut',
    ratio: '1.45 – 1.65 Ratio',
    sparkleProfile: 'Dramatic Point & Brilliant Basin',
    description: 'Marries the brilliant sparkle of a round cut with the elongated grace of a marquise, creating a flattering silhouette.',
    bestSuitedFor: 'Drop earrings, directional rings, necklaces',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'princess',
    name: 'Princess Cut',
    ratio: '1.00 Square',
    sparkleProfile: 'Contemporary Geometric Sparkle',
    description: 'Modern 90-degree square symmetry with pyramid chevron pavilion facets for intense, crisp light reflection.',
    bestSuitedFor: 'Modern channel & prong settings',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80',
  },
];

export const BIRTHSTONE_GUIDE: BirthstoneMonth[] = [
  {
    month: 'January',
    recommendedSapphire: 'Deep Star & Violet Sapphire',
    stoneColor: '#4A3B69',
    symbolism: 'Constancy, inner resolve, and calm nobility',
    stylingNote: 'Styling recommendation offering a velvety alternative to garnet.',
  },
  {
    month: 'February',
    recommendedSapphire: 'Pastel Purple & Lavender Sapphire',
    stoneColor: '#8C6C9F',
    symbolism: 'Serenity, royalty, and creative intuition',
    stylingNote: 'Curated as a durable luxury alternative to amethyst.',
  },
  {
    month: 'March',
    recommendedSapphire: 'Cornflower & Sky Blue Sapphire',
    stoneColor: '#5B84B1',
    symbolism: 'Youthful vitality, oceanic tranquility, and truth',
    stylingNote: 'Matches the refreshing tones of aquamarine with superior lustre.',
  },
  {
    month: 'April',
    recommendedSapphire: 'Pure White / Colourless Sapphire',
    stoneColor: '#98A3B2',
    symbolism: 'Purity, clarity, invincible strength',
    stylingNote: 'Natural corundum choice pairing diamond clarity with sustainable heritage.',
  },
  {
    month: 'May',
    recommendedSapphire: 'Vivid Teal & Forest Green Sapphire',
    stoneColor: '#1E6B52',
    symbolism: 'Renewal, prosperity, and harmonic growth',
    stylingNote: 'A durable gemstone recommendation evoking emerald richness.',
  },
  {
    month: 'June',
    recommendedSapphire: 'Padparadscha & Peach Sapphire',
    stoneColor: '#E68A6C',
    symbolism: 'Warm affection, rare grace, and sunset allure',
    stylingNote: 'Curated styling choice inspired by the warm sheen of pearls.',
  },
  {
    month: 'July',
    recommendedSapphire: 'Magenta & Vivid Pink Sapphire',
    stoneColor: '#D1345B',
    symbolism: 'Passion, boundless courage, and heartfelt devotion',
    stylingNote: 'A radiant Sri Lankan sister gem to natural rubies.',
  },
  {
    month: 'August',
    recommendedSapphire: 'Lime-Yellow & Olive Green Sapphire',
    stoneColor: '#8E9A34',
    symbolism: 'Sunlit warmth, protection, and boundless energy',
    stylingNote: 'Echoes the joyful light of peridot in a scratch-resistant setting.',
  },
  {
    month: 'September',
    recommendedSapphire: 'Royal Blue Ceylon Sapphire (Traditional)',
    stoneColor: '#0F2862',
    symbolism: 'Sincerity, wisdom, divine protection, and royalty',
    stylingNote: 'The official, historical birthstone for September worldwide.',
  },
  {
    month: 'October',
    recommendedSapphire: 'Soft Blush Pink Sapphire',
    stoneColor: '#E58A9F',
    symbolism: 'Compassion, unconditional tenderness, and luck',
    stylingNote: 'Curated pastel elegance recommended for October gifting.',
  },
  {
    month: 'November',
    recommendedSapphire: 'Golden Honey & Canary Yellow Sapphire',
    stoneColor: '#D68910',
    symbolism: 'Abundance, radiant joy, and enduring wisdom',
    stylingNote: 'Styling recommendation capturing golden citrine tones.',
  },
  {
    month: 'December',
    recommendedSapphire: 'Vivid Peacock & Indigo Sapphire',
    stoneColor: '#1B4F72',
    symbolism: 'Intuition, peaceful stillness, and confidence',
    stylingNote: 'Deep blue hues complementing turquoise & tanzanite traditions.',
  },
];

export const ARTISANAL_PROCESS_STEPS: ProcessStep[] = [
  {
    stepNumber: '01',
    title: 'Ethical Rough Gemstone Sourcing',
    location: 'Ratnapura & Elahera, Sri Lanka',
    description: 'We directly handpick unheated and naturally vibrant sapphire roughs from licensed artisanal mines, guaranteeing fair miner compensation and minimal environmental impact.',
    iconName: 'Pickaxe',
  },
  {
    stepNumber: '02',
    title: 'Master Lapidary & Precision Faceting',
    location: 'Colombo Gem Atelier',
    description: 'Our hereditary master gem-cutters study the crystal axis of each rough stone, positioning every facet by hand to unleash maximum color depth, fire, and brilliance.',
    iconName: 'Sparkles',
  },
  {
    stepNumber: '03',
    title: '1-on-1 Design & 3D CAD Modeling',
    location: 'Bespoke Design Studio',
    description: 'You collaborate directly with our jewellery designers via WhatsApp or video call. We produce detailed 3D photorealistic CAD renders before any metal is touched.',
    iconName: 'Compass',
  },
  {
    stepNumber: '04',
    title: 'Fine Metal Casting & Master Setting',
    location: 'Fine Jewellery Workshop',
    description: 'Your design is cast in premium recycled 925 Sterling Silver, 14K/18K Solid Gold or Platinum, then hand-set under microscopic precision with reinforced prongs.',
    iconName: 'Hammer',
  },
  {
    stepNumber: '05',
    title: 'Gemological Certification & Quality Check',
    location: 'Independent Lab & Quality Suite',
    description: 'Every bespoke creation undergoes rigorous microscopic inspection and is authenticated with an official Ceylon Gemological Certificate guaranteeing provenance.',
    iconName: 'Award',
  },
  {
    stepNumber: '06',
    title: 'Insured White-Glove Global Delivery',
    location: 'Worldwide to Your Doorstep',
    description: 'Packaged in a luxury velvet keepsake box with care kit and certificate, shipped securely with 100% full-value transit insurance and real-time tracking.',
    iconName: 'ShieldCheck',
  },
];

export const JEWELLERY_TYPES = [
  { id: 'ring', label: 'Ring', sublabel: 'Solitaire, Three-Stone, Halo, Eternity' },
  { id: 'necklace', label: 'Necklace / Pendant', sublabel: 'Solitaire Drop, Halo Pendant, Choker' },
  { id: 'earrings', label: 'Earrings', sublabel: 'Studs, Drop Earrings, Huggies' },
  { id: 'bracelet', label: 'Bracelet / Bangle', sublabel: 'Tennis Bracelet, Charm, Cuff' },
];

export const METAL_PREFERENCES = [
  { id: '925 Sterling Silver', label: '925 Sterling Silver', color: '#D4D8DD' },
  { id: '14K Rose Gold', label: '14K Rose Gold', color: '#E8A598' },
  { id: '18K Rose Gold', label: '18K Rose Gold', color: '#DE8C7E' },
  { id: '18K Yellow Gold', label: '18K Yellow Gold', color: '#E5C158' },
  { id: '18K White Gold', label: '18K White Gold', color: '#EAEAEA' },
  { id: 'Platinum', label: 'Platinum 950', color: '#DFE2E5' },
];

export const BUDGET_RANGES = [
  'Under $500',
  '$500 – $1,200',
  '$1,200 – $2,500',
  '$2,500 – $5,000',
  '$5,000+',
  'Flexible / Advise Me',
];

export const OCCASIONS = [
  'Engagement / Proposal',
  'Wedding / Anniversary',
  'Birthday Milestone',
  'Special Gift for Loved One',
  'Self-Love / Personal Celebration',
  'Push Present / Graduation',
];
