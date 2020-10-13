import React, { useEffect, useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage
} from 'react-native';
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts';
import Button from './Button';
import { CONFIG } from '../services/config';
import { useStoreActions, useStoreState } from 'easy-peasy';

const navList = [
  { label: 'تسجيل الدخول', key: 0, route: 'Register' },
  { label: ' ﻣﻦ نحن ', key: 1, route: '' },
  { label: 'الشروط والأحكام \n وسياسة الخصوصية', key: 2, route: 'BookingList' },
  { label: 'الأسئلة الشائعة', key: 3, route: 'FAQ' },
  { label: 'ﺃأعطنا رأﻳﻚ ﻋﻦ اﻟﺘﻄﺒﻴﻖ', key: 4, route: 'Terms' },
  { label: 'تواصل معنا', key: 5, route: 'Contact' },
  { label: CONFIG.BUILD_VERSION, key: 6, route: '' }
]

export default function SideBar(props) {
  // const { navigate } = props.navigation
  const [isLogin, setLogin] = useState(false)
  const userData = useStoreState(state => state.auth.user)
  const storeUser = useStoreActions(actions => actions.auth.setUser)
  const fetchToken = async () => {
    const token = await AsyncStorage.getItem('token')
    if (token && token.length > 0) {
      console.log(token)
      setLogin(true)
    }
  }

  const deleteToken = async () => {
    await AsyncStorage.removeItem('token')
    await storeUser(null)
    setLogin(false)
    props.navigate('Login')
  }

  useEffect(() => {
    if (!userData) {
      setLogin(false)
    }
  }, [userData])

  useEffect(() => {
    fetchToken()
  }, [])


  renderFooter = () => {
    return (
      <View style={{ alignSelf: 'flex-end', alignItems: 'center', width: '100%', flex: .5 }}>
        <Text style={{ ...Fonts.FontMed, fontSize: 14, color: Colors.primaryBlue }}>{`ﻧﻔﺬ ﺑﻮاﺳﻄﺔ`}</Text>
        <Image style={{ height: 33, width: 83 }} resizeMode={'contain'} source={require('../../assets/sidebar_footer.png')} />
      </View>
    )
  }

  renderNavList = () => {
    return (
      <View style={{ width: '100%', paddingHorizontal: 20, paddingTop: 20 }}>
        {navList && navList.map((i, index) => {
          if (isLogin && index == 0) return null
          return (
            <TouchableOpacity
              key={i.key}
              onPress={() => props.navigate(i.route)}
            >
              <Text
                style={{
                  paddingVertical: 13,
                  alignSelf: 'flex-end',
                  color: Colors.primaryBlue,
                  fontSize: 16,
                  textAlign: 'right',
                  ...Fonts.fontRegular
                }} key={i.key}>{i.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  return (
    <View style={{ ...styles.container, paddingBottom: 40 }}>
      <View style={{ backgroundColor: Colors.primaryBlue, flex: 1.1 }} />
      <View style={{ ...styles.container, flex: 2.4, alignItems: 'center', paddingHorizontal: 12, }}>
        <View style={{ height: '15%' }} />
        <Text style={{
          color: Colors.primaryBlue,
          fontSize: 21,
          ...Fonts.fontBold,
        }}>{`تطبيق نزل`}</Text>
        {renderNavList()}
        {isLogin && <Button onPress={() => deleteToken()} text={`تسجيل خروج`} />}
      </View>
      <Image style={styles.logoContainer} source={require('../../assets/sidebar_logo.png')} />
      {renderFooter()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  logoContainer: {
    height: 118,
    width: 118,
    borderRadius: 30,
    // backgroundColor: 'white',
    position: 'absolute',
    top: '20%',
    left: '29%',

  }
});
