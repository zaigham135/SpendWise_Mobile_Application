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
export const filterModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%', // Limit modal height
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME_PURPLE,
    marginBottom: 20,
    textAlign: 'center',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_PURPLE,
    marginBottom: 8,
    marginTop: 15,
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: TEXT_GRAY,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  categoryButtonSelected: {
    backgroundColor: THEME_PURPLE,
    borderColor: THEME_PURPLE,
  },
  categoryButtonText: {
    color: TEXT_GRAY,
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: '#fff',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    justifyContent: 'center',
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  filterButton: {
    backgroundColor: THEME_PURPLE,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: THEME_PURPLE,
    fontWeight: 'bold',
  },
});
export const paginationStyles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  paginationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  activePageButton: {
    backgroundColor: THEME_PURPLE,
  },
  paginationText: {
    color: THEME_PURPLE,
    fontWeight: 'bold',
    fontSize: 16,
  },
  activePageText: {
    color: '#fff',
  },
  disabledText: {
    color: '#ccc',
  },
});