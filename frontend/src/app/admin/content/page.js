"use client";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { useState, useEffect } from "react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function ContentManagementPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('homepage');
  const [blogs, setBlogs] = useState([]);
  const [news, setNews] = useState([]);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: 'genel',
    tags: [],
    status: 'draft',
    author: user?.name || 'Admin',
    publishedAt: ''
  });
  const [newsForm, setNewsForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: 'genel',
    tags: [],
    status: 'draft',
    author: user?.name || 'Admin',
    publishedAt: '',
    isBreaking: false
  });
  const [content, setContent] = useState({
    homepage: {
      heroTitle: "CM Ticaret",
      heroSubtitle: "Kaliteli ürünler, uygun fiyatlar ve hızlı teslimat ile alışverişin keyfini çıkarın",
      heroButtonText: "Ürünleri Keşfet",
      heroButtonSecondaryText: "Kampanyalar",
      features: [
        { title: "Ücretsiz Kargo", description: "500 TL ve üzeri alışverişlerde" },
        { title: "Güvenli Ödeme", description: "256-bit SSL şifreleme" },
        { title: "Hızlı Teslimat", description: "1-2 iş günü içinde" },
        { title: "Müşteri Desteği", description: "7/24 canlı destek" }
      ],
      testimonials: [
        {
          name: "Ahmet Yılmaz",
          role: "Müşteri",
          content: "Çok hızlı teslimat ve kaliteli ürünler. Kesinlikle tavsiye ederim!",
          rating: 5,
          avatar: "/avatars/ahmet.jpg"
        },
        {
          name: "Fatma Demir",
          role: "Müşteri", 
          content: "Müşteri hizmetleri çok ilgili ve yardımcı. Teşekkürler!",
          rating: 5,
          avatar: "/avatars/fatma.jpg"
        }
      ]
    },
    about: {
      title: "Hakkımızda",
      content: "CM Ticaret olarak 2020 yılından beri müşterilerimize en kaliteli ürünleri en uygun fiyatlarla sunmaktayız. Müşteri memnuniyeti bizim önceliğimizdir.",
      mission: "Müşterilerimize en iyi alışveriş deneyimini sunmak",
      vision: "Türkiye'nin en güvenilir e-ticaret platformu olmak",
      values: [
        "Müşteri Odaklılık",
        "Kalite",
        "Güvenilirlik", 
        "İnovasyon",
        "Şeffaflık"
      ]
    },
    seo: {
      title: "CM Ticaret - Online Alışveriş",
      description: "Kaliteli ürünler, uygun fiyatlar ve hızlı teslimat ile alışverişin keyfini çıkarın. Elektronik, giyim, ev & yaşam ve daha fazlası.",
      keywords: "e-ticaret, online alışveriş, elektronik, giyim, ev, yaşam, spor, kitap, oyuncak",
      ogTitle: "CM Ticaret - Online Alışveriş",
      ogDescription: "Kaliteli ürünler, uygun fiyatlar ve hızlı teslimat",
      ogImage: "/og-image.jpg"
    }
  });

  useEffect(() => {
    if (user && user.role === 'admin') {
    loadContent();
      loadBlogs();
      loadNews();
    }
  }, [user]);

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

  const loadContent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/content`);
      const data = await response.json();
      if (response.ok) {
        setContent(data);
      }
    } catch (error) {
      console.error("Content load error:", error);
    }
    setLoading(false);
  };

  const loadBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs`);
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      } else {
        // Mock data for demo
        setBlogs([
          {
            id: 1,
            title: "E-ticaret Trendleri 2024",
            slug: "e-ticaret-trendleri-2024",
            excerpt: "2024 yılında e-ticaret sektöründe öne çıkan trendler ve gelişmeler.",
            content: "E-ticaret sektörü hızla gelişmeye devam ediyor...",
            featuredImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
            category: "teknoloji",
            tags: ["e-ticaret", "trend", "2024"],
            status: "published",
            author: "Admin",
            publishedAt: "2024-01-15",
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z"
          },
          {
            id: 2,
            title: "Müşteri Memnuniyeti Nasıl Artırılır?",
            slug: "musteri-memnuniyeti-nasil-artirilir",
            excerpt: "E-ticaret sitenizde müşteri memnuniyetini artırmanın yolları.",
            content: "Müşteri memnuniyeti e-ticaret başarısının temel taşıdır...",
            featuredImage: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=400&fit=crop",
            category: "pazarlama",
            tags: ["müşteri", "memnuniyet", "pazarlama"],
            status: "published",
            author: "Admin",
            publishedAt: "2024-01-10",
            createdAt: "2024-01-10T10:00:00Z",
            updatedAt: "2024-01-10T10:00:00Z"
          }
        ]);
      }
    } catch (error) {
      console.error("Blogs load error:", error);
    }
  };

  const loadNews = async () => {
    try {
      const response = await fetch(`${API_URL}/api/news`);
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      } else {
        // Mock data for demo
        setNews([
          {
            id: 1,
            title: "Yeni Ürün Kategorisi: Akıllı Ev",
            slug: "yeni-urun-kategorisi-akilli-ev",
            excerpt: "Akıllı ev ürünleri kategorimiz yayında!",
            content: "Artık akıllı ev ürünlerini sitemizden satın alabilirsiniz...",
            featuredImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
            category: "duyuru",
            tags: ["akıllı ev", "yeni kategori", "teknoloji"],
            status: "published",
            author: "Admin",
            publishedAt: "2024-01-20",
            isBreaking: true,
            createdAt: "2024-01-20T10:00:00Z",
            updatedAt: "2024-01-20T10:00:00Z"
          }
        ]);
      }
    } catch (error) {
      console.error("News load error:", error);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/content`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(content)
      });

      if (response.ok) {
        alert("İçerik başarıyla kaydedildi");
      } else {
        throw new Error("İçerik kaydedilemedi");
      }
    } catch (error) {
      alert("İçerik kaydedilirken bir hata oluştu: " + error.message);
    }
    setSaving(false);
  };

  const handleInputChange = (section, field, value, index = null) => {
    setContent(prev => {
      const newContent = { ...prev };
      if (index !== null) {
        newContent[section][field][index] = { ...newContent[section][field][index], ...value };
      } else if (field.includes('.')) {
        const [parent, child] = field.split('.');
        newContent[section][parent][child] = value;
      } else {
        newContent[section][field] = value;
      }
      return newContent;
    });
  };

  const addFeature = () => {
    setContent(prev => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        features: [...prev.homepage.features, { title: "", description: "" }]
      }
    }));
  };

  const removeFeature = (index) => {
    setContent(prev => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        features: prev.homepage.features.filter((_, i) => i !== index)
      }
    }));
  };

  const addTestimonial = () => {
    setContent(prev => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        testimonials: [...prev.homepage.testimonials, { name: "", role: "", content: "", rating: 5, avatar: "" }]
      }
    }));
  };

  const removeTestimonial = (index) => {
    setContent(prev => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        testimonials: prev.homepage.testimonials.filter((_, i) => i !== index)
      }
    }));
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  const tabs = [
    { id: 'homepage', name: 'Ana Sayfa', icon: '🏠' },
    { id: 'about', name: 'Hakkımızda', icon: 'ℹ️' },
    { id: 'seo', name: 'SEO', icon: '🔍' },
    { id: 'blog', name: 'Blog', icon: '📝' },
    { id: 'news', name: 'Haberler', icon: '📰' }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">İçerik Yönetimi</h1>
        <p className="text-gray-600 mt-2">Site içeriklerini düzenleyin ve yönetin</p>
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

      <div className="space-y-8">
        {/* Homepage Content */}
        {activeTab === 'homepage' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Ana Sayfa İçeriği</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Başlık</label>
                <input
                  type="text"
                  value={content.homepage.heroTitle}
                  onChange={(e) => handleInputChange("homepage", "heroTitle", e.target.value)}
                  className="input-modern"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Alt Başlık</label>
                <input
                  type="text"
                  value={content.homepage.heroSubtitle}
                  onChange={(e) => handleInputChange("homepage", "heroSubtitle", e.target.value)}
                  className="input-modern"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ana Buton Metni</label>
                <input
                  type="text"
                  value={content.homepage.heroButtonText}
                  onChange={(e) => handleInputChange("homepage", "heroButtonText", e.target.value)}
                  className="input-modern"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İkincil Buton Metni</label>
                <input
                  type="text"
                  value={content.homepage.heroButtonSecondaryText}
                  onChange={(e) => handleInputChange("homepage", "heroButtonSecondaryText", e.target.value)}
                  className="input-modern"
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Özellikler</h3>
                <Button onClick={addFeature} size="sm" className="btn-primary">
                  Özellik Ekle
                </Button>
              </div>
              <div className="space-y-4">
                {content.homepage.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => handleInputChange("homepage", "features", { title: e.target.value }, index)}
                        placeholder="Özellik başlığı"
                        className="input-modern"
                      />
                      <input
                        type="text"
                        value={feature.description}
                        onChange={(e) => handleInputChange("homepage", "features", { description: e.target.value }, index)}
                        placeholder="Özellik açıklaması"
                        className="input-modern"
                      />
                    </div>
                    <Button
                      onClick={() => removeFeature(index)}
                      variant="secondary"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                    >
                      Sil
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Müşteri Yorumları</h3>
                <Button onClick={addTestimonial} size="sm" className="btn-primary">
                  Yorum Ekle
                </Button>
              </div>
              <div className="space-y-4">
                {content.homepage.testimonials.map((testimonial, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        value={testimonial.name}
                        onChange={(e) => handleInputChange("homepage", "testimonials", { name: e.target.value }, index)}
                        placeholder="Müşteri adı"
                        className="input-modern"
                      />
                      <input
                        type="text"
                        value={testimonial.role}
                        onChange={(e) => handleInputChange("homepage", "testimonials", { role: e.target.value }, index)}
                        placeholder="Müşteri rolü"
                        className="input-modern"
                      />
                    </div>
                    <textarea
                      value={testimonial.content}
                      onChange={(e) => handleInputChange("homepage", "testimonials", { content: e.target.value }, index)}
                      placeholder="Yorum içeriği"
                      rows={3}
                      className="input-modern mb-4"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          value={testimonial.rating}
                          onChange={(e) => handleInputChange("homepage", "testimonials", { rating: parseInt(e.target.value) }, index)}
                          min="1"
                          max="5"
                          className="input-modern w-20"
                        />
                        <input
                          type="text"
                          value={testimonial.avatar}
                          onChange={(e) => handleInputChange("homepage", "testimonials", { avatar: e.target.value }, index)}
                          placeholder="Avatar URL"
                          className="input-modern flex-1"
                        />
                      </div>
                      <Button
                        onClick={() => removeTestimonial(index)}
                        variant="secondary"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                      >
                        Sil
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </Card>
        )}

        {/* About Page Content */}
        {activeTab === 'about' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Hakkımızda Sayfası</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
              <input
                type="text"
                value={content.about.title}
                onChange={(e) => handleInputChange("about", "title", e.target.value)}
                className="input-modern"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
              <textarea
                value={content.about.content}
                onChange={(e) => handleInputChange("about", "content", e.target.value)}
                rows={4}
                className="input-modern"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Misyon</label>
                <input
                  type="text"
                  value={content.about.mission}
                  onChange={(e) => handleInputChange("about", "mission", e.target.value)}
                  className="input-modern"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vizyon</label>
                <input
                  type="text"
                  value={content.about.vision}
                  onChange={(e) => handleInputChange("about", "vision", e.target.value)}
                  className="input-modern"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Değerler (her satıra bir değer)</label>
              <textarea
                value={content.about.values.join('\n')}
                onChange={(e) => handleInputChange("about", "values", e.target.value.split('\n').filter(v => v.trim()))}
                rows={5}
                className="input-modern"
                placeholder="Müşteri Odaklılık&#10;Kalite&#10;Güvenilirlik"
              />
            </div>
          </div>
          </Card>
        )}

        {/* SEO Settings */}
        {activeTab === 'seo' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">SEO Ayarları</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sayfa Başlığı</label>
              <input
                type="text"
                value={content.seo.title}
                onChange={(e) => handleInputChange("seo", "title", e.target.value)}
                className="input-modern"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Açıklama</label>
              <textarea
                value={content.seo.description}
                onChange={(e) => handleInputChange("seo", "description", e.target.value)}
                rows={3}
                className="input-modern"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Anahtar Kelimeler</label>
              <input
                type="text"
                value={content.seo.keywords}
                onChange={(e) => handleInputChange("seo", "keywords", e.target.value)}
                className="input-modern"
                placeholder="e-ticaret, online alışveriş, elektronik"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OG Başlık</label>
                <input
                  type="text"
                  value={content.seo.ogTitle}
                  onChange={(e) => handleInputChange("seo", "ogTitle", e.target.value)}
                  className="input-modern"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OG Açıklama</label>
                <input
                  type="text"
                  value={content.seo.ogDescription}
                  onChange={(e) => handleInputChange("seo", "ogDescription", e.target.value)}
                  className="input-modern"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">OG Görsel URL</label>
              <input
                type="text"
                value={content.seo.ogImage}
                onChange={(e) => handleInputChange("seo", "ogImage", e.target.value)}
                className="input-modern"
                placeholder="/og-image.jpg"
              />
            </div>
          </div>
          </Card>
        )}

        {/* Blog Management */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Blog Yönetimi</h2>
                <Button onClick={() => setShowBlogForm(true)}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Yeni Blog Yazısı
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <div key={blog.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-100">
                      {blog.featuredImage ? (
                        <Image
                          src={blog.featuredImage}
                          alt={blog.title}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          blog.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.status === 'published' ? 'Yayında' : 'Taslak'}
                        </span>
                        <span className="text-xs text-gray-500">{blog.category}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{blog.author}</span>
                        <span>{new Date(blog.publishedAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              setEditingBlog(blog);
                              setBlogForm(blog);
                              setShowBlogForm(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
                                setBlogs(prev => prev.filter(b => b.id !== blog.id));
                                showToast('Blog yazısı silindi!', 'success');
                              }
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex space-x-1">
                          {blog.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* News Management */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Haber Yönetimi</h2>
                <Button onClick={() => setShowNewsForm(true)}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Yeni Haber
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((newsItem) => (
                  <div key={newsItem.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-100 relative">
                      {newsItem.featuredImage ? (
                        <Image
                          src={newsItem.featuredImage}
                          alt={newsItem.title}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {newsItem.isBreaking && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                          SON DAKİKA
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          newsItem.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {newsItem.status === 'published' ? 'Yayında' : 'Taslak'}
                        </span>
                        <span className="text-xs text-gray-500">{newsItem.category}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{newsItem.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{newsItem.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{newsItem.author}</span>
                        <span>{new Date(newsItem.publishedAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              setEditingNews(newsItem);
                              setNewsForm(newsItem);
                              setShowNewsForm(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Bu haberi silmek istediğinizden emin misiniz?')) {
                                setNews(prev => prev.filter(n => n.id !== newsItem.id));
                                showToast('Haber silindi!', 'success');
                              }
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex space-x-1">
                          {newsItem.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Save Button */}
        {(activeTab === 'homepage' || activeTab === 'about' || activeTab === 'seo') && (
          <div className="flex justify-end">
            <Button
              onClick={saveContent}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
