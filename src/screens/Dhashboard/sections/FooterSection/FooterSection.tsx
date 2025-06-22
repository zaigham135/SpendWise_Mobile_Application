import React, { JSX } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export const FooterSection = ({ state, descriptors, navigation }: BottomTabBarProps): JSX.Element => {
  const navItems = [
    { icon: "home", label: "Dashboard", route: 'Dashboard' },
    { icon: "document-text", label: "Transactions", route: 'Transactions' },
    { icon: "add", label: "AddProduct", isAdd: true,route:'AddProduct' },
    { icon: "bar-chart", label: "Reports", route: 'Reports' },
    { icon: "person", label: "Profile", route: 'Profile' },
  ];

  return (
    <View style={styles.footerContainer}>
      <View style={styles.row}>
        {navItems.map((item, index) => (
          <View key={index} style={styles.itemWrapper}>
            {item.isAdd ? (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.addButton}
                onPress={() => navigation.navigate(item.route)}
              >
                <Ionicons name={item.icon as any} size={24} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.iconButton}
                onPress={() => {
                  if (item.route) navigation.navigate(item.route);
                }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={state.routeNames[state.index] === item.route ? '#37474F' : '#9ca3af'}
                />
                {item.label ? (
                  <Text
                    style={[
                      styles.label,
                      {
                        color: state.routeNames[state.index] === item.route ? '#37474F' : '#9ca3af',
                        fontWeight: state.routeNames[state.index] === item.route ? '900' : '500',
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                ) : null}
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    height: 81,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 16 : 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    zIndex: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    height: 64,
    marginHorizontal: '5%',
  },
  itemWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 46,
    height: 46,
    backgroundColor: '#37474F',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'System',
  },
});
