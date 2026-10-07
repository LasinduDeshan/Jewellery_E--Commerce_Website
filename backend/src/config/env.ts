import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/jewellery_store',
  jwtSecret: process.env.JWT_SECRET || 'jewellery_secret_jwt_key_2026_ceylon',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  founderEmail: process.env.FOUNDER_EMAIL || 'concierge@ceylonjewels.com',
};
