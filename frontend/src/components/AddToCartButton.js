"use client";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function AddToCartButton({ productId, className = "", children = "Sepete Ekle" }) {
  const { addItem } = useCart();
  const { show } = useToast();

  return (
    <button
      onClick={() => { addItem(productId, 1); show("Sepete eklendi", "success"); }}
      className={`text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 ${className}`}
    >
      {children}
    </button>
  );
}
