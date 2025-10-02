"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

export default function SEOPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [seo, setSeo] = useState({
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
  });

  const [sitemapStatus, setSitemapStatus] = useState({
    lastGenerated: null,
    totalPages: 0,
    status: 'unknown'
  });

  useEffect(() => {
    loadSEO();
    checkSitemapStatus();
  }, []);

  const loadSEO = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seo`);
      if (response.ok) {
        const data = await response.json();
        setSeo(data);
      }
    } catch (error) {
      console.error("SEO load error:", error);
    }
    setLoading(false);
  };

  const checkSitemapStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seo/sitemap-status`);
      if (response.ok) {
        const data = await response.json();
        setSitemapStatus(data);
      }
    } catch (error) {
      console.error("Sitemap status error:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seo),
      });

      if (response.ok) {
        showToast("SEO ayarları başarıyla kaydedildi!", "success");
      } else {
        showToast("Kaydetme hatası!", "error");
      }
    } catch (error) {
      console.error("Save error:", error);
      showToast("Kaydetme hatası!", "error");
    }
    setLoading(false);
  };

  const generateSitemap = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seo/generate-sitemap`, {
        method: 'POST',
      });

      if (response.ok) {
        showToast("Sitemap başarıyla oluşturuldu!", "success");
        checkSitemapStatus();
      } else {
        showToast("Sitemap oluşturma hatası!", "error");
      }
    } catch (error) {
      console.error("Sitemap generation error:", error);
      showToast("Sitemap oluşturma hatası!", "error");
    }
  };

  const testSEO = () => {
    // Simulate SEO test
    const issues = [];
    
    if (seo.siteTitle.length < 30) {
      issues.push("Site başlığı çok kısa (30+ karakter önerilir)");
    }
    if (seo.siteDescription.length < 120) {
      issues.push("Site açıklaması çok kısa (120+ karakter önerilir)");
    }
    if (!seo.keywords) {
      issues.push("Anahtar kelimeler eksik");
    }
    if (!seo.ogImage) {
      issues.push("Open Graph resmi eksik");
    }

    if (issues.length === 0) {
      showToast("SEO ayarları mükemmel! 🎉", "success");
    } else {
      showToast(`${issues.length} SEO sorunu bulundu`, "warning");
      console.log("SEO Issues:", issues);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <main className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Erişim Reddedildi</h1>
          <p className="text-gray-700">Bu sayfa yalnızca adminler içindir.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">SEO Yönetimi</h1>
        <p className="text-gray-600">Arama motoru optimizasyonu ve site görünürlüğü</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Temel SEO */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Temel SEO Ayarları</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Başlığı
                </label>
                <input
                  type="text"
                  value={seo.siteTitle}
                  onChange={(e) => setSeo(prev => ({ ...prev, siteTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Site başlığınız (50-60 karakter önerilir)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {seo.siteTitle.length}/60 karakter
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Açıklaması
                </label>
                <textarea
                  value={seo.siteDescription}
                  onChange={(e) => setSeo(prev => ({ ...prev, siteDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Site açıklamanız (150-160 karakter önerilir)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {seo.siteDescription.length}/160 karakter
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anahtar Kelimeler
                </label>
                <input
                  type="text"
                  value={seo.keywords}
                  onChange={(e) => setSeo(prev => ({ ...prev, keywords: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="anahtar, kelime, virgülle, ayrılmış"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Virgülle ayrılmış anahtar kelimeler
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={seo.canonicalUrl}
                  onChange={(e) => setSeo(prev => ({ ...prev, canonicalUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </Card>

          {/* Open Graph */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Open Graph (Sosyal Medya)</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG Başlık
                </label>
                <input
                  type="text"
                  value={seo.ogTitle}
                  onChange={(e) => setSeo(prev => ({ ...prev, ogTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG Açıklama
                </label>
                <textarea
                  value={seo.ogDescription}
                  onChange={(e) => setSeo(prev => ({ ...prev, ogDescription: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG Resim URL
                </label>
                <input
                  type="url"
                  value={seo.ogImage}
                  onChange={(e) => setSeo(prev => ({ ...prev, ogImage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/og-image.jpg"
                />
              </div>
            </div>
          </Card>

          {/* Twitter */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Twitter Cards</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter Card Tipi
                </label>
                <select
                  value={seo.twitterCard}
                  onChange={(e) => setSeo(prev => ({ ...prev, twitterCard: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter Site
                </label>
                <input
                  type="text"
                  value={seo.twitterSite}
                  onChange={(e) => setSeo(prev => ({ ...prev, twitterSite: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="@cmticaret"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter Creator
                </label>
                <input
                  type="text"
                  value={seo.twitterCreator}
                  onChange={(e) => setSeo(prev => ({ ...prev, twitterCreator: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="@cmticaret"
                />
              </div>
            </div>
          </Card>

          {/* Analytics */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Analytics & Tracking</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={seo.googleAnalytics}
                  onChange={(e) => setSeo(prev => ({ ...prev, googleAnalytics: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Search Console
                </label>
                <input
                  type="text"
                  value={seo.googleSearchConsole}
                  onChange={(e) => setSeo(prev => ({ ...prev, googleSearchConsole: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Verification code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook Pixel ID
                </label>
                <input
                  type="text"
                  value={seo.facebookPixel}
                  onChange={(e) => setSeo(prev => ({ ...prev, facebookPixel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123456789012345"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sitemap Status */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Sitemap Durumu</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Durum:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  sitemapStatus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {sitemapStatus.status === 'active' ? 'Aktif' : 'Bilinmiyor'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Toplam Sayfa:</span>
                <span className="font-medium">{sitemapStatus.totalPages}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Son Güncelleme:</span>
                <span className="text-sm">
                  {sitemapStatus.lastGenerated 
                    ? new Date(sitemapStatus.lastGenerated).toLocaleDateString('tr-TR')
                    : 'Bilinmiyor'
                  }
                </span>
              </div>

              <Button
                onClick={generateSitemap}
                className="w-full btn-primary"
              >
                Sitemap Oluştur
              </Button>
            </div>
          </Card>

          {/* SEO Test */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">SEO Test</h2>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                SEO ayarlarınızı test edin ve öneriler alın.
              </p>
              
              <Button
                onClick={testSEO}
                variant="secondary"
                className="w-full"
              >
                SEO Testi Çalıştır
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Hızlı İşlemler</h2>
            
            <div className="space-y-3">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => window.open('/robots.txt', '_blank')}
              >
                Robots.txt Görüntüle
              </Button>
              
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => window.open('/sitemap.xml', '_blank')}
              >
                Sitemap Görüntüle
              </Button>
              
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => window.open('https://search.google.com/test/rich-results', '_blank')}
              >
                Rich Results Test
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Kaydediliyor..." : "SEO Ayarlarını Kaydet"}
        </Button>
      </div>
    </main>
  );
}
