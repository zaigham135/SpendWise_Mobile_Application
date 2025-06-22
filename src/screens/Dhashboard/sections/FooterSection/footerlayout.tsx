import React from "react";
import { View, StyleSheet } from "react-native";
import AppNavigator from '../../../../lib/StackNavigator/stacknavigator';
export default function LayoutWithFooter() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppNavigator />
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, paddingBottom: 81 }, // height of your footer
});