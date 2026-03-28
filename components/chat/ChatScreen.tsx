import React, { useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Alert } from 'react-native';
import { useChatStore, usePlanStore } from '../../store';
import { planService } from '../../services';
import { ChatMessage, ChatStep } from '../../types/chat';
import { COLORS, CHAT_QUESTIONS } from '../../utils/constants';
import {
  extractAge,
  extractWeight,
  extractHeight,
  extractGoal,
  extractAllergies,
  extractInjuries,
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

  const { setCurrentPlan, setIsGenerating, setError } = usePlanStore();

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

      switch (step) {
        case 'age':
          extractedValue = extractAge(text);
          if (extractedValue) {
            updateCollectedData({ age: extractedValue });
            nextStep = 'weight';
          } else {
            errorMessage = 'Geçerli bir yaş girmeniz gerekiyor (örn: 25)';
          }
          break;

        case 'weight':
          extractedValue = extractWeight(text);
          if (extractedValue) {
            updateCollectedData({ weight: extractedValue });
            nextStep = 'height';
          } else {
            errorMessage = 'Geçerli bir kilo girmeniz gerekiyor (örn: 70 kg)';
          }
          break;

        case 'height':
          extractedValue = extractHeight(text);
          if (extractedValue) {
            updateCollectedData({ height: extractedValue });
            nextStep = 'goal';
          } else {
            errorMessage = 'Geçerli bir boy girmeniz gerekiyor (örn: 175 cm)';
          }
          break;

        case 'goal':
          extractedValue = extractGoal(text);
          if (extractedValue) {
            updateCollectedData({ goal: extractedValue });
            nextStep = 'allergies';
          } else {
            errorMessage =
              'Hedefinizi belirtmeniz gerekiyor: kilo verme, kilo alma, kas yapma veya koruma';
          }
          break;

        case 'allergies':
          extractedValue = extractAllergies(text);
          updateCollectedData({ allergies: extractedValue });
          nextStep = 'injuries';
          break;

        case 'injuries':
          extractedValue = extractInjuries(text);
          updateCollectedData({ injuries: extractedValue });
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

      return { nextStep, errorMessage };
    },
    [updateCollectedData]
  );

  // Bot yanıtı oluştur
  const getBotResponse = useCallback(
    (step: ChatStep): string => {
      switch (step) {
        case 'weight':
          return `Harika! ${collectedData.age} yaşındasınız. Şimdi mevcut kilonuzu öğrenebilir miyim? (kg cinsinden)`;
        case 'height':
          return `Tamam, ${collectedData.weight} kg. Peki boyunuz kaç cm?`;
        case 'goal':
          return `${collectedData.height} cm, anladım. Şimdi hedefinizi öğrenmek istiyorum. Kilo vermek mi, kilo almak mı, kas yapmak mı yoksa mevcut durumunuzu korumak mı istiyorsunuz?`;
        case 'allergies':
          return 'Anlıyorum! Herhangi bir besin alerjiniz var mı? Varsa lütfen belirtin, yoksa "yok" yazabilirsiniz.';
        case 'injuries':
          return 'Son olarak, herhangi bir sakatlık veya sağlık sorununuz var mı? Egzersiz programınızı buna göre ayarlayacağım. Yoksa "yok" yazabilirsiniz.';
        case 'confirmation':
          return (
            `Topladığım bilgiler:\n\n` +
            `📅 Yaş: ${collectedData.age}\n` +
            `⚖️ Kilo: ${collectedData.weight} kg\n` +
            `📏 Boy: ${collectedData.height} cm\n` +
            `🎯 Hedef: ${collectedData.goal}\n` +
            `🚫 Alerjiler: ${collectedData.allergies?.length ? collectedData.allergies.join(', ') : 'Yok'}\n` +
            `⚠️ Sakatlıklar: ${collectedData.injuries?.length ? collectedData.injuries.join(', ') : 'Yok'}\n\n` +
            `Bu bilgiler doğru mu? "Evet" derseniz kişisel planınızı oluşturmaya başlıyorum!`
          );
        case 'generating':
          return 'Mükemmel! 🎉 Şimdi size özel diyet ve antrenman programınızı hazırlıyorum. Bu birkaç saniye sürebilir...';
        default:
          return CHAT_QUESTIONS[step] || '';
      }
    },
    [collectedData]
  );

  // Mesaj gönderme
  const handleSend = useCallback(
    async (text: string) => {
      // Kullanıcı mesajını ekle
      addUserMessage(text);
      setIsTyping(true);

      // Simüle edilmiş gecikme
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Kullanıcı girişini işle
      const { nextStep, errorMessage } = await processUserInput(text, currentStep);

      if (errorMessage) {
        addBotMessage(errorMessage);
      } else {
        setCurrentStep(nextStep);
        const response = getBotResponse(nextStep);
        addBotMessage(response);

        // Kullanıcı bilgileri onaylandıktan sonra plan oluştur
        if (nextStep === 'generating') {
          try {
            setIsGenerating(true);

            const { age, weight, height, goal, allergies, injuries } = collectedData;

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

            addBotMessage(
              'Harika! 🎉 Sana özel diyet ve antrenman planını oluşturdum. "Planlarım" sekmesinden detayları görebilirsin.'
            );

            setCurrentStep('complete');
          } catch (err: any) {
            console.error('Plan generation error:', err);
            setError(err?.message || 'Plan oluşturulurken bir hata oluştu');
            addBotMessage(
              'Üzgünüm, plan oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar dene veya giriş yaptığından emin ol.'
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
