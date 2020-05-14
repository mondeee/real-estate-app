import {
  AsyncStorage
} from 'react-native'

export const getToken = async () => {
  const token = await AsyncStorage.getItem('token')
  console.log('token util', token != null, token)
  return token != null
}
