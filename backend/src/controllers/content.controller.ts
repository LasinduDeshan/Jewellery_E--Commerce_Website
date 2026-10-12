import { Request, Response } from 'express';
import { Content } from '../models/Content.js';

const SEED_CONTENT = {
  'our-story': {
    slug: 'our-story',
    pageTitle: 'Our Heritage • Aura Ceylon Jewels',
    heroHeadline: 'From Ratnapura Riverbeds to Australian Elegance',
    heroSubheadline:
      'A multi-generational lineage of Sri Lankan master lapidaries bringing unheated, ethically mined Ceylon Sapphires directly to discerning Australian collectors.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=80',
    sections: [
      {
        title: 'The Island of Gems (Ratna-Dweepa)',
        subtitle: 'Over 2,500 Years of Gemological Legend',
        body:
          'Sri Lanka has captivated emperors, royals, and explorers from Marco Polo to King Solomon with its celestial blue corundum. Unlike massive mechanized open-pit mines that scar the earth, Ceylon sapphires are traditionally panned and gathered by hand from alluvial gravel pits (illam) in the valleys of Ratnapura ("The City of Gems") and Elahera. Our mining partners operate exclusively on fair-wage, certified sustainable artisanal permits that respect the tropical ecosystem.',
        imageUrl:
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
        quote:
          '"Sri Lanka produces gems of greater purity, brilliance, and celestial fire than any other land on Earth."',
        author: 'Marco Polo, Travels (1292)',
      },
      {
        title: 'Hereditary Lapidary Mastery',
        subtitle: 'Faceting for Pure Radiance, Not Just Carat Weight',
        body:
          'Every natural rough sapphire has an inner crystalline axis. Our master gem cutters possess hereditary intuition passed down through four generations. Rather than cutting for bulk weight, each stone is cut specifically to maximize optical dispersion, brilliance, and color saturation.',
        imageUrl:
          'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'The Direct Sri Lanka → Australia Route',
        subtitle: 'Fine Jewellery Devoid of Middlemen & Artificial Markups',
        body:
          'Traditional luxury jewellery passes through up to five intermediaries — miners, rough brokers, export cartels, international wholesalers, and luxury department stores — each inflating the price. Aura Ceylon bridges this divide: our pieces travel directly from our Colombo workshop to your doorstep in Australia via secure express courier with independent National Gem & Jewellery Authority (NGJA) appraisal certificates.',
        imageUrl:
          'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
      },
    ],
    updatedAt: new Date().toISOString(),
  },
};

let inMemoryContent: Record<string, any> = { ...SEED_CONTENT };

export const getContentBySlug = async (req: Request, res: Response): Promise<void> => {
  const slug = String(req.params.slug);

  try {
    const doc = await Content.findOne({ slug });
    if (doc) {
      res.json({ success: true, data: doc });
      return;
    }
  } catch (e) {
    // fallback
  }

  const found = inMemoryContent[slug] || inMemoryContent['our-story'];
  res.json({ success: true, data: found });
};

export const updateContent = async (req: Request, res: Response): Promise<void> => {
  const slug = String(req.params.slug);
  const updateData = req.body;

  try {
    const doc = await Content.findOneAndUpdate(
      { slug },
      { ...updateData, slug, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    if (doc) {
      res.json({ success: true, data: doc, message: 'Content updated successfully' });
      return;
    }
  } catch (e) {
    // fallback
  }

  inMemoryContent[slug] = {
    ...(inMemoryContent[slug] || {}),
    ...updateData,
    slug,
    updatedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    data: inMemoryContent[slug],
    message: 'Content updated successfully',
  });
};
