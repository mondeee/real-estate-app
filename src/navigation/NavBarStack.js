import React, { useEffect } from 'react';
import { AsyncStorage } from 'react-native'
import {
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { fromRight } from 'react-navigation-transitions';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen'
import MessagesScreen from '../screens/MessagesScreen'
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import SideBar from '../components/SideBar';
import BottomTabBar from '../components/BottomTabBar';
import NotificationScreen from '../screens/NotificationScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import AddPropertyScreen from '../screens/AddPropertyScreen';
import AddSectionScreen from '../screens/AddSectionScreen';

const AddStack = createStackNavigator(
  {
    AddProperty: AddPropertyScreen,
    AddSection: AddSectionScreen,
  },
  {
    headerMode: 'none',
    transitionConfig: () => fromRight()
  }
)

const ProfileStack = createStackNavigator(
  {
    Profile: ProfileScreen,
    EditProfile: EditProfileScreen,
  },
  {
    headerMode: 'none',
    transitionConfig: () => fromRight()
  }
)

const HomeBottomBar = createAppContainer(
  createBottomTabNavigator(
    {
      Home: HomeScreen,
      Messages: MessagesScreen,
      Add:
      {
        screen: AddStack,
        navigationOptions: () => {
          return {
            tabBarVisible: false,
          };
        }
      },
      Favorites: NotificationScreen,
      Profile: ProfileStack,
      // EditProfile: {
      //   screen: EditProfileScreen,
      //   navigationOptions: () => {
      //     return {
      //       tabBarVisible: false,
      //     };
      //   }
      // }
    },
    {
      tabBarComponent: BottomTabBar,
    },
    {
      headerMode: 'none',
      initialRouteName: 'Home',
      drawerPosition: 'right',
      contentComponent: async ({ navigation }) => {

        const token = await AsyncStorage.getItem('token')
        console.log('asldkajsdlk', token)
        return <SideBar {...navigation} />
      }
    }
  )
);



export default HomeBottomBar;