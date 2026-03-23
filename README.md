# [cite_start]FitSync: Yapay Zeka Destekli Diyet ve Spor Takip Uygulaması [cite: 6]

[cite_start]**Ankara Üniversitesi Mühendislik Fakültesi - Bilgisayar Mühendisliği Bölümü** [cite: 2, 3, 4]
[cite_start]**Ders:** BLM4538 IOS ile Mobil Uygulama Geliştirme II [cite: 5]
[cite_start]**Geliştirici:** Ömer Doğan (22290528) [cite: 7, 8] | [cite_start][GitHub](https://github.com/bycycomr) [cite: 9]

---

## 🚀 Proje Amacı

[cite_start]Bu projenin temel amacı; kullanıcıların fiziksel özelliklerini (yaş, boy, kilo vb.), kişisel hedeflerini ve mevcut sağlık kısıtlamalarını diyalog tabanlı bir sohbet arayüzü üzerinden analiz ederek tamamen kişiselleştirilmiş ve dinamik spor/diyet programları sunan yapay zeka destekli bir mobil uygulama geliştirmektir[cite: 11]. [cite_start]Uygulama, birbirinden bağımsız gibi görünen beslenme ve spor alışkanlıklarının tek bir yerden takip edilmesini kolaylaştırmayı hedefler[cite: 12].

## 🎯 Kapsam

### [cite_start]Kapsam Dahilinde Olanlar (In-Scope) [cite: 14]
- [cite_start]**Kimlik Doğrulaması:** Güvenli kayıt ve giriş işlemleri[cite: 15].
- [cite_start]**Akıllı Sohbet Arayüzü:** Doğal diyalog akışı içinde veri toplayan asistan[cite: 16].
- [cite_start]**İstem (Prompt) Yönetimi:** Toplanan verileri yapılandırıp LLM'e iletme[cite: 17].
- [cite_start]**Dinamik Program Üretimi:** Yapay zeka çıktısını (JSON) günlük takvim ve öğün kartları gibi UI bileşenlerine dönüştürme[cite: 18].
- [cite_start]**İlerleme Takibi:** Tamamlanan görevleri veritabanına kaydederek süreci görselleştirme[cite: 19].

### [cite_start]Kapsam Dışı Olanlar (Out-of-Scope) [cite: 20]
- [cite_start]Gerçek zamanlı doktor veya diyetisyen görüşmeleri[cite: 21].
- [cite_start]Giyilebilir cihaz (Akıllı saat, Apple Health vb.) anlık sağlık verisi entegrasyonu[cite: 22].
- [cite_start]Uygulama içi e-ticaret (supplement/ekipman satışı)[cite: 23].

## 🛠️ Teknoloji Yığını

[cite_start]Ayrı bir backend sunucusu kurmak yerine, sunucusuz (serverless) mimari tercih edilmiştir.

| Katman | Teknoloji | Kullanım Amacı |
|--------|-----------|----------------|
| **Frontend** | React Native & Expo | [cite_start]Çapraz platform iOS/Android mobil geliştirme [cite: 26] |
| **Navigasyon** | React Navigation | [cite_start]Ekranlar arası yönlendirme yönetimi [cite: 27] |
| **Sohbet UI** | React Native Gifted Chat | [cite_start]Özelleştirilebilir sohbet arayüzü bileşeni [cite: 28] |
| **State Yönetimi** | Zustand | [cite_start]Hafif ve hızlı global durum yönetimi [cite: 29] |
| **Veritabanı & Auth**| Firebase (Firestore & Auth) | [cite_start]Sunucusuz veri depolama ve kimlik doğrulama  |
| **API & Güvenlik** | Expo API Routes / Cloud Functions| [cite_start]API güvenliği ve aracı backend işlemleri  |
| **Yapay Zeka** | Gemini API (veya OpenAI API) | [cite_start]Doğal dil analizi ve yapılandırılmış JSON üretimi [cite: 35] |

## 📁 Proje Yapısı

```text
fitsync-app/
├── app/                        # Expo Router Sayfaları ve API Route'ları
│   ├── (tabs)/                 # Alt Sekme (Tab) Navigasyonu
│   │   ├── index.tsx           # Ana sohbet ekranı
│   │   ├── profile.tsx         # Profil ekranı
│   │   └── plans.tsx           # Planlar ekranı
│   ├── api/                    # Expo API Routes (Serverless Backend)
│   │   ├── chat+api.ts         # LLM (Gemini) iletişim route'u
│   │   └── plan+api.ts         # Plan işleme route'u
│   ├── _layout.tsx             # Root layout
│   └── disclaimer.tsx          # Feragatname ekranı
├── components/                 # Yeniden Kullanılabilir UI Bileşenleri
│   ├── chat/                   # Sohbet arayüzü bileşenleri
│   ├── plans/                  # Diyet ve Egzersiz kartları, Takvim
│   └── ui/                     # Buton, Input, Modal vb. genel bileşenler
├── store/                      # Zustand State Yönetimi
│   ├── useUserStore.ts         # Kullanıcı bilgileri state'i
│   ├── useChatStore.ts         # Sohbet geçmişi state'i
│   └── usePlanStore.ts         # Oluşturulan planlar state'i
├── services/                   # Dış Servis Entegrasyonları
│   ├── firebase.ts             # Firebase config ve Firestore referansları
│   ├── authService.ts          # Kayıt/Giriş işlemleri
│   └── aiService.ts            # API istekleri ve Prompt yönetimi (Axios)
├── types/                      # TypeScript Interface ve Type tanımları
├── utils/                      # Yardımcı Fonksiyonlar ve Sabitler
├── RAPOR.md                    # Haftalık detaylı ilerleme raporları
└── README.md                   # Proje ana dokümantasyonu
📅 Proje Yönetimi ve Haftalık Video RaporlamaProje geliştirme süreci haftalık olarak belgelenecek ve detaylı teknik açıklamalar RAPOR.md dosyasına eklenecektir. Her hafta yapılan geliştirmeler, ekran tasarımları ve yapay zeka entegrasyonları 3-5 dakikalık videolarla anlatılacaktır.HaftaDönemTamamlanma DurumuDetaylı RaporVideo SunumuKaynak Kod1Vize Öncesi ⏳ BekleniyorRAPOR.md🔗 Video 1 Linkiv0.1.02Vize Öncesi ⏳ BekleniyorRAPOR.md🔗 Video 2 Linkiv0.2.03Vize Öncesi ⏳ BekleniyorRAPOR.md🔗 Video 3 Linkiv0.3.04Vize Öncesi ⏳ BekleniyorRAPOR.md🔗 Video 4 Linkiv0.4.05Final Öncesi ⏳ BekleniyorRAPOR.md🔗 Video 5 Linkiv0.5.06Final Öncesi ⏳ BekleniyorRAPOR.md🔗 Video 6 Linkiv0.6.07Final Öncesi ⏳ BekleniyorRAPOR.md🔗 Video 7 Linkiv0.7.08Final Öncesi ⏳ BekleniyorRAPOR.md🔗 Video 8 Linkiv0.8.09Final Öncesi ⏳ BekleniyorRAPOR.md🔗 Video 9 Linkiv0.9.010Final Öncesi ⏳ BekleniyorRAPOR.md🔗 Video 10 Linkiv1.0.0Not: Detaylı haftalık görev planlaması için ön rapora veya RAPOR.md dosyasına bakabilirsiniz.⚠️ Önemli UyarıBu uygulama yalnızca bilgilendirme amaçlıdır ve profesyonel tıbbi veya beslenme danışmanlığı yerine geçmez. Herhangi bir diyet veya egzersiz programına başlamadan önce mutlaka bir sağlık uzmanına danışın.🚀 BaşlangıçGereksinimlerNode.js 18+npm veya yarnExpo CLIFirebase Hesabı (Firestore & Authentication aktif edilmiş)Gemini veya OpenAI API AnahtarıKurulumBash# Repository'yi klonlayın
git clone [https://github.com/bycycomr/fitsync.git](https://github.com/bycycomr/fitsync.git)
cd fitsync

# Bağımlılıkları yükleyin
npm install

# Çevresel değişkenleri ayarlayın
cp .env.example .env
# .env dosyasını Firebase ve LLM API anahtarlarınız ile düzenleyin.

# Uygulamayı başlatın
npx expo start