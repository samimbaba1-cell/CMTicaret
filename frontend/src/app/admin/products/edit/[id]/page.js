"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "../../../../../context/AuthContext";
import { apiFetch, getApiBaseUrl } from "../../../../../lib/api";

export default function AdminEditProductPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [form, setForm] = useState({ name: "", price: "", stock: "", categoryName: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/products/${id}`);
        const p = await res.json();
        setForm({ name: p.name||"", price: String(p.price||0), stock: String(p.stock||0), categoryName: p.category?.name || "", description: p.description||"" });
      } catch (_) {}
      setLoading(false);
    };
    if (id) load();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        name: form.name,
        price: Number(form.price||0),
        stock: Number(form.stock||0),
        description: form.description || "",
      };
      // category by name is handled only on add; keep simple for edit
      const result = await apiFetch(`/api/products/${id}`, { method:'PUT', body: payload, token });
      setMessage('Ürün güncellendi: ' + result.product._id);
    } catch (e) {
      setMessage(e.message || 'Kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  if (!token) return <main className="max-w-5xl mx-auto p-6">Giriş yapmalısınız.</main>;
  if (loading) return <main className="max-w-5xl mx-auto p-6">Yükleniyor...</main>;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Ürün Düzenle</h1>
      {message && <div className="mb-3 text-sm">{message}</div>}
      <form onSubmit={onSubmit} className="space-y-3 bg-white border rounded p-4">
        <div>
          <label className="block text-sm mb-1">İsim</label>
          <input value={form.name} onChange={(e)=>setForm(f=>({...f, name:e.target.value}))} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Fiyat</label>
            <input value={form.price} onChange={(e)=>setForm(f=>({...f, price:e.target.value}))} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Stok</label>
            <input value={form.stock} onChange={(e)=>setForm(f=>({...f, stock:e.target.value}))} className="w-full border rounded px-3 py-2" required />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Açıklama</label>
          <textarea value={form.description} onChange={(e)=>setForm(f=>({...f, description:e.target.value}))} className="w-full border rounded px-3 py-2" />
        </div>
        <button disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
      </form>
    </main>
  );
}
