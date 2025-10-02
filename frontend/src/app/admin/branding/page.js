"use client";
import { useState, useEffect, Suspense } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Image from "next/image";

function BrandingPageContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [branding, setBranding] = useState({
    siteName: "CM Ticaret",
    siteSlogan: "Kaliteli ürünler, güvenilir hizmet",
    logo: null,
    favicon: null,
    primaryColor: "#3B82F6",
    secondaryColor: "#8B5CF6",
    accentColor: "#F59E0B"
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  useEffect(() => {
    loadBranding();
  }, []);

  const loadBranding = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/branding`);
      if (response.ok) {
        const data = await response.json();
        setBranding(data);
        if (data.logo) setLogoPreview(data.logo);
        if (data.favicon) setFaviconPreview(data.favicon);
      }
    } catch (error) {
      console.error("Branding load error:", error);
    }
  };

  const handleFileUpload = (file, type) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'logo') {
        setLogoPreview(e.target.result);
        setBranding(prev => ({ ...prev, logo: e.target.result }));
      } else if (type === 'favicon') {
        setFaviconPreview(e.target.result);
        setBranding(prev => ({ ...prev, favicon: e.target.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/branding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(branding),
      });

      if (response.ok) {
        showToast("Marka ayarları başarıyla kaydedildi!", "success");
      } else {
        showToast("Kaydetme hatası!", "error");
      }
    } catch (error) {
      console.error("Save error:", error);
      showToast("Kaydetme hatası!", "error");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setBranding({
      siteName: "CM Ticaret",
      siteSlogan: "Kaliteli ürünler, güvenilir hizmet",
      logo: null,
      favicon: null,
      primaryColor: "#3B82F6",
      secondaryColor: "#8B5CF6",
      accentColor: "#F59E0B"
    });
    setLogoPreview(null);
    setFaviconPreview(null);
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
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Marka Yönetimi</h1>
        <p className="text-gray-600">Site logosu, renkleri ve marka kimliğini yönetin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo Yönetimi */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Logo Yönetimi</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Logosu
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Logo Preview"
                      width={80}
                      height={80}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'logo')}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG formatları desteklenir</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favicon
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  {faviconPreview ? (
                    <Image
                      src={faviconPreview}
                      alt="Favicon Preview"
                      width={48}
                      height={48}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'favicon')}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">16x16 veya 32x32 piksel önerilir</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Site Bilgileri */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Site Bilgileri</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Adı
              </label>
              <input
                type="text"
                value={branding.siteName}
                onChange={(e) => setBranding(prev => ({ ...prev, siteName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Site adınız"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Sloganı
              </label>
              <input
                type="text"
                value={branding.siteSlogan}
                onChange={(e) => setBranding(prev => ({ ...prev, siteSlogan: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Site sloganınız"
              />
            </div>
          </div>
        </Card>

        {/* Renk Paleti */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Renk Paleti</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ana Renk
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-12 h-12 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={branding.primaryColor}
                  onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İkincil Renk
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={branding.secondaryColor}
                  onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="w-12 h-12 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={branding.secondaryColor}
                  onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vurgu Rengi
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={branding.accentColor}
                  onChange={(e) => setBranding(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="w-12 h-12 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={branding.accentColor}
                  onChange={(e) => setBranding(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Önizleme */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Önizleme</h2>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center space-x-3 mb-4">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CM</span>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg" style={{ color: branding.primaryColor }}>
                  {branding.siteName}
                </h3>
                <p className="text-sm text-gray-600">{branding.siteSlogan}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <div 
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: branding.primaryColor }}
                title="Ana Renk"
              ></div>
              <div 
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: branding.secondaryColor }}
                title="İkincil Renk"
              ></div>
              <div 
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: branding.accentColor }}
                title="Vurgu Rengi"
              ></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Kaydet Butonları */}
      <div className="flex justify-end space-x-4 mt-6">
        <Button
          variant="secondary"
          onClick={handleReset}
          disabled={loading}
        >
          Sıfırla
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </main>
  );
}

export default function BrandingPage() {
  return <BrandingPageContent />;
}
