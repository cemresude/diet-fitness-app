# API Dokümantasyonu

## Base URL

```
Development: http://localhost:3000/api/v1
Production: https://api.dietfitnessai.com/api/v1
```

## Authentication

Tüm API istekleri Authorization header'ı gerektirir:

```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Chat Endpoints

#### POST /chat/message
Kullanıcı mesajını işle ve AI yanıtı al.

**Request Body:**
```json
{
  "sessionId": "string",
  "message": "string",
  "context": {
    "step": "age" | "weight" | "height" | "goal" | "restrictions" | "complete"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "string",
    "nextStep": "string",
    "isComplete": false,
    "extractedData": {
      "field": "value"
    }
  }
}
```

#### GET /chat/history/:sessionId
Sohbet geçmişini getir.

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "string",
        "role": "user" | "assistant",
        "content": "string",
        "timestamp": "ISO8601"
      }
    ]
  }
}
```

---

### 2. User Endpoints

#### POST /users/register
Yeni kullanıcı kaydı.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

#### POST /users/login
Kullanıcı girişi.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "string",
    "user": {
      "id": "string",
      "email": "string",
      "name": "string"
    }
  }
}
```

#### GET /users/profile
Kullanıcı profilini getir.

#### PUT /users/profile
Kullanıcı profilini güncelle.

**Request Body:**
```json
{
  "age": 25,
  "weight": 70,
  "height": 175,
  "goal": "weight_loss" | "weight_gain" | "muscle_building",
  "allergies": ["string"],
  "injuries": ["string"]
}
```

---

### 3. Plan Endpoints

#### POST /plans/generate
Kişiselleştirilmiş plan oluştur.

**Request Body:**
```json
{
  "userProfile": {
    "age": 25,
    "weight": 70,
    "height": 175,
    "goal": "weight_loss",
    "allergies": ["gluten"],
    "injuries": ["knee"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "planId": "string",
    "dietPlan": {
      "dailyCalories": 2000,
      "macros": {
        "protein": 150,
        "carbs": 200,
        "fat": 65
      },
      "weeklyMenu": [
        {
          "day": "Pazartesi",
          "meals": [
            {
              "type": "breakfast",
              "name": "string",
              "calories": 400,
              "ingredients": ["string"]
            }
          ]
        }
      ]
    },
    "workoutPlan": {
      "weeklySchedule": [
        {
          "day": "Pazartesi",
          "focus": "Üst Vücut",
          "duration": 60,
          "exercises": [
            {
              "name": "string",
              "sets": 3,
              "reps": 12,
              "rest": 60
            }
          ]
        }
      ]
    }
  }
}
```

#### GET /plans/:planId
Belirli bir planı getir.

#### GET /plans/history
Kullanıcının plan geçmişini getir.

---

## Error Responses

Tüm hatalar aşağıdaki formatta döner:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Hata açıklaması"
  }
}
```

### Hata Kodları

| Kod | HTTP Status | Açıklama |
|-----|-------------|----------|
| UNAUTHORIZED | 401 | Geçersiz veya eksik token |
| FORBIDDEN | 403 | Yetkisiz erişim |
| NOT_FOUND | 404 | Kaynak bulunamadı |
| VALIDATION_ERROR | 400 | Geçersiz istek verisi |
| INTERNAL_ERROR | 500 | Sunucu hatası |
| AI_SERVICE_ERROR | 503 | AI servisi geçici olarak kullanılamıyor |

---

## Rate Limiting

- Standart kullanıcılar: 100 istek/dakika
- Plan oluşturma: 10 istek/saat

Rate limit aşıldığında:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Çok fazla istek. Lütfen bekleyin.",
    "retryAfter": 60
  }
}
```
