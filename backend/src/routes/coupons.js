const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Erişim reddedildi. Yalnızca adminler bu işlemi yapabilir.' });
  }
};

// Get all coupons
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    // In a real application, you would fetch from database
    // For now, return mock data
    const coupons = [
      {
        id: 1,
        code: 'WELCOME10',
        name: 'Hoş Geldin İndirimi',
        description: 'Yeni müşteriler için %10 indirim',
        type: 'percentage',
        value: 10,
        minOrderAmount: 100,
        maxDiscountAmount: 50,
        usageLimit: 100,
        usedCount: 25,
        isActive: true,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        applicableProducts: [],
        applicableCategories: [],
        customerGroups: 'new_customers',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z'
      },
      {
        id: 2,
        code: 'SAVE50',
        name: '50 TL İndirim',
        description: '200 TL ve üzeri alışverişlerde 50 TL indirim',
        type: 'fixed',
        value: 50,
        minOrderAmount: 200,
        maxDiscountAmount: 50,
        usageLimit: 50,
        usedCount: 12,
        isActive: true,
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        applicableProducts: [],
        applicableCategories: [],
        customerGroups: 'all',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    ];
    
    res.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Get a single coupon by ID
router.get('/:id', auth, isAdmin, async (req, res) => {
  try {
    const couponId = parseInt(req.params.id);
    // In a real application, you would fetch from database
    const coupon = {
      id: couponId,
      code: 'WELCOME10',
      name: 'Hoş Geldin İndirimi',
      description: 'Yeni müşteriler için %10 indirim',
      type: 'percentage',
      value: 10,
      minOrderAmount: 100,
      maxDiscountAmount: 50,
      usageLimit: 100,
      usedCount: 25,
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      applicableProducts: [],
      applicableCategories: [],
      customerGroups: 'new_customers',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z'
    };
    
    if (!coupon) {
      return res.status(404).json({ error: 'Kupon bulunamadı' });
    }
    
    res.json(coupon);
  } catch (error) {
    console.error('Error fetching coupon:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Create a new coupon
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const {
      code,
      name,
      description,
      type,
      value,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      isActive,
      startDate,
      endDate,
      applicableProducts,
      applicableCategories,
      customerGroups
    } = req.body;

    // Validate required fields
    if (!code || !name || !type || value === undefined) {
      return res.status(400).json({ error: 'Gerekli alanlar eksik' });
    }

    // In a real application, you would save to database
    const newCoupon = {
      id: Date.now(),
      code: code.toUpperCase(),
      name,
      description: description || '',
      type,
      value: parseFloat(value),
      minOrderAmount: parseFloat(minOrderAmount) || 0,
      maxDiscountAmount: parseFloat(maxDiscountAmount) || 0,
      usageLimit: parseInt(usageLimit) || 0,
      usedCount: 0,
      isActive: Boolean(isActive),
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      applicableProducts: applicableProducts || [],
      applicableCategories: applicableCategories || [],
      customerGroups: customerGroups || 'all',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.status(201).json(newCoupon);
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Update a coupon
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const couponId = parseInt(req.params.id);
    const updateData = req.body;

    // In a real application, you would update in database
    const updatedCoupon = {
      id: couponId,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    res.json(updatedCoupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Delete a coupon
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const couponId = parseInt(req.params.id);
    
    // In a real application, you would delete from database
    res.json({ message: 'Kupon başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Validate coupon code (for frontend use)
router.post('/validate', async (req, res) => {
  try {
    const { code, orderAmount, customerId } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Kupon kodu gerekli' });
    }

    // In a real application, you would validate against database
    // For demo purposes, return mock validation
    const mockCoupon = {
      id: 1,
      code: code.toUpperCase(),
      name: 'Hoş Geldin İndirimi',
      type: 'percentage',
      value: 10,
      minOrderAmount: 100,
      maxDiscountAmount: 50,
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      customerGroups: 'all'
    };

    // Check if coupon exists and is valid
    if (code.toUpperCase() !== 'WELCOME10') {
      return res.status(404).json({ error: 'Geçersiz kupon kodu' });
    }

    // Check if coupon is active
    if (!mockCoupon.isActive) {
      return res.status(400).json({ error: 'Kupon aktif değil' });
    }

    // Check date validity
    const now = new Date();
    const startDate = new Date(mockCoupon.startDate);
    const endDate = new Date(mockCoupon.endDate);

    if (now < startDate || now > endDate) {
      return res.status(400).json({ error: 'Kupon süresi dolmuş' });
    }

    // Check minimum order amount
    if (orderAmount && orderAmount < mockCoupon.minOrderAmount) {
      return res.status(400).json({ 
        error: `Minimum sipariş tutarı ${mockCoupon.minOrderAmount} TL olmalıdır` 
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (mockCoupon.type === 'percentage') {
      discountAmount = (orderAmount * mockCoupon.value) / 100;
      if (mockCoupon.maxDiscountAmount > 0) {
        discountAmount = Math.min(discountAmount, mockCoupon.maxDiscountAmount);
      }
    } else if (mockCoupon.type === 'fixed') {
      discountAmount = mockCoupon.value;
    }

    res.json({
      valid: true,
      coupon: mockCoupon,
      discountAmount: Math.round(discountAmount * 100) / 100
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
