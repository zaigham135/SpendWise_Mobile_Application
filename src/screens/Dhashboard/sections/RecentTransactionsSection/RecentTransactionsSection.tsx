import React, { JSX } from "react";
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export const RecentTransactionsSection = (): JSX.Element => {
  // Transaction data for mapping
  const transactions = [
    {
      id: 1,
      name: "Uber Ride",
      date: "June 18, 2025",
      amount: "-₹350",
      icon: "car",
      bgColor: "#dbeafe",
    },
    {
      id: 2,
      name: "Dinner",
      date: "June 17, 2025",
      amount: "-₹850",
      icon: "restaurant",
      bgColor: "#fed7aa",
    },
    {
      id: 3,
      name: "Fuel",
      date: "June 16, 2025",
      amount: "-₹2,500",
      icon: "gas-station",
      bgColor: "#bbf7d0",
    },
    {
      id: 4,
      name: "Groceries",
      date: "June 15, 2025",
      amount: "-₹1,200",
      icon: "basket",
      bgColor: "#99f6e4",
    },
  ];

  const getIconComponent = (iconName: string) => {
    if (iconName === "gas-station") {
      return <MaterialCommunityIcons name="gas-station" size={16} color="#374151" />;
    }
    return <Ionicons name={iconName as any} size={16} color="#374151" />;
  };

  return (
    <View style={{ width: '100%', paddingVertical: 16, paddingHorizontal: 16 }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '400',
        color: '#1f2937',
        marginBottom: 16,
        fontFamily: 'System'
      }}>
        Recent Transactions
      </Text>

      <View style={{ gap: 16 }}>
        {transactions.map((transaction) => (
          <TouchableOpacity key={transaction.id} activeOpacity={0.7}>
            <View style={{
              width: '100%',
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 2,
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: transaction.bgColor,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getIconComponent(transaction.icon)}
                </View>

                <View style={{ marginLeft: 16, flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: '#1f2937',
                    fontFamily: 'System'
                  }}>
                    {transaction.name}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#6b7280',
                    fontFamily: 'System'
                  }}>
                    {transaction.date}
                  </Text>
                </View>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '400',
                  color: '#dc2626',
                  fontFamily: 'System'
                }}>
                  {transaction.amount}
                </Text>
                <View style={{ marginTop: 4, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="trending-down" size={12} color="#dc2626" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
