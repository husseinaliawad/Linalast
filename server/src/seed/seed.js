require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Post = require('../models/Post');
const Review = require('../models/Review');
const Product = require('../models/Product');

const seed = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);

    await Promise.all([
      User.deleteMany(),
      Post.deleteMany(),
      Review.deleteMany(),
      Product.deleteMany(),
    ]);

    const password = await bcrypt.hash('password123', 10);

    const [admin, lina, omar, rana] = await User.insertMany([
      {
        username: 'admin',
        email: 'admin@bookit.local',
        password,
        role: 'admin',
        bio: 'Bookit admin and community moderator.',
        avatar: 'https://i.pravatar.cc/150?img=12',
      },
      {
        username: 'lina_reader',
        email: 'lina@bookit.local',
        password,
        bio: 'Syrian literature lover and reviewer.',
        avatar: 'https://i.pravatar.cc/150?img=32',
      },
      {
        username: 'omar_writer',
        email: 'omar@bookit.local',
        password,
        bio: 'Poet, translator, and cultural curator.',
        avatar: 'https://i.pravatar.cc/150?img=22',
      },
      {
        username: 'rana_books',
        email: 'rana@bookit.local',
        password,
        bio: 'Stationery collector and market seller.',
        avatar: 'https://i.pravatar.cc/150?img=45',
      },
    ]);

    const posts = await Post.insertMany([
      {
        author: lina._id,
        content: 'Just finished a re-read of Al-Khubz Al-Hafi. Powerful and raw.',
        images: [],
      },
      {
        author: omar._id,
        content: 'Weekly writing prompt: describe a city with one sensory detail per line.',
        images: [],
      },
    ]);

    await Review.insertMany([
      {
        author: lina._id,
        bookTitle: 'Season of Migration to the North',
        bookAuthor: 'Tayeb Salih',
        rating: 5,
        content: 'A masterclass in duality, exile, and identity. The language is poetic yet brutal.',
      },
      {
        author: omar._id,
        bookTitle: 'The Yacoubian Building',
        bookAuthor: 'Alaa Al Aswany',
        rating: 4,
        content: 'A vibrant portrait of Cairo with layered characters and moral complexity.',
      },
    ]);

    await Product.insertMany([
      {
        seller: rana._id,
        title: 'Handmade Damascus Notebook',
        description: 'A5 notebook with traditional marbling and recycled paper.',
        price: 12,
        category: 'notebook',
        stock: 15,
        images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'],
      },
      {
        seller: omar._id,
        title: 'Arabic Calligraphy Bookmark Set',
        description: 'Set of 5 laminated bookmarks with classic calligraphy styles.',
        price: 8,
        category: 'accessories',
        stock: 30,
        images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80'],
      },
    ]);

    // eslint-disable-next-line no-console
    console.log('Seed data created');
    await mongoose.connection.close();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Seed error', error);
    process.exit(1);
  }
};

seed();
