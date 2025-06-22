import React, { JSX } from "react";
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CategoriesSection from '../../../components/sections/CategoriesSection';
import ExpenseTrendsSection from '../../../components/sections/ExpenseTrendsSection';
import RecentTransactionsSection from '../../../components/sections/RecentTransactionsSection';
import { FooterSection } from "./sections/FooterSection";

export const Dhashboard = (): JSX.Element => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <View style={styles.iconBox}>
            <View style={styles.walletIconBg}>
              <Ionicons name="wallet" size={16} color="white" />
            </View>
          </View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <View style={styles.iconBox}>
            <Ionicons name="notifications" size={18} color="#1f2937" />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CategoriesSection />
        <RecentTransactionsSection />
        <ExpenseTrendsSection />
      </ScrollView>
      {/* <FooterSection /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    position: 'relative',
  },
  headerWrapper: {
    width: '100%',
    backgroundColor: 'white',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 48 : 24,
    paddingBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletIconBg: {
    width: 32,
    height: 32,
    backgroundColor: '#37474F',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 100, // To avoid overlap with footer
  },
  section: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: 'white',
    padding: 12,
    // Optional: shadow for each section
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
});
