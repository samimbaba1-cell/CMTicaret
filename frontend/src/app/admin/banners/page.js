"use client";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { useState, useEffect, useCallback } from "react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Image from "next/image";

export default function BannersPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bannerTypes] = useState([
    { value: 'hero', label: 'Ana Banner (Hero)' },
    { value: 'category', label: 'Kategori Banner' },
    { value: 'product', label: 'Ürün Banner' },
    { value: 'promotion', label: 'Promosyon Banner' },
    { value: 'newsletter', label: 'Newsletter Banner' }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    mobileImage: "",
    link: "",
    buttonText: "Detay",
    type: "hero",
    position: "top",
    isActive: true,
    order: 1,
    startDate: "",
    endDate: "",
    targetAudience: "all",
    backgroundColor: "#3B82F6",
    textColor: "#FFFFFF"
  });

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const loadBanners = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners`);
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      } else {
        // Mock data for demo
        setBanners([
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
            textColor: "#FFFFFF"
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
            textColor: "#FFFFFF"
          }
        ]);
      }
    } catch (error) {
      console.error("Banners load error:", error);
      showToast("Bannerlar yüklenirken hata oluştu!", "error");
    }
    setLoading(false);
  }, [showToast]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners${editingBanner ? `/${editingBanner.id}` : ''}`, {
        method: editingBanner ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast(editingBanner ? 'Banner güncellendi!' : 'Banner oluşturuldu!', 'success');
        loadBanners();
        setShowForm(false);
        setEditingBanner(null);
        setFormData({
          title: "",
          subtitle: "",
          description: "",
          image: "",
          mobileImage: "",
          link: "",
          buttonText: "Detay",
          type: "hero",
          position: "top",
          isActive: true,
          order: 1,
          startDate: "",
          endDate: "",
          targetAudience: "all",
          backgroundColor: "#3B82F6",
          textColor: "#FFFFFF"
        });
      } else {
        // Mock update for demo
        if (editingBanner) {
          setBanners(prev => prev.map(banner => 
            banner.id === editingBanner.id ? { ...formData, id: editingBanner.id } : banner
          ));
        } else {
          setBanners(prev => [...prev, { ...formData, id: Date.now() }]);
        }
        showToast(editingBanner ? 'Banner güncellendi!' : 'Banner oluşturuldu!', 'success');
        setShowForm(false);
        setEditingBanner(null);
        setFormData({
          title: "",
          subtitle: "",
          description: "",
          image: "",
          mobileImage: "",
          link: "",
          buttonText: "Detay",
          type: "hero",
          position: "top",
          isActive: true,
          order: 1,
          startDate: "",
          endDate: "",
          targetAudience: "all",
          backgroundColor: "#3B82F6",
          textColor: "#FFFFFF"
        });
      }
    } catch (error) {
      console.error("Banner save error:", error);
      showToast("Banner kaydedilirken hata oluştu!", "error");
    }
    
    setLoading(false);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData(banner);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu bannerı silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        showToast('Banner silindi!', 'success');
        loadBanners();
      } else {
        // Mock delete for demo
        setBanners(prev => prev.filter(banner => banner.id !== id));
        showToast('Banner silindi!', 'success');
      }
    } catch (error) {
      console.error("Banner delete error:", error);
      showToast("Banner silinirken hata oluştu!", "error");
    }
  };

  const toggleActive = async (id) => {
    try {
      const banner = banners.find(b => b.id === id);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: !banner.isActive })
      });

      if (response.ok) {
        showToast(`Banner ${!banner.isActive ? 'aktifleştirildi' : 'pasifleştirildi'}!`, 'success');
        loadBanners();
      } else {
        // Mock update for demo
        setBanners(prev => prev.map(banner => 
          banner.id === id ? { ...banner, isActive: !banner.isActive } : banner
        ));
        showToast(`Banner ${!banner.isActive ? 'aktifleştirildi' : 'pasifleştirildi'}!`, 'success');
      }
    } catch (error) {
      console.error("Banner toggle error:", error);
      showToast("Banner durumu güncellenirken hata oluştu!", "error");
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Banner Yönetimi</h1>
            <p className="text-gray-600">Ana sayfa bannerlarını yönetin</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Yeni Banner
          </Button>
        </div>
      </div>

      {/* Banner List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : banners.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz banner yok</h3>
            <p className="text-gray-600 mb-4">İlk bannerınızı oluşturun</p>
            <Button onClick={() => setShowForm(true)}>Banner Oluştur</Button>
          </div>
        ) : (
          banners.map((banner) => (
            <Card key={banner.id} className="p-0 overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="h-48 bg-gray-100">
                  {banner.image ? (
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    </div>
                  )}
                </div>
                
                {/* Banner Info Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-center text-white">
                    <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
                    <p className="text-sm">{banner.subtitle}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    banner.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                  {banner.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{banner.title}</h3>
                  <span className="text-xs text-gray-500">#{banner.order}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">{banner.subtitle}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{bannerTypes.find(t => t.value === banner.type)?.label}</span>
                  <span>{banner.position}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(banner)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Düzenle"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                    <button
                      onClick={() => toggleActive(banner.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        banner.isActive 
                          ? 'text-yellow-600 hover:bg-yellow-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={banner.isActive ? 'Pasifleştir' : 'Aktifleştir'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sil"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: banner.backgroundColor }}
                    ></div>
                    <span className="text-xs text-gray-500">{banner.type}</span>
                  </div>
              </div>
            </div>
          </Card>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  {editingBanner ? 'Banner Düzenle' : 'Yeni Banner Oluştur'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingBanner(null);
                    setFormData({
                      title: "",
                      subtitle: "",
                      description: "",
                      image: "",
                      mobileImage: "",
                      link: "",
                      buttonText: "Detay",
                      type: "hero",
                      position: "top",
                      isActive: true,
                      order: 1,
                      startDate: "",
                      endDate: "",
                      targetAudience: "all",
                      backgroundColor: "#3B82F6",
                      textColor: "#FFFFFF"
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sol Kolon */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Banner Başlığı *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="input-modern"
                        placeholder="Örn: Yaz Kampanyası"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                        className="input-modern"
                        placeholder="Örn: Tüm ürünlerde %50'ye varan indirimler"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="input-modern"
                        rows={3}
                        placeholder="Banner hakkında detaylı açıklama..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Banner Tipi</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="input-modern"
                      >
                        {bannerTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pozisyon</label>
                      <select
                        value={formData.position}
                        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                        className="input-modern"
                      >
                        <option value="top">Üst</option>
                        <option value="middle">Orta</option>
                        <option value="bottom">Alt</option>
                        <option value="sidebar">Kenar Çubuğu</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hedef Kitle</label>
                      <select
                        value={formData.targetAudience}
                        onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                        className="input-modern"
                      >
                        <option value="all">Tüm Kullanıcılar</option>
                        <option value="new">Yeni Kullanıcılar</option>
                        <option value="returning">Dönen Kullanıcılar</option>
                        <option value="premium">Premium Üyeler</option>
                      </select>
                    </div>
                  </div>

                  {/* Sağ Kolon */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Masaüstü Resim URL</label>
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        className="input-modern"
                        placeholder="https://example.com/desktop-banner.jpg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobil Resim URL</label>
                      <input
                        type="url"
                        value={formData.mobileImage}
                        onChange={(e) => setFormData(prev => ({ ...prev, mobileImage: e.target.value }))}
                        className="input-modern"
                        placeholder="https://example.com/mobile-banner.jpg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Yönlendirme Linki</label>
                      <input
                        type="text"
                        value={formData.link}
                        onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                        className="input-modern"
                        placeholder="/kampanya veya https://example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Buton Metni</label>
                      <input
                        type="text"
                        value={formData.buttonText}
                        onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                        className="input-modern"
                        placeholder="Detay, Keşfet, Alışverişe Başla"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Tarihi</label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                          className="input-modern"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi</label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                          className="input-modern"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sıra Numarası</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                        className="input-modern"
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Renk Ayarları */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Renk Ayarları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Arka Plan Rengi</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={formData.backgroundColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={formData.backgroundColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          className="input-modern flex-1"
                          placeholder="#3B82F6"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Metin Rengi</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={formData.textColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={formData.textColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                          className="input-modern flex-1"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Durum Ayarları */}
                <div className="border-t pt-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Banner&apos;ı aktifleştir
                    </label>
                  </div>
                </div>

                {/* Önizleme */}
                {formData.title && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Önizleme</h3>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div 
                        className="h-32 rounded-lg flex items-center justify-center text-center relative"
                        style={{ 
                          backgroundColor: formData.backgroundColor,
                          color: formData.textColor 
                        }}
                      >
                        {formData.image ? (
                          <Image
                            src={formData.image}
                            alt={formData.title}
                            width={300}
                            height={120}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-center">
                            <h4 className="text-lg font-bold">{formData.title}</h4>
                            {formData.subtitle && <p className="text-sm opacity-90">{formData.subtitle}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingBanner(null);
                    }}
                  >
                    İptal
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Kaydediliyor...' : (editingBanner ? 'Güncelle' : 'Oluştur')}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}
