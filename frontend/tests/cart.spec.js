const { test, expect } = require('@playwright/test');

test.describe('Sepet İşlemleri', () => {
  test.beforeEach(async ({ page }) => {
    // Her test öncesi ana sayfaya git
    await page.goto('/');
  });

  test('ürün sepete ekleniyor', async ({ page }) => {
    // İlk ürünü bul ve sepete ekle
    const addToCartButton = page.locator('[data-testid="add-to-cart"]').first();
    await addToCartButton.click();
    
    // Başarı mesajını kontrol et
    await expect(page.getByText(/Sepete eklendi/i)).toBeVisible();
    
    // Sepet sayısının arttığını kontrol et
    await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');
  });

  test('sepet sayfası açılıyor', async ({ page }) => {
    // Sepet linkine tıkla
    await page.getByRole('link', { name: /Sepet/i }).click();
    
    // Sepet sayfasına yönlendirildiğini kontrol et
    await expect(page).toHaveURL(/\/cart/);
    
    // Sepet başlığını kontrol et
    await expect(page.getByRole('heading', { name: /Sepet/i })).toBeVisible();
  });

  test('sepetten ürün çıkarılıyor', async ({ page }) => {
    // Önce ürün ekle
    await page.locator('[data-testid="add-to-cart"]').first().click();
    
    // Sepet sayfasına git
    await page.getByRole('link', { name: /Sepet/i }).click();
    
    // Ürünü sepetten çıkar
    await page.locator('[data-testid="remove-from-cart"]').first().click();
    
    // Sepetin boş olduğunu kontrol et
    await expect(page.getByText(/Sepet boş/i)).toBeVisible();
  });

  test('miktar güncelleniyor', async ({ page }) => {
    // Ürün ekle
    await page.locator('[data-testid="add-to-cart"]').first().click();
    
    // Sepet sayfasına git
    await page.getByRole('link', { name: /Sepet/i }).click();
    
    // Miktarı artır
    const quantityInput = page.locator('[data-testid="quantity-input"]').first();
    await quantityInput.fill('3');
    
    // Güncelleme butonuna tıkla
    await page.locator('[data-testid="update-quantity"]').first().click();
    
    // Miktarın güncellendiğini kontrol et
    await expect(quantityInput).toHaveValue('3');
  });
});
