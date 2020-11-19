import React, { useEffect, useState } from 'react';
import {
  Alert,
  I18nManager,
  StatusBar,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
  Platform,
} from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import Button from '../components/Button';
import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import { useStoreActions } from 'easy-peasy';
import * as Permissions from "expo-permissions";
import * as Location from 'expo-location';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { GET_DISTRICT, GET_SETTINGS, GET_USER_DETAILS } from '../services/graphql/queries';
import * as Notifications from 'expo-notifications';
import * as Updates from "expo-updates";
import * as ImagePicker from 'expo-image-picker';
import { CONFIG } from '../services/config';

const isAndroid = Platform.OS === 'android' && I18nManager?.isRTL;
global.isAndroid = Platform.OS === 'android' && I18nManager?.isRTL;
// global.isAndroid = true
// Alert.alert('RTL ' +  global.isAndroid,
// '@GLOBAL' + global.isAndroid + Platform.OS === 'android', I18nManager?.isRTL
// )

export default function SplashScreen(props) {
  const { navigation: { navigate } } = props
  const [page, setPage] = useState(0)
  const storeNotifToken = useStoreActions(actions => actions.auth.setNotifToken)
  const storeLocation = useStoreActions(actions => actions.auth.setLocation)
  const storeDistricts = useStoreActions(actions => actions.auth.setDistricts)
  const storeSettings = useStoreActions(actions => actions.auth.setSettings)
  const storeUser = useStoreActions(actions => actions.auth.setUser)
  var hasToken = false
  var isTokenValid = false
  const [loading, setLoading] = useState(false)
  const { error, data } = useQuery(GET_DISTRICT)
  const { data: settings_data } = useQuery(GET_SETTINGS)
  const [fetchUser, { data: userdata, error: userError, loading: userLoading }] = useLazyQuery(GET_USER_DETAILS)

  // const toggleRTL = async () => {
  //   setLoading(true)
  //   const isRTLAndroid = Platform.OS === 'android' && I18nManager?.isRTL;
  //   if (isRTLAndroid) {
  //     Alert.alert('Android RTL is detected', 'The App will need restart after you press the button',
  //       [
  //         {
  //           text: "OK",
  //           onPress: async () => {
  //             await I18nManager.allowRTL(false)
  //             await I18nManager.forceRTL(false)
  //             await Updates.reloadAsync()
  //             setLoading(false)
  //           },
  //           style: "cancel"
  //         }
  //       ],
  //     )
  //   }
  // }

  useEffect(() => {
    if (settings_data) {
      storeSettings(settings_data.allSettings)
    }

  }, [settings_data])

  useEffect(() => {
    console.log(userError, '\n', userdata)
    if (userError) {
      isTokenValid = false
    }

    if (userdata) {
      isTokenValid = true
    }
  }, [userdata, userError])

  const fetchToken = async () => {
    const token = await AsyncStorage.getItem('token')
    if (token && token?.length > 0) {
      hasToken = true
      fetchUser()
    }
  }

  const setUpNotif = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      console.log('NOTIF ERROR PERMISSION', status)
      return;
    }
    const token = await Notifications.getExpoPushTokenAsync();
    console.log('@token', token)
    storeNotifToken(token)
    notifsub = Notifications.addListener(onReceiveNotif)
  }

  const setupCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status === 'granted') {
      // alert('Sorry, we need camera roll permissions to make this work!');

    } else {
      alert('يرجى إعطاء الأذن للدخول للصور من الإعدادات')
    }
  }


  const setUpLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        text: `لم يتم منح إذن الحصول على معلومات موقعك  `,
        type: 'danger'
      })
    }

    const location = await Location.getCurrentPositionAsync();
    const geores = await Location.reverseGeocodeAsync(
      {
        latitude: Number(location.coords.latitude),
        longitude: Number(location.coords.longitude)
      }
    )
    const geoloc = geores[0]
    const locname = !geoloc.city || !geoloc.country ? `${geoloc.name}, ${geoloc.region}` : `${geoloc.city}, ${geoloc.country}`
    const locdata = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      location: locname
    }
    storeLocation(locdata)
  }

  useEffect(() => {
    setUpLocation()
    setUpNotif()
    // setupCameraPermission()
    fetchToken()
    // fetchToken()
    //   Alert.alert('Android RTL is detected', 'The App will need restart after you press the button',
    //   [
    //     {
    //       text: "OK",
    //       onPress: async () => {
    //         await I18nManager.allowRTL(false)
    //         await I18nManager.forceRTL(false)
    //         await Updates.reloadAsync()
    //         setLoading(false)
    //       },
    //       style: "cancel"
    //     }
    //   ],
    // )
  }, [])

  useEffect(() => {
    if (data && data?.allDistrict) {
      const items = [...data.allDistrict]
      items.forEach(i => {
        i.key = i.id
        i.label = i.ar
      })
      storeDistricts(items)
    }
  }, [error, data])

  renderSkipButton = () => {
    if (userLoading || loading) {
      return <ActivityIndicator color={Colors.primaryBlue} />
    }
    return (
      <Button
        onPress={async () => {
          setupCameraPermission()
          if (isTokenValid) {
            navigate('Home')
          } else {
            navigate('Login')
          }
        }}
        text={`ابدأ`}
        style={{ width: 177 }}
        textStyle={{ fontFamily: 'tajawal_med' }}
      />
    )
  }

  renderIndicator = () => {
    return (
      <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignSelf: 'center', padding: 24, paddingTop: 0, alignContent: 'center', justifyContent: 'center' }}>
        <View style={{ ...styles.indicatorStyle, backgroundColor: page == 2 ? Colors.primaryYellow : Colors.gray }} />
        <View style={{ ...styles.indicatorStyle, marginHorizontal: 4, backgroundColor: page == 1 ? Colors.primaryYellow : Colors.gray }} />
        <View style={{ ...styles.indicatorStyle, backgroundColor: page == 0 ? Colors.primaryYellow : Colors.gray }} />
      </View>
    )
  }

  return (
    <ViewPager
      style={{ ...styles.container, marginTop: 200 }}
      onPageSelected={e => setPage(e.nativeEvent.position)}
    // showPageIndicator={true} initialPage={0}
    >
      <SafeAreaView style={{ ...styles.container }} key="1">
        <Text style={styles.titleText}>{`  مرحبًا بك في نزل  `}</Text>
        <Image source={require('../../assets/splashicon.png')} />
        <Text style={styles.textlabel}>{`تصفح النزل بمختلف أنواعها و ميزاتها   و اﺧﺘﺮ ﻣﺎ ﻳﻨﺎﺳﺒﻚ`}</Text>
        {renderIndicator()}
        {renderSkipButton()}
      </SafeAreaView>
      <SafeAreaView style={styles.container} key="2">
        <Text style={styles.titleText}>{`  مرحبًا بك في نزل  `}</Text>
        <Image source={require('../../assets/splashicon.png')} />
        <Text style={styles.textlabel}>{`أضف نزلك و ﺷﺎركه اﻷﺧﺮﻳﻦ `}</Text>
        {renderIndicator()}
        {renderSkipButton()}
      </SafeAreaView>
      <SafeAreaView style={styles.container} key="3">
        <Text style={styles.titleText}>{` مرحبًا بك في نزل  `}</Text>
        <Image source={require('../../assets/splashicon.png')} />
        <Text style={styles.textlabel}>{`واستمتع`}</Text>
        {renderIndicator()}
        {renderSkipButton()}
      </SafeAreaView>
    </ViewPager>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  titleText: {
    fontSize: 30,
    color: Colors.primaryBlue,
    marginBottom: 16,
    // fontWeight: 'bold'
    fontFamily: 'tajawal_bold'
  },
  textlabel: {
    ...Fonts.fontLight,
    marginVertical: 24,
    color: Colors.primaryBlue,
    paddingHorizontal: '10%',
    textAlign: 'center',
    fontSize: 16,
  },
  indicatorStyle: {
    width: 7,
    height: 7,
    borderRadius: 14,
    backgroundColor: Colors.gray,
  }
});
