"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { apiFetch, getApiBaseUrl } from "../../../../lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function AdminNewProductPage() {
  const { token } = useAuth();
  const [form, setForm] = useState({ name: "", price: "", stock: "", category: "", description: "" });
  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${getApiBaseUrl()}/api/categories`).then(r=>r.json()).then(setCategories).catch(()=>{});
  }, []);

  const uploadImages = async () => {
    const urls = [];
    for (const f of imageFiles) {
      const fd = new FormData();
      fd.append('image', f);
      const res = await fetch(`${API_URL}/api/products/upload-image`, { method:'POST', headers: { ...(token? { Authorization: `Bearer ${token}` }: {}) }, body: fd });
      if (!res.ok) throw new Error('Görsel yüklenmedi');
      const data = await res.json();
      urls.push(data.url);
    }
    return urls;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      let urls = imageUrls;
      if (urls.length === 0 && imageFiles.length) {
        urls = await uploadImages();
        setImageUrls(urls);
      }
      const payload = {
        name: form.name,
        price: Number(form.price||0),
        stock: Number(form.stock||0),
        category: form.category || undefined,
        description: form.description || "",
        images: urls,
      };
      const result = await apiFetch('/api/products/add', { method:'POST', body: payload, token });
      setMessage('Ürün eklendi: ' + result.product._id);
      setForm({ name: "", price: "", stock: "", category: "", description: "" });
      setImageFiles([]);
      setImageUrls([]);
    } catch (e) {
      setMessage(e.message || 'Kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  if (!token) return <main className="max-w-5xl mx-auto p-6">Giriş yapmalısınız.</main>;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Yeni Ürün</h1>
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
          <label className="block text-sm mb-1">Kategori</label>
          <select value={form.category} onChange={(e)=>setForm(f=>({...f, category:e.target.value}))} className="w-full border rounded px-3 py-2">
            <option value="">Seçiniz</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Açıklama</label>
          <textarea value={form.description} onChange={(e)=>setForm(f=>({...f, description:e.target.value}))} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Görseller</label>
          <input type="file" multiple onChange={(e)=>setImageFiles(Array.from(e.target.files || []))} />
          {imageUrls.length>0 && <div className="mt-2 text-sm text-green-700">Yüklendi: {imageUrls.length} görsel</div>}
        </div>
        <button disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
      </form>
    </main>
  );
}
