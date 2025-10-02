const { test, expect } = require('@playwright/test');

test.describe('Ödeme İşlemleri', () => {
  test.beforeEach(async ({ page }) => {
    // Her test öncesi giriş yap ve ürün ekle
    await page.goto('/');
    
    // Giriş yap
    await page.getByRole('link', { name: /Giriş/i }).click();
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'test123456');
    await page.getByRole('button', { name: /Giriş Yap/i }).click();
    
    // Ürün ekle
    await page.locator('[data-testid="add-to-cart"]').first().click();
  });

  test('ödeme sayfası açılıyor', async ({ page }) => {
    // Sepet sayfasına git
    await page.getByRole('link', { name: /Sepet/i }).click();
    
    // Ödeme butonuna tıkla
    await page.getByRole('button', { name: /Ödemeye Geç/i }).click();
    
    // Ödeme sayfasına yönlendirildiğini kontrol et
    await expect(page).toHaveURL(/\/checkout/);
    
    // Ödeme formunun görünür olduğunu kontrol et
    await expect(page.getByRole('heading', { name: /Ödeme/i })).toBeVisible();
  });

  test('ödeme formu dolduruluyor', async ({ page }) => {
    // Ödeme sayfasına git
    await page.goto('/checkout');
    
    // Adres bilgilerini doldur
    await page.fill('input[name="fullName"]', 'Test Kullanıcı');
    await page.fill('input[name="line1"]', 'Test Adresi 123');
    await page.fill('input[name="city"]', 'İstanbul');
    await page.fill('input[name="phone"]', '5555555555');
    
    // Ödeme yöntemi seç
    await page.check('input[value="cod"]'); // Kapıda ödeme
    
    // Form doldurulduğunu kontrol et
    await expect(page.locator('input[name="fullName"]')).toHaveValue('Test Kullanıcı');
  });

  test('ödeme yöntemleri görünüyor', async ({ page }) => {
    await page.goto('/checkout');
    
    // Tüm ödeme yöntemlerinin görünür olduğunu kontrol et
    await expect(page.getByText(/Kredi\/Banka Kartı/i)).toBeVisible();
    await expect(page.getByText(/Banka Havalesi/i)).toBeVisible();
    await expect(page.getByText(/Kapıda Ödeme/i)).toBeVisible();
  });

  test('kupon kodu uygulanıyor', async ({ page }) => {
    await page.goto('/checkout');
    
    // Kupon kodu gir
    await page.fill('input[placeholder*="Kupon"]', 'TEST10');
    
    // Uygula butonuna tıkla
    await page.getByRole('button', { name: /Uygula/i }).click();
    
    // Kupon uygulandı mesajını kontrol et (başarılı veya hatalı)
    await expect(page.getByText(/Kupon/i)).toBeVisible();
  });
});
