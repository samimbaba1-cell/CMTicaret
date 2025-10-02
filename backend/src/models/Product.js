const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ürün adı gerekli'],
    trim: true,
    maxlength: [200, 'Ürün adı 200 karakterden fazla olamaz']
  },
  description: {
    type: String,
    required: [true, 'Ürün açıklaması gerekli'],
    maxlength: [2000, 'Açıklama 2000 karakterden fazla olamaz']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Kısa açıklama 500 karakterden fazla olamaz']
  },
  price: {
    type: Number,
    required: [true, 'Fiyat gerekli'],
    min: [0, 'Fiyat negatif olamaz']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Orijinal fiyat negatif olamaz']
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Kategori gerekli']
  },
  stock: {
    type: Number,
    required: [true, 'Stok miktarı gerekli'],
    min: [0, 'Stok negatif olamaz'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  weight: {
    type: Number,
    min: [0, 'Ağırlık negatif olamaz']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Puan 0\'dan küçük olamaz'],
      max: [5, 'Puan 5\'ten büyük olamaz']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Puan sayısı negatif olamaz']
    }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta başlık 60 karakterden fazla olamaz']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta açıklama 160 karakterden fazla olamaz']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  attributes: [{
    name: String,
    value: String
  }],
  variants: [{
    name: String,
    options: [String],
    price: Number,
    stock: Number
  }]
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for isInStock
productSchema.virtual('isInStock').get(function() {
  return this.stock > 0;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
