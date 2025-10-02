"use client";
import React from 'react';

export default function LoadingSkeleton({ type = 'product', count = 1 }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'product':
        return (
          <div className="card-modern overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse"></div>
            <div className="card-modern-body space-y-3">
              <div className="skeleton-title"></div>
              <div className="flex items-center space-x-2">
                <div className="skeleton h-4 w-16"></div>
                <div className="skeleton h-4 w-12"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="skeleton h-6 w-20"></div>
                <div className="skeleton h-4 w-16"></div>
              </div>
            </div>
          </div>
        );
      
      case 'product-detail':
        return (
          <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-6">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        );
      
      case 'cart-item':
        return (
          <div className="flex items-center justify-between border rounded p-3 bg-white animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded">
                <div className="w-8 h-8 bg-gray-200"></div>
                <div className="w-10 h-8 bg-gray-200"></div>
                <div className="w-8 h-8 bg-gray-200"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        );
      
      case 'order-item':
        return (
          <div className="border rounded p-4 bg-white animate-pulse">
            <div className="flex justify-between items-start mb-3">
              <div className="h-5 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        );
      
      default:
        return <div className="animate-pulse bg-gray-200 rounded h-4 w-full"></div>;
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}
