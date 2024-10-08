import {
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';


import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen'
import TermsAndAgreementScreen from '../screens/TermsAndAgreementScreen';
import MainStack from './MainStack'
import { createStackNavigator } from 'react-navigation-stack';


const AppNavigator = createAppContainer(
  createStackNavigator(
    {
      // Home: MainStack,
      Login: LoginScreen,
      Register: RegisterScreen,
      Terms_: TermsAndAgreementScreen,
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