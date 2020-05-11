import React, { useEffect } from 'react';
import { AsyncStorage } from 'react-native'
import {
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen'
import MessagesScreen from '../screens/MessagesScreen'
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import SideBar from '../components/SideBar';
import BottomTabBar from '../components/BottomTabBar';
import NotificationScreen from '../screens/NotificationScreen';

const HomeBottomBar = createAppContainer(
  createBottomTabNavigator(
    {
      Home: HomeScreen,
      Messages: MessagesScreen,
      Add: HomeScreen,
      Favorites: NotificationScreen,
      Profile: ProfileScreen,
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