import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';

import Modal from 'react-native-modal';

import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Styles from '../styles/Styles';
import Header from '../components/Header';
import Button from '../components/Button'
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useStoreActions, useStoreState } from 'easy-peasy';
import MapView from 'react-native-maps';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { getLocation } from 'graphql';
import { getLocationName } from '../utils/functions';

const { height, width } = Dimensions.get('window');
const LATITUDE_DELTA = 0.04
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

export default function MapComponent(props) {
  const {
    style,
    textStyle,
    onPress,
    child,
    text,
    determine,
    initialValue,
    isVisible,
    onClose,
    viewonly,
  } = props
  const [region, setRegion] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [location_name, setLocationName] = useState(null)
  const [ready, setReady] = useState(false)
  var timer = null

  //يرجى السماح لتطبيق نزل بالوصول إلى الموقع حتى تتمكن من إضافة موقع نزلك.

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

  if (viewonly) {
    return (
      <Modal style={styles.container} isVisible={isVisible}>
        <View style={styles.viewContainer}>
          <MapView
            // region={{
            //   ...initialValue,
            //   latitudeDelta: LATITUDE_DELTA,
            //   longitudeDelta: LONGITUDE_DELTA
            // }}
            onMapReady={ready => {
              console.log(ready)
              if (ready) {
                setReady(ready)
              }
            }}
            showsMyLocationButton={true}
            initialRegion={{
              // ...initialValue,
              latitude: parseFloat(initialValue?.latitude),
              longitude: parseFloat(initialValue?.longitude),
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }}
            style={{ flex: 1, borderRadius: 15 }} >
            <MapView.Marker
              coordinate={{
                latitude: Number(initialValue?.latitude) || 0,
                longitude: Number(initialValue?.longitude) || 0,
              }}
              pinColor="#253c7b"
            />
          </MapView>
          <View style={{ position: 'absolute', bottom: 10, width: '100%', padding: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Button onPress={() => {
              const daddr = `${Number(initialValue.latitude)},${Number(initialValue.longitude)}`
              const company = "google"//Platform.OS === "ios" ? "google" : "google";
              Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}`);
              onClose()
            }}
              style={{ maxWidth: 200 }}
              textStyle={{ color: Colors.primaryBlue }} text={`عرض في خرائط قوقل`} />
          </View>
          <TouchableOpacity style={global.isAndroid ? {
            height: 30,
            width: 30,
            position: 'absolute',
            top: 10,
            left: 10,
          } : {
              height: 30,
              width: 30,
              position: 'absolute',
              top: 10,
              right: 10
            }} onPress={() => {
              console.log('@CLOSE')
              onClose()
            }
            }>
            <MaterialIcons name={'close'} size={25} color={Colors.primaryBlue} />
          </TouchableOpacity>
          <Text style={global.isAndroid ? { position: 'absolute', top: 10, right: 10 } : { position: 'absolute', top: 10, left: 10 }}>{location_name}</Text>
          {/* <View style={{ position: 'absolute', top: '47%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name={'location-on'} size={35} color={Colors.primaryBlue} />
          </View> */}
        </View>
      </Modal>
    )
  }

  if (determine)
    return (
      <Modal style={styles.container} isVisible={isVisible}>
        <View style={styles.viewContainer}>
          <MapView
            initialRegion={{
              // ...initialValue,
              latitude: parseFloat(initialValue?.latitude),
              longitude: parseFloat(initialValue?.longitude),
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }}
            onRegionChange={e => {
              if (timer) clearTimeout(timer)
              timer = setTimeout(() => {
                setRegion(e)
              }, 1500)
            }} style={{ flex: 1, borderRadius: 15 }} />
          <View style={{ position: 'absolute', bottom: 10, width: '100%', padding: 10, alignItems: 'center', justifyContent: 'center' }}>
            {fetching ? <ActivityIndicator /> : <Button onPress={() => {
              const item = { ...region }
              item.location = location_name
              onPress(item)
              onClose()
            }} textStyle={{ color: Colors.primaryBlue }} text={`تحديد`} />}
          </View>
          <TouchableOpacity style={global.isAndroid ? {
            height: 30,
            width: 30,
            position: 'absolute',
            top: 10,
            left: 10,
          } : {
              height: 30,
              width: 30,
              position: 'absolute',
              top: 10,
              right: 10
            }} onPress={() => {
              console.log('@CLOSE')
              onClose()
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

  return (
    <Modal style={styles.container} isVisible={isVisible}>
      <View style={styles.viewContainer}>
        <MapView
          onRegionChange={e => {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
              setRegion(e)
            }, 1500)
          }} style={{ flex: 1, borderRadius: 15 }} />
        <View style={{ position: 'absolute', bottom: 10, width: '100%', padding: 10, alignItems: 'center', justifyContent: 'center' }}>
          {fetching ? <ActivityIndicator /> : <Button onPress={() => {
            const item = { ...region }
            item.location = location_name
            onPress(item)
            onClose()
          }} textStyle={{ color: Colors.primaryBlue }} text={`تحديد`} />}
        </View>
        <TouchableOpacity style={global.isAndroid ? {
          height: 30,
          width: 30,
          position: 'absolute',
          top: 10,
          left: 10,
        } : {
            height: 30,
            width: 30,
            position: 'absolute',
            top: 10,
            right: 10
          }} onPress={() => {
            console.log('@CLOSE')
            onClose()
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
