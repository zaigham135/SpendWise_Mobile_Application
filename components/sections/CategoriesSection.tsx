import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useNavigation and useFocusEffect
import axiosInstance from '../../src/api/axios/axiosInstance'; // Import axiosInstance

// Predefined list of default categories with their icon names and libraries
const DEFAULT_CATEGORIES_CONFIG = [
  { name: 'Travel', iconName: 'airplane-outline', iconLibrary: 'Ionicons', defaultColor: "#3b82f6" },
  { name: 'Food', iconName: 'restaurant-outline', iconLibrary: 'Ionicons', defaultColor: "#f97316" },
  { name: 'Petrol', iconName: 'gas-station-outline', iconLibrary: 'MaterialCommunityIcons', defaultColor: "#10b981" }, // Updated color
  { name: 'Clothes', iconName: 'shirt-outline', iconLibrary: 'Ionicons', defaultColor: "#8b5cf6" },
  { name: 'Rent', iconName: 'home-outline', iconLibrary: 'Ionicons', defaultColor: "#ef4444" }, // Updated color
  { name: 'Groceries', iconName: 'basket-outline', iconLibrary: 'Ionicons', defaultColor: "#06b6d4" }, 
];

// Helper function to render icon based on library and name
const renderCategoryIcon = (iconLibrary: string, iconName: string, iconColor: string) => {
  const size = 26;
  switch (iconLibrary) {
    case 'Ionicons':
      return <Ionicons name={iconName as any} size={size} color={iconColor} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={iconName as any} size={size} color={iconColor} />;
    case 'MaterialIcons':
      return <MaterialIcons name={iconName as any} size={size} color={iconColor} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={iconName as any} size={size} color={iconColor} />;
    case 'Entypo':
      return <Entypo name={iconName as any} size={size} color={iconColor} />;
    default:
      return <Ionicons name="help-circle" size={size} color={iconColor} />; // Fallback
  }
};

interface CategorySummary {
  section: string;
  total_expenses: number;
}

interface DisplayCategory {
  id: string;
  name: string;
  iconName: string;
  iconLibrary: 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons' | 'FontAwesome5' | 'Entypo';
  iconColor: string; // The color for the icon
  amount: string; // Formatted amount
}

export default function CategoriesSection() {
  const navigation = useNavigation();
  const [fetchedCategories, setFetchedCategories] = useState<DisplayCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorySummaries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/items/category-summary');
      const rawSummaries: CategorySummary[] = response.data;

      const processedCategories: DisplayCategory[] = DEFAULT_CATEGORIES_CONFIG.map(defaultCat => {
        const summary = rawSummaries.find(s => s.section.toLowerCase() === defaultCat.name.toLowerCase());
        
        return {
          id: defaultCat.name,
          name: defaultCat.name,
          iconName: defaultCat.iconName,
          iconLibrary: defaultCat.iconLibrary,
          iconColor: defaultCat.defaultColor, // Use the default color
          amount: `₹${(summary?.total_expenses ?? 0).toFixed(2)}`, // Always show, default to 0
        };
      });

      // Sort categories alphabetically by name
      processedCategories.sort((a, b) => a.name.localeCompare(b.name));

      setFetchedCategories(processedCategories);
    } catch (err: any) {
      console.error("Error fetching category summaries:", err.response?.data || err.message);
      setError("Failed to load category summaries.");
      // On error, revert to showing all default categories with zero amounts
      setFetchedCategories(
        DEFAULT_CATEGORIES_CONFIG.map(defaultCat => ({
          id: defaultCat.name,
          name: defaultCat.name,
          iconName: defaultCat.iconName,
          iconLibrary: defaultCat.iconLibrary,
          iconColor: defaultCat.defaultColor,
          amount: "₹0.00"
        }))
      );
    } finally {
      setLoading(false);
    }
  }, []); // useCallback dependency array is empty as fetchCategorySummaries doesn't depend on component state/props

  // Use useFocusEffect to call fetchCategorySummaries whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCategorySummaries();
      // No cleanup needed for this simple fetch, but if you had subscriptions/listeners,
      // you would return a cleanup function here.
    }, [fetchCategorySummaries]) // Dependency array for useFocusEffect
  );

  const handleCategoryPress = (categoryName: string) => {
    // Navigate to the TransactionScreen and pass the selected category as a parameter
    navigation.navigate('Transactions' as never, { category: categoryName });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#37474F" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchCategorySummaries} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '500',
        color: '#1f2937',
        marginBottom: 16
      }}>
        Categories
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {fetchedCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            activeOpacity={0.9}
            onPress={() => handleCategoryPress(category.name)}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              {renderCategoryIcon(category.iconLibrary, category.iconName, category.iconColor)}
              <Text style={styles.categoryAmount}>{category.amount}</Text>
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryCard: {
    width: '31%', // Adjusted for 3 items per row with spacing
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  categoryAmount: {
    fontWeight: 'bold',
    fontSize: 11,
    color: '#222',
    opacity: 0.95,
  },
  categoryName: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
    marginTop: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  noCategoriesText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 20,
    width: '100%', // Ensure it takes full width to center
  }
});
