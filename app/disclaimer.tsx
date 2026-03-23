import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../store';
import { Button } from '../components/ui';
import { COLORS } from '../utils/constants';

export default function DisclaimerScreen() {
  const router = useRouter();
  const { hasAcceptedDisclaimer, acceptDisclaimer, isAuthenticated } = useUserStore();

  // Eğer zaten kabul edilmişse, ana sayfaya yönlendir
  React.useEffect(() => {
    if (hasAcceptedDisclaimer) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login' as any);
      }
    }
  }, [hasAcceptedDisclaimer, isAuthenticated]);

  const handleAccept = async () => {
    await acceptDisclaimer();
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/login' as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>⚠️ Önemli Uyarı</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tıbbi Tavsiye Değildir</Text>
          <Text style={styles.text}>
            Bu uygulama yalnızca genel bilgilendirme amaçlıdır. Sunulan içerikler, 
            tavsiyeler, diyet planları ve egzersiz programları profesyonel tıbbi, 
            beslenme veya fitness danışmanlığı yerine geçmez.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profesyonel Danışmanlık</Text>
          <Text style={styles.text}>
            Herhangi bir sağlık sorununuz varsa veya yeni bir diyet/egzersiz 
            programına başlamadan önce mutlaka bir sağlık profesyoneline danışın.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Özellikle Dikkat Edilmesi Gereken Durumlar:</Text>
          <Text style={styles.listItem}>• Kronik hastalıklar (diyabet, kalp, tansiyon vb.)</Text>
          <Text style={styles.listItem}>• Hamilelik veya emzirme dönemi</Text>
          <Text style={styles.listItem}>• Yeme bozuklukları geçmişi</Text>
          <Text style={styles.listItem}>• Ciddi sakatlık veya fiziksel kısıtlamalar</Text>
          <Text style={styles.listItem}>• 18 yaş altı veya 65 yaş üstü bireyler</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yapay Zeka Sınırlamaları</Text>
          <Text style={styles.text}>
            Bu uygulama yapay zeka teknolojisi kullanmaktadır. AI tarafından 
            üretilen içerikler her zaman doğru veya uygun olmayabilir.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acil Durumlar</Text>
          <Text style={styles.emergencyText}>
            Tıbbi bir acil durumla karşılaşırsanız, derhal 112'yi arayın veya 
            en yakın acil servise başvurun.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            Bu uygulamayı kullanarak, tüm riskleri kabul ettiğinizi ve 
            geliştiricileri herhangi bir zarar veya kayıptan sorumlu 
            tutmayacağınızı kabul etmiş olursunuz.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Kabul Ediyorum"
          onPress={handleAccept}
          size="large"
          style={styles.acceptButton}
        />
        <Text style={styles.footerText}>
          Devam ederek yukarıdaki koşulları kabul etmiş olursunuz.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  listItem: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginLeft: 8,
  },
  emergencyText: {
    fontSize: 15,
    color: COLORS.error,
    lineHeight: 22,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  acceptButton: {
    width: '100%',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
});
