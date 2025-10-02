const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Mock banner data (in production, this would be stored in database)
let banners = [
  {
    id: 1,
    title: "Yaz Kampanyası",
    subtitle: "Tüm ürünlerde %50'ye varan indirimler",
    description: "Yaz sezonu için özel indirimler! Tüm kategorilerde büyük fırsatlar.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
    mobileImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop",
    link: "/kampanya",
    buttonText: "Kampanyaları Gör",
    type: "hero",
    position: "top",
    isActive: true,
    order: 1,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    targetAudience: "all",
    backgroundColor: "#3B82F6",
    textColor: "#FFFFFF",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    title: "Yeni Ürünler",
    subtitle: "En son çıkan ürünleri keşfedin",
    description: "Teknoloji dünyasından en yeni ürünler burada!",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=400&fit=crop",
    mobileImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop",
    link: "/yeni-urunler",
    buttonText: "Yeni Ürünler",
    type: "promotion",
    position: "middle",
    isActive: true,
    order: 2,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    targetAudience: "all",
    backgroundColor: "#10B981",
    textColor: "#FFFFFF",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Get all banners (public endpoint for frontend display)
router.get('/', (req, res) => {
  try {
    const { type, position, isActive } = req.query;
    let filteredBanners = [...banners];

    // Filter by type
    if (type) {
      filteredBanners = filteredBanners.filter(banner => banner.type === type);
    }

    // Filter by position
    if (position) {
      filteredBanners = filteredBanners.filter(banner => banner.position === position);
    }

    // Filter by active status
    if (isActive !== undefined) {
      const active = isActive === 'true';
      filteredBanners = filteredBanners.filter(banner => banner.isActive === active);
    }

    // Sort by order
    filteredBanners.sort((a, b) => a.order - b.order);

    res.json(filteredBanners);
  } catch (error) {
    console.error('Banners fetch error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Get all banners for admin (with auth)
router.get('/admin', auth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Erişim reddedildi. Yalnızca adminler bu işlemi yapabilir.' });
  }

  try {
    // Sort by order
    const sortedBanners = [...banners].sort((a, b) => a.order - b.order);
    res.json(sortedBanners);
  } catch (error) {
    console.error('Admin banners fetch error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Get single banner
router.get('/:id', (req, res) => {
  try {
    const banner = banners.find(b => b.id === parseInt(req.params.id));
    if (!banner) {
      return res.status(404).json({ error: 'Banner bulunamadı' });
    }
    res.json(banner);
  } catch (error) {
    console.error('Banner fetch error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Create new banner
router.post('/', auth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Erişim reddedildi. Yalnızca adminler bu işlemi yapabilir.' });
  }

  try {
    const {
      title,
      subtitle,
      description,
      image,
      mobileImage,
      link,
      buttonText,
      type,
      position,
      isActive,
      order,
      startDate,
      endDate,
      targetAudience,
      backgroundColor,
      textColor
    } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({ error: 'Banner başlığı gerekli' });
    }

    const newBanner = {
      id: Math.max(...banners.map(b => b.id), 0) + 1,
      title,
      subtitle: subtitle || '',
      description: description || '',
      image: image || '',
      mobileImage: mobileImage || '',
      link: link || '',
      buttonText: buttonText || 'Detay',
      type: type || 'hero',
      position: position || 'top',
      isActive: isActive !== undefined ? isActive : true,
      order: order || 1,
      startDate: startDate || '',
      endDate: endDate || '',
      targetAudience: targetAudience || 'all',
      backgroundColor: backgroundColor || '#3B82F6',
      textColor: textColor || '#FFFFFF',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    banners.push(newBanner);
    res.status(201).json(newBanner);
  } catch (error) {
    console.error('Banner create error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Update banner
router.put('/:id', auth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Erişim reddedildi. Yalnızca adminler bu işlemi yapabilir.' });
  }

  try {
    const bannerId = parseInt(req.params.id);
    const bannerIndex = banners.findIndex(b => b.id === bannerId);

    if (bannerIndex === -1) {
      return res.status(404).json({ error: 'Banner bulunamadı' });
    }

    const updatedBanner = {
      ...banners[bannerIndex],
      ...req.body,
      id: bannerId, // Ensure ID doesn't change
      updatedAt: new Date()
    };

    banners[bannerIndex] = updatedBanner;
    res.json(updatedBanner);
  } catch (error) {
    console.error('Banner update error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Delete banner
router.delete('/:id', auth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Erişim reddedildi. Yalnızca adminler bu işlemi yapabilir.' });
  }

  try {
    const bannerId = parseInt(req.params.id);
    const bannerIndex = banners.findIndex(b => b.id === bannerId);

    if (bannerIndex === -1) {
      return res.status(404).json({ error: 'Banner bulunamadı' });
    }

    banners.splice(bannerIndex, 1);
    res.json({ message: 'Banner başarıyla silindi' });
  } catch (error) {
    console.error('Banner delete error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Reorder banners
router.post('/reorder', auth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Erişim reddedildi. Yalnızca adminler bu işlemi yapabilir.' });
  }

  try {
    const { bannerOrders } = req.body; // Array of {id, order}

    if (!Array.isArray(bannerOrders)) {
      return res.status(400).json({ error: 'Geçersiz sıralama verisi' });
    }

    bannerOrders.forEach(({ id, order }) => {
      const banner = banners.find(b => b.id === id);
      if (banner) {
        banner.order = order;
        banner.updatedAt = new Date();
      }
    });

    res.json({ message: 'Banner sıralaması güncellendi' });
  } catch (error) {
    console.error('Banner reorder error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
