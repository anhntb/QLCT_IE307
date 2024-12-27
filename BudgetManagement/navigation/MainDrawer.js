import * as React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { FontAwesome } from "@expo/vector-icons";
import { View, Image, StyleSheet } from 'react-native';
import WalletsScreen from '../screens/Wallets/WalletsScreen';
import OverviewScreen from '../screens/Overview/OverviewScreen';
import TransactionScreen from '../screens/TransactionScreen';
import UserProfile from '../screens/UserProfile';
import HomeScreen from '../screens/HomeScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import AddIncomeScreen from '../screens/AddIncomeScreen';
import FilterTransactionsScreen from '../screens/FilterTransactionsScreen';
const Drawer = createDrawerNavigator();


const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      {/* Logo ở trên cùng */}
      <View style={styles.logoContainer}>
        <View style={styles.logoDecoration}>
        </View>
        <Image
          source={require('../assets/logo.png')} // Đường dẫn logo
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      {/* Các màn hình trong Drawer */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const MainDrawer = () => {
    return(
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: 280,
          backgroundColor: '#fff', // Nền của Drawer
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "500", // Trọng lượng chữ trung bình
          paddingLeft: 3, // Điều chỉnh để label thẳng hàng với icon
        },
        drawerItemStyle: {
          paddingVertical: 3, // Khoảng cách giữa các mục
        },
        headerStyle:{
          backgroundColor: "#26A071",
        },
        headerTintColor: "white",  // Màu chữ của Header
        drawerInactiveTintColor: '#26A071', // Màu chữ của mục không được chọn
        drawerActiveTintColor: 'white', // Màu chữ của mục được chọn (active item)
        drawerActiveBackgroundColor: '#26A071', // Màu nền của mục được chọn (active item)
      }}
    >

      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          drawerLabel: "Trang chủ",
          headerTitle: "Trang chủ",
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
          drawerLabel: "Ví của tôi",
          headerTitle: "Ví của tôi",
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
          drawerLabel: "Các giao dịch",
          headerTitle: "Các giao dịch",
        }}
      />
      <Drawer.Screen
        name="Overview"
        component={OverviewScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="bar-chart" size={size} color={color} />
          ),
          drawerLabel: "Sơ lược",
          headerTitle: "Sơ lược",
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
          drawerLabel: "Trang cá nhân",
          headerTitle: "Trang cá nhân",
        }}
      />
      <Drawer.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{
          drawerItemStyle: { display: "none" },
          drawerLabel: "Thêm chi tiêu",
          headerTitle: "Thêm chi tiêu",
        }}
      />
      <Drawer.Screen
        name="AddIncome"
        component={AddIncomeScreen}
        options={{
          drawerItemStyle: { display: "none" },
          drawerLabel: "Thêm thu nhập",
          headerTitle: "Thêm thu nhập",

        }}
      />
      <Drawer.Screen
        name="FilterTransaction"
        component={FilterTransactionsScreen}
        options={{
          drawerItemStyle: { display: "none" },
          drawerLabel: "Lọc giao dịch",
          headerTitle: "Lọc giao dịch",

        }}
      />
    </Drawer.Navigator>
    )
}

export default MainDrawer;

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoDecoration:{
    backgroundColor: "#26A071",
    position: "absolute",
    width: "120%",
    height: 120,
    top: -40,
  },
  logo: {
    width: 150,
    height: 150,
  },
});