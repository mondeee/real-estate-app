import React, { useEffect, useState } from 'react';
import {
  I18nManager,
  StatusBar,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import Button from '../components/Button';
import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import { useStoreActions } from 'easy-peasy';
import * as Permissions from "expo-permissions";
import * as Location from 'expo-location';
import { useQuery } from '@apollo/react-hooks';
import { GET_DISTRICT, GET_SETTINGS } from '../services/graphql/queries';
import * as Notifications from 'expo-notifications';
export default function SplashScreen(props) {
  const { navigation: { navigate } } = props
  const [page, setPage] = useState(0)
  const storeNotifToken = useStoreActions(actions => actions.auth.setNotifToken)
  const storeLocation = useStoreActions(actions => actions.auth.setLocation)
  const storeDistricts = useStoreActions(actions => actions.auth.setDistricts)
  const storeSettings = useStoreActions(actions => actions.auth.setSettings)
  var hasToken = false
  const { error, data } = useQuery(GET_DISTRICT)
  const { data: settings_data } = useQuery(GET_SETTINGS)

  useEffect(() => {

    if (settings_data) {
      storeSettings(settings_data.allSettings)
    }

  }, [settings_data])

  const fetchToken = async () => {
    const token = await AsyncStorage.getItem('token')
    if (token && token?.length > 0) {
      hasToken = true
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

  const setUpLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        text: 'Location permission not granted',
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
    fetchToken()
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
    return (
      <Button
        onPress={() => hasToken ? navigate('Home') : navigate('Login')}
        text={`ابدأ`}
        style={{ width: 177 }}
        textStyle={{ fontFamily: 'tajawal_med' }}
      />
    )
  }

  renderIndicator = () => {
    return (
      <View style={{ flexDirection: 'row', alignSelf: 'center', padding: 24, paddingTop: 0, alignContent: 'center', justifyContent: 'center' }}>
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
        <Text style={styles.textlabel}>{`وﻭاﺳﺘﻤﺘﻊ`}</Text>
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
