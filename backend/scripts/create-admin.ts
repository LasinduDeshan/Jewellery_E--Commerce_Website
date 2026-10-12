import mongoose from 'mongoose';
import { User } from '../src/models/User.js';
import { config } from '../src/config/env.js';

const createAdmin = async () => {
  try {
    await mongoose.connect(config.mongoUri);

    console.log('Connected to MongoDB');

    const email = process.env.FOUNDER_EMAIL;

    if (!email) {
      throw new Error('FOUNDER_EMAIL is not configured');
    }

    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
      throw new Error('ADMIN_PASSWORD is not configured');
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log(`Admin account already exists: ${email}`);
        return;
      }

      existingUser.role = 'admin';
      await existingUser.save();

      console.log(`Existing user promoted to admin: ${email}`);
      return;
    }

    const admin = await User.create({
      name: 'Store Administrator',
      email: email.toLowerCase(),
      password,
      role: 'admin',
      preferredCurrency: 'AUD',
    });

    console.log(`Admin account created: ${admin.email}`);
  } catch (error) {
    console.error('Failed to create admin:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();