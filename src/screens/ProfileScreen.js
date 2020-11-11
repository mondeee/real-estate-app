import React, { useEffect, useState } from 'react';
import {
  AsyncStorage,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  I18nManager
} from 'react-native';

import BottomTabBar from '../components/BottomTabBar'
import Header from '../components/Header';
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts';
import { SafeAreaView } from 'react-navigation';
import { CONFIG } from '../services/config';
import { useStoreState } from 'easy-peasy';

const isAndroid = Platform.OS === 'android' && I18nManager?.isRTL;

export default function ProfileScreen(props) {
  const { navigate, goBack } = props.navigation
  const [isLogin, setLogin] = useState(false)
  const userData = useStoreState(state => state.auth.user)

  useEffect(() => {
    console.log('@userdata', userData)
    getToken()
  }, [])

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token')
    console.log('token', token != null, token)
    setLogin(token != null)
  }

  const renderLogin = () => {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigate('Login')} style={styles.itemContainer}>
          <Text style={styles.itemText}>{`Login`}</Text>
          <Image style={{ height: 16, width: 16 }} source={require('../../assets/usericon.png')} />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => navigate('BookingList')} style={styles.itemContainer}>
          <Text style={styles.itemText}>{`Booking list`}</Text>
          <Image style={{ height: 16, width: 16 }} source={require('../../assets/subicon.png')} />
        </TouchableOpacity> */}
      </View>
    )
  }

  const renderLists = () => {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigate('EditProfile')} style={styles.itemContainer}>
          <Text style={styles.itemText}>{`الملف الشخصي `}</Text>
          <Image style={{ height: 16, width: 16 }} source={require('../../assets/usericon.png')} />
        </TouchableOpacity>
        {userData?.is_subscription && <TouchableOpacity onPress={() => navigate('Subs')} style={styles.itemContainer}>
          <Text style={styles.itemText}>{`الاشتراكات`}</Text>
          <Image style={{ height: 16, width: 16 }} source={require('../../assets/subicon.png')} />
        </TouchableOpacity>}
        <TouchableOpacity onPress={() => navigate('BookingList')} style={styles.itemContainer}>
          <Text style={styles.itemText}>{`حجوزاتي`}</Text>
          {/* <Text style={styles.itemText}>{`Build Version ${CONFIG.BUILD_VERSION}`}</Text> */}
          {/* <Image style={{ height: 16, width: 16 }} source={require('../../assets/subicon.png')} /> */}
        </TouchableOpacity>
        <Text style={styles.itemText}>{`Build Version ${CONFIG.BUILD_VERSION}`}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      {isLogin ? renderLists() : renderLogin()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    padding: 24,
    // justifyContent: 'center',
  },
  itemContainer: {
    borderBottomColor: Colors.gray,
    width: '100%',
    borderBottomWidth: 1,
    flexDirection: isAndroid ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    margin: 8,
    padding: 8,
  },
  itemText: {
    ...Fonts.FontMed,
    height: '100%',
    marginRight: 12,
    textAlignVertical: 'center',
    fontSize: 17
  }
});
