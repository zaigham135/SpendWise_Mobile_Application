import * as React from "react";
import { TouchableOpacity, Text, ViewStyle, TextStyle } from "react-native";

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onPress, 
  style, 
  textStyle,
  disabled = false 
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[{
        backgroundColor: disabled ? '#9ca3af' : '#3b82f6',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }, style]}
    >
      <Text style={[{
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'System'
      }, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};
