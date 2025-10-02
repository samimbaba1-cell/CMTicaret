const { test, expect } = require('@playwright/test');

test.describe('Ana Sayfa', () => {
  test('sayfa yükleniyor ve başlık doğru', async ({ page }) => {
    await page.goto('/');
    
    // Sayfa başlığını kontrol et
    await expect(page).toHaveTitle(/CM Ticaret/);
    
    // Ana başlığı kontrol et
    await expect(page.getByRole('heading', { name: /CM Ticaret/i })).toBeVisible();
  });

  test('ürünler listeleniyor', async ({ page }) => {
    await page.goto('/');
    
    // Ürün kartlarının yüklendiğini kontrol et
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
    
    // En az bir ürün olduğunu kontrol et
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards).toHaveCount({ min: 1 });
  });

  test('arama çalışıyor', async ({ page }) => {
    await page.goto('/');
    
    // Arama kutusunu bul ve test et
    const searchInput = page.getByPlaceholder('Ara...');
    await searchInput.fill('test');
    await searchInput.press('Enter');
    
    // Arama sonuçları sayfasına yönlendirildiğini kontrol et
    await expect(page).toHaveURL(/\/search/);
  });

  test('sepet ikonu görünüyor', async ({ page }) => {
    await page.goto('/');
    
    // Sepet linkini kontrol et
    await expect(page.getByRole('link', { name: /Sepet/i })).toBeVisible();
  });

  test('kategoriler linki çalışıyor', async ({ page }) => {
    await page.goto('/');
    
    // Kategoriler linkine tıkla
    await page.getByRole('link', { name: /Kategoriler/i }).click();
    
    // Kategoriler sayfasına yönlendirildiğini kontrol et
    await expect(page).toHaveURL(/\/categories/);
  });
});
