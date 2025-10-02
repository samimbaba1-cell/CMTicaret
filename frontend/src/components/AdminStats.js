"use client";
import { useEffect, useState } from "react";
import { getApiBaseUrl } from "../lib/api";

export default function AdminStats() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch(`${getApiBaseUrl()}/api/products?limit=1`),
          fetch(`${getApiBaseUrl()}/api/orders`)
        ]);
        
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        
        const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
        const pendingOrders = ordersData.filter(order => order.status === 'pending').length;
        
        setStats({
          totalProducts: productsData.total || 0,
          totalOrders: ordersData.length || 0,
          totalRevenue,
          pendingOrders
        });
      } catch (error) {
        console.error('Stats fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4">İstatistikler</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Toplam Ürün</span>
          <span className="font-semibold text-blue-600">{stats.totalProducts}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Toplam Sipariş</span>
          <span className="font-semibold text-green-600">{stats.totalOrders}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Toplam Gelir</span>
          <span className="font-semibold text-purple-600">₺{stats.totalRevenue.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Bekleyen Sipariş</span>
          <span className="font-semibold text-orange-600">{stats.pendingOrders}</span>
        </div>
      </div>
    </div>
  );
}
