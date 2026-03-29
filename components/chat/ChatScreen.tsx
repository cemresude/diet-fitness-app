import React, { useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Alert } from 'react-native';
import { useChatStore, usePlanStore, useUserStore } from '../../store';
import { planService, userService } from '../../services';
import { ChatMessage, ChatStep } from '../../types/chat';
import { UserGoal } from '../../types/user';
import { COLORS, CHAT_QUESTIONS } from '../../utils/constants';
import {
  extractAge,
  extractWeight,
  extractHeight,
  extractGoal,
  extractAllergies,
  extractInjuries,
  stripEmojis,
} from '../../utils/helpers';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';

export const ChatScreen: React.FC = () => {
  const {
    messages,
    currentStep,
    isTyping,
    collectedData,
    addBotMessage,
    addUserMessage,
    setCurrentStep,
    updateCollectedData,
    setIsTyping,
    initializeChat,
  } = useChatStore();

  const { setCurrentPlan, setIsGenerating, setError, loadUserPlans } = usePlanStore();
  const { updateProfile: updateUserProfile, user } = useUserStore();

  // Sohbeti başlat
  useEffect(() => {
    if (messages.length === 0) {
      initializeChat();
    }
  }, []);

  // Kullanıcı mesajını işle
  const processUserInput = useCallback(
    async (text: string, step: ChatStep) => {
      let nextStep: ChatStep = step;
      let extractedValue: any = null;
      let errorMessage: string | null = null;
      let updates: Record<string, any> = {};

      const syncProfile = async (updates: {
        age?: number;
        weight?: number;
        height?: number;
        goal?: UserGoal;
        allergies?: string[];
        injuries?: string[];
      }) => {
        // Anlık UI güncellemesi
        updateUserProfile(updates as any);

        // Kalıcı kayıt (lokal db/service)
        try {
          await userService.updateProfile(updates as any);
        } catch (e) {
          console.warn('Profile sync failed:', e);
        }
      };

      switch (step) {
        case 'age':
          extractedValue = extractAge(text);
          if (extractedValue !== null) {
            updates = { age: extractedValue };
            updateCollectedData(updates);
            await syncProfile({ age: extractedValue });
            nextStep = 'weight';
          } else {
            errorMessage = 'Geçerli bir yaş girmeniz gerekiyor (örn: 25)';
          }
          break;

        case 'weight':
          extractedValue = extractWeight(text);
          if (extractedValue !== null) {
            updates = { weight: extractedValue };
            updateCollectedData(updates);
            await syncProfile({ weight: extractedValue });
            nextStep = 'height';
          } else {
            errorMessage = 'Geçerli bir kilo girmeniz gerekiyor (örn: 70 kg)';
          }
          break;

        case 'height':
          extractedValue = extractHeight(text);
          if (extractedValue !== null) {
            updates = { height: extractedValue };
            updateCollectedData(updates);
            await syncProfile({ height: extractedValue });
            nextStep = 'goal';
          } else {
            errorMessage = 'Geçerli bir boy girmeniz gerekiyor (örn: 175 cm)';
          }
          break;

        case 'goal':
          extractedValue = extractGoal(text);
          if (extractedValue) {
            updates = { goal: extractedValue };
            updateCollectedData(updates);
            await syncProfile({ goal: extractedValue as UserGoal });
            nextStep = 'allergies';
          } else {
            errorMessage =
              'Hedefinizi belirtmeniz gerekiyor: kilo verme, kilo alma, kas yapma veya koruma';
          }
          break;

        case 'allergies':
          extractedValue = extractAllergies(text);
          updates = { allergies: extractedValue };
          updateCollectedData(updates);
          await syncProfile({ allergies: extractedValue });
          nextStep = 'injuries';
          break;

        case 'injuries':
          extractedValue = extractInjuries(text);
          updates = { injuries: extractedValue };
          updateCollectedData(updates);
          await syncProfile({ injuries: extractedValue });
          nextStep = 'confirmation';
          break;

        case 'confirmation':
          if (text.toLowerCase().includes('evet') || text.toLowerCase().includes('onay')) {
            nextStep = 'generating';
          } else {
            nextStep = 'age';
          }
          break;
      }

      return { nextStep, errorMessage, updates };
    },
    [updateCollectedData]
  );

  // Bot yanıtı oluştur
  const getBotResponse = useCallback(
    (step: ChatStep, dataSnapshot: typeof collectedData): string => {
      const displayNumber = (value: unknown): string => {
        if (typeof value === 'number' && Number.isFinite(value)) {
          return String(value);
        }

        if (typeof value === 'string') {
          const normalized = value.trim();
          if (!normalized || normalized.toLowerCase() === 'undefined') {
            return 'bilinmiyor';
          }

          const asNumber = Number(normalized.replace(',', '.'));
          if (Number.isFinite(asNumber)) {
            return String(asNumber);
          }
        }

        return 'bilinmiyor';
      };

      switch (step) {
        case 'weight':
          return `Harika! ${displayNumber(dataSnapshot.age)} yaşındasınız. Şimdi mevcut kilonuzu öğrenebilir miyim? (kg cinsinden)`;
        case 'height':
          return `Tamam, ${displayNumber(dataSnapshot.weight)} kg. Peki boyunuz kaç cm?`;
        case 'goal':
          return `${displayNumber(dataSnapshot.height)} cm, anladım. Şimdi hedefinizi öğrenmek istiyorum. Kilo vermek mi, kilo almak mı, kas yapmak mı yoksa mevcut durumunuzu korumak mı istiyorsunuz?`;
        case 'allergies':
          return 'Anlıyorum! Herhangi bir besin alerjiniz var mı? Varsa lütfen belirtin, yoksa "yok" yazabilirsiniz.';
        case 'injuries':
          return 'Son olarak, herhangi bir sakatlık veya sağlık sorununuz var mı? Egzersiz programınızı buna göre ayarlayacağım. Yoksa "yok" yazabilirsiniz.';
        case 'confirmation':
          return (
            `Topladığım bilgiler:\n\n` +
            `Yaş: ${displayNumber(dataSnapshot.age)}\n` +
            `Kilo: ${displayNumber(dataSnapshot.weight)} kg\n` +
            `Boy: ${displayNumber(dataSnapshot.height)} cm\n` +
            `Hedef: ${dataSnapshot.goal ?? 'bilinmiyor'}\n` +
            `Alerjiler: ${dataSnapshot.allergies?.length ? dataSnapshot.allergies.join(', ') : 'Yok'}\n` +
            `Sakatlıklar: ${dataSnapshot.injuries?.length ? dataSnapshot.injuries.join(', ') : 'Yok'}\n\n` +
            `Bu bilgiler doğru mu? "Evet" derseniz kişisel planınızı oluşturmaya başlıyorum!`
          );
        case 'generating':
          return 'Mükemmel! Simdi size ozel diyet ve antrenman programinizi hazirliyorum. Bu birkac saniye surebilir...';
        default:
          return CHAT_QUESTIONS[step] || '';
      }
    },
    [collectedData]
  );

  // Mesaj gönderme
  const handleSend = useCallback(
    async (text: string) => {
      const sanitizedUserText = stripEmojis(text);
      if (!sanitizedUserText) {
        return;
      }

      // Kullanıcı mesajını ekle
      addUserMessage(sanitizedUserText);
      setIsTyping(true);

      // Simüle edilmiş gecikme
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Kullanıcı girişini işle
      const { nextStep, errorMessage, updates } = await processUserInput(sanitizedUserText, currentStep);

      const latestCollectedData = {
        ...useChatStore.getState().collectedData,
        ...(updates || {}),
      };

      if (errorMessage) {
        addBotMessage(stripEmojis(errorMessage));
      } else {
        setCurrentStep(nextStep);
        const response = getBotResponse(nextStep, latestCollectedData);
        addBotMessage(stripEmojis(response));

        // Kullanıcı bilgileri onaylandıktan sonra plan oluştur
        if (nextStep === 'generating') {
          try {
            setIsGenerating(true);

            const { age, weight, height, goal, allergies, injuries } = latestCollectedData;

            if (!age || !weight || !height || !goal) {
              throw new Error('Plan oluşturmak için gerekli bilgiler eksik.');
            }

            const apiResponse = await planService.generatePlan({
              userProfile: {
                age,
                weight,
                height,
                // backend UserGoal bekliyor
                goal: goal as any,
                allergies: allergies || [],
                injuries: injuries || [],
              },
            });

            if (!apiResponse.success || !apiResponse.data) {
              throw new Error(apiResponse.error?.message || 'Plan oluşturulurken bir hata oluştu');
            }

            setCurrentPlan(apiResponse.data);
            await loadUserPlans();

            addBotMessage(
              stripEmojis('Harika! Sana ozel diyet ve antrenman planini olusturdum. "Planlarim" sekmesinden detaylari gorebilirsin.')
            );

            setCurrentStep('complete');
          } catch (err: any) {
            console.error('Plan generation error:', err);
            setError(err?.message || 'Plan oluşturulurken bir hata oluştu');
            addBotMessage(
              stripEmojis('Uzgunum, plan olusturulurken bir hata olustu. Lutfen daha sonra tekrar dene veya giris yaptigindan emin ol.')
            );
          } finally {
            setIsGenerating(false);
          }
        }
      }

      setIsTyping(false);
    },
    [
      currentStep,
      processUserInput,
      getBotResponse,
      addUserMessage,
      addBotMessage,
      setCurrentStep,
      setIsTyping,
      collectedData,
      setCurrentPlan,
      setIsGenerating,
      setError,
      loadUserPlans,
      updateUserProfile,
      user,
      stripEmojis,
    ]
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <ChatBubble message={item} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        inverted
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
      />
      
      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.typingText}>Fitness AI yazıyor...</Text>
        </View>
      )}
      
      <ChatInput
        onSend={handleSend}
        disabled={isTyping || currentStep === 'generating' || currentStep === 'complete'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.chatBackground,
  },
  messageList: {
    paddingVertical: 16,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});

export default ChatScreen;
