# 🚀 CMTicaret E-Ticaret Sitesi Kurulum Rehberi

## 📋 Gereksinimler
- Node.js (v18 veya üzeri)
- MongoDB (isteğe bağlı - veritabanı olmadan da çalışır)
- Git (isteğe bağlı)

## 🔧 Kurulum Adımları

### 1. Projeyi İndir
```bash
# Proje klasörünü indir ve aç
cd CMTicaret
```

### 2. Backend Kurulumu
```bash
cd backend
npm install
```

### 3. Frontend Kurulumu
```bash
cd ../frontend
npm install
```

### 4. Çalıştırma

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Siteyi Aç
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## ⚙️ Yapılandırma (İsteğe Bağlı)

### MongoDB Kurulumu (Windows)
1. MongoDB Community Server indir: https://www.mongodb.com/try/download/community
2. Kurulumu yap
3. MongoDB servisini başlat

### Iyzico Ödeme (İsteğe Bağlı)
1. Iyzico hesabı aç: https://www.iyzico.com
2. API key'leri al
3. `backend/.env` dosyası oluştur:
```
IYZICO_API_KEY=gerçek_api_key
IYZICO_SECRET_KEY=gerçek_secret_key
```

## 🎯 Özellikler
- ✅ Modern Next.js frontend
- ✅ Express.js backend
- ✅ Responsive tasarım
- ✅ Sepet sistemi
- ✅ Kullanıcı kayıt/giriş
- ✅ Admin paneli
- ✅ Arama ve filtreleme
- ✅ Iyzico ödeme entegrasyonu
- ✅ Email bildirimleri
- ✅ Google Analytics
- ✅ Sosyal medya paylaşımı

## 🐛 Sorun Giderme

### Port Zaten Kullanımda
```bash
# Port 3000 kullanımda
netstat -ano | findstr :3000
taskkill /PID [PID_NUMARASI] /F

# Port 5000 kullanımda  
netstat -ano | findstr :5000
taskkill /PID [PID_NUMARASI] /F
```

### MongoDB Bağlantı Hatası
- MongoDB yüklü değilse, site yine de çalışır
- Sadece veritabanı işlemleri çalışmaz

### Node Modules Hatası
```bash
# Her iki klasörde de
rm -rf node_modules
rm package-lock.json
npm install
```

## 📱 Kullanım
1. Ana sayfa: Ürünleri görüntüle
2. Kategoriler: Kategori sayfası
3. Arama: Gelişmiş arama
4. Sepet: Header'daki sepet ikonu
5. Profil: Kullanıcı profili
6. Admin: Admin paneli

## 🎨 Özelleştirme
- `frontend/src/app/globals.css` - Renkler ve stiller
- `frontend/src/components/` - Bileşenler
- `backend/routes/` - API endpoint'leri
- `backend/models/` - Veritabanı modelleri

---
**Not:** Bu proje tamamen Türkiye pazarı için tasarlanmıştır! 🇹🇷
