import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { profileStyles as styles } from "../../../style/profile/profile.styles"; // Ensure this path is correct
import axiosInstance from '../../api/axios/axiosInstance'; // Ensure this path is correct
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";
import { Toast } from 'react-native-toast-message/lib/src/Toast'; // Assuming you have toast-message setup

// --- THEME & COLORS (Based on your provided constants) ---
const THEME_PURPLE = '#37474F';
const LIGHT_BG = '#fff';
const LIGHT_GRAY = '#f6f8fa';
const TEXT_GRAY = '#6b7280';
const RED = '#dc2626';
const GREEN = '#16a34a';
const DARK = "#22223b";

// --- NEW HELPER FUNCTION FOR LIGHTENING COLOR ---
const lightenColor = (hex: string, percent: number) => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
    return '#f0f0f0'; // Light gray as a safe fallback for invalid hex
  }

  let f = parseInt(hex.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = (f >> 8) & 0x00ff, B = f & 0x0000ff;
  return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
};


// Define a mapping for DEFAULT category names and their default icon colors.
// iconBg will be derived from iconColor.
const CATEGORY_ICON_MAP = {
  'travel': { icon: 'airplane-outline', iconColor: '#4F46E5', library: 'Ionicons' }, // Indigo
  'food': { icon: 'restaurant-outline', iconColor: '#F59E0B', library: 'Ionicons' }, // Amber
  'petrol': { icon: 'gas-station', iconColor: '#EF4444', library: 'MaterialCommunityIcons' }, // Red
  'clothes': { icon: 'shirt-outline', iconColor: '#EC4899', library: 'Ionicons' }, // Pink
  'rent': { icon: 'home-outline', iconColor: '#10B981', library: 'Ionicons' }, // Emerald Green
  'groceries': { icon: 'basket-outline', iconColor: '#EAB308', library: 'Ionicons' }, // Yellow
  'other': { icon: 'ellipsis-horizontal', iconColor: '#8B5CF6', library: 'Ionicons' }, // Purple fallback
  'income': { icon: 'bank', iconColor: '#16A34A', library: 'MaterialCommunityIcons' }, // Darker Green for Income icon
};

const renderActivityIcon = (iconLibrary: string, iconName: string, iconColor: string) => {
  const size = 18;
  switch (iconLibrary) {
    case 'Ionicons':
      return <Ionicons name={iconName as any} size={size} color={iconColor} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={iconName as any} size={size} color={iconColor} />;
    case 'MaterialIcons':
      return <MaterialIcons name={iconName as any} size={size} color={iconColor} />;
    default:
      return <Ionicons name="help-circle" size={size} color={iconColor} />;
  }
};

// Define the structure of your user object
interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  profile_photo: string | null;
}

// Interface for transaction data displayed in recent activities
interface DisplayTransaction {
  id: string;
  name: string;
  date: string;
  amount: string;
  icon: string;
  iconBg: string;
  iconColor: string; // Added to store the icon's primary color
  type: 'expense' | 'income';
  iconLibrary: 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons' | 'FontAwesome5' | 'Entypo'; // Extended possible libraries
  section?: string;
  payment_mode?: string;
  notes?: string;
}

interface IncomeTransaction {
  id: string;
  title: string;
  income: string; // The amount, should be string as from backend
  date: string;
  section: string;
  payment_mode?: string;
  notes?: string;
}

interface ProfileScreenProps {
  navigation: StackNavigationProp<any>;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, setIsLoggedIn }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState<string | null>(null);

  const [summaryTotalExpenses, setSummaryTotalExpenses] = useState<number>(0);
  const [summaryTransactionCount, setSummaryTransactionCount] = useState<number>(0);
  const [activeSummaryPeriod, setActiveSummaryPeriod] = useState<string>('thisMonth');
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);

  const [favCategoryName, setFavCategoryName] = useState<string>('N/A');
  const [favCategoryPercentage, setFavCategoryPercentage] = useState<number>(0);
  const [loadingFavorite, setLoadingFavorite] = useState(true);
  const [errorFavorite, setErrorFavorite] = useState<string | null>(null);

  const [bankBalance, setBankBalance] = useState<number>(0);
  const [allIncomeTransactions, setAllIncomeTransactions] = useState<IncomeTransaction[]>([]);
  const [loadingBalance, setLoadingBalance] = useState(true); // Used for both bank balance and all income transactions
  const [errorBalance, setErrorBalance] = useState<string | null>(null);

  const [isAddBalanceModalVisible, setIsAddBalanceModalVisible] = useState(false);
  const [isDepositHistoryModalVisible, setIsDepositHistoryModalVisible] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [isAddingBalance, setIsAddingBalance] = useState(false); // For add balance API loading

  const [recentActivities, setRecentActivities] = useState<DisplayTransaction[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [errorActivities, setErrorActivities] = useState<string | null>(null);

  const summaryTimePeriods = useMemo(() => ([
    { value: 'thisMonth', label: 'This Month' },
    { value: 'last3Months', label: 'Last 3 Months' },
    { value: 'last6Months', label: 'Last 6 Months' },
    { value: 'last12Months', label: 'Last 12 Months' },
  ]), []);

  // --- Profile Data Fetching ---
  const fetchProfile = useCallback(async () => {
    setLoadingUser(true);
    setErrorUser(null);
    try {
      const response = await axiosInstance.get('/profile');
      const fetchedUser: UserProfile = response.data;
      setUser(fetchedUser);
      await AsyncStorage.setItem('user', JSON.stringify(fetchedUser));
    } catch (err: any) {
      console.error("Failed to fetch profile:", err.response?.data || err.message);
      setErrorUser(err.response?.data?.error || "Failed to fetch profile data.");
      // If fetching user profile fails, it might be due to an invalid token.
      // Consider clearing token and logging out.
      Alert.alert("Error", err.response?.data?.error || "Failed to fetch profile data. Please log in again.");
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setIsLoggedIn(false);
    } finally {
      setLoadingUser(false);
    }
  }, [setIsLoggedIn]);

  // --- Summary Data Fetching ---
  const fetchSummaryData = useCallback(async (period: string) => {
    setLoadingSummary(true);
    setErrorSummary(null);
    try {
      const response = await axiosInstance.get(`/items/summary?period=${period}`);
      setSummaryTotalExpenses(response.data.totalExpenses || 0);
      setSummaryTransactionCount(response.data.totalCount || 0);
    } catch (err: any) {
      console.error(`Error fetching summary for ${period}:`, err.response?.data || err.message);
      setErrorSummary(`Failed to load summary for ${period}.`);
      setSummaryTotalExpenses(0);
      setSummaryTransactionCount(0);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  // --- Favorite Category Fetching ---
  const fetchFavoriteCategory = useCallback(async () => {
    setLoadingFavorite(true);
    setErrorFavorite(null);
    try {
      const response = await axiosInstance.get('/items/category-summary');
      const categorySummaries = response.data;

      if (!categorySummaries || categorySummaries.length === 0) {
        setFavCategoryName('N/A');
        setFavCategoryPercentage(0);
        setLoadingFavorite(false);
        return;
      }

      let favoriteCategory = { section: 'N/A', total_expenses: 0 };
      let overallTotalExpenses = 0;

      categorySummaries.forEach((cat: { section: string; total_expenses: number }) => {
        overallTotalExpenses += cat.total_expenses;
        if (cat.total_expenses > favoriteCategory.total_expenses) {
          favoriteCategory = cat;
        }
      });

      let percentage = 0;
      if (overallTotalExpenses > 0) {
        percentage = (favoriteCategory.total_expenses / overallTotalExpenses) * 100;
      }

      setFavCategoryName(favoriteCategory.section);
      setFavCategoryPercentage(percentage);

    } catch (err: any) {
      console.error("Error fetching favorite category:", err.response?.data || err.message);
      setErrorFavorite("Failed to load favorite category.");
      setFavCategoryName('N/A');
      setFavCategoryPercentage(0);
    } finally {
      setLoadingFavorite(false);
    }
  }, []);

  // --- Bank Balance Data Fetching ---
  const fetchBankBalance = useCallback(async () => {
    setLoadingBalance(true);
    setErrorBalance(null);
    try {
      const response = await axiosInstance.get('/profile/balance');
      setBankBalance(response.data.balance || 0);
    } catch (err: any) {
      console.error("Error fetching bank balance:", err.response?.data || err.message);
      setErrorBalance("Failed to load bank balance.");
      setBankBalance(0);
    } finally {
      setLoadingBalance(false);
    }
  }, []);

  // --- All Income Transactions Fetching (for history modal) ---
  const fetchAllIncomeTransactions = useCallback(async () => {
    setLoadingBalance(true); // Use this for modal loading too
    setErrorBalance(null);
    try {
      const response = await axiosInstance.get('/profile/income-transactions');
      setAllIncomeTransactions(response.data.incomeTransactions || []);
    } catch (err: any) {
      console.error("Error fetching all income transactions:", err.response?.data || err.message);
      setErrorBalance(err.response?.data?.error || "Failed to load all income transactions.");
      setAllIncomeTransactions([]); // Clear previous data on error
    } finally {
      setLoadingBalance(false);
    }
  }, []);

  // --- Add Balance Handler ---
  const handleAddBalance = async () => {
    const amount = parseFloat(amountToAdd);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid positive number.");
      return;
    }
    setIsAddingBalance(true);
    try {
      await axiosInstance.post('/profile/balance/add', { amount });
      Toast.show({
        type: 'success',
        text1: 'Balance Added!',
        text2: `₹${amount.toFixed(2)} has been deposited.`,
      });
      setAmountToAdd(''); // Clear input
      setIsAddBalanceModalVisible(false); // Close modal
      await fetchBankBalance(); // Re-fetch bank balance to update display
      await fetchAllIncomeTransactions(); // Re-fetch all incomes to update history modal
      await fetchRecentActivities(); // Also update recent activities if needed
    } catch (err: any) {
      console.error("Error adding balance:", err.response?.data || err.message);
      Toast.show({
        type: 'error',
        text1: 'Deposit Failed',
        text2: err.response?.data?.error || 'Could not add balance. Please try again.',
      });
    } finally {
      setIsAddingBalance(false);
    }
  };

  // --- Delete Income Transaction Handler ---
  const handleDeleteIncomeTransaction = async (transactionId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this deposit entry? This action cannot be undone and will reduce your total deposited amount.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axiosInstance.delete(`/profile/income-transactions/delete/${transactionId}`);
              Toast.show({
                type: 'success',
                text1: 'Deposit Deleted!',
                text2: 'The deposit entry has been removed.',
              });
              await fetchBankBalance(); // Re-fetch bank balance to update display
              await fetchAllIncomeTransactions(); // Re-fetch history to update modal
              await fetchRecentActivities(); // Also update recent activities if needed
            } catch (err: any) {
              console.error("Error deleting income transaction:", err.response?.data || err.message);
              Toast.show({
                type: 'error',
                text1: 'Deletion Failed',
                text2: err.response?.data?.error || 'Could not delete deposit. Please try again.',
              });
            }
          },
        },
      ]
    );
  };

  // --- Recent Activities Fetching ---
  const fetchRecentActivities = useCallback(async () => {
    setLoadingActivities(true);
    setErrorActivities(null);
    try {
      // Fetch expenses
      const expenseResponse = await axiosInstance.get('/items', {
        params: { _limit: 3, _sort: 'date', _order: 'desc' }
      });
      const rawExpenses = expenseResponse.data;

      // Fetch recent income transactions (get more to ensure we have enough for sorting)
      const incomeResponse = await axiosInstance.get('/profile/all-transactions');
      const rawIncomes = incomeResponse.data.incomeTransactions || [];

      // Combine all transactions and sort by date, then take the top 3
      const allTransactions = [...rawExpenses, ...rawIncomes]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3); // Take only the most recent 3

      const processedActivities: DisplayTransaction[] = allTransactions.map((rawTxn: any) => {
        const fullDate = new Date(rawTxn.date);
        const transactionType: 'expense' | 'income' = rawTxn.section === 'Income' ? 'income' : 'expense';

        let displayIconName: string;
        let displayIconLibrary: 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons' | 'FontAwesome5' | 'Entypo';
        let displayIconColor: string;
        let displayIconBg: string;

        if (transactionType === 'income') {
          const incomeConfig = CATEGORY_ICON_MAP['income'];
          displayIconName = incomeConfig.icon;
          displayIconLibrary = incomeConfig.library as any; // Cast as it's a known valid library
          displayIconColor = incomeConfig.iconColor;
          displayIconBg = lightenColor(incomeConfig.iconColor, 0.85); // Lighten for background
        } else if (rawTxn.iconLibrary && rawTxn.iconName) {
          // If transaction has custom icon data from the database, use it
          displayIconName = rawTxn.iconName;
          displayIconLibrary = rawTxn.iconLibrary;
          // Use stored iconColor if available, otherwise a sensible default
          displayIconColor = rawTxn.iconColor || CATEGORY_ICON_MAP['other'].iconColor;
          // Lighten the iconColor for the background
          displayIconBg = lightenColor(displayIconColor, 0.85);
        } else {
          // Fallback for predefined categories or if DB data is missing
          const sectionName = (rawTxn.section || 'other').toLowerCase();
          const defaultConfig = CATEGORY_ICON_MAP[sectionName as keyof typeof CATEGORY_ICON_MAP] || CATEGORY_ICON_MAP['other'];
          displayIconName = defaultConfig.icon;
          displayIconLibrary = defaultConfig.library as any; // Cast as it's a known valid library
          displayIconColor = defaultConfig.iconColor;
          displayIconBg = lightenColor(displayIconColor, 0.85); // Lighten for background
        }

        return {
          id: String(rawTxn.id),
          name: rawTxn.title || rawTxn.name || 'Unknown', // 'title' for income, 'name' for expense
          date: fullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }),
          amount: parseFloat(rawTxn.value || rawTxn.amount || "0").toFixed(2), // 'value' for income, 'amount' for expense
          icon: displayIconName,
          iconBg: displayIconBg,
          iconColor: displayIconColor, // Pass the icon's color
          type: transactionType,
          iconLibrary: displayIconLibrary,
        };
      });
      setRecentActivities(processedActivities);
    } catch (err: any) {
      console.error("Error fetching recent activities:", err.response?.data || err.message);
      setErrorActivities("Failed to load recent activities.");
      setRecentActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  }, []);

  // --- Combined Data Fetching on Focus ---
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      fetchSummaryData(activeSummaryPeriod);
      fetchFavoriteCategory();
      fetchBankBalance();
      fetchRecentActivities();
      // When the screen loses focus, you might want to reset certain states
      return () => {
        setIsAddBalanceModalVisible(false);
        setIsDepositHistoryModalVisible(false);
        setAmountToAdd('');
      };
    }, [fetchProfile, fetchSummaryData, activeSummaryPeriod, fetchFavoriteCategory, fetchBankBalance, fetchRecentActivities])
  );

  // --- Fetch all income transactions when modal opens ---
  useEffect(() => {
    if (isDepositHistoryModalVisible) {
      fetchAllIncomeTransactions();
    }
  }, [isDepositHistoryModalVisible, fetchAllIncomeTransactions]);

  // --- Logout Handler ---
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            setIsLoggedIn(false);
            Toast.show({
              type: 'info',
              text1: 'Logged Out',
              text2: 'You have been successfully logged out.',
            });
            // Reset navigation stack to Login screen
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
          style: "destructive"
        }
      ]
    );
  };

  // Calculate current balance based on bank balance (total deposited) minus total expenses from summary
  const currentCalculatedBalance = bankBalance - summaryTotalExpenses;
  const totalDepositedAmount = bankBalance; // `bankBalance` is directly your total deposited amount from the backend

  if (loadingUser) {
    return (
      <View style={localProfileScreenStyles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME_PURPLE} />
        <Text style={localProfileScreenStyles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (errorUser || !user) {
    return (
      <View style={localProfileScreenStyles.errorContainer}>
        <Text style={localProfileScreenStyles.errorText}>{errorUser || "User data not available."}</Text>
        <TouchableOpacity style={localProfileScreenStyles.retryButton} onPress={fetchProfile}>
          <Text style={localProfileScreenStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: LIGHT_GRAY }}>
      {/* Header */}
      <View style={{ backgroundColor: THEME_PURPLE, paddingBottom: 58, borderTopLeftRadius: 16, borderTopRightRadius: 16, borderBottomRightRadius: 12, borderBottomLeftRadius: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingTop: Platform.OS === 'ios' ? 48 : 18, paddingBottom: 18 }}>
          <Ionicons name="wallet" size={22} color={LIGHT_BG} style={{ marginRight: 8 }} />
          <Text style={{ color: LIGHT_BG, fontSize: 20, fontWeight: '700', letterSpacing: 0.5 }}>SpendWise</Text>
          <Ionicons name="settings-sharp" size={22} color={LIGHT_BG} style={{ marginLeft: 'auto' }} />
        </View>
      </View>

      {/* User Card */}
      <View style={[styles.userCard, { marginTop: -48 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.avatarCircle}>
            {user.profile_photo ? (
              <Image source={{ uri: user.profile_photo }} style={localProfileScreenStyles.profileImage} />
            ) : (
              <Ionicons name="person" size={38} color={THEME_PURPLE} />
            )}
          </View>
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.userName}>{user.first_name} {user.last_name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        <View style={[styles.profileActions, { marginTop: 18 }]}>
          <TouchableOpacity
            style={[styles.editBtn, { flexDirection: 'row', alignItems: 'center' }]}
            onPress={() => navigation.navigate('EditProfile', { initialUser: user })}
          >
            <Ionicons name="pencil" size={16} color={LIGHT_BG} style={{ marginRight: 6 }} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={16} color="#22223b" style={{ marginRight: 6 }} />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Summary Section */}
        <View style={localProfileScreenStyles.summaryHeader}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={localProfileScreenStyles.pickerContainer}>
            <Picker
              selectedValue={activeSummaryPeriod}
              onValueChange={(itemValue) => {
                setActiveSummaryPeriod(itemValue);
                fetchSummaryData(itemValue);
              }}
              style={localProfileScreenStyles.picker}
              itemStyle={localProfileScreenStyles.pickerItem}
            >
              {summaryTimePeriods.map((period) => (
                <Picker.Item key={period.value} label={period.label} value={period.value} />
              ))}
            </Picker>
          </View>
        </View>

        {loadingSummary ? (
          <ActivityIndicator size="small" color={THEME_PURPLE} style={{ marginVertical: 20 }} />
        ) : errorSummary ? (
          <View style={localProfileScreenStyles.summaryErrorContainer}>
            <Text style={localProfileScreenStyles.summaryErrorText}>{errorSummary}</Text>
            <TouchableOpacity onPress={() => fetchSummaryData(activeSummaryPeriod)} style={localProfileScreenStyles.retryButtonSmall}>
              <Text style={localProfileScreenStyles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { marginRight: 8 }]}>
              <View style={localProfileScreenStyles.summaryCardHeader}>
                <Text style={styles.summaryLabel}>Total Expenses</Text>
                <View style={styles.favCategoryIconBox}>
                  <MaterialIcons name="account-balance-wallet" size={20} color={THEME_PURPLE} />
                </View>
              </View>
              <Text style={styles.summaryValue}>₹{summaryTotalExpenses.toFixed(2)}</Text>
              <Text style={styles.summarySub}>{summaryTimePeriods.find(p => p.value === activeSummaryPeriod)?.label}</Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={localProfileScreenStyles.summaryCardHeader}>
                <Text style={styles.summaryLabel}>Transactions</Text>
                <View style={styles.favCategoryIconBox}>
                  <MaterialCommunityIcons name="calendar-month-outline" size={20} color={THEME_PURPLE} />
                </View>
              </View>
              <Text style={styles.summaryValue}>{summaryTransactionCount}</Text>
              <Text style={styles.summarySub}>{summaryTimePeriods.find(p => p.value === activeSummaryPeriod)?.label}</Text>
            </View>
          </View>
        )}

        {loadingFavorite ? (
          <ActivityIndicator size="small" color={THEME_PURPLE} style={{ marginVertical: 20 }} />
        ) : errorFavorite ? (
          <View style={localProfileScreenStyles.summaryErrorContainer}>
            <Text style={localProfileScreenStyles.summaryErrorText}>{errorFavorite}</Text>
            <TouchableOpacity onPress={fetchFavoriteCategory} style={localProfileScreenStyles.retryButtonSmall}>
              <Text style={localProfileScreenStyles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.favCategoryCard}>
            <View style={styles.favCategoryRow}>
              <Text style={styles.favCategoryLabel}>Favorite Category</Text>
              <View style={styles.favCategoryIconBox}>
                {renderActivityIcon(
                  CATEGORY_ICON_MAP[favCategoryName.toLowerCase() as keyof typeof CATEGORY_ICON_MAP]?.library || 'Ionicons',
                  CATEGORY_ICON_MAP[favCategoryName.toLowerCase() as keyof typeof CATEGORY_ICON_MAP]?.icon || 'help-circle',
                  THEME_PURPLE
                )}
              </View>
            </View>
            <Text style={styles.favCategoryTitle}>{favCategoryName}</Text>
            <Text style={styles.favCategorySub}>{favCategoryPercentage.toFixed(0)}% of total expenses</Text>
          </View>
        )}

        {/* Bank Balance Section */}
        <Text style={styles.sectionTitle}>Bank Balance</Text>
        {loadingBalance || loadingSummary ? ( // Using loadingBalance for this section's overall loading
          <ActivityIndicator size="small" color={THEME_PURPLE} style={{ marginVertical: 20 }} />
        ) : errorBalance || errorSummary ? (
          <View style={localProfileScreenStyles.summaryErrorContainer}>
            <Text style={localProfileScreenStyles.summaryErrorText}>{errorBalance || errorSummary}</Text>
            <TouchableOpacity onPress={() => { fetchBankBalance(); fetchSummaryData(activeSummaryPeriod); }} style={localProfileScreenStyles.retryButtonSmall}>
              <Text style={localProfileScreenStyles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={localProfileScreenStyles.bankBalanceContainer}>
            {/* Current Balance Part */}
            <TouchableOpacity
              style={[localProfileScreenStyles.bankBalanceCard, { marginBottom: 10 }]}
              onPress={() => {
                fetchAllIncomeTransactions(); // Ensure latest data for modal
                setIsDepositHistoryModalVisible(true);
              }}
            >
              <View style={localProfileScreenStyles.bankBalanceRow}>
                <MaterialCommunityIcons name="bank" size={24} color={THEME_PURPLE} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={localProfileScreenStyles.bankBalanceLabel}>Current Balance</Text>
                  <Text style={localProfileScreenStyles.bankBalanceValue}>₹{currentCalculatedBalance.toFixed(2)}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={localProfileScreenStyles.addBalanceButton}
                onPress={() => setIsAddBalanceModalVisible(true)}
              >
                <Ionicons name="add-circle-outline" size={18} color={LIGHT_BG} style={{ marginRight: 5 }} />
                <Text style={localProfileScreenStyles.addBalanceButtonText}>Add Balance</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Total Deposited Amount Part */}
            <TouchableOpacity
              style={localProfileScreenStyles.lastAddedAmountCard}
              onPress={() => {
                fetchAllIncomeTransactions(); // Ensure latest data for modal
                setIsDepositHistoryModalVisible(true);
              }}
            >
              <View style={localProfileScreenStyles.bankBalanceRow}>
                <Ionicons name="cash-outline" size={24} color={GREEN} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={localProfileScreenStyles.bankBalanceLabel}>Total Deposited Amount</Text>
                  <Text style={[localProfileScreenStyles.bankBalanceValue, { color: GREEN }]}>
                    ₹{totalDepositedAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={TEXT_GRAY} />
            </TouchableOpacity>
          </View>
        )}

        {/* Recent Activity */}
        <View style={styles.recentHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions' as never)}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {loadingActivities ? (
          <ActivityIndicator size="small" color={THEME_PURPLE} style={{ marginVertical: 20 }} />
        ) : errorActivities ? (
          <View style={localProfileScreenStyles.summaryErrorContainer}>
            <Text style={localProfileScreenStyles.summaryErrorText}>{errorActivities}</Text>
            <TouchableOpacity onPress={fetchRecentActivities} style={localProfileScreenStyles.retryButtonSmall}>
              <Text style={localProfileScreenStyles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.activityCard}>
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <View key={activity.id} style={[styles.activityRow, index < recentActivities.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 10, marginBottom: 10 }]}>
                  <View style={[styles.activityIconBoxGreen, { backgroundColor: activity.iconBg }]}>
                    {/* Pass iconColor from the activity object */}
                    {renderActivityIcon(activity.iconLibrary, activity.icon, activity.iconColor)}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activityTitle}>{activity.name}</Text>
                    <Text style={styles.activitySub}>{activity.date}</Text>
                  </View>
                  <Text style={[styles.activityAmountNeg, { color: activity.type === 'expense' ? RED : GREEN }]}>
                    {activity.type === 'expense' ? '-' : '+'}{`₹${activity.amount}`}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={localProfileScreenStyles.noActivitiesText}>No recent activities found.</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Add Balance Modal */}
      <Modal
        visible={isAddBalanceModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setIsAddBalanceModalVisible(false);
          setAmountToAdd(''); // Clear input on close
        }}
      >
        <View style={localProfileScreenStyles.modalOverlay}>
          <View style={localProfileScreenStyles.modalContainer}>
            <Text style={localProfileScreenStyles.modalTitle}>Add Balance</Text>
            <TextInput
              style={localProfileScreenStyles.modalInput}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amountToAdd}
              onChangeText={setAmountToAdd}
            />
            <View style={localProfileScreenStyles.modalButtonContainer}>
              <TouchableOpacity
                style={[localProfileScreenStyles.modalButton, { backgroundColor: '#ccc', marginRight: 10 }]}
                onPress={() => {
                  setIsAddBalanceModalVisible(false);
                  setAmountToAdd('');
                }}
                disabled={isAddingBalance}
              >
                <Text style={localProfileScreenStyles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[localProfileScreenStyles.modalButton, { backgroundColor: THEME_PURPLE }]}
                onPress={handleAddBalance}
                disabled={isAddingBalance}
              >
                {isAddingBalance ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={localProfileScreenStyles.modalButtonText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Deposit History Modal */}
      <Modal
        visible={isDepositHistoryModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsDepositHistoryModalVisible(false)}
      >
        <View style={localProfileScreenStyles.modalOverlay}>
          <View style={[localProfileScreenStyles.modalContainer, { height: '80%', padding: 15 }]}>
            <Text style={localProfileScreenStyles.modalTitle}>Deposit History</Text>
            {loadingBalance ? (
              <ActivityIndicator size="small" color={THEME_PURPLE} style={{ marginVertical: 20 }} />
            ) : errorBalance || allIncomeTransactions.length === 0 ? (
              <View style={localProfileScreenStyles.summaryErrorContainer}>
                <Text style={localProfileScreenStyles.summaryErrorText}>{errorBalance || "No deposit history available."}</Text>
                <TouchableOpacity onPress={fetchAllIncomeTransactions} style={localProfileScreenStyles.retryButtonSmall}>
                  <Text style={localProfileScreenStyles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView style={{ width: '100%' }}>
                <Text style={localProfileScreenStyles.depositHistoryTotal}>
                  <Text style={{ fontWeight: 'bold' }}>Total Deposited:</Text> ₹{totalDepositedAmount.toFixed(2)}
                </Text>
                {allIncomeTransactions.map((txn, index) => (
                  <View key={txn.id} style={localProfileScreenStyles.depositItem}>
                    <View style={localProfileScreenStyles.depositRow}>
                      <Text style={localProfileScreenStyles.depositText}>
                        <Text style={{ fontWeight: 'bold' }}>Date:</Text> {new Date(txn.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </Text>
                      <Text style={[localProfileScreenStyles.depositText, { color: GREEN }]}>
                        <Text style={{ fontWeight: 'bold' }}>Amount:</Text> ₹{txn.notes?.match(/\d+/)?.[0]}
                      </Text>
                    </View>
                    <Text style={localProfileScreenStyles.depositText}>
                      <Text style={{ fontWeight: 'bold' }}>Title:</Text> {txn.title}
                    </Text>
                    {txn.payment_mode && <Text style={localProfileScreenStyles.depositText}>
                      <Text style={{ fontWeight: 'bold' }}>Payment Mode:</Text> {txn.payment_mode}
                    </Text>}
                    {txn.notes && <Text style={localProfileScreenStyles.depositText}>
                      <Text style={{ fontWeight: 'bold' }}>Notes:</Text> {txn.notes}
                    </Text>}
                    <TouchableOpacity
                      onPress={() => handleDeleteIncomeTransaction(txn.id)}
                      style={localProfileScreenStyles.deleteDepositButton}
                    >
                      <MaterialIcons name="delete" size={20} color={RED} />
                      <Text style={localProfileScreenStyles.deleteDepositButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
            <TouchableOpacity
              style={[localProfileScreenStyles.closeButtonText, { backgroundColor: THEME_PURPLE, marginTop: 20 }]}
              onPress={() => setIsDepositHistoryModalVisible(false)}
            >
              <Text style={localProfileScreenStyles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Toast />
    </View>
  );
};

export default ProfileScreen;

// --- Local Stylesheet (consolidated and adjusted) ---
const localProfileScreenStyles = StyleSheet.create({
   closeButtonText: {
    height: 35,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: TEXT_GRAY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: THEME_PURPLE,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonSmall: {
    backgroundColor: THEME_PURPLE,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50, // Should be half of width/height for a perfect circle if width/height are equal
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 16, // Added for consistency with other sections
    marginTop: 16, // Added for spacing
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: LIGHT_BG,
    borderRadius: 8,
    overflow: 'hidden',
    height: 40,
    justifyContent: 'center',
    minWidth: 180,
    // marginRight: 15, // Adjusted, often handled by parent flex
  },
  picker: {
    height: 50, // This height might be specific for iOS
    width: '100%',
    color: THEME_PURPLE,
  },
  pickerItem: {
    fontSize: 14,
    color: THEME_PURPLE,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  summaryErrorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 16, // Added for consistency
  },
  summaryErrorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  bankBalanceContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  bankBalanceCard: {
    backgroundColor: LIGHT_BG,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastAddedAmountCard: {
    backgroundColor: LIGHT_BG,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  bankBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankBalanceLabel: {
    fontSize: 14,
    color: TEXT_GRAY,
    fontWeight: '500',
    marginBottom: 2,
  },
  bankBalanceValue: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME_PURPLE, // Default color for current balance
  },
  addBalanceButton: {
    backgroundColor: THEME_PURPLE,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addBalanceButtonText: {
    color: LIGHT_BG,
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: LIGHT_BG,
    borderRadius: 12,
    padding: 20,
    width: '85%', // Slightly wider than 80% for better content fit
    maxHeight: '90%', // Allow vertical scroll for history
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: DARK,
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: DARK,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  noActivitiesText: {
    textAlign: 'center',
    color: TEXT_GRAY,
    marginTop: 10,
    paddingVertical: 20,
  },
  depositHistoryTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DARK,
    marginBottom: 15,
    textAlign: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },
  depositItem: {
    backgroundColor: LIGHT_BG,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  depositRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  depositText: {
    fontSize: 15,
    color: DARK,
  },
  deleteDepositButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: '#ffe3e3', // Light red background for delete button
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteDepositButtonText: {
    color: RED,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
});