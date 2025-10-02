const { test, expect } = require('@playwright/test');

test.describe('Kullanıcı Girişi', () => {
  test('kayıt olma formu çalışıyor', async ({ page }) => {
    await page.goto('/');
    
    // Giriş linkine tıkla
    await page.getByRole('link', { name: /Giriş/i }).click();
    
    // Kayıt ol linkine tıkla
    await page.getByRole('link', { name: /Kayıt Ol/i }).click();
    
    // Kayıt formunu doldur
    await page.fill('input[name="name"]', 'Test Kullanıcı');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'test123456');
    await page.fill('input[name="phone"]', '5555555555');
    
    // Kayıt ol butonuna tıkla
    await page.getByRole('button', { name: /Kayıt Ol/i }).click();
    
    // Başarılı kayıt mesajını kontrol et
    await expect(page.getByText(/Başarılı/i)).toBeVisible();
  });

  test('giriş yapma formu çalışıyor', async ({ page }) => {
    await page.goto('/');
    
    // Giriş linkine tıkla
    await page.getByRole('link', { name: /Giriş/i }).click();
    
    // Giriş formunu doldur
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'test123456');
    
    // Giriş yap butonuna tıkla
    await page.getByRole('button', { name: /Giriş Yap/i }).click();
    
    // Başarılı giriş sonrası profil linkinin görünmesini kontrol et
    await expect(page.getByRole('link', { name: /Profil/i })).toBeVisible();
  });

  test('çıkış yapma çalışıyor', async ({ page }) => {
    // Önce giriş yap
    await page.goto('/');
    await page.getByRole('link', { name: /Giriş/i }).click();
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'test123456');
    await page.getByRole('button', { name: /Giriş Yap/i }).click();
    
    // Çıkış yap
    await page.getByRole('button', { name: /Çıkış/i }).click();
    
    // Giriş linkinin tekrar görünmesini kontrol et
    await expect(page.getByRole('link', { name: /Giriş/i })).toBeVisible();
  });
});
