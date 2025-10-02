"use client";
import { useEffect, useRef, useState } from "react";
import { getApiBaseUrl } from "../lib/api";
import { trackSearch } from "./GoogleAnalytics";

export default function SearchBox() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!q) { setResults([]); setOpen(false); return; }
    timeoutRef.current = setTimeout(async () => {
      try {
        const url = new URL(`${getApiBaseUrl()}/api/products`);
        url.searchParams.set("q", q);
        url.searchParams.set("limit", "5");
        const res = await fetch(url.toString());
        const data = await res.json();
        setResults(data.items || []);
        setOpen(true);
      } catch (_) {
        setResults([]);
        setOpen(false);
      }
    }, 250);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [q]);

  return (
    <div className="relative w-64">
      <form onSubmit={(e)=>{
        e.preventDefault(); 
        if (q.trim()) {
          trackSearch(q.trim());
        }
        window.location.href = q ? `/search?q=${encodeURIComponent(q)}` : "/search";
      }}>
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Ara..." className="w-full border rounded px-3 py-2" />
      </form>
      {open && results.length > 0 && (
        <div className="absolute z-40 mt-1 w-full bg-white border rounded shadow">
          {results.map(r => (
            <a key={r._id} href={`/product/${r._id}`} className="block px-3 py-2 hover:bg-gray-50">
              <div className="text-sm font-medium line-clamp-1">{r.name}</div>
              <div className="text-xs text-gray-600">₺{Number(r.price||0).toFixed(2)}</div>
            </a>
          ))}
          <div className="px-3 py-2 text-xs text-gray-600 border-t">Enter ile ara</div>
        </div>
      )}
    </div>
  );
}
