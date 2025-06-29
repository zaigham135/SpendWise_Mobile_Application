import { StyleSheet } from "react-native";

const THEME_PURPLE = "#37474F";
const BORDER = "#e5e7eb";
const BAR_WIDTH = 120;

export const loadingBarStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: "#f6f8fa",
  },
  walletContainer: {
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  quote: {
    color: "#22223b",
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 18,
    textAlign: "center",
    width: 260,
    minHeight: 22,
  },
  barBg: {
    width: BAR_WIDTH,
    height: 8,
    borderRadius: 4,
    backgroundColor: BORDER,
    overflow: "hidden",
    marginBottom: 18,
    position: "relative",
  },
  bar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME_PURPLE,
    position: "absolute",
    left: 0,
    top: 0,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    width: 30,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    opacity: 0.7,
  },
  loadingText: {
    color: THEME_PURPLE,
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});