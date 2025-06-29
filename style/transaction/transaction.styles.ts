import { StyleSheet } from "react-native";
const THEME_PURPLE = "#37474F";
const LIGHT_BG = "#fff";
const BORDER = "#e5e7eb";
const TEXT_GRAY = "#6b7280";
const RED = "#ef4444";
const GREEN = "#22c55e";
const YELLOW = "#fbbf24";
const BLUE = "#3B82F6";
const PINK = "#f472b6";
export const transactionStyles = StyleSheet.create({
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