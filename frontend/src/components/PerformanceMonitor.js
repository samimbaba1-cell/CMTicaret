"use client";
import { useEffect } from "react";

export default function PerformanceMonitor() {
  useEffect(() => {
    // Web Vitals monitoring
    if (typeof window !== "undefined" && "performance" in window) {
      // First Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            console.log("FCP:", entry.startTime);
          }
        }
      });
      
      observer.observe({ entryTypes: ["paint"] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log("LCP:", lastEntry.startTime);
      });
      
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        console.log("CLS:", clsValue);
      });
      
      clsObserver.observe({ entryTypes: ["layout-shift"] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log("FID:", entry.processingStart - entry.startTime);
        }
      });
      
      fidObserver.observe({ entryTypes: ["first-input"] });

      // Memory usage (if available)
      if ("memory" in performance) {
        console.log("Memory:", {
          used: Math.round(performance.memory.usedJSHeapSize / 1048576) + " MB",
          total: Math.round(performance.memory.totalJSHeapSize / 1048576) + " MB",
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) + " MB"
        });
      }
    }
  }, []);

  return null;
}
