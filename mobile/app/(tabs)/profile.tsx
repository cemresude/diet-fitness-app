import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUserStore, useChatStore, usePlanStore } from '../../store';
import { Card, Button } from '../../components/ui';
import { COLORS } from '../../utils/constants';
import { calculateBMI, getBMICategory } from '../../utils/helpers';

export default function ProfileTab() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const { collectedData, resetChat } = useChatStore();
  const { planHistory, clearCurrentPlan } = usePlanStore();

  // Profil verilerini al (ya store'dan ya da toplanan verilerden)
  const profileData = {
    age: user?.age || collectedData.age,
    weight: user?.weight || collectedData.weight,
    height: user?.height || collectedData.height,
    goal: user?.goal || collectedData.goal,
    allergies: user?.allergies || collectedData.allergies || [],
    injuries: user?.injuries || collectedData.injuries || [],
  };

  const bmi =
    profileData.weight && profileData.height
      ? calculateBMI(profileData.weight, profileData.height)
      : null;

  const handleResetChat = () => {
    Alert.alert(
      'Sohbeti Sıfırla',
      'Tüm sohbet geçmişi ve toplanan veriler silinecek. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: () => {
            resetChat();
            clearCurrentPlan();
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkmak istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  const goalLabels: Record<string, string> = {
    weight_loss: 'Kilo Verme',
    weight_gain: 'Kilo Alma',
    muscle_building: 'Kas Yapma',
    maintenance: 'Koruma',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profil Başlığı */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={COLORS.textLight} />
          </View>
          <Text style={styles.name}>{user?.name || 'Kullanıcı'}</Text>
          {user?.email && <Text style={styles.email}>{user.email}</Text>}
        </View>

        {/* Fiziksel Bilgiler */}
        {(profileData.age || profileData.weight || profileData.height) && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>📊 Fiziksel Bilgiler</Text>

            <View style={styles.statsGrid}>
              {profileData.age && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{profileData.age}</Text>
                  <Text style={styles.statLabel}>Yaş</Text>
                </View>
              )}
              {profileData.weight && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{profileData.weight}</Text>
                  <Text style={styles.statLabel}>kg</Text>
                </View>
              )}
              {profileData.height && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{profileData.height}</Text>
                  <Text style={styles.statLabel}>cm</Text>
                </View>
              )}
            </View>

            {bmi && (
              <View style={styles.bmiContainer}>
                <Text style={styles.bmiLabel}>BMI</Text>
                <Text style={styles.bmiValue}>{bmi}</Text>
                <Text style={styles.bmiCategory}>{getBMICategory(bmi)}</Text>
              </View>
            )}
          </Card>
        )}

        {/* Hedef ve Kısıtlamalar */}
        {profileData.goal && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>🎯 Hedef</Text>
            <Text style={styles.goalText}>
              {goalLabels[profileData.goal] || profileData.goal}
            </Text>

            {profileData.allergies.length > 0 && (
              <View style={styles.listSection}>
                <Text style={styles.listTitle}>🚫 Alerjiler</Text>
                <Text style={styles.listItems}>
                  {profileData.allergies.join(', ')}
                </Text>
              </View>
            )}

            {profileData.injuries.length > 0 && (
              <View style={styles.listSection}>
                <Text style={styles.listTitle}>⚠️ Sakatlıklar</Text>
                <Text style={styles.listItems}>
                  {profileData.injuries.join(', ')}
                </Text>
              </View>
            )}
          </Card>
        )}

        {/* Plan Geçmişi */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>📋 Plan Geçmişi</Text>
          <Text style={styles.planCount}>
            {planHistory.length} plan oluşturuldu
          </Text>
        </Card>

        {/* Ayarlar */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>⚙️ Ayarlar</Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleResetChat}>
            <Ionicons name="refresh" size={24} color={COLORS.error} />
            <Text style={[styles.menuText, { color: COLORS.error }]}>
              Sohbeti Sıfırla
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="document-text" size={24} color={COLORS.text} />
            <Text style={styles.menuText}>Gizlilik Politikası</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="information-circle" size={24} color={COLORS.text} />
            <Text style={styles.menuText}>Hakkında</Text>
          </TouchableOpacity>

          {user && (
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out" size={24} color={COLORS.error} />
              <Text style={[styles.menuText, { color: COLORS.error }]}>
                Çıkış Yap
              </Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Feragatname Hatırlatması */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ Bu uygulama profesyonel tıbbi veya beslenme danışmanlığı yerine
            geçmez. Herhangi bir programa başlamadan önce bir uzmana danışın.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  email: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  bmiContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  bmiLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  bmiValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  bmiCategory: {
    fontSize: 16,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  goalText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 12,
  },
  listSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  listItems: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  planCount: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuText: {
    fontSize: 16,
    color: COLORS.text,
  },
  disclaimer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
  },
  disclaimerText: {
    fontSize: 13,
    color: COLORS.secondary,
    lineHeight: 20,
  },
});
