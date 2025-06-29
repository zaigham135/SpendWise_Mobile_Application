import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { SystemStatusBar } from "./src/lib/statusBar/statusbar";
import * as SystemUI from "expo-system-ui";
import { NavigationContainer } from "@react-navigation/native";
import AppTabs from "./src/lib/StackNavigator/tabnavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/login/login";
import SignUpScreen from "./src/screens/login/signUp/signUp";
import { LogBox } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure you have installed @react-native-async-storage/async-storage

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs(["Warning: useInsertionEffect must not schedule updates."]);

export default function MainApp() {
  SystemUI.setBackgroundColorAsync("white");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingApp, setLoadingApp] = useState(true);

  useEffect(() => {
    const checkInitialState = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking initial login state:", error);
      } finally {
        setLoadingApp(false);
      }
    };
    checkInitialState();
  }, []);

  console.log("isLoggedIn:", isLoggedIn);

  if (loadingApp) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading application...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <StatusBar style="dark" backgroundColor="white" />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isLoggedIn ? (
              <>
                <Stack.Screen
                  name="LoginScreen"
                  children={(props) => (
                    <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />
                  )}
                />
                <Stack.Screen
                  name="SignUp"
                  children={(props) => (
                    <SignUpScreen {...props} setIsLoggedIn={setIsLoggedIn} />
                  )}
                />
              </>
            ) : (
              <Stack.Screen
                name="Main"
                children={(props) => (
                  <AppTabs {...props} setIsLoggedIn={setIsLoggedIn} />
                )}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});