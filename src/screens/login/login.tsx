import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import WalletLoadingBar from "../../lib/loadingbar/loadingbar";
import { loginStyles as styles } from "../../../style/login/login.styles";
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../../api/apiConfig';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopNotification from "../../components/ui/TopNotification";

const THEME_PURPLE = "#37474F";
const TEXT_GRAY = "#6b7280";

const LoginSchema = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginScreen({ navigation, setIsLoggedIn }) {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', color: '#ef4444' });

  const handleGoogleLogin = () => {
    // If you have Google OAuth, implement here
    // window.location.href = `${API_BASE_URL}${API_ENDPOINTS.googleAuth}`;
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    setSnackbar({ visible: false, message: '', color: '#ef4444' });
    try {
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.login}`, {
        email: values.email,
        password: values.password,
      });

      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      setIsLoggedIn(true);
      setSnackbar({ visible: true, message: "Login successful!", color: "#22c55e" });

      setTimeout(() => {
        setSnackbar({ visible: false, message: '', color: "#22c55e" });
      }, 2000); // 2000ms matches TopNotification duration
    } catch (error) {
      let msg = "Login failed. Please try again.";
      if (error.response && error.response.data && error.response.data.error) {
        msg = error.response.data.error;
      }
      setSnackbar({ visible: true, message: msg, color: "#ef4444" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f6f8fa" }}>
        <WalletLoadingBar text="Logging in..." />
      </View>
    );
  }

  return (
    <>
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
          <Text style={styles.title}>SpendWise</Text>
          <Text style={styles.subtitle}>Manage your expenses with ease</Text>

          {/* Login Card with Formik */}
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.card}>
                <Text style={styles.loginLabel}>Login</Text>
                <Text style={styles.inputLabel}>Email or Phone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={TEXT_GRAY}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {touched.email && errors.email && (
                  <Text style={{ color: "#ef4444", marginBottom: 4 }}>{errors.email}</Text>
                )}
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={TEXT_GRAY}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry
                />
                {touched.password && errors.password && (
                  <Text style={{ color: "#ef4444", marginBottom: 4 }}>{errors.password}</Text>
                )}
                <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 12 }}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={handleSubmit}
                >
                  <Text style={styles.loginBtnText}>Login</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          {/* OR Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Buttons */}
          <TouchableOpacity style={styles.socialBtn} onPress={handleGoogleLogin}>
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
      <TopNotification
        visible={snackbar.visible}
        message={snackbar.message}
        color={snackbar.color}
        onHide={() => setSnackbar({ ...snackbar, visible: false })}
      />
    </>
  );
}

