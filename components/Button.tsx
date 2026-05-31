import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  GestureResponderEvent
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  text?: string;
  variant?: 'primary' | 'secondary' | 'delete';
  onClick?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function Button({
  text,
  variant = 'primary',
  onClick,
  disabled = false,
  children,
}: ButtonProps) {

  const getGradientColors = () => {
    switch (variant) {
      case 'primary': return ['#4CAF50', '#8BC34A'];
      case 'secondary': return ['#E0E0E0', '#FFFFFF'];
      case 'delete': return ['#DC143C', '#FF4D6D'];
      default: return ['#4CAF50', '#8BC34A'];
    }
  };

  const isDelete = variant === 'delete';

  return (
    <View style={[styles.container, isDelete && styles.transparentContainer]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onClick}
        disabled={disabled}
        style={styles.touchable}
      >
        <LinearGradient
          colors={getGradientColors()}
          style={[
            styles.button,
            variant === 'delete' ? styles.deletePadding : styles.standardPadding
          ]}
        >
          {children || (
            <Text style={[
              styles.text,
              variant === 'secondary' ? styles.textSecondary : styles.textWhite
            ]}>
              {text}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0E0E0',
    padding: 5,
    borderRadius: 16,
    width: '100%',
  },
  transparentContainer: {
    backgroundColor: 'transparent',
  },
  touchable: {
    width: '100%',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#202020',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  button: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  standardPadding: {
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  deletePadding: {
    padding: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: '#000000',
  },
});