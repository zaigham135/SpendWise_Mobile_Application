import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Category {
  id: string;
  name: string;
  icon: string;
  amount: string;
  iconColor: string;
}

const categories: Category[] = [
  { id: '1', name: 'Travel', icon: 'cart', amount: '$1,234', iconColor: '#3b82f6' },
  { id: '2', name: 'Food', icon: 'restaurant', amount: '$567', iconColor: '#f97316' },
  { id: '3', name: 'Petrol', icon: 'gas-station', amount: '$890', iconColor: '#10b981' },
  { id: '4', name: 'Clothes', icon: 'shirt', amount: '$345', iconColor: '#8b5cf6' },
  { id: '5', name: 'Rent', icon: 'home', amount: '$678', iconColor: '#ef4444' },
  { id: '6', name: 'Groceries', icon: 'basket', amount: '$123', iconColor: '#06b6d4' },
];

export default function CategoriesSection() {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
      <Text style={{ 
        fontSize: 18, 
        fontWeight: '500', 
        color: '#1f2937', 
        marginBottom: 16 
      }}>
        Categories
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={{
              width: '31%',
              marginBottom: 16,
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 14,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
            activeOpacity={0.9}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              {category.name.toLowerCase() === 'petrol' ? (
                <MaterialCommunityIcons name="gas-station" size={26} color={category.iconColor} />
              ) : (
                <Ionicons name={category.icon as any} size={26} color={category.iconColor} />
              )}
              <Text style={{ fontWeight: 'bold', fontSize: 13, color: '#222', opacity: 0.85 }}>{category.amount}</Text>
            </View>
            <Text style={{ fontSize: 12, color: '#888', fontWeight: '500', marginTop: 18 }}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
