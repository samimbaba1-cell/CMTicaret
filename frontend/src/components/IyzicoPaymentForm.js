"use client";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { trackPurchase } from "./GoogleAnalytics";

const IyzicoPaymentForm = ({ onSuccess, onError }) => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      showToast("Sepetiniz boş", "error");
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment request
      const response = await fetch("/api/payment/create-iyzico-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          userId: user?.id,
          paymentMethod: paymentMethod,
        }),
      });

      const { paymentForm, error: backendError } = await response.json();

      if (backendError) {
        throw new Error(backendError);
      }

      if (paymentMethod === "card") {
        // For card payments, redirect to Iyzico payment form
        window.location.href = paymentForm;
      } else {
        // For other payment methods (like bank transfer), create order directly
        const orderResponse = await fetch("/api/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
          },
          body: JSON.stringify({
            items: cart.map(item => ({ 
              product: item.product, 
              quantity: item.quantity 
            })),
            shippingAddress: {
              fullName: user?.name || "Guest",
              line1: "Adres bilgisi",
              city: "İstanbul",
              phone: "555-555-5555"
            },
            paymentMethod: paymentMethod,
          }),
        });

        const orderResult = await orderResponse.json();
        
        if (orderResult.success) {
          // Track purchase in analytics
          const items = cart.map(item => ({
            item_id: item.product,
            item_name: item.productData?.name || 'Product',
            item_category: item.productData?.category?.name || 'Uncategorized',
            quantity: item.quantity,
            price: item.productData?.price || 0,
          }));
          
          trackPurchase(
            orderResult.order._id,
            cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0),
            'TRY',
            items
          );
          
          clearCart();
          showToast("Sipariş başarıyla oluşturuldu!", "success");
          onSuccess?.(orderResult.order);
        } else {
          throw new Error(orderResult.message || "Sipariş oluşturulamadı");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      showToast(error.message || "Ödeme işlemi başarısız. Lütfen tekrar deneyin.", "error");
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Ödeme Yöntemi Seçin</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-blue-600"
            />
            <div>
              <div className="font-medium">Kredi/Banka Kartı</div>
              <div className="text-sm text-gray-600">Iyzico ile güvenli ödeme</div>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="bank_transfer"
              checked={paymentMethod === "bank_transfer"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-blue-600"
            />
            <div>
              <div className="font-medium">Banka Havalesi</div>
              <div className="text-sm text-gray-600">Hesap bilgileri ile ödeme</div>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-blue-600"
            />
            <div>
              <div className="font-medium">Kapıda Ödeme</div>
              <div className="text-sm text-gray-600">Teslimat sırasında nakit ödeme</div>
            </div>
          </label>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <span>Toplam Tutar:</span>
          <span className="font-semibold text-lg">
            ₺{totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? "İşleniyor..." : `₺${totalAmount.toFixed(2)} Öde`}
      </button>
    </form>
  );
};

export default IyzicoPaymentForm;
