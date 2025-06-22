import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useState } from "react";
import { TextInput } from "react-native";
import { Image } from "react-native";

const THEME_PURPLE = "#37474F";
const LIGHT_BG = "#fff";
const BORDER = "#e5e7eb";
const TEXT_GRAY = "#6b7280";
const RED = "#ef4444";
const GREEN = "#22c55e";
const YELLOW = "#fbbf24";
const BLUE = "#3B82F6";
const PINK = "#f472b6";

const transactions = [
  {
    section: "Today",
    data: [
      {
        icon: <MaterialCommunityIcons name="food" size={22} color={BLUE} />,
        color: "#e0e7ff",
        title: "Lunch",
        amount: "-$24.50",
        time: "Today, 1:24 PM",
        category: "Food & Drinks",
      },
      {
        icon: <MaterialCommunityIcons name="car" size={22} color={PINK} />,
        color: "#fce7f3",
        title: "Uber",
        amount: "-$18.75",
        time: "Today, 9:15 AM",
        category: "Transportation",
      },
    ],
  },
  {
    section: "Yesterday",
    data: [
      {
        icon: (
          <MaterialIcons name="local-grocery-store" size={22} color={GREEN} />
        ),
        color: "#d1fae5",
        title: "Grocery Store",
        amount: "-$87.32",
        time: "Yesterday, 6:30 PM",
        category: "Groceries",
      },
      {
        icon: <MaterialIcons name="movie" size={22} color={RED} />,
        color: "#fee2e2",
        title: "Movie Tickets",
        amount: "-$32.99",
        time: "Yesterday, 7:45 PM",
        category: "Entertainment",
      },
    ],
  },
  {
    section: "Last Week",
    data: [
      {
        icon: <MaterialIcons name="bolt" size={22} color={YELLOW} />,
        color: "#fef9c3",
        title: "Electricity Bill",
        amount: "-$94.50",
        time: "Jun 12, 2023",
        category: "Utilities",
      },
      {
        icon: (
          <MaterialCommunityIcons name="tshirt-crew" size={22} color={PINK} />
        ),
        color: "#fce7f3",
        title: "Clothing Store",
        amount: "-$129.99",
        time: "Jun 10, 2023",
        category: "Shopping",
      },
    ],
  },
];

export default function TransactionScreen({ navigation }) {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const filteredTransactions = transactions
    .map((section) => {
      const filteredData = section.data.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.time.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return { ...section, data: filteredData };
    })
    .filter((section) => section.data.length > 0); // Remove empty sections

  const handleEdit = () => {
    setModalVisible(false);
    navigation.navigate("EditTransaction", { transaction: selectedTxn });
  };

  const handleDelete = () => {
    // Implement delete logic
    Alert.alert("Delete", "Delete functionality goes here.");
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f6f8fa",paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        {/* App Logo (replace source with your actual logo path) */}
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
          <TouchableOpacity>
            <Ionicons name="filter" size={20} color={THEME_PURPLE} />
          </TouchableOpacity>
        </View>
      </View>
      {searchVisible && (
        <View style={{ paddingHorizontal: 18, marginBottom: 10 }}>
          <TextInput
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: BORDER,
            }}
          />
        </View>
      )}

      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>
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
          <Text style={styles.totalValue}>$2,847.95</Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}
          >
            <Text style={styles.percentDown}>↓ 12.5%</Text>
            <Text style={styles.totalSub}> from last month</Text>
          </View>
        </View>

        {/* Transactions List */}
        {filteredTransactions.map((section) => (
          <View key={section.section} style={{ marginTop: 18 }}>
            <Text style={styles.sectionHeader}>{section.section}</Text>
            {section.data.map((item, idx) => (
              <TouchableOpacity
                key={item.title + idx}
                style={styles.txnCard}
                onPress={() => {
                  setSelectedTxn(item);
                  setModalVisible(true);
                }}
                activeOpacity={0.8}
              >
                <View
                  style={[styles.txnIconBox, { backgroundColor: item.color }]}
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
                  {/* <TouchableOpacity>
                    <Ionicons
                      name="ellipsis-vertical"
                      size={18}
                      color={TEXT_GRAY}
                      style={{ marginTop: 8 }}
                    />
                  </TouchableOpacity> */}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        {filteredTransactions.length === 0 && (
          <Text
            style={{ textAlign: "center", color: TEXT_GRAY, marginTop: 20 }}
          >
            No transactions found.
          </Text>
        )}
      </ScrollView>

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
                      { backgroundColor: selectedTxn.color, marginRight: 0 },
                    ]}
                  >
                    {selectedTxn.icon}
                  </View>
                  <Text
                    style={[
                      styles.txnTitle,
                      { fontSize: 18, marginTop: 8 },
                    ]}
                  >
                    {selectedTxn.title}
                  </Text>
                  <Text style={styles.txnAmount}>{selectedTxn.amount}</Text>
                  <Text style={styles.txnTime}>{selectedTxn.time}</Text>
                  <Text style={styles.txnCategory}>{selectedTxn.category}</Text>
                </View>
                {/* Example notes, replace with real notes if available */}
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
                      backgroundColor: THEME_PURPLE,
                      borderRadius: 8,
                      paddingVertical: 10,
                      paddingHorizontal: 18,
                      marginRight: 8,
                      flex: 1,
                      alignItems: "center",
                    }}
                    onPress={handleEdit}
                  >
                    <Text style={{ color: "#fff", fontWeight: "700" }}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#fff",
                      borderColor: RED,
                      borderWidth: 1,
                      borderRadius: 8,
                      paddingVertical: 10,
                      paddingHorizontal: 18,
                      flex: 1,
                      alignItems: "center",
                    }}
                    onPress={handleDelete}
                  >
                    <Text style={{ color: RED, fontWeight: "700" }}>Delete</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{ marginTop: 18, alignItems: "center" }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text
                    style={{ color: THEME_PURPLE, fontWeight: "600" }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: LIGHT_BG,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#22223b",
    flex: 1,
    textAlign: "center",
    marginLeft: -22, // To visually center between icons
  },
  totalCard: {
    backgroundColor: LIGHT_BG,
    borderRadius: 14,
    padding: 18,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  totalLabel: {
    fontSize: 15,
    color: TEXT_GRAY,
    fontWeight: "600",
  },
  thisMonthBadge: {
    backgroundColor: "#e0e7ff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  thisMonthText: {
    color: THEME_PURPLE,
    fontWeight: "700",
    fontSize: 12,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#22223b",
    marginTop: 6,
  },
  percentDown: {
    color: RED,
    fontWeight: "700",
    fontSize: 13,
    marginRight: 4,
  },
  totalSub: {
    color: TEXT_GRAY,
    fontSize: 13,
    fontWeight: "500",
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: "700",
    color: "#22223b",
    marginBottom: 8,
    marginLeft: 2,
  },
  txnCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT_BG,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  txnIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  txnTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#22223b",
  },
  txnTime: {
    fontSize: 12,
    color: TEXT_GRAY,
    marginTop: 2,
  },
  txnCategory: {
    fontSize: 12,
    color: TEXT_GRAY,
    marginTop: 2,
  },
  txnAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#22223b",
  },
  logoBox: {
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
});
