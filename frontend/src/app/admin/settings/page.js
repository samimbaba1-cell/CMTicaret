"use client";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { useState, useEffect, Suspense } from "react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

function SettingsPageContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: "CM Ticaret",
    siteDescription: "Kaliteli ürünler, uygun fiyatlar ve hızlı teslimat",
    siteLogo: "",
    contactEmail: "info@cmticaret.com",
    contactPhone: "+90 (212) 555-0123",
    address: "İstanbul, Türkiye",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: ""
    },
    seo: {
      metaTitle: "CM Ticaret - Online Alışveriş",
      metaDescription: "En kaliteli ürünleri uygun fiyatlarla bulun",
      keywords: "e-ticaret, online alışveriş, kaliteli ürünler"
    },
    features: {
      freeShipping: true,
      returnPolicy: true,
      customerSupport: true,
      securePayment: true
    },
    payment: {
      iyzicoApiKey: "",
      iyzicoSecretKey: "",
      iyzicoBaseUrl: "https://sandbox-api.iyzipay.com",
      enableIyzico: true,
      enableCashOnDelivery: true,
      enableBankTransfer: false
    },
    shipping: {
      freeShippingThreshold: 500,
      shippingCost: 25,
      enableFreeShipping: true,
      shippingCompanies: ["Aras Kargo", "Yurtiçi Kargo", "MNG Kargo"],
      defaultShippingCompany: "Aras Kargo",
      estimatedDeliveryDays: 3
    },
    email: {
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      enableSmtp: false,
      fromEmail: "noreply@cmticaret.com",
      fromName: "CM Ticaret"
    },
    notifications: {
      enableEmailNotifications: true,
      enableSmsNotifications: false,
      enablePushNotifications: true,
      orderConfirmationEmail: true,
      shippingUpdateEmail: true,
      lowStockAlert: true
    }
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('site-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save to localStorage for demo
    localStorage.setItem('site-settings', JSON.stringify(settings));
      
      // In production, save to API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        showToast('Ayarlar başarıyla kaydedildi!', 'success');
      } else {
        showToast('Ayarlar kaydedildi (yerel olarak)!', 'success');
      }
    } catch (error) {
      console.error('Settings save error:', error);
      showToast('Ayarlar kaydedildi (yerel olarak)!', 'success');
    }
    setLoading(false);
  };

  const handleReset = () => {
    setSettings({
      siteName: "CM Ticaret",
      siteDescription: "Kaliteli ürünler, uygun fiyatlar ve hızlı teslimat",
      siteLogo: "",
      contactEmail: "info@cmticaret.com",
      contactPhone: "+90 (212) 555-0123",
      address: "İstanbul, Türkiye",
      socialMedia: {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: ""
      },
      seo: {
        metaTitle: "CM Ticaret - Online Alışveriş",
        metaDescription: "En kaliteli ürünleri uygun fiyatlarla bulun",
        keywords: "e-ticaret, online alışveriş, kaliteli ürünler"
      },
      features: {
        freeShipping: true,
        returnPolicy: true,
        customerSupport: true,
        securePayment: true
      }
    });
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

  const tabs = [
    { id: 'general', name: 'Genel', icon: '⚙️' },
    { id: 'payment', name: 'Ödeme', icon: '💳' },
    { id: 'shipping', name: 'Kargo', icon: '🚚' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'notifications', name: 'Bildirimler', icon: '🔔' }
  ];

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Site Ayarları</h1>
        <p className="text-gray-600">Sitenizin tüm ayarlarını yönetin</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
        </div>

      <div className="space-y-6">
        {/* Genel Ayarlar */}
        {activeTab === 'general' && (
          <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Genel Ayarlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Adı</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                className="input-modern"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Açıklaması</label>
              <input
                type="text"
                value={settings.siteDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                className="input-modern"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
              <input
                type="url"
                value={settings.siteLogo}
                onChange={(e) => setSettings(prev => ({ ...prev, siteLogo: e.target.value }))}
                className="input-modern"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>
        </Card>

        {/* İletişim Bilgileri */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">İletişim Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="input-modern"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                className="input-modern"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
              <textarea
                value={settings.address}
                onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                className="input-modern"
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Sosyal Medya */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Sosyal Medya</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
              <input
                type="url"
                value={settings.socialMedia.facebook}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                }))}
                className="input-modern"
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
              <input
                type="url"
                value={settings.socialMedia.twitter}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                }))}
                className="input-modern"
                placeholder="https://twitter.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
              <input
                type="url"
                value={settings.socialMedia.instagram}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                }))}
                className="input-modern"
                placeholder="https://instagram.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
              <input
                type="url"
                value={settings.socialMedia.linkedin}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                }))}
                className="input-modern"
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
          </div>
        </Card>

        {/* SEO Ayarları */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">SEO Ayarları</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
              <input
                type="text"
                value={settings.seo.metaTitle}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  seo: { ...prev.seo, metaTitle: e.target.value }
                }))}
                className="input-modern"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
              <textarea
                value={settings.seo.metaDescription}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  seo: { ...prev.seo, metaDescription: e.target.value }
                }))}
                className="input-modern"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <input
                type="text"
                value={settings.seo.keywords}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  seo: { ...prev.seo, keywords: e.target.value }
                }))}
                className="input-modern"
                placeholder="e-ticaret, online alışveriş, kaliteli ürünler"
              />
            </div>
          </div>
        </Card>

        {/* Özellikler */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Site Özellikleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.features.freeShipping}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  features: { ...prev.features, freeShipping: e.target.checked }
                }))}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Ücretsiz Kargo</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.features.returnPolicy}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  features: { ...prev.features, returnPolicy: e.target.checked }
                }))}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">İade Politikası</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.features.customerSupport}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  features: { ...prev.features, customerSupport: e.target.checked }
                }))}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Müşteri Desteği</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.features.securePayment}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  features: { ...prev.features, securePayment: e.target.checked }
                }))}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Güvenli Ödeme</span>
            </label>
          </div>
        </Card>

            {/* Kaydet Butonları */}
            <div className="flex justify-end space-x-4">
              <Button onClick={handleReset} variant="secondary">
                Sıfırla
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </div>
        )}

        {/* Ödeme Ayarları */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Ödeme Ayarları</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Iyzico API Key</label>
                    <input
                      type="text"
                      value={settings.payment.iyzicoApiKey}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        payment: { ...prev.payment, iyzicoApiKey: e.target.value }
                      }))}
                      className="input-modern"
                      placeholder="sandbox-xxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Iyzico Secret Key</label>
                    <input
                      type="password"
                      value={settings.payment.iyzicoSecretKey}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        payment: { ...prev.payment, iyzicoSecretKey: e.target.value }
                      }))}
                      className="input-modern"
                      placeholder="sandbox-xxx"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Iyzico Base URL</label>
                  <select
                    value={settings.payment.iyzicoBaseUrl}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      payment: { ...prev.payment, iyzicoBaseUrl: e.target.value }
                    }))}
                    className="input-modern"
                  >
                    <option value="https://sandbox-api.iyzipay.com">Sandbox (Test)</option>
                    <option value="https://api.iyzipay.com">Production (Canlı)</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Ödeme Yöntemleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.payment.enableIyzico}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          payment: { ...prev.payment, enableIyzico: e.target.checked }
                        }))}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Kredi Kartı (Iyzico)</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.payment.enableCashOnDelivery}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          payment: { ...prev.payment, enableCashOnDelivery: e.target.checked }
                        }))}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Kapıda Ödeme</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.payment.enableBankTransfer}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          payment: { ...prev.payment, enableBankTransfer: e.target.checked }
                        }))}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Havale/EFT</span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Kargo Ayarları */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Kargo Ayarları</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ücretsiz Kargo Eşiği (TL)</label>
                    <input
                      type="number"
                      value={settings.shipping.freeShippingThreshold}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        shipping: { ...prev.shipping, freeShippingThreshold: parseInt(e.target.value) }
                      }))}
                      className="input-modern"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kargo Ücreti (TL)</label>
                    <input
                      type="number"
                      value={settings.shipping.shippingCost}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        shipping: { ...prev.shipping, shippingCost: parseInt(e.target.value) }
                      }))}
                      className="input-modern"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tahmini Teslimat Süresi (Gün)</label>
                    <input
                      type="number"
                      value={settings.shipping.estimatedDeliveryDays}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        shipping: { ...prev.shipping, estimatedDeliveryDays: parseInt(e.target.value) }
                      }))}
                      className="input-modern"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Varsayılan Kargo Firması</label>
                    <select
                      value={settings.shipping.defaultShippingCompany}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        shipping: { ...prev.shipping, defaultShippingCompany: e.target.value }
                      }))}
                      className="input-modern"
                    >
                      {settings.shipping.shippingCompanies.map(company => (
                        <option key={company} value={company}>{company}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.shipping.enableFreeShipping}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      shipping: { ...prev.shipping, enableFreeShipping: e.target.checked }
                    }))}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Ücretsiz kargo özelliğini etkinleştir</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Email Ayarları */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Email Ayarları</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    checked={settings.email.enableSmtp}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      email: { ...prev.email, enableSmtp: e.target.checked }
                    }))}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">SMTP kullanarak email gönder</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                    <input
                      type="text"
                      value={settings.email.smtpHost}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        email: { ...prev.email, smtpHost: e.target.value }
                      }))}
                      className="input-modern"
                      disabled={!settings.email.enableSmtp}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                    <input
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        email: { ...prev.email, smtpPort: parseInt(e.target.value) }
                      }))}
                      className="input-modern"
                      disabled={!settings.email.enableSmtp}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Kullanıcı Adı</label>
                    <input
                      type="text"
                      value={settings.email.smtpUser}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        email: { ...prev.email, smtpUser: e.target.value }
                      }))}
                      className="input-modern"
                      disabled={!settings.email.enableSmtp}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Şifre</label>
                    <input
                      type="password"
                      value={settings.email.smtpPassword}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        email: { ...prev.email, smtpPassword: e.target.value }
                      }))}
                      className="input-modern"
                      disabled={!settings.email.enableSmtp}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gönderen Email</label>
                    <input
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        email: { ...prev.email, fromEmail: e.target.value }
                      }))}
                      className="input-modern"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gönderen Adı</label>
                    <input
                      type="text"
                      value={settings.email.fromName}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        email: { ...prev.email, fromName: e.target.value }
                      }))}
                      className="input-modern"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Bildirim Ayarları */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Bildirim Ayarları</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Bildirim Türleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.enableEmailNotifications}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          notifications: { ...prev.notifications, enableEmailNotifications: e.target.checked }
                        }))}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Email Bildirimleri</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.enableSmsNotifications}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          notifications: { ...prev.notifications, enableSmsNotifications: e.target.checked }
                        }))}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">SMS Bildirimleri</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.enablePushNotifications}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          notifications: { ...prev.notifications, enablePushNotifications: e.target.checked }
                        }))}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Push Bildirimleri</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Email Bildirim Detayları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.orderConfirmationEmail}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          notifications: { ...prev.notifications, orderConfirmationEmail: e.target.checked }
                        }))}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Sipariş Onay Emaili</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.shippingUpdateEmail}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          notifications: { ...prev.notifications, shippingUpdateEmail: e.target.checked }
                        }))}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Kargo Güncelleme Emaili</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.lowStockAlert}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          notifications: { ...prev.notifications, lowStockAlert: e.target.checked }
                        }))}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Düşük Stok Uyarısı</span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Kaydet Butonları */}
        <div className="flex justify-end space-x-4">
          <Button onClick={handleReset} variant="secondary">
            Sıfırla
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function SettingsPage() {
  return <SettingsPageContent />;
}
