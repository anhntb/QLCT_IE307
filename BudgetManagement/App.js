import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import MainDrawer from './navigation/MainDrawer';
import WalletsScreen from './screens/Wallets/WalletsScreen';
import { initializeDatabase } from './db/db';
import { WalletProvider } from './context/WalletContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import AuthStack from './navigation/AuthStack';
import AddExpenseScreen from './screens/AddExpenseScreen';
import AddIncomeScreen from './screens/AddIncomeScreen';

const AppNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainDrawer /> : <AuthStack />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <WalletProvider>
        <AppNavigator />
      </WalletProvider>
    </AuthProvider>

  );
};

export default App;

// const App = () => {
//   initializeDatabase();
//   return (
//     <WalletProvider>
//       <NavigationContainer>
//         <MainDrawer/>
//       </NavigationContainer>
//     </WalletProvider>
//   );
// };

// export default App;
