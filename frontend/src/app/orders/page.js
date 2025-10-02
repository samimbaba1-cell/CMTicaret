"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../lib/api";
import Link from "next/link";

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const data = await apiFetch("/api/orders", { token });
        setOrders(data || []);
      } catch (e) {
        setError(e.message || "Siparişler alınamadı");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  if (!token) return <main className="max-w-5xl mx-auto p-6">Giriş yapmalısınız.</main>;
  if (loading) return <main className="max-w-5xl mx-auto p-6">Yükleniyor...</main>;
  if (error) return <main className="max-w-5xl mx-auto p-6 text-red-600">{error}</main>;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Siparişlerim</h1>
      {orders.length === 0 ? (
        <div>Henüz siparişiniz yok.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="border rounded bg-white">
              <div className="p-3 border-b flex items-center justify-between text-sm text-gray-600">
                <a href={`/orders/${o._id}`} className="hover:underline">#{o._id}</a>
                <div>Durum: <span className="font-medium">{o.status}</span></div>
                <div>Toplam: <span className="font-semibold">₺{Number(o.totalPrice||0).toFixed(2)}</span></div>
              </div>
              <div className="p-3 divide-y">
                {o.items?.map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                        {it.product?.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={it.product.images[0]} alt={it.product?.name||"Ürün"} className="w-full h-full object-cover" />
                        ) : <span>No Image</span>}
                      </div>
                      <Link href={`/product/${it.product?._id || it.product}`}>{it.product?.name || "Ürün"}</Link>
                    </div>
                    <div className="text-sm text-gray-700">{it.quantity} adet</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
