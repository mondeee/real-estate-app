import {
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import SplashScreen from '../screens/SplashScreen';
import AuthStack from './AuthStack'
import MainStack from './MainStack'


const AppNavigator = createAppContainer(
  createSwitchNavigator(
    {
      Splash: SplashScreen,
      Auth: AuthStack,
      Home: MainStack,
    },
    {
      headerMode: 'none',
      initialRouteName: 'Splash'
    }
  )
);

export default AppNavigator;