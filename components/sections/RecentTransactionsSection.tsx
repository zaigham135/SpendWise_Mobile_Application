import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axiosInstance from '../../src/api/axios/axiosInstance';

// --- NEW HELPER FUNCTION FOR LIGHTENING COLOR ---
// This is a common way to lighten a hex color. You might have this already.
// If not, you'll need to add it or an equivalent.
const lightenColor = (hex: string, percent: number) => {
  if (!hex || typeof hex !== 'string') {
    // Return a default light color if hex is invalid
    return '#f0f0f0'; // Light gray as a safe fallback
  }

  let f = parseInt(hex.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = (f >> 8) & 0x00ff, B = f & 0x0000ff;
  return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
};


// Define a mapping for DEFAULT category names and their default icon colors and background colors
// These are fallback values if the transaction doesn't have custom icon data.
// We'll define a base `iconColor` and then derive `iconBg` from it.
const CATEGORY_DEFAULT_CONFIG = {
  'travel': { icon: 'airplane', iconColor: '#4F46E5', library: 'Ionicons' }, // Indigo
  'food': { icon: 'restaurant', iconColor: '#F59E0B', library: 'Ionicons' }, // Amber
  'petrol': { icon: 'gas-station', iconColor: '#EF4444', library: 'MaterialCommunityIcons' }, // Red
  'clothes': { icon: 'shirt', iconColor: '#EC4899', library: 'Ionicons' }, // Pink
  'rent': { icon: 'home', iconColor: '#10B981', library: 'Ionicons' }, // Emerald Green
  'groceries': { icon: 'basket', iconColor: '#EAB308', library: 'Ionicons' }, // Yellow
  'other': { icon: 'ellipsis-horizontal', iconColor: '#8B5CF6', library: 'Ionicons' }, // Purple fallback
  'income': { icon: 'bank', iconColor: '#16A34A', library: 'MaterialCommunityIcons' }, // Darker Green for Income icon
  // Add other default mappings ensuring they use correct names/libraries
};

// Helper function to render icon based on library and name
const renderTransactionIcon = (iconLibrary: string, iconName: string, iconColor: string, isIncome: boolean) => {
  const size = 18;

  // No specific hardcoding for income icon here, as it will come from the category config.
  // The 'isIncome' flag might be used for other UI elements (like +/- amount), but not icon selection.

  let effectiveIconName = iconName;
  // Apply specific corrections if you have known invalid icon names in your existing database
  // For example, if 'cafe' from MaterialIcons is still in your DB for existing transactions:
  if (iconLibrary === "MaterialIcons" && iconName === "cafe") {
    effectiveIconName = "local-cafe"; // Fallback to a valid Material Icon
  }
  // Add other such corrections here if needed for historical data.

  switch (iconLibrary) {
    case 'Ionicons':
      return <Ionicons name={effectiveIconName as any} size={size} color="black" />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={effectiveIconName as any} size={size} color="black" />;
    case 'MaterialIcons':
      return <MaterialIcons name={effectiveIconName as any} size={size} color="black" />;
    case 'FontAwesome5':
      return <FontAwesome5 name={effectiveIconName as any} size={size} color="black" />;
    case 'Entypo':
      return <Entypo name={effectiveIconName as any} size={size} color="black" />;
    default:
      return <Ionicons name="help-circle" size={size} color={iconColor} />; // Fallback for unknown library
  }
};

// Interface for transaction data displayed in this component
interface DisplayTransaction {
  id: string;
  name: string;
  date: string;
  amount: string;
  iconName: string;
  iconLibrary: string;
  iconBg: string; // Background color for the icon circle (lightened)
  iconColor: string; // Color for the icon itself
  type: 'expense' | 'income';
}

export default function RecentTransactionsSection() {
  const navigation = useNavigation();
  const [recentTransactions, setRecentTransactions] = useState<DisplayTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const expenseResponse = await axiosInstance.get('/items', {
        params: { _limit: 5, _sort: 'date', _order: 'desc' }
      });
      const rawExpenses = expenseResponse.data;

      const incomeResponse = await axiosInstance.get('/profile/all-transactions', {
        params: { _limit: 5, _sort: 'date', _order: 'desc' }
      });
      const rawIncomes = incomeResponse.data.incomeTransactions || [];

      const allTransactions = [...rawExpenses, ...rawIncomes].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

      const processedTransactions: DisplayTransaction[] = allTransactions.map((rawTxn: any) => {
        const fullDate = new Date(rawTxn.date);
        const transactionType: 'expense' | 'income' = rawTxn.section === 'Income' ? 'income' : 'expense';

        let displayIconName: string;
        let displayIconLibrary: string;
        let displayIconColor: string; // Actual icon color
        let displayIconBg: string;    // Actual icon background color

        if (transactionType === 'income') {
          const incomeConfig = CATEGORY_DEFAULT_CONFIG['income'];
          displayIconName = incomeConfig.icon;
          displayIconLibrary = incomeConfig.library;
          displayIconColor = incomeConfig.iconColor;
          displayIconBg = lightenColor(incomeConfig.iconColor, 0.85); // Lighten for background
        } else if (rawTxn.iconLibrary && rawTxn.iconName) {
          // If transaction has custom icon data from the database, use it
          displayIconName = rawTxn.iconName;
          displayIconLibrary = rawTxn.iconLibrary;
          // Use stored iconColor if available, otherwise a sensible default
          displayIconColor = rawTxn.iconColor || CATEGORY_DEFAULT_CONFIG['other'].iconColor;
          // Lighten the iconColor for the background
          displayIconBg = lightenColor(displayIconColor, 0.85);
        } else {
          // Fallback for predefined categories or if DB data is missing
          const defaultConfig = CATEGORY_DEFAULT_CONFIG[rawTxn.section.toLowerCase()] || CATEGORY_DEFAULT_CONFIG['other'];
          displayIconName = defaultConfig.icon;
          displayIconLibrary = defaultConfig.library;
          displayIconColor = defaultConfig.iconColor;
          displayIconBg = lightenColor(displayIconColor, 0.85); // Lighten for background
        }

        return {
          id: String(rawTxn.id),
          name: rawTxn.title || rawTxn.name || 'Unknown',
          date: fullDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          amount: parseFloat(rawTxn.value || rawTxn.amount || "0").toFixed(2),
          iconName: displayIconName,
          iconLibrary: displayIconLibrary,
          iconColor: displayIconColor, // Pass the icon's color
          iconBg: displayIconBg,       // Pass the background color
          type: transactionType,
        };
      });
      setRecentTransactions(processedTransactions);
    } catch (err: any) {
      console.error("Error fetching recent transactions:", err.response?.data || err.message);
      setError("Failed to load recent transactions. Please check your backend.");
      setRecentTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRecentTransactions();
    }, [fetchRecentTransactions])
  );

  const handleSeeAllPress = () => {
    navigation.navigate('Transactions' as never);
  };

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '500',
        color: '#1f2937',
        marginBottom: 16
      }}>
        Recent Transactions
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#37474F" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchRecentTransactions} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={{ gap: 12 }}>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TouchableOpacity key={transaction.id} activeOpacity={0.7}>
                  <View style={styles.transactionCard}>
                    <View style={styles.transactionRow}>
                      <View style={styles.iconAndDetailsContainer}>
                        <View style={[styles.iconCircle, { backgroundColor: transaction.iconBg }]}>
                          {/* Pass iconColor from the transaction object */}
                          {renderTransactionIcon(transaction.iconLibrary, transaction.iconName, transaction.iconColor, transaction.type === 'income')}
                        </View>

                        <View style={styles.textDetailsContainer}>
                          <Text style={styles.transactionName}>
                            {transaction.name}
                          </Text>
                          <Text style={styles.transactionDate}>
                            {transaction.date}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.amountContainer}>
                        <Text style={[
                          styles.transactionAmount,
                          { color: transaction.type === 'expense' ? '#dc2626' : '#16a34a' }
                        ]}>
                          {transaction.type === 'expense' ? '-' : '+'}{`₹${transaction.amount}`}
                        </Text>
                        <View style={{ marginTop: 4 }}>
                          <Ionicons
                            name={transaction.type === 'expense' ? 'trending-down' : 'trending-up'}
                            size={12}
                            color={transaction.type === 'expense' ? '#dc2626' : '#16a34a'}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noTransactionsText}>No recent transactions found.</Text>
            )}
          </View>

          <TouchableOpacity style={styles.seeAllButton} onPress={handleSeeAllPress}>
            <Text style={styles.seeAllButtonText}>See All Transactions</Text>
            <Ionicons name="arrow-forward" size={16} color="#37474F" style={{ marginLeft: 5 }} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  transactionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconAndDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  textDetailsContainer: {
    marginLeft: 12,
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  transactionDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '500',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  seeAllButtonText: {
    color: '#37474F',
    fontWeight: 'bold',
    fontSize: 15,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 10,
    color: '#6b7280',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#37474F',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noTransactionsText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 10,
    paddingVertical: 20,
  },
});