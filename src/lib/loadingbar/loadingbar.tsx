import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, Easing, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { loadingBarStyles as styles } from "../../../style/loadingbar/loadingbar.styles";
const THEME_PURPLE = "#37474F";
const LIGHT_BG = "#fff";
const BORDER = "#e5e7eb";
const BAR_WIDTH = 120;

const QUOTES = [
  "Track every rupee, grow your savings.",
  "Smart spending, happy living.",
  "Expense maintaining made effortless.",
];

export default function WalletLoadingBar({ text = "Loading..." }) {
  // Animation for wallet "opening/closing" (gentle back and forth)
  const rotateAnim = useRef(new Animated.Value(0)).current;
  // Animation for loading bar
  const barAnim = useRef(new Animated.Value(0)).current;
  // Animation for shimmer
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Quotes animation
  const quoteAnim = useRef(new Animated.Value(1)).current;
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [barDone, setBarDone] = useState(false);

  useEffect(() => {
    // Wallet gentle back and forth (Z-axis)
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Loading bar: animate ONCE
    Animated.timing(barAnim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(() => setBarDone(true));
  }, []);

  // Start shimmer only after bar is done
  useEffect(() => {
    if (barDone) {
      shimmerAnim.setValue(0);
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start();
    }
  }, [barDone]);

  // Animate quotes
  useEffect(() => {
    let isMounted = true;
    const animateQuotes = () => {
      Animated.sequence([
        Animated.timing(quoteAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.delay(1200),
        Animated.timing(quoteAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.delay(200),
      ]).start(() => {
        if (isMounted) {
          setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
          animateQuotes();
        }
      });
    };
    animateQuotes();
    return () => { isMounted = false; };
  }, []);

  // Wallet rotation: gentle Z-axis
  const walletRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-30deg"],
  });

  // Loading bar width animation
  const barWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["10%", "100%"],
  });

  // Shimmer position
  const shimmerLeft = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_WIDTH - 30],
  });

  return (
    <View style={styles.container}>
      <View style={styles.walletContainer}>
        <Animated.View
          style={{
            transform: [
              { rotate: walletRotate },
            ],
          }}
        >
          <Ionicons name="wallet" size={54} color={THEME_PURPLE} />
        </Animated.View>
      </View>
      {/* Animated Quotes BELOW wallet, above bar */}
      <Animated.Text
        style={[
          styles.quote,
          {
            opacity: quoteAnim,
            transform: [
              {
                translateY: quoteAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
      >
        {QUOTES[quoteIndex]}
      </Animated.Text>
      <View style={styles.barBg}>
        <Animated.View style={[styles.bar, { width: barWidth }]} />
        {barDone && (
          <Animated.View
            style={[
              styles.shimmer,
              { left: shimmerLeft }
            ]}
          />
        )}
      </View>
      <Text style={styles.loadingText}>{text}</Text>
    </View>
  );
}

