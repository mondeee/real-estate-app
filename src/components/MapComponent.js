import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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
  const [location_name, setLocationName] = useState(null)
  var timer = null

  //يرجى السماح لتطبيق نزل بالوصول إلى الموقع حتى تتمكن من إضافة موقع نزلك.

  useEffect(() => {
    getLocation(region)
  }, [region])

  const getLocation = async (data) => {
    if (!data) return
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
    return location
  }

  return (
    <Modal style={styles.container} isVisible={isVisible}>
      <View style={styles.viewContainer}>
        <MapView onRegionChange={e => {
          if (timer) clearTimeout(timer)

          timer = setTimeout(() => {
            setRegion(e)
          }, 1500)
        }} style={{ flex: 1, borderRadius: 15 }} />
        <View style={{ position: 'absolute', bottom: 10, width: '100%', padding: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Button onPress={() => {
            const item = { ...region }
            item.location = location_name
            onPress(item)
            onClose()
          }} style={{ backgroundColor: Colors.primaryBlue }} textStyle={{ color: Colors.primaryYellow }} text={`تحديد`} />
        </View>
        <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10 }} onPress={() => onClose()}>
          <MaterialIcons name={'close'} size={25} color={Colors.primaryBlue} />
        </TouchableOpacity>
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
    height: '60%',
  },
  viewContainer: {
    width: '90%',
    height: '50%',
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
