import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import WalletsScreen from '../screens/Wallets/WalletsScreen';
import OverviewScreen from '../screens/OverviewScreen';
import TransactionScreen from '../screens/TransactionScreen';
import UserProfile from '../screens/UserProfile';

const Drawer = createDrawerNavigator();

const MainDrawer = () => {
    return(
        <Drawer.Navigator initialRouteName="Wallet">
            <Drawer.Screen name="Wallet" component={WalletsScreen} />
            <Drawer.Screen name="Transaction" component={TransactionScreen} />
            <Drawer.Screen name="Overview" component={OverviewScreen} />
            <Drawer.Screen name="User" component={UserProfile} />
        </Drawer.Navigator>
    )
}

export default MainDrawer;
