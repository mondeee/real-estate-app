import {
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';


import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen'


const AppNavigator = createAppContainer(
  createSwitchNavigator(
    {
      Login: LoginScreen,
      Register: RegisterScreen,
      // Auth: AuthStack,
      // Main: HomeStack,
    },
    {
      headerMode: 'none',
      // initialRouteName: 'Register'
    }
  )
);

export default AppNavigator;