import React, { JSX } from "react";
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export const ExpenseTrendsSection = (): JSX.Element => {
  // Category data for mapping
  const categories = [
    {
      name: "Travel",
      icon: "airplane",
      gradient: ["#3b82f6", "#2563eb"],
    },
    {
      name: "Food",
      icon: "restaurant",
      gradient: ["#f97316", "#ea580c"],
    },
    {
      name: "Petrol",
      icon: "gas-station",
      gradient: ["#22c55e", "#16a34a"],
    },
    {
      name: "Clothes",
      icon: "shirt",
      gradient: ["#a855f7", "#9333ea"],
    },
    {
      name: "Rent",
      icon: "home",
      gradient: ["#ef4444", "#dc2626"],
    },
    {
      name: "Groceries",
      icon: "basket",
      gradient: ["#14b8a6", "#0d9488"],
    },
  ];

  const getIconComponent = (iconName: string) => {
    if (iconName === "gas-station") {
      return <MaterialCommunityIcons name="gas-station" size={20} color="white" />;
    }
    return <Ionicons name={iconName as any} size={20} color="white" />;
  };

  return (
    <View style={{ width: '100%', height: 444, paddingVertical: 16 }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '400',
        color: '#1f2937',
        marginBottom: 16,
        marginLeft: 16,
        marginTop: 16,
        fontFamily: 'System'
      }}>
        Categories
      </Text>

      <View style={{ 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: 16, 
        paddingHorizontal: 16 
      }}>
        {categories.map((category, index) => (
          <TouchableOpacity 
            key={`category-${index}`} 
            activeOpacity={0.7}
            style={{
              width: '47%',
              height: 112,
              backgroundColor: category.gradient[0],
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
              padding: 16,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <View style={{
              width: 48,
              height: 48,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12
            }}>
              {getIconComponent(category.icon)}
            </View>
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: 'white',
              textAlign: 'center',
              fontFamily: 'System'
            }}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
