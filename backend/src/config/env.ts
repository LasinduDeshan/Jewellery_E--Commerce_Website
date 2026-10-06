import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/jewellery_store',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_key_change_in_production',
  founderEmail: process.env.FOUNDER_EMAIL || 'concierge@ceylonjewels.com',
};
