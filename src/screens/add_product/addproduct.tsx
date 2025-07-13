// filepath: e:\Harish_sir_web_development\REACT JS\Expense_App_Fixed\src\screens\addproduct\AddProduct.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
// Import all necessary icon libraries
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import { addproductStyles as styles } from "../../../style/addproduct/addproduct.styles";

import axiosInstance from "../../api/axios/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Correct import for React Navigation
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker"; // <--- NEW: Import Picker
import DropDownPicker from "react-native-dropdown-picker";
// --- THEME CONSTANTS ---
const THEME_PURPLE = "#37474F";
const TEXT_GRAY = "#6b7280";
const LIGHT_GRAY_BACKGROUND = "#f6f8fa";
const BORDER = "#e5e7eb";
// --- END THEME CONSTANTS ---

// MODIFIED: Updated Category interface to use iconName, iconColor, and iconLibrary (strings)
interface Category {
  id?: string; // Add id for backend categories
  label: string;
  iconName: string; // e.g., "plane", "restaurant"
  iconColor: string; // e.g., "#3B82F6", "#f59e42"
  iconLibrary?: string; // <--- ADDED THIS LINE
  target?: number; // Optional target for the category/section
}

const DEFAULT_COLORS = [
  "#3B82F6",
  "#f59e42",
  "#ef4444",
  "#a78bfa",
  "#22c55e",
  "#fbbf24",
  "#64748b",
  "#6366F1",
  "#14b8a6",
];

// UPDATED: Suggested icons should now correspond to their true library names if possible,
// or be consistently mapped in renderIcon.
// For example, 'plane' is 'airplane' in Ionicons.
// 'gas-station' and 'tshirt-crew' are MaterialCommunityIcons.
const suggestedIcons = [
  // Ionicons
  "wallet",
  "bulb",
  "bus",
  "gift",
  "briefcase",
  "heart",
  "cart",
  "cash",
  "pricetag",
  "phone-portrait",
  "medkit",
  "book",
  // MaterialCommunityIcons
  "coffee", // Replaces 'cafe'
  "dumbbell",
  "movie",
  "music",
  "paw",
  "silverware-fork-knife",
];
const suggestedColors = [
  "#4F46E5", // Indigo – professional, calm
  "#F59E0B", // Amber – soft highlight
  "#10B981", // Emerald – rich green, modern
  "#8B5CF6", // Violet – elegant & classy
  "#EC4899", // Rose – chic, feminine
  "#0EA5E9", // Sky Blue – clean & vibrant
  "#A3A3A3", // Cool Gray – minimal & neutral
  "#F43F5E", // Rose Red – bold elegance
  "#6366F1", // Indigo 500 – trust & clarity
  "#E879F9", // Orchid – playful elegance
  "#7C3AED", // Deep Purple – premium look
  "#14B8A6", // Teal – soft yet vivid
  "#FCD34D", // Soft Yellow – warm highlight
  "#F87171", // Coral Red – lively but not harsh
];

const iconLibraries = [
  { label: "Ionicons", value: "Ionicons" },
  // { label: "Material Icons", value: "MaterialIcons" },
  { label: "Material Community Icons", value: "MaterialCommunityIcons" },
  // { label: "FontAwesome 5", value: "FontAwesome5" },
  // { label: "Entypo", value: "Entypo" },
  // Add more as needed if you support other icon sets
];

const AddProduct: React.FC = () => {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(iconLibraries);
  const [newCategoryIcon, setNewCategoryIcon] = useState("wallet");
  const [newCategoryColor, setNewCategoryColor] = useState("#3B82F6");
  const [newCategoryIconLibrary, setNewCategoryIconLibrary] =
    useState("Ionicons"); // <--- NEW STATE
  const [showCustomCategoryModal, setShowCustomCategoryModal] =
    useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [productTitle, setProductTitle] = useState<string>("");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
  const [selectedPaymentIndex, setSelectedPaymentIndex] = useState<number>(0);

  const [date, setDate] = useState<Date>(new Date());

  const [notes, setNotes] = useState<string>("");
  const [showAddCategoryModal, setShowAddCategoryModal] =
    useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newCategoryTarget, setNewCategoryTarget] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingTotal, setFetchingTotal] = useState<boolean>(false);
  const [totalSpentForCategory, setTotalSpentForCategory] = useState<
    number | null
  >(null);

  const [showTargetInput, setShowTargetInput] = useState<boolean>(false);
  const [currentCategoryTarget, setCurrentCategoryTarget] =
    useState<string>("");

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // NEW STATES for custom category deletion
  const [longPressedCategory, setLongPressedCategory] =
    useState<Category | null>(null);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);

  // MODIFIED: Initial categories now use iconName and iconColor strings, and specify library for better consistency
  // Note: These initial categories ideally should also come from the backend,
  // or have a consistent mapping strategy if hardcoded.
  const [categories, setCategories] = useState<Category[]>([
    {
      label: "Travel",
      iconName: "plane",
      iconColor: "#3B82F6",
      iconLibrary: "Ionicons",
    }, // 'plane' -> 'airplane' in renderIcon
    {
      label: "Food",
      iconName: "restaurant",
      iconColor: "#f97316",
      iconLibrary: "Ionicons",
    },
    {
      label: "Petrol",
      iconName: "gas-station",
      iconColor: "#ef4444",
      iconLibrary: "MaterialCommunityIcons",
    },
    {
      label: "Clothes",
      iconName: "tshirt-crew",
      iconColor: "#a78bfa",
      iconLibrary: "MaterialCommunityIcons",
    },
    {
      label: "Rent",
      iconName: "home",
      iconColor: "#22c55e",
      iconLibrary: "Ionicons",
    },
    {
      label: "Groceries",
      iconName: "local-grocery-store",
      iconColor: "#fbbf24",
      iconLibrary: "MaterialIcons",
    },
    {
      label: "Other",
      iconName: "ellipsis-horizontal",
      iconColor: "#64748b",
      iconLibrary: "Ionicons",
    },
  ]);

  const paymentModes = [
    {
      label: "UPI",
      icon: (
        <MaterialCommunityIcons name="cellphone" size={20} color="#6366F1" />
      ),
    },
    {
      label: "Credit Card",
      icon: <MaterialIcons name="credit-card" size={20} color="#3b82f6" />,
    },
    {
      label: "Cash",
      icon: <FontAwesome5 name="money-bill-wave" size={20} color="#22c55e" />,
    },
    {
      label: "Netbanking",
      icon: <MaterialCommunityIcons name="bank" size={20} color="#64748b" />,
    },
  ];

  const getRandomColor = () =>
    DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
  // Define this outside your component or in a constants file

  // NEW: Helper function to render icons based on iconName, iconColor, and now iconLibrary
  const renderIcon = (name: string, color: string, library?: string) => {
    // Added optional library
    const size = 22;

    // A more robust mapping for suggestedIcons and initial categories
    // This object maps a simplified 'name' to its actual library and library-specific name
    const iconMapping: Record<string, { library: string; name: string }> = {
  plane: { library: "Ionicons", name: "airplane" },
  restaurant: { library: "Ionicons", name: "restaurant" },
  "gas-station": { library: "MaterialCommunityIcons", name: "gas-station" },
  "tshirt-crew": { library: "MaterialCommunityIcons", name: "tshirt-crew" },
  home: { library: "Ionicons", name: "home" },
  "local-grocery-store": { library: "MaterialIcons", name: "local-grocery-store" },
  "ellipsis-horizontal": { library: "Ionicons", name: "ellipsis-horizontal" },
  wallet: { library: "Ionicons", name: "wallet" },
  bulb: { library: "Ionicons", name: "bulb" },
  bus: { library: "Ionicons", name: "bus" },
  gift: { library: "Ionicons", name: "gift" },
  briefcase: { library: "Ionicons", name: "briefcase" },
  heart: { library: "Ionicons", name: "heart" },
  cart: { library: "Ionicons", name: "cart" },
  cash: { library: "Ionicons", name: "cash" },
  pricetag: { library: "Ionicons", name: "pricetag" },
  "phone-portrait": { library: "Ionicons", name: "phone-portrait" },
  medkit: { library: "Ionicons", name: "medkit" },
  book: { library: "Ionicons", name: "book" },
  coffee: { library: "MaterialCommunityIcons", name: "coffee" },
  dumbbell: { library: "MaterialCommunityIcons", name: "dumbbell" },
  movie: { library: "MaterialCommunityIcons", name: "movie" },
  music: { library: "MaterialCommunityIcons", name: "music" },
  paw: { library: "MaterialCommunityIcons", name: "paw" },
  "silverware-fork-knife": { library: "MaterialCommunityIcons", name: "silverware-fork-knife" },
};

    // Determine the effective library and name.
    // Prioritize the 'library' parameter if provided, otherwise use the mapping, default to Ionicons.
    const mappedDetails = iconMapping[name];
    const effectiveLibrary = library || mappedDetails?.library || "Ionicons";
    const effectiveName = mappedDetails?.name || name; // Use mapped name if available, otherwise original name

    switch (effectiveLibrary) {
      case "FontAwesome5":
        return (
          <FontAwesome5 name={effectiveName as any} size={size} color={color} />
        );
      case "MaterialIcons":
        return (
          <MaterialIcons
            name={effectiveName as any}
            size={size}
            color={color}
          />
        );
      case "MaterialCommunityIcons":
        return (
          <MaterialCommunityIcons
            name={effectiveName as any}
            size={size}
            color={color}
          />
        );
      case "Entypo":
        return <Entypo name={effectiveName as any} size={size} color={color} />;
      case "Ionicons":
      default: // Default to Ionicons if library is unknown or not provided
        return (
          <Ionicons name={effectiveName as any} size={size} color={color} />
        );
    }
  };

  const fetchCategoryTotal = useCallback(
    async (categoryLabel: string) => {
      console.log(
        `[fetchCategoryTotal] Attempting to fetch total for category: ${categoryLabel}`
      );
      if (!categoryLabel) {
        setTotalSpentForCategory(0);
        console.log(
          "[fetchCategoryTotal] No category label provided, setting total to 0."
        );
        return;
      }
      setFetchingTotal(true);
      try {
        const response = await axiosInstance.get(
          `/items/total-by-category?category=${categoryLabel}`
        );
        setTotalSpentForCategory(response.data.totalSpent);
        console.log(
          `[fetchCategoryTotal] Successfully fetched total for ${categoryLabel}: ${response.data.totalSpent}`
        );
      } catch (error: any) {
        console.error(
          `[fetchCategoryTotal] Error fetching total for ${categoryLabel}:`,
          error.response?.data || error.message
        );
        setTotalSpentForCategory(0); // Default to 0 on error
        if (error.response?.status === 401) {
          Alert.alert(
            "Authentication Required",
            "Your session has expired. Please log in again."
          );
          navigation.navigate("Login");
        }
      } finally {
        setFetchingTotal(false);
        console.log("[fetchCategoryTotal] Fetching complete.");
      }
    },
    [navigation]
  );

  const fetchCategoryTarget = useCallback(async (categoryLabel: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axiosInstance.get(
        `/items/category-target?category=${categoryLabel}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const target = response.data.target;

      if (target !== undefined && target !== null) {
        setCurrentCategoryTarget(target.toString());
        setShowTargetInput(false); // ✅ Target exists, so hide input
      } else {
        setCurrentCategoryTarget("");
        setShowTargetInput(true); // ✅ No target, so show input
      }
    } catch (err) {
      console.error("Error fetching category target:", err);
      setCurrentCategoryTarget("");
      setShowTargetInput(true); // ✅ Error fetching, so show input
    }
  }, []);

  // Fetch custom categories when component mounts or relevant state changes
  useEffect(() => {
    const fetchAndSetCategories = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axiosInstance.get("/items/custom-categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Combine default and fetched custom categories, ensure no duplicates by label
        const fetchedCustom: Category[] = response.data || [];
        const combinedCategories = [...categories]; // Start with initial categories (predefined)

        fetchedCustom.forEach((customCat: Category) => {
          // Check if a category with the same label already exists in combinedCategories
          const exists = combinedCategories.some(
            (cat) => cat.label === customCat.label
          );
          if (!exists) {
            combinedCategories.push(customCat);
          } else {
            // Optionally update existing default categories with data from backend if they match by label
            const index = combinedCategories.findIndex(
              (cat) => cat.label === customCat.label
            );
            if (index !== -1) {
              // Ensure iconLibrary is also updated if backend provides it
              combinedCategories[index] = {
                ...combinedCategories[index],
                ...customCat,
              };
            }
          }
        });
        setCategories(combinedCategories);

        // After fetching, select the first category if none is selected or default is missing
        if (
          combinedCategories.length > 0 &&
          (selectedCategoryIndex === null ||
            selectedCategoryIndex === undefined)
        ) {
          setSelectedCategoryIndex(0);
        }
      } catch (err) {
        console.error("Error fetching custom categories on mount:", err);
      }
    };

    fetchAndSetCategories();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const selectedCategory = categories[selectedCategoryIndex];
    if (selectedCategory) {
      console.log(
        `[useEffect] Selected Category Changed: ${selectedCategory.label}`
      );

      // Fetch latest target from the server instead of relying on category object
      fetchCategoryTarget(selectedCategory.label);

      fetchCategoryTotal(selectedCategory.label);
    }
  }, [
    selectedCategoryIndex,
    categories,
    fetchCategoryTarget,
    fetchCategoryTotal,
  ]);

  const handleAddCategory = async () => {
    if (
      !newCategoryName.trim() ||
      !newCategoryIcon ||
      !newCategoryColor ||
      !newCategoryIconLibrary
    ) {
      // <--- VALIDATE NEW STATE
      Alert.alert(
        "Input Required",
        "Category name, icon, color, and library are required."
      ); // <--- UPDATE MESSAGE
      return;
    }

    const newCategory: Category = {
      label: newCategoryName.trim(),
      iconName: newCategoryIcon,
      iconColor: newCategoryColor,
      iconLibrary: newCategoryIconLibrary, // <--- ADDED NEW STATE
      target: parseFloat(newCategoryTarget) || undefined,
    };

    try {
      const token = await AsyncStorage.getItem("token");

      // POST to backend to add category, backend should return the new category's ID
      const response = await axiosInstance.post(
        "/items/add-category",
        newCategory,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const addedCategoryWithId: Category = {
        ...newCategory,
        id: response.data.id,
      }; // Assuming backend returns ID

      setCategories([...categories, addedCategoryWithId]); // Add with ID
      setNewCategoryName("");
      setNewCategoryTarget("");
      setNewCategoryIcon("wallet");
      setNewCategoryColor("#3B82F6");
      setNewCategoryIconLibrary("Ionicons"); // <--- RESET NEW STATE
      setShowAddCategoryModal(false);
      setSelectedCategoryIndex(categories.length); // Select the newly added category
      console.log(
        `[handleAddCategory] New category added: ${addedCategoryWithId.label} with target: ${addedCategoryWithId.target}`
      );
    } catch (error: any) {
      console.error(
        "Error adding custom category:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Failed to add custom category. Please try again.");
    }
  };

  const handleUpdateCategoryTarget = async () => {
    const numericTarget = parseFloat(currentCategoryTarget);
    if (isNaN(numericTarget) || numericTarget < 0) {
      Alert.alert(
        "Invalid Target",
        "Please enter a valid non-negative number for the target."
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const selectedCategory = categories[selectedCategoryIndex];

      await axiosInstance.put(
        "/items/update-category-target",
        {
          category: selectedCategory.label,
          target: numericTarget,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the local categories state
      const updatedCategories = categories.map((cat, idx) => {
        if (idx === selectedCategoryIndex) {
          return { ...cat, target: numericTarget };
        }
        return cat;
      });

      setCategories(updatedCategories);
      Alert.alert("Success", "Category target updated successfully!");
      setShowTargetInput(false); // Hide input after saving
    } catch (error: any) {
      console.error(
        "[handleUpdateCategoryTarget] Error updating target:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update target."
      );
    }
  };

  const handleAddExpense = async () => {
    if (
      !productTitle ||
      !amount ||
      !date ||
      isNaN(date.getTime()) ||
      selectedCategoryIndex === null
    ) {
      Alert.alert(
        "Missing Fields",
        "Please fill in all required fields: Product Title, Amount, Category, and Date."
      );
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert(
        "Invalid Amount",
        "Please enter a valid positive number for the amount."
      );
      return;
    }

    setLoading(true);

    try {
      const user = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (!user || !token) {
        Alert.alert(
          "Authentication Error",
          "User not logged in. Please log in again."
        );
        navigation.navigate("Login");
        return;
      }

      const userData = JSON.parse(user);
      const selectedCategory = categories[selectedCategoryIndex];

      // Format date in local timezone (IST) without UTC conversion
      const localDateStr = date
        .toLocaleString("en-CA", { timeZone: "Asia/Kolkata" })
        .split(",")[0]; // e.g., "2025-07-12"
      const formattedDate = `${localDateStr} 00:00:00`; // Add time to match datetime column

      const data = {
        title: productTitle,
        value: numericAmount,
        date: formattedDate,
        section: selectedCategory.label,
        target: parseFloat(currentCategoryTarget) || 0, // Ensure target sent is numeric
        payment_mode: paymentModes[selectedPaymentIndex].label,
        notes: notes,
      };

      console.log("[handleAddExpense] Sending data:", data); // Debug log

      const response = await axiosInstance.post("/items", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        Alert.alert("Success", "Expense added successfully!");
        setAmount("");
        setProductTitle("");
        setNotes("");
        // Re-fetch total for the selected category after adding a new expense
        fetchCategoryTotal(selectedCategory.label);
      } else {
        Alert.alert("Error", response.data.error || "Failed to add expense.");
      }
    } catch (error: any) {
      console.error(
        "[handleAddExpense] Error adding expense:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        Alert.alert(
          "Authentication Required",
          "Your session has expired. Please log in again."
        );
        navigation.navigate("Login");
      } else {
        Alert.alert(
          "Error",
          error.response?.data?.error ||
            "Failed to add expense. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const remainingAmount = useMemo(() => {
    const currentTarget = parseFloat(currentCategoryTarget);
    const previouslySpent =
      totalSpentForCategory !== null ? totalSpentForCategory : 0;
    const currentInputAmount = parseFloat(amount) || 0;

    console.log(
      `[useMemo] Calculating remaining: Target=${currentTarget}, PreviouslySpent=${previouslySpent}, CurrentInput=${currentInputAmount}`
    );

    if (isNaN(currentTarget) || currentTarget <= 0) {
      console.log("[useMemo] No valid target, returning null.");
      return null;
    }

    const calculatedRemaining =
      currentTarget - previouslySpent - currentInputAmount;
    console.log(`[useMemo] Calculated Remaining: ${calculatedRemaining}`);
    return calculatedRemaining;
  }, [currentCategoryTarget, totalSpentForCategory, amount]);

  const displayRemainingAmount = typeof remainingAmount === "number";
  const isOverBudget = displayRemainingAmount && remainingAmount < 0;
  const [customCategories, setCustomCategories] = useState<Category[]>([]); // Renamed for clarity in modal

  // Modified fetchCustomCategories to only fetch and update state
  const fetchCustomCategories = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axiosInstance.get("/items/custom-categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomCategories(response.data);
    } catch (err) {
      console.error("Error fetching custom categories:", err);
      Alert.alert("Error", "Failed to load custom categories.");
    }
  }, []);

  // Handler for deleting a custom category
  const handleDeleteCategory = async () => {
    if (!longPressedCategory || !longPressedCategory.id) {
      Alert.alert("Error", "No category selected for deletion.");
      setShowDeleteConfirmationModal(false);
      setLongPressedCategory(null);
      return;
    }

    setLoading(true); // Indicate deletion in progress
    try {
      const token = await AsyncStorage.getItem("token");
      const categoryIdToDelete = longPressedCategory.id;

      const response = await axiosInstance.delete(
        `/items/custom-categories/${categoryIdToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Filter out the deleted category from the main categories state
      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat.id !== longPressedCategory.id)
      );

      // Also update the customCategories state if the modal is open
      setCustomCategories((prevCustomCategories) =>
        prevCustomCategories.filter((cat) => cat.id !== longPressedCategory.id)
      );

      Alert.alert(
        "Success",
        response.data.message || "Custom category and its transactions deleted!"
      );

      // If the deleted category was the currently selected one, select "Other" or first available
      if (categories[selectedCategoryIndex]?.id === longPressedCategory.id) {
        const otherIndex = categories.findIndex((cat) => cat.label === "Other");
        setSelectedCategoryIndex(otherIndex !== -1 ? otherIndex : 0); // Fallback to 0 if 'Other' not found
      }
    } catch (error: any) {
      console.error(
        "Error deleting custom category:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to delete custom category."
      );
    } finally {
      setLoading(false);
      setShowDeleteConfirmationModal(false);
      setLongPressedCategory(null);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    if (event.type === "set") {
      setDate(currentDate);
      console.log(
        `[onChangeDate] Date selected: ${
          currentDate.toISOString().split("T")[0]
        }`
      );
    } else {
      console.log("[onChangeDate] Date picker dismissed/cancelled.");
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
    console.log("[showDatepicker] Date picker visibility set to true.");
  };
  const handleChangeValue = (val) => {
    setValue(val);
    setNewCategoryIconLibrary(val);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1, backgroundColor: LIGHT_GRAY_BACKGROUND }}>
        <View style={styles.headerWrapper}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 18,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ width: 24 }}
            >
              <Ionicons name="arrow-back" size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Expense</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 80 }}>
          <Text style={{ fontSize: 22, fontWeight: "700", color: "#22223b" }}>
            Add Expense
          </Text>
          <Text style={{ color: TEXT_GRAY, marginBottom: 18, marginTop: 2 }}>
            Enter your expense details below
          </Text>

          <Text style={styles.label}>Amount</Text>
          <View style={styles.inputBox}>
            <Text style={{ color: TEXT_GRAY, fontSize: 18, marginRight: 6 }}>
              ₹
            </Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={TEXT_GRAY}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* Real-time Remaining Amount Display with backend total */}
          {fetchingTotal ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 15,
                marginTop: 5,
                paddingLeft: 5,
              }}
            >
              <ActivityIndicator size="small" color={THEME_PURPLE} />
              <Text style={{ marginLeft: 8, color: TEXT_GRAY, fontSize: 14 }}>
                Calculating remaining...
              </Text>
            </View>
          ) : (
            displayRemainingAmount &&
            totalSpentForCategory !== null && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 15,
                  marginTop: 0,
                  paddingLeft: 14,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: isOverBudget ? "#dc2626" : "#16a34a",
                    marginRight: 8,
                  }}
                >
                  {/* {isOverBudget ? 'Over by' : 'Remaining'}:*/} ₹
                  {Math.abs(remainingAmount).toLocaleString()}
                </Text>
                <Ionicons
                  name={isOverBudget ? "trending-down" : "trending-up"}
                  size={20}
                  color={isOverBudget ? "#dc2626" : "#16a34a"}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: TEXT_GRAY,
                    marginLeft: 5,
                  }}
                >
                  {/*(Target: ₹{parseFloat(currentCategoryTarget).toLocaleString()})*/}
                </Text>
              </View>
            )
          )}

          <Text style={styles.label}>Product Title</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="e.g., Dinner with friends, New shoes"
              placeholderTextColor={TEXT_GRAY}
              value={productTitle}
              onChangeText={setProductTitle}
              autoCapitalize="words"
            />
          </View>

          <Text style={styles.label}>Category</Text>
          <View style={styles.grid}>
            {categories.map((cat, idx) => (
              <TouchableOpacity
                key={cat.id || cat.label} // Use ID if available, otherwise label for key
                style={[
                  styles.gridItem,
                  selectedCategoryIndex === idx && {
                    borderColor: THEME_PURPLE,
                    backgroundColor: "#ede9fe",
                  },
                ]}
                onPress={() => {
                  if (cat.label === "Other") {
                    fetchCustomCategories(); // Fetch custom categories to show in modal
                    setShowCustomCategoryModal(true); // Show custom category modal
                  } else {
                    setSelectedCategoryIndex(idx);
                    fetchCategoryTarget(cat.label);
                  }
                }}
                activeOpacity={0.8}
              >
                {/* Pass iconLibrary if available, otherwise it defaults in renderIcon */}
                {renderIcon(
                  cat.iconName || "wallet",
                  cat.iconColor || "#64748b",
                  cat.iconLibrary
                )}

                <Text style={styles.gridLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.gridItem,
                {
                  borderStyle: "dashed",
                  borderColor: "#a1a1aa",
                  backgroundColor: "#f3f4f6",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
              onPress={() => setShowAddCategoryModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={28} color={THEME_PURPLE} />
              <Text style={[styles.gridLabel, { color: THEME_PURPLE }]}>
                Add
              </Text>
            </TouchableOpacity>
          </View>

          {/* Category Target Display/Input */}
          <Text style={styles.label}>
            Category Target (for{" "}
            {categories[selectedCategoryIndex]?.label || "Category"})
          </Text>
          {showTargetInput ? (
            <View style={[styles.inputBox, { marginBottom: 10 }]}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Set target for this category"
                placeholderTextColor={TEXT_GRAY}
                keyboardType="numeric"
                value={currentCategoryTarget}
                onChangeText={setCurrentCategoryTarget}
              />
              <TouchableOpacity
                onPress={handleUpdateCategoryTarget}
                style={{
                  marginLeft: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  backgroundColor: THEME_PURPLE,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={[
                styles.inputBox,
                { justifyContent: "space-between", marginBottom: 10 },
              ]}
            >
              <Text
                style={{ color: TEXT_GRAY, fontSize: 16, fontWeight: "500" }}
              >
                Target: ₹
                {currentCategoryTarget
                  ? parseFloat(currentCategoryTarget).toLocaleString()
                  : "Not Set"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowTargetInput(true)}
                style={{
                  marginLeft: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  backgroundColor: BORDER,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{ color: "#222", fontWeight: "bold", fontSize: 13 }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.label}>Payment Mode</Text>
          <View style={styles.paymentGrid}>
            {paymentModes.map((mode, idx) => (
              <TouchableOpacity
                key={mode.label}
                style={[
                  styles.paymentGridItem,
                  selectedPaymentIndex === idx && {
                    borderColor: THEME_PURPLE,
                    backgroundColor: "#ede9fe",
                  },
                ]}
                onPress={() => setSelectedPaymentIndex(idx)}
                activeOpacity={0.8}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {mode.icon}
                  <Text style={styles.paymentGridLabel}>{mode.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Date</Text>
          <TouchableOpacity onPress={showDatepicker} style={styles.inputBox}>
            <Text style={[styles.input, { flex: 1, color: TEXT_GRAY }]}>
              {date.toLocaleDateString("en-CA")}
            </Text>
            <MaterialIcons name="date-range" size={22} color={THEME_PURPLE} />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "compact" : "default"}
              onChange={onChangeDate}
              maximumDate={new Date()} // ✅ Prevent future dates
            />
          )}

          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add any additional details here..."
            placeholderTextColor={TEXT_GRAY}
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <TouchableOpacity
            style={styles.addBtn}
            onPress={handleAddExpense}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons
                  name="add"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.addBtnText}>Add Expense</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Add Category Modal */}
          <Modal
            visible={showAddCategoryModal}
            transparent
            animationType="fade"
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
                  borderRadius: 12,
                  padding: 24,
                  width: 300,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6 }}
                >
                  Choose Icon
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginBottom: 16,
                  }}
                >
                  {suggestedIcons.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      onPress={() => setNewCategoryIcon(icon)}
                      style={{
                        backgroundColor:
                          newCategoryIcon === icon ? "#e0e7ff" : "#f3f4f6",
                        padding: 8,
                        borderRadius: 8,
                        margin: 4,
                      }}
                    >
                      {/* Use renderIcon to display suggested icons correctly */}
                      {renderIcon(icon, "#37474F", newCategoryIconLibrary)}{" "}
                      {/* Pass selected library for preview */}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* --- NEW: Icon Library Picker --- */}
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    marginBottom: 6,
                    marginTop: 10,
                  }}
                >
                  Select Icon Library
                </Text>
                <View style={styles.pickerContainer}>
                  {" "}
                  {/* Use a container style */}
                  <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={handleChangeValue}
                    setItems={setItems}
                    placeholder="Select an icon library"
                    style={styles.picker}
                    dropDownContainerStyle={styles.dropDownContainer}
                    textStyle={styles.pickerItem}
                    zIndex={1000} // To ensure dropdown appears above other components
                  />
                </View>
                {/* --- END NEW: Icon Library Picker --- */}

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    marginBottom: 6,
                    marginTop: 10,
                  }}
                >
                  Choose Color
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginBottom: 16,
                  }}
                >
                  {suggestedColors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      onPress={() => setNewCategoryColor(color)}
                      style={{
                        backgroundColor: color,
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        margin: 4,
                        borderWidth: newCategoryColor === color ? 2 : 0,
                        borderColor:
                          newCategoryColor === color ? "#222" : "#fff",
                      }}
                    />
                  ))}
                </View>

                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}
                >
                  Add New Category
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: BORDER,
                    borderRadius: 8,
                    padding: 10,
                    width: "100%",
                    marginBottom: 16,
                  }}
                  placeholder="Enter category name"
                  placeholderTextColor={TEXT_GRAY}
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                  autoFocus
                />
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: BORDER,
                    borderRadius: 8,
                    padding: 10,
                    width: "100%",
                    marginBottom: 16,
                  }}
                  placeholder="Enter category target (optional)"
                  placeholderTextColor={TEXT_GRAY}
                  keyboardType="numeric"
                  value={newCategoryTarget}
                  onChangeText={setNewCategoryTarget}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: THEME_PURPLE,
                      paddingVertical: 10,
                      paddingHorizontal: 18,
                      borderRadius: 8,
                      marginRight: 8,
                      flex: 1,
                      alignItems: "center",
                    }}
                    onPress={handleAddCategory}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Add Category
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: BORDER,
                      paddingVertical: 10,
                      paddingHorizontal: 18,
                      borderRadius: 8,
                      flex: 1,
                      alignItems: "center",
                    }}
                    onPress={() => {
                      setShowAddCategoryModal(false);
                      setNewCategoryName("");
                      setNewCategoryTarget("");
                      setNewCategoryIcon("wallet");
                      setNewCategoryColor("#3B82F6");
                      setNewCategoryIconLibrary("Ionicons"); // <--- RESET NEW STATE ON CANCEL
                    }}
                  >
                    <Text style={{ color: "#222", fontSize: 12 }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Custom Category Selection Modal (for "Other" category) */}
          <Modal
            visible={showCustomCategoryModal}
            transparent
            animationType="fade"
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.4)", // Semi-transparent background
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 20,
                  width: "85%",
                  maxHeight: "70%",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  Select Custom Category
                </Text>

                <ScrollView
                  contentContainerStyle={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {customCategories.length > 0 ? (
                    customCategories.map((cat) => (
                      <TouchableOpacity
                        key={cat.id || cat.label} // Use ID for key if available
                        onPress={() => {
                          // Update selected category in the main categories state
                          // Check if category already exists in 'categories' to avoid duplicates
                          const existingIndex = categories.findIndex(
                            (c) => c.label === cat.label
                          );
                          if (existingIndex === -1) {
                            setCategories((prevCategories) => [
                              ...prevCategories,
                              cat,
                            ]);
                            setSelectedCategoryIndex(categories.length); // Select the newly added one
                          } else {
                            setSelectedCategoryIndex(existingIndex); // Select existing one
                          }
                          setShowCustomCategoryModal(false); // Close modal
                        }}
                        onLongPress={() => {
                          console.log(
                            "Category long-pressed:",
                            cat.label,
                            "ID:",
                            cat.id
                          ); // LONG PRESS TO DELETE
                          setLongPressedCategory(cat);
                          setShowDeleteConfirmationModal(true);
                        }}
                        delayLongPress={700} // Adjust as needed
                        style={{
                          width: "40%",
                          margin: 8,
                          paddingVertical: 12,
                          backgroundColor: "#f3f4f6",
                          borderRadius: 12,
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: "#e5e7eb",
                        }}
                      >
                        {/* Pass iconLibrary here as well for correct display in this modal */}
                        {renderIcon(
                          cat.iconName,
                          cat.iconColor,
                          cat.iconLibrary
                        )}
                        <Text
                          style={{
                            marginTop: 6,
                            fontSize: 14,
                            color: "#374151",
                          }}
                        >
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text
                      style={{
                        color: TEXT_GRAY,
                        textAlign: "center",
                        padding: 20,
                      }}
                    >
                      No custom categories found. Add one!
                    </Text>
                  )}
                </ScrollView>

                <TouchableOpacity
                  style={{
                    marginTop: 16,
                    backgroundColor: "#37474F",
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                  onPress={() => setShowCustomCategoryModal(false)}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            visible={showDeleteConfirmationModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowDeleteConfirmationModal(false)} // Allow back button to close
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.6)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 24,
                  width: "80%",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="warning-outline"
                  size={40}
                  color="#EF4444"
                  style={{ marginBottom: 15 }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                >
                  Delete Category "{longPressedCategory?.label}"?
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: TEXT_GRAY,
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  This action is irreversible. All transactions associated with
                  this category will also be permanently deleted.
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: BORDER,
                      paddingVertical: 10,
                      paddingHorizontal: 18,
                      borderRadius: 8,
                      flex: 1,
                      alignItems: "center",
                      marginRight: 8,
                    }}
                    onPress={() => {
                      setShowDeleteConfirmationModal(false);
                      setLongPressedCategory(null);
                    }}
                  >
                    <Text style={{ color: "#222", fontSize: 14 }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#EF4444", // Red for delete
                      paddingVertical: 10,
                      paddingHorizontal: 18,
                      borderRadius: 8,
                      flex: 1,
                      alignItems: "center",
                    }}
                    onPress={handleDeleteCategory}
                    disabled={loading} // Disable while deleting
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 14,
                          fontWeight: "bold",
                        }}
                      >
                        Delete Anyway
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};
export default AddProduct;
