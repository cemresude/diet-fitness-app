# Diet & Fitness AI Chatbot App

Kişiselleştirilmiş diyet ve fitness programları oluşturan yapay zeka destekli mobil uygulama.

## 🚀 Özellikler

- **Sohbet Tabanlı Arayüz**: Kullanıcı bilgilerini doğal bir sohbet akışında toplama
- **Kişiselleştirilmiş Programlar**: Yaş, kilo, boy, hedef ve kısıtlamalara göre özelleştirilmiş planlar
- **Takvimli Çıktı**: Uygulanabilir, günlük olarak planlanmış antrenman ve diyet tabloları
- **AI Entegrasyonu**: Gemini/OpenAI API ile akıllı yanıtlar

## 📁 Proje Yapısı

```
diet-and-fitness-app/
├── mobile/                     # React Native (Expo) Frontend
│   ├── app/                    # Expo Router sayfaları
│   │   ├── (tabs)/            # Tab navigasyonu
│   │   │   ├── index.tsx      # Ana sohbet ekranı
│   │   │   ├── profile.tsx    # Profil ekranı
│   │   │   └── plans.tsx      # Planlar ekranı
│   │   ├── _layout.tsx        # Root layout
│   │   └── disclaimer.tsx     # Feragatname ekranı
│   ├── components/            # Yeniden kullanılabilir bileşenler
│   │   ├── chat/             # Sohbet bileşenleri
│   │   │   ├── ChatBubble.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── ChatScreen.tsx
│   │   ├── plans/            # Plan bileşenleri
│   │   │   ├── DietPlan.tsx
│   │   │   ├── WorkoutPlan.tsx
│   │   │   └── WeeklyCalendar.tsx
│   │   └── ui/               # Genel UI bileşenleri
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   ├── store/                 # Zustand state yönetimi
│   │   ├── useUserStore.ts   # Kullanıcı bilgileri
│   │   ├── useChatStore.ts   # Sohbet geçmişi
│   │   └── usePlanStore.ts   # Oluşturulan planlar
│   ├── services/              # API servisleri
│   │   ├── api.ts            # Axios instance
│   │   ├── chatService.ts    # Sohbet API'leri
│   │   └── planService.ts    # Plan API'leri
│   ├── types/                 # TypeScript tipleri
│   │   ├── user.ts
│   │   ├── chat.ts
│   │   └── plan.ts
│   ├── utils/                 # Yardımcı fonksiyonlar
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── assets/               # Görseller ve fontlar
│   ├── app.json              # Expo yapılandırması
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                    # Node.js (Express) Backend
│   ├── src/
│   │   ├── controllers/      # Route controller'ları
│   │   │   ├── chatController.ts
│   │   │   ├── userController.ts
│   │   │   └── planController.ts
│   │   ├── routes/           # API route tanımları
│   │   │   ├── index.ts
│   │   │   ├── chatRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   └── planRoutes.ts
│   │   ├── services/         # İş mantığı servisleri
│   │   │   ├── aiService.ts  # Gemini/OpenAI entegrasyonu
│   │   │   ├── chatService.ts
│   │   │   └── planGenerator.ts
│   │   ├── middleware/       # Express middleware'leri
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validator.ts
│   │   ├── models/           # Veri modelleri
│   │   │   ├── User.ts
│   │   │   ├── ChatSession.ts
│   │   │   └── Plan.ts
│   │   ├── config/           # Yapılandırma dosyaları
│   │   │   ├── firebase.ts   # Firebase bağlantısı
│   │   │   ├── ai.ts         # AI API yapılandırması
│   │   │   └── index.ts
│   │   ├── utils/            # Yardımcı fonksiyonlar
│   │   │   ├── prompts.ts    # AI prompt şablonları
│   │   │   └── validators.ts
│   │   └── app.ts            # Express app başlangıcı
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── docs/                       # Dokümantasyon
│   ├── DISCLAIMER.md          # Yasal feragatname
│   ├── API.md                 # API dokümantasyonu
│   └── SETUP.md               # Kurulum rehberi
│
└── README.md
```

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji | Kullanım Amacı |
|--------|-----------|----------------|
| Frontend | React Native (Expo) | Hızlı mobil geliştirme |
| State Yönetimi | Zustand | Global state yönetimi |
| UI / Chat | React Native Gifted Chat | Sohbet arayüzü |
| Backend | Node.js (Express) | API ve iş mantığı |
| Veritabanı | Firebase Firestore | Veri depolama |
| Yapay Zeka | Gemini / OpenAI API | AI destekli yanıtlar |

## 📱 Kullanıcı Akışı

1. Kullanıcı uygulamayı açar
2. Feragatname ekranını kabul eder
3. Sohbet arayüzünde bot ile etkileşime girer:
   - Yaş bilgisi
   - Kilo bilgisi
   - Boy bilgisi
   - Hedef (kilo alma/verme/kas yapma)
   - Alerji ve sakatlık durumları
4. AI, toplanan bilgilere göre kişiselleştirilmiş plan oluşturur
5. Takvimli diyet ve antrenman programı sunulur

## ⚠️ Önemli Uyarı

Bu uygulama yalnızca bilgilendirme amaçlıdır ve profesyonel tıbbi veya beslenme danışmanlığı yerine geçmez. Herhangi bir diyet veya egzersiz programına başlamadan önce mutlaka bir sağlık uzmanına danışın.

## 🚀 Başlangıç

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Expo CLI
- Firebase hesabı
- Gemini veya OpenAI API anahtarı

### Kurulum

```bash
# Repository'yi klonlayın
git clone <repo-url>
cd diet-and-fitness-app

# Backend kurulumu
cd backend
npm install
cp .env.example .env
# .env dosyasını düzenleyin

# Frontend kurulumu
cd ../mobile
npm install

# Uygulamayı başlatın
npm start
```

## 📄 Lisans

MIT License
