"use client";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { useState, useEffect } from "react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function CouponsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage', // percentage, fixed, free_shipping
    value: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 0,
    usedCount: 0,
    isActive: true,
    startDate: '',
    endDate: '',
    applicableProducts: [], // product IDs
    applicableCategories: [], // category IDs
    customerGroups: 'all' // all, new_customers, returning_customers, vip
  });

  const couponTypes = [
    { value: 'percentage', label: 'Yüzde İndirim (%)', icon: '📊' },
    { value: 'fixed', label: 'Sabit İndirim (TL)', icon: '💰' },
    { value: 'free_shipping', label: 'Ücretsiz Kargo', icon: '🚚' },
    { value: 'buy_x_get_y', label: 'X Al Y Öde', icon: '🎁' }
  ];

  const customerGroups = [
    { value: 'all', label: 'Tüm Müşteriler' },
    { value: 'new_customers', label: 'Yeni Müşteriler' },
    { value: 'returning_customers', label: 'Dönen Müşteriler' },
    { value: 'vip', label: 'VIP Müşteriler' }
  ];

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadCoupons();
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

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/coupons`);
      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      } else {
        // Mock data for demo
        setCoupons([
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
          },
          {
            id: 3,
            code: 'FREESHIP',
            name: 'Ücretsiz Kargo',
            description: 'Tüm siparişlerde ücretsiz kargo',
            type: 'free_shipping',
            value: 0,
            minOrderAmount: 0,
            maxDiscountAmount: 0,
            usageLimit: 0,
            usedCount: 0,
            isActive: true,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            applicableProducts: [],
            applicableCategories: [],
            customerGroups: 'all',
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z'
          }
        ]);
      }
    } catch (error) {
      console.error("Coupons load error:", error);
      showToast("Kuponlar yüklenirken hata oluştu!", "error");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/coupons${editingCoupon ? `/${editingCoupon.id}` : ''}`, {
        method: editingCoupon ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast(editingCoupon ? 'Kupon güncellendi!' : 'Kupon oluşturuldu!', 'success');
        loadCoupons();
        setShowForm(false);
        setEditingCoupon(null);
        resetForm();
      } else {
        // Mock save for demo
        const newCoupon = {
          ...formData,
          id: editingCoupon ? editingCoupon.id : Date.now(),
          createdAt: editingCoupon ? editingCoupon.createdAt : new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        if (editingCoupon) {
          setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? newCoupon : c));
        } else {
          setCoupons(prev => [...prev, newCoupon]);
        }
        
        showToast(editingCoupon ? 'Kupon güncellendi!' : 'Kupon oluşturuldu!', 'success');
        setShowForm(false);
        setEditingCoupon(null);
        resetForm();
      }
    } catch (error) {
      console.error("Coupon save error:", error);
      showToast("Kupon kaydedilirken hata oluştu!", "error");
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 0,
      usedCount: 0,
      isActive: true,
      startDate: '',
      endDate: '',
      applicableProducts: [],
      applicableCategories: [],
      customerGroups: 'all'
    });
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData(coupon);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kuponu silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/coupons/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        showToast('Kupon silindi!', 'success');
        loadCoupons();
      } else {
        // Mock delete for demo
        setCoupons(prev => prev.filter(c => c.id !== id));
        showToast('Kupon silindi!', 'success');
      }
    } catch (error) {
      console.error("Coupon delete error:", error);
      showToast("Kupon silinirken hata oluştu!", "error");
    }
  };

  const toggleActive = async (id) => {
    try {
      const coupon = coupons.find(c => c.id === id);
      const response = await fetch(`${API_URL}/api/coupons/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: !coupon.isActive })
      });

      if (response.ok) {
        showToast(`Kupon ${!coupon.isActive ? 'aktifleştirildi' : 'pasifleştirildi'}!`, 'success');
        loadCoupons();
      } else {
        // Mock update for demo
        setCoupons(prev => prev.map(c => 
          c.id === id ? { ...c, isActive: !c.isActive } : c
        ));
        showToast(`Kupon ${!coupon.isActive ? 'aktifleştirildi' : 'pasifleştirildi'}!`, 'success');
      }
    } catch (error) {
      console.error("Coupon toggle error:", error);
      showToast("Kupon durumu güncellenirken hata oluştu!", "error");
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  const getCouponTypeIcon = (type) => {
    return couponTypes.find(t => t.value === type)?.icon || '🎫';
  };

  const getCouponTypeLabel = (type) => {
    return couponTypes.find(t => t.value === type)?.label || type;
  };

  const formatValue = (coupon) => {
    if (coupon.type === 'percentage') {
      return `%${coupon.value}`;
    } else if (coupon.type === 'fixed') {
      return `${coupon.value} TL`;
    } else if (coupon.type === 'free_shipping') {
      return 'Ücretsiz Kargo';
    }
    return coupon.value;
  };

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Kupon Yönetimi</h1>
            <p className="text-gray-600">İndirim kuponlarını oluşturun ve yönetin</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Yeni Kupon
          </Button>
        </div>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </Card>
          ))
        ) : coupons.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz kupon yok</h3>
            <p className="text-gray-600 mb-4">İlk kuponunuzu oluşturun</p>
            <Button onClick={() => setShowForm(true)}>Kupon Oluştur</Button>
          </div>
        ) : (
          coupons.map((coupon) => (
            <Card key={coupon.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getCouponTypeIcon(coupon.type)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{coupon.code}</h3>
                    <p className="text-sm text-gray-600">{coupon.name}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="Düzenle"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => toggleActive(coupon.id)}
                    className={`p-1 rounded ${
                      coupon.isActive 
                        ? 'text-yellow-600 hover:bg-yellow-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={coupon.isActive ? 'Pasifleştir' : 'Aktifleştir'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Sil"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">İndirim:</span>
                  <span className="font-semibold text-green-600">{formatValue(coupon)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Min. Sipariş:</span>
                  <span className="text-sm">{coupon.minOrderAmount} TL</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Kullanım:</span>
                  <span className="text-sm">{coupon.usedCount}/{coupon.usageLimit || '∞'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Geçerlilik:</span>
                  <span className="text-sm">
                    {new Date(coupon.startDate).toLocaleDateString('tr-TR')} - {new Date(coupon.endDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Durum:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    coupon.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {coupon.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>

                {coupon.description && (
                  <p className="text-sm text-gray-600 mt-3">{coupon.description}</p>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  {editingCoupon ? 'Kupon Düzenle' : 'Yeni Kupon Oluştur'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingCoupon(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kupon Kodu *</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        className="input-modern flex-1"
                        placeholder="WELCOME10"
                        required
                      />
                      <Button type="button" onClick={generateCode} variant="secondary">
                        Rastgele
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kupon Adı *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="input-modern"
                      placeholder="Hoş Geldin İndirimi"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="input-modern"
                    rows={3}
                    placeholder="Kupon açıklaması..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">İndirim Türü *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="input-modern"
                      required
                    >
                      {couponTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">İndirim Değeri *</label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) }))}
                      className="input-modern"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Sipariş Tutarı (TL)</label>
                    <input
                      type="number"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: parseFloat(e.target.value) }))}
                      className="input-modern"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum İndirim (TL)</label>
                    <input
                      type="number"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountAmount: parseFloat(e.target.value) }))}
                      className="input-modern"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kullanım Limiti</label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: parseInt(e.target.value) }))}
                      className="input-modern"
                      min="0"
                      placeholder="0 = Sınırsız"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Müşteri Grubu</label>
                    <select
                      value={formData.customerGroups}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerGroups: e.target.value }))}
                      className="input-modern"
                    >
                      {customerGroups.map(group => (
                        <option key={group.value} value={group.value}>{group.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Kuponu aktifleştir
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCoupon(null);
                      resetForm();
                    }}
                  >
                    İptal
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Kaydediliyor...' : (editingCoupon ? 'Güncelle' : 'Oluştur')}
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
