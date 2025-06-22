import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { SystemStatusBar } from "./src/lib/statusBar/statusbar";
import * as SystemUI from "expo-system-ui";
import { NavigationContainer } from "@react-navigation/native";
import AppTabs from "./src/lib/StackNavigator/tabnavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/login/login";
import SignUpScreen from "./src/screens/login/signUp/signUp"; // if you have one

const Stack = createNativeStackNavigator();

export default function MainApp() {
  SystemUI.setBackgroundColorAsync("white");
  // Replace this with your real auth logic
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <StatusBar style="dark" backgroundColor="white" />
        <StatusBar />
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
                {/* <Stack.Screen name="SignUp" component={SignUpScreen} /> */}
              </>
            ) : (
              <Stack.Screen
                name="Main"
                children={(props) => <AppTabs {...props} setIsLoggedIn={setIsLoggedIn} />}
              />

            )}
            <Stack.Screen name="SignUp" component={SignUpScreen} />
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
