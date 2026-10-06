import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async (): Promise<void> => {
  if (!config.mongoUri || config.mongoUri.includes('<db_password>')) {
    console.warn('\n⚠️ [Database Notice] MongoDB password placeholder <db_password> detected in .env.');
    console.warn('👉 Please replace <db_password> with your MongoDB Atlas database user password in backend/.env');
    console.warn('⚡ Running backend in in-memory storage fallback mode.\n');
    return;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`\n💎 [Database] MongoDB Atlas Connected successfully: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}\n`);
  } catch (error: any) {
    console.error(`\n❌ [Database Connection Error]:`, error.message);
    console.warn('⚡ Running backend in in-memory storage fallback mode.\n');
  }
};
