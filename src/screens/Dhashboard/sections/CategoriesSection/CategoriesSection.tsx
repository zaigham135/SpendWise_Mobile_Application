import React, { JSX, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const CategoriesSection = (): JSX.Element => {
  const [selectedPeriod, setSelectedPeriod] = useState("15days");

  // Time period options data
  const timePeriods = [
    { value: "15days", label: "15 Days" },
    { value: "1month", label: "1 Month" },
    { value: "2months", label: "2 Months" },
    { value: "custom", label: "Custom" },
  ];

  // Chart data - simplified for React Native
  const chartData = [
    { date: "Jun 4", value: 1200 },
    { date: "Jun 6", value: 1800 },
    { date: "Jun 8", value: 1400 },
    { date: "Jun 10", value: 2200 },
    { date: "Jun 12", value: 1600 },
    { date: "Jun 14", value: 2800 },
    { date: "Jun 16", value: 2000 },
    { date: "Jun 18", value: 2400 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));

  return (
    <View style={{ width: '100%', paddingVertical: 16 }}>
      <View style={{ marginBottom: 16, paddingHorizontal: 16 }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '400',
          color: '#1f2937',
          lineHeight: 28,
          fontFamily: 'System'
        }}>
          Expense Trends
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {timePeriods.map((period) => (
              <TouchableOpacity
                key={period.value}
                onPress={() => setSelectedPeriod(period.value)}
                style={{
                  height: 36,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor: period.value === selectedPeriod ? '#2563eb' : '#e5e7eb',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: period.value === selectedPeriod ? 'white' : '#4b5563',
                  fontFamily: 'System'
                }}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
          padding: 16,
          overflow: 'hidden'
        }}>
          <View style={{ width: '100%', height: 200 }}>
            {/* Chart container */}
            <View style={{ width: '100%', height: 200, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: '100%', height: 200, position: 'relative' }}>
                {/* Y-axis labels */}
                <View style={{ position: 'absolute', left: 0, top: 0, width: 30, height: 200 }}>
                  <Text style={{ position: 'absolute', top: 0, right: 0, fontSize: 11, color: '#6b7280', fontFamily: 'System' }}>3k</Text>
                  <Text style={{ position: 'absolute', top: 43, right: 0, fontSize: 11, color: '#6b7280', fontFamily: 'System' }}>2k</Text>
                  <Text style={{ position: 'absolute', top: 85, right: 0, fontSize: 11, color: '#6b7280', fontFamily: 'System' }}>1k</Text>
                  <Text style={{ position: 'absolute', top: 128, right: 0, fontSize: 11, color: '#6b7280', fontFamily: 'System' }}>0</Text>
                </View>

                {/* Chart bars */}
                <View style={{ 
                  position: 'absolute', 
                  left: 40, 
                  top: 20, 
                  right: 20, 
                  bottom: 40, 
                  flexDirection: 'row', 
                  alignItems: 'flex-end', 
                  justifyContent: 'space-between' 
                }}>
                  {chartData.map((data, index) => {
                    const height = ((data.value - minValue) / (maxValue - minValue)) * 120;
                    return (
                      <View key={index} style={{ alignItems: 'center' }}>
                        <View style={{
                          width: 20,
                          height: height,
                          backgroundColor: '#3b82f6',
                          borderRadius: 2
                        }} />
                        <Text style={{
                          marginTop: 8,
                          fontSize: 11,
                          color: '#6b7280',
                          transform: [{ rotate: '-45deg' }],
                          fontFamily: 'System'
                        }}>
                          {data.date}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
