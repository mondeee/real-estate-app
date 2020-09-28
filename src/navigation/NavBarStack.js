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
import ChatScreen from '../screens/ChatScreen';
import { PropertyStack } from './MainStack';
import MyPropertyDetailsScreen from '../screens/MyPropertyDetailsScreen';
import SectionDetailsScreen from '../screens/SectionDetailsScreen';
import UpdatePropertyScreen from '../screens/UpdatePropertyScreen';
import UpdateSectionScreen from '../screens/UpdateSectionScreen';
import SectionListScreen from '../screens/SectionListScreen';

const AddStack = createStackNavigator(
  {
    AddProperty: AddPropertyScreen,
    AddSection: AddSectionScreen,
  },
  {
    headerMode: 'none',
    // unmountInactiveRoutes: true,
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

const ChatStack = createStackNavigator(
  {
    ChatList: MessagesScreen,
    Chat: {
      screen: ChatScreen,
      navigationOptions: () => {
        return {
          tabBarVisible: false,
        };
      }
    },
  },
  {
    headerMode: 'none',
  }
)

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  PropertyDetails: MyPropertyDetailsScreen,
  SectionDetails: SectionDetailsScreen,
  SectionList: SectionListScreen,
  UpdateProperty: UpdatePropertyScreen,
  UpdateSection: UpdateSectionScreen,
  UpdateAndAddSection: AddSectionScreen,
  // ...PropertyStack
},
  {
    headerMode: 'none',
  }
)


const HomeBottomBar = createAppContainer(
  createBottomTabNavigator(
    {
      Home: HomeStack,
      Messages: ChatStack,
      Add:
      {
        screen: AddStack,
        navigationOptions: () => {
          return {
            tabBarVisible: false,
          };
        },
        unmountInactiveRoutes: true,
      },
      // UpdateProperty: UpdatePropertyScreen,
      Favorites: NotificationScreen,
      Profile: ProfileStack,
    },
    {
      tabBarComponent: BottomTabBar,
    },
    {
      headerMode: 'none',
      // backBehavior: 'none',
      // initialRouteName: 'Home',
      drawerPosition: 'right',
      contentComponent: async ({ navigation }) => {
        const token = await AsyncStorage.getItem('token')
        console.log('asldkajsdlk', token)
        return <SideBar {...navigation} />
      },
    }
  )
);

// HomeBottomBar.navigationOptions = ({ navigation }) => {
//   let tabBarVisible = true
//   if (navigation.state.routes.length > 1) {
//     navigation.state.routes.map(route => {
//       console.log('@ROUTE', route.routeName)
//       if (route.routeName === "Chat") {
//         tabBarVisible = false;
//       }
//     });
//   }

//   return {
//     tabBarVisible
//   }
// }



export default HomeBottomBar;