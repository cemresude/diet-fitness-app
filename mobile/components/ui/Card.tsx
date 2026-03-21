import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../utils/constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'elevated',
  padding = 'medium',
}) => {
  const getCardStyle = (): ViewStyle[] => {
    // 1. Stilleri eşleştiren map objesi
    const paddingStyles = {
      none: styles.padding_none,
      small: styles.padding_small,
      medium: styles.padding_medium,
      large: styles.padding_large,
    };

    // 2. baseStyle'ın tipini açıkça ViewStyle[] olarak belirtiyoruz
    const baseStyle: ViewStyle[] = [styles.card, paddingStyles[padding]];
    
    switch (variant) {
      case 'elevated':
        baseStyle.push(styles.elevated);
        break;
      case 'outlined':
        baseStyle.push(styles.outlined);
        break;
      case 'filled':
        baseStyle.push(styles.filled);
        break;
    }
    
    return baseStyle;
  };

  return <View style={[...getCardStyle(), style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  padding_none: { padding: 0 },
  padding_small: { padding: 8 },
  padding_medium: { padding: 16 },
  padding_large: { padding: 24 },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  outlined: {
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filled: {
    backgroundColor: COLORS.primaryLight,
  },
});

export default Card;