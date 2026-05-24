import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Settings from '../models/Settings.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define MONGODB_URI in .env.local");
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Settings.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin User
    const adminPassword = await bcrypt.hash('Admin@1234', 12);
    await User.create({
      name: 'Admin',
      email: 'admin@premiums.edu',
      password: adminPassword,
      role: 'admin',
    });
    console.log('Admin user created');

    // Create Regular User
    const userPassword = await bcrypt.hash('User@1234', 12);
    await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
    });
    console.log('Regular user created');

    // Create Products
    await Product.create([
      {
        title: 'Mix Domain Old Edu',
        price: 0.7,
        minOrder: 20,
        stock: 537,
        format: 'email:password',
        access: 'All Access',
        badge: 'Mix Domain',
        instantDelivery: true,
        policy: 'Replacement Warranty',
      },
      {
        title: 'Single Domain Edu',
        price: 0.35,
        minOrder: 20,
        stock: 44980,
        format: 'email:password',
        access: 'All Access',
        badge: 'Single Domain',
        instantDelivery: true,
        policy: 'Replacement Warranty',
      },
      {
        title: 'Premium Aged Edu (10+ Years)',
        price: 0.9,
        minOrder: 20,
        stock: 350,
        format: 'email:password',
        access: 'All Access',
        badge: 'Premium Aged',
        instantDelivery: true,
        policy: 'Replacement Warranty',
      },
    ]);
    console.log('Products created');

    // Create Settings
    await Settings.create({
      paymentMethods: [
        {
          name: 'Crypto (USDT/Binance)',
          key: 'crypto',
          isActive: true,
          details: [
            { label: 'USDT TRC20', value: 'TDkzJiBjjZRtfUood3zoW3G2v4DEff WXJ' },
            { label: 'Binance Pay ID', value: '516862248' },
            { label: 'Name', value: 'Young IT Solution' },
          ],
        },
        {
          name: 'bKash',
          key: 'bkash',
          isActive: true,
          details: [
            { label: 'bKash Personal', value: '01680142318' },
          ],
        },
        {
          name: 'Nagad',
          key: 'nagad',
          isActive: true,
          details: [
            { label: 'Nagad Personal', value: '01680142318' },
          ],
        },
        {
          name: 'Rocket',
          key: 'rocket',
          isActive: true,
          details: [
            { label: 'Rocket Personal', value: '01680142318' },
          ],
        },
      ],
    });
    console.log('Settings created');

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();
