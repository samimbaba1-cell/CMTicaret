const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// In-memory storage for demo (in real app, use database)
let seoSettings = {
  siteTitle: "CM Ticaret - Kaliteli Ürünler, Güvenilir Hizmet",
  siteDescription: "CM Ticaret ile kaliteli ürünleri uygun fiyatlarla keşfedin. Hızlı teslimat, güvenli ödeme ve müşteri memnuniyeti garantisi.",
  keywords: "e-ticaret, online alışveriş, kaliteli ürünler, güvenli ödeme, hızlı teslimat",
  ogTitle: "CM Ticaret - Online Alışveriş",
  ogDescription: "Kaliteli ürünleri uygun fiyatlarla keşfedin. Hızlı teslimat ve güvenli ödeme garantisi.",
  ogImage: "",
  twitterCard: "summary_large_image",
  twitterSite: "@cmticaret",
  twitterCreator: "@cmticaret",
  robots: "index, follow",
  canonicalUrl: "",
  sitemapUrl: "/sitemap.xml",
  googleAnalytics: "",
  googleSearchConsole: "",
  facebookPixel: "",
  customHead: "",
  customFooter: ""
};

// GET SEO settings
router.get('/', async (req, res) => {
  try {
    res.json(seoSettings);
  } catch (error) {
    console.error('SEO get error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// POST SEO settings
router.post('/', async (req, res) => {
  try {
    const {
      siteTitle,
      siteDescription,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      twitterCard,
      twitterSite,
      twitterCreator,
      robots,
      canonicalUrl,
      sitemapUrl,
      googleAnalytics,
      googleSearchConsole,
      facebookPixel,
      customHead,
      customFooter
    } = req.body;

    // Validate required fields
    if (!siteTitle || !siteDescription) {
      return res.status(400).json({ error: 'Site başlığı ve açıklaması gereklidir' });
    }

    // Update settings
    seoSettings = {
      siteTitle,
      siteDescription,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      twitterCard,
      twitterSite,
      twitterCreator,
      robots,
      canonicalUrl,
      sitemapUrl,
      googleAnalytics,
      googleSearchConsole,
      facebookPixel,
      customHead,
      customFooter,
      updatedAt: new Date()
    };

    res.json({ 
      message: 'SEO ayarları başarıyla kaydedildi',
      data: seoSettings 
    });
  } catch (error) {
    console.error('SEO save error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// GET sitemap status
router.get('/sitemap-status', async (req, res) => {
  try {
    // Check if sitemap exists
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    
    try {
      const stats = await fs.stat(sitemapPath);
      res.json({
        status: 'active',
        lastGenerated: stats.mtime,
        totalPages: 0, // In real app, count from database
        sitemapUrl: '/sitemap.xml'
      });
    } catch (error) {
      res.json({
        status: 'not_found',
        lastGenerated: null,
        totalPages: 0,
        sitemapUrl: '/sitemap.xml'
      });
    }
  } catch (error) {
    console.error('Sitemap status error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// POST generate sitemap
router.post('/generate-sitemap', async (req, res) => {
  try {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    
    // Basic sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${seoSettings.canonicalUrl || 'http://localhost:3001'}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${seoSettings.canonicalUrl || 'http://localhost:3001'}/products</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${seoSettings.canonicalUrl || 'http://localhost:3001'}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${seoSettings.canonicalUrl || 'http://localhost:3001'}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

    await fs.writeFile(sitemapPath, sitemap, 'utf8');

    res.json({ 
      message: 'Sitemap başarıyla oluşturuldu',
      sitemapUrl: '/sitemap.xml',
      totalPages: 4
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Sitemap oluşturma hatası' });
  }
});

// GET robots.txt
router.get('/robots', async (req, res) => {
  try {
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${seoSettings.canonicalUrl || 'http://localhost:3001'}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /uploads/`;

    res.set('Content-Type', 'text/plain');
    res.send(robotsTxt);
  } catch (error) {
    console.error('Robots.txt error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
