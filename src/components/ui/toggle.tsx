"use client";

import * as React from "react";
import { TouchableOpacity, Text, ViewStyle, TextStyle } from "react-native";

interface ToggleProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isActive?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({ 
  children, 
  onPress, 
  style, 
  textStyle,
  isActive = false 
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[{
        backgroundColor: isActive ? '#3b82f6' : '#e5e7eb',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }, style]}
    >
      <Text style={[{
        color: isActive ? 'white' : '#4b5563',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'System'
      }, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export const toggleVariants = {
  default: {
    backgroundColor: '#3b82f6',
    color: 'white'
  },
  secondary: {
    backgroundColor: '#e5e7eb',
    color: '#4b5563'
  }
};
