import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FontAwesome } from "@expo/vector-icons";

import WalletsScreen from '../screens/Wallets/WalletsScreen';
import OverviewScreen from '../screens/Overview/OverviewScreen';
import TransactionScreen from '../screens/TransactionScreen';
import UserProfile from '../screens/UserProfile';
import HomeScreen from '../screens/HomeScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import AddIncomeScreen from '../screens/AddIncomeScreen';
const Drawer = createDrawerNavigator();

const MainDrawer = () => {
    return(
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fff', // Nền của Drawer
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "500", // Trọng lượng chữ trung bình
          marginLeft: 3, // Điều chỉnh để label thẳng hàng với icon
        },
        drawerItemStyle: {
          marginVertical: 3, // Khoảng cách giữa các mục
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          drawerLabelStyle: {
            fontSize: 20, // Tăng cỡ chữ
            fontWeight: "bold", // Đậm chữ
            marginLeft: 4,
          },

          drawerItemStyle: {
            marginVertical: 5, // Khoảng cách giữa các mục
            borderBottomWidth: 1,
            borderBottomColor: "#f0f0f0",
          },
        }}
      />
      <Drawer.Screen
        name="Wallets"
        component={WalletsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="money" size={size} color={color} />
          ),
          drawerItemStyle: {
          },
        }}
      />
      <Drawer.Screen
        name="Transaction"
        component={TransactionScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="bars" size={size} color={color} />
          ),
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: "500", // Trọng lượng chữ trung bình
            marginLeft: 8, // Điều chỉnh để label thẳng hàng với icon
          },
        }}
      />
      <Drawer.Screen
        name="Overview"
        component={OverviewScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="User"
        component={UserProfile}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} marginLeft={3}/>
          ),
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: "500", // Trọng lượng chữ trung bình
            marginLeft: 12, // Điều chỉnh để label thẳng hàng với icon
          },
        }}
      />
      <Drawer.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="AddIncome"
        component={AddIncomeScreen}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer.Navigator>
    )
}

export default MainDrawer;
