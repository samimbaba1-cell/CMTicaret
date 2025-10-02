"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { apiFetch, getApiBaseUrl } from "../../../lib/api";

export default function AdminCategoriesPage() {
  const { user, token } = useAuth();
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch(`${getApiBaseUrl()}/api/categories`);
    setItems(await res.json());
  };

  useEffect(() => { load(); }, []);

  if (!user?.isAdmin) return <main className="max-w-5xl mx-auto p-6">Yetkisiz</main>;

  const createCat = async () => {
    setSaving(true);
    try { await apiFetch('/api/categories/add', { method:'POST', body:{ name }, token }); setName(""); await load(); } finally { setSaving(false); }
  };
  const updateCat = async (id, nextName) => { await apiFetch(`/api/categories/${id}`, { method:'PUT', body:{ name: nextName }, token }); await load(); };
  const deleteCat = async (id) => { await apiFetch(`/api/categories/${id}`, { method:'DELETE', token }); await load(); };

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Kategoriler (Admin)</h1>
      <div className="flex items-end gap-2 mb-4">
        <div className="flex-1">
          <label className="block text-sm mb-1">Kategori Adı</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <button disabled={saving || !name} onClick={createCat} className="h-10 px-3 bg-blue-600 text-white rounded">Ekle</button>
      </div>
      <div className="space-y-2">
        {items.map(c => (
          <div key={c._id} className="flex items-center justify-between border rounded p-3 bg-white">
            <input defaultValue={c.name} onBlur={(e)=>updateCat(c._id, e.target.value)} className="border rounded px-2 py-1" />
            <button onClick={()=>deleteCat(c._id)} className="text-sm text-red-600 hover:underline">Sil</button>
          </div>
        ))}
      </div>
    </main>
  );
}
