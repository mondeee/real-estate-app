import React, { useEffect } from 'react';
import {
  createAppContainer,
  createSwitchNavigator,
  // createDrawerNavigator
} from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';

import { createDrawerNavigator } from 'react-navigation-drawer';
import SideBar from '../components/SideBar';
import HomeBottomBar from './NavBarStack';
import BottomTabBar from '../components/BottomTabBar';

const AppNavigator = createAppContainer(
  createDrawerNavigator(
    {
      HomeBottomBar,
      // Auth: AuthStack,
      // Main: HomeStack,
    },
    {
      headerMode: 'none',
      // initialRouteName: 'Home',
      drawerPosition: 'right',
      contentComponent: ({ navigation }) => <SideBar {...navigation} />
    }
  )
);



export default AppNavigator;