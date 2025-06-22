import * as React from "react";
import { View, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <View style={[{
      backgroundColor: 'white',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    }, style]}>
      {children}
    </View>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, style }) => {
  return (
    <View style={[{ padding: 16 }, style]}>
      {children}
    </View>
  );
};
