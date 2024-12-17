// import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import MainDrawer from './navigation/MainDrawer';
import WalletsScreen from './screens/Wallets/WalletsScreen';
// const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <MainDrawer/>
    </NavigationContainer>
  );
};

export default App;
