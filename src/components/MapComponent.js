import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  I18nManager
} from 'react-native';

import Modal from 'react-native-modal';

import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Styles from '../styles/Styles';
import Header from '../components/Header';
import Button from '../components/Button'
import { REGISTER } from '../services/graphql/queries'
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useStoreActions, useStoreState } from 'easy-peasy';
import MapView from 'react-native-maps';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Toast } from 'native-base';
import { ActivityIndicator } from 'react-native';

const { height, width } = Dimensions.get('window');
const LATITUDE_DELTA = 0.04
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
const isAndroid = Platform.OS === 'android' && I18nManager?.isRTL;

export default function MapComponent(props) {
  const {
    style,
    textStyle,
    onPress,
    child,
    text,
    isVisible,
    onClose,
  } = props
  const [region, setRegion] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [initialValue, setInitialValue] = useState({
    latitude: props.initialValue.latitude,
    longitude: props.initialValue.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  })
  const [location_name, setLocationName] = useState(null)
  var timer = null

  //يرجى السماح لتطبيق نزل بالوصول إلى الموقع حتى تتمكن من إضافة موقع نزلك.
  useEffect(() => {
    console.log('LOC', initialValue)
  }, [])

  useEffect(() => {
    setFetching(true)
    getLocation(region)
  }, [region])

  const getLocation = async (data) => {
    if (!data) {
      setFetching(false)
      return
    }
    const location = await Location.reverseGeocodeAsync(data).catch(e => {
      console.log('error', e)
    })
    console.log(location)
    const item = location[0]
    if (item) {
      if (!item.city || !item.country) {
        setLocationName(`${item.name}, ${item.region || ''}`)
      } else {
        setLocationName(`${item.city}, ${item.country}`)
      }
    }
    setFetching(false)
    return location
  }

  return (
    <Modal style={styles.container} isVisible={isVisible}>
      <View style={styles.viewContainer}>
        <MapView
          initialRegion={initialValue}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onRegionChange={e => {
            setRegion(null)
            // if (timer) clearTimeout(timer)
            // timer = setTimeout(() => {
            setRegion(e)
            // }, 1500)
          }} style={{ flex: 1, borderRadius: 15 }} />
        <View style={{ position: 'absolute', bottom: 10, width: '100%', padding: 10, alignItems: 'center', justifyContent: 'center' }}>
          {fetching || !region ? <ActivityIndicator /> : <Button onPress={() => {
            const item = { ...region }
            console.log(item)
            if (!item || !item.latitude || !item.longitude) {
              return
            }
            item.location = location_name
            onPress(item)
            onClose()
          }} style={{ backgroundColor: Colors.primaryBlue, }} textStyle={{ color: Colors.primaryBlue }} text={`تحديد`} />}
        </View>
        <TouchableOpacity style={{
          position: 'absolute',
          bottom: 50,
          right: global.isAndroid ? 0 : 10,
          left: global.isAndroid ? 10 : 0,
          backgroundColor: Colors.primaryYellow,
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center'
        }} onPress={() => {
          console.log(initialValue)
          setRegion(initialValue)
        }
        }>
          <MaterialIcons name={'my-location'} size={25} color={Colors.primaryBlue} />
        </TouchableOpacity>
        <TouchableOpacity style={global.isAndroid ? { position: 'absolute', top: 10, left: 10 } : { position: 'absolute', top: 10, right: 10 }} onPress={() => {
          if (region && location_name) {
            onClose()
          }
        }
        }>
          <MaterialIcons name={'close'} size={25} color={Colors.primaryBlue} />
        </TouchableOpacity>
        <Text style={global.isAndroid ? { position: 'absolute', top: 10, right: 10 } : { position: 'absolute', top: 10, left: 10 }}>{location_name}</Text>
        <View style={{ position: 'absolute', top: '47%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name={'location-on'} size={35} color={Colors.primaryBlue} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  viewContainer: {
    width: '90%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  button: {
    padding: 8,
    paddingHorizontal: 16,
    minWidth: 177,
    minHeight: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryYellow,
  },
  text: {
    color: Colors.primaryBlue,
    textAlign: 'center',
    fontSize: 22
  }
})
