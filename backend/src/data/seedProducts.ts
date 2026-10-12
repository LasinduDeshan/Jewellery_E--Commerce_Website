export interface SeedProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  category: 'necklaces' | 'rings' | 'engagement-promise-rings' | 'bracelets' | 'earrings';
  gender: 'women' | 'men' | 'unisex';
  metal: {
    type: 'silver' | 'rose-gold';
    purity: string;
  };
  gemstone: {
    type: string;
    carat: number;
    cut?: string;
    origin?: string;
    treatment?: string;
  };
  weight: {
    value: number;
    unit: 'g' | 'mg';
  };
  dimensions: {
    description: string;
    ringSizes?: string[];
    chainLengths?: string[];
  };
  price: number; // in AUD
  currency: 'AUD';
  stockQuantity: number;
  images: Array<{ url: string; alt?: string; sortOrder: number }>;
  media?: {
    videoUrl?: string;
    view360Url?: string;
  };
  certificate: {
    available: boolean;
    issuer: string;
    certificateNumber: string;
    url?: string;
  };
  description: string;
  careInstructions: string;
  isActive: boolean;
  createdAt: string;
}

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    _id: 'prod_001',
    name: 'Royal Blue Ceylon Sapphire Regal Halo Ring',
    slug: 'royal-blue-ceylon-sapphire-regal-halo-ring',
    sku: 'AUR-RNG-001',
    category: 'rings',
    gender: 'women',
    metal: {
      type: 'silver',
      purity: '925 Solid Sterling Silver (Rhodium Plated)',
    },
    gemstone: {
      type: 'Natural Ceylon Royal Blue Sapphire',
      carat: 1.85,
      cut: 'Oval Brilliant',
      origin: 'Ratnapura, Sri Lanka',
      treatment: 'Unheated / Untreated Natural',
    },
    weight: {
      value: 4.2,
      unit: 'g',
    },
    dimensions: {
      description: 'Band width 1.8mm, Crown dimension 11.2mm x 9.5mm',
      ringSizes: ['US 5', 'US 6', 'US 7', 'US 8', 'US 9'],
    },
    price: 840,
    currency: 'AUD',
    stockQuantity: 2,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
        alt: 'Royal Blue Sapphire Ring Face View',
        sortOrder: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80',
        alt: 'Profile View showing gemstone setting and basket',
        sortOrder: 2,
      },
      {
        url: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=80',
        alt: 'On-hand perspective displaying scale and brilliance',
        sortOrder: 3,
      },
      {
        url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=80',
        alt: '45-degree angle macro of pavé halo',
        sortOrder: 4,
      },
      {
        url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
        alt: 'Jeweller presentation box view',
        sortOrder: 5,
      },
    ],
    media: {
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-diamond-ring-sparkling-in-the-dark-42416-large.mp4',
      view360Url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
    },
    certificate: {
      available: true,
      issuer: 'National Gem & Jewellery Authority (NGJA) Sri Lanka',
      certificateNumber: 'NGJA-SL-2026-98104',
      url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    },
    description:
      'A breathtaking 1.85-carat unheated Ceylon Royal Blue sapphire unearthed from the gem-rich riverbeds of Ratnapura, Sri Lanka. Embraced by a luminous micro-pavé halo, cast in solid 925 sterling silver with tarnish-resistant rhodium finishing. An heirloom masterpiece celebrating authentic Sri Lankan heritage.',
    careInstructions:
      'Gently clean with lukewarm water, mild soap, and a soft-bristled brush. Store in the complimentary velvet pouch away from harsh chemicals and bleach.',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_002',
    name: 'Padparadscha Lotus Blossom Pendant',
    slug: 'padparadscha-lotus-blossom-pendant',
    sku: 'AUR-NCK-002',
    category: 'necklaces',
    gender: 'women',
    metal: {
      type: 'rose-gold',
      purity: '18K Rose Gold Vermeil (over 925 Sterling Silver)',
    },
    gemstone: {
      type: 'Natural Ceylon Padparadscha Sapphire',
      carat: 1.42,
      cut: 'Cushion Cut',
      origin: 'Elahera, Sri Lanka',
      treatment: 'Unheated Natural',
    },
    weight: {
      value: 3.8,
      unit: 'g',
    },
    dimensions: {
      description: 'Pendant length 16mm x width 9mm',
      chainLengths: ['42cm (16.5")', '45cm (18")', '50cm (20")'],
    },
    price: 1120,
    currency: 'AUD',
    stockQuantity: 1,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
        alt: 'Padparadscha Sapphire Pendant Front',
        sortOrder: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
        alt: 'Padparadscha Rose Gold setting side detail',
        sortOrder: 2,
      },
      {
        url: 'https://images.unsplash.com/photo-1611591475870-8b1e19d1cbba?auto=format&fit=crop&w=900&q=80',
        alt: 'Delicate chain and clasp close-up',
        sortOrder: 3,
      },
      {
        url: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=900&q=80',
        alt: 'Worn neckline photography',
        sortOrder: 4,
      },
    ],
    media: {
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-necklace-with-a-crystal-pendant-42417-large.mp4',
      view360Url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
    },
    certificate: {
      available: true,
      issuer: 'Gemological Institute of Colombo (GIC)',
      certificateNumber: 'GIC-EXP-2026-4421',
      url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    },
    description:
      'Named after the Sinhalese word for lotus blossom ("Padma Raga"), this rare 1.42ct Ceylon Padparadscha exhibits the elusive blend of delicate lotus pink and tropical sunrise orange. Set in warm 18K rose gold vermeil on an adjustable diamond-cut cable chain.',
    careInstructions:
      'Keep away from chlorinated pools and perfumes. Wipe with the provided microfiber polishing cloth after wearing.',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_003',
    name: 'Cornflower Blue Sapphire Eternity Promise Ring',
    slug: 'cornflower-blue-sapphire-eternity-promise-ring',
    sku: 'AUR-ENG-003',
    category: 'engagement-promise-rings',
    gender: 'women',
    metal: {
      type: 'silver',
      purity: '925 Solid Sterling Silver (Rhodium Finished)',
    },
    gemstone: {
      type: 'Ceylon Cornflower Blue Sapphires',
      carat: 1.2,
      cut: 'Round Brilliant Pavé',
      origin: 'Ratnapura, Sri Lanka',
      treatment: 'Natural Earth Mined',
    },
    weight: {
      value: 2.9,
      unit: 'g',
    },
    dimensions: {
      description: 'Band width 2.2mm continuous eternity setting',
      ringSizes: ['US 5', 'US 6', 'US 7', 'US 8'],
    },
    price: 590,
    currency: 'AUD',
    stockQuantity: 3,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80',
        alt: 'Cornflower Blue Sapphire Eternity Band',
        sortOrder: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
        alt: 'Stacking combination with solitaire',
        sortOrder: 2,
      },
      {
        url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=80',
        alt: 'Edge view of secure prong set stones',
        sortOrder: 3,
      },
      {
        url: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=80',
        alt: 'Hand modeling perspective',
        sortOrder: 4,
      },
    ],
    media: {
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-diamond-ring-sparkling-in-the-dark-42416-large.mp4',
    },
    certificate: {
      available: true,
      issuer: 'National Gem & Jewellery Authority (NGJA)',
      certificateNumber: 'NGJA-SL-2026-7832',
    },
    description:
      'Continuous circles of velvety cornflower blue Ceylon sapphires channel-set around a pure 925 silver core. Perfect as an anniversary band, promise ring, or luxury stacking companion.',
    careInstructions:
      'Avoid heavy gym equipment or abrasive surfaces while wearing. Clean with soft cloth.',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_004',
    name: 'Petal Pink Sapphire Teardrop Earrings',
    slug: 'petal-pink-sapphire-teardrop-earrings',
    sku: 'AUR-EAR-004',
    category: 'earrings',
    gender: 'women',
    metal: {
      type: 'rose-gold',
      purity: '18K Rose Gold Vermeil',
    },
    gemstone: {
      type: 'Natural Ceylon Pink Sapphires',
      carat: 2.1,
      cut: 'Pear / Teardrop Cut',
      origin: 'Ratnapura, Sri Lanka',
      treatment: 'Natural Gemstone',
    },
    weight: {
      value: 3.4,
      unit: 'g',
    },
    dimensions: {
      description: 'Drop length 22mm x width 6mm',
    },
    price: 680,
    currency: 'AUD',
    stockQuantity: 2,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
        alt: 'Pink Sapphire Drop Earrings Front',
        sortOrder: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80',
        alt: 'Earring clasp and hinge mechanism',
        sortOrder: 2,
      },
      {
        url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
        alt: 'Pair symmetry and gemstone match',
        sortOrder: 3,
      },
      {
        url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
        alt: 'Packaging and presentation cushion',
        sortOrder: 4,
      },
    ],
    media: {
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-necklace-with-a-crystal-pendant-42417-large.mp4',
    },
    certificate: {
      available: true,
      issuer: 'GIC Colombo Gemological Certificate',
      certificateNumber: 'GIC-2026-6691',
    },
    description:
      'Matched twin Ceylon pear-cut pink sapphires suspended gracefully from delicate 18K rose gold ear wires. Captures subtle movement and brilliant sparkle with evening and bridal attire.',
    careInstructions:
      'Store each earring in separate compartments to prevent gems from contacting each other.',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_005',
    name: 'Ratnapura Golden Yellow Sapphire Tennis Bracelet',
    slug: 'ratnapura-golden-yellow-sapphire-tennis-bracelet',
    sku: 'AUR-BRC-005',
    category: 'bracelets',
    gender: 'unisex',
    metal: {
      type: 'silver',
      purity: '925 Solid Sterling Silver (Double Rhodium Plating)',
    },
    gemstone: {
      type: 'Natural Ceylon Golden Yellow Sapphires',
      carat: 4.8,
      cut: 'Round Brilliant (36 Stones)',
      origin: 'Ratnapura, Sri Lanka',
      treatment: 'Natural Earth Mined',
    },
    weight: {
      value: 8.6,
      unit: 'g',
    },
    dimensions: {
      description: 'Length 18cm (7 inches) with double safety lock clasp',
    },
    price: 1350,
    currency: 'AUD',
    stockQuantity: 1,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1611591475870-8b1e19d1cbba?auto=format&fit=crop&w=900&q=80',
        alt: 'Yellow Sapphire Tennis Bracelet Laydown',
        sortOrder: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
        alt: 'Clasp safety mechanism detail',
        sortOrder: 2,
      },
      {
        url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=80',
        alt: 'Macro view of individual 4-prong links',
        sortOrder: 3,
      },
      {
        url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
        alt: 'Wrist fitting display',
        sortOrder: 4,
      },
    ],
    media: {
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-diamond-ring-sparkling-in-the-dark-42416-large.mp4',
    },
    certificate: {
      available: true,
      issuer: 'NGJA Colombo Official Export Certification',
      certificateNumber: 'NGJA-EXP-2026-1188',
    },
    description:
      'Thirty-six precisely calibrated Sri Lankan canary yellow sapphires, hand-set into flexible 4-prong solid silver links with double safety closure. Symbolizing prosperity and joyful warmth in traditional Vedic gemology.',
    careInstructions:
      'Store flat in jewelry casket. Wipe gently with clean microfiber cloth after evening use.',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_006',
    name: 'Midnight Star Sapphire Heritage Signet Ring',
    slug: 'midnight-star-sapphire-heritage-signet-ring',
    sku: 'AUR-MEN-006',
    category: 'rings',
    gender: 'men',
    metal: {
      type: 'silver',
      purity: '925 Heavyweight Sterling Silver (Oxidized Finish)',
    },
    gemstone: {
      type: 'Natural Ceylon 6-Ray Star Sapphire',
      carat: 3.2,
      cut: 'Cabochon Cut',
      origin: 'Ratnapura, Sri Lanka',
      treatment: 'Unheated Natural Asterism',
    },
    weight: {
      value: 9.8,
      unit: 'g',
    },
    dimensions: {
      description: 'Top face 14mm x 12mm, Tapered shank 4.5mm',
      ringSizes: ['US 9', 'US 10', 'US 11', 'US 12'],
    },
    price: 950,
    currency: 'AUD',
    stockQuantity: 2,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
        alt: 'Men Star Sapphire Signet Ring',
        sortOrder: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80',
        alt: 'Asterism 6-ray star reflection under direct sunlight',
        sortOrder: 2,
      },
      {
        url: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=80',
        alt: 'Heavyweight brushed silver profile',
        sortOrder: 3,
      },
      {
        url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=80',
        alt: 'Under-gallery and comfort-fit band',
        sortOrder: 4,
      },
    ],
    media: {
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-diamond-ring-sparkling-in-the-dark-42416-large.mp4',
    },
    certificate: {
      available: true,
      issuer: 'National Gem & Jewellery Authority (NGJA)',
      certificateNumber: 'NGJA-STAR-2026-9021',
    },
    description:
      'A distinctive natural 6-ray star sapphire exhibiting sharp asterism that dances under directional light. Set in a brushed heavyweight signet bezel crafted from solid 925 sterling silver with a sculpted comfort-fit interior.',
    careInstructions:
      'Star sapphires have great durability (Mohs 9). Avoid direct strikes against harder stones (diamonds).',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];
