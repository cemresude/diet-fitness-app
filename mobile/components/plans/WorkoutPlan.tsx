import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../ui/Card';
import { COLORS } from '../../utils/constants';
import {
  WorkoutPlan as WorkoutPlanType,
  WEEKDAY_LABELS,
  WORKOUT_FOCUS_LABELS,
} from '../../types/plan';

interface WorkoutPlanProps {
  plan: WorkoutPlanType;
}

export const WorkoutPlan: React.FC<WorkoutPlanProps> = ({ plan }) => {
  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low':
        return COLORS.success;
      case 'medium':
        return COLORS.secondary;
      case 'high':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getIntensityLabel = (intensity: string) => {
    switch (intensity) {
      case 'low':
        return 'Düşük';
      case 'medium':
        return 'Orta';
      case 'high':
        return 'Yüksek';
      default:
        return intensity;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Haftalık Program */}
      <Text style={styles.weeklyTitle}>🏋️ Haftalık Antrenman Programı</Text>

      {plan.weeklySchedule.map((day, index) => (
        <Card key={index} style={styles.dayCard}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayTitle}>{WEEKDAY_LABELS[day.day]}</Text>
            <View
              style={[
                styles.intensityBadge,
                { backgroundColor: getIntensityColor(day.intensity) },
              ]}
            >
              <Text style={styles.intensityText}>
                {getIntensityLabel(day.intensity)}
              </Text>
            </View>
          </View>

          <View style={styles.dayMeta}>
            <Text style={styles.focus}>{WORKOUT_FOCUS_LABELS[day.focus]}</Text>
            <Text style={styles.duration}>⏱️ {day.duration} dk</Text>
          </View>

          {day.exercises.map((exercise, exIndex) => (
            <View key={exIndex} style={styles.exerciseItem}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <View style={styles.exerciseDetails}>
                {exercise.sets && exercise.reps && (
                  <Text style={styles.exerciseInfo}>
                    {exercise.sets} set x {exercise.reps} tekrar
                  </Text>
                )}
                {exercise.duration && (
                  <Text style={styles.exerciseInfo}>
                    {exercise.duration} saniye
                  </Text>
                )}
                <Text style={styles.restInfo}>
                  Dinlenme: {exercise.rest}s
                </Text>
              </View>
              {exercise.equipment && exercise.equipment.length > 0 && (
                <Text style={styles.equipment}>
                  🔧 {exercise.equipment.join(', ')}
                </Text>
              )}
              {exercise.notes && (
                <Text style={styles.notes}>💡 {exercise.notes}</Text>
              )}
            </View>
          ))}
        </Card>
      ))}

      {/* Dinlenme Günleri */}
      {plan.restDays.length > 0 && (
        <Card style={styles.restCard}>
          <Text style={styles.sectionTitle}>😴 Dinlenme Günleri</Text>
          <Text style={styles.restDays}>
            {plan.restDays.map((day) => WEEKDAY_LABELS[day]).join(', ')}
          </Text>
        </Card>
      )}

      {/* Isınma Rutini */}
      {plan.warmUpRoutine.length > 0 && (
        <Card style={styles.routineCard}>
          <Text style={styles.sectionTitle}>🔥 Isınma Rutini</Text>
          {plan.warmUpRoutine.map((exercise, index) => (
            <View key={index} style={styles.routineItem}>
              <Text style={styles.routineExercise}>• {exercise.name}</Text>
              {exercise.duration && (
                <Text style={styles.routineDuration}>
                  {exercise.duration}s
                </Text>
              )}
            </View>
          ))}
        </Card>
      )}

      {/* Soğuma Rutini */}
      {plan.coolDownRoutine.length > 0 && (
        <Card style={styles.routineCard}>
          <Text style={styles.sectionTitle}>❄️ Soğuma Rutini</Text>
          {plan.coolDownRoutine.map((exercise, index) => (
            <View key={index} style={styles.routineItem}>
              <Text style={styles.routineExercise}>• {exercise.name}</Text>
              {exercise.duration && (
                <Text style={styles.routineDuration}>
                  {exercise.duration}s
                </Text>
              )}
            </View>
          ))}
        </Card>
      )}

      {/* Öneriler */}
      {plan.recommendations.length > 0 && (
        <Card style={styles.recommendationsCard}>
          <Text style={styles.sectionTitle}>💡 Öneriler</Text>
          {plan.recommendations.map((rec, index) => (
            <Text key={index} style={styles.recommendation}>
              • {rec}
            </Text>
          ))}
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  weeklyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  dayCard: {
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  intensityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  intensityText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  dayMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  focus: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  duration: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  exerciseItem: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  exerciseInfo: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  restInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  equipment: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  notes: {
    fontSize: 13,
    color: COLORS.accent,
    marginTop: 4,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  restCard: {
    marginTop: 16,
    backgroundColor: '#E3F2FD',
  },
  restDays: {
    fontSize: 16,
    color: COLORS.text,
  },
  routineCard: {
    marginTop: 12,
  },
  routineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  routineExercise: {
    fontSize: 14,
    color: COLORS.text,
  },
  routineDuration: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  recommendationsCard: {
    marginTop: 16,
    marginBottom: 24,
    backgroundColor: COLORS.primaryLight,
  },
  recommendation: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
});

export default WorkoutPlan;
