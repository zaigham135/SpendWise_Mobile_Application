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

const THEME_PURPLE = "#37474F";
const LIGHT_BG = "#fff";
const BORDER = "#e5e7eb";
const TEXT_GRAY = "#6b7280";

export default function SignUpScreen({ navigation}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f6f8fa" }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 18, paddingBottom: 70 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
          
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#22223b" }}>Create Account</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>Please fill in your details to get started</Text>

          {/* Full Name */}
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor={TEXT_GRAY}
            value={fullName}
            onChangeText={setFullName}
          />

          {/* Email */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="johndoe@example.com"
            placeholderTextColor={TEXT_GRAY}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password */}
          <Text style={styles.inputLabel}>Password</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="********"
              placeholderTextColor={TEXT_GRAY}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={TEXT_GRAY}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>Must be at least 8 characters</Text>

          {/* Phone */}
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+1 (555) 123-4567"
            placeholderTextColor={TEXT_GRAY}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Text style={styles.helperText}>We'll send a verification code to this number</Text>

          {/* Create Account Button */}
          <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.loginBtnText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* OR Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or sign up with</Text>
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
          <Text style={styles.socialBtnText}>Sign up with OTP</Text>
        </TouchableOpacity>

        {/* Already have account */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 18 }}>
          <Text style={{ color: TEXT_GRAY }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
            <Text style={{ color: THEME_PURPLE, fontWeight: "700" }}>Log in</Text>
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#22223b",
    marginBottom: 2,
    alignSelf: "flex-start",
  },
  subtitle: {
    color: TEXT_GRAY,
    fontSize: 15,
    marginBottom: 18,
    alignSelf: "flex-start",
  },
  inputLabel: {
    color: TEXT_GRAY,
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 12,
    fontSize: 14,
    alignSelf: "flex-start",
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
  helperText: {
    color: TEXT_GRAY,
    fontSize: 12,
    marginBottom: 2,
    alignSelf: "flex-start",
    marginLeft: 2,
  },
  loginBtn: {
    backgroundColor: THEME_PURPLE,
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 2,
    width: "100%",
    maxWidth: 370,
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
    fontSize: 13,
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