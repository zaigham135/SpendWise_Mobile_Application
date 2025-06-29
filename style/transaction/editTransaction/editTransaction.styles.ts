import { StyleSheet } from "react-native";
const THEME_PURPLE = "#37474F";
const BORDER = "#e5e7eb";
const LIGHT_BG = "#fff";
const TEXT_GRAY = "#6b7280";
export const editTransactionStyles = StyleSheet.create({
  label: {
    fontWeight: "600",
    color: "#22223b",
    fontSize: 15,
    marginBottom: 6,
    marginTop: 18,
  },
  input: {
    backgroundColor: LIGHT_BG,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: "#22223b",
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: THEME_PURPLE,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});