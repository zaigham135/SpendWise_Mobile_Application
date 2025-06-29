import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {editTransactionStyles as styles } from "../../../../style/transaction/editTransaction/editTransaction.styles"; // Assuming styles are defined in a separate file
const THEME_PURPLE = "#37474F";
const BORDER = "#e5e7eb";
const LIGHT_BG = "#fff";
const TEXT_GRAY = "#6b7280";

export default function EditTransaction({ route, navigation }) {
  const { transaction } = route.params;
  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(transaction.amount.replace(/[^0-9.]/g, ""));
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(transaction.time ? new Date(transaction.time) : new Date());
  const [notes, setNotes] = useState(transaction.notes || "");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = () => {
    // Implement save logic here (API call or state update)
    Alert.alert("Saved", "Transaction updated!");
    navigation.goBack();
  };

  // Format date and time for display
  const formattedDate = date
    ? date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "";
  const formattedTime = date
    ? date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
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
        onChangeText={setCategory}
        placeholder="e.g. Food & Drinks"
      />

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

      <Text style={styles.label}>Time</Text>
      <TouchableOpacity
        style={[styles.input, { flexDirection: "row", alignItems: "center", paddingVertical: 0 }]}
        onPress={() => setShowTimePicker(true)}
        activeOpacity={0.7}
      >
        <Text style={{ flex: 1, fontSize: 16, color: "#22223b", paddingVertical: 10 }}>
          {formattedTime}
        </Text>
        <MaterialIcons name="access-time" size={20} color={THEME_PURPLE} />
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          mode="time"
          value={date}
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              const newDate = new Date(date);
              newDate.setHours(selectedTime.getHours());
              newDate.setMinutes(selectedTime.getMinutes());
              setDate(newDate);
            }
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

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

