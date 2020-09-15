import React, { useEffect, useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Styles from '../styles/Styles';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';
import { UPDATE_USER, onError } from '../services/graphql/queries'
import { useMutation, useQuery } from '@apollo/react-hooks';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { useStoreState, useStoreActions } from 'easy-peasy';

import { ReactNativeFile } from 'apollo-upload-client'
import ActionComponent from '../components/ActionComponent';
import { IMAGE_URL } from '../services/api/url';



export default function EditProfileScreen(props) {
  const { navigate, goBack } = props.navigation

  const [image, setImage] = useState(null)
  const cities = useStoreState(state => state.auth.cities)
  const genderchoices = useStoreState(state => state.auth.genders)
  const userData = useStoreState(state => state.auth.user)
  const storeUser = useStoreActions(actions => actions.auth.setUser)
  // const [cities, setCities] = useState(null)
  // const [genderchoices, setGenderChoices] = useState(null)
  const [name, setName] = useState(null)
  const [phone, setPhone] = useState(null)
  const [email, setEmail] = useState(null)
  const [location, setLocation] = useState(null)
  const [gender, setGender] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPass, setConfirmPass] = useState(null)
  const [message, setMessage] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [updateUser, { data, loading, error }] = useMutation(UPDATE_USER, {
    onCompleted: e => {
      console.log(data, error)
      setMessage(true)
    }
  })

  //GRAPHQL
  // const { loading: cityloading, error: cityrror, data: citydata } = useQuery(GET_CITIES)
  // const { loading: cityloading, error: cityrror, data: citydata } = useQuery(GET_CITIES)

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  const _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setImage(result.uri)
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  const _onUpdateUser = async () => {
    if (!password || !confirmPass) {
      Alert.alert('Error', `Password is Required`)
      return
    }

    if (password != confirmPass) {
      Alert.alert('Error', `Password does not match`)
      return
    }

    const imageFile = new ReactNativeFile({
      uri: image,
      type: 'image/png',
      name: 'image.png'
    })

    const data = {
      variables: {
        "input": {
          "avatar": imageFile,
          "name": name,
          // "email": email,
          "phone": phone,
          "city_id": location.id,
          "gender_id": gender.id,
        }
      }
    }
    console.log('data', data)
    updateUser(data).catch(e => {
      onError(e)
    })
  }

  useEffect(() => {
    console.log('@LISTENER', data, error)
    if (data) {
      storeUser(data.updateUser)
    }
  }, [data, error])

  useEffect(() => {
    getPermissionAsync()
    if (userData) {
      console.log('@userdaa', userData, genderchoices)
      const sgender = genderchoices.filter(i => userData.gender.id === i.id)
      const scity = cities.filter(i => userData.city.id === i.id)
      setName(userData.name)
      setPhone(userData.phone)
      setEmail(userData.email)
      setGender(sgender[0].label)
      setLocation(scity[0].label)
      setImage(userData.avatar ? IMAGE_URL + userData.avatar : null)
      setFetching(false)
    } else {
      setFetching(false)
    }
  }, [])

  useEffect(() => {
    console.log('@SGENDER', gender)
  }, [gender])

  if (fetching) {
    return (
      <View style={{ ...styles.container, flex: 1 }}>
        <Header profile onPressBack={() => goBack()} />
        <View style={{ flex: 1, marginTop: 40 }}>
          <ActivityIndicator color={Colors.primaryBlue} />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header profile onPressBack={() => goBack()} />
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          backgroundColor: '#fff',
          width: '100%',
          alignItems: 'center',
        }}
        style={{
          flex: 1,
          backgroundColor: '#fff',
          width: '100%',
          paddingTop: 24,
          paddingHorizontal: 24,
        }}>
        <KeyboardAvoidingView style={{ flex: 1, width: '100%' }}
          keyboardVerticalOffset={200} behavior={"position"}>
          <TouchableOpacity onPress={() => _pickImage()} style={styles.imageUploader}>
            {image ?
              <Image style={styles.imageUploader} source={{ uri: image }} /> :
              <MaterialIcons size={35} color={Colors.primaryBlue} name='add-circle-outline' />}
          </TouchableOpacity>
          <Input value={name} onChangeText={setName} placeholder={`خالد`} style={{ marginTop: 20, marginBottom: 12 }} rightIcon={'user'} />
          <Input value={email} onChangeText={setEmail} placeholder={`الإيميل الإلكتروني `} style={{ marginBottom: 12 }} rightIcon={'envelope'} />
          <Input value={phone} maxLength={10} onChangeText={setPhone} placeholder={`0555555555`} style={{ marginBottom: 12 }} rightIcon={'phone'} />
          <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', }}>
            <Dropdown value={location} data={cities} onChangeText={setLocation} placeholder={`المدينة`} style={{ flex: 1, marginBottom: 12 }} rightIcon={require('../../assets/locationicon.png')} />
            <View style={{ width: 12 }} />
            <Dropdown value={gender} data={genderchoices} onChangeText={setGender} placeholder={`الجنس`} style={{ flex: 1, marginBottom: 12 }} rightIcon={require('../../assets/gendericon.png')} />
          </View>
          <Input onChangeText={setPassword} placeholder={`كلمة المرور`} style={{ marginBottom: 12 }} password rightIcon={'lock'} />
          <Input onChangeText={setConfirmPass} placeholder={`تأكيد كلمة المرور`} style={{ marginBottom: 12 }} password rightIcon={'lock'} />
          {!loading ? <Button onPress={() => _onUpdateUser()} style={{ width: '80%', alignSelf: 'center', marginTop: 12 }} text={`حفظ`} /> : <ActivityIndicator size={'large'} color={Colors.primaryBlue} />}
        </KeyboardAvoidingView>
      </ScrollView>
      <ActionComponent success={true} isVisible={message} onClose={() => setMessage(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  imageUploader: {
    width: 100,
    height: 100,
    borderRadius: 15,
    borderColor: Colors.gray,
    borderWidth: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
