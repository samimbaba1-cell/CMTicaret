"use client";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { useState, useEffect } from "react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const THEMES = [
  {
    id: 'modern-blue',
    name: 'Modern Mavi',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f8fafc'
    }
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Mor',
    colors: {
      primary: '#8b5cf6',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#faf5ff'
    }
  },
  {
    id: 'warm-orange',
    name: 'Sıcak Turuncu',
    colors: {
      primary: '#f97316',
      secondary: '#64748b',
      accent: '#eab308',
      background: '#ffffff',
      surface: '#fff7ed'
    }
  },
  {
    id: 'nature-green',
    name: 'Doğa Yeşili',
    colors: {
      primary: '#10b981',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f0fdf4'
    }
  },
  {
    id: 'luxury-gold',
    name: 'Lüks Altın',
    colors: {
      primary: '#d97706',
      secondary: '#6b7280',
      accent: '#fbbf24',
      background: '#ffffff',
      surface: '#fffbeb'
    }
  },
  {
    id: 'minimal-gray',
    name: 'Minimal Gri',
    colors: {
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#3b82f6',
      background: '#ffffff',
      surface: '#f9fafb'
    }
  }
];

const FONTS = [
  { id: 'inter', name: 'Inter', class: 'font-inter' },
  { id: 'poppins', name: 'Poppins', class: 'font-poppins' },
  { id: 'roboto', name: 'Roboto', class: 'font-roboto' },
  { id: 'opensans', name: 'Open Sans', class: 'font-opensans' },
  { id: 'lato', name: 'Lato', class: 'font-lato' },
  { id: 'montserrat', name: 'Montserrat', class: 'font-montserrat' }
];

export default function DesignPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [currentTheme, setCurrentTheme] = useState('modern-blue');
  const [currentFont, setCurrentFont] = useState('inter');
  const [customColors, setCustomColors] = useState({
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f8fafc'
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [layoutSettings, setLayoutSettings] = useState({
    headerStyle: 'default', // default, minimal, centered
    footerStyle: 'default', // default, minimal, detailed
    sidebarPosition: 'right', // left, right, none
    productGrid: '4-columns', // 2-columns, 3-columns, 4-columns, 5-columns
    cardStyle: 'default', // default, minimal, detailed, card
    buttonStyle: 'rounded', // rounded, square, pill
    borderRadius: 'medium', // none, small, medium, large
    shadow: 'medium' // none, small, medium, large
  });
  const [animationSettings, setAnimationSettings] = useState({
    enableAnimations: true,
    animationSpeed: 'normal', // slow, normal, fast
    hoverEffects: true,
    pageTransitions: true
  });

  useEffect(() => {
    // Load saved settings from localStorage
    const savedTheme = localStorage.getItem('site-theme');
    const savedFont = localStorage.getItem('site-font');
    const savedColors = localStorage.getItem('site-colors');
    const savedLayout = localStorage.getItem('site-layout');
    const savedAnimations = localStorage.getItem('site-animations');
    
    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedFont) setCurrentFont(savedFont);
    if (savedColors) setCustomColors(JSON.parse(savedColors));
    if (savedLayout) setLayoutSettings(JSON.parse(savedLayout));
    if (savedAnimations) setAnimationSettings(JSON.parse(savedAnimations));
  }, []);

  const applyTheme = (themeId) => {
    const theme = THEMES.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(themeId);
      setCustomColors(theme.colors);
      applyColorsToDocument(theme.colors);
      localStorage.setItem('site-theme', themeId);
      localStorage.setItem('site-colors', JSON.stringify(theme.colors));
    }
  };

  const applyCustomColors = () => {
    applyColorsToDocument(customColors);
    localStorage.setItem('site-colors', JSON.stringify(customColors));
    localStorage.setItem('site-theme', 'custom');
    showToast('Özel renkler uygulandı!', 'success');
  };

  const applyLayoutSettings = () => {
    localStorage.setItem('site-layout', JSON.stringify(layoutSettings));
    showToast('Layout ayarları kaydedildi!', 'success');
  };

  const applyAnimationSettings = () => {
    localStorage.setItem('site-animations', JSON.stringify(animationSettings));
    showToast('Animasyon ayarları kaydedildi!', 'success');
  };

  const resetToDefault = () => {
    if (window.confirm('Tüm tasarım ayarlarını varsayılana sıfırlamak istediğinizden emin misiniz?')) {
      setCurrentTheme('modern-blue');
      setCurrentFont('inter');
      setCustomColors({
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#f8fafc'
      });
      setLayoutSettings({
        headerStyle: 'default',
        footerStyle: 'default',
        sidebarPosition: 'right',
        productGrid: '4-columns',
        cardStyle: 'default',
        buttonStyle: 'rounded',
        borderRadius: 'medium',
        shadow: 'medium'
      });
      setAnimationSettings({
        enableAnimations: true,
        animationSpeed: 'normal',
        hoverEffects: true,
        pageTransitions: true
      });
      
      // Clear localStorage
      localStorage.removeItem('site-theme');
      localStorage.removeItem('site-font');
      localStorage.removeItem('site-colors');
      localStorage.removeItem('site-layout');
      localStorage.removeItem('site-animations');
      
      showToast('Tüm ayarlar varsayılana sıfırlandı!', 'success');
    }
  };

  const applyColorsToDocument = (colors) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-dark', darkenColor(colors.primary, 20));
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--surface', colors.surface);
  };

  const applyFont = (fontId) => {
    setCurrentFont(fontId);
    localStorage.setItem('site-font', fontId);
    
    // Apply font class to body
    document.body.className = document.body.className.replace(/font-\w+/g, '');
    const fontClass = FONTS.find(f => f.id === fontId)?.class || 'font-inter';
    document.body.classList.add(fontClass);
  };

  const darkenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
    if (!isPreviewMode) {
      // Save current state before preview
      localStorage.setItem('preview-theme', currentTheme);
      localStorage.setItem('preview-font', currentFont);
      localStorage.setItem('preview-colors', JSON.stringify(customColors));
    } else {
      // Restore original state
      const originalTheme = localStorage.getItem('preview-theme') || 'modern-blue';
      const originalFont = localStorage.getItem('preview-font') || 'inter';
      const originalColors = JSON.parse(localStorage.getItem('preview-colors') || '{}');
      
      setCurrentTheme(originalTheme);
      setCurrentFont(originalFont);
      setCustomColors(originalColors);
      applyTheme(originalTheme);
      applyFont(originalFont);
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
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Tasarım Yönetimi</h1>
        <p className="text-gray-600">Sitenizin görünümünü özelleştirin</p>
      </div>

      {/* Preview Toggle */}
      <div className="mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Canlı Önizleme</h3>
              <p className="text-sm text-gray-600">Değişiklikleri gerçek zamanlı olarak görün</p>
            </div>
            <Button 
              onClick={togglePreview}
              variant={isPreviewMode ? "secondary" : "primary"}
            >
              {isPreviewMode ? "Önizlemeyi Kapat" : "Önizlemeyi Aç"}
            </Button>
          </div>
        </Card>
      </div>

      <div className="space-y-8">
        {/* Theme Selection */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Hazır Temalar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {THEMES.map((theme) => (
              <div
                key={theme.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  currentTheme === theme.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => applyTheme(theme.id)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.secondary }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.accent }}></div>
                </div>
                <h3 className="font-medium">{theme.name}</h3>
                <p className="text-sm text-gray-600">Modern ve şık tasarım</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Font Selection */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Yazı Tipi</h2>
          <div className="space-y-3">
            {FONTS.map((font) => (
              <div
                key={font.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  currentFont === font.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => applyFont(font.id)}
              >
                <div className={`${font.class} text-lg`}>
                  {font.name} - ABC abc 123
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Custom Colors */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Özel Renkler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(customColors).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {key === 'primary' ? 'Ana Renk' : 
                   key === 'secondary' ? 'İkincil Renk' :
                   key === 'accent' ? 'Vurgu Rengi' :
                   key === 'background' ? 'Arka Plan' :
                   key === 'surface' ? 'Yüzey Rengi' : key}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => setCustomColors(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setCustomColors(prev => ({ ...prev, [key]: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button onClick={applyCustomColors} className="w-full">
              Özel Renkleri Uygula
            </Button>
          </div>
        </Card>

        {/* Layout Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Layout Ayarları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Header Stili</label>
              <select
                value={layoutSettings.headerStyle}
                onChange={(e) => setLayoutSettings(prev => ({ ...prev, headerStyle: e.target.value }))}
                className="input-modern"
              >
                <option value="default">Varsayılan</option>
                <option value="minimal">Minimal</option>
                <option value="centered">Ortalanmış</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Footer Stili</label>
              <select
                value={layoutSettings.footerStyle}
                onChange={(e) => setLayoutSettings(prev => ({ ...prev, footerStyle: e.target.value }))}
                className="input-modern"
              >
                <option value="default">Varsayılan</option>
                <option value="minimal">Minimal</option>
                <option value="detailed">Detaylı</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sidebar Pozisyonu</label>
              <select
                value={layoutSettings.sidebarPosition}
                onChange={(e) => setLayoutSettings(prev => ({ ...prev, sidebarPosition: e.target.value }))}
                className="input-modern"
              >
                <option value="left">Sol</option>
                <option value="right">Sağ</option>
                <option value="none">Yok</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Grid</label>
              <select
                value={layoutSettings.productGrid}
                onChange={(e) => setLayoutSettings(prev => ({ ...prev, productGrid: e.target.value }))}
                className="input-modern"
              >
                <option value="2-columns">2 Sütun</option>
                <option value="3-columns">3 Sütun</option>
                <option value="4-columns">4 Sütun</option>
                <option value="5-columns">5 Sütun</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kart Stili</label>
              <select
                value={layoutSettings.cardStyle}
                onChange={(e) => setLayoutSettings(prev => ({ ...prev, cardStyle: e.target.value }))}
                className="input-modern"
              >
                <option value="default">Varsayılan</option>
                <option value="minimal">Minimal</option>
                <option value="detailed">Detaylı</option>
                <option value="card">Kart</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buton Stili</label>
              <select
                value={layoutSettings.buttonStyle}
                onChange={(e) => setLayoutSettings(prev => ({ ...prev, buttonStyle: e.target.value }))}
                className="input-modern"
              >
                <option value="rounded">Yuvarlatılmış</option>
                <option value="square">Kare</option>
                <option value="pill">Hap</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Köşe Yuvarlaklığı</label>
              <select
                value={layoutSettings.borderRadius}
                onChange={(e) => setLayoutSettings(prev => ({ ...prev, borderRadius: e.target.value }))}
                className="input-modern"
              >
                <option value="none">Yok</option>
                <option value="small">Küçük</option>
                <option value="medium">Orta</option>
                <option value="large">Büyük</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gölge</label>
              <select
                value={layoutSettings.shadow}
                onChange={(e) => setLayoutSettings(prev => ({ ...prev, shadow: e.target.value }))}
                className="input-modern"
              >
                <option value="none">Yok</option>
                <option value="small">Küçük</option>
                <option value="medium">Orta</option>
                <option value="large">Büyük</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={applyLayoutSettings} className="w-full">
              Layout Ayarlarını Kaydet
            </Button>
          </div>
        </Card>

        {/* Animation Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Animasyon Ayarları</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Animasyonları Etkinleştir</label>
                <p className="text-xs text-gray-500">Sayfa geçişleri ve hover efektleri</p>
              </div>
              <input
                type="checkbox"
                checked={animationSettings.enableAnimations}
                onChange={(e) => setAnimationSettings(prev => ({ ...prev, enableAnimations: e.target.checked }))}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Hover Efektleri</label>
                <p className="text-xs text-gray-500">Kartlar ve butonlarda hover animasyonları</p>
              </div>
              <input
                type="checkbox"
                checked={animationSettings.hoverEffects}
                onChange={(e) => setAnimationSettings(prev => ({ ...prev, hoverEffects: e.target.checked }))}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Sayfa Geçişleri</label>
                <p className="text-xs text-gray-500">Sayfa değişimlerinde animasyon</p>
              </div>
              <input
                type="checkbox"
                checked={animationSettings.pageTransitions}
                onChange={(e) => setAnimationSettings(prev => ({ ...prev, pageTransitions: e.target.checked }))}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Animasyon Hızı</label>
              <select
                value={animationSettings.animationSpeed}
                onChange={(e) => setAnimationSettings(prev => ({ ...prev, animationSpeed: e.target.value }))}
                className="input-modern"
              >
                <option value="slow">Yavaş</option>
                <option value="normal">Normal</option>
                <option value="fast">Hızlı</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={applyAnimationSettings} className="w-full">
              Animasyon Ayarlarını Kaydet
            </Button>
          </div>
        </Card>

        {/* Preview Section */}
        {isPreviewMode && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Tasarım Önizlemesi</h2>
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">CM</span>
                    </div>
                    <span className="text-xl font-bold">Ticaret</span>
                  </div>
                  <div className="flex space-x-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Ürünleri Keşfet
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Kampanyalar
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-100 rounded-lg p-4 h-32"></div>
                  <div className="bg-gray-100 rounded-lg p-4 h-32"></div>
                  <div className="bg-gray-100 rounded-lg p-4 h-32"></div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Genel Ayarlar</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={resetToDefault}
              variant="secondary"
              className="flex-1"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Varsayılana Sıfırla
            </Button>
            <Button 
              onClick={() => {
                applyCustomColors();
                applyLayoutSettings();
                applyAnimationSettings();
                showToast('Tüm ayarlar kaydedildi!', 'success');
              }}
              className="flex-1"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Tümünü Kaydet
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
