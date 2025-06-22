import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import WalletLoadingBar from "../../lib/loadingbar/loadingbar"; // <-- import

const THEME_PURPLE = "#37474F";
const LIGHT_BG = "#fff";
const BORDER = "#e5e7eb";
const TEXT_GRAY = "#6b7280";

export default function LoginScreen({ navigation, setIsLoggedIn }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // <-- loading state

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f6f8fa" }}>
        <WalletLoadingBar text="Logging in..." />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f6f8fa" }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 18, paddingBottom: 70 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoCircle}>
          <Ionicons name="wallet" size={32} color="#fff" />
        </View>
        {/* Title */}
        <Text style={styles.title}>SpendWise</Text>
        <Text style={styles.subtitle}>Manage your expenses with ease</Text>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.loginLabel}>Login</Text>
          <Text style={styles.inputLabel}>Email or Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email or phone"
            placeholderTextColor={TEXT_GRAY}
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={TEXT_GRAY}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 12 }}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                setIsLoggedIn(true);
              }, 1800);
            }}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* OR Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.divider} />
        </View>

        {/* Social Buttons */}
        <TouchableOpacity style={styles.socialBtn}>
          <FontAwesome name="google" size={18} color="#22223b" style={{ marginRight: 10 }} />
          <Text style={styles.socialBtnText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <FontAwesome name="facebook" size={18} color="#1877f3" style={{ marginRight: 10 }} />
          <Text style={styles.socialBtnText}>Continue with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <FontAwesome5 name="comment-dots" size={18} color="#22c55e" style={{ marginRight: 10 }} />
          <Text style={styles.socialBtnText}>Login via OTP</Text>
        </TouchableOpacity>

        {/* Sign Up */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 18 }}>
          <Text style={{ color: TEXT_GRAY }}>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace("SignUp")}>
            <Text style={{ color: THEME_PURPLE, fontWeight: "700" }}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 24,
  },
  logoCircle: {
    backgroundColor: THEME_PURPLE,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    marginTop: Platform.OS === "ios" ? 32 : 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: THEME_PURPLE,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: TEXT_GRAY,
    fontSize: 15,
    marginBottom: 18,
  },
  card: {
    backgroundColor: LIGHT_BG,
    borderRadius: 14,
    padding: 18,
    width: "100%",
    maxWidth: 370,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 18,
  },
  loginLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#22223b",
    marginBottom: 14,
  },
  inputLabel: {
    color: TEXT_GRAY,
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#22223b",
    marginBottom: 8,
  },
  forgotText: {
    color: THEME_PURPLE,
    fontWeight: "600",
    fontSize: 13,
  },
  loginBtn: {
    backgroundColor: THEME_PURPLE,
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 6,
    marginBottom: 2,
  },
  loginBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 370,
    marginVertical: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER,
  },
  orText: {
    marginHorizontal: 10,
    color: TEXT_GRAY,
    fontWeight: "600",
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 12,
    paddingHorizontal: 18,
    width: "100%",
    maxWidth: 370,
    marginBottom: 10,
  },
  socialBtnText: {
    color: "#22223b",
    fontWeight: "600",
    fontSize: 15,
  },
});