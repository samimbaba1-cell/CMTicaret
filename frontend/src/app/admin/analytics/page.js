"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    overview: {
      totalVisitors: 0,
      totalPageViews: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
      conversionRate: 0
    },
    traffic: {
      sources: [],
      devices: [],
      countries: [],
      browsers: []
    },
    sales: {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
      topProducts: []
    },
    realTime: {
      activeUsers: 0,
      currentPage: '',
      location: ''
    }
  });
  const [dateRange, setDateRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('visitors');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics?range=${dateRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        // Mock data for demo
        setAnalytics({
          overview: {
            totalVisitors: 12543,
            totalPageViews: 45678,
            bounceRate: 42.5,
            avgSessionDuration: 3.2,
            conversionRate: 2.8
          },
          traffic: {
            sources: [
              { name: 'Google', value: 45, color: '#4285F4' },
              { name: 'Direct', value: 25, color: '#34A853' },
              { name: 'Social Media', value: 15, color: '#EA4335' },
              { name: 'Email', value: 10, color: '#FBBC04' },
              { name: 'Other', value: 5, color: '#9AA0A6' }
            ],
            devices: [
              { name: 'Desktop', value: 60, color: '#3B82F6' },
              { name: 'Mobile', value: 35, color: '#10B981' },
              { name: 'Tablet', value: 5, color: '#F59E0B' }
            ],
            countries: [
              { name: 'Türkiye', value: 75, visitors: 9407 },
              { name: 'Almanya', value: 12, visitors: 1505 },
              { name: 'Fransa', value: 8, visitors: 1003 },
              { name: 'İngiltere', value: 5, visitors: 628 }
            ],
            browsers: [
              { name: 'Chrome', value: 65, color: '#4285F4' },
              { name: 'Safari', value: 20, color: '#000000' },
              { name: 'Firefox', value: 10, color: '#FF9500' },
              { name: 'Edge', value: 5, color: '#0078D4' }
            ]
          },
          sales: {
            totalRevenue: 125430.50,
            totalOrders: 456,
            avgOrderValue: 275.25,
            topProducts: [
              { name: 'iPhone 15 Pro', revenue: 12500, orders: 25 },
              { name: 'Samsung Galaxy S24', revenue: 9800, orders: 20 },
              { name: 'MacBook Air M2', revenue: 8500, orders: 10 },
              { name: 'iPad Pro', revenue: 7200, orders: 15 },
              { name: 'AirPods Pro', revenue: 4500, orders: 30 }
            ]
          },
          realTime: {
            activeUsers: 23,
            currentPage: 'Ana Sayfa',
            location: 'İstanbul, Türkiye'
          }
        });
      }
    } catch (error) {
      console.error("Analytics load error:", error);
      showToast("Analitik veriler yüklenirken hata oluştu!", "error");
    }
    setLoading(false);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
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
    <main className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Analitik Dashboard</h1>
            <p className="text-gray-600">Site performansı ve kullanıcı davranışları</p>
          </div>
          
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1d">Son 24 Saat</option>
              <option value="7d">Son 7 Gün</option>
              <option value="30d">Son 30 Gün</option>
              <option value="90d">Son 90 Gün</option>
            </select>
            
            <Button
              onClick={loadAnalytics}
              disabled={loading}
              variant="secondary"
            >
              {loading ? "Yükleniyor..." : "Yenile"}
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Ziyaretçi</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatNumber(analytics.overview.totalVisitors)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sayfa Görüntüleme</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatNumber(analytics.overview.totalPageViews)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.overview.bounceRate}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ort. Oturum</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.overview.avgSessionDuration}m
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dönüşüm Oranı</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.overview.conversionRate}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Real-time Stats */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Canlı Durum</h3>
            <p className="text-sm text-gray-600">Şu anda sitede aktif kullanıcılar</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">
              {analytics.realTime.activeUsers}
            </div>
            <div className="text-sm text-gray-600">
              {analytics.realTime.currentPage} • {analytics.realTime.location}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Traffic Sources */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trafik Kaynakları</h3>
          <div className="space-y-3">
            {analytics.traffic.sources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: source.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">{source.name}</span>
                </div>
                <span className="text-sm text-gray-600">{source.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Device Types */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cihaz Türleri</h3>
          <div className="space-y-3">
            {analytics.traffic.devices.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: device.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">{device.name}</span>
                </div>
                <span className="text-sm text-gray-600">{device.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sales Overview */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Satış Özeti</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(analytics.sales.totalRevenue)}
            </div>
            <div className="text-sm text-gray-600">Toplam Gelir</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {analytics.sales.totalOrders}
            </div>
            <div className="text-sm text-gray-600">Toplam Sipariş</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {formatCurrency(analytics.sales.avgOrderValue)}
            </div>
            <div className="text-sm text-gray-600">Ortalama Sipariş Değeri</div>
          </div>
        </div>
      </Card>

      {/* Top Products */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">En Çok Satan Ürünler</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-sm font-medium text-gray-600">Ürün</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Gelir</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Sipariş</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Ort. Değer</th>
              </tr>
            </thead>
            <tbody>
              {analytics.sales.topProducts.map((product, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="py-3 text-sm text-gray-600">{formatCurrency(product.revenue)}</td>
                  <td className="py-3 text-sm text-gray-600">{product.orders}</td>
                  <td className="py-3 text-sm text-gray-600">
                    {formatCurrency(product.revenue / product.orders)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}
