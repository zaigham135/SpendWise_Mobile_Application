// filepath: e:\Harish_sir_web_development\REACT JS\Expense_App_Fixed\src\screens\profile\profile.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from "react-native";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FooterSection } from '../Dhashboard/sections/FooterSection/FooterSection';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_PURPLE,
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 48 : 18,
    paddingBottom: 18,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerTitle: {
    color: LIGHT_BG,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  userCard: {
    backgroundColor: LIGHT_BG,
    marginHorizontal: 14,
    marginTop: -32,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 1,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginLeft: -45,
    borderWidth: 2,
    borderColor: LIGHT_BG,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#22223b',
    marginTop: 0,
  },
  userEmail: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginTop: 1,
  },
  profileActions: {
    flexDirection: 'row',
    marginTop: 18,
    width: '100%',
    justifyContent: 'space-between',
  },
  editBtn: {
    backgroundColor: THEME_PURPLE,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBtnText: {
    color: LIGHT_BG,
    fontWeight: '600',
    fontSize: 14,
  },
  logoutBtn: {
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: LIGHT_BG,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutBtnText: {
    color: '#22223b',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22223b',
    marginTop: 28,
    marginLeft: 18,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 14,
    marginBottom: 10,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: LIGHT_BG,
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    minWidth:0
  },
  
  summaryLabel: {
    fontSize: 13,
    color: TEXT_GRAY,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22223b',
    marginTop: 2,
  },
  summarySub: {
    fontSize: 12,
    color: TEXT_GRAY,
    marginTop: 2,
  },
  favCategoryCard: {
    backgroundColor: LIGHT_BG,
    borderRadius: 12,
    marginHorizontal: 14,
    marginBottom: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  favCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  favCategoryLabel: {
    fontSize: 13,
    color: TEXT_GRAY,
    fontWeight: '500',
    flex: 1,
  },
  favCategoryIconBox: {
    backgroundColor: '#ede9fe',
    borderRadius: 8,
    padding: 6,
    marginLeft: 8,
  },
  favCategoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22223b',
    marginTop: 2,
  },
  favCategorySub: {
    fontSize: 12,
    color: TEXT_GRAY,
    marginTop: 2,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 14,
    marginTop: 18,
    marginBottom: 6,
  },
  viewAll: {
    color: THEME_PURPLE,
    fontWeight: '600',
    fontSize: 13,
  },
  activityCard: {
    backgroundColor: LIGHT_BG,
    borderRadius: 12,
    marginHorizontal: 14,
    marginBottom: 18,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  activityIconBoxGreen: {
    backgroundColor: '#d1fae5',
    borderRadius: 8,
    padding: 6,
    marginRight: 10,
  },
  activityIconBoxBlue: {
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    padding: 6,
    marginRight: 10,
  },
  activityIconBoxPurple: {
    backgroundColor: '#ede9fe',
    borderRadius: 8,
    padding: 6,
    marginRight: 10,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22223b',
  },
  activitySub: {
    fontSize: 12,
    color: TEXT_GRAY,
    marginTop: 2,
  },
  activityAmountNeg: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ef4444',
    marginLeft: 8,
  },
});

export default Profile;
