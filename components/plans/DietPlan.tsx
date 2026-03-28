import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../ui/Card';
import { COLORS } from '../../utils/constants';
import { DietPlan as DietPlanType, MEAL_TYPE_LABELS, WEEKDAY_LABELS } from '../../types/plan';

interface DietPlanProps {
  plan: DietPlanType;
}

export const DietPlan: React.FC<DietPlanProps> = ({ plan }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Özet Kart */}
      <Card style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>📊 Günlük Hedefler</Text>
        
        <View style={styles.calorieContainer}>
          <Text style={styles.calorieValue}>{plan.dailyCalories}</Text>
          <Text style={styles.calorieLabel}>kcal/gün</Text>
        </View>
        
        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{plan.macros.protein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{plan.macros.carbs}g</Text>
            <Text style={styles.macroLabel}>Karbonhidrat</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{plan.macros.fat}g</Text>
            <Text style={styles.macroLabel}>Yağ</Text>
          </View>
        </View>
      </Card>

      {/* Haftalık Menü */}
      <Text style={styles.weeklyTitle}>🗓️ Haftalık Menü</Text>
      
      {plan.weeklyMenu.map((day, index) => (
        <Card key={index} style={styles.dayCard}>
          <Text style={styles.dayTitle}>{WEEKDAY_LABELS[day.day]}</Text>
          <Text style={styles.dayCalories}>{day.totalCalories} kcal</Text>
          
          {day.meals.map((meal, mealIndex) => (
            <View key={mealIndex} style={styles.mealItem}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealType}>{MEAL_TYPE_LABELS[meal.type]}</Text>
                <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
              </View>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealIngredients}>
                {meal.ingredients.join(', ')}
              </Text>
            </View>
          ))}
        </Card>
      ))}

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

      {/* Kısıtlamalar */}
      {plan.restrictions.length > 0 && (
        <Card style={styles.restrictionsCard}>
          <Text style={styles.sectionTitle}>⚠️ Dikkat Edilecekler</Text>
          {plan.restrictions.map((rest, index) => (
            <Text key={index} style={styles.restriction}>
              • {rest}
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
  summaryCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  calorieContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  calorieValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  calorieLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  macroLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  weeklyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 8,
  },
  dayCard: {
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  dayCalories: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  mealItem: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealType: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  mealCalories: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginTop: 4,
  },
  mealIngredients: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  recommendationsCard: {
    marginTop: 16,
    backgroundColor: COLORS.primaryLight,
  },
  recommendation: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  restrictionsCard: {
    marginTop: 12,
    marginBottom: 24,
    backgroundColor: '#FFF3E0',
  },
  restriction: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
});

export default DietPlan;
