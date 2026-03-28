# Kurulum Rehberi

## Gereksinimler

- Node.js 18.0 veya üzeri
- npm 9.0 veya yarn 1.22+
- Expo CLI (`npm install -g expo-cli`)
- Git
- Firebase hesabı
- Gemini API veya OpenAI API anahtarı

## 1. Projeyi Klonlama

```bash
git clone <repository-url>
cd diet-and-fitness-app
```

## 2. Backend Kurulumu

### 2.1 Bağımlılıkları Yükleme

```bash
cd backend
npm install
```

### 2.2 Environment Değişkenlerini Ayarlama

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
# Server
PORT=3000
NODE_ENV=development

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com

# AI API (birini seçin)
AI_PROVIDER=gemini  # veya 'openai'
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

### 2.3 Firebase Kurulumu

1. [Firebase Console](https://console.firebase.google.com)'a gidin
2. Yeni proje oluşturun
3. Firestore Database'i etkinleştirin
4. Project Settings > Service Accounts > Generate New Private Key
5. İndirilen JSON'daki bilgileri `.env` dosyasına ekleyin

### 2.4 Backend'i Başlatma

```bash
# Development modunda
npm run dev

# Production modunda
npm run build
npm start
```

Backend http://localhost:3000 adresinde çalışacaktır.

## 3. Mobile (Frontend) Kurulumu

### 3.1 Bağımlılıkları Yükleme

```bash
cd mobile
npm install
```

### 3.2 Environment Ayarları

`mobile/.env` dosyası oluşturun:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1

# Fiziksel cihazda test için:
# EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3000/api/v1
```

### 3.3 Uygulamayı Başlatma

```bash
# Expo development server'ı başlat
npx expo start

# iOS Simulator'da çalıştır (sadece macOS)
npx expo start --ios

# Android Emulator'da çalıştır
npx expo start --android

# Web'de çalıştır
npx expo start --web
```

## 4. AI API Kurulumu

### Gemini API

1. [Google AI Studio](https://makersuite.google.com/app/apikey) adresine gidin
2. "Create API Key" tıklayın
3. Anahtarı `.env` dosyasına ekleyin

### OpenAI API

1. [OpenAI Platform](https://platform.openai.com/api-keys) adresine gidin
2. "Create new secret key" tıklayın
3. Anahtarı `.env` dosyasına ekleyin

## 5. Veritabanı Yapılandırması

### Firestore Security Rules

Firebase Console'da Firestore > Rules sekmesinde:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Kullanıcılar kendi verilerine erişebilir
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Chat oturumları
    match /chatSessions/{sessionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Planlar
    match /plans/{planId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

### Firestore Indexes

Gerekli indexler otomatik oluşturulacaktır, ancak performans için:

```
Collection: plans
Fields: userId (Ascending), createdAt (Descending)

Collection: chatSessions
Fields: userId (Ascending), updatedAt (Descending)
```

## 6. Test Etme

### Backend Testleri

```bash
cd backend
npm test
```

### Mobile Testleri

```bash
cd mobile
npm test
```

## 7. Production Build

### Backend

```bash
cd backend
npm run build
```

### Mobile

```bash
cd mobile

# iOS için
eas build --platform ios

# Android için
eas build --platform android
```

## Sorun Giderme

### Port Çakışması
```bash
# 3000 portunu kullanan process'i bul ve kapat
lsof -i :3000
kill -9 <PID>
```

### Expo Cache Temizleme
```bash
npx expo start --clear
```

### Node Modules Yeniden Yükleme
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## Destek

Sorularınız için: support@dietfitnessai.com
