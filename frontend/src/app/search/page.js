"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import LazyImage from "../../components/LazyImage";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import ProductCard from "../../components/ProductCard";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import VirtualizedList from "../../components/VirtualizedList";
import useDebounce from "../../hooks/useDebounce";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    query: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    minPrice: "",
    maxPrice: "",
    sortBy: "relevance",
    inStock: false
  });

  const debouncedQuery = useDebounce(filters.query, 300);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (debouncedQuery || filters.category) {
      searchProducts();
    }
  }, [debouncedQuery, filters.category, filters.minPrice, filters.maxPrice, filters.sortBy, filters.inStock, pagination.page]);

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      const data = await response.json();
      if (response.ok) {
        setCategories(data);
      }
    } catch (error) {
      console.error("Categories load error:", error);
    }
  };

  const searchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      if (debouncedQuery) queryParams.append("search", debouncedQuery);
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
      if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
      if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
      if (filters.inStock) queryParams.append("inStock", "true");
      
      queryParams.append("page", pagination.page);
      queryParams.append("limit", pagination.limit);

      const response = await fetch(`${API_URL}/api/products?${queryParams}`);
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.items || []);
        setPagination(prev => ({
          ...prev,
          total: data.total || 0,
          totalPages: data.totalPages || 0
        }));
      }
    } catch (error) {
      console.error("Search error:", error);
    }
    setLoading(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    searchProducts();
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "relevance",
      inStock: false
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getSortOptions = () => [
    { value: "relevance", label: "En İlgili" },
    { value: "price_asc", label: "Fiyat (Düşük → Yüksek)" },
    { value: "price_desc", label: "Fiyat (Yüksek → Düşük)" },
    { value: "name_asc", label: "İsim (A → Z)" },
    { value: "name_desc", label: "İsim (Z → A)" },
    { value: "newest", label: "En Yeni" },
    { value: "oldest", label: "En Eski" },
    { value: "rating", label: "En Yüksek Puan" }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ürün Arama</h1>
        <p className="text-gray-600 mt-2">Aradığınız ürünleri bulun</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Filtreler</h2>
            
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
                  <input
                    type="text"
                    value={filters.query}
                    onChange={(e) => handleFilterChange("query", e.target.value)}
                    placeholder="Ürün adı, marka..."
                    className="input-modern"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className="input-modern"
                  >
                    <option value="">Tüm Kategoriler</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Fiyat</label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                      placeholder="0"
                      className="input-modern"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Fiyat</label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                      placeholder="∞"
                      className="input-modern"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange("inStock", e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
                    Sadece Stokta Olanlar
                  </label>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1 btn-primary">
                    Ara
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={clearFilters}
                    className="flex-1"
                  >
                    Temizle
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {/* Sort and Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <span className="text-sm text-gray-600">
                {pagination.total} ürün bulundu
              </span>
              {filters.query && (
                <span className="text-sm text-gray-500">
                  &quot;{filters.query}&quot; için sonuçlar
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sırala:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="input-modern"
              >
                {getSortOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <LoadingSkeleton key={i} type="product" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ürün Bulunamadı</h3>
              <p className="text-gray-600 mb-8">
                Arama kriterlerinize uygun ürün bulunamadı. Filtreleri değiştirmeyi deneyin.
              </p>
              <Button onClick={clearFilters} className="btn-primary">
                Filtreleri Temizle
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      disabled={pagination.page === 1}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                      Önceki
                    </Button>
                    
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const page = i + 1;
                      const isCurrentPage = page === pagination.page;
                      const showPage = 
                        page === 1 || 
                        page === pagination.totalPages || 
                        (page >= pagination.page - 1 && page <= pagination.page + 1);
                      
                      if (!showPage) {
                        if (page === pagination.page - 2 || page === pagination.page + 2) {
                          return <span key={page} className="px-3 py-2 text-gray-500">...</span>;
                        }
                        return null;
                      }
                      
                      return (
                        <Button
                          key={page}
                          variant={isCurrentPage ? "primary" : "secondary"}
                          onClick={() => setPagination(prev => ({ ...prev, page }))}
                          className={isCurrentPage ? "btn-primary" : ""}
                        >
                          {page}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="secondary"
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                      Sonraki
                    </Button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}