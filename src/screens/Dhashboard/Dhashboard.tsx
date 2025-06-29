import React, { JSX } from "react";
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CategoriesSection from '../../../components/sections/CategoriesSection';
import ExpenseTrendsSection from '../../../components/sections/ExpenseTrendsSection';
import RecentTransactionsSection from '../../../components/sections/RecentTransactionsSection';
import { FooterSection } from "./sections/FooterSection";
import {dashboardStyles as styles} from '../../../style/dashboard/dashboard.styles';
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


