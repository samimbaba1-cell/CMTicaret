"use client";
import { useState, useEffect } from "react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function ThemeManagementPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState({
    colors: {
      primary: "#3b82f6",
      primaryDark: "#2563eb",
      secondary: "#64748b",
      accent: "#f59e0b",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      background: "#ffffff",
      foreground: "#0f172a",
      surface: "#f8fafc",
      border: "#e2e8f0"
    },
    fonts: {
      primary: "Inter",
      secondary: "Poppins",
      heading: "Inter"
    },
    layout: {
      headerHeight: "64px",
      footerHeight: "200px",
      maxWidth: "1280px",
      borderRadius: "8px",
      shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
    },
    animations: {
      duration: "300ms",
      easing: "ease-in-out",
      enableHover: true,
      enableTransitions: true
    }
  });

  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/theme`);
      const data = await response.json();
      if (response.ok) {
        setTheme(data);
      }
    } catch (error) {
      console.error("Theme load error:", error);
    }
    setLoading(false);
  };

  const saveTheme = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/theme`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(theme)
      });

      if (response.ok) {
        alert("Tema başarıyla kaydedildi");
        applyTheme();
      } else {
        throw new Error("Tema kaydedilemedi");
      }
    } catch (error) {
      alert("Tema kaydedilirken bir hata oluştu: " + error.message);
    }
    setSaving(false);
  };

  const applyTheme = () => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  };

  const resetTheme = () => {
    const defaultTheme = {
      colors: {
        primary: "#3b82f6",
        primaryDark: "#2563eb",
        secondary: "#64748b",
        accent: "#f59e0b",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        background: "#ffffff",
        foreground: "#0f172a",
        surface: "#f8fafc",
        border: "#e2e8f0"
      },
      fonts: {
        primary: "Inter",
        secondary: "Poppins",
        heading: "Inter"
      },
      layout: {
        headerHeight: "64px",
        footerHeight: "200px",
        maxWidth: "1280px",
        borderRadius: "8px",
        shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
      },
      animations: {
        duration: "300ms",
        easing: "ease-in-out",
        enableHover: true,
        enableTransitions: true
      }
    };
    setTheme(defaultTheme);
  };

  const handleColorChange = (colorKey, value) => {
    setTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  };

  const handleFontChange = (fontKey, value) => {
    setTheme(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontKey]: value
      }
    }));
  };

  const handleLayoutChange = (layoutKey, value) => {
    setTheme(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [layoutKey]: value
      }
    }));
  };

  const handleAnimationChange = (animKey, value) => {
    setTheme(prev => ({
      ...prev,
      animations: {
        ...prev.animations,
        [animKey]: value
      }
    }));
  };

  const fontOptions = [
    "Inter", "Poppins", "Roboto", "Open Sans", "Lato", "Montserrat", "Nunito", "Source Sans Pro"
  ];

  const colorPresets = [
    {
      name: "Mavi Tema",
      colors: {
        primary: "#3b82f6",
        primaryDark: "#2563eb",
        secondary: "#64748b",
        accent: "#f59e0b"
      }
    },
    {
      name: "Yeşil Tema",
      colors: {
        primary: "#10b981",
        primaryDark: "#059669",
        secondary: "#64748b",
        accent: "#f59e0b"
      }
    },
    {
      name: "Mor Tema",
      colors: {
        primary: "#8b5cf6",
        primaryDark: "#7c3aed",
        secondary: "#64748b",
        accent: "#f59e0b"
      }
    },
    {
      name: "Kırmızı Tema",
      colors: {
        primary: "#ef4444",
        primaryDark: "#dc2626",
        secondary: "#64748b",
        accent: "#f59e0b"
      }
    }
  ];

  const applyPreset = (preset) => {
    setTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        ...preset.colors
      }
    }));
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tema Yönetimi</h1>
        <p className="text-gray-600 mt-2">Site renklerini, fontlarını ve tasarımını özelleştirin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Theme Settings */}
        <div className="lg:col-span-2 space-y-8">
          {/* Color Presets */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Renk Şablonları</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {colorPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex space-x-2 mb-2">
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: preset.colors.primary }}
                    ></div>
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: preset.colors.accent }}
                    ></div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{preset.name}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Colors */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Renkler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(theme.colors).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="input-modern flex-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Fonts */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fontlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(theme.fonts).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {key} Font
                  </label>
                  <select
                    value={value}
                    onChange={(e) => handleFontChange(key, e.target.value)}
                    className="input-modern"
                  >
                    {fontOptions.map((font) => (
                      <option key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </Card>

          {/* Layout */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Düzen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Header Yüksekliği</label>
                <input
                  type="text"
                  value={theme.layout.headerHeight}
                  onChange={(e) => handleLayoutChange("headerHeight", e.target.value)}
                  className="input-modern"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Footer Yüksekliği</label>
                <input
                  type="text"
                  value={theme.layout.footerHeight}
                  onChange={(e) => handleLayoutChange("footerHeight", e.target.value)}
                  className="input-modern"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Genişlik</label>
                <input
                  type="text"
                  value={theme.layout.maxWidth}
                  onChange={(e) => handleLayoutChange("maxWidth", e.target.value)}
                  className="input-modern"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
                <input
                  type="text"
                  value={theme.layout.borderRadius}
                  onChange={(e) => handleLayoutChange("borderRadius", e.target.value)}
                  className="input-modern"
                />
              </div>
            </div>
          </Card>

          {/* Animations */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Animasyonlar</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Süre</label>
                  <input
                    type="text"
                    value={theme.animations.duration}
                    onChange={(e) => handleAnimationChange("duration", e.target.value)}
                    className="input-modern"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Easing</label>
                  <select
                    value={theme.animations.easing}
                    onChange={(e) => handleAnimationChange("easing", e.target.value)}
                    className="input-modern"
                  >
                    <option value="ease-in-out">Ease In Out</option>
                    <option value="ease-in">Ease In</option>
                    <option value="ease-out">Ease Out</option>
                    <option value="linear">Linear</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={theme.animations.enableHover}
                    onChange={(e) => handleAnimationChange("enableHover", e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">Hover animasyonlarını etkinleştir</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={theme.animations.enableTransitions}
                    onChange={(e) => handleAnimationChange("enableTransitions", e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">Geçiş animasyonlarını etkinleştir</span>
                </label>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Preview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Önizleme</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
                <h4 className="font-semibold" style={{ fontFamily: theme.fonts.heading }}>
                  Ana Renk Örneği
                </h4>
                <p className="text-sm opacity-90" style={{ fontFamily: theme.fonts.primary }}>
                  Bu bir örnek metindir
                </p>
              </div>
              
              <div className="p-4 border rounded-lg" style={{ 
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.layout.borderRadius
              }}>
                <h4 className="font-semibold text-gray-900" style={{ fontFamily: theme.fonts.heading }}>
                  Kart Örneği
                </h4>
                <p className="text-sm text-gray-600" style={{ fontFamily: theme.fonts.primary }}>
                  Bu bir kart örneğidir
                </p>
              </div>
              
              <button 
                className="w-full px-4 py-2 rounded-lg text-white font-medium transition-colors"
                style={{ 
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.layout.borderRadius
                }}
              >
                Buton Örneği
              </button>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">İşlemler</h3>
            <div className="space-y-3">
              <Button
                onClick={saveTheme}
                disabled={saving}
                className="w-full btn-primary"
              >
                {saving ? "Kaydediliyor..." : "Temayı Kaydet"}
              </Button>
              
              <Button
                onClick={applyTheme}
                variant="secondary"
                className="w-full"
              >
                Önizlemeyi Uygula
              </Button>
              
              <Button
                onClick={resetTheme}
                variant="secondary"
                className="w-full"
              >
                Varsayılana Sıfırla
              </Button>
            </div>
          </Card>

          {/* CSS Export */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">CSS Çıktısı</h3>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  const css = `:root {
  --primary: ${theme.colors.primary};
  --primary-dark: ${theme.colors.primaryDark};
  --secondary: ${theme.colors.secondary};
  --accent: ${theme.colors.accent};
  --success: ${theme.colors.success};
  --warning: ${theme.colors.warning};
  --error: ${theme.colors.error};
  --background: ${theme.colors.background};
  --foreground: ${theme.colors.foreground};
  --surface: ${theme.colors.surface};
  --border: ${theme.colors.border};
}`;
                  navigator.clipboard.writeText(css);
                  alert("CSS kopyalandı!");
                }}
                variant="secondary"
                className="w-full"
              >
                CSS&apos;i Kopyala
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
