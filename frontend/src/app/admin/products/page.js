"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function AdminProductsPage() {
  const { user, token } = useAuth();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const load = async (page=1) => {
    setLoading(true);
    const url = new URL(`${API_URL}/api/products`);
    url.searchParams.set('limit', '20');
    url.searchParams.set('page', String(page));
    const res = await fetch(url.toString());
    const data = await res.json();
    setItems(data.items || []);
    setPagination({ page: data.page, pages: data.pages, total: data.total });
    setLoading(false);
  };

  useEffect(() => { load(1); }, []);

  if (!user?.isAdmin) return <main className="max-w-6xl mx-auto p-6">Yetkisiz</main>;

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Ürünler (Admin)</h1>
        <a href="/admin/products/new" className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm">Yeni Ürün</a>
      </div>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="space-y-2">
          {items.map(p => (
            <div key={p._id} className="flex items-center justify-between border rounded p-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100" />
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-600">Stok: {p.stock ?? 0} - ₺{Number(p.price||0).toFixed(2)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <a href={`/product/${p._id}`} className="text-blue-600 hover:underline">Görüntüle</a>
                <a href={`/admin/products/edit/${p._id}`} className="text-gray-700 hover:underline">Düzenle</a>
              </div>
            </div>
          ))}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {Array.from({ length: pagination.pages }).map((_, i) => {
                const pageNum = i + 1;
                const isActive = pagination.page === pageNum;
                return (
                  <button key={pageNum} onClick={()=>load(pageNum)} className={`px-3 py-1 rounded border ${isActive ? 'bg-gray-800 text-white' : 'bg-white hover:bg-gray-50'}`}>{pageNum}</button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
