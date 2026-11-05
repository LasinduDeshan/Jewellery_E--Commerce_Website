import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

// Load environment variables from .env
dotenv.config();

async function seedSuperAdmin() {
  console.log('\n🔒 --- Zeyloraa Fine Jewellery Store: Super Admin Provisioning Script ---');

  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD?.trim();
  const name = process.env.SUPER_ADMIN_NAME?.trim() || 'Zeyloraa Super Admin';

  if (!email || !password) {
    console.error('\n❌ [Configuration Error]: Missing required environment variables.');
    console.error('Please define the following in your environment or backend/.env file:');
    console.error('  • SUPER_ADMIN_EMAIL="admin@zeyloraa.com"');
    console.error('  • SUPER_ADMIN_PASSWORD="YourSecurePassword"');
    console.error('  • SUPER_ADMIN_NAME="Atelier Founder" (optional)\n');
    console.error('⚠️  Never commit real production passwords to git/GitHub.\n');
    process.exit(1);
  }

  const mongoUri =
    process.env.MONGODB_URI ||
    'mongodb://localhost:27017/jewellery_store';

  try {
    console.log('Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // 1. Check whether an account with this email already exists
    const existingUser = await User.findOne({ email });
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (existingUser) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.role = 'super_admin';
      existingUser.needsPasswordChange = false;
      await existingUser.save();

      console.log('\n============================================================');
      console.log('✅ [Security] Existing account updated to SUPER_ADMIN!');
      console.log(`• ID:                     ${existingUser._id}`);
      console.log(`• Name:                   ${existingUser.name}`);
      console.log(`• Email:                  ${existingUser.email}`);
      console.log(`• Role:                   SUPER_ADMIN`);
      console.log(`• Password:               [REDACTED / NEVER LOGGED]`);
      console.log('============================================================\n');

      await mongoose.disconnect();
      process.exit(0);
    }

    // 2. Create the account with bcrypt hashing & SUPER_ADMIN role
    const newSuperAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'super_admin',
      needsPasswordChange: false,
      preferredCurrency: 'AUD',
      twoFactorEnabled: false,
    });

    await newSuperAdmin.save({ validateBeforeSave: true });

    console.log('\n============================================================');
    console.log('🎉 [Success] Super Admin account created successfully!');
    console.log(`• ID:                     ${newSuperAdmin._id}`);
    console.log(`• Name:                   ${newSuperAdmin.name}`);
    console.log(`• Email:                  ${newSuperAdmin.email}`);
    console.log(`• Role:                   SUPER_ADMIN`);
    console.log(`• Password:               [REDACTED / NEVER LOGGED]`);
    console.log('============================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ [Error seeding Super Admin]:', error);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
}

seedSuperAdmin();
