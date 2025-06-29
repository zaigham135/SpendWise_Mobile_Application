// filepath: e:\Harish_sir_web_development\REACT JS\Expense_App_Fixed\src\screens\profile\profile.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from "react-native";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FooterSection } from '../Dhashboard/sections/FooterSection/FooterSection';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {profileStyles as styles} from "../../../style/profile/profile.styles";
const THEME_PURPLE = '#37474F'; // Dark gray color for the theme
const LIGHT_BG = '#fff';
const LIGHT_GRAY = '#f6f8fa';
const BORDER = '#e5e7eb';
const TEXT_GRAY = '#6b7280';
const Profile = ({navigation,setIsLoggedIn}) => {
  
 
  
  return (
    <View style={{ flex: 1, backgroundColor: LIGHT_GRAY }}>
      {/* Header */}
      <View style={{ backgroundColor: THEME_PURPLE, paddingBottom: 58, borderTopLeftRadius: 16, borderTopRightRadius: 16,borderBottomRightRadius:12, borderBottomLeftRadius:12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingTop: Platform.OS === 'ios' ? 48 : 18, paddingBottom: 18 }}>
          <Ionicons name="wallet" size={22} color={LIGHT_BG} style={{ marginRight: 8 }} />
          <Text style={{ color: LIGHT_BG, fontSize: 20, fontWeight: '700', letterSpacing: 0.5 }}>SpendWise</Text>
          <Ionicons name="settings-sharp" size={22} color={LIGHT_BG} style={{ marginLeft: 'auto' }} />
        </View>
      </View>
      {/* User Card */}
      <View style={[styles.userCard, { marginTop: -48 }]}>
        {/* Row: Profile picture + Name/Email */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.avatarCircle}>
            {/* Replace with <Image source={{uri: ...}} /> if you have a real image */}
            <Ionicons name="person" size={38} color={THEME_PURPLE} />
          </View>
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.userName}>Sarah Johnson</Text>
            <Text style={styles.userEmail}>sarah.johnson@example.com</Text>
          </View>
        </View>
        {/* Actions row */}
        <View style={[styles.profileActions, { marginTop: 18 }]}>
          <TouchableOpacity style={[styles.editBtn, { flexDirection: 'row', alignItems: 'center' }]} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="pencil" size={16} color={LIGHT_BG} style={{ marginRight: 6 }} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => setIsLoggedIn(false)}>
          
            <Ionicons name="log-out-outline" size={16} color="#22223b" style={{ marginRight: 6 }} />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { marginRight: 8 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <View style={styles.favCategoryIconBox}>
                <MaterialIcons name="account-balance-wallet" size={20} color={THEME_PURPLE} />
              </View>
            </View>
            <Text style={styles.summaryValue}>$1,245.80</Text>
            <Text style={styles.summarySub}>This Month</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8,justifyContent: 'space-between', width: '100%' }}>
              <Text style={styles.summaryLabel}>Transactions</Text>
              <View style={styles.favCategoryIconBox}>
                <MaterialCommunityIcons name="calendar-month-outline" size={20} color={THEME_PURPLE}  />
              </View>
            </View>
            <Text style={styles.summaryValue}>32</Text>
            <Text style={styles.summarySub}>This Month</Text>
          </View>
        </View>
        {/* Favorite Category */}
        <View style={styles.favCategoryCard}>
          <View style={styles.favCategoryRow}>
            <Text style={styles.favCategoryLabel}>Favorite Category</Text>
            <View style={styles.favCategoryIconBox}>
              <MaterialCommunityIcons name="food" size={20} color={THEME_PURPLE} />
            </View>
          </View>
          <Text style={styles.favCategoryTitle}>Food & Dining</Text>
          <Text style={styles.favCategorySub}>45% of total expenses</Text>
        </View>
        {/* Recent Activity */}
        <View style={styles.recentHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.activityCard}>
          <View style={styles.activityRow}>
            <View style={styles.activityIconBoxGreen}>
              <MaterialCommunityIcons name="food" size={18} color={THEME_PURPLE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>Grocery Store</Text>
              <Text style={styles.activitySub}>Today, 2:30 PM</Text>
            </View>
            <Text style={styles.activityAmountNeg}>-$85.20</Text>
          </View>
          <View style={styles.activityRow}>
            <View style={styles.activityIconBoxBlue}>
              <MaterialCommunityIcons name="gas-station" size={18} color={THEME_PURPLE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>Fuel Station</Text>
              <Text style={styles.activitySub}>Yesterday, 5:15 PM</Text>
            </View>
            <Text style={styles.activityAmountNeg}>-$45.50</Text>
          </View>
          <View style={styles.activityRow}>
            <View style={styles.activityIconBoxPurple}>
              <MaterialCommunityIcons name="tshirt-crew" size={18} color={THEME_PURPLE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>Fashion Store</Text>
              <Text style={styles.activitySub}>May 20, 1:10 PM</Text>
            </View>
            <Text style={styles.activityAmountNeg}>-$120.75</Text>
          </View>
        </View>
      </ScrollView>
      {/* <FooterSection /> */}
    </View>
  );
};



export default Profile;
