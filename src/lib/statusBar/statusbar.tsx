import React from "react";
import { View, StatusBar, StyleSheet, Platform } from "react-native";

const BAR_BG_COLOR = "white";
const BAR_STYLE = "dark-content";
// const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? "10px" : 0;

export const SystemStatusBar: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <View style={[styles.container]}>
      <StatusBar
        backgroundColor={BAR_BG_COLOR}
        barStyle={BAR_STYLE}
        translucent={false}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BAR_BG_COLOR,
  },
});
