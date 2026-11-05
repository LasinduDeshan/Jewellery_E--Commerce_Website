import { Request, Response } from 'express';
import { Faq } from '../models/Faq.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export const DEFAULT_BESPOKE_FAQS = [
  {
    _id: 'seed-faq-1',
    question: 'How does the bespoke jewellery design process work?',
    answer:
      'You begin by selecting your preferred gemstone variety, cut, precious metal (solid 925 sterling silver or 18K gold), and setting style in our digital studio or via personal consultation. Our goldsmiths produce detailed 3D CAD renders for your review and approval before hand-forging your piece in our Colombo atelier.',
    category: 'customize',
    sortOrder: 1,
    isActive: true,
  },
  {
    _id: 'seed-faq-2',
    question: 'Are all Ceylon sapphires natural, unheated, and certified?',
    answer:
      'Yes, absolutely. Every sapphire is 100% natural and ethically hand-gathered from hereditary alluvial riverbeds in Ratnapura and Elahera, Sri Lanka. Each custom piece comes accompanied by an official National Gem & Jewellery Authority (NGJA) certificate of authenticity and provenance.',
    category: 'customize',
    sortOrder: 2,
    isActive: true,
  },
  {
    _id: 'seed-faq-3',
    question: 'Can I provide my own design sketch, heirloom gem, or reference photos?',
    answer:
      'Yes! You can upload reference sketches, inspirational photos, or heirloom stone dimensions through our Custom Studio form or WhatsApp concierge. Our master jewellers evaluate the concept and deliver 3D visualizations with transparent cost estimates within 24 to 48 hours.',
    category: 'customize',
    sortOrder: 3,
    isActive: true,
  },
  {
    _id: 'seed-faq-4',
    question: 'How long does a custom ring or pendant take to craft and deliver?',
    answer:
      'Typical bespoke commissions require between 2 to 4 weeks from final CAD approval to dispatch. This ensures adequate time for precision lapidary faceting, hand-casting, pavé micro-setting, hallmark engraving, and government export gemological clearance.',
    category: 'customize',
    sortOrder: 4,
    isActive: true,
  },
  {
    _id: 'seed-faq-5',
    question: 'What precious metals do you forge, and are they hypoallergenic?',
    answer:
      'We cast exclusively in solid 925 Sterling Silver with anti-tarnish rhodium plating, and solid 18K Yellow, Rose, or White Gold vermeil. All alloys are 100% nickel-free, cadmium-free, and hypoallergenic for comfortable daily heirloom wear.',
    category: 'customize',
    sortOrder: 5,
    isActive: true,
  },
  {
    _id: 'seed-faq-6',
    question: 'Do you offer personalized laser inscriptions and custom ring sizing?',
    answer:
      'Yes. We offer complimentary precision laser engraving on the inner band (dates, initials, or coordinates). We accommodate full custom sizing from US 3 to US 14, including quarter and half sizes, with complimentary resizing within 30 days of receipt.',
    category: 'customize',
    sortOrder: 6,
    isActive: true,
  },
];

let inMemoryFaqs: any[] = [...DEFAULT_BESPOKE_FAQS];

// ============================================================
// GET ALL FAQS (Public & Admin)
// GET /api/faqs?category=customize&all=true
// ============================================================
export const getFaqs = asyncHandler(async (req: Request, res: Response) => {
  const { category, all } = req.query;

  const filter: any = {};
  if (category && category !== 'all') {
    filter.category = String(category);
  }
  if (all !== 'true') {
    filter.isActive = true;
  }

  try {
    const totalCount = await Faq.countDocuments();
    if (totalCount === 0) {
      // Seed default FAQs into database if empty
      await Faq.insertMany(
        DEFAULT_BESPOKE_FAQS.map(({ _id, ...rest }) => rest)
      );
    }

    const docs = await Faq.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    if (docs && docs.length > 0) {
      res.json(ApiResponse.success(docs, 'FAQs retrieved successfully'));
      return;
    }
  } catch (err) {
    // Fallback to memory
  }

  // Filter in-memory fallback
  let result = [...inMemoryFaqs];
  if (category && category !== 'all') {
    result = result.filter((item) => item.category === category);
  }
  if (all !== 'true') {
    result = result.filter((item) => item.isActive);
  }
  result.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  res.json(ApiResponse.success(result, 'FAQs retrieved successfully (fallback)'));
});

// ============================================================
// CREATE FAQ (Admin)
// POST /api/faqs
// ============================================================
export const createFaq = asyncHandler(async (req: Request, res: Response) => {
  const { question, answer, category = 'customize', sortOrder = 0, isActive = true } = req.body;

  if (!question || !answer) {
    throw new ApiError(400, 'Question and answer are required');
  }

  try {
    const doc = await Faq.create({
      question: question.trim(),
      answer: answer.trim(),
      category,
      sortOrder: Number(sortOrder) || 0,
      isActive: Boolean(isActive),
    });

    inMemoryFaqs.push(doc.toObject());
    res.status(201).json(ApiResponse.success(doc, 'FAQ created successfully'));
    return;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
  }

  // In-memory fallback
  const newFaq = {
    _id: `mem-${Date.now()}`,
    question: question.trim(),
    answer: answer.trim(),
    category,
    sortOrder: Number(sortOrder) || inMemoryFaqs.length + 1,
    isActive: Boolean(isActive),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  inMemoryFaqs.push(newFaq);

  res.status(201).json(ApiResponse.success(newFaq, 'FAQ created successfully (cached)'));
});

// ============================================================
// UPDATE FAQ (Admin)
// PUT /api/faqs/:id
// ============================================================
export const updateFaq = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const doc = await Faq.findByIdAndUpdate(id, updates, { new: true });
    if (doc) {
      const idx = inMemoryFaqs.findIndex((f) => String(f._id) === String(id));
      if (idx !== -1) inMemoryFaqs[idx] = doc.toObject();
      res.json(ApiResponse.success(doc, 'FAQ updated successfully'));
      return;
    }
  } catch (err) {
    // Fallback
  }

  const idx = inMemoryFaqs.findIndex((f) => String(f._id) === String(id));
  if (idx !== -1) {
    inMemoryFaqs[idx] = {
      ...inMemoryFaqs[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    res.json(ApiResponse.success(inMemoryFaqs[idx], 'FAQ updated successfully'));
    return;
  }

  throw new ApiError(404, 'FAQ not found');
});

// ============================================================
// DELETE FAQ (Admin)
// DELETE /api/faqs/:id
// ============================================================
export const deleteFaq = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await Faq.findByIdAndDelete(id);
  } catch (err) {
    // Ignore db err, fallback
  }

  inMemoryFaqs = inMemoryFaqs.filter((f) => String(f._id) !== String(id));
  res.json(ApiResponse.success({ id }, 'FAQ deleted successfully'));
});

// ============================================================
// BULK REORDER (Admin)
// PUT /api/faqs/reorder
// ============================================================
export const reorderFaqs = asyncHandler(async (req: Request, res: Response) => {
  const { items } = req.body; // Array of { id: string, sortOrder: number }

  if (Array.isArray(items)) {
    try {
      const bulkOps = items.map((item) => ({
        updateOne: {
          filter: { _id: item.id },
          update: { $set: { sortOrder: item.sortOrder } },
        },
      }));
      if (bulkOps.length > 0) {
        await Faq.bulkWrite(bulkOps);
      }
    } catch (err) {
      // Fallback
    }

    items.forEach((item) => {
      const found = inMemoryFaqs.find((f) => String(f._id) === String(item.id));
      if (found) found.sortOrder = item.sortOrder;
    });
  }

  res.json(ApiResponse.success(null, 'FAQs reordered successfully'));
});
