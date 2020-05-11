import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import Header from '../components/Header';
import { SafeAreaView } from 'react-navigation';
import Input from '../components/Input';
import Button from '../components/Button';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts';
import AlertModal from '../components/AlertComponent';
import ActionComponent from '../components/ActionComponent';
import { REGISTER, onError } from '../services/graphql/queries'
import { useMutation } from '@apollo/react-hooks';

import {
  useStoreState,
  useStoreActions,
} from 'easy-peasy'


export default function RegisterScreen(props) {
  const { navigation: { navigate, goBack, } } = props

  const storeToken = useStoreActions(actions => actions.auth.setToken)

  const [alerVisible, setAlertVisible] = useState(false)
  const [verify, setVerify] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPass] = useState('')
  const [confirmPassword, setConfirmPass] = useState('')
  const [code, setCode] = useState('')
  const [isError, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [registerUser, { data, loading, error }] = useMutation(REGISTER, {
    onCompleted: e => {
      setVerify(true)
    }
  })

  useEffect(() => {
  }, [])
  // onPressRegister = () => {

  //   let error_msg = ''

  //   if (loading) return <ActivityIndicator />

  //   // if (error) {
  //   //   error.graphQLErrors.map(({ message, extensions }, i) => {
  //   //     console.log('Login Error', message)
  //   //     if (extensions && extensions.validation) {
  //   //       for (var key in extensions.validation) {
  //   //         if (extensions.validation.hasOwnProperty(key)) {
  //   //           console.log(key + " -> " + extensions.validation[key]);
  //   //           error_msg = error_msg + extensions.validation[key] + '\n'
  //   //         }
  //   //       }
  //   //     }
  //   //   })
  //   //   Alert.alert('Error', error_msg, [
  //   //     {
  //   //       text: 'OK', onPress: () => {
  //   //         setPass('')
  //   //         setConfirmPass('')
  //   //       }
  //   //     }
  //   //   ])
  //   // }

  //   if (data) {
  //     console.log(data)
  //     AsyncStorage.setItem('token', data.registerUser.token)
  //     setVerify(true)
  //   }

  //   if (!data) {
  //     return
  //   }
  // }

  if (data) {
    console.log(data)
    AsyncStorage.setItem('token', data.registerUser.token)
  }


  renderVerify = () => {
    return (
      <KeyboardAvoidingView keyboardVerticalOffset={20} behavior={"padding"} style={{ ...styles.container, marginTop: '15%' }}>
        <FontAwesome size={50} color={Colors.primaryBlue} name={'lock'} />
        <Text style={{ ...Fonts.FontMed, color: Colors.primaryBlue, fontSize: 20, margin: 12, }}>{`ﺮﻣز ﺎﻠﺘﻔﻌﻴﻟ`}</Text>
        <Text style={{ ...Fonts.fontRegular, color: Colors.primaryBlue, fontSize: 18 }} >{`ﺖﻣ إﺮﺳﺎﻟ ﺮﻣز ﺎﻠﺘﻔﻌﻴﻟ ﻞﺟوﺎﻠﻛ`}</Text>
        <Input textStyle={{ textAlign: 'center' }} style={{ margin: 15, marginTop: 24 }} />
        <Text style={{ ...Fonts.fontRegular, color: Colors.primaryBlue, fontSize: 13 }}>{`ﺈﻋادة ﺎﻟإﺮﺳﺎﻟ`}</Text>
        <Button style={{ marginTop: 30, width: 177 }} onPress={() => setAlertVisible(true)} text={`التالي`} />
      </KeyboardAvoidingView>
    )
  }

  renderRegister = () => {
    return (
      <View keyboardVerticalOffset={10} behavior={"position"} style={{ ...styles.container, }}>
        <Input onChangeText={setName} placeholder={`الاسم`} style={{ marginBottom: 30, marginTop: 50 }} rightIcon={'user'} />
        <Input onChangeText={setPhone} placeholder={`ﺮﻘﻣ ﺎﻠﺟوﺎﻟ`} style={{ marginBottom: 30 }} rightIcon={'phone'} maxLength={10} keyboardType={'numeric'} />
        <Input onChangeText={setPass} password placeholder={`ﻚﻠﻣة ﺎﻠﻣرور`} style={{ marginBottom: 30 }} rightIcon={'lock'} />
        <Input onChangeText={setConfirmPass} password placeholder={`تﺄﻜﻳد ﻚﻠﻣة ﺎﻠﻣرور`} style={{ marginBottom: 25 }} rightIcon={'lock'} />
        <Button onPress={() => {
          if (!name || !password || !phone) return
          if (password != confirmPassword) {
            Alert.alert('password does not match')
            return
          }
          registerUser({
            variables: {
              "input": {
                "avatar": null,
                "name": name,
                "phone": phone,
                "password": password,
                "password_confirmation": confirmPassword,
                "role_id": 2
              }
            }
          }).catch(e => {
            onError(e)
          });
        }} text={`تسجيل`} style={{ width: 177 }} />
        {/* {onPressRegister()} */}
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <View style={{ width: 4 }} />
          <Text onPress={() => navigate('Login')} style={{ color: Colors.primaryBlue, ...Fonts.fontRegular }}>
            {` لﺪﻴﻛ ﺢﺳﺎﺑ ﻢﺴﺒﻗا؟ `}
            <Text style={{ fontWeight: '500' }}>{`ﺲﺠﻟ ﻪﻧا`}</Text>
          </Text>
        </View>
      </View>
    )
  }

  onSubmitRegister = () => {

  }

  onPressBack = () => {
    if (verify) {
      setVerify(false)
      return
    }
    navigate('Home')
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView keyboardVerticalOffset={40} style={{ flex: 1 }} behavior={"padding"}>
        <Header onPressBack={onPressBack} />
        <ActionComponent success={true} isVisible={alerVisible} onClose={() => navigate('Home')} />
        {!verify && renderRegister()}
        {verify && renderVerify()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
});
