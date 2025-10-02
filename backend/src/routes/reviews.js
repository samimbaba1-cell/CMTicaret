const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews
// @desc    Get reviews for a product
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { productId, page = 1, limit = 10, rating } = req.query;
    
    if (!productId) {
      return res.status(400).json({
        error: 'Ürün ID gerekli'
      });
    }

    const filter = { 
      product: productId, 
      isActive: true 
    };
    
    if (rating) {
      filter.rating = parseInt(rating);
    }

    const reviews = await Review.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Review.countDocuments(filter);

    // Get rating distribution
    const ratingStats = await Review.aggregate([
      { $match: { product: productId, isActive: true } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      ratingStats
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      error: 'Sunucu hatası'
    });
  }
});

// @route   POST /api/reviews
// @desc    Create review
// @access  Private
router.post('/', auth, [
  body('productId').isMongoId().withMessage('Geçerli ürün ID gerekli'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Puan 1-5 arası olmalı'),
  body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Yorum 10-1000 karakter arası olmalı'),
  body('title').optional().trim().isLength({ max: 100 }).withMessage('Başlık 100 karakterden fazla olamaz')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { productId, rating, comment, title, images } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        error: 'Ürün bulunamadı'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user.userId,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({
        error: 'Bu ürün için zaten yorum yaptınız'
      });
    }

    // Create review
    const review = new Review({
      user: req.user.userId,
      product: productId,
      rating,
      comment,
      title,
      images: images || []
    });

    await review.save();
    await review.populate('user', 'name email');

    res.status(201).json({
      message: 'Yorum başarıyla eklendi',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      error: 'Sunucu hatası'
    });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', auth, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Puan 1-5 arası olmalı'),
  body('comment').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Yorum 10-1000 karakter arası olmalı'),
  body('title').optional().trim().isLength({ max: 100 }).withMessage('Başlık 100 karakterden fazla olamaz')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!review) {
      return res.status(404).json({
        error: 'Yorum bulunamadı'
      });
    }

    const { rating, comment, title, images } = req.body;
    const updateData = {};

    if (rating) updateData.rating = rating;
    if (comment) updateData.comment = comment;
    if (title !== undefined) updateData.title = title;
    if (images) updateData.images = images;

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.json({
      message: 'Yorum başarıyla güncellendi',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      error: 'Sunucu hatası'
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!review) {
      return res.status(404).json({
        error: 'Yorum bulunamadı'
      });
    }

    res.json({
      message: 'Yorum başarıyla silindi'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      error: 'Sunucu hatası'
    });
  }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        error: 'Yorum bulunamadı'
      });
    }

    res.json({
      message: 'Yorum yardımcı olarak işaretlendi',
      helpful: review.helpful
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      error: 'Sunucu hatası'
    });
  }
});

module.exports = router;
