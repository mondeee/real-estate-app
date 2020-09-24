import React, { useEffect } from 'react';
import {
  createAppContainer,
  createSwitchNavigator,
  // createDrawerNavigator
} from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, } from 'react-navigation-drawer';
import { fromRight } from 'react-navigation-transitions';
import SideBar from '../components/SideBar';
import HomeBottomBar from './NavBarStack';
import BottomTabBar from '../components/BottomTabBar';
import ContactScreen from '../screens/ContactScreen';
import MyPropertyDetailsScreen from '../screens/MyPropertyDetailsScreen';
import FAQScreen from '../screens/FAQScreen';
import TermsAndAgreementScreen from '../screens/TermsAndAgreementScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import AddPropertyScreen from '../screens/AddPropertyScreen';
import AddSectionScreen from '../screens/AddSectionScreen';
import SectionListScreen from '../screens/SectionListScreen';
import ChatScreen from '../screens/ChatScreen';
import SectionDetailsScreen from '../screens/SectionDetailsScreen';
import UpdatePropertyScreen from '../screens/UpdatePropertyScreen';
import UpdateSectionScreen from '../screens/UpdateSectionScreen';


export const PropertyStack = createStackNavigator(
  {
    PropertyDetails: MyPropertyDetailsScreen,
    SectionDetails: SectionDetailsScreen,
    SectionList: SectionListScreen,
    UpdateProperty: UpdatePropertyScreen,
    UpdateSection: UpdateSectionScreen,
    UpdateAndAddSection: AddSectionScreen,
  },
  {
    headerMode: 'none',
  }
)

const AppNavigator = createAppContainer(
  createDrawerNavigator(
    {
      HomeBottomBar,
      Contact: ContactScreen,
      // Property: PropertyStack,
      // SectionDetails: SectionDetailsScreen,
      // SectionList: SectionListScreen,
      FAQ: FAQScreen,
      Terms: TermsAndAgreementScreen,
      Subs: SubscriptionScreen,
      // UpdateProperty: UpdatePropertyScreen
      // EditProfile: EditProfileScreen,
      // Auth: AuthStack,
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