const iyzipay = require('iyzipay');
const crypto = require('crypto');

class IyzicoService {
  constructor() {
    this.apiKey = process.env.IYZICO_API_KEY || 'test_api_key';
    this.secretKey = process.env.IYZICO_SECRET_KEY || 'test_secret_key';
    this.baseUrl = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'; // Use sandbox for testing
    
    // Only initialize Iyzico if we have real API keys
    if (this.apiKey !== 'test_api_key' && this.secretKey !== 'test_secret_key') {
      this.iyzipay = new iyzipay({
        apiKey: this.apiKey,
        secretKey: this.secretKey,
        uri: this.baseUrl
      });
    } else {
      this.iyzipay = null;
      console.log('⚠️  Iyzico API keys not configured. Payment features will be disabled.');
    }
  }

  // Create payment form for card payments
  async createPaymentForm(paymentData) {
    if (!this.iyzipay) {
      throw new Error('Iyzico API keys not configured');
    }
    
    try {
      const request = {
        locale: 'tr',
        conversationId: paymentData.conversationId,
        price: paymentData.price.toFixed(2),
        paidPrice: paymentData.price.toFixed(2),
        currency: 'TRY',
        installment: '1',
        basketId: paymentData.basketId,
        paymentChannel: 'WEB',
        paymentGroup: 'PRODUCT',
        callbackUrl: `${process.env.FRONTEND_URL}/payment/callback`,
        enabledInstallments: [2, 3, 6, 9],
        buyer: {
          id: paymentData.buyerId,
          name: paymentData.buyerName,
          surname: paymentData.buyerSurname,
          gsmNumber: paymentData.buyerPhone,
          email: paymentData.buyerEmail,
          identityNumber: paymentData.buyerIdentityNumber || '11111111111',
          lastLoginDate: new Date().toISOString().split('T')[0] + ' 12:00:00',
          registrationDate: new Date().toISOString().split('T')[0] + ' 12:00:00',
          registrationAddress: paymentData.buyerAddress,
          city: paymentData.buyerCity,
          country: 'Turkey',
          zipCode: '34000',
          ip: paymentData.buyerIp || '127.0.0.1'
        },
        shippingAddress: {
          contactName: paymentData.shippingName,
          city: paymentData.shippingCity,
          country: 'Turkey',
          address: paymentData.shippingAddress,
          zipCode: '34000'
        },
        billingAddress: {
          contactName: paymentData.buyerName + ' ' + paymentData.buyerSurname,
          city: paymentData.buyerCity,
          country: 'Turkey',
          address: paymentData.buyerAddress,
          zipCode: '34000'
        },
        basketItems: paymentData.basketItems
      };

      return new Promise((resolve, reject) => {
        this.iyzipay.threedsInitialize.create(request, (err, result) => {
          if (err) {
            console.error('Iyzico payment form creation error:', err);
            reject(err);
          } else {
            if (result.status === 'success') {
              resolve(result.paymentPageUrl);
            } else {
              reject(new Error(result.errorMessage || 'Payment form creation failed'));
            }
          }
        });
      });
    } catch (error) {
      console.error('Iyzico service error:', error);
      throw error;
    }
  }

  // Verify payment callback
  async verifyPayment(token) {
    try {
      const request = {
        locale: 'tr',
        conversationId: token,
        token: token
      };

      return new Promise((resolve, reject) => {
        this.iyzipay.threedsPayment.create(request, (err, result) => {
          if (err) {
            console.error('Iyzico payment verification error:', err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      console.error('Iyzico verification error:', error);
      throw error;
    }
  }

  // Create refund
  async createRefund(paymentId, amount) {
    try {
      const request = {
        locale: 'tr',
        conversationId: paymentId,
        paymentTransactionId: paymentId,
        price: amount.toFixed(2),
        currency: 'TRY'
      };

      return new Promise((resolve, reject) => {
        this.iyzipay.refund.create(request, (err, result) => {
          if (err) {
            console.error('Iyzico refund error:', err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      console.error('Iyzico refund error:', error);
      throw error;
    }
  }

  // Generate conversation ID
  generateConversationId() {
    return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Generate basket ID
  generateBasketId() {
    return 'basket_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = new IyzicoService();
