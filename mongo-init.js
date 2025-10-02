// MongoDB initialization script
db = db.getSiblingDB('cmtc');

// Create collections
db.createCollection('users');
db.createCollection('products');
db.createCollection('categories');
db.createCollection('orders');
db.createCollection('reviews');
db.createCollection('coupons');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.products.createIndex({ "name": "text", "description": "text" });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "price": 1 });
db.products.createIndex({ "barcode": 1 }, { unique: true, sparse: true });
db.orders.createIndex({ "user": 1 });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "createdAt": -1 });
db.reviews.createIndex({ "product": 1 });
db.reviews.createIndex({ "user": 1 });
db.coupons.createIndex({ "code": 1 }, { unique: true });

// Insert sample data
db.categories.insertMany([
  { name: "Elektronik", description: "Elektronik ürünler" },
  { name: "Giyim", description: "Giyim ürünleri" },
  { name: "Ev & Yaşam", description: "Ev ve yaşam ürünleri" },
  { name: "Spor", description: "Spor ürünleri" },
  { name: "Kitap", description: "Kitap ve dergiler" }
]);

print('Database initialized successfully!');
