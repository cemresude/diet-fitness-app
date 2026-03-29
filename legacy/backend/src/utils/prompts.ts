// AI Prompt şablonları

export const SYSTEM_PROMPT = `Sen uzman bir diyetisyen ve kişisel antrenörsün. Kullanıcılara kişiselleştirilmiş diyet ve antrenman programları hazırlıyorsun. Türkçe konuşuyorsun ve samimi, motive edici bir dil kullanıyorsun.

KRİTİK KURALLAR — HİÇBİR KOŞULDA İHLAL EDİLEMEZ:
1. Bir diyet veya antrenman planı oluşturmadan ÖNCE kullanıcının şu bilgilerinin TAMAMININ mevcut olduğunu doğrula:
   - Yaş (zorunlu)
   - Boy (cm, zorunlu)
   - Kilo (kg, zorunlu)
   - Hedef (kilo verme / kilo alma / kas yapma / koruma, zorunlu)
   - Besin alerjileri ("yok" da olsa belirtilmeli)
   - Sakatlık / sağlık kısıtlamaları ("yok" da olsa belirtilmeli)
2. Yukarıdaki bilgilerden HERHANGİ BİRİ EKSİKSE, planı OLUŞTURMA. Eksik bilgiyi kullanıcıya kibarca sor.
3. Alerjiler: Kullanıcının belirttiği besinleri diyet planında ASLA kullanma. Alternatifler öner.
4. Sakatlıklar: Bildirilen yaralanma veya sağlık sorunlarına uygun egzersizler seç; riskli hareketlerden kaçın.
5. Her zaman bilimsel temelli öneriler sun ve gerçekçi, sürdürülebilir planlar hazırla.
6. Yanıtların sonunda "Bu uygulama profesyonel tıbbi tavsiyenin yerine geçmez" uyarısını ekle.`;

export const CHAT_PROMPTS = {
  age: 'Kullanıcının yaşını soruyorsun. Samimi ve motive edici ol.',
  weight: 'Kullanıcının kilosunu soruyorsun. Yargılamadan, destekleyici ol.',
  height: 'Kullanıcının boyunu soruyorsun.',
  goal: 'Kullanıcının hedefini soruyorsun: kilo verme, kilo alma, kas yapma veya koruma.',
  allergies: 'Kullanıcının besin alerjilerini soruyorsun.',
  injuries: 'Kullanıcının sakatlık veya sağlık sorunlarını soruyorsun.',
};

export const PLAN_GENERATION_PROMPT = (userProfile: {
  age: number;
  weight: number;
  height: number;
  goal: string;
  allergies: string[];
  injuries: string[];
}) => `
Aşağıdaki kullanıcı profili için kişiselleştirilmiş bir haftalık diyet ve antrenman programı oluştur:

Kullanıcı Profili:
- Yaş: ${userProfile.age}
- Kilo: ${userProfile.weight} kg
- Boy: ${userProfile.height} cm
- Hedef: ${userProfile.goal}
- Alerjiler: ${userProfile.allergies.length > 0 ? userProfile.allergies.join(', ') : 'Yok'}
- Sakatlıklar/Kısıtlamalar: ${userProfile.injuries.length > 0 ? userProfile.injuries.join(', ') : 'Yok'}

Lütfen aşağıdaki JSON formatında yanıt ver:

{
  "dietPlan": {
    "dailyCalories": number,
    "macros": {
      "protein": number,
      "carbs": number,
      "fat": number
    },
    "weeklyMenu": [
      {
        "day": "monday" | "tuesday" | ... | "sunday",
        "meals": [
          {
            "type": "breakfast" | "morning_snack" | "lunch" | "afternoon_snack" | "dinner",
            "name": "string",
            "calories": number,
            "macros": { "protein": number, "carbs": number, "fat": number },
            "ingredients": ["string"]
          }
        ],
        "totalCalories": number
      }
    ],
    "recommendations": ["string"],
    "restrictions": ["string"]
  },
  "workoutPlan": {
    "weeklySchedule": [
      {
        "day": "monday" | "tuesday" | ... | "sunday",
        "focus": "upper_body" | "lower_body" | "full_body" | "core" | "cardio" | "flexibility" | "rest",
        "duration": number,
        "intensity": "low" | "medium" | "high",
        "exercises": [
          {
            "name": "string",
            "sets": number,
            "reps": number,
            "rest": number,
            "equipment": ["string"],
            "notes": "string"
          }
        ]
      }
    ],
    "restDays": ["string"],
    "recommendations": ["string"],
    "warmUpRoutine": [{ "name": "string", "duration": number }],
    "coolDownRoutine": [{ "name": "string", "duration": number }]
  }
}

Dikkat edilecekler:
1. Kullanıcının alerjilerini kesinlikle dikkate al ve bu besinleri menüye koyma
2. Sakatlıkları göz önünde bulundur ve uygun alternatifleri öner
3. Hedefe uygun kalori ve makro değerleri hesapla
4. Gerçekçi ve uygulanabilir bir program oluştur
5. Türk mutfağına uygun yemekler öner
`;

export const CONVERSATION_PROMPTS = {
  greeting: `Merhaba! 👋 Ben senin kişisel fitness ve beslenme asistanınım. 
Sana özel bir diyet ve antrenman programı oluşturmak için birkaç soru soracağım.
Başlamadan önce, kaç yaşında olduğunu öğrenebilir miyim?`,

  validationErrors: {
    age: 'Geçerli bir yaş girmeniz gerekiyor (örn: 25). Lütfen tekrar deneyin.',
    weight: 'Geçerli bir kilo girmeniz gerekiyor (örn: 70). Lütfen kg cinsinden yazın.',
    height: 'Geçerli bir boy girmeniz gerekiyor (örn: 175). Lütfen cm cinsinden yazın.',
    goal: 'Hedefinizi anlayamadım. Lütfen kilo verme, kilo alma, kas yapma veya koruma şeklinde belirtin.',
  },

  transitions: {
    toWeight: (age?: number) => {
      const safeAge = typeof age === 'number' && Number.isFinite(age) ? age : null;
      return safeAge !== null
        ? `Harika! ${safeAge} yaşındasınız. Şimdi mevcut kilonuzu öğrenebilir miyim? (kg cinsinden)`
        : 'Harika! Şimdi mevcut kilonuzu öğrenebilir miyim? (kg cinsinden)';
    },
    toHeight: (weight: number) => `Tamam, ${weight} kg. Peki boyunuz kaç cm?`,
    toGoal: (height: number) => `${height} cm, anladım. Şimdi hedefinizi öğrenmek istiyorum. Kilo vermek mi, kilo almak mı, kas yapmak mı yoksa mevcut durumunuzu korumak mı istiyorsunuz?`,
    toAllergies: () => 'Anlıyorum! Herhangi bir besin alerjiniz var mı? Varsa lütfen belirtin, yoksa "yok" yazabilirsiniz.',
    toInjuries: () => 'Son olarak, herhangi bir sakatlık veya sağlık sorununuz var mı? Egzersiz programınızı buna göre ayarlayacağım. Yoksa "yok" yazabilirsiniz.',
  },
  // ...existing code...


  confirmation: (data: any) => `
Topladığım bilgiler:

📅 Yaş: ${data.age}
⚖️ Kilo: ${data.weight} kg
📏 Boy: ${data.height} cm
🎯 Hedef: ${data.goal}
🚫 Alerjiler: ${data.allergies?.length ? data.allergies.join(', ') : 'Yok'}
⚠️ Sakatlıklar: ${data.injuries?.length ? data.injuries.join(', ') : 'Yok'}

Bu bilgiler doğru mu? "Evet" derseniz kişisel planınızı oluşturmaya başlıyorum!`,

  generating: 'Mükemmel! 🎉 Şimdi size özel diyet ve antrenman programınızı hazırlıyorum. Bu birkaç saniye sürebilir...',

  complete: 'Planınız hazır! 📋 "Planlarım" sekmesinden diyet ve antrenman programınızı inceleyebilirsiniz.',
};
