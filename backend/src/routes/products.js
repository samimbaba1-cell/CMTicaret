const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with pagination and filters
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Sayfa numarası pozitif olmalı'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit 1-100 arası olmalı'),
  query('category').optional().isMongoId().withMessage('Geçersiz kategori ID'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min fiyat negatif olamaz'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max fiyat negatif olamaz'),
  query('sortBy').optional().isIn(['name', 'price', 'createdAt', 'rating']).withMessage('Geçersiz sıralama'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Geçersiz sıralama yönü'),
  query('inStock').optional().isBoolean().withMessage('inStock boolean olmalı')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      inStock,
      search
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get products with pagination
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.json({
      items: products,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      error: 'Sunucu hatası'
    });
  }
});

// @route   GET /api/products/search
// @desc    Search products
// @access  Public
router.get('/search', [
  query('q').notEmpty().withMessage('Arama terimi gerekli'),
  query('page').optional().isInt({ min: 1 }).withMessage('Sayfa numarası pozitif olmalı'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit 1-100 arası olmalı')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { q, page = 1, limit = 12, category, minPrice, maxPrice, sortBy = 'relevance' } = req.query;

    // Build search filter
    const filter = {
      isActive: true,
      $text: { $search: q }
    };

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort
    let sort = {};
    if (sortBy === 'relevance') {
      sort = { score: { $meta: 'textScore' } };
    } else if (sortBy === 'priceAsc') {
      sort = { price: 1 };
    } else if (sortBy === 'priceDesc') {
      sort = { price: -1 };
    } else if (sortBy === 'newest') {
      sort = { createdAt: -1 };
    } else if (sortBy === 'rating') {
      sort = { 'rating.average': -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(filter);

    res.json({
      items: products,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      error: 'Sunucu hatası'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('reviews')
      .lean();

    if (!product) {
      return res.status(404).json({
        error: 'Ürün bulunamadı'
      });
    }

    if (!product.isActive) {
      return res.status(404).json({
        error: 'Ürün bulunamadı'
      });
    }

    // Get related products
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true
    })
      .limit(4)
      .populate('category', 'name slug')
      .lean();

    res.json({
      product,
      relatedProducts
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      error: 'Sunucu hatası'
    });
  }
});

// @route   POST /api/products
// @desc    Create product
// @access  Private (Admin)
router.post('/', auth, adminAuth, [
  body('name').trim().isLength({ min: 1, max: 200 }).withMessage('Ürün adı 1-200 karakter arası olmalı'),
  body('description').trim().isLength({ min: 1, max: 2000 }).withMessage('Açıklama 1-2000 karakter arası olmalı'),
  body('price').isFloat({ min: 0 }).withMessage('Fiyat negatif olamaz'),
  body('category').isMongoId().withMessage('Geçerli kategori ID gerekli'),
  body('stock').isInt({ min: 0 }).withMessage('Stok negatif olamaz'),
  body('images').isArray({ min: 1 }).withMessage('En az 1 resim gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const product = new Product(req.body);
    await product.save();

    await product.populate('category', 'name slug');

    res.status(201).json({
      message: 'Ürün başarıyla oluşturuldu',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      error: 'Sunucu hatası'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        error: 'Ürün bulunamadı'
      });
    }

    res.json({
      message: 'Ürün başarıyla güncellendi',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      error: 'Sunucu hatası'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Admin)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Ürün bulunamadı'
      });
    }

    res.json({
      message: 'Ürün başarıyla silindi'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      error: 'Sunucu hatası'
    });
  }
});

module.exports = router;
