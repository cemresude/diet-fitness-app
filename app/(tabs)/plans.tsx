import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { usePlanStore } from '../../store';
import { DietPlan, WorkoutPlan, WeeklyCalendar } from '../../components/plans';
import { Card, Button } from '../../components/ui';
import { COLORS } from '../../utils/constants';
import { WeekDay } from '../../types/plan';

type TabType = 'diet' | 'workout';

export default function PlansTab() {
  const { currentPlan, planHistory, isGenerating } = usePlanStore();
  const [activeTab, setActiveTab] = useState<TabType>('diet');
  const [selectedDay, setSelectedDay] = useState<WeekDay>('monday');

  // Plan yoksa boş durum göster
  if (!currentPlan && !isGenerating) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Henüz Planınız Yok</Text>
          <Text style={styles.emptyText}>
            Sohbet sekmesinden asistanla konuşarak kişiselleştirilmiş diyet ve
            antrenman planınızı oluşturabilirsiniz.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Plan oluşturuluyor
  if (isGenerating) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingState}>
          <Text style={styles.loadingIcon}>⏳</Text>
          <Text style={styles.loadingTitle}>Planınız Hazırlanıyor...</Text>
          <Text style={styles.loadingText}>
            Yapay zeka size özel programı oluşturuyor. Bu birkaç saniye
            sürebilir.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'diet' && styles.tabActive]}
          onPress={() => setActiveTab('diet')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'diet' && styles.tabTextActive,
            ]}
          >
            🥗 Diyet
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'workout' && styles.tabActive]}
          onPress={() => setActiveTab('workout')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'workout' && styles.tabTextActive,
            ]}
          >
            🏋️ Antrenman
          </Text>
        </TouchableOpacity>
      </View>

      {/* Haftalık Takvim */}
      <View style={styles.calendarContainer}>
        <WeeklyCalendar
          selectedDay={selectedDay}
          onDaySelect={setSelectedDay}
          activeDays={
            activeTab === 'workout'
              ? currentPlan?.workoutPlan.weeklySchedule.map((d) => d.day)
              : undefined
          }
        />
      </View>

      {/* Plan İçeriği */}
      {activeTab === 'diet' && currentPlan?.dietPlan && (
        <DietPlan plan={currentPlan.dietPlan} />
      )}
      {activeTab === 'workout' && currentPlan?.workoutPlan && (
        <WorkoutPlan plan={currentPlan.workoutPlan} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  tabTextActive: {
    color: COLORS.textLight,
  },
  calendarContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
