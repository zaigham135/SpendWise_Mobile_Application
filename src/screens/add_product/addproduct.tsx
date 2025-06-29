import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { addproductStyles as styles } from "../../../style/addproduct/addproduct.styles";
const THEME_PURPLE = "#37474F";
const TEXT_GRAY = "#6b7280";

const DEFAULT_COLORS = ["#3B82F6", "#f59e42", "#ef4444", "#a78bfa", "#22c55e", "#fbbf24", "#64748b", "#6366F1", "#14b8a6"];

export default function AddProduct() {
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Move categories to state so you can add new ones
  const [categories, setCategories] = useState([
    { label: "Travel", icon: <FontAwesome5 name="plane" size={22} color="#3B82F6" /> },
    { label: "Food", icon: <MaterialIcons name="restaurant" size={22} color="#f59e42" /> },
    { label: "Petrol", icon: <MaterialCommunityIcons name="gas-station" size={22} color="#ef4444" /> },
    { label: "Clothes", icon: <MaterialCommunityIcons name="tshirt-crew" size={22} color="#a78bfa" /> },
    { label: "Rent", icon: <Entypo name="home" size={22} color="#22c55e" /> },
    { label: "Groceries", icon: <MaterialIcons name="local-grocery-store" size={22} color="#fbbf24" /> },
    { label: "Other", icon: <Ionicons name="ellipsis-horizontal" size={22} color="#64748b" />, full: true },
  ]);

  // Your existing paymentModes array (leave as is)
  const paymentModes = [
    { label: "UPI", icon: <MaterialCommunityIcons name="cellphone" size={20} color="#6366F1" /> },
    { label: "Credit Card", icon: <MaterialIcons name="credit-card" size={20} color="#3b82f6" /> },
    { label: "Cash", icon: <FontAwesome5 name="money-bill-wave" size={20} color="#22c55e" /> },
    { label: "Netbanking", icon: <MaterialCommunityIcons name="bank" size={20} color="#64748b" /> },
  ];

  // Helper to get a random color for new categories
  const getRandomColor = () => DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCategories([
        ...categories,
        {
          label: newCategoryName.trim(),
          icon: <Ionicons name="pricetag" size={22} color={getRandomColor()} />,
        },
      ]);
      setNewCategoryName("");
      setShowAddCategory(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f6f8fa" }}>
      {/* Sticky Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <View style={styles.iconBox}>
            <View style={styles.walletIconBg}>
              <Ionicons name="wallet" size={16} color="white" />
            </View>
          </View>
          <Text style={styles.headerTitle}>Add Expense</Text>
          <View style={styles.iconBox}>
            <Ionicons name="notifications" size={18} color="#1f2937" />
          </View>
        </View>
      </View>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 80 }}>
        {/* Title */}
        <Text style={{ fontSize: 22, fontWeight: "700", color: "#22223b" }}>Add Expense</Text>
        <Text style={{ color: TEXT_GRAY, marginBottom: 18, marginTop: 2 }}>Enter your expense details below</Text>

        {/* Amount */}
        <Text style={styles.label}>Amount</Text>
        <View style={styles.inputBox}>
          <Text style={{ color: TEXT_GRAY, fontSize: 18, marginRight: 6 }}>₹</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={TEXT_GRAY}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.grid}>
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={cat.label}
              style={[
                styles.gridItem,
                selectedCategory === idx && { borderColor: THEME_PURPLE, backgroundColor: "#ede9fe" },
              ]}
              onPress={() => setSelectedCategory(idx)}
              activeOpacity={0.8}
            >
              {cat.icon}
              <Text style={styles.gridLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
          {/* Add Category Card */}
          <TouchableOpacity
            style={[
              styles.gridItem,
              { borderStyle: "dashed", borderColor: "#a1a1aa", backgroundColor: "#f3f4f6", justifyContent: "center", alignItems: "center" },
            ]}
            onPress={() => setShowAddCategory(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle" size={28} color="#6366F1" />
            <Text style={[styles.gridLabel, { color: "#6366F1" }]}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Mode */}
        <Text style={styles.label}>Payment Mode</Text>
        <View style={styles.paymentGrid}>
          {paymentModes.map((mode, idx) => (
            <TouchableOpacity
              key={mode.label}
              style={[
                styles.paymentGridItem,
                selectedPayment === idx && { borderColor: THEME_PURPLE, backgroundColor: "#ede9fe" },
              ]}
              onPress={() => setSelectedPayment(idx)}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {mode.icon}
                <Text style={styles.paymentGridLabel}>{mode.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date */}
        <Text style={styles.label}>Date</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="mm/dd/yyyy"
            placeholderTextColor={TEXT_GRAY}
            value={date}
            onChangeText={setDate}
          />
          <MaterialIcons name="date-range" size={22} color={THEME_PURPLE} />
        </View>

        {/* Notes */}
        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Add any additional details here..."
          placeholderTextColor={TEXT_GRAY}
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        {/* Add Expense Button */}
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.addBtnText}>Add Expense</Text>
        </TouchableOpacity>

        {/* Add Category Modal */}
        <Modal visible={showAddCategory} transparent animationType="fade">
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.2)',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 24,
              width: 300,
              alignItems: 'center'
            }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>Add Category</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#a1a1aa",
                  borderRadius: 8,
                  padding: 10,
                  width: "100%",
                  marginBottom: 16,
                }}
                placeholder="Enter category name"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                autoFocus
              />
              <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#37474F",
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    borderRadius: 8,
                    marginRight: 8,
                  }}
                  onPress={handleAddCategory}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#e5e7eb",
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    borderRadius: 8,
                  }}
                  onPress={() => setShowAddCategory(false)}
                >
                  <Text style={{ color: "#222" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

