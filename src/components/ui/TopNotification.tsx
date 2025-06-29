import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

type TopNotificationProps = {
  visible: boolean;
  message: string;
  color?: string;
  onHide?: () => void;
  duration?: number;
};

const TopNotification: React.FC<TopNotificationProps> = ({
  visible,
  message,
  color = "#22c55e",
  onHide,
  duration = 2000,
}) => {
  const translateY = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(translateY, {
          toValue: -80,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onHide) onHide();
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: color, transform: [{ translateY }], width: width - 32 },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    zIndex: 9999,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default TopNotification;