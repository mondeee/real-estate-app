import React, { useEffect } from 'react';
import { AsyncStorage, I18nManager, Image, Platform, View } from 'react-native'
import {
  createAppContainer,
  createSwitchNavigator,
  StackActions, NavigationActions
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
import Colors from '../styles/Colors';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

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
    Platform.OS === 'android' && I18nManager?.isRTL ?
      {
        Home: {
          screen: HomeStack,
          resetOnBlur: true,
          navigationOptions: {
            resetOnBlur: true,
            tabBarLabel: 'أملاكي',
            tabBarOnPress: ({ navigation, defaultHandler }) => {
              defaultHandler()
            },
            tabBarIcon: props => {
              console.log('@TAB PROPS\n', props)
              return <MaterialIcons color={props.tintColor} size={25} name={'vpn-key'} />
            }
          }
        },
        Favorites: {
          screen: NotificationScreen,
          navigationOptions: {
            resetOnBlur: true,
            tabBarLabel: 'التنبيهات',
            tabBarOnPress: ({ navigation, defaultHandler }) => {
              defaultHandler()
            },
            tabBarIcon: props => {
              return <MaterialCommunityIcons color={props.tintColor} size={25} name={'bell-outline'} />
            }
          }
        },
        Add:
        {
          screen: AddStack,
          navigationOptions: {
            tabBarVisible: false,
            tabBarLabel: () => null,
            tabBarIcon: props => {
              return (
                <View style={{
                  backgroundColor: Colors.primaryBlue,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 40,
                  height: 68,
                  width: 68,
                  marginLeft: global.isAndroid ? 0 : 2,
                  marginRight: global.isAndroid ? 2 : 0,
                  borderRadius: 140,
                }}>
                  <MaterialIcons color={"white"} name="add" size={25} />
                </View>
              )
            }
          },
          unmountInactiveRoutes: true,
        },
        Messages: {
          screen: ChatStack,
          navigationOptions: {
            resetOnBlur: true,
            tabBarLabel: 'المحادثة',
            tabBarOnPress: ({ navigation, defaultHandler }) => {
              defaultHandler()
            },
            tabBarIcon: props => {
              return <Image source={require('../../assets/messageicon.png')} resizeMode={'cover'} style={{ height: 20, width: 20, marginTop: 8, tintColor: props.tintColor }} />
            }
          },
        },
        Profile: {
          screen: ProfileStack,
          navigationOptions: {
            resetOnBlur: true,
            tabBarLabel: 'حسابي',
            tabBarOnPress: ({ navigation, defaultHandler }) => {
              defaultHandler()
            },
            tabBarIcon: props => {
              console.log('@TAB PROPS\n', props)
              return <Image source={require('../../assets/usericon.png')} resizeMode={'cover'} style={{ height: 20, width: 20, marginTop: 8, tintColor: props.tintColor }} />
            }
          },
        },
      } :
      {
        Profile: {
          screen: ProfileStack,
          navigationOptions: {
            resetOnBlur: true,
            tabBarLabel: 'حسابي',
            tabBarOnPress: ({ navigation, defaultHandler }) => {
              defaultHandler()
            },
            tabBarIcon: props => {
              console.log('@TAB PROPS\n', props)
              return <Image source={require('../../assets/usericon.png')} resizeMode={'cover'} style={{ height: 20, width: 20, marginTop: 8, tintColor: props.tintColor }} />
            }
          },
        },
        Messages: {
          screen: ChatStack,
          navigationOptions: {
            resetOnBlur: true,
            tabBarLabel: 'المحادثة',
            tabBarOnPress: ({ navigation, defaultHandler }) => {
              defaultHandler()
            },
            tabBarIcon: props => {
              return <Image source={require('../../assets/messageicon.png')} resizeMode={'cover'} style={{ height: 20, width: 20, marginTop: 8, tintColor: props.tintColor }} />
            }
          },
        },
        Add:
        {
          screen: AddStack,
          navigationOptions: {
            tabBarVisible: false,
            tabBarLabel: () => null,
            tabBarIcon: props => {
              return (
                <View style={{
                  backgroundColor: Colors.primaryBlue,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 40,
                  height: 68,
                  width: 68,
                  marginLeft: global.isAndroid ? 0 : 2,
                  marginRight: global.isAndroid ? 2 : 0,
                  borderRadius: 140,
                }}>
                  <MaterialIcons color={"white"} name="add" size={25} />
                </View>
              )
            }
          },
          unmountInactiveRoutes: true,
        },
        Favorites: {
          screen: NotificationScreen,
          navigationOptions: {
            resetOnBlur: true,
            tabBarLabel: 'التنبيهات',
            tabBarOnPress: ({ navigation, defaultHandler }) => {
              defaultHandler()
            },
            tabBarIcon: props => {
              return <MaterialCommunityIcons color={props.tintColor} size={25} name={'bell-outline'} />
            }
          }
        },
        Home: {
          screen: HomeStack,
          resetOnBlur: true,
          navigationOptions: {
            resetOnBlur: true,
            tabBarLabel: 'أملاكي',
            tabBarOnPress: ({ navigation, defaultHandler }) => {
              defaultHandler()
            },
            tabBarIcon: props => {
              console.log('@TAB PROPS\n', props)
              return <MaterialIcons color={props.tintColor} size={25} name={'vpn-key'} />
            }
          }
        },
      }
    ,
    {
      tabBarComponent: BottomTabBar,
      tabBarOptions: {
        // showLabel: false,
        activeTintColor: Colors.primaryYellow,
        inactiveTintColor: Colors.primaryBlue,
      },
      initialRouteName: 'Home',
      resetOnBlur: true,
    },
    {
      headerMode: 'none',
      resetOnBlur: true,
      drawerPosition: 'right',
      contentComponent: async ({ navigation }) => {
        const token = await AsyncStorage.getItem('token')
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