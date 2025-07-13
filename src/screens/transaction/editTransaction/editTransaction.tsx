import React, { useState, useEffect, useMemo } from "react"; // Ensure useEffect and useMemo are imported
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { editTransactionStyles as styles } from "../../../../style/transaction/editTransaction/editTransaction.styles";
import axiosInstance from "../../../api/axios/axiosInstance";
import { Picker } from "@react-native-picker/picker"; // Import Picker

const THEME_PURPLE = "#37474F";
const BORDER = "#e5e7eb";
const LIGHT_BG = "#fff";
const TEXT_GRAY = "#6b7280";

export default function EditTransaction({ route, navigation }) {
  const { transaction } = route.params;

  console.log("EditTransaction received transaction:", transaction);

  const [title, setTitle] = useState(transaction.title ?? '');
  const [amount, setAmount] = useState(String(transaction.amount ?? '').replace(/[^0-9.]/g, ""));
  const [category, setCategory] = useState(transaction.category ?? '');
  const [date, setDate] = useState(transaction.rawDate || new Date());
  const [notes, setNotes] = useState(transaction.notes ?? "");
  const [paymentMode, setPaymentMode] = useState(transaction.paymentMode ?? "");
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Define available payment modes
  const availablePaymentModes = useMemo(() => ([
    "Cash",
    "Card",
    "UPI",
    "Bank Transfer",
    "Other",
    "N/A" // Include N/A if it's a possible default value
  ]), []);

  // Add this useEffect hook
  useEffect(() => {
    // This effect will run whenever the 'transaction' prop changes
    setTitle(transaction.title ?? '');
    setAmount(String(transaction.amount ?? '').replace(/[^0-9.]/g, ""));
    setCategory(transaction.category ?? '');
    setDate(transaction.rawDate || new Date());
    setNotes(transaction.notes ?? "");
    setPaymentMode(transaction.paymentMode ?? "");
  }, [transaction]); // Dependency array: re-run this effect when 'transaction' changes

  const handleSave = async () => {
    setIsSaving(true);

    if (!title || !amount || !category) {
      Alert.alert("Error", "Title, Amount, and Category are required.");
      setIsSaving(false);
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      Alert.alert("Error", "Amount must be a valid number.");
      setIsSaving(false);
      return;
    }

    // Format date to YYYY-MM-DD using local date components to avoid timezone issues
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    try {
      const payload = {
        title: title,
        value: numericAmount,
        date: formattedDate,
        section: category,
        payment_mode: paymentMode || null, // Send null if empty string
        notes: notes || null, // Send null if empty string
      };

      await axiosInstance.put(`/items/${transaction._id}`, payload);
      Alert.alert("Success", "Transaction updated successfully!");
      navigation.goBack();
    } catch (err: any) {
      console.error("Error updating transaction:", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.error || "Failed to update transaction. Please try again.");
      if (err.response?.status === 401) {
        Alert.alert(
          "Authentication Required",
          "Your session has expired. Please log in again."
        );
        navigation.navigate("Login" as never);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = date
    ? date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f6f8fa" }}
      contentContainerStyle={{ padding: 18, paddingBottom: 90 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={THEME_PURPLE} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#22223b" }}>Edit Transaction</Text>
      </View>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        editable={false} // Category input is now disabled
      />

      <Text style={styles.label}>Payment Mode</Text>
      <View
        style={{
          borderWidth: 1,
          
          borderColor: BORDER,
          borderRadius: 8,
          marginBottom: 16,
          
          backgroundColor: LIGHT_BG,
          overflow: "hidden",
        }}
      >
        <Picker
          selectedValue={paymentMode}
          onValueChange={(itemValue) => setPaymentMode(itemValue)}
          style={{ height: 50, width: "100%", color: THEME_PURPLE }}
          itemStyle={{ fontSize: 16, color: THEME_PURPLE }}
        >
          {availablePaymentModes.map((mode) => (
            <Picker.Item key={mode} label={mode} value={mode} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        style={[styles.input, { flexDirection: "row", alignItems: "center", paddingVertical: 0 }]}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.7}
      >
        <Text style={{ flex: 1, fontSize: 16, color: "#22223b", paddingVertical: 10 }}>
          {formattedDate}
        </Text>
        <MaterialIcons name="date-range" size={20} color={THEME_PURPLE} />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={date}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, { minHeight: 60, textAlignVertical: "top" }]}
        value={notes}
        onChangeText={setNotes}
        multiline
        placeholder="Add notes..."
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveBtnText}>Save</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
