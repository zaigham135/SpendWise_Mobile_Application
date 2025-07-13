import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  TextInput,
  Platform,
  StyleSheet, // Import StyleSheet for styles
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
// Assuming transactionStyles and filterModalStyles are correctly imported from your file
import {
  transactionStyles as styles,
  filterModalStyles,
} from "../../../style/transaction/transaction.styles";
import axiosInstance from "../../api/axios/axiosInstance";
import DateTimePicker from "@react-native-community/datetimepicker";
import { paginationStyles } from "../../../style/transaction/transaction.styles";

// Color constants (already in styles but useful to have here for direct use)
const THEME_PURPLE = "#37474F";
const TEXT_GRAY = "#6b7280";
const RED = "#ef4444";
const BORDER_GRAY = "#e5e7eb"; // Define the border color

// Define a consistent set of default colors for category icons if not provided by the backend
const DEFAULT_ICON_COLORS = [
  "#3B82F6",
  "#f97316",
  "#ef4444",
  "#a78bfa",
  "#22c55e",
  "#fbbf24",
  "#64748b",
  "#6366F1",
  "#14b8a6",
];
const DEFAULT_CATEGORIES = [
  "Travel",
  "Food",
  "Petrol",
  "Clothes",
  "Rent",
  "Groceries",
];

// Helper function to get icon and color based on category label (fallback)
// This function will now use renderDynamicIcon for consistency
const getCategoryIconAndColor = (categoryLabel: string) => {
  let iconName: string;
  let iconLibrary: string;
  let colorHex: string; // Background color for the icon box
  let iconColor: string; // Color for the icon itself

  switch (categoryLabel.toLowerCase()) {
    case "travel":
      iconName = "plane";
      iconLibrary = "FontAwesome5";
      iconColor = DEFAULT_ICON_COLORS[0];
      colorHex = "#e0e7ff"; // Light Blue
      break;
    case "food":
    case "food & drinks":
      iconName = "restaurant";
      iconLibrary = "Ionicons"; // Changed to Ionicons as it's defined there
      iconColor = DEFAULT_ICON_COLORS[1];
      colorHex = "#ffe0b2"; // Light Orange
      break;
    case "petrol":
      iconName = "gas-station";
      iconLibrary = "MaterialCommunityIcons";
      iconColor = DEFAULT_ICON_COLORS[2];
      colorHex = "#fee2e2"; // Light Red
      break;
    case "clothes":
    case "shopping":
      iconName = "tshirt-crew";
      iconLibrary = "MaterialCommunityIcons";
      iconColor = DEFAULT_ICON_COLORS[3];
      colorHex = "#fce7f3"; // Light Pink (matching your mock's Clothes/Shopping)
      break;
    case "rent":
    case "housing":
      iconName = "home";
      iconLibrary = "Entypo";
      iconColor = DEFAULT_ICON_COLORS[4];
      colorHex = "#d1fae5"; // Light Green
      break;
    case "groceries":
      iconName = "local-grocery-store";
      iconLibrary = "MaterialIcons";
      iconColor = DEFAULT_ICON_COLORS[5];
      colorHex = "#fef9c3"; // Light Yellow
      break;
    case "transportation":
      iconName = "car";
      iconLibrary = "MaterialCommunityIcons";
      iconColor = DEFAULT_ICON_COLORS[6];
      colorHex = "#fce7f3"; // Light Pink
      break;
    case "entertainment":
      iconName = "movie";
      iconLibrary = "MaterialIcons";
      iconColor = DEFAULT_ICON_COLORS[7];
      colorHex = "#fee2e2"; // Light Red
      break;
    case "utilities":
      iconName = "bolt";
      iconLibrary = "MaterialIcons";
      iconColor = DEFAULT_ICON_COLORS[8];
      colorHex = "#fef9c3"; // Light Yellow
      break;
    default:
      iconName = "ellipsis-horizontal";
      iconLibrary = "Ionicons";
      iconColor = THEME_PURPLE;
      colorHex = "#ede9fe"; // A light purple background
      break;
  }
  return { iconName, iconLibrary, iconColor, colorHex };
};

// Interface for backend transaction data
interface RawTransaction {
  id: number; // Changed from _id to id based on your backend log
  title: string;
  value: string; // Confirmed as string from backend log
  date: string; //YYYY-MM-DDTHH:mm:ss.sssZ
  section: string; // Category name
  target: number;
  payment_mode: string | null; // Can be null
  notes: string | null; // Can be null
  user_id: number;
  iconName?: string | null; // Add iconName
  iconColor?: string | null; // Add iconColor
  iconLibrary?: string | null; // Add iconLibrary
}

// Interface for transaction displayed in UI (after processing)
interface DisplayTransaction {
  _id: string; // Using string as it comes from database, easier for keys
  icon: JSX.Element | null;
  color: string; // Background color for the icon box
  title: string;
  amount: string; // Formatted with currency symbol
  time: string; // Formatted date/time for display
  category: string;
  paymentMode: string;
  notes?: string;
  rawDate: Date; // Keep the Date object for sorting/grouping
  iconName?: string | null; // Add iconName
  iconColor?: string | null; // Add iconColor
  iconLibrary?: string | null; // Add iconLibrary
}

interface GroupedTransactions {
  section: string;
  data: DisplayTransaction[];
}

export default function TransactionScreen() {
  const navigation = useNavigation();

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<DisplayTransaction | null>(
    null
  );
  const [allTransactions, setAllTransactions] = useState<RawTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // States for filtering
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // State for total expenses and count from summary API
  const [totalSummary, setTotalSummary] = useState({
    totalExpenses: 0,
    totalCount: 0,
  });

  // Pagination states (reintroduced)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10); // Fixed items per page
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false); // For future load more, currently not used with simple pagination

  // Renamed the helper function to renderDynamicIcon for consistency and to match usage
  // This function is defined once and used everywhere icons are rendered dynamically.
  const renderDynamicIcon = (
    iconLibrary: string,
    iconName: string,
    iconColor: string
  ) => {
    const size = 22; // Or whatever size is appropriate for your transaction items

    // You can move the iconMapping here if you want a single source of truth for mapped icons,
    // or keep it external if it's reused. For now, I'll keep your provided switch.
    switch (iconLibrary) {
      case "FontAwesome5":
        return <FontAwesome5 name={iconName as any} size={size} color={iconColor} />;
      case "MaterialIcons":
        return <MaterialIcons name={iconName as any} size={size} color={iconColor} />;
      case "MaterialCommunityIcons":
        return <MaterialCommunityIcons name={iconName as any} size={size} color={iconColor} />;
      case "Entypo":
        return <Entypo name={iconName as any} size={size} color={iconColor} />;
      case "Ionicons":
      default:
        return <Ionicons name={iconName as any} size={size} color={iconColor} />;
    }
  };

  // Function to fetch transactions from the backend with pagination
  const fetchTransactions = useCallback(
    async (
      page: number, // Added page parameter
      limit: number, // Added limit parameter
      category: string | null = null,
      fromDate: Date | null = null,
      toDate: Date | null = null
    ) => {
      setLoading(true);
      setError(null);
      setAllTransactions([]); // Clear transactions for a fresh load

      try {
        const params: any = {
          _page: page, // Send page to backend
          _limit: limit, // Send limit to backend
        };
        if (category && category !== "All") {
          params.category = category;
        }
        if (fromDate) {
          // Set to midnight in local time to avoid timezone shift
          const fromDateLocal = new Date(fromDate);
          fromDateLocal.setHours(0, 0, 0, 0);
          params.fromDate = fromDateLocal.toISOString().split("T")[0];
        }
        if (toDate) {
          // Set to end of day in local time to include the full day
          const toDateLocal = new Date(toDate);
          toDateLocal.setHours(23, 59, 59, 999);
          params.toDate = toDateLocal.toISOString().split("T")[0];
        }

        const response = await axiosInstance.get("/items", { params });
        const newTransactions: RawTransaction[] = response.data;
        console.log("Fetched transactions count:", newTransactions.length);
        setAllTransactions(newTransactions);
      } catch (err: any) {
        console.error(
          "Error fetching transactions:",
          err.response?.data || err.message
        );
        setError("Failed to load transactions. Please try again.");
        if (err.response?.status === 401) {
          Alert.alert(
            "Authentication Required",
            "Your session has expired. Please log in again."
          );
          navigation.navigate("Login" as never);
        }
      } finally {
        setLoading(false);
      }
    },
    [navigation]
  );

  // Function to fetch summary data
  const fetchSummary = useCallback(
    async (
      category: string | null = null,
      fromDate: Date | null = null,
      toDate: Date | null = null
    ) => {
      try {
        const params: any = {};
        if (category && category !== "All") {
          params.category = category;
        }
        if (fromDate) {
          // Set to midnight in local time
          const fromDateLocal = new Date(fromDate);
          fromDateLocal.setHours(0, 0, 0, 0);
          params.fromDate = fromDateLocal.toISOString().split("T")[0];
        }
        if (toDate) {
          // Set to end of day in local time
          const toDateLocal = new Date(toDate);
          toDateLocal.setHours(23, 59, 59, 999);
          params.toDate = toDateLocal.toISOString().split("T")[0];
        }
        const response = await axiosInstance.get("/items/summary", { params });
        setTotalSummary({
          totalExpenses: parseFloat(response.data.totalExpenses) || 0,
          totalCount: parseInt(response.data.totalCount) || 0,
        });
      } catch (err: any) {
        console.error(
          "Error fetching summary:",
          err.response?.data || err.message
        );
        setTotalSummary({ totalExpenses: 0, totalCount: 0 });
      }
    },
    []
  );

  useEffect(() => {
    const fetchUserCategoriesForFilter = async () => {
      try {
        const response = await axiosInstance.get("/items/custom-categories");
        const userCategories = response.data.map(
          (cat: { label: string }) => cat.label
        );
        const initialCategoriesList = [
          "All",
          "Travel",
          "Food",
          "Petrol",
          "Clothes",
          "Rent",
          "Groceries",
        ];
        const allCats = [
          ...new Set([...initialCategoriesList, ...userCategories]),
        ].sort();
        console.log("Fetched categories for filter:", allCats);
        setAvailableCategories(allCats);
      } catch (error: any) {
        console.error(
          "Error fetching user categories for filter:",
          error.response?.data || error.message
        );
        setAvailableCategories(
          ["All", ...DEFAULT_CATEGORIES, "Other"].filter(
            (v, i, a) => a.indexOf(v) === i
          ).sort()
        );
      }
    };
    fetchUserCategoriesForFilter();
  }, []);

  // Use useFocusEffect to refetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Reset search, filters, and page when screen is focused
      setSearchQuery("");
      setSelectedCategory(null);
      setFilterFromDate(null);
      setFilterToDate(null);
      setCurrentPage(1); // Reset to first page
      setAllTransactions([]);
      fetchTransactions(1, itemsPerPage, null, null, null); // Fetch first page
      fetchSummary(null, null, null); // Fetch overall summary
    }, [fetchTransactions, fetchSummary, itemsPerPage])
  );

  // Effect to fetch transactions when currentPage changes
  useEffect(() => {
    fetchTransactions(
      currentPage,
      itemsPerPage,
      selectedCategory,
      filterFromDate,
      filterToDate
    );
  }, [
    currentPage,
    itemsPerPage,
    selectedCategory,
    filterFromDate,
    filterToDate,
    fetchTransactions,
  ]);

  // Process raw transactions for display and grouping
  const processedAndGroupedTransactions = useMemo(() => {
    if (allTransactions.length === 0 && !loading && !error) return [];

    const grouped: { [key: string]: DisplayTransaction[] } = {
      Today: [],
      Yesterday: [],
      "Last Week": [],
      Older: [],
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const transformedTransactions: DisplayTransaction[] = allTransactions
      .map((rawTxn) => {
        console.log("Processing Txn:", rawTxn.id, {
      category: rawTxn.section,
      dbIconLibrary: rawTxn.iconLibrary,
      dbIconName: rawTxn.iconName,
      dbIconColor: rawTxn.iconColor,
    });
        const txnDate = new Date(rawTxn.date);
        let icon: JSX.Element | null;
        let color: string;

        // Check if the transaction is an income based on section
        if (rawTxn.section.toLowerCase() === "income") {
          icon = (
            <MaterialCommunityIcons name="bank" size={22} color="#16a34a" />
          ); // Green color for income
          color = "#d1fae5"; // Light green background for income
        } else {
          // Use renderDynamicIcon for both custom and default categories
          // Fallback to default icon if no custom icon data
          const categoryDefaults = getCategoryIconAndColor(rawTxn.section);
          icon =
            rawTxn.iconName && rawTxn.iconLibrary
              ? renderDynamicIcon(
                  rawTxn.iconLibrary,
                  rawTxn.iconName,
                  rawTxn.iconColor || categoryDefaults.iconColor // Use default iconColor if rawTxn.iconColor is null
                )
              : renderDynamicIcon(
                  categoryDefaults.iconLibrary,
                  categoryDefaults.iconName,
                  categoryDefaults.iconColor
                );
          color = rawTxn.iconColor || categoryDefaults.colorHex; // Use default colorHex if rawTxn.iconColor is null
        }

        let timeDisplay = "";
        if (rawTxn.date) {
          const fullDate = new Date(rawTxn.date);
          timeDisplay = fullDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        return {
          _id: String(rawTxn.id),
          icon: icon,
          color: color,
          title: rawTxn.title,
          amount: `₹${parseFloat(rawTxn.value || "0").toFixed(2)}`,
          time: timeDisplay,
          category: rawTxn.section,
          paymentMode: rawTxn.payment_mode || "N/A",
          notes: rawTxn.notes || "No notes available.",
          rawDate: new Date(rawTxn.date),
          iconName: rawTxn.iconName,
          iconColor: rawTxn.iconColor,
          iconLibrary: rawTxn.iconLibrary,
        };
      })
      .sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

    transformedTransactions.forEach((item) => {
      const itemDate = new Date(item.rawDate);
      itemDate.setHours(0, 0, 0, 0);

      if (itemDate.getTime() === today.getTime()) {
        grouped["Today"].push(item);
      } else if (itemDate.getTime() === yesterday.getTime()) {
        grouped["Yesterday"].push(item);
      } else {
        grouped["Older"].push(item);
      }
    });

    const finalGrouped: GroupedTransactions[] = [];
    if (grouped["Today"].length > 0)
      finalGrouped.push({
        section: "Today",
        data: grouped["Today"].map((item) => ({
          ...item,
          time: `Today, ${item.time}`,
        })),
      });
    if (grouped["Yesterday"].length > 0)
      finalGrouped.push({
        section: "Yesterday",
        data: grouped["Yesterday"].map((item) => ({
          ...item,
          time: `Yesterday, ${item.time}`,
        })),
      });
    const lastWeekGroup: DisplayTransaction[] = [];
    transformedTransactions.forEach((item) => {
      const itemDate = new Date(item.rawDate);
      itemDate.setHours(0, 0, 0, 0);
      if (
        itemDate.getTime() < yesterday.getTime() &&
        itemDate.getTime() >= lastWeek.getTime()
      ) {
        lastWeekGroup.push(item);
      }
    });
    if (lastWeekGroup.length > 0) {
      finalGrouped.push({
        section: "Last Week",
        data: lastWeekGroup.map((item) => ({
          ...item,
          time: new Date(item.rawDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        })),
      });
    }

    const olderGroup: DisplayTransaction[] = [];
    transformedTransactions.forEach((item) => {
      const itemDate = new Date(item.rawDate);
      itemDate.setHours(0, 0, 0, 0);
      if (itemDate.getTime() < lastWeek.getTime()) {
        olderGroup.push(item);
      }
    });
    if (olderGroup.length > 0) {
      finalGrouped.push({
        section: "Older",
        data: olderGroup.map((item) => ({
          ...item,
          time: new Date(item.rawDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        })),
      });
    }

    return finalGrouped
      .map((section) => {
        const filteredData = section.data.filter((item) => {
          const query = searchQuery.toLowerCase();
          return (
            item.title.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.time.toLowerCase().includes(query) ||
            (item.paymentMode &&
              item.paymentMode.toLowerCase().includes(query)) ||
            (item.notes && item.notes.toLowerCase().includes(query))
          );
        });
        return { ...section, data: filteredData };
      })
      .filter((section) => section.data.length > 0);
  }, [allTransactions, searchQuery, loading, error]); // Removed renderDynamicIcon from dependencies as it's defined inside the component and won't change.

  const handleEdit = () => {
    setModalVisible(false);
    navigation.navigate("EditTransaction" as never, {
      transaction: selectedTxn,
    });
  };

  const handleDelete = async () => {
    if (!selectedTxn) return;

    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${selectedTxn.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setModalVisible(false);
            try {
              await axiosInstance.delete(`/items/${selectedTxn._id}`);
              Alert.alert("Success", "Transaction deleted successfully!");
              setCurrentPage(1); // Reset to first page after deletion
              setAllTransactions([]); // Clear data before refetch
              fetchTransactions(
                1,
                itemsPerPage,
                selectedCategory,
                filterFromDate,
                filterToDate
              );
              fetchSummary(selectedCategory, filterFromDate, filterToDate);
            } catch (err: any) {
              console.error(
                "Error deleting transaction:",
                err.response?.data || err.message
              );
              Alert.alert(
                "Error",
                err.response?.data?.error || "Failed to delete transaction."
              );
              if (err.response?.status === 401) {
                navigation.navigate("Login" as never);
              }
            }
          },
        },
      ]
    );
  };

  const allCategories = useMemo(() => {
    return availableCategories;
  }, [availableCategories]);

  const applyFilters = () => {
    setIsFilterModalVisible(false);
    setCurrentPage(1); // Reset to first page when applying filters
    setAllTransactions([]); // Clear existing data to show loading state
    fetchTransactions(
      1,
      itemsPerPage,
      selectedCategory,
      filterFromDate,
      filterToDate
    );
    fetchSummary(selectedCategory, filterFromDate, filterToDate);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setFilterFromDate(null);
    setFilterToDate(null);
    setIsFilterModalVisible(false);
    setCurrentPage(1); // Reset to first page when clearing filters
    setAllTransactions([]); // Clear existing data
    fetchTransactions(1, itemsPerPage, null, null, null);
    fetchSummary(null, null, null);
  };

  const onFromDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || filterFromDate;
    setShowFromDatePicker(Platform.OS === "ios");
    setFilterFromDate(currentDate);
  };

  const onToDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || filterToDate;
    setShowToDatePicker(Platform.OS === "ios");
    setFilterToDate(currentDate);
  };

  function lightenColor(hex: string | null | undefined, lum = 0.2) {
    if (!hex || typeof hex !== "string") return "#eeeeee";
    hex = hex.replace(/[^0-9a-f]/gi, "");
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    let rgb = "#",
      c,
      i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (255 - c) * lum), 255)).toString(
        16
      );
      rgb += ("00" + c).slice(-2);
    }
    return rgb;
  }

  // Pagination UI logic
  const totalPages = Math.ceil((totalSummary?.totalCount ?? 0) / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage === 1) {
        pages.push(1, 2);
      } else if (currentPage === totalPages) {
        pages.push(totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage);
      }
    }
    return pages;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f6f8fa", paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <View style={styles.walletIconBg}>
            <Ionicons name="wallet" size={16} color="white" />
          </View>
        </View>
        <Text style={styles.headerTitle}>Transactions</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)}>
            <Ionicons
              name="search"
              size={20}
              color={THEME_PURPLE}
              style={{ marginRight: 16 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
            <Ionicons name="filter" size={20} color={THEME_PURPLE} />
          </TouchableOpacity>
        </View>
      </View>
      {searchVisible && (
        <View style={{ paddingHorizontal: 18, marginBottom: 10 }}>
          <TextInput
            placeholder="Search transactions..."
            placeholderTextColor={TEXT_GRAY}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: BORDER_GRAY,
              color: THEME_PURPLE,
            }}
          />
        </View>
      )}

      {loading && allTransactions.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={THEME_PURPLE} />
          <Text style={{ marginTop: 10, color: TEXT_GRAY }}>
            Loading transactions...
          </Text>
        </View>
      ) : error && allTransactions.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Ionicons name="alert-circle-outline" size={30} color={RED} />
          <Text style={{ textAlign: "center", color: RED, marginTop: 10 }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => {
              fetchTransactions(
                currentPage,
                itemsPerPage,
                selectedCategory,
                filterFromDate,
                filterToDate
              );
              fetchSummary(selectedCategory, filterFromDate, filterToDate);
            }}
            style={{
              marginTop: 20,
              padding: 10,
              backgroundColor: THEME_PURPLE,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff" }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
        >
          {/* Total Expenses Card */}
          <View style={styles.totalCard}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.totalLabel}>Total Expenses</Text>
              <View style={styles.thisMonthBadge}>
                <Text style={styles.thisMonthText}>This Month</Text>
              </View>
            </View>
            <Text style={styles.totalValue}>
              ₹{(totalSummary?.totalExpenses ?? 0).toFixed(2)}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 2,
              }}
            >
              <Text style={styles.percentDown}>
                Total Items: {(totalSummary?.totalCount ?? 0)}
              </Text>
              <Text style={styles.totalSub}> (filtered)</Text>
            </View>
          </View>

          {/* Transactions List */}
          {processedAndGroupedTransactions.map((section) => (
            <View key={section.section} style={{ marginTop: 18 }}>
              <Text style={styles.sectionHeader}>{section.section}</Text>
              
              {section.data.map((item, idx) => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.txnCard}
                  onPress={() => {
                    setSelectedTxn(item);
                    setModalVisible(true);
                  }}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.txnIconBox,
                      {
                        backgroundColor: DEFAULT_CATEGORIES.includes(
                          item.category
                        )
                          ? item.color
                          : lightenColor(item.iconColor, 0.85),
                      },
                    ]}
                  >
                    {item.icon}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.txnTitle}>{item.title}</Text>
                    <Text style={styles.txnTime}>{item.time}</Text>
                    <Text style={styles.txnCategory}>{item.category}</Text>
                  </View>
                  <View
                    style={{ alignItems: "flex-end", justifyContent: "center" }}
                  >
                    <Text style={styles.txnAmount}>{item.amount}</Text>
                    <Text
                      style={{ fontSize: 12, color: TEXT_GRAY, marginTop: 4 }}
                    >
                      {item.paymentMode}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          {processedAndGroupedTransactions.length === 0 &&
            !loading &&
            !error && (
              <Text
                style={{ textAlign: "center", color: TEXT_GRAY, marginTop: 20 }}
              >
                No transactions found with current filters.
              </Text>
            )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <View style={paginationStyles.paginationContainer}>
              <TouchableOpacity
                onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={paginationStyles.paginationButton}
              >
                <Text
                  style={[
                    paginationStyles.paginationText,
                    currentPage === 1 && paginationStyles.disabledText,
                  ]}
                >
                  {"<"}
                </Text>
              </TouchableOpacity>

              {getPageNumbers().map((pageNumber) => (
                <TouchableOpacity
                  key={pageNumber}
                  onPress={() => setCurrentPage(pageNumber)}
                  style={[
                    paginationStyles.paginationButton,
                    currentPage === pageNumber &&
                      paginationStyles.activePageButton,
                  ]}
                >
                  <Text
                    style={[
                      paginationStyles.paginationText,
                      currentPage === pageNumber &&
                        paginationStyles.activePageText,
                    ]}
                  >
                    {pageNumber}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                style={paginationStyles.paginationButton}
              >
                <Text
                  style={[
                    paginationStyles.paginationText,
                    currentPage === totalPages && paginationStyles.disabledText,
                  ]}
                >
                  {">"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {/* Transaction Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 24,
              width: "85%",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            {selectedTxn && (
              <>
                <View style={{ alignItems: "center", marginBottom: 16 }}>
                  <View
                    style={[
                      styles.txnIconBox,
                      {
                        backgroundColor: DEFAULT_CATEGORIES.includes(
                          selectedTxn.category
                        )
                          ? selectedTxn.color
                          : lightenColor(selectedTxn.iconColor, 0.85),
                        marginRight: 0,
                      },
                    ]}
                  >
                    {selectedTxn.icon}
                  </View>
                  <Text
                    style={[styles.txnTitle, { fontSize: 18, marginTop: 8 }]}
                  >
                    {selectedTxn.title}
                  </Text>
                  <Text style={styles.txnAmount}>{selectedTxn.amount}</Text>
                  <Text style={styles.txnTime}>{selectedTxn.time}</Text>
                  <Text style={styles.txnCategory}>{selectedTxn.category}</Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: TEXT_GRAY,
                      marginTop: 4,
                      fontWeight: "500",
                    }}
                  >
                    Payment Mode: {selectedTxn.paymentMode}
                  </Text>
                </View>
                <Text style={{ color: TEXT_GRAY, marginBottom: 16 }}>
                  Notes: {selectedTxn.notes || "No notes available."}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      // Change background color if the category is 'Income'
                      backgroundColor:
                        selectedTxn.category === "Income"
                          ? "#e0e0e0"
                          : THEME_PURPLE,
                      borderRadius: 8,
                      paddingVertical: 10,
                      paddingHorizontal: 18,
                      marginRight: 8,
                      flex: 1,
                      alignItems: "center",
                    }}
                    onPress={handleEdit}
                    // Disable the button if the category is 'Income'
                    disabled={selectedTxn.category === "Income"}
                  >
                    <Text
                      style={{
                        // Change text color if the category is 'Income'
                        color:
                          selectedTxn.category === "Income" ? "#888" : "#fff",
                        fontWeight: "700",
                      }}
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      // Change background color if the category is 'Income'
                      backgroundColor:
                        selectedTxn.category === "Income" ? "#e0e0e0" : "#fff",
                      // Change border color if the category is 'Income'
                      borderColor:
                        selectedTxn.category === "Income" ? "#b0b0b0" : RED,
                      borderWidth: 1,
                      borderRadius: 8,
                      paddingVertical: 10,
                      paddingHorizontal: 18,
                      flex: 1,
                      alignItems: "center",
                    }}
                    onPress={handleDelete}
                    // Disable the button if the category is 'Income'
                    disabled={selectedTxn.category === "Income"}
                  >
                    <Text
                      style={{
                        // Change text color if the category is 'Income'
                        color:
                          selectedTxn.category === "Income" ? "#888" : RED,
                        fontWeight: "700",
                      }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{ marginTop: 18, alignItems: "center" }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: THEME_PURPLE, fontWeight: "600" }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={filterModalStyles.overlay}>
          <View style={filterModalStyles.modalContainer}>
            <Text style={filterModalStyles.modalTitle}>
              Filter Transactions
            </Text>

            {/* Category Filter */}
            <Text style={filterModalStyles.filterLabel}>Category:</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 8,
                marginBottom: 16,
                backgroundColor: "#fff",
                overflow: "hidden",
              }}
            >
              <Picker
                selectedValue={
                  selectedCategory === null ? "All" : selectedCategory
                }
                onValueChange={(itemValue) =>
                  setSelectedCategory(itemValue === "All" ? null : itemValue)
                }
                style={{
                  height: 50,
                  width: "100%",
                  color: THEME_PURPLE,
                }}
                itemStyle={{
                  fontSize: 16,
                  color: THEME_PURPLE,
                }}
              >
                {availableCategories.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>

            {/* Date Range Filters */}
            <Text style={filterModalStyles.filterLabel}>From Date:</Text>
            <TouchableOpacity
              style={filterModalStyles.dateInput}
              onPress={() => setShowFromDatePicker(true)}
            >
              <Text
                style={{ color: filterFromDate ? THEME_PURPLE : TEXT_GRAY }}
              >
                {filterFromDate
                  ? filterFromDate.toLocaleDateString()
                  : "Select Date"}
              </Text>
            </TouchableOpacity>
            {showFromDatePicker && (
              <DateTimePicker
                testID="fromDatePicker"
                value={filterFromDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowFromDatePicker(false);
                  if (selectedDate) setFilterFromDate(selectedDate);
                }}
              />
            )}

            <Text style={filterModalStyles.filterLabel}>To Date:</Text>
            <TouchableOpacity
              style={filterModalStyles.dateInput}
              onPress={() => setShowToDatePicker(true)}
            >
              <Text style={{ color: filterToDate ? THEME_PURPLE : TEXT_GRAY }}>
                {filterToDate
                  ? filterToDate.toLocaleDateString()
                  : "Select Date"}
              </Text>
            </TouchableOpacity>
            {showToDatePicker && (
              <DateTimePicker
                testID="toDatePicker"
                value={filterToDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowToDatePicker(false);
                  if (selectedDate) setFilterToDate(selectedDate);
                }}
              />
            )}

            <View style={filterModalStyles.buttonContainer}>
              <TouchableOpacity
                style={[
                  filterModalStyles.filterButton,
                  { backgroundColor: RED, marginRight: 10 },
                ]}
                onPress={clearFilters}
              >
                <Text style={filterModalStyles.filterButtonText}>
                  Clear Filters
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={filterModalStyles.filterButton}
                onPress={applyFilters}
              >
                <Text style={filterModalStyles.filterButtonText}>
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={filterModalStyles.closeButton}
              onPress={() => setIsFilterModalVisible(false)}
            >
              <Text style={filterModalStyles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}