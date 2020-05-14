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
import ContactScreen from '../screens/ContactScreen';
import MyPropertyDetailsScreen from '../screens/MyPropertyDetailsScreen';
import FAQScreen from '../screens/FAQScreen';
import TermsAndAgreementScreen from '../screens/TermsAndAgreementScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const AppNavigator = createAppContainer(
  createDrawerNavigator(
    {
      HomeBottomBar,
      Contact: ContactScreen,
      PropertyDetails: MyPropertyDetailsScreen,
      FAQ: FAQScreen,
      Terms: TermsAndAgreementScreen,
      Subs: SubscriptionScreen,
      EditProfile: EditProfileScreen,
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