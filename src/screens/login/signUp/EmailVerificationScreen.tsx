// EmailVerificationScreen.tsx (Conceptual)
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../../api/apiConfig'; // Adjust path
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopNotification from "../../../components/ui/TopNotification";

// You'll likely want to define styles for this screen
const styles = {
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f6f8fa' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#22223b' },
    subtitle: { fontSize: 15, color: '#6b7280', textAlign: 'center', marginBottom: 30 },
    input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, width: '100%', marginBottom: 20, fontSize: 16 },
    button: { backgroundColor: '#37474F', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    resendText: { marginTop: 20, color: '#6b7280' },
    resendLink: { color: '#37474F', fontWeight: 'bold' },
    loadingContainer: { flexDirection: 'row', alignItems: 'center' },
    loadingText: { marginLeft: 10, color: '#fff' }
};

export default function EmailVerificationScreen({ route, navigation, setIsLoggedIn }: { route: any, navigation: any, setIsLoggedIn: (isLoggedIn: boolean) => void }) {
    const { userEmail } = route.params; // Get email passed from SignUpScreen
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        visible: false,
        message: "",
        color: "#22c55e",
    });

    const handleVerifyCode = async () => {
        setLoading(true);
        try {
            // Send the code to your backend for verification
            const verifyResponse = await axios.post(`${API_BASE_URL}/verify-email`, {
                email: userEmail,
                code: verificationCode, // If using a code
            });

            if (verifyResponse.data.success) {
                setSnackbar({ visible: true, message: "Email verified successfully!", color: "#22c55e" });

                // After successful verification, attempt to log the user in
                const loginResponse = await axios.post(`${API_BASE_URL}/login`, {
                    email: userEmail,
                    // You'd need to re-enter password here or pass it from signup (less secure)
                    // For simplicity, assuming backend allows login post-verification without re-entering password if email is main identifier
                    // OR, navigate to login screen for user to log in manually.
                    // For auto-login, you'd need the password passed from SignUpScreen or handle it differently.
                    // Example if you passed password (NOT RECOMMENDED without secure encryption): password: route.params.password
                });

                if (loginResponse.data.token) {
                    await AsyncStorage.setItem("token", loginResponse.data.token);
                    await AsyncStorage.setItem("user", JSON.stringify(loginResponse.data.user));
                    setIsLoggedIn(true); // Trigger dashboard screen
                } else {
                    throw new Error("Login failed after verification.");
                }
            } else {
                setSnackbar({ visible: true, message: verifyResponse.data.message || "Invalid verification code.", color: "#ef4444" });
            }
        } catch (error: any) {
            console.error("Verification or auto-login failed:", error.response?.data || error.message);
            setSnackbar({
                visible: true,
                message: error.response?.data?.message || "Verification failed. Please try again.",
                color: "#ef4444",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/resend-verification-email`, { email: userEmail });
            setSnackbar({ visible: true, message: "Verification email re-sent!", color: "#f59e0b" });
        } catch (error: any) {
            console.error("Resend failed:", error.response?.data || error.message);
            setSnackbar({ visible: true, message: error.response?.data?.message || "Failed to resend email.", color: "#ef4444" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
                A verification code has been sent to {userEmail}. Please check your inbox and enter the code below.
            </Text>

            {/* If using a code-based verification */}
            <TextInput
                style={styles.input}
                placeholder="Enter verification code"
                keyboardType="numeric"
                value={verificationCode}
                onChangeText={setVerificationCode}
            />
            <TouchableOpacity style={styles.button} onPress={handleVerifyCode} disabled={loading}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator color="#fff" />
                        <Text style={styles.loadingText}>Verifying...</Text>
                    </View>
                ) : (
                    <Text style={styles.buttonText}>Verify Email</Text>
                )}
            </TouchableOpacity>

            {/* If using a link-based verification, provide instructions */}
            <Text style={styles.resendText}>
                Didn't receive the email?{' '}
                <Text style={styles.resendLink} onPress={handleResendCode}>
                    Resend Code
                </Text>
            </Text>
            <Text style={styles.resendText}>
                (Also check your spam folder.)
            </Text>

            <TopNotification
                visible={snackbar.visible}
                message={snackbar.message}
                color={snackbar.color}
                onHide={() => setSnackbar({ ...snackbar, visible: false })}
            />
        </View>
    );
}