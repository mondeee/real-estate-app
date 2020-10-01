import {
  AsyncStorage
} from 'react-native'
import * as Location from 'expo-location';

export const getToken = async () => {
  const token = await AsyncStorage.getItem('token')
  console.log('token util', token != null, token)
  return token != null
}

export const getLocationName = async (data) => {
  // console.log("@TRIGGER", data)
  if (!data) return
  const copy = { ...data }
  const location = await Location.reverseGeocodeAsync(
    {
      latitude: Number(data.latitude),
      longitude: Number(data.longitude)
    }
  ).catch(e => {
    console.log('@ERROR GEOCODE', e)
  })
  copy.location = ''
  if (location) {
    const item = location[0]
    if (item) {
      if (!item.city || !item.country) {
        copy.location = `${item.name}, ${item.region || ''}`
      } else {
        copy.location = `${item.city}, ${item.country}`
      }
    }
  }
  return copy
}
