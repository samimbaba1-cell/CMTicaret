"use client";
import { useEffect, useState, Suspense } from "react";
import { useAuth } from "../../../context/AuthContext";
import { apiFetch } from "../../../lib/api";

export default function AdminOrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/orders', { token });
      setOrders(data || []);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { if (token && user?.isAdmin) load(); }, [token, user?.isAdmin]);

  const updateStatus = async (id, status) => {
    await apiFetch(`/api/orders/${id}/status`, { method:'PATCH', body:{ status }, token });
    await load();
  };

  if (!user?.isAdmin) return <main className="max-w-6xl mx-auto p-6">Yetkisiz</main>;

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Siparişler (Admin)</h1>
      <Suspense fallback={<div>Yükleniyor...</div>}>
        {loading ? 'Yükleniyor...' : (
          <div className="space-y-3">
            {orders.map(o => (
              <div key={o._id} className="border rounded p-3 bg-white">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <div>#{o._id}</div>
                  <div>Toplam: ₺{Number(o.totalPrice||0).toFixed(2)}</div>
                  <select value={o.status} onChange={(e)=>updateStatus(o._id, e.target.value)} className="border rounded px-2 py-1">
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="shipped">shipped</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </Suspense>
    </main>
  );
}
