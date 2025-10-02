"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import IyzicoPaymentForm from "../../components/IyzicoPaymentForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    shippingAddress: {
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Turkey",
      phone: ""
    },
    billingAddress: {
      sameAsShipping: true,
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Turkey",
      phone: ""
    },
    paymentMethod: "credit_card",
    notes: ""
  });

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (items.length === 0) {
      router.push("/cart");
      return;
    }
  }, [user, items, router]);

  const handleInputChange = (field, value, isBilling = false) => {
    const addressType = isBilling ? "billingAddress" : "shippingAddress";
    setOrderData(prev => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [field]: value
      }
    }));
  };

  const handleSameAsShippingChange = (checked) => {
    setOrderData(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        sameAsShipping: checked,
        ...(checked ? prev.shippingAddress : {})
      }
    }));
  };

  const handleSubmit = async (paymentData) => {
    setLoading(true);
    try {
      const orderPayload = {
        ...orderData,
        items: items.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal,
        shipping,
        total,
        paymentData
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(orderPayload)
      });

      const result = await response.json();

      if (response.ok) {
        clearCart();
        router.push(`/payment/success?orderId=${result.orderId}`);
      } else {
        throw new Error(result.message || "Sipariş oluşturulamadı");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Sipariş oluşturulurken bir hata oluştu: " + error.message);
    }
    setLoading(false);
  };

  if (!user || items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Ödeme Sayfası</h1>
          <p className="text-gray-600 mb-8">Ödeme yapmak için sepetinizde ürün bulunmalıdır</p>
          <Button onClick={() => router.push("/cart")} className="btn-primary">
            Sepete Git
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ödeme</h1>
        <p className="text-gray-600 mt-2">Siparişinizi tamamlamak için bilgilerinizi girin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Teslimat Adresi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad *</label>
                <input
                  type="text"
                  value={orderData.shippingAddress.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="input-modern"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soyad *</label>
                <input
                  type="text"
                  value={orderData.shippingAddress.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="input-modern"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Şirket</label>
                <input
                  type="text"
                  value={orderData.shippingAddress.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="input-modern"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Adres *</label>
                <textarea
                  value={orderData.shippingAddress.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="input-modern"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şehir *</label>
                <input
                  type="text"
                  value={orderData.shippingAddress.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="input-modern"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İlçe *</label>
                <input
                  type="text"
                  value={orderData.shippingAddress.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="input-modern"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Posta Kodu *</label>
                <input
                  type="text"
                  value={orderData.shippingAddress.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  className="input-modern"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                <input
                  type="tel"
                  value={orderData.shippingAddress.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="input-modern"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Billing Address */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Fatura Adresi</h2>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={orderData.billingAddress.sameAsShipping}
                  onChange={(e) => handleSameAsShippingChange(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Teslimat adresi ile aynı</span>
              </label>
            </div>

            {!orderData.billingAddress.sameAsShipping && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad *</label>
                  <input
                    type="text"
                    value={orderData.billingAddress.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value, true)}
                    className="input-modern"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soyad *</label>
                  <input
                    type="text"
                    value={orderData.billingAddress.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value, true)}
                    className="input-modern"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şirket</label>
                  <input
                    type="text"
                    value={orderData.billingAddress.company}
                    onChange={(e) => handleInputChange("company", e.target.value, true)}
                    className="input-modern"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adres *</label>
                  <textarea
                    value={orderData.billingAddress.address}
                    onChange={(e) => handleInputChange("address", e.target.value, true)}
                    className="input-modern"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şehir *</label>
                  <input
                    type="text"
                    value={orderData.billingAddress.city}
                    onChange={(e) => handleInputChange("city", e.target.value, true)}
                    className="input-modern"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İlçe *</label>
                  <input
                    type="text"
                    value={orderData.billingAddress.state}
                    onChange={(e) => handleInputChange("state", e.target.value, true)}
                    className="input-modern"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Posta Kodu *</label>
                  <input
                    type="text"
                    value={orderData.billingAddress.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value, true)}
                    className="input-modern"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                  <input
                    type="tel"
                    value={orderData.billingAddress.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value, true)}
                    className="input-modern"
                    required
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Ödeme Yöntemi</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={orderData.paymentMethod === "credit_card"}
                  onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="text-primary focus:ring-primary"
                />
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="font-medium">Kredi Kartı</span>
                </div>
              </label>
            </div>
          </Card>

          {/* Order Notes */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Sipariş Notları</h2>
            <textarea
              value={orderData.notes}
              onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
              className="input-modern"
              rows={4}
              placeholder="Siparişinizle ilgili özel notlarınızı buraya yazabilirsiniz..."
            />
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Sipariş Özeti</h2>
            
            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item._id} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.images && item.images[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ₺{Number(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Ara Toplam</span>
                <span className="font-medium">₺{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Kargo</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">Ücretsiz</span>
                  ) : (
                    `₺${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              
              <hr className="border-gray-200" />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Toplam</span>
                <span>₺{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Form */}
            <div className="mt-6">
              <IyzicoPaymentForm
                total={total}
                onSubmit={handleSubmit}
                loading={loading}
              />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}