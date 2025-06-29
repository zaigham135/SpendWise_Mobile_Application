import React, { useState } from "react";
import { View, Text, TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { signupStyles as styles } from "../../../../style/login/signup/signup.styles";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { API_BASE_URL } from "../../../api/apiConfig";
import TopNotification from "../../../components/ui/TopNotification";
import WalletLoadingBar from "../../../lib/loadingbar/loadingbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import GoogleSignInButton from "../googlesigninbutton";
const THEME_PURPLE = "#37474F";
const TEXT_GRAY = "#6b7280";

export default function SignUpScreen({ navigation, setIsLoggedIn }: { navigation: any, setIsLoggedIn: (isLoggedIn: boolean) => void }) {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    color: "#22c55e",
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);

    const formData = new FormData();
    const names = fullName.trim().split(" ");
    const firstName = names[0];
    const lastName = names.slice(1).join(" ") || "";

    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone_number", phone);

    if (image) {
      const uriParts = image.uri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("profile_photo", {
        uri: image.uri,
        name: `profile.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSnackbar({
        visible: true,
        message: "Signup successful!",
        color: "#22c55e",
      });

      // Wait to show snackbar before navigating
      setTimeout(async () => {
        try {
          const loginResponse = await axios.post(`${API_BASE_URL}/login`, {
            email,
            password,
          });

          if (loginResponse.data.token) {
            await AsyncStorage.setItem("token", loginResponse.data.token);
            await AsyncStorage.setItem(
              "user",
              JSON.stringify(loginResponse.data.user)
            );

            setIsLoggedIn(true); // Trigger dashboard screen
          } else {
            throw new Error("Auto-login failed: No token received");
          }
        } catch (loginError) {
          console.error("Auto-login failed:", loginError);
          setSnackbar({
            visible: true,
            message: "Signup succeeded, but auto-login failed.",
            color: "#f59e0b",
          });
        }
      }, 1000);
    } catch (error) {
      let msg = "Signup failed. Please try again.";
      if (error?.response?.data) {
        const err = error.response.data;
        if (err.details === "Email already exists") {
          msg = "This email is already registered";
        } else if (err.error === "Missing required fields") {
          msg = "Please fill in all required fields";
        } else if (err.error) {
          msg = err.error;
        } else if (err.details) {
          msg = err.details;
        }
      }
      setSnackbar({ visible: true, message: msg, color: "#ef4444" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f6f8fa",
        }}
      >
        <WalletLoadingBar text="Creating account..." />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#f6f8fa" }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 18,
          paddingBottom: 70,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
         
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#22223b" }}>
              Create Account
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.subtitle}>
              Please fill in your details to get started
            </Text>

            <TouchableOpacity
              onPress={pickImage}
              style={{ alignItems: "center", marginBottom: 18 }}
            >
              {image ? (
                <Image
                  source={{ uri: image.uri }}
                  style={{ width: 90, height: 90, borderRadius: 45 }}
                />
              ) : (
                <View
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 45,
                    backgroundColor: "#e5e7eb",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="camera" size={24} color={TEXT_GRAY} />
                </View>
              )}
              <Text style={{ marginTop: 6, fontSize: 12, color: TEXT_GRAY }}>
                Upload Photo
              </Text>
            </TouchableOpacity>

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor={TEXT_GRAY}
              value={fullName}
              onChangeText={setFullName}
            />

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

            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={TEXT_GRAY}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <Text style={styles.helperText}>
              We'll send a verification code to this number
            </Text>

            <TouchableOpacity style={styles.loginBtn} onPress={handleSignUp}>
              <Text style={styles.loginBtnText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.orText}>or sign up with</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.socialBtn}>
            <FontAwesome
              name="google"
              size={18}
              color="#22223b"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.socialBtnText}>Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <FontAwesome
              name="facebook"
              size={18}
              color="#1877f3"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.socialBtnText}>Continue with Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <FontAwesome5
              name="comment-dots"
              size={18}
              color="#22c55e"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.socialBtnText}>Sign up with OTP</Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 18,
            }}
          >
            <Text style={{ color: TEXT_GRAY }}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={{ color: THEME_PURPLE, fontWeight: "700" }}>
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TopNotification
        visible={snackbar.visible}
        message={snackbar.message}
        color={snackbar.color}
        onHide={() => setSnackbar({ ...snackbar, visible: false })}
      />
    </>
  );
}
