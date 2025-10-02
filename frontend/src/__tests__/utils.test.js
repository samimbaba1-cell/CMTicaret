// Utility functions tests
describe('Utility Functions', () => {
  // Test price formatting
  test('formats price correctly', () => {
    const formatPrice = (price) => `₺${Number(price || 0).toFixed(2)}`;
    
    expect(formatPrice(100)).toBe('₺100.00');
    expect(formatPrice(99.99)).toBe('₺99.99');
    expect(formatPrice(0)).toBe('₺0.00');
    expect(formatPrice(null)).toBe('₺0.00');
    expect(formatPrice(undefined)).toBe('₺0.00');
  });

  // Test cart calculations
  test('calculates cart total correctly', () => {
    const calculateTotal = (items) => {
      return items.reduce((total, item) => {
        return total + (item.productData?.price || 0) * item.quantity;
      }, 0);
    };

    const items = [
      { productData: { price: 100 }, quantity: 2 },
      { productData: { price: 50 }, quantity: 1 },
      { productData: { price: 25 }, quantity: 4 }
    ];

    expect(calculateTotal(items)).toBe(350);
    expect(calculateTotal([])).toBe(0);
  });

  // Test search functionality
  test('filters products by search term', () => {
    const filterProducts = (products, searchTerm) => {
      if (!searchTerm) return products;
      
      return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };

    const products = [
      { name: 'iPhone 15', description: 'Apple telefon' },
      { name: 'Samsung Galaxy', description: 'Android telefon' },
      { name: 'MacBook Pro', description: 'Apple laptop' }
    ];

    expect(filterProducts(products, 'iphone')).toHaveLength(1);
    expect(filterProducts(products, 'telefon')).toHaveLength(2);
    expect(filterProducts(products, 'apple')).toHaveLength(2);
    expect(filterProducts(products, '')).toHaveLength(3);
  });

  // Test validation functions
  test('validates email correctly', () => {
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user@domain.co.uk')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  // Test phone validation
  test('validates Turkish phone number correctly', () => {
    const isValidTurkishPhone = (phone) => {
      const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
      return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    expect(isValidTurkishPhone('5551234567')).toBe(true);
    expect(isValidTurkishPhone('05551234567')).toBe(true);
    expect(isValidTurkishPhone('+905551234567')).toBe(true);
    expect(isValidTurkishPhone('555 123 45 67')).toBe(true);
    expect(isValidTurkishPhone('1234567890')).toBe(false);
    expect(isValidTurkishPhone('555123456')).toBe(false);
  });
});
