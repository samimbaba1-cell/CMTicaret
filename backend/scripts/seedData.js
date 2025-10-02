const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Sample categories
const categories = [
  { name: 'Elektronik', description: 'Telefon, laptop, tablet ve diğer elektronik ürünler' },
  { name: 'Giyim', description: 'Erkek, kadın ve çocuk giyim ürünleri' },
  { name: 'Ev & Yaşam', description: 'Ev dekorasyonu ve yaşam ürünleri' },
  { name: 'Spor', description: 'Spor malzemeleri ve fitness ürünleri' },
  { name: 'Kitap', description: 'Kitaplar ve dergiler' },
  { name: 'Kozmetik', description: 'Güzellik ve bakım ürünleri' },
  { name: 'Oyuncak', description: 'Çocuk oyuncakları ve oyunlar' },
  { name: 'Otomotiv', description: 'Araç aksesuarları ve yedek parçalar' }
];

// Sample products
const products = [
  {
    name: 'iPhone 15 Pro Max',
    description: 'En yeni iPhone modeli. A17 Pro çip, 48MP kamera ve Titanium tasarım.',
    price: 89999,
    stock: 25,
    minStock: 5,
    category: 'Elektronik',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop'
    ]
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'S Pen ile gelen yaratıcılık. 200MP kamera ve AI özellikleri.',
    price: 79999,
    stock: 30,
    minStock: 5,
    category: 'Elektronik',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop'
    ]
  },
  {
    name: 'MacBook Pro 16"',
    description: 'M3 Pro çip ile güçlü performans. 16GB RAM ve 512GB SSD.',
    price: 129999,
    stock: 15,
    minStock: 3,
    category: 'Elektronik',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop'
    ]
  },
  {
    name: 'Nike Air Max 270',
    description: 'Rahat ve şık spor ayakkabı. Günlük kullanım için ideal.',
    price: 2499,
    stock: 50,
    minStock: 10,
    category: 'Spor',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop'
    ]
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'Koşu için tasarlanmış premium spor ayakkabı.',
    price: 2999,
    stock: 40,
    minStock: 8,
    category: 'Spor',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop'
    ]
  },
  {
    name: 'Levi\'s 501 Jean',
    description: 'Klasik straight fit jean. %100 pamuk, yıkanmış görünüm.',
    price: 899,
    stock: 60,
    minStock: 15,
    category: 'Giyim',
    images: [
      'https://images.unsplash.com/photo-1541099649105-fbedadc6e6e0?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500&h=500&fit=crop'
    ]
  },
  {
    name: 'Zara Oversized T-Shirt',
    description: 'Rahat kesim pamuklu t-shirt. Çok renk seçeneği.',
    price: 299,
    stock: 100,
    minStock: 20,
    category: 'Giyim',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1503341504253-dff443548d0e?w=500&h=500&fit=crop'
    ]
  },
  {
    name: 'IKEA Kallax Raf',
    description: '4x4 modüler raf sistemi. Beyaz renk, kolay montaj.',
    price: 1299,
    stock: 20,
    minStock: 5,
    category: 'Ev & Yaşam',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop'
    ]
  },
  {
    name: 'Philips Hue Starter Kit',
    description: 'Akıllı LED ampul seti. Uygulama ile kontrol edilebilir.',
    price: 1999,
    stock: 35,
    minStock: 8,
    category: 'Ev & Yaşam',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop'
    ]
  },
  {
    name: 'Harry Potter Serisi',
    description: '7 kitaptan oluşan tam set. Ciltli özel baskı.',
    price: 599,
    stock: 45,
    minStock: 10,
    category: 'Kitap',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop'
    ]
  },
  {
    name: 'Lego Creator Set',
    description: '3-in-1 yaratıcılık seti. 3 farklı model yapılabilir.',
    price: 899,
    stock: 30,
    minStock: 8,
    category: 'Oyuncak',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop'
    ]
  },
  {
    name: 'L\'Oreal Revitalift Krem',
    description: 'Anti-aging yüz kremi. 50ml, hassas ciltler için uygun.',
    price: 199,
    stock: 80,
    minStock: 20,
    category: 'Kozmetik',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500&h=500&fit=crop'
    ]
  }
];

// Sample admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@cmticaret.com',
  password: 'admin123',
  phone: '5551234567',
  isAdmin: true
};

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cmtc');
    console.log('MongoDB connected');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    console.log('Existing data cleared');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories created`);

    // Create category map
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Update products with category IDs
    const productsWithCategories = products.map(product => ({
      ...product,
      category: categoryMap[product.category]
    }));

    // Create products
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`${createdProducts.length} products created`);

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    const admin = new User({
      ...adminUser,
      password: hashedPassword
    });
    await admin.save();
    console.log('Admin user created');

    console.log('Seed data created successfully!');
    console.log('Admin login: admin@cmticaret.com / admin123');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
