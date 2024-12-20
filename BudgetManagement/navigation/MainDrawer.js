import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
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
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Wallets" component={WalletsScreen} />
            <Drawer.Screen name="Transaction" component={TransactionScreen} />
            <Drawer.Screen name="Overview" component={OverviewScreen} />
            <Drawer.Screen name="User" component={UserProfile} />
            <Drawer.Screen name="AddExpense" component={AddExpenseScreen}  options={{ drawerItemStyle: { display: 'none' } }}/>
            <Drawer.Screen name="AddIncome" component={AddIncomeScreen}  options={{ drawerItemStyle: { display: 'none' } }}/>
        </Drawer.Navigator>
    )
}

export default MainDrawer;
