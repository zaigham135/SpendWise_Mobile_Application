import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { edituserStyles as styles } from "../../../../style/login/edituserdetails/edituserdetails.styles";
const THEME_PURPLE = "#37474F";
const LIGHT_BG = "#fff";
const BORDER = "#e5e7eb";
const TEXT_GRAY = "#6b7280";

export default function EditProfile({ navigation }) {
  const [fullName, setFullName] = useState("Sarah Johnson");
  const [email, setEmail] = useState("sarah.johnson@example.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [profilePic, setProfilePic] = useState(
    "https://randomuser.me/api/portraits/women/44.jpg"
  );

  const handleSave = () => {
    // Save logic here
    navigation.goBack();
  };

  const handleEditPicture = () => {
    // Add image picker logic here
    alert("Edit picture tapped!");
  };

  return (
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
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
         
          <Text
            style={{ fontSize: 20, fontWeight: "700", color: "#22223b" }}
          >
            Edit Profile
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Profile Picture with Edit Button */}
          <View style={{ alignItems: "center", marginBottom: 18 }}>
            <View>
              <Image
                source={{ uri: profilePic }}
                style={styles.profilePic}
              />
              <TouchableOpacity
                style={styles.editPicBtn}
                onPress={handleEditPicture}
              >
                <Ionicons name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.title}>Update your details</Text>
          <Text style={styles.subtitle}>
            Make changes to your profile below
          </Text>

          {/* Full Name */}
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={TEXT_GRAY}
            value={fullName}
            onChangeText={setFullName}
          />

          {/* Email */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={TEXT_GRAY}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Phone */}
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor={TEXT_GRAY}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

