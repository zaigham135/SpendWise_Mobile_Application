// filepath: e:\Harish_sir_web_development\REACT JS\Expense_App_Fixed\src\screens\profile\EditProfileScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  StyleSheet, // Still needed for StyleSheet.create if you have any inline styles or new ones
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axiosInstance from '../../../api/axios/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- YOUR ORIGINAL STYLE IMPORT ---
import { edituserStyles as styles } from "../../../../style/login/edituserdetails/edituserdetails.styles";
// --- END ORIGINAL STYLE IMPORT ---

// --- THEME CONSTANTS (keeping these for color references in the component logic if needed, or if not part of your styles) ---
const THEME_PURPLE = "#37474F";
const LIGHT_BG = "#fff";
const BORDER = "#e5e7eb";
const TEXT_GRAY = "#6b7280";
const LIGHT_GRAY = '#f6f8fa'; // Used for screen background, ensure this matches your style file if applicable
// --- END THEME CONSTANTS ---

// Define the structure of your user object, consistent with ProfileScreen
interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  profile_photo: string | null;
}

// Define the type for the route parameters expected by this screen
interface EditProfileRouteParams {
  initialUser: UserProfile;
}

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { initialUser } = route.params as EditProfileRouteParams;

  const [user, setUser] = useState<UserProfile>(initialUser);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(initialUser.profile_photo);
  
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Sorry, we need camera roll permissions to change your profile picture!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      setPreviewUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      
      if (user.first_name !== initialUser.first_name) {
        formData.append('first_name', user.first_name);
      }
      if (user.last_name !== initialUser.last_name) {
        formData.append('last_name', user.last_name);
      }
      if (user.phone_number !== initialUser.phone_number) {
        formData.append('phone_number', user.phone_number || '');
      }
      
      formData.append('email', user.email); // Email is sent for identification

      if (selectedImage) {
        const uriParts = selectedImage.uri.split('.');
        const fileType = uriParts.length > 1 ? uriParts[uriParts.length - 1] : 'jpg'; 
        
        formData.append('profile_photo', {
          uri: Platform.OS === 'android' ? selectedImage.uri : selectedImage.uri.replace('file://', ''),
          name: `profile_photo.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      const hasChanges = (
        formData.get('first_name') !== null ||
        formData.get('last_name') !== null ||
        formData.get('phone_number') !== null ||
        selectedImage !== null
      );

      if (!hasChanges) {
        Alert.alert("No Changes", "No changes were detected to save.");
        setLoading(false);
        navigation.goBack();
        return;
      }
      
      const response = await axiosInstance.put('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        Alert.alert("Success", "Profile updated successfully!");
        navigation.goBack();
      } else {
        throw new Error("User data not returned from backend after update.");
      }
    } catch (error: any) {
      console.error('Profile update error:', error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.error || error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: LIGHT_GRAY }} // Keeping this inline if not in your style file
      contentContainerStyle={{ // Keeping this inline if not in your style file
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
          style={{ // Using inline style for this row as it's not present in the original snippet, or add to your style file
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 18,
            justifyContent: 'space-between', // Added for back button & title centering
            paddingHorizontal: 0, // Ensure no extra padding
          }}
        >
          {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 24 }}> Back button */}
            {/* <Ionicons name="arrow-back" size={24} color="#22223b" /> */}
          {/* </TouchableOpacity> */}
          <Text
            style={{ fontSize: 20, fontWeight: "700", color: "#22223b" }}
          >
            Edit Profile
          </Text>
          <View style={{ width: 24 }} /> {/* Placeholder to balance */}
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Profile Picture with Edit Button */}
          <View style={{ alignItems: "center", marginBottom: 18 }}>
            <View>
              <Image
                source={{ uri: previewUri || 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=P' }}
                style={styles.profilePic}
              />
              <TouchableOpacity
                style={styles.editPicBtn}
                onPress={pickImage} // Use pickImage function
              >
                <MaterialIcons name="camera-alt" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.title}>Update your details</Text>
          <Text style={styles.subtitle}>
            Make changes to your profile below
          </Text>

          {/* First Name */}
          {/* Assuming your 'fullName' was intended to be split into first and last name for the backend */}
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor={TEXT_GRAY}
            value={user.first_name}
            onChangeText={(text) => setUser({ ...user, first_name: text })}
          />

          {/* Last Name */}
          <Text style={styles.inputLabel}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor={TEXT_GRAY}
            value={user.last_name}
            onChangeText={(text) => setUser({ ...user, last_name: text })}
          />

          {/* Email - Keeping it non-editable as per common practice for profile updates */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={[styles.input, { color: TEXT_GRAY, backgroundColor: LIGHT_GRAY }]} // Adjusted for disabled look
            placeholder="Email"
            placeholderTextColor={TEXT_GRAY}
            value={user.email}
            editable={false} // Make it non-editable
            selectTextOnFocus={false}
          />

          {/* Phone */}
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor={TEXT_GRAY}
            value={user.phone_number || ''}
            onChangeText={(text) => setUser({ ...user, phone_number: text })}
            keyboardType="phone-pad"
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
export default EditProfileScreen