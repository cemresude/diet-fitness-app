import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../utils/constants';
import { WeekDay, WEEKDAY_LABELS } from '../../types/plan';

interface WeeklyCalendarProps {
  selectedDay: WeekDay;
  onDaySelect: (day: WeekDay) => void;
  activeDays?: WeekDay[]; // Antrenman olan günler
}

const WEEK_DAYS: WeekDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const SHORT_LABELS: Record<WeekDay, string> = {
  monday: 'Pzt',
  tuesday: 'Sal',
  wednesday: 'Çar',
  thursday: 'Per',
  friday: 'Cum',
  saturday: 'Cmt',
  sunday: 'Paz',
};

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  selectedDay,
  onDaySelect,
  activeDays = WEEK_DAYS,
}) => {
  return (
    <View style={styles.container}>
      {WEEK_DAYS.map((day) => {
        const isSelected = day === selectedDay;
        const isActive = activeDays.includes(day);

        return (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              isSelected && styles.dayButtonSelected,
              !isActive && styles.dayButtonInactive,
            ]}
            onPress={() => onDaySelect(day)}
            disabled={!isActive}
          >
            <Text
              style={[
                styles.dayText,
                isSelected && styles.dayTextSelected,
                !isActive && styles.dayTextInactive,
              ]}
            >
              {SHORT_LABELS[day]}
            </Text>
            {isActive && !isSelected && (
              <View style={styles.activeDot} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
  },
  dayButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    minWidth: 44,
  },
  dayButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  dayButtonInactive: {
    opacity: 0.5,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayTextSelected: {
    color: COLORS.textLight,
  },
  dayTextInactive: {
    color: COLORS.textSecondary,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
});

export default WeeklyCalendar;
