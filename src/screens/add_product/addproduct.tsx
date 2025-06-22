import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";

const THEME_PURPLE = "#37474F";
const LIGHT_BG = "#fff";
const BORDER = "#e5e7eb";
const TEXT_GRAY = "#6b7280";

const categories = [
  { label: "Travel", icon: <FontAwesome5 name="plane" size={22} color="#3B82F6" /> },
  { label: "Food", icon: <MaterialIcons name="restaurant" size={22} color="#f59e42" /> },
  { label: "Petrol", icon: <MaterialCommunityIcons name="gas-station" size={22} color="#ef4444" /> },
  { label: "Clothes", icon: <MaterialCommunityIcons name="tshirt-crew" size={22} color="#a78bfa" /> },
  { label: "Rent", icon: <Entypo name="home" size={22} color="#22c55e" /> },
  { label: "Groceries", icon: <MaterialIcons name="local-grocery-store" size={22} color="#fbbf24" /> },
  { label: "Other", icon: <Ionicons name="ellipsis-horizontal" size={22} color="#64748b" />, full: true },
];

const paymentModes = [
  { label: "UPI", icon: <MaterialCommunityIcons name="cellphone" size={20} color="#6366F1" /> },
  { label: "Credit Card", icon: <MaterialIcons name="credit-card" size={20} color="#3b82f6" /> },
  { label: "Cash", icon: <FontAwesome5 name="money-bill-wave" size={20} color="#22c55e" /> },
  { label: "Netbanking", icon: <MaterialCommunityIcons name="bank" size={20} color="#64748b" /> },
];

export default function AddProduct() {
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: "600",
    color: "#22223b",
    fontSize: 15,
    marginBottom: 6,
    marginTop: 18,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT_BG,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 8,
  },
  input: {
    fontSize: 18,
    color: "#22223b",
    flex: 1,
    padding: 0,
    backgroundColor: "transparent",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  gridItem: {
    width: "30%",
    aspectRatio: 1.1,
    backgroundColor: LIGHT_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    padding: 8,
  },
  gridLabel: {
    fontSize: 13,
    color: "#22223b",
    marginTop: 6,
    fontWeight: "500",
    textAlign: "center",
  },
  paymentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  paymentGridItem: {
    width: "48%",
    backgroundColor: LIGHT_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  paymentGridLabel: {
    fontSize: 14,
    color: "#22223b",
    fontWeight: "500",
    marginLeft: 10,
  },
  notesInput: {
    backgroundColor: LIGHT_BG,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#22223b",
    minHeight: 60,
    marginBottom: 18,
    marginTop: 4,
    textAlignVertical: "top",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME_PURPLE,
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  headerWrapper: {
    width: "100%",
    backgroundColor: "white",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    paddingBottom: 8,
    marginBottom: 8,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 48 : 24,
    paddingBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  walletIconBg: {
    width: 32,
    height: 32,
    backgroundColor: THEME_PURPLE,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    fontFamily: "System",
    letterSpacing: 0.5,
  },
});