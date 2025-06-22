import * as React from "react";
import { View, ScrollView, ViewStyle } from "react-native";
import { Toggle } from "./toggle";

interface ToggleGroupProps {
  children: React.ReactNode;
  style?: ViewStyle;
  horizontal?: boolean;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({ 
  children, 
  style,
  horizontal = true 
}) => {
  if (horizontal) {
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={[{ flexDirection: 'row' }, style]}
      >
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {children}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={[{ flexDirection: 'column', gap: 8 }, style]}>
      {children}
    </View>
  );
};

export const ToggleGroupItem: React.FC<{
  children: React.ReactNode;
  value: string;
  onPress?: () => void;
  isActive?: boolean;
}> = ({ children, onPress, isActive = false }) => {
  return (
    <Toggle onPress={onPress} isActive={isActive}>
      {children}
    </Toggle>
  );
};
