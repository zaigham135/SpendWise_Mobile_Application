import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dhashboard } from '../../screens/Dhashboard/Dhashboard';
import Profile from '../../screens/profile/profile';
import { FooterSection } from '../../screens/Dhashboard/sections/FooterSection/FooterSection';
import AddProduct from '../../screens/add_product/addproduct';
import TransactionScreen from '../../screens/transaction/transaction';
import EditTransaction from '../../screens/transaction/editTransaction/editTransaction';
import LoginScreen from '../../screens/login/login';
import EditProfile from '../../screens/login/editUserDetails/editProfile';
const Tab = createBottomTabNavigator();

export default function AppTabs({setIsLoggedIn}) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        
      }}
      tabBar={props => <FooterSection {...props} />}
    >
      <Tab.Screen name="Dashboard" component={Dhashboard} />
      <Tab.Screen name="AddProduct" component={AddProduct} />
      <Tab.Screen name="Transactions" component={TransactionScreen} />
      <Tab.Screen name="EditTransaction" component={EditTransaction} />
     <Tab.Screen name="EditProfile" component={EditProfile} />
      <Tab.Screen
        name="Profile"
        children={(props) => <Profile {...props} setIsLoggedIn={setIsLoggedIn} />}
      />
    </Tab.Navigator>
  );
}